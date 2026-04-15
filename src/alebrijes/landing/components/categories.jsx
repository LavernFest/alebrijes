import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './category-card';

export default function Categories() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 640 ? 2 : 3);

  const categories = [
    { id: 1, title: 'Nevado de Toluca', image: '/assets/NevadoToluca.jpg' },
    { id: 2, title: 'El arco de Cabo San Lucas', image: '/assets/arcolucas.jpg' },
    { id: 3, title: 'Museo regional de Queretaro', image: '/assets/museoqueretaro.jpg' },
    { id: 4, title: 'Piramide de Teotihuacan', image: '/assets/piramide.jpg' },
    { id: 5, title: 'Playa Miramar', image: '/assets/playaMiramarTamaulipas.jpg' },
    { id: 6, title: 'Centro Histórico de Campeche', image: '/assets/centroCampeche.jpg' },
  ];

  useEffect(() => {
    const updateItems = () => {
      setItemsPerPage(window.innerWidth < 640 ? 2 : 3);
      setCurrentIndex(0);
    };
    window.addEventListener('resize', updateItems);
    return () => window.removeEventListener('resize', updateItems);
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));

  const visibleCategories = categories.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  const handleCategoryClick = (categoryId) => {
    console.log('Categoría seleccionada:', categoryId);
  };

  return (
    <section className="relative bg-[#FFFFFF] py-12 sm:py-16 px-6">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12 sm:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#FFF1DD" d="M0,0 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,0 L0,0 Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Título + botón Explorar más */}
        <div className="flex flex-col items-center gap-3 mb-12 sm:flex-row sm:justify-center sm:relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FF0063] text-center font-['Lobster_Two',cursive] italic">
            Lugares destacados
          </h2>
          <button
            onClick={() => navigate('/map')}
            className="text-sm font-semibold text-gray-700 hover:text-[#FF0063] transition-colors duration-200 sm:absolute sm:right-0"
          >
            Explorar más →
          </button>
        </div>

        {/* Carrusel */}
        <div className="flex items-center gap-4">
          <button onClick={handlePrev} className="text-2xl text-[#FF0063] font-bold px-2 hover:scale-110 transition-transform">
            ‹
          </button>
          <div className={`grid gap-4 flex-1 ${itemsPerPage === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {visibleCategories.map((category) => (
              <CategoryCard
                key={category.id}
                image={category.image}
                title={category.title}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
          <button onClick={handleNext} className="text-2xl text-[#FF0063] font-bold px-2 hover:scale-110 transition-transform">
            ›
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-12 sm:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#FFFFFF" d="M0,0 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,0 L0,0 Z"></path>
        </svg>
      </div>
    </section>
  );
}