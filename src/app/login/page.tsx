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

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${apiConfig.auth}/login`, formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      toast.success('🎉 Login successful!', { position: 'top-right', theme: 'colored' });
      setTimeout(() => router.push('/main'), 2000);
    } catch (err: any) {
      toast.error('❌ ' + (err.response?.data?.error || 'Invalid credentials!'), { position: 'top-right', theme: 'colored' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Login">
      <ToastContainer autoClose={3000} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <Button type="submit" text={loading ? '🔄 Logging in...' : '🚀 Login'} disabled={loading} />
      </form>
    </FormContainer>
  );
};

export default LoginPage;
