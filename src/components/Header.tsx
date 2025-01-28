'use client';

import { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<{ name: string, email: string, photo: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://34.122.21.18:4000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        setUser({
          name: userData.name,
          email: userData.email,
          photo: userData.photo || `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
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
    <header className="w-full bg-gray-800 text-white py-3 px-6 flex justify-end relative sticky top-0 z-50">
      {/* Profile Picture */}
      <div className="relative">
        <img
          src={user?.photo || "https://ibb.co.com/MDZ7qQq"}
          alt={`Profile picture of ${user?.name || "User"}`}
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
          onClick={() => setShowDropdown(!showDropdown)}
          onKeyDown={(e) => e.key === "Enter" && setShowDropdown(!showDropdown)}
          tabIndex={0}
        />

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 text-gray-800">
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
