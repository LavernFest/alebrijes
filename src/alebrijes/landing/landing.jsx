import React from 'react';
import Navbar from '../components/navbar';
import Hero from './components/hero';
import Categories from './components/categories';
import FeaturedProducts from './components/featured-products';
import Footer from '../components/footer';
import GalerySection from './components/galerysection';

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

          <section className="bg-[#ffffff] py-12 sm:py-16 px-6" >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-black leading-relaxed font-['Lobster_Two',cursive] italic">Mapa Interactivo</h2>
            </div>
          </section>
          
      {/* Espacio */}
      <div className="bg-[#FFFFFF] py-16" />

      <Footer />
    </div>
  );
}