'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const id = searchParams.get("id"); // Extract the "id" from the query parameters
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
        setError(err.message || "Failed to fetch attendance records");
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [id]);

  if (loading) return <p>Loading attendance records...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance Records</h1>
      {attendance.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Photo</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Clock In</th>
              <th className="border border-gray-300 p-2">Clock Out</th>
              <th className="border border-gray-300 p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td className="border border-gray-300 p-2 text-center">
                  <img
                    src={record.photo_url}
                    alt={`Photo of ${record.user.name}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="border border-gray-300 p-2">{record.user.name}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(record.clock_in).toLocaleTimeString()}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(record.clock_out).toLocaleTimeString()}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(record.clock_in).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceDetails;
