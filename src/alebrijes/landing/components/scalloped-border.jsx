import React from 'react';

export default function ScallopedBorder({ 
  position = 'top', // 'top' or 'bottom'
  fillColor = '#FFF8E7',
  height = 'h-10 sm:h-12'
}) {
  const isTop = position === 'top';
  
  // Path para borde superior (festones hacia arriba)
  const topPath = "M0,0 L0,60 C40,30 80,30 120,60 C160,30 200,30 240,60 C280,30 320,30 360,60 C400,30 440,30 480,60 C520,30 560,30 600,60 C640,30 680,30 720,60 C760,30 800,30 840,60 C880,30 920,30 960,60 C1000,30 1040,30 1080,60 C1120,30 1160,30 1200,60 C1240,30 1280,30 1320,60 C1360,30 1400,30 1440,60 L1440,0 Z";
  
  // Path para borde inferior (festones hacia abajo)
  const bottomPath = "M0,60 L0,0 C40,30 80,30 120,0 C160,30 200,30 240,0 C280,30 320,30 360,0 C400,30 440,30 480,0 C520,30 560,30 600,0 C640,30 680,30 720,0 C760,30 800,30 840,0 C880,30 920,30 960,0 C1000,30 1040,30 1080,0 C1120,30 1160,30 1200,0 C1240,30 1280,30 1320,0 C1360,30 1400,30 1440,0 L1440,60 Z";

  return (
    <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden leading-none`}>
      <svg 
        className={`relative block w-full ${height}`} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 60" 
        preserveAspectRatio="none"
      >
        <path 
          fill={fillColor} 
          d={isTop ? topPath : bottomPath} 
        />
      </svg>
    </div>
  );
}