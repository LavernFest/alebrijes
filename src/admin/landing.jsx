import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import ImageUpload from './components/image-upload';
import ComponentCheckbox from './components/checkbox';
import FormActions from './components/forms-actions';

export default function Landing() {
  const [activeSection, setActiveSection] = useState('LANDING');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
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
  });

  // Orden de los componentes
  const [componentsList, setComponentsList] = useState([
    { id: 'catalogo', label: 'Catalogo' },
    { id: 'lugares', label: 'Lugares' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'contactanos', label: 'Contactanos' }
  ]);

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

  const handleCheckboxChange = (componentName) => {
    setFormData({
      ...formData,
      components: {
        ...formData.components,
        [componentName]: !formData.components[componentName]
      }
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItem === null || draggedItem === index) return;
    
    const newList = [...componentsList];
    const draggedItemContent = newList[draggedItem];
    
    // Remover el item arrastrado
    newList.splice(draggedItem, 1);
    // Insertar en la nueva posición
    newList.splice(index, 0, draggedItemContent);
    
    setComponentsList(newList);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
      componentsOrder: componentsList
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
      header: '',
      description: '',
      components: {
        catalogo: true,
        lugares: true,
        nosotros: true,
        contactanos: true
      }
    });
    // Resetear el orden
    setComponentsList([
      { id: 'catalogo', label: 'Catalogo' },
      { id: 'lugares', label: 'Lugares' },
      { id: 'nosotros', label: 'Nosotros' },
      { id: 'contactanos', label: 'Contactanos' }
    ]);
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
            LANDING
          </h2>
          <ImageUpload 
            imagePreview={formData.imagePreview}
            onImageUpload={handleImageUpload}
          />
          <div className="mb-6">
            <input
              type="text"
              placeholder="Header"
              value={formData.header}
              onChange={(e) => setFormData({ ...formData, header: e.target.value })}
              className="w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0063]"
            />
          </div>
          <div className="mb-8">
            <textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-gray-200 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0063] resize-none"
            />
          </div>
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