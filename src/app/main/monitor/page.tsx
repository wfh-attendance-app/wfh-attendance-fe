"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import apiConfig from "@/config/apiConfig";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  profile_photo_url: string;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const goToDetails = (employeeId: string) => {
    router.push(`/main/monitor/details?id=${employeeId}`);
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${apiConfig.admin}/employee`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.employees;
        setEmployees(data);
        setFilteredEmployees(data); // Initialize with all employees
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = employees.filter(
      (employee) =>
        (employee.name && employee.name.toLowerCase().includes(query.toLowerCase())) ||
        (employee.position && employee.position.toLowerCase().includes(query.toLowerCase())) ||
        (employee.department && employee.department.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredEmployees(filtered);
  };
  

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
        <p className="text-lg text-white animate-pulse">Loading employees...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
        <p className="text-red-200 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Employee Monitoring</h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, position, or department..."
            className="w-full max-w-md p-3 text-gray-800 rounded-lg shadow-md"
          />
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="p-6 bg-white bg-opacity-20 rounded-xl shadow-lg backdrop-blur-md cursor-pointer transform transition-all hover:scale-105 hover:bg-opacity-30 hover:shadow-2xl"
              onClick={() => goToDetails(employee.id)}
            >
              <div className="flex flex-col items-center">
                <img
                  src={employee.profile_photo_url || "https://i.ibb.co.com/8DN9FtF/default-profile-photo.jpg"}
                  alt={`${employee.name}'s photo`}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white transition-transform hover:scale-110"
                />
                <h2 className="text-xl font-semibold mt-4">{employee.name}</h2>
                <p className="text-indigo-200">
                  {employee.position || "No Position"} • {employee.department || "No Department"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Employees;
