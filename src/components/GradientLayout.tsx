const GradientLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      {children}
    </div>
  );
  
export default GradientLayout;