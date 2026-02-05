import React from 'react';

export default function FormActions({ onCancel, onSubmit, cancelText = 'Cancelar', submitText = 'Guardar' }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <button
        onClick={onCancel}
        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-8 rounded-2xl text-lg sm:text-xl transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={onSubmit}
        className="flex-1 bg-gradient-to-r from-[#6E2594] to-[#FF0063] hover:from-[#5a1d7a] hover:to-[#d4004f] text-white font-bold py-4 px-8 rounded-2xl text-lg sm:text-xl transition-all shadow-lg"
      >
        {submitText}
      </button>
    </div>
  );
}