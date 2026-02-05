import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import ImageUpload from './components/image-upload';
import FormActions from './components/forms-actions';

export default function Landing() {
  const [activeSection, setActiveSection] = useState('NOSOTROS');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: null,
    description: '',
    mision: '',
    vision: ''
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

  const handleSubmit = () => {
    const dataToSave = {
      ...formData
    };
    console.log('Form data:', dataToSave);
    // api pa guardar los datos
    alert('Datos guardados exitosamente!');
  };

  const handleCancel = () => {
    // Resetear el formulario
    setFormData({
      image: null,
      imagePreview: null,
      description: '',
      mision: '',
      vision: ''
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

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <DashboardHeader />

        {/* Nosotros Form */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8">
            NOSOTROS
          </h2>
          <div className="mb-8">
            <textarea
              type="text"
              placeholder="Descripción"
              value={formData.header}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0063]"
            />
          </div>
          <div className="mb-8">
            <textarea
              placeholder="Misión"
              value={formData.mision}
              onChange={(e) => setFormData({ ...formData, mision: e.target.value })}
              rows={2}
              className="w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0063] resize-none"
            />
          </div>
          <div className="mb-8">
            <textarea
              type="text"
              placeholder="Visión"
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              rows={4}
              className="w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0063]"
            />
          </div>
            <ImageUpload 
                imagePreview={formData.imagePreview}
                onImageUpload={handleImageUpload}
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