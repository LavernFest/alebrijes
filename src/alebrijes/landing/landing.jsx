import React from 'react';
import Navbar from '../components/navbar';
import Hero from './components/hero';
import Categories from './components/categories';
import FeaturedProducts from './components/featured-products';
import Footer from '../components/footer';
import GalerySection from './components/galerysection';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E7] font-['Alata',sans-serif]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Alata&family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        `}
      </style>

      <Navbar />

      <Hero />

      <Categories />

      {/* Espacio */}
      <div className="bg-[#FFFFFF] py-12" />

      {/* Banner */}
      <section className="bg-[#FFE74C] py-12 sm:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-2xl sm:text-3xl lg:text-4xl text-center text-gray-800 leading-relaxed font-['Lobster_Two',cursive] italic">
            Explora México a través de un mapa interactivo que reúne sus principales sitios turísticos por estado.
          </p>
        </div>
      </section>

      {/* Espacio */}
      <div className="bg-[#FFFFFF] py-20" />

      <GalerySection />

      {/* Espacio */}
      <div className="bg-[#FFFFFF] py-8" />

      <section className="bg-white py-12 sm:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-black leading-relaxed font-['Lobster_Two',cursive] italic mb-8">
            Mapa Interactivo
          </h2>

          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
            onTouchStart={e => e.currentTarget.classList.add('touched')}
            onTouchEnd={e => setTimeout(() => e.currentTarget.classList.remove('touched'), 600)}
          >
            {/* Cambia el src por tu imagen */}
            <img
              src="/assets/seccionmap.jpg"
              alt="Mapa interactivo"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover brightness-90"
            />

            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 [.touched_&]:bg-black/45 transition-all duration-300 flex items-center justify-center">
              {/* Botón */}
              <Link
                to="/map"
                className="bg-white text-black font-medium px-7 py-3 rounded-full text-sm sm:text-base opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 [.touched_&]:opacity-100 [.touched_&]:scale-100 transition-all duration-300"
              >
                Ir al mapa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Espacio */}
      <div className="bg-[#FFFFFF] py-8" />

      <Footer />
    </div>
  );
}