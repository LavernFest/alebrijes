import React, { useState } from 'react';

export default function ValidatedInput({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  validation,
  errorMessage,
  maxLength
}) {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleBlur = () => {
    setTouched(true);
    if (validation) {
      setIsValid(validation(value));
    }
  };

  const handleChange = (e) => {
    let newValue = e.target.value;
    
    // Validación en tiempo real según el tipo
    if (type === 'phone') {
      // Solo permitir números
      newValue = newValue.replace(/[^0-9]/g, '');
    }
    
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    onChange(newValue);
    
    // Revalidar si ya fue tocado
    if (touched && validation) {
      setIsValid(validation(newValue));
    }
  };

  const showError = touched && !isValid && value.length > 0;

  return (
    <div className="mb-6">
      <input
        type={type === 'phone' ? 'tel' : type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={maxLength}
        className={`w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none transition-all ${
          showError 
            ? 'ring-2 ring-red-500 focus:ring-red-500' 
            : 'focus:ring-2 focus:ring-[#FF0063]'
        }`}
      />
      {showError && (
        <p className="mt-2 text-sm text-red-600 font-medium ml-2">
          {errorMessage}
        </p>
      )}
    </div>
  );
}