import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import UserMenu from './userMenu';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#3BCEAC] py-4 px-6 shadow-md sticky top-0 z-[1001]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/assets/alebrije.png" 
            alt="Alebrijes Logo" 
            className="w-16 h-16 object-contain"
          />
          <Link to="/" className="text-2xl sm:text-3xl font-bold text-gray-800 font-['Lobster_Two',cursive] italic">Alebrijes</Link>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/nosotros" className="text-gray-800 hover:text-white font-medium text-lg transition-colors">Nosotros</Link>
          <Link to="/map" className="text-gray-800 hover:text-white font-medium text-lg transition-colors">Mapa</Link>
          <Link to="/contactanos" className="text-gray-800 hover:text-white font-medium text-lg transition-colors">Contactanos</Link>
          <Link to="/galeria" className="text-gray-800 hover:text-white font-medium text-lg transition-colors">Galeria</Link>
        </div>

        {/* User Icon + Hamburger */}
        <div className="flex items-center gap-3">
          <UserMenu />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform md:hidden"
          >
            {menuOpen ? (
              // X icon when open
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon when closed
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-3 px-2 pb-3">
          <Link to="/nosotros" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-white font-medium text-lg transition-colors">Nosotros</Link>
          <Link to="/map" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-white font-medium text-lg transition-colors">Mapa</Link>
          <Link to="/contactanos" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-white font-medium text-lg transition-colors">Contactanos</Link>
          <Link to="/galeria" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-white font-medium text-lg transition-colors">Galeria</Link>
        </div>
      )}
    </nav>
  );
}