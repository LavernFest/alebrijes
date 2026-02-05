import React from 'react';

export default function DashboardHeader() {
  return (
    <header className="hidden lg:flex justify-between items-center mb-12">
      <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 tracking-tight">
        Admin Dashboard
      </h1>
      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
        <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
    </header>
  );
}