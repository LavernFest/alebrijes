import React, { useEffect, useRef } from 'react';

export default function InteractiveMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Verificar si Leaflet está cargado
    if (typeof window !== 'undefined' && window.L && mapRef.current && !mapInstanceRef.current) {
      try {
        // Crear el mapa centrado en México
        const map = window.L.map(mapRef.current, {
          center: [23.6345, -102.5528], // Centro de México
          zoom: 5,
          scrollWheelZoom: false, // Desactivar zoom con scroll para mejor UX
          dragging: true,
          zoomControl: true,
          attributionControl: false // Ocultar atribución para diseño más limpio
        });

        // Agregar capa de tiles (mapa base)
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          opacity: 0.9
        }).addTo(map);

        // Agregar algunos marcadores de ejemplo de dulcerías
        const locations = [
          { name: 'Ciudad de México', coords: [19.4326, -99.1332] },
          { name: 'Guadalajara', coords: [20.6597, -103.3496] },
          { name: 'Oaxaca', coords: [17.0732, -96.7266] },
          { name: 'Puebla', coords: [19.0414, -98.2063] },
          { name: 'Monterrey', coords: [25.6866, -100.3161] }
        ];

        // Crear iconos personalizados
        const customIcon = window.L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: #FF0063;
              width: 24px;
              height: 24px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            ">
              <div style="
                width: 12px;
                height: 12px;
                background-color: white;
                border-radius: 50%;
                position: absolute;
                top: 3px;
                left: 3px;
              "></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        });

        locations.forEach(location => {
          window.L.marker(location.coords, { icon: customIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: 'Alata', sans-serif; text-align: center;">
                <strong style="color: #FF0063; font-size: 16px;">${location.name}</strong><br>
                <span style="color: #666; font-size: 14px;">Dulcería Alebrijes</span>
              </div>
            `);
        });

        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Error inicializando el mapa:', error);
      }
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleMapClick = () => {
    console.log('Ir al mapa completo');
    // Aquí iría la navegación a la página de mapa completo
  };

  return (
    <>
      {/* Cargar Leaflet CSS en el head */}
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      <section className="bg-gradient-to-br from-[#FFF8E7] to-[#FFE8D6] py-12 sm:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-800 text-center mb-8 sm:mb-12 font-['Lobster_Two',cursive] italic">
            Mapa interactivo
          </h2>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Contenedor del mapa de Leaflet */}
            <div 
              ref={mapRef}
              className="w-full h-[300px] sm:h-[400px] lg:h-[450px] relative z-0 bg-gradient-to-br from-[#1a4d2e] to-[#0d2818]"
              style={{ position: 'relative' }}
            />
            
            {/* Botón sobre el mapa */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <button 
                onClick={handleMapClick}
                className="pointer-events-auto bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-10 rounded-full text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-['Alata',sans-serif]"
              >
                Ir al mapa
              </button>
            </div>
          </div>

          {/* Mensaje de carga */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Haz clic en los marcadores para ver más información
          </p>
        </div>
      </section>
    </>
  );
}