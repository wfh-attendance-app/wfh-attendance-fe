'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import apiConfig from "@/config/apiConfig";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<{ name: string, email: string, photo: string, role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${apiConfig.auth}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        setUser({
          name: userData.name,
          email: userData.email,
          photo: userData.photo || `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
          role: userData.role,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-gray-800 text-white py-3 px-6 flex justify-between items-center relative sticky top-0 z-50">
      {/* Navigation Menu */}
      <nav className="flex space-x-4">
        <a href="/main" className="hover:underline">Home</a>
        <a href="/main/attendance" className="hover:underline">Attendance</a>
        {user?.role === "admin" && (
          <a href="/main/monitor" className="hover:underline">Employees</a>
        )}
      </nav>

      {/* Profile Picture */}
      <div className="relative">
        <img
          src={user?.photo || "https://i.ibb.co.com/8DN9FtF/default-profile-photo.jpg"}
          alt={`Profile picture of ${user?.name || "User"}`}
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
          onClick={() => setShowDropdown(!showDropdown)}
          onKeyDown={(e) => e.key === "Enter" && setShowDropdown(!showDropdown)}
          tabIndex={0}
        />

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-auto bg-white shadow-lg rounded-lg py-2 text-gray-800">
            <p className="px-4 py-2 font-semibold">{user?.name || "User"}</p>
            <p className="px-4 py-2 font-semibold">{user?.email || "user@mail.com"}</p>
            <hr />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
