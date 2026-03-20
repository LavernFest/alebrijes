import React from "react";

export default function GalerySection() {

  const handleClick = () => {
    console.log("Ir a galería");
  };

  return (
    <section
      className="relative bg-cover bg-center overflow-hidden w-full"
      style={{ backgroundImage: "url('/assets/collage.jpg')" }}
    >
      {/* Wave superior */}
      <div className="absolute top-0 left-0 w-full z-10 leading-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "120px" }}>
          <path fill="#FFFFFF" fill-opacity="1" d="M0,32L60,64C120,96,240,160,360,160C480,160,600,96,720,80C840,64,960,96,1080,106.7C1200,117,1320,107,1380,101.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>

      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-black/10 z-0" />

      {/* Contenido */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{ paddingTop: "100px", paddingBottom: "100px", minHeight: "600px" }}
      >
        <h2
          className="text-5xl sm:text-6xl font-bold text-white mb-10 drop-shadow-lg"
          style={{ fontFamily: "'Lobster Two', cursive" , WebkitTextStroke: "2px black"}}
        >
          Explorar la galería
        </h2>

        <button
          onClick={handleClick}
          className="bg-white text-[#0c0709] font-semibold px-10 py-3 rounded-full shadow-lg hover:bg-pink-100 transition text-lg"
        >
          ¡Explorar ahora!
        </button>
      </div>

      {/* Wave inferior — volteada verticalmente */}
      <div className="absolute bottom-0 left-0 w-full z-10 leading-none" style={{ transform: "scaleY(-1)" }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "80px" }}>
          <path fill="#FFFFFF" fill-opacity="1" d="M0,32L60,64C120,96,240,160,360,160C480,160,600,96,720,80C840,64,960,96,1080,106.7C1200,117,1320,107,1380,101.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>
    </section>
  );
}