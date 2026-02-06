import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-[#3BCEAC] py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/assets/alebrije.png" 
            alt="Alebrijes Logo" 
            className="w-16 h-16 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-['Lobster_Two',cursive] italic">
            Alebrijes
          </h1>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#nosotros" className="text-gray-800 hover:text-white font-medium text-lg transition-colors">
            Nosotros
          </a>
          <a href="#catalogo" className="text-gray-800 hover:text-white font-medium text-lg transition-colors">
            Catálogo
          </a>
          <a href="#contactanos" className="text-gray-800 hover:text-white font-medium text-lg transition-colors">
            Contáctanos
          </a>
        </div>

        {/* User Icon */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform md:hidden">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}