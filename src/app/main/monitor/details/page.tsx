'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";

interface EmployeeDetail {
    id: string;
    name: string;
    email: string;
    position: string;
    department: string;
    joined_at: string;
    status: string;
    address: string;
    phone: string;
    profile_photo_url: string;
  }

const EmployeeDetails = () => {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("id");
  
  const [employee, setEmployee] = useState<EmployeeDetail | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://35.232.21.216:4001/api/admin/employee/${employeeId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        setEmployee(response.data.employee);
      } catch (err) {
        setError("Failed to fetch employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (!employeeId) return <p className="text-red-500">No employee selected.</p>;
  if (loading) return <p>Loading employee details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <Header />
      <div className="p-6 max-w-3xl mx-auto bg-white text-black rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">{employee?.name}</h1>
        <p className="text-gray-600">{employee?.position}</p>
        <img src={employee?.profile_photo_url || "/default-profile.jpg"} alt={employee?.name} className="w-32 h-32 rounded-full mt-4" />
      </div>
    </div>
  );
};

export default EmployeeDetails;
