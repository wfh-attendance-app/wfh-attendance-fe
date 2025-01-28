'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiConfig from '@/config/apiConfig';

import InputField from '@/components/auth/InputField';
import Button from '@/components/auth/Button';
import FormContainer from '@/components/auth/FormContainer';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee', // Employee as the default role
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${apiConfig.auth}/register`, formData);
      toast.success('🎉 Registration successful!', { position: 'top-right', theme: 'colored' });
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      toast.error('❌ ' + (err.response?.data?.error || 'Something went wrong!'), { position: 'top-right', theme: 'colored' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Register">
      <ToastContainer autoClose={3000} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        
        {/* Role Dropdown */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <Button type="submit" text={loading ? '🔄 Registering...' : '🚀 Register'} disabled={loading} />
      </form>
    </FormContainer>
  );
};

export default RegisterPage;
