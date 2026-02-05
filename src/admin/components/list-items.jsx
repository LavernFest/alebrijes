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
          className="bg-gradient-to-r from-[#FFA414] to-[#FF8800] hover:from-[#ff9000] hover:to-[#ff7700] text-white font-bold py-3 px-8 rounded-xl text-base sm:text-lg transition-all shadow-md"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="bg-gradient-to-r from-[#FF0063] to-[#d4004f] hover:from-[#e0005a] hover:to-[#b80044] text-white font-bold py-3 px-8 rounded-xl text-base sm:text-lg transition-all shadow-md"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}