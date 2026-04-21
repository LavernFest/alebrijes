import React from "react";
import Navbar from './navbar';
import Footer from './footer';

const cards = [
  {
    icon: "/assets/icontele.png",
    alt: "Teléfono",
    label: "Teléfono:",
    value: "7222457894",
    bg: "bg-[#4DD9AC]",
  },
  {
    icon: "/assets/iconface.png",
    alt: "Facebook",
    label: "Facebook:",
    value: "@Alebrijes",
    bg: "bg-[#9B59B6]",
  },
  {
    icon: "/assets/iconcor.png",
    alt: "Correo",
    label: "Correo:",
    value: "Alebrijes@gmail.com",
    bg: "bg-[#F9E04B]",
  },
  {
    icon: "/assets/iconinsta.png",
    alt: "Instagram",
    label: "Instagram:",
    value: "@Alebrijes",
    bg: "bg-[#E91E8C]",
  },
];

export default function Contacto() {
  return (
    <div className="min-h-screen bg-[#FFF8E7] font-['Alata',sans-serif]">
      <Navbar />

      {/* Hero con imagen de fondo, título y wave inferior */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "280px" }}>
        {/* Imagen de fondo */}
        <img
          src="/assets/seccionmap.jpg"
          alt="Mapa de México"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Título centrado */}
        <div className="relative z-10 flex items-center justify-center w-full h-full" style={{ minHeight: "280px" }}>
          <h1
            className="text-white font-bold text-center drop-shadow-lg px-4"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
              fontFamily: "'Alata', sans-serif",
            }}
          >
            Contáctanos
          </h1>
        </div>

        {/* Wave inferior */}
        <div className="absolute bottom-0 left-0 w-full z-10 leading-none" style={{ transform: "scaleY(-1)" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "80px" }}
          >
            <path
              fill="#f3f4f6"
              fillOpacity="1"
              d="M0,32L60,64C120,96,240,160,360,160C480,160,600,96,720,80C840,64,960,96,1080,106.7C1200,117,1320,107,1380,101.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </svg>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="bg-gray-100 py-10 px-4">
        <p className="text-center max-w-2xl mx-auto mb-10 text-gray-700 text-base leading-relaxed">
          Somos una plataforma digital dedicada a mostrar los principales lugares turísticos
          de México a través de un mapa interactivo por estado. Nuestro objetivo es facilitar
          la exploración de destinos, destacando su riqueza cultural, histórica y natural.
          ¡Contáctanos para más información o sugerencias sobre nuevos destinos!
        </p>

        {/* Tarjetas de contacto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`${card.bg} rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200`}
            >
              <div className="mb-3 flex items-center justify-center">
                <img src={card.icon} alt={card.alt} className="w-14 h-14 object-contain" />
              </div>
              <p className="text-black text-sm leading-snug">
                <b>{card.label}</b>
                <br />
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}