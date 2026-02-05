import React from 'react';

export default function ManagementCard({ title, index, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-[#FFA414] to-[#FF8800] text-white rounded-xl lg:rounded-2xl py-6 sm:py-8 px-4 sm:px-6 text-lg sm:text-xl lg:text-2xl font-bold shadow-lg card-hover fade-in-up"
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      {title}
    </button>
  );
}