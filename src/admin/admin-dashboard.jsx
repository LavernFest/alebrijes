import React, { useState } from 'react';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'DASHBOARD', label: 'DASHBOARD' },
    { id: 'LANDING', label: 'LANDING' },
    { id: 'CATALOGO', label: 'CATALOGO' },
    { id: 'NOSOTROS', label: 'NOSOTROS' },
    { id: 'CONTACTANOS', label: 'CONTACTANOS' },
    { id: 'LUGARES', label: 'LUGARES' }
  ];

  const managementCards = [
    { id: 1, title: 'Manage Landing' },
    { id: 2, title: 'Manage Catalogo' },
    { id: 3, title: 'Manage Nosotros' },
    { id: 4, title: 'Manage Contactanos' },
    { id: 5, title: 'Manage Lugares' }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#FFE74C] via-[#FFE74C] to-[#3BCEAC] font-['Alata',sans-serif]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Alata&display=swap');
          
          .scalloped-edge {
            clip-path: url(#scalloped);
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          
          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          }

          @media (max-width: 1024px) {
            .scalloped-edge {
              clip-path: none;
            }
          }
        `}
      </style>

      <svg width="0" height="0">
        <defs>
          <clipPath id="scalloped" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 0,1 L 1,1 
                     C 1,0.97 0.98,0.95 0.96,0.95
                     C 0.98,0.95 1,0.93 1,0.90
                     C 1,0.87 0.98,0.85 0.96,0.85
                     C 0.98,0.85 1,0.83 1,0.80
                     C 1,0.77 0.98,0.75 0.96,0.75
                     C 0.98,0.75 1,0.73 1,0.70
                     C 1,0.67 0.98,0.65 0.96,0.65
                     C 0.98,0.65 1,0.63 1,0.60
                     C 1,0.57 0.98,0.55 0.96,0.55
                     C 0.98,0.55 1,0.53 1,0.50
                     C 1,0.47 0.98,0.45 0.96,0.45
                     C 0.98,0.45 1,0.43 1,0.40
                     C 1,0.37 0.98,0.35 0.96,0.35
                     C 0.98,0.35 1,0.33 1,0.30
                     C 1,0.27 0.98,0.25 0.96,0.25
                     C 0.98,0.25 1,0.23 1,0.20
                     C 1,0.17 0.98,0.15 0.96,0.15
                     C 0.98,0.15 1,0.13 1,0.10
                     C 1,0.07 0.98,0.05 0.96,0.05
                     C 0.98,0.05 1,0.03 1,0
                     Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Mobile Header with Hamburger Menu */}
      <div className="lg:hidden bg-gradient-to-r from-[#FF0063] to-[#6E2594] p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
            <img src='/assets/alebrije.png' alt='Logo' className='w-10 h-10 object-contain' />
          </div>
          <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-[#FF0063] to-[#6E2594] shadow-xl">
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-full text-base font-bold tracking-wide transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-white text-[#FF0063] shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 bg-gradient-to-b from-[#FF0063] to-[#6E2594] relative scalloped-edge flex-col py-8 px-6 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-xl float-animation overflow-hidden">
            <img 
              src='/assets/alebrije.png' 
              alt='Alebrije Logo' 
              className='w-32 h-32 object-contain'
            />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-6 py-4 rounded-full text-xl font-bold tracking-wide transition-all duration-300 ${
                activeSection === item.id
                  ? 'bg-white text-[#FF0063] shadow-lg scale-105'
                  : 'text-white hover:bg-white/20 hover:scale-105'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Desktop Header */}
        <header className="hidden lg:flex justify-between items-center mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 tracking-tight">
            Admin Dashboard
          </h1>
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
            <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </header>

        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 mb-8 shadow-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 lg:mb-12 text-center fade-in-up">
            ¡Bienvenido!
          </h2>

          {/* Management Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {managementCards.slice(0, 4).map((card, index) => (
              <button
                key={card.id}
                className="bg-gradient-to-br from-[#FFA414] to-[#FF8800] text-white rounded-xl lg:rounded-2xl py-6 sm:py-8 px-4 sm:px-6 text-lg sm:text-xl lg:text-2xl font-bold shadow-lg card-hover fade-in-up"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {card.title}
              </button>
            ))}
          </div>

          {/* Last Card Centered */}
          <div className="flex justify-center">
            <button
              className="bg-gradient-to-br from-[#FFA414] to-[#FF8800] text-white rounded-xl lg:rounded-2xl py-6 sm:py-8 px-6 sm:px-12 text-lg sm:text-xl lg:text-2xl font-bold shadow-lg card-hover w-full sm:w-1/2 fade-in-up"
              style={{
                animationDelay: '0.4s'
              }}
            >
              {managementCards[4].title}
            </button>
          </div>

          {/* Decorative Alebrije - Hidden on mobile */}
          <div className="hidden sm:flex justify-end mt-6 lg:mt-8">
            <div className="float-animation" style={{ animationDelay: '1s' }}>
              <img 
                src='/assets/alebrije.png' 
                alt='Alebrije decorativo' 
                className='w-30 h-30 sm:w-30 sm:h-30 lg:w-30 lg:h-30 object-contain'
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}