import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './category-card';

const API_BASE   = 'http://localhost/Alebrijes_BackEnd_PHP/alebrijes/api';
const MEDIA_BASE = 'http://localhost/Alebrijes_BackEnd_PHP/alebrijes';

export default function Categories() {
  const navigate = useNavigate();
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [itemsPerPage,  setItemsPerPage]  = useState(window.innerWidth < 640 ? 2 : 3);
  const [categories,    setCategories]    = useState([]);
  const [loading,       setLoading]       = useState(true);

  // Cargar lugares desde la API
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res  = await fetch(`${API_BASE}/places.php`);
        const json = await res.json();
        const list = json.success ? json.data : (Array.isArray(json) ? json : []);

        // Solo lugares con imagen y mezclar aleatoriamente para variedad
        const conImagen = list
          .filter(p => p.imageUrl && p.imageUrl.trim() !== '')
          .sort(() => Math.random() - 0.5);

        setCategories(conImagen);
      } catch (err) {
        console.error('Error cargando places para carrusel:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  // Resetear índice si cambia el número de items por página
  useEffect(() => {
    const updateItems = () => {
      setItemsPerPage(window.innerWidth < 640 ? 2 : 3);
      setCurrentIndex(0);
    };
    window.addEventListener('resize', updateItems);
    return () => window.removeEventListener('resize', updateItems);
  }, []);

  const totalPages       = Math.ceil(categories.length / itemsPerPage);
  const handlePrev       = () => setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  const handleNext       = () => setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  const visibleCategories = categories.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  const handleCategoryClick = (placeId) => {
    navigate(`/map?placeId=${placeId}`);
  };

  // Construir URL de imagen igual que en galería
  const buildImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    return imageUrl.startsWith('http') ? imageUrl : `${MEDIA_BASE}/${imageUrl}`;
  };

  return (
    <section className="relative bg-[#FFFFFF] py-12 sm:py-16 px-6">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12 sm:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#FFF1DD" d="M0,0 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,0 L0,0 Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
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

        {/* Estado de carga */}
        {loading && (
          <div className="flex justify-center items-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-[#FF0063] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Cargando lugares...</p>
          </div>
        )}

        {/* Carrusel */}
        {!loading && categories.length > 0 && (
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="text-2xl text-[#FF0063] font-bold px-2 hover:scale-110 transition-transform"
            >
              ‹
            </button>

            <div className={`grid gap-4 flex-1 ${itemsPerPage === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {visibleCategories.map((place) => (
                <CategoryCard
                  key={place.id}
                  image={buildImageUrl(place.imageUrl)}
                  title={place.name}
                  onClick={() => handleCategoryClick(place.id)}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="text-2xl text-[#FF0063] font-bold px-2 hover:scale-110 transition-transform"
            >
              ›
            </button>
          </div>
        )}

        {/* Indicador de página */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-[#FF0063] w-4'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-12 sm:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#FFFFFF" d="M0,0 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,0 L0,0 Z"></path>
        </svg>
      </div>
    </section>
  );
}