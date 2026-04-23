import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import ImageUpload from './components/image-upload';
import FormActions from './components/forms-actions';

// Reglas de validación
const VALIDATIONS = {
  description: {
    validate: (v) => v.trim().length >= 10 && v.trim().length <= 500,
    message: 'La descripción debe tener entre 10 y 500 caracteres.'
  },
  mision: {
    validate: (v) => v.trim().length >= 10 && v.trim().length <= 300,
    message: 'La misión debe tener entre 10 y 300 caracteres.'
  },
  vision: {
    validate: (v) => v.trim().length >= 10 && v.trim().length <= 300,
    message: 'La visión debe tener entre 10 y 300 caracteres.'
  },
  image: {
    validate: (v) => v !== null,
    message: 'Debes subir una imagen para esta sección.'
  }
};

const initialFormData = {
  image: null,
  imagePreview: null,
  description: '',
  mision: '',
  vision: ''
};

// Subcomponente mensaje de error 
function ErrorMessage({ message }) {
  return (
    <div className="mt-2 mb-4 flex items-center gap-2 text-[#FF0063] text-sm font-semibold">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

//Subcomponente textarea con validación 
function ValidatedTextarea({ placeholder, value, onChange, rows = 4, maxLength, error, charMax }) {
  return (
    <div>
      <div className="flex justify-end mb-1">
        <span className={`text-xs ${value.length > charMax ? 'text-[#FF0063] font-bold' : 'text-gray-400'}`}>
          {value.length}/{charMax}
        </span>
      </div>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        className={`w-full rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 resize-none transition-all ${
          error
            ? 'bg-red-50 ring-2 ring-[#FF0063]'
            : 'bg-gray-200 focus:ring-[#FF0063]'
        }`}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

//Componente principal 
export default function Nosotros() {
  const [activeSection, setActiveSection] = useState('NOSOTROS');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({ description: false, mision: false, vision: false, image: false });
  const [submitted, setSubmitted] = useState(false);

  const menuItems = [
    { id: 'DASHBOARD',   label: 'DASHBOARD'   },
    { id: 'LANDING',     label: 'LANDING'     },
    { id: 'CATALOGO',    label: 'CATALOGO'    },
    { id: 'NOSOTROS',    label: 'NOSOTROS'    },
    { id: 'CONTACTANOS', label: 'CONTACTANOS' },
    { id: 'LUGARES',     label: 'LUGARES'     }
  ];

  //Validar campo individual
  const validateField = (field, value) => {
    const rule = VALIDATIONS[field];
    return rule && !rule.validate(value) ? rule.message : false;
  };

  //Validar todo el form
  const validateAll = () => {
    const newErrors = {
      description: validateField('description', formData.description),
      mision:      validateField('mision',      formData.mision),
      vision:      validateField('vision',      formData.vision),
      image:       validateField('image',       formData.image)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  //Handlers
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    if (submitted) setErrors((prev) => ({ ...prev, image: false }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!validateAll()) return;
    console.log('Form data:', formData);
    alert('¡Datos guardados exitosamente!');
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({ description: false, mision: false, vision: false, image: false });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#FFE74C] via-[#FFE74C] to-[#3BCEAC] font-['Alata',sans-serif]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Alata&display=swap');
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        `}
      </style>

      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      />

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <DashboardHeader />

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8">
            NOSOTROS
          </h2>

          {/* Descripción */}
          <div className="mb-6">
            <ValidatedTextarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={4}
              maxLength={520}
              charMax={500}
              error={errors.description}
            />
          </div>

          {/* Misión */}
          <div className="mb-6">
            <ValidatedTextarea
              placeholder="Misión"
              value={formData.mision}
              onChange={(e) => handleFieldChange('mision', e.target.value)}
              rows={2}
              maxLength={320}
              charMax={300}
              error={errors.mision}
            />
          </div>

          {/* Visión */}
          <div className="mb-8">
            <ValidatedTextarea
              placeholder="Visión"
              value={formData.vision}
              onChange={(e) => handleFieldChange('vision', e.target.value)}
              rows={4}
              maxLength={320}
              charMax={300}
              error={errors.vision}
            />
          </div>

          {/* Imagen */}
          <ImageUpload
            imagePreview={formData.imagePreview}
            onImageUpload={handleImageUpload}
            required
          />
          {errors.image && <ErrorMessage message={errors.image} />}

          <FormActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}