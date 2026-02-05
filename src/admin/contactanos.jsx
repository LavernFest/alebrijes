import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import ImageUpload from './components/image-upload';
import FormActions from './components/forms-actions';
import ValidatedInput from './components/validate-input';
export default function Contactanos() {
  const [activeSection, setActiveSection] = useState('CONTACTANOS');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    description: '',
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
    image: null,
    imagePreview: null
  });

  // Estado de validación
  const [formErrors, setFormErrors] = useState({
    phone: false,
    email: false,
    facebook: false,
    instagram: false
  });

  const menuItems = [
    { id: 'DASHBOARD', label: 'DASHBOARD' },
    { id: 'LANDING', label: 'LANDING' },
    { id: 'CATALOGO', label: 'CATALOGO' },
    { id: 'NOSOTROS', label: 'NOSOTROS' },
    { id: 'CONTACTANOS', label: 'CONTACTANOS' },
    { id: 'LUGARES', label: 'LUGARES' }
  ];

  // Funciones de validación
  const validatePhone = (phone) => {
    // Validar que sea un número de 10 dígitos
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    // Validar formato de email con @ y dominio
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFacebook = (facebook) => {
    // Validar URL de Facebook 
    if (facebook.trim() === '') return true;
    const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/;
    return facebookRegex.test(facebook);
  };

  const validateInstagram = (instagram) => {
    // Validar URL de Instagram
    if (instagram.trim() === '') return true;
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
    return instagramRegex.test(instagram);
  };

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

  const isFormValid = () => {
    return (
      formData.description.trim() !== '' &&
      validatePhone(formData.phone) &&
      validateEmail(formData.email) &&
      validateFacebook(formData.facebook) &&
      validateInstagram(formData.instagram) &&
      formData.image !== null
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }
    
    console.log('Form data:', formData);
    alert('¡Datos guardados exitosamente!');
  };

  const handleCancel = () => {
    setFormData({
      description: '',
      phone: '',
      email: '',
      facebook: '',
      instagram: '',
      image: null,
      imagePreview: null
    });
    setFormErrors({
      phone: false,
      email: false,
      facebook: false,
      instagram: false
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

      {/* Mobile Header */}
      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      />

      {/* Desktop Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Desktop Header */}
        <DashboardHeader />

        {/* Contactanos Form */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8">
            CONTACTANOS
          </h2>

          {/* Description Input */}
          <div className="mb-6">
            <textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0063] resize-none"
            />
          </div>

          {/* Phone Input */}
          <ValidatedInput
            type="phone"
            placeholder="72222457894"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            validation={validatePhone}
            errorMessage="El teléfono debe tener 10 dígitos"
            maxLength={10}
          />

          {/* Email Input */}
          <ValidatedInput
            type="email"
            placeholder="Correo"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            validation={validateEmail}
            errorMessage="Ingresa un correo válido (ejemplo@dominio.com)"
          />

          {/* Facebook Input */}
          <ValidatedInput
            type="text"
            placeholder="https://facebook.com/tupagina"
            value={formData.facebook}
            onChange={(value) => setFormData({ ...formData, facebook: value })}
            validation={validateFacebook}
            errorMessage="Ingresa una URL válida de Facebook (ej: https://facebook.com/tupagina)"
          />

          {/* Instagram Input */}
          <ValidatedInput
            type="text"
            placeholder="https://instagram.com/tuusuario"
            value={formData.instagram}
            onChange={(value) => setFormData({ ...formData, instagram: value })}
            validation={validateInstagram}
            errorMessage="Ingresa una URL válida de Instagram (ej: https://instagram.com/tuusuario)"
          />

          {/* Image Upload */}
          <ImageUpload 
            imagePreview={formData.imagePreview}
            onImageUpload={handleImageUpload}
          />

          {/* Action Buttons */}
          <FormActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}