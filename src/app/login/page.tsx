'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://34.122.21.18:4000/api/auth/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      toast.success('Login successful!', { position: 'top-right' });
      setTimeout(() => router.push('/'), 2000); // Redirect after 2 sec
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials!', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ToastContainer autoClose={3000} />
      <h1 className="text-2xl mb-4 font-semibold">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-lg rounded-lg">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border mx-2 px-4 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border mx-2 px-4 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
