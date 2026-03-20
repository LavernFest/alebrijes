import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import WelcomeSection from './components/welcome';

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const managementCards = [
    { id: 1, title: 'Manage Landing',     route: '/landing-ad'     },
    { id: 2, title: 'Manage Nosotros',    route: '/nosotros-ad'    },
    { id: 3, title: 'Manage Contactanos', route: '/contactanos-ad' },
    { id: 4, title: 'Manage Lugares',     route: '/lugares-ad'     },
  ];

  const handleCardClick = (cardId) => {
    const card = managementCards.find((c) => c.id === cardId);
    if (card?.route) navigate(card.route);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#FFE74C] via-[#FFE74C] to-[#3BCEAC] font-['Alata',sans-serif]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Alata&display=swap');
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0);    }
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
        `}
      </style>

      {/* Mobile Header */}
      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <DashboardHeader />
        <WelcomeSection
          managementCards={managementCards}
          onCardClick={handleCardClick}
        />
      </main>
    </div>
  );
}