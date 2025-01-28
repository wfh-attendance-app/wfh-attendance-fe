import React from 'react';

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
