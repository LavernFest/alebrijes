import React from 'react';
import ManagementCard from './managment-cards';

export default function WelcomeSection({ managementCards, onCardClick }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 mb-8 shadow-xl">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 lg:mb-12 text-center fade-in-up">
        ¡Bienvenido!
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {managementCards.map((card, index) => (
          <ManagementCard
            key={card.id}
            title={card.title}
            index={index}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>

      {/* Alebrije decorativo — oculto en móvil */}
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
  );
}