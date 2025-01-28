"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import { ToastContainer, toast } from 'react-toastify';
import apiConfig from "@/config/apiConfig";
import {Suspense} from "react";

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

  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [originalEmployee, setOriginalEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${apiConfig.admin}/employee/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployee(response.data.employee);
        setOriginalEmployee(response.data.employee); // Store original data
      } catch (err: any) {
        setError("Failed to fetch employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!employee) return;
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  // Check if data was changed
  const hasChanges = JSON.stringify(employee) !== JSON.stringify(originalEmployee);

  const handleSave = async () => {
    if (!employee) return;

    try {
      await axios.put(
        `${apiConfig.admin}/employee/${employee.id}`,
        {
          name: employee.name,
          position: employee.position,
          department: employee.department,
          joined_at: employee.joined_at,
          status: employee.status,
          address: employee.address,
          phone: employee.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOriginalEmployee(employee); // Update original data after saving
      toast.success("Employee updated successfully!", { position: 'top-right', theme: 'colored' })
    } catch (err) {
      toast.error("❌ Failed to update employee.", { position: 'top-right', theme: 'colored' })
    }
  };

  if (loading) return <p>Loading employee details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <Header />
      <ToastContainer autoClose={3000} />
      <div className="max-w-3xl mx-auto bg-white text-black rounded-lg shadow-lg p-6 mt-8">
        <div className="flex items-center gap-4">
          <img src={employee?.profile_photo_url || "/default-profile.jpg"} alt={employee?.name} className="w-24 h-24 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold">{employee?.name}</h1>
            <p className="text-gray-600">{employee?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block font-medium">Position</label>
            <input
              type="text"
              name="position"
              value={employee?.position || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={employee?.department || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Joined At</label>
            <input
              type="date"
              name="joined_at"
              value={employee?.joined_at ? employee.joined_at.split("T")[0] : ""}
              onChange={handleChange} // Added an onChange handler
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={employee?.status || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={employee?.address || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={employee?.phone || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>


        <div className="mt-6 flex gap-4">
          {hasChanges && (
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          )}

          <button
            onClick={() => router.push(`/main/monitor/details/attendance?id=${employee?.id}`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            View Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense>
      <EmployeeDetails/>
    </Suspense>
  )
}

export default Page;