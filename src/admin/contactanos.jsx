import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import ImageUpload from './components/image-upload';
import FormActions from './components/forms-actions';
import ValidatedInput from './components/validate-input';

// ── Reglas de validación ──────────────────────────────────────────────────────
const VALIDATIONS = {
  description: {
    validate: (v) => v.trim().length >= 10 && v.trim().length <= 500,
    message: 'La descripción debe tener entre 10 y 500 caracteres.'
  },
  phone: {
    validate: (v) => /^[0-9]{10}$/.test(v),
    message: 'El teléfono debe tener exactamente 10 dígitos.'
  },
  email: {
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: 'Ingresa un correo válido (ejemplo@dominio.com).'
  },
  facebook: {
    validate: (v) => v.trim() === '' || /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/.test(v),
    message: 'Ingresa una URL válida de Facebook (ej: https://facebook.com/tupagina).'
  },
  instagram: {
    validate: (v) => v.trim() === '' || /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/.test(v),
    message: 'Ingresa una URL válida de Instagram (ej: https://instagram.com/tuusuario).'
  },
  image: {
    validate: (v) => v !== null,
    message: 'Debes subir una imagen para esta sección.'
  }
};

const initialFormData = {
  description: '',
  phone: '',
  email: '',
  facebook: '',
  instagram: '',
  image: null,
  imagePreview: null
};

const initialErrors = {
  description: false,
  phone: false,
  email: false,
  facebook: false,
  instagram: false,
  image: false
};

// ── Subcomponente mensaje de error ────────────────────────────────────────────
function ErrorMessage({ message }) {
  return (
    <div className="mt-2 mb-2 flex items-center gap-2 text-[#FF0063] text-sm font-semibold">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export default function Contactanos() {
  const [activeSection, setActiveSection] = useState('CONTACTANOS');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [submitted, setSubmitted] = useState(false);

  const menuItems = [
    { id: 'DASHBOARD',   label: 'DASHBOARD'   },
    { id: 'LANDING',     label: 'LANDING'     },
    { id: 'CATALOGO',    label: 'CATALOGO'    },
    { id: 'NOSOTROS',    label: 'NOSOTROS'    },
    { id: 'CONTACTANOS', label: 'CONTACTANOS' },
    { id: 'LUGARES',     label: 'LUGARES'     }
  ];

  // ── Validar campo individual ──────────────────────────────────────────────
  const validateField = (field, value) => {
    const rule = VALIDATIONS[field];
    return rule && !rule.validate(value) ? rule.message : false;
  };

  // ── Validar todo el form ──────────────────────────────────────────────────
  const validateAll = () => {
    const newErrors = {
      description: validateField('description', formData.description),
      phone:       validateField('phone',       formData.phone),
      email:       validateField('email',       formData.email),
      facebook:    validateField('facebook',    formData.facebook),
      instagram:   validateField('instagram',   formData.instagram),
      image:       validateField('image',       formData.image)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
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
    setErrors(initialErrors);
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
            CONTACTANOS
          </h2>

          {/* ── Descripción ── */}
          <div className="mb-6">
            <div className="flex justify-end mb-1">
              <span className={`text-xs ${formData.description.length > 500 ? 'text-[#FF0063] font-bold' : 'text-gray-400'}`}>
                {formData.description.length}/500
              </span>
            </div>
            <textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              maxLength={520}
              className={`w-full rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 resize-none transition-all ${
                errors.description
                  ? 'bg-red-50 ring-2 ring-[#FF0063]'
                  : 'bg-gray-200 focus:ring-[#FF0063]'
              }`}
            />
            {errors.description && <ErrorMessage message={errors.description} />}
          </div>

          {/* ── Teléfono ── */}
          <ValidatedInput
            type="phone"
            placeholder="Teléfono (10 dígitos)"
            value={formData.phone}
            onChange={(value) => handleFieldChange('phone', value)}
            validation={VALIDATIONS.phone.validate}
            errorMessage={VALIDATIONS.phone.message}
            maxLength={10}
            forceError={submitted && !!errors.phone}
          />

          {/* ── Email ── */}
          <ValidatedInput
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(value) => handleFieldChange('email', value)}
            validation={VALIDATIONS.email.validate}
            errorMessage={VALIDATIONS.email.message}
            forceError={submitted && !!errors.email}
          />

          {/* ── Facebook (opcional) ── */}
          <ValidatedInput
            type="text"
            placeholder="https://facebook.com/tupagina  (opcional)"
            value={formData.facebook}
            onChange={(value) => handleFieldChange('facebook', value)}
            validation={VALIDATIONS.facebook.validate}
            errorMessage={VALIDATIONS.facebook.message}
            forceError={submitted && !!errors.facebook}
          />

          {/* ── Instagram (opcional) ── */}
          <ValidatedInput
            type="text"
            placeholder="https://instagram.com/tuusuario  (opcional)"
            value={formData.instagram}
            onChange={(value) => handleFieldChange('instagram', value)}
            validation={VALIDATIONS.instagram.validate}
            errorMessage={VALIDATIONS.instagram.message}
            forceError={submitted && !!errors.instagram}
          />

          {/* ── Imagen ── */}
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