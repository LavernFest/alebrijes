import React from 'react';

export default function ComponentCheckbox({ 
  component, 
  checked, 
  onChange, 
  order, 
  onDragStart, 
  onDragOver, 
  onDragEnd,
  isDragging 
}) {
  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`flex items-center justify-between bg-white rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all cursor-move ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-gray-400 cursor-grab active:cursor-grabbing">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </div>
        
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-6 h-6 rounded border-2 border-gray-300 text-[#6E2594] focus:ring-[#FF0063] cursor-pointer"
          />
        </label>
        <span className="text-lg sm:text-xl font-medium text-gray-800">
          {component}
        </span>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-600">
        {order}
      </div>
    </div>
  );
}