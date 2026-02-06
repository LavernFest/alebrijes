import React from 'react';

export default function CategoryCard({ image, title, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-105"
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300/FFE8D6/FF8800?text=' + title;
          }}
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          {title}
        </h3>
      </div>
    </div>
  );
}