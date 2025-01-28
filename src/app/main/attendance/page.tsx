'use client';

import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect, useRef } from "react";

const AttendanceTracker = () => {
    const [attendanceStatus, setAttendanceStatus] = useState<"clocked_in" | "clocked_out" | "not_recorded" | null>(null);
    const [clockInTime, setClockInTime] = useState<string | null>(null);
    const [clockOutTime, setClockOutTime] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [showCamera, setShowCamera] = useState(false);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const fetchAttendanceStatus = async () => {
        if (!token) {
            toast.error('❌ ' + "No authentication token found.", { position: 'top-right', theme: 'colored' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://35.193.28.139:4002/api/employee/attendance/status", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch attendance status");

            const data = await response.json();
            if (data.status === "clocked_in") {
                setAttendanceStatus("clocked_in");
                setClockInTime(data.clock_in_time);
            } else if (data.status === "clocked_out") {
                setAttendanceStatus("clocked_out");
                setClockInTime(data.clock_in_time);
                setClockOutTime(data.clock_out_time);
            } else {
                setAttendanceStatus("not_recorded");
            }
        } catch (err) {
            toast.error('❌ ' + "Failed to fetch attendance status", { position: 'top-right', theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceStatus();
    }, [token]);

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
            toast.error('❌ ' + "No authentication token found.", { position: 'top-right', theme: 'colored' });
            return;
        }
        if (!photo) {
            toast.error("Please take a photo before clocking in.", { position: 'top-right', theme: 'colored' });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("photo", photo);

            const response = await fetch("http://35.193.28.139:4002/api/employee/attendance/clock-in", { 
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Clock-in failed");

            const data = await response.json();
            setAttendanceStatus("clocked_in");
            setClockInTime(data.attendance.clock_in);

            fetchAttendanceStatus();
        } catch (err) {
            toast.error('❌ ' + "Failed to clock in", { position: 'top-right', theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async () => {
        if (!token) {
          toast.error('❌ ' + "No authentication token found.", { position: 'top-right', theme: 'colored' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://35.193.28.139:4002/api/employee/attendance/clock-out", { 
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Clock-out failed");

            const data = await response.json();
            setAttendanceStatus("clocked_out");
            setClockOutTime(data.attendance.clock_out);

            fetchAttendanceStatus();
        } catch (err) {
            toast.error('❌ ' + "Failed to clock out", { position: 'top-right', theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <ToastContainer autoClose={3000} />
            <h2 className="text-3xl font-semibold mb-6">Attendance Tracker</h2>
            
            {loading ? (
                <button className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md opacity-70" disabled>
                    Loading...
                </button>
            ) : attendanceStatus === "not_recorded" ? (
                <>
                    {showCamera ? (
                        <div className="flex flex-col items-center">
                            <video ref={videoRef} autoPlay className="w-64 h-48 border border-gray-300 rounded-lg shadow-md"></video>
                            <button 
                                onClick={capturePhoto} 
                                className="mt-3 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
                            >
                                Capture Photo
                            </button>
                        </div>
                    ) : (
                        <>
                            {photo ? (
                                <img src={URL.createObjectURL(photo)} alt="Captured" className="w-32 h-32 border border-white rounded-lg shadow-md" />
                            ) : (
                                <button 
                                    onClick={startCamera} 
                                    className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition"
                                >
                                    Open Camera
                                </button>
                            )}
                            <button 
                                onClick={handleClockIn} 
                                className="mt-3 bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
                            >
                                Clock In
                            </button>
                        </>
                    )}
                </>
            ) : attendanceStatus === "clocked_in" ? (
                <div className="text-center">
                    <p className="text-lg mb-4">You clocked in at {clockInTime ? new Date(clockInTime).toLocaleTimeString() : "N/A"}</p>
                    <button 
                        onClick={handleClockOut} 
                        className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        Clock Out
                    </button>
                </div>
            ) : (
                <p className="text-lg text-gray-200">You've already recorded attendance today.</p>
            )}

            <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>
        </div>
    );
};

export default AttendanceTracker;
