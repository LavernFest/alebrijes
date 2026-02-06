import React from 'react';
import ManagementCard from './managment-cards';

export default function WelcomeSection({ managementCards, onCardClick }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 mb-8 shadow-xl">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 lg:mb-12 text-center fade-in-up">
        ¡Bienvenido!
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {managementCards.slice(0, 4).map((card, index) => (
          <ManagementCard
            key={card.id}
            title={card.title}
            index={index}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => onCardClick(managementCards[4].id)}
          className="bg-gradient-to-br from-[#FFA414] to-[#FF8800] text-white rounded-xl lg:rounded-2xl py-6 sm:py-8 px-6 sm:px-12 text-lg sm:text-xl lg:text-2xl font-bold shadow-lg card-hover w-full sm:w-1/2 fade-in-up"
          style={{
            animationDelay: '0.4s'
          }}
        >
          {managementCards[4].title}
        </button>
      </div>

      {/*  Alebrije Oculto en mobil */}
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