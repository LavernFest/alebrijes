import React from 'react';

export default function ListItem({ name, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all mb-4">
      <h3 className="text-xl sm:text-2xl font-medium text-gray-800">
        {name}
      </h3>
      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="bg-[#FFA414] hover:bg-[#ff9000] text-white font-bold py-3 px-8 rounded-xl text-base sm:text-lg transition-all shadow-md"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="bg-[#FF0063] hover:bg-[#e0005a] text-white font-bold py-3 px-8 rounded-xl text-base sm:text-lg transition-all shadow-md"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}