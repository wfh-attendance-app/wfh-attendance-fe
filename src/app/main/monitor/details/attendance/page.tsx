'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import axios from "axios";
import apiConfig from "@/config/apiConfig";
import {Suspense} from "react";

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
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id) return;

    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `${apiConfig.admin}/attendance/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAttendance(response.data.attendance);
        setFilteredAttendance(response.data.attendance);
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

  useEffect(() => {
    let filtered = attendance;

    if (dateStart && dateEnd) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.clock_in).toISOString().split("T")[0];
        return recordDate >= dateStart && recordDate <= dateEnd;
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(record => {
        if (statusFilter === "clocked_in") return record.clock_out === null;
        if (statusFilter === "clocked_out") return record.clock_out !== null;
        return true;
      });
    }

    setFilteredAttendance(filtered);
  }, [dateStart, dateEnd, statusFilter, attendance]);

  if (loading)
    return <p className="text-center text-white text-xl mt-10">Loading attendance records...</p>;
  if (error)
    return <p className="text-center text-red-400 text-xl mt-10">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex flex-col items-center">
      <Header />
      <div className="w-full max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Attendance Records</h1>

        {attendance.length > 0 && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold">{attendance[0]?.user.name}</h2>
            <p className="text-lg">
              {attendance[0]?.user.position || "No Position"} • {attendance[0]?.user.department || "No Department"}
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {/* Start Date Filter */}
          <div className="flex flex-col text-black">
            <label className="text-white mb-1 font-medium">Start Date</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="px-4 py-1 border rounded-md"
            />
          </div>

          {/* End Date Filter */}
          <div className="flex flex-col text-black">
            <label className="text-white mb-1 font-medium">End Date</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="px-4 py-1 border rounded-md"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col text-black">
            <label className="text-white mb-1 font-medium">Attendance Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Records</option>
              <option value="clocked_in">Clocked In Only</option>
              <option value="clocked_out">Clocked Out Only</option>
            </select>
          </div>
        </div>


        {filteredAttendance.length === 0 ? (
          <p className="text-center text-xl">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
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
                {filteredAttendance.map((record) => (
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

const Page = () => {
  return (
    <Suspense>
      <AttendanceDetails/>
    </Suspense>
  )
}

export default Page;
