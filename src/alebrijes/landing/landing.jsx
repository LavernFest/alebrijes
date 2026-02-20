import React from 'react';
import Navbar from '../components/navbar';
import Hero from './components/hero';
import Categories from './components/categories';
import FeaturedProducts from './components/featured-products';
import Footer from '../components/footer';

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

      {/* Banner */}
      <section className="bg-[#FFE74C] py-12 sm:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-2xl sm:text-3xl lg:text-4xl text-center text-gray-800 leading-relaxed font-['Lobster_Two',cursive] italic">
            Celebramos la tradición mexicana compartiendo dulces típicos que forman parte de nuestra cultura y nuestras raíces.
          </p>
        </div>
      </section>

      <FeaturedProducts />
          <section className="bg-[#263324] py-12 sm:py-16 px-6" >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-white leading-relaxed font-['Lobster_Two',cursive] italic">MAPA</h2>
            </div>
          </section>

      <Footer />
    </div>
  );
}