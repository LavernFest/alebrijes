import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SECTION_ROUTES = {
  DASHBOARD:   '/admin-dashboard',
  LANDING:     '/landing-ad',
  NOSOTROS:    '/nosotros-ad',
  CONTACTANOS: '/contactanos-ad',
  LUGARES:     '/lugares-ad',
};

const menuItems = [
  { id: 'DASHBOARD',   label: 'DASHBOARD'   },
  { id: 'LANDING',     label: 'LANDING'     },
  { id: 'NOSOTROS',    label: 'NOSOTROS'    },
  { id: 'CONTACTANOS', label: 'CONTACTANOS' },
  { id: 'LUGARES',     label: 'LUGARES'     },
];

export default function MobileHeader({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar sección activa según URL
  const activeSection = Object.entries(SECTION_ROUTES).find(
    ([, path]) => location.pathname === path
  )?.[0] ?? 'DASHBOARD';

  const handleNav = (id) => {
    navigate(SECTION_ROUTES[id]);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header con Hamburger Menu */}
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
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
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
    </>
  );
}