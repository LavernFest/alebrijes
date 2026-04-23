import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import ImageUpload from './components/image-upload';
import ComponentCheckbox from './components/checkbox';
import FormActions from './components/forms-actions';

//Reglas de validación
const VALIDATIONS = {
  header: {
    validate: (v) => v.trim().length >= 3 && v.trim().length <= 100,
    message: 'El header debe tener entre 3 y 100 caracteres.'
  },
  description: {
    validate: (v) => v.trim().length >= 10 && v.trim().length <= 500,
    message: 'La descripción debe tener entre 10 y 500 caracteres.'
  },
  image: {
    validate: (v) => v !== null,
    message: 'Debes subir una imagen para la landing.'
  }
};

const initialFormData = {
  image: null,
  imagePreview: null,
  header: '',
  description: '',
  components: {
    catalogo: true,
    lugares: true,
    nosotros: true,
    contactanos: true
  }
};

const initialComponentsList = [
  { id: 'catalogo',   label: 'Catalogo'   },
  { id: 'lugares',    label: 'Lugares'    },
  { id: 'nosotros',   label: 'Nosotros'   },
  { id: 'contactanos',label: 'Contactanos'}
];

export default function Landing() {
  const [activeSection, setActiveSection] = useState('LANDING');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [componentsList, setComponentsList] = useState(initialComponentsList);

  // Estado de errores: false = sin error / string = mensaje de error
  const [errors, setErrors] = useState({ header: false, description: false, image: false });
  // Flag para mostrar errores solo después del primer intento de submit
  const [submitted, setSubmitted] = useState(false);

  const menuItems = [
    { id: 'DASHBOARD',   label: 'DASHBOARD'   },
    { id: 'LANDING',     label: 'LANDING'     },
    { id: 'CATALOGO',    label: 'CATALOGO'    },
    { id: 'NOSOTROS',    label: 'NOSOTROS'    },
    { id: 'CONTACTANOS', label: 'CONTACTANOS' },
    { id: 'LUGARES',     label: 'LUGARES'     }
  ];

  // Validar un campo individual
  const validateField = (field, value) => {
    const rule = VALIDATIONS[field];
    if (!rule) return false;
    return rule.validate(value) ? false : rule.message;
  };

  // Validar todo el form
  const validateAll = () => {
    const newErrors = {
      header:      validateField('header',      formData.header),
      description: validateField('description', formData.description),
      image:       validateField('image',       formData.image)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = { ...formData, image: file, imagePreview: URL.createObjectURL(file) };
    setFormData(updated);
    if (submitted) setErrors((prev) => ({ ...prev, image: false }));
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleCheckboxChange = (componentName) => {
    setFormData((prev) => ({
      ...prev,
      components: { ...prev.components, [componentName]: !prev.components[componentName] }
    }));
  };

  //Drag & drop de checkboxes
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItem === null || draggedItem === index) return;

    const newList = [...componentsList];
    const item = newList.splice(draggedItem, 1)[0];
    newList.splice(index, 0, item);

    setComponentsList(newList);
    setDraggedItem(index);
  };

  const handleDragEnd = () => setDraggedItem(null);

  // Submit
  const handleSubmit = () => {
    setSubmitted(true);
    if (!validateAll()) return;

    const dataToSave = { ...formData, componentsOrder: componentsList };
    console.log('Form data:', dataToSave);
    alert('¡Datos guardados exitosamente!');
  };

  // Cancelar / reset
  const handleCancel = () => {
    setFormData(initialFormData);
    setComponentsList(initialComponentsList);
    setErrors({ header: false, description: false, image: false });
    setSubmitted(false);
  };

  // Helpers de UI
  const inputClass = (field) =>
    `w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
      errors[field]
        ? 'ring-2 ring-[#FF0063] bg-red-50'
        : 'focus:ring-[#FF0063]'
    }`;

  const charCount = (value, max) => (
    <span className={`text-xs ml-1 ${value.length > max ? 'text-[#FF0063] font-bold' : 'text-gray-400'}`}>
      {value.length}/{max}
    </span>
  );

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
            LANDING
          </h2>

          {/* Imagen */}
          <ImageUpload
            imagePreview={formData.imagePreview}
            onImageUpload={handleImageUpload}
            required
          />
          {errors.image && (
            <ErrorMessage message={errors.image} />
          )}

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-bold text-gray-600">Header {charCount(formData.header, 100)}</label>
            </div>
            <input
              type="text"
              placeholder="Header"
              value={formData.header}
              maxLength={120}
              onChange={(e) => handleFieldChange('header', e.target.value)}
              className={inputClass('header')}
            />
            {errors.header && <ErrorMessage message={errors.header} />}
          </div>

          {/*Descripción*/}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-bold text-gray-600">Descripción {charCount(formData.description, 500)}</label>
            </div>
            <textarea
              placeholder="Descripción"
              value={formData.description}
              maxLength={520}
              rows={4}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className={inputClass('description')}
            />
            {errors.description && <ErrorMessage message={errors.description} />}
          </div>

          {/*Componentes y orden*/}
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Componentes a mostrar y Orden
            </h3>
            <div className="space-y-3">
              {componentsList.map((component, index) => (
                <ComponentCheckbox
                  key={component.id}
                  component={component.label}
                  checked={formData.components[component.id]}
                  onChange={() => handleCheckboxChange(component.id)}
                  order={index + 1}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedItem === index}
                />
              ))}
            </div>
          </div>

          <FormActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}

// Mensaje de error
function ErrorMessage({ message }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-[#FF0063] text-sm font-semibold">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
}