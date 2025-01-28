'use client';

import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import axios from "axios";
import apiConfig from "@/config/apiConfig";

const AttendanceTracker = () => {
  const [attendanceStatus, setAttendanceStatus] = useState<"clocked_in" | "clocked_out" | "not_recorded" | null>(null);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchAttendanceStatus = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${apiConfig.attendance}/status`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) throw new Error("Failed to fetch attendance status");

      const data = response.data;
      setAttendanceStatus(data.status);
      setClockInTime(data.clock_in_time || null);
      setClockOutTime(data.clock_out_time || null);
    } catch (err) {
      toast.error("❌ Failed to fetch attendance status", { position: "top-right", theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, [token]);

  useEffect(() => {
    // Set the initial time on the client
    setCurrentTime(new Date());

    // Update the time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const startCamera = async () => {
    setShowCamera(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        canvasRef.current.toBlob(blob => {
          if (blob) {
            setPhoto(new File([blob], "attendance_photo.jpg", { type: "image/jpeg" }));
          }
        }, "image/jpeg");
      }
    }
    setShowCamera(false);
  };

  const handleClockIn = async () => {
    if (!token) {
      toast.error("❌ No authentication token found.", { position: "top-right", theme: "colored" });
      return;
    }
    if (!photo) {
      toast.error("Please take a photo before clocking in.", { position: "top-right", theme: "colored" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("photo", photo);

      const response = await axios.post(
        `${apiConfig.attendance}/clock-in`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setAttendanceStatus("clocked_in");
      setClockInTime(data.attendance.clock_in);
      fetchAttendanceStatus();
    } catch (err) {
      toast.error("❌ Failed to clock in", { position: "top-right", theme: "colored" });
    } finally {
      toast.success("You have clocked in succesfully", { position: "top-right", theme: "colored" });
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!token) {
      toast.error("❌ No authentication token found.", { position: "top-right", theme: "colored" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiConfig.attendance}/clock-out`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setAttendanceStatus("clocked_out");
      setClockOutTime(data.attendance.clock_out);
      fetchAttendanceStatus();
    } catch (err) {
      toast.error("❌ Failed to clock out", { position: "top-right", theme: "colored" });
    } finally {
      toast.success("You have clocked out succesfully", { position: "top-right", theme: "colored" });
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString("en-GB"); // Use a consistent locale
  const formatTime = (time: string | null) =>
    time ? new Date(time).toLocaleTimeString("en-GB") : "-";

  return (
    <div className="h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <ToastContainer autoClose={3000} />
        <h2 className="text-2xl font-semibold mb-4">Attendance Tracker</h2>
        <h3 className="text-xl font-semibold mb-4">{currentTime ? currentTime.toLocaleTimeString() : "Loading..."}</h3>

        {/* Attendance Table */}
        <table className="border-collapse border border-gray-300 bg-white shadow-lg rounded-lg w-3/4 mt-6">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Clock In Time</th>
              <th className="border border-gray-300 px-4 py-2">Clock Out Time</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center bg-gray-200 text-black">
              <td className="border border-gray-300 px-4 py-2">{currentTime ? formatDate(currentTime) : "-"}</td>
              <td className="border border-gray-300 px-4 py-2">{formatTime(clockInTime)}</td>
              <td className="border border-gray-300 px-4 py-2">{formatTime(clockOutTime)}</td>
              <td className="border border-gray-300 px-4 py-2">{attendanceStatus?.replace("_", " ") || "-"}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex my-5 flex-col items-center">
          {loading ? (
            <button className="bg-gray-500 text-white px-4 py-2 rounded" disabled>Loading...</button>
          ) : attendanceStatus === "not_recorded" ? (
            <>
              {showCamera ? (
                <div className="flex flex-col items-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-64 h-48 border border-gray-300 rounded-md"
                  ></video>
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                    width={640}
                    height={480}
                  ></canvas>
                  <button
                    onClick={capturePhoto}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
                  >
                    Capture Photo
                  </button>
                </div>
              ) : (
                <>
                  {photo ? (
                    <img src={URL.createObjectURL(photo)} alt="Captured" className="w-32 h-32 border rounded-md" />
                  ) : (
                    <button onClick={startCamera} className="bg-gray-500 text-white px-6 py-3 rounded shadow-md hover:bg-gray-600 transition">
                      Open Camera
                    </button>
                  )}
                  <button onClick={handleClockIn} className="mt-2 bg-green-500 text-white px-6 py-3 rounded shadow-md hover:bg-green-600 transition">
                    Clock In
                  </button>
                </>
              )}
            </>
          ) : attendanceStatus === "clocked_in" ? (
            <button onClick={handleClockOut} className="bg-red-500 text-white px-6 py-3 rounded shadow-md hover:bg-red-600 transition">
              Clock Out
            </button>
          ) : (
            <p className="text-lg">You've already recorded attendance today.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
