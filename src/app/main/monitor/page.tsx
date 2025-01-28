'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from '@/components/Header';

interface Employee {
  id: string;
  name: string;
  position: string;
  photo: string;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://35.232.21.216:4001/api/admin/employee", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.employees;
        setEmployees(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Employee Monitoring</h1>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {employees.map((employee) => (
            <li
              key={employee.id}
              className="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:bg-gray-200"
              onClick={() => router.push(`/employees/${employee.id}`)}
            >
              <img
                src={employee.photo || "https://i.ibb.co.com/8DN9FtF/default-profile-photo.jpg"}
                alt={`${employee.name}'s photo`}
                className="w-16 h-16 rounded-full mb-2"
              />
              <h2 className="text-lg text-black font-semibold">{employee.name}</h2>
              <p className="text-gray-600">{employee.position}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Employees;
