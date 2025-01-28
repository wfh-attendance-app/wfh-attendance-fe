'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import axios from "axios";

interface AttendanceRecord {
  id: number;
  user_id: number;
  photo_url: string;
  clock_in: string;
  clock_out: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    position: string | null;
    department: string | null;
  };
}

const AttendanceDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id) return;

    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `http://35.232.21.216:4001/api/admin/attendance/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAttendance(response.data.attendance);
        setLoading(false);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError("No attendance records found for this employee.");
        } else {
          setError(err.message || "Failed to fetch attendance records");
        }
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [id]);

  if (loading)
    return <p className="text-center text-white text-xl mt-10">Loading attendance records...</p>;
  if (error)
    return <p className="text-center text-red-400 text-xl mt-10">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex flex-col items-center">
      <Header />
      <div className="w-full max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Attendance Records</h1>
        {attendance.length === 0 ? (
          <p className="text-center text-xl">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl text-black font-semibold">{attendance[0]?.user.name}</h2>
              <p className="text-lg text-gray-900">
                {attendance[0]?.user.position || "No Position"} • {attendance[0]?.user.department || "No Department"}
              </p>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-500 text-white">
                  <th className="p-3">Photo</th>
                  <th className="p-3">Clock In</th>
                  <th className="p-3">Clock Out</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id} className="text-black bg-gray-100 border-b hover:bg-gray-200 transition">
                    <td className="p-3 text-center">
                      <div className="flex justify-center">
                        <img
                          src={record.photo_url}
                          alt={`Photo of ${record.user.name}`}
                          className="w-40 h-40 object-cover border-2 border-indigo-400"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {new Date(record.clock_in).toLocaleTimeString()}
                    </td>
                    <td className="p-3 text-center">
                      {record.clock_out ? new Date(record.clock_out).toLocaleTimeString() : "—"}
                    </td>
                    <td className="p-3 text-center">
                      {new Date(record.clock_in).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDetails;
