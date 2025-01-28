'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from '@/components/Header';
import apiConfig from "@/config/apiConfig";

const RoleValidationPage = () => {
  const [role, setRole] = useState<"employee" | "admin" | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user role from API
    const fetchRole = async () => {
      try {
        const response = await axios.get(`${apiConfig.auth}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) throw new Error("Failed to fetch user data");

        const data = response.data;
        setRole(data.role);
      } catch (err) {
        console.error("Error fetching role:", err);
        router.push("/login");
      }
    };

    fetchRole();
  }, [router]);

  return (
    <div className="h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <h2 className="text-2xl font-semibold mb-6">Welcome</h2>

        {role === "employee" && (
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded shadow-md hover:bg-blue-600 transition"
            onClick={() => router.push("/main/attendance")}
          >
            Record Attendance
          </button>
        )}

        {role === "admin" && (
          <div className="flex gap-4">
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded shadow-md hover:bg-blue-600 transition"
              onClick={() => router.push("/main/attendance")}
            >
              Record Attendance
            </button>

            <button
              className="bg-green-500 text-white px-6 py-3 rounded shadow-md hover:bg-green-600 transition"
              onClick={() => router.push("/main/monitor")}
            >
              Monitor Employees
            </button>
          </div>
        )}

        {role === null && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default RoleValidationPage;
