'use client';

import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to WFH Attendance</h1>
      <p className="text-lg mb-10 text-center">Effortlessly manage attendance for remote teams.</p>

      {/* Auth Buttons */}
      <div className="flex space-x-6 mb-6">
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

      {/* Separator */}
      <div className="flex items-center w-full max-w-xs mb-6">
        <hr className="flex-grow border-white opacity-30" />
        <span className="px-3 text-white text-sm opacity-80">or</span>
        <hr className="flex-grow border-white opacity-30" />
      </div>

      {/* Identify Button */}
      <div>
        <button
          className="bg-green-500 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-600 transition"
          onClick={() => router.push('/identify')}
        >
          Identify Face
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
