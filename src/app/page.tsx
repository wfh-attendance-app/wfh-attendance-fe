'use client';

import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to WFH Attendance</h1>
      <p className="text-lg mb-8">Effortlessly manage attendance for remote teams.</p>
      <div className="space-x-4">
        <button
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition"
          onClick={() => router.push('/login')}
        >
          Login
        </button>
        <button
          className="bg-indigo-700 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-800 transition"
          onClick={() => router.push('/register')}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
