import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './navbar';
import Footer from './footer';

const API_BASE = 'http://localhost/Alebrijes_BackEnd_PHP/alebrijes/api';
const MEDIA_BASE = 'http://localhost/Alebrijes_BackEnd_PHP/alebrijes';

function getAspect(naturalWidth, naturalHeight) {
  const ratio = naturalHeight / naturalWidth;
  if (ratio > 1.2) return "tall";
  if (ratio < 0.8) return "wide";
  return "square";
}

const heightMap = {
  tall:    "h-64 sm:h-80",
  wide:    "h-40 sm:h-52",
  square:  "h-52 sm:h-64",
  default: "h-52 sm:h-64",
};

function GaleriaCard({ item, onClick }) {
  const [aspect, setAspect] = useState("default");

  function handleImageLoad(e) {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setAspect(getAspect(naturalWidth, naturalHeight));
  }

  // Construir la URL de la imagen — si es relativa, anteponer MEDIA_BASE
  const imgSrc = item.imageUrl
    ? item.imageUrl.startsWith("http")
      ? item.imageUrl
      : `${MEDIA_BASE}/${item.imageUrl}`
    : null;

  if (!imgSrc) return null;

  return (
    <div
      onClick={() => onClick(item.id)}
      className={`
        relative overflow-hidden rounded-2xl group cursor-pointer
        ${heightMap[aspect]}
        shadow-md hover:shadow-xl
        transition-all duration-500 ease-out
        hover:-translate-y-1
      `}
    >
      <img
        src={imgSrc}
        alt={item.name}
        onLoad={handleImageLoad}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />

      {/* Overlay con nombre y estado */}
      <div className="
        absolute inset-0
        bg-gradient-to-t from-black/70 via-black/10 to-transparent
        opacity-0 group-hover:opacity-100
        transition-opacity duration-400
        flex flex-col justify-end p-4
      ">
        <p className="text-white font-semibold text-sm sm:text-base leading-tight drop-shadow">
          {item.name}
        </p>
        <p className="text-white/75 text-xs sm:text-sm drop-shadow">
          {item.stateCode}
        </p>
        {/* Indicador visual de que es clickeable */}
        <div className="flex items-center gap-1 mt-1">
          <svg className="w-3 h-3 text-[#FFE74C]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd" />
          </svg>
          <span className="text-[#FFE74C] text-xs font-semibold">Ver en mapa</span>
        </div>
      </div>
    </div>
  );
}

export default function Galeria() {
  const navigate = useNavigate();
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Cargar lugares con imagen desde la API
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/places.php`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const json = await res.json();

        const list = json.success ? json.data : (Array.isArray(json) ? json : []);

        // Solo mostrar lugares que tienen imagen
        const conImagen = list.filter(p => p.imageUrl && p.imageUrl.trim() !== '');
        setLugares(conImagen);
      } catch (err) {
        setError('No se pudieron cargar las imágenes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const handleCardClick = (placeId) => {
    // Navegar al mapa pasando el id como query param
    navigate(`/map?placeId=${placeId}`);
  };

  // Dividir en dos columnas para el masonry
  const col1 = lugares.filter((_, i) => i % 2 === 0);
  const col2 = lugares.filter((_, i) => i % 2 !== 0);

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-['Alata',sans-serif]">
      <Navbar />

      <div className="bg-gray-100 min-h-screen py-10">
        <section className="bg-white w-[90%] sm:w-[80%] lg:w-[60%] mx-auto p-6 sm:p-10 rounded-2xl text-center">

          <h1 className="text-3xl font-bold text-pink-600 mb-8">Galería</h1>

          {/* Cargando */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-10 h-10 border-4 border-[#FF0063] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500">Cargando galería...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-16 text-[#FF0063] font-semibold">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-[#6E2594] text-white rounded-full text-sm font-bold hover:bg-[#5a1d7a] transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Sin imágenes */}
          {!loading && !error && lugares.length === 0 && (
            <p className="py-16 text-gray-400 text-lg">No hay imágenes disponibles.</p>
          )}

          {/* Masonry de dos columnas */}
          {!loading && !error && lugares.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                {col1.map((item) => (
                  <GaleriaCard key={item.id} item={item} onClick={handleCardClick} />
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 mt-6">
                {col2.map((item) => (
                  <GaleriaCard key={item.id} item={item} onClick={handleCardClick} />
                ))}
              </div>
            </div>
          )}

        </section>
      </div>

      <Footer />
    </div>
  );
}