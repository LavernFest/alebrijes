import React from 'react';
import CategoryCard from './category-card';

export default function Categories() {
  const categories = [
    {
      id: 1,
      title: 'Nevado de Toluca',
      image: '/assets/NevadoToluca.jpg'
    },
    {
      id: 2,
      title: 'El arco de Cabo San Lucas',
      image: '/assets/arcolucas.jpg'
    },
    {
      id: 3,
      title: 'Museo regional de Queretaro',
      image: '/assets/museoqueretaro.jpg'
    },
    {
      id: 4,
      title: 'Piramide de Teotihuacan',
      image: '/assets/piramide.jpg'
    }

  ];

  const handleCategoryClick = (categoryId) => {
    console.log('Categoría seleccionada:', categoryId);
    // ir a pagina de categoria
  };

  return (
    <section className="relative bg-[#FFFFFF] py-12 sm:py-16 px-6">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12 sm:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#FFF1DD" d="M0,0 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,0 L0,0 Z"></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FF0063] text-center mb-12 font-['Lobster_Two',cursive] italic">
          Lugares destacados
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              image={category.image}
              title={category.title}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>

        {/* Wave inferior */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-12 sm:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#FFFFFF" d="M0,0 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,0 L0,0 Z"></path>
        </svg>
      </div>
      </div>
    </section>
  );
}