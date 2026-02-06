import React from 'react';

export default function Hero() {
  return (
    <section className="bg-[#FFF1DD] py-12 sm:py-16 lg:py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div className="space-y-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FF8800] font-['Lobster_Two',cursive] italic">
            Dulces tradicionales mexicanos
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            Catálogo de dulces tradicionales inspirados en la creatividad, el color y la cultura mexicana.
          </p>
          <button className="bg-gradient-to-r from-[#FFA414] to-[#FF8800] hover:from-[#ff9000] hover:to-[#ff7700] text-white font-bold py-4 px-8 rounded-full text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105">
            Explorar catálogo
          </button>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="transform hover:scale-105 transition-transform">
            <img 
              src="/assets/heroCandy.png" 
              alt="Dulces mexicanos" 
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}