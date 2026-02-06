import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import ImageUpload from './components/image-upload';
import FileUpload from './components/file-upload';
import FormActions from './components/forms-actions';

export default function LugaresEdit() {
  const [activeSection, setActiveSection] = useState('LUGARES');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    schedule: '',
    image: null,
    imagePreview: null,
    video: null,
    videoName: '',
    audio: null,
    audioName: ''
  });

  // Estado de validación
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    location: false,
    schedule: false
  });

  const menuItems = [
    { id: 'DASHBOARD', label: 'DASHBOARD' },
    { id: 'LANDING', label: 'LANDING' },
    { id: 'CATALOGO', label: 'CATALOGO' },
    { id: 'NOSOTROS', label: 'NOSOTROS' },
    { id: 'CONTACTANOS', label: 'CONTACTANOS' },
    { id: 'LUGARES', label: 'LUGARES' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        video: file,
        videoName: file.name
      });
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        audio: file,
        audioName: file.name
      });
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return value.trim().length >= 3;
      case 'description':
        return value.trim().length >= 10;
      case 'location':
        // Validar que tenga formato de coordenadas básico
        return value.trim().length > 0;
      case 'schedule':
        return value.trim().length > 0;
      default:
        return true;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Validar en tiempo real
    if (errors[field]) {
      setErrors({ ...errors, [field]: !validateField(field, value) });
    }
  };

  const handleBlur = (field) => {
    setErrors({ ...errors, [field]: !validateField(field, formData[field]) });
  };

  const isFormValid = () => {
    const nameValid = validateField('name', formData.name);
    const descriptionValid = validateField('description', formData.description);
    const locationValid = validateField('location', formData.location);
    const scheduleValid = validateField('schedule', formData.schedule);
    const imageValid = formData.image !== null;
    
    return nameValid && descriptionValid && locationValid && scheduleValid && imageValid;
  };

  const handleSubmit = () => {
    // Validar todos los campos
    const newErrors = {
      name: !validateField('name', formData.name),
      description: !validateField('description', formData.description),
      location: !validateField('location', formData.location),
      schedule: !validateField('schedule', formData.schedule)
    };
    
    setErrors(newErrors);
    
    if (!isFormValid()) {
      alert('Por favor completa todos los campos requeridos correctamente');
      return;
    }
    
    console.log('Form data:', formData);
    alert('¡Lugar guardado exitosamente!');
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      schedule: '',
      image: null,
      imagePreview: null,
      video: null,
      videoName: '',
      audio: null,
      audioName: ''
    });
    setErrors({
      name: false,
      description: false,
      location: false,
      schedule: false
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#FFE74C] via-[#FFE74C] to-[#3BCEAC] font-['Alata',sans-serif]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Alata&display=swap');
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
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
            LUGARES
          </h2>

          <ImageUpload 
            imagePreview={formData.imagePreview}
            onImageUpload={handleImageUpload}
          />

          <div className="mb-6">
            <input
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none transition-all ${
                errors.name 
                  ? 'ring-2 ring-red-500 focus:ring-red-500' 
                  : 'focus:ring-2 focus:ring-[#FF0063]'
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 font-medium ml-2">
                El nombre debe tener al menos 3 caracteres
              </p>
            )}
          </div>

          <div className="mb-6">
            <textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              rows={3}
              className={`w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none resize-none transition-all ${
                errors.description 
                  ? 'ring-2 ring-red-500 focus:ring-red-500' 
                  : 'focus:ring-2 focus:ring-[#FF0063]'
              }`}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 font-medium ml-2">
                La descripción debe tener al menos 10 caracteres
              </p>
            )}
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Ubicación (Coordenadas)"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              onBlur={() => handleBlur('location')}
              className={`w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none transition-all ${
                errors.location 
                  ? 'ring-2 ring-red-500 focus:ring-red-500' 
                  : 'focus:ring-2 focus:ring-[#FF0063]'
              }`}
            />
            {errors.location && (
              <p className="mt-2 text-sm text-red-600 font-medium ml-2">
                La ubicación es requerida
              </p>
            )}
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Horario"
              value={formData.schedule}
              onChange={(e) => handleInputChange('schedule', e.target.value)}
              onBlur={() => handleBlur('schedule')}
              className={`w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none transition-all ${
                errors.schedule 
                  ? 'ring-2 ring-red-500 focus:ring-red-500' 
                  : 'focus:ring-2 focus:ring-[#FF0063]'
              }`}
            />
            {errors.schedule && (
              <p className="mt-2 text-sm text-red-600 font-medium ml-2">
                El horario es requerido
              </p>
            )}
          </div>

          <FileUpload
            type="video"
            file={formData.video}
            fileName={formData.videoName}
            onFileUpload={handleVideoUpload}
          />

          <FileUpload
            type="audio"
            file={formData.audio}
            fileName={formData.audioName}
            onFileUpload={handleAudioUpload}
          />

          <FormActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}