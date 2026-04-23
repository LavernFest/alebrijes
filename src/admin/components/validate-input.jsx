import React, { useState, useEffect } from 'react';

export default function ValidatedInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  validation,
  errorMessage,
  maxLength,
  forceError = false   // ← permite que el padre fuerce el estado de error (ej: al hacer submit)
}) {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // Si el padre fuerza el error (submit), marcamos como tocado
  useEffect(() => {
    if (forceError) {
      setTouched(true);
      setIsValid(false);
    }
  }, [forceError]);

  // Si el valor cambia y ya estaba en error, revalidar
  useEffect(() => {
    if (touched && validation) {
      setIsValid(validation(value));
    }
  }, [value]);

  const handleBlur = () => {
    setTouched(true);
    if (validation) setIsValid(validation(value));
  };

  const handleChange = (e) => {
    let newValue = e.target.value;

    // Solo números para teléfono
    if (type === 'phone') {
      newValue = newValue.replace(/[^0-9]/g, '');
    }

    if (maxLength && newValue.length > maxLength) return;

    onChange(newValue);
  };

  // Mostrar error: si fue tocado, no es válido, y hay algo escrito (o se forzó el error)
  const showError = touched && !isValid && (value.length > 0 || forceError);

  return (
    <div className="mb-6">
      <input
        type={type === 'phone' ? 'tel' : type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={maxLength}
        className={`w-full rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none transition-all ${
          showError
            ? 'bg-red-50 ring-2 ring-[#FF0063] focus:ring-[#FF0063]'
            : 'bg-gray-200 focus:ring-2 focus:ring-[#FF0063]'
        }`}
      />
      {showError && (
        <div className="mt-2 flex items-center gap-2 text-[#FF0063] text-sm font-semibold">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}