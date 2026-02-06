import React from 'react';

export default function ProductCard({ image, name, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group flex-shrink-0 w-64 sm:w-72"
    >
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#FFE8D6] to-[#FFF8E7]">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400/FFE8D6/FF8800?text=' + name;
          }}
        />
      </div>
      <div className="p-4 sm:p-6 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
          {name}
        </h3>
      </div>
    </div>
  );
}