import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import ListItem from './components/list-items';

export default function Lugares() {
  const [activeSection, setActiveSection] = useState('CATALOGO');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado de la lista de lugares
  const [lugares, setLugares] = useState([
    { id: 1, name: 'Lugar 1' },
    { id: 2, name: 'Lugar 2' },
    { id: 3, name: 'Lugar 3' },
    { id: 4, name: 'Lugar 4' },
    { id: 5, name: 'Lugar 5' },
    { id: 6, name: 'Lugar 6' }
  ]);

  const menuItems = [
    { id: 'DASHBOARD', label: 'DASHBOARD' },
    { id: 'LANDING', label: 'LANDING' },
    { id: 'CATALOGO', label: 'CATALOGO' },
    { id: 'NOSOTROS', label: 'NOSOTROS' },
    { id: 'CONTACTANOS', label: 'CONTACTANOS' },
    { id: 'LUGARES', label: 'LUGARES' }
  ];

  const handleEdit = (id) => {
    console.log('Editar lugar con id:', id);
    // agregar modal
    alert(`Editar: ${lugares.find(l => l.id === id)?.name}`);
  };

  const handleCreate = () => {
    console.log('Crear registro');
  }

  const handleDelete = (id) => {
    const lugarToDelete = lugares.find(l => l.id === id);
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar "${lugarToDelete?.name}"?`);
    
    if (confirmDelete) {
      setLugares(lugares.filter(lugar => lugar.id !== id));
      console.log('Lugar eliminado:', id);
    }
  };

  const handleGoBack = () => {
    console.log('Regresar al dashboard');
    // agregar regresar
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
            CATALOGO
          </h2>

          <div className="mb-8">
            {lugares.length > 0 ? (
              lugares.map((lugar, index) => (
                <div
                  key={lugar.id}
                  className="fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ListItem
                    name={lugar.name}
                    onEdit={() => handleEdit(lugar.id)}
                    onDelete={() => handleDelete(lugar.id)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl">No hay lugares registrados</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between ">
            <button
              onClick={handleGoBack}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-8 rounded-2xl text-lg sm:text-xl transition-colors"
            >
              Regresar
            </button>
                        <button
              onClick={handleCreate}
              className="bg-[#6E2594] hover:bg-[#5a1d7a] text-white font-bold py-4 px-8 rounded-2xl text-lg sm:text-xl transition-all shadow-lg"
            >
              Agregar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}