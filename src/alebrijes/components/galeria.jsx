import { useState } from "react";
import Navbar from './navbar';
import Footer from './footer';

// --- Arreglo temporal (después vendrá de la BD) ---
const lugares = [
  {
    id: 1,
    src: "https://www.lugaresturisticosdeveracruz.com/wp-content/uploads/2020/02/Puente-con-vista-a-la-Laguna-de-Mandinga.jpg",
    alt: "Laguna de Mandinga",
    lugar: "Laguna de Mandinga",
    estado: "Veracruz",
  },
  {
    id: 2,
    src: "/assets/arcolucas.jpg",
    alt: "El Arco en Los Cabos",
    lugar: "El Arco",
    estado: "Baja California Sur",
  },
  {
    id: 3,
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU6gpKR9rDNEx1UFLNw08eKONMtiF7oNFhRw&s",
    alt: "Catedral de Puebla",
    lugar: "Catedral de Puebla",
    estado: "Puebla",
  },
  {
    id: 4,
    src: "/assets/museoqueretaro.jpg",
    alt: "Museo regional de Queretaro",
    lugar: "Museo regional de Queretaro",
    estado: "Queretaro",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600",
    alt: "Cañón del Sumidero",
    lugar: "Cañón del Sumidero",
    estado: "Chiapas",
  },
  {
    id: 6,
    src: "https://i0.wp.com/www.quepasaoaxaca.com/wp-content/uploads/2022/04/hierve-el-agua-coyote-6.jpeg?resize=1140%2C1425&ssl=1",
    alt: "Hierve el Agua",
    lugar: "Hierve el Agua",
    estado: "Oaxaca",
  },
  {
    id: 7,
    src: "https://www.mexicoenfotos.com/MX12182339605575.jpg",
    alt: "Museo de Historia Mexicana",
    lugar: "Museo de Historia Mexicana",
    estado: "Nuevo Leon",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600",
    alt: "Costa Turquesa",
    lugar: "Costa Turquesa",
    estado: "Quintana Roo",
  },
];

// Calcula el aspect según las dimensiones reales de la imagen
function getAspect(naturalWidth, naturalHeight) {
  const ratio = naturalHeight / naturalWidth;
  if (ratio > 1.2) return "tall";
  if (ratio < 0.8) return "wide";
  return "square";
}

// Altura según aspect
const heightMap = {
  tall:    "h-64 sm:h-80",
  wide:    "h-40 sm:h-52",
  square:  "h-52 sm:h-64",
  default: "h-52 sm:h-64", // mientras carga la imagen
};

function GaleriaCard({ item }) {
  const [aspect, setAspect] = useState("default");

  function handleImageLoad(e) {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setAspect(getAspect(naturalWidth, naturalHeight));
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl group cursor-pointer
        ${heightMap[aspect]}
        shadow-md hover:shadow-xl
        transition-all duration-500 ease-out
        hover:-translate-y-1
      `}
    >
      <img
        src={item.src}
        alt={item.alt}
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
          {item.lugar}
        </p>
        <p className="text-white/75 text-xs sm:text-sm drop-shadow">
          {item.estado}
        </p>
      </div>
    </div>
  );
}

export default function Nosotros() {
  const col1 = lugares.filter((_, i) => i % 2 === 0);
  const col2 = lugares.filter((_, i) => i % 2 !== 0);

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-['Alata',sans-serif]">
      <Navbar />

      <div className="bg-gray-100 min-h-screen py-10">
        <section className="bg-white w-[90%] sm:w-[80%] lg:w-[60%] mx-auto p-6 sm:p-10 rounded-2xl text-center">

          <h1 className="text-3xl font-bold text-pink-600 mb-8">
            Galería
          </h1>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              {col1.map((item) => <GaleriaCard key={item.id} item={item} />)}
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 mt-6">
              {col2.map((item) => <GaleriaCard key={item.id} item={item} />)}
            </div>
          </div>

        </section>
      </div>

      <Footer />
    </div>
  );
}