import React from 'react';
import ProductCard from './product-card';

export default function FeaturedProducts() {
  const products = [
    { id: 1, name: 'Ate tradicional', image: '/assets/tradiconalAte.png' },
    { id: 2, name: 'Cocadas', image: '/assets/cocada.png' },
    { id: 3, name: 'Alegrías', image: '/assets/alegrias.png' },
    { id: 4, name: 'Jamoncillo', image: '/assets/dulceDLeche.png' }
  ];

  const handleProductClick = (productId) => {
    console.log('Producto seleccionado:', productId);
    // Ir al producto
  };

  return (
    <section className="relative bg-[#FF0063] py-16 sm:py-20 px-6 overflow-hidden">
      {/* Wave superior */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12 sm:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#FFF8E7" d="M0,0 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,0 L0,0 Z"></path>
        </svg>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-12 font-['Alata',sans-serif]">
          Explorar la galería
        </h2>
        
        {/* Scrollable horizontal en móvil, grid en desktop */}
        <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto pb-4 scrollbar-hide lg:overflow-visible">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      </div>

      {/* Wave inferior */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-12 sm:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#FFF8E7" d="M0,0 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,0 L0,0 Z"></path>
        </svg>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}