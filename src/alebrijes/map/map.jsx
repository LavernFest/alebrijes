import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Cambiar por GeoJson investigar
const MEXICO_STATES = [
  { id: "AGU", name: "Aguascalientes", center: [21.8853, -102.2916], bounds: [[21.7, -102.5], [22.1, -101.9]] },
  { id: "BCN", name: "Baja California", center: [30.8406, -115.2838], bounds: [[28.0, -117.2], [32.7, -112.8]] },
  { id: "BCS", name: "Baja California Sur", center: [26.0444, -111.6661], bounds: [[22.8, -114.5], [28.0, -109.4]] },
  { id: "CAM", name: "Campeche", center: [19.8301, -90.5349], bounds: [[17.8, -92.5], [20.9, -89.1]] },
  { id: "CHP", name: "Chiapas", center: [16.7569, -93.1292], bounds: [[14.5, -94.2], [17.99, -90.4]] },
  { id: "CHH", name: "Chihuahua", center: [28.6353, -106.0889], bounds: [[25.6, -109.1], [31.8, -103.3]] },
  { id: "COA", name: "Coahuila", center: [27.0587, -101.7068], bounds: [[24.5, -103.9], [29.9, -99.8]] },
  { id: "COL", name: "Colima", center: [19.1223, -104.0072], bounds: [[18.6, -104.8], [19.6, -103.4]] },
  { id: "CMX", name: "Ciudad de México", center: [19.4326, -99.1332], bounds: [[19.1, -99.4], [19.6, -98.9]] },
  { id: "DUR", name: "Durango", center: [24.0277, -104.6532], bounds: [[22.3, -107.2], [26.8, -103.1]] },
  { id: "GUA", name: "Guanajuato", center: [21.019, -101.2574], bounds: [[20.0, -102.1], [21.9, -99.7]] },
  { id: "GRO", name: "Guerrero", center: [17.4392, -99.5451], bounds: [[16.3, -102.2], [18.9, -98.0]] },
  { id: "HID", name: "Hidalgo", center: [20.0911, -98.7624], bounds: [[19.6, -99.9], [21.4, -97.9]] },
  { id: "JAL", name: "Jalisco", center: [20.6595, -103.3494], bounds: [[18.9, -105.7], [22.8, -101.5]] },
  { id: "MEX", name: "Estado de México", center: [19.4969, -99.7233], bounds: [[18.3, -100.6], [20.3, -98.6]] },
  { id: "MIC", name: "Michoacán", center: [19.5665, -101.7068], bounds: [[17.9, -103.8], [20.4, -100.1]] },
  { id: "MOR", name: "Morelos", center: [18.6813, -99.1013], bounds: [[18.3, -99.5], [19.0, -98.6]] },
  { id: "NAY", name: "Nayarit", center: [21.7514, -104.8455], bounds: [[20.6, -106.0], [23.1, -103.7]] },
  { id: "NLE", name: "Nuevo León", center: [25.5922, -99.9962], bounds: [[23.2, -101.2], [27.8, -98.4]] },
  { id: "OAX", name: "Oaxaca", center: [17.0732, -96.7266], bounds: [[15.6, -98.8], [18.7, -95.0]] },
  { id: "PUE", name: "Puebla", center: [19.0414, -98.2063], bounds: [[17.8, -98.8], [20.6, -96.7]] },
  { id: "QUE", name: "Querétaro", center: [20.5888, -100.3899], bounds: [[20.0, -100.6], [21.7, -99.0]] },
  { id: "ROO", name: "Quintana Roo", center: [19.1817, -88.4791], bounds: [[18.0, -89.3], [21.6, -86.7]] },
  { id: "SLP", name: "San Luis Potosí", center: [22.1565, -100.9855], bounds: [[21.1, -102.3], [24.3, -98.2]] },
  { id: "SIN", name: "Sinaloa", center: [24.8091, -107.394], bounds: [[22.5, -109.5], [27.0, -105.4]] },
  { id: "SON", name: "Sonora", center: [29.0729, -110.9559], bounds: [[26.3, -115.1], [32.5, -108.4]] },
  { id: "TAB", name: "Tabasco", center: [17.8409, -92.6189], bounds: [[17.2, -94.1], [18.7, -91.0]] },
  { id: "TAM", name: "Tamaulipas", center: [24.2669, -98.8363], bounds: [[22.2, -100.2], [27.7, -97.1]] },
  { id: "TLA", name: "Tlaxcala", center: [19.3139, -98.2404], bounds: [[19.1, -98.7], [19.7, -97.6]] },
  { id: "VER", name: "Veracruz", center: [19.1738, -96.1342], bounds: [[17.1, -98.7], [22.5, -93.6]] },
  { id: "YUC", name: "Yucatán", center: [20.7099, -89.0943], bounds: [[19.5, -91.0], [21.7, -87.4]] },
  { id: "ZAC", name: "Zacatecas", center: [22.7709, -102.5832], bounds: [[21.0, -104.4], [25.1, -101.2]] },
];

// LUGARES TURISTICOS POR ESTADO (placeholders)
const TOURIST_PLACES = {
  CMX: [
    { id: "cmx1", name: "Palacio de Bellas Artes", lat: 19.4352, lng: -99.1412, media: "image", mediaSrc: null },
    { id: "cmx2", name: "Castillo de Chapultepec", lat: 19.4205, lng: -99.1818, media: "video", mediaSrc: null },
    { id: "cmx3", name: "Zócalo", lat: 19.4326, lng: -99.1332, media: "image", mediaSrc: null },
    { id: "cmx4", name: "Coyoacán", lat: 19.35, lng: -99.1621, media: "image", mediaSrc: null },
    { id: "cmx5", name: "Xochimilco", lat: 19.2577, lng: -99.104, media: "video", mediaSrc: null },
  ],
  JAL: [
    { id: "jal1", name: "Centro Histórico de Guadalajara", lat: 20.6767, lng: -103.3475, media: "image", mediaSrc: null },
    { id: "jal2", name: "Tequila Pueblo Mágico", lat: 20.8824, lng: -103.8369, media: "video", mediaSrc: null },
    { id: "jal3", name: "Puerto Vallarta", lat: 20.6534, lng: -105.2253, media: "image", mediaSrc: null },
    { id: "jal4", name: "Lago de Chapala", lat: 20.296, lng: -103.191, media: "image", mediaSrc: null },
  ],
  ROO: [
    { id: "roo1", name: "Cancún Zona Hotelera", lat: 21.1619, lng: -86.8515, media: "image", mediaSrc: null },
    { id: "roo2", name: "Tulum Ruinas", lat: 20.2144, lng: -87.4291, media: "video", mediaSrc: null },
    { id: "roo3", name: "Playa del Carmen", lat: 20.6296, lng: -87.0739, media: "image", mediaSrc: null },
    { id: "roo4", name: "Isla Mujeres", lat: 21.232, lng: -86.7312, media: "image", mediaSrc: null },
    { id: "roo5", name: "Bacalar Laguna de 7 Colores", lat: 18.6813, lng: -88.3951, media: "video", mediaSrc: null },
  ],
  OAX: [
    { id: "oax1", name: "Monte Albán", lat: 17.043, lng: -96.7676, media: "image", mediaSrc: null },
    { id: "oax2", name: "Hierve el Agua", lat: 16.866, lng: -96.276, media: "video", mediaSrc: null },
    { id: "oax3", name: "Puerto Escondido", lat: 15.8611, lng: -97.0725, media: "image", mediaSrc: null },
    { id: "oax4", name: "Centro Histórico de Oaxaca", lat: 17.0614, lng: -96.7255, media: "image", mediaSrc: null },
  ],
  YUC: [
    { id: "yuc1", name: "Chichén Itzá", lat: 20.6843, lng: -88.5678, media: "video", mediaSrc: null },
    { id: "yuc2", name: "Mérida Centro", lat: 20.9674, lng: -89.5926, media: "image", mediaSrc: null },
    { id: "yuc3", name: "Cenote Ik Kil", lat: 20.6622, lng: -88.5512, media: "image", mediaSrc: null },
    { id: "yuc4", name: "Izamal Pueblo Mágico", lat: 20.9302, lng: -89.0172, media: "image", mediaSrc: null },
  ],
  NLE: [
    { id: "nle1", name: "Parque Fundidora", lat: 25.678, lng: -100.285, media: "image", mediaSrc: null },
    { id: "nle2", name: "Cerro de la Silla", lat: 25.6244, lng: -100.2265, media: "image", mediaSrc: null },
    { id: "nle3", name: "Barrio Antiguo", lat: 25.6701, lng: -100.307, media: "video", mediaSrc: null },
    { id: "nle4", name: "Grutas de García", lat: 25.8032, lng: -100.5558, media: "image", mediaSrc: null },
  ],
  GRO: [
    { id: "gro1", name: "Acapulco La Quebrada", lat: 16.8385, lng: -99.9147, media: "video", mediaSrc: null },
    { id: "gro2", name: "Ixtapa Zihuatanejo", lat: 17.6425, lng: -101.5518, media: "image", mediaSrc: null },
    { id: "gro3", name: "Taxco Pueblo Mágico", lat: 18.5564, lng: -99.605, media: "image", mediaSrc: null },
  ],
  BCN: [
    { id: "bcn1", name: "Valle de Guadalupe", lat: 32.0757, lng: -116.6123, media: "image", mediaSrc: null },
    { id: "bcn2", name: "Ensenada Malecón", lat: 31.8667, lng: -116.5964, media: "image", mediaSrc: null },
    { id: "bcn3", name: "La Bufadora", lat: 31.7181, lng: -116.7302, media: "video", mediaSrc: null },
  ],
  BCS: [
    { id: "bcs1", name: "El Arco de Cabo San Lucas", lat: 22.876, lng: -109.882, media: "image", mediaSrc: null },
    { id: "bcs2", name: "Balandra", lat: 24.3214, lng: -110.3238, media: "image", mediaSrc: null },
    { id: "bcs3", name: "Todos Santos", lat: 23.4478, lng: -110.223, media: "video", mediaSrc: null },
  ],
  PUE: [
    { id: "pue1", name: "Centro Histórico de Puebla", lat: 19.0414, lng: -98.1985, media: "image", mediaSrc: null },
    { id: "pue2", name: "Cholula Pirámide", lat: 19.0586, lng: -98.3015, media: "video", mediaSrc: null },
    { id: "pue3", name: "Cuetzalan", lat: 20.0346, lng: -97.5188, media: "image", mediaSrc: null },
  ],
  GUA: [
    { id: "gua1", name: "Guanajuato Capital", lat: 21.019, lng: -101.2574, media: "image", mediaSrc: null },
    { id: "gua2", name: "San Miguel de Allende", lat: 20.9144, lng: -100.7452, media: "image", mediaSrc: null },
    { id: "gua3", name: "León Centro", lat: 21.1221, lng: -101.6821, media: "video", mediaSrc: null },
  ],
  MIC: [
    { id: "mic1", name: "Pátzcuaro", lat: 19.516, lng: -101.609, media: "image", mediaSrc: null },
    { id: "mic2", name: "Morelia Centro", lat: 19.7059, lng: -101.1949, media: "image", mediaSrc: null },
    { id: "mic3", name: "Santuario Mariposa Monarca", lat: 19.5908, lng: -100.2529, media: "video", mediaSrc: null },
  ],
  CHP: [
    { id: "chp1", name: "San Cristóbal de las Casas", lat: 16.737, lng: -92.6376, media: "image", mediaSrc: null },
    { id: "chp2", name: "Cañón del Sumidero", lat: 16.8353, lng: -93.0816, media: "video", mediaSrc: null },
    { id: "chp3", name: "Palenque", lat: 17.4838, lng: -92.0459, media: "image", mediaSrc: null },
    { id: "chp4", name: "Cascadas de Agua Azul", lat: 17.2572, lng: -92.1139, media: "image", mediaSrc: null },
  ],
  SIN: [
    { id: "sin1", name: "Mazatlán Malecón", lat: 23.2494, lng: -106.4111, media: "image", mediaSrc: null },
    { id: "sin2", name: "El Fuerte Pueblo Mágico", lat: 26.4214, lng: -108.618, media: "video", mediaSrc: null },
  ],
  SON: [
    { id: "son1", name: "Hermosillo Centro", lat: 29.0729, lng: -110.9559, media: "image", mediaSrc: null },
    { id: "son2", name: "San Carlos Nuevo Guaymas", lat: 27.9683, lng: -111.0559, media: "image", mediaSrc: null },
  ],
  QUE: [
    { id: "que1", name: "Centro Histórico de Querétaro", lat: 20.5888, lng: -100.3899, media: "image", mediaSrc: null },
    { id: "que2", name: "Peña de Bernal", lat: 20.7482, lng: -99.9444, media: "video", mediaSrc: null },
  ],
  AGU: [
    { id: "agu1", name: "Feria de San Marcos", lat: 21.8808, lng: -102.2943, media: "image", mediaSrc: null },
  ],
  CAM: [
    { id: "cam1", name: "Calakmul", lat: 18.1056, lng: -89.8108, media: "video", mediaSrc: null },
    { id: "cam2", name: "Campeche Centro", lat: 19.8454, lng: -90.5255, media: "image", mediaSrc: null },
  ],
  CHH: [
    { id: "chh1", name: "Barrancas del Cobre", lat: 27.5079, lng: -108.3541, media: "video", mediaSrc: null },
    { id: "chh2", name: "Creel", lat: 27.7547, lng: -107.635, media: "image", mediaSrc: null },
  ],
  COA: [
    { id: "coa1", name: "Saltillo Centro", lat: 25.4232, lng: -100.9924, media: "image", mediaSrc: null },
  ],
  COL: [
    { id: "col1", name: "Comala Pueblo Mágico", lat: 19.3319, lng: -103.7617, media: "image", mediaSrc: null },
  ],
  DUR: [
    { id: "dur1", name: "Durango Centro", lat: 24.0277, lng: -104.6532, media: "image", mediaSrc: null },
    { id: "dur2", name: "Puente de Ojuela", lat: 25.5903, lng: -105.3559, media: "video", mediaSrc: null },
  ],
  HID: [
    { id: "hid1", name: "Prismas Basálticos", lat: 20.2527, lng: -98.5648, media: "image", mediaSrc: null },
    { id: "hid2", name: "Real del Monte", lat: 20.1354, lng: -98.6742, media: "image", mediaSrc: null },
  ],
  MEX: [
    { id: "mex1", name: "Teotihuacán", lat: 19.6925, lng: -98.8438, media: "video", mediaSrc: null },
    { id: "mex2", name: "Valle de Bravo", lat: 19.1936, lng: -100.131, media: "image", mediaSrc: null },
  ],
  MOR: [
    { id: "mor1", name: "Tepoztlán", lat: 18.9847, lng: -99.0995, media: "image", mediaSrc: null },
    { id: "mor2", name: "Cuernavaca Palacio de Cortés", lat: 18.922, lng: -99.234, media: "image", mediaSrc: null },
  ],
  NAY: [
    { id: "nay1", name: "Islas Marietas", lat: 20.6984, lng: -105.5727, media: "video", mediaSrc: null },
    { id: "nay2", name: "Sayulita", lat: 20.8701, lng: -105.4418, media: "image", mediaSrc: null },
  ],
  SLP: [
    { id: "slp1", name: "Huasteca Potosina", lat: 21.9884, lng: -99.0074, media: "video", mediaSrc: null },
    { id: "slp2", name: "Real de Catorce", lat: 23.6893, lng: -100.8841, media: "image", mediaSrc: null },
  ],
  TAB: [
    { id: "tab1", name: "La Venta Parque Museo", lat: 17.9912, lng: -92.9271, media: "image", mediaSrc: null },
  ],
  TAM: [
    { id: "tam1", name: "Tampico Centro", lat: 22.2331, lng: -97.8611, media: "image", mediaSrc: null },
  ],
  TLA: [
    { id: "tla1", name: "Cacaxtla", lat: 19.2573, lng: -98.3362, media: "image", mediaSrc: null },
  ],
  VER: [
    { id: "ver1", name: "El Tajín", lat: 20.4469, lng: -97.378, media: "video", mediaSrc: null },
    { id: "ver2", name: "Veracruz Puerto", lat: 19.1904, lng: -96.1533, media: "image", mediaSrc: null },
    { id: "ver3", name: "Xalapa Centro", lat: 19.5438, lng: -96.9274, media: "image", mediaSrc: null },
  ],
  ZAC: [
    { id: "zac1", name: "Zacatecas Centro", lat: 22.7709, lng: -102.5832, media: "image", mediaSrc: null },
    { id: "zac2", name: "Mina El Edén", lat: 22.7727, lng: -102.5907, media: "video", mediaSrc: null },
  ],
};

// MARCADORES
const MARKER_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="40">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#FF0063" stroke="#fff" stroke-width="1.5"/>
  <circle cx="12" cy="11" r="5" fill="#fff"/>
  <circle cx="12" cy="11" r="2.5" fill="#FF0063"/>
</svg>`;

const FAVORITE_ICON_SVG = `<svg class="pulse-marker-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="40">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#FFE74C" stroke="#FFA414" stroke-width="1.5"/>
  <polygon points="12,5 14,10 19,10 15,13.5 16.5,18.5 12,15.5 7.5,18.5 9,13.5 5,10 10,10" fill="#FFE74C" stroke="#6E2594" stroke-width="1"/>
</svg>`;

const USER_LOCATION_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
  <circle cx="12" cy="12" r="10" fill="#3BCEAC" fill-opacity="0.3" stroke="#3BCEAC" stroke-width="2"/>
  <circle cx="12" cy="12" r="5" fill="#3BCEAC"/>
  <circle cx="12" cy="12" r="2" fill="#fff"/>
</svg>`;

const MEXICO_BOUNDS = [[14.5, -118.5], [32.8, -86.5]];
const MEXICO_CENTER = [23.6345, -102.5528];
const DEFAULT_ZOOM = 5;

export default function MexicoInteractiveMap() {
  const [mapReady, setMapReady] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [popupPlace, setPopupPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userStateId, setUserStateId] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [showingFullMap, setShowingFullMap] = useState(true);
  const popupRef = useRef(null);
  const [L, setL] = useState(null);

  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.querySelector('link[href*="Alata"]')) {
      const fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href = "https://fonts.googleapis.com/css2?family=Alata&display=swap";
      document.head.appendChild(fontLink);
    }
    const loadLibs = async () => {
      if (!window.L) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      setL(window.L);
      setMapReady(true);
    };
    loadLibs();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        const foundState = MEXICO_STATES.find((s) => {
          const [[minLat, minLng], [maxLat, maxLng]] = s.bounds;
          return latitude >= minLat && latitude <= maxLat && longitude >= minLng && longitude <= maxLng;
        });
        if (foundState) setUserStateId(foundState.id);
      },
      () => console.log("Geolocation denied or unavailable"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const toggleFavorite = useCallback((placeId) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[placeId]) delete next[placeId];
      else next[placeId] = true;
      return next;
    });
  }, []);

  const allFavoritePlaces = useMemo(() => {
    const favs = [];
    Object.entries(TOURIST_PLACES).forEach(([stateId, places]) => {
      places.forEach((p) => { if (favorites[p.id]) favs.push({ ...p, stateId }); });
    });
    return favs;
  }, [favorites]);

  const statePlaces = useMemo(() => {
    if (!selectedState) return [];
    return TOURIST_PLACES[selectedState] || [];
  }, [selectedState]);

  const createIcon = useCallback(
    (svgString, size) => {
      if (!L) return null;
      return L.divIcon({ html: svgString, className: "", iconSize: size, iconAnchor: [size[0] / 2, size[1]], popupAnchor: [0, -size[1]] });
    },
    [L]
  );

  const handleStateClick = useCallback(
    (stateId) => {
      setSelectedState(stateId);
      setPopupPlace(null);
      setShowingFullMap(false);
      const state = MEXICO_STATES.find((s) => s.id === stateId);
      if (state && mapInstance) mapInstance.flyTo(state.center, 8, { duration: 0.8 });
    },
    [mapInstance]
  );

  const handleBackToMap = useCallback(() => {
    setSelectedState(null);
    setPopupPlace(null);
    setShowingFullMap(true);
    if (mapInstance) mapInstance.flyTo(MEXICO_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
  }, [mapInstance]);

  useEffect(() => {
    if (userStateId && mapInstance && !selectedState) {
      const state = MEXICO_STATES.find((s) => s.id === userStateId);
      if (state) setTimeout(() => handleStateClick(userStateId), 1200);
    }
  }, [userStateId, mapInstance]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setPopupPlace(null);
    };
    if (popupPlace) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupPlace]);

  // Cargando mapa
  if (!mapReady || !L) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-[#FFF8E7]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#FF0063] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#6E2594] font-medium tracking-wide text-lg">Cargando mapa de México...</p>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  // mapa
  return (
    <div className="min-h-screen bg-[#D5E8EB]">
      <Navbar/>

      <div className="relative w-full flex-1 font-['Alata',sans-serif]" style={{ minHeight: "calc(100vh - 84px)" }}>

        {selectedState && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-6 py-2.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #6E2594, #8B30BB)", boxShadow: "0 4px 20px rgba(110,37,148,0.5)" }}
          >
            <p className="text-white text-sm tracking-wide">
              {MEXICO_STATES.find((s) => s.id === selectedState)?.name}
            </p>
          </div>
        )}

        <MapComponent
          L={L} mapReady={mapReady} onMapReady={setMapInstance}
          selectedState={selectedState} statePlaces={statePlaces}
          allFavoritePlaces={allFavoritePlaces} favorites={favorites}
          userLocation={userLocation} showingFullMap={showingFullMap}
          createIcon={createIcon} onStateClick={handleStateClick}
          onPlaceClick={setPopupPlace}
          onShowingFullMapChange={setShowingFullMap}
        />

        {/* Panel de listado de lugares */}
        {selectedState && statePlaces.length > 0 && (
          <div
            className="absolute top-0 right-0 bottom-0 z-[999] w-72 overflow-y-auto"
            style={{
              background: "linear-gradient(180deg, rgba(255,248,231,0.97), rgba(255,248,231,0.99))",
              borderLeft: "3px solid #3BCEAC",
              boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
            }}
          >
            <div className="p-4 pb-40">
              <h3 className="text-[#6E2594] text-sm font-medium mb-3 tracking-wide">Lugares Turísticos</h3>
              <div className="flex flex-col gap-2">
                {statePlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => {
                      setPopupPlace(place);
                      if (mapInstance) mapInstance.flyTo([place.lat, place.lng], 12, { duration: 0.5 });
                    }}
                    className="group flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: popupPlace?.id === place.id ? "rgba(255,0,99,0.08)" : "rgba(255,255,255,0.6)",
                      border: popupPlace?.id === place.id ? "2px solid #FF0063" : "1px solid rgba(59,206,172,0.3)",
                    }}
                  >
                    <div
                      className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: favorites[place.id] ? "linear-gradient(135deg, #FFE74C, #FFA414)" : "#f3f4f6" }}
                    >
                      {favorites[place.id] ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFE74C" stroke="#6E2594" strokeWidth="1"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                      ) : place.media === "video" ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E2594" strokeWidth="2"><polygon points="5,3 19,12 5,21" /></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E2594" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-xs font-medium truncate">{place.name}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">
                        {place.media === "video" ? "Video" : "Imagen"} • {favorites[place.id] ? "⭐ Guardado" : "Toca para ver"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/*botones inferiores*/}
        <div className="absolute bottom-0 left-0 right-0 z-[1000]">
          <div className="flex items-center justify-between px-4 pb-2 pt-6">
            <div className="flex items-center gap-2">
              {selectedState && (
                <button onClick={handleBackToMap} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105" style={{ background: "#6E2594", color: "#fff", boxShadow: "0 2px 10px rgba(110,37,148,0.3)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  Ver República
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm" style={{ background: "#FFE74C", border: "2px solid #FFA414", boxShadow: "0 2px 10px rgba(255,164,20,0.25)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFE74C" stroke="#6E2594" strokeWidth="1"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                <span className="text-gray-800 font-medium">{Object.keys(favorites).length}</span>
                <span className="text-gray-600 hidden sm:inline">favoritos</span>
              </div>
              <div className="flex flex-col rounded-full overflow-hidden" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
                <button onClick={() => mapInstance?.zoomIn()} className="w-9 h-9 flex items-center justify-center text-white text-lg font-bold transition-colors hover:brightness-125" style={{ background: "#6E2594" }}>+</button>
                <button onClick={() => mapInstance?.zoomOut()} className="w-9 h-9 flex items-center justify-center text-white text-lg font-bold transition-colors border-t border-white/20 hover:brightness-125" style={{ background: "#6E2594" }}>−</button>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            {!selectedState && <p className="text-gray-500 text-xs mb-2 text-center">Selecciona un estado haciendo clic en el mapa o elige uno:</p>}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {MEXICO_STATES.sort((a, b) => a.name.localeCompare(b.name)).map((state) => (
                <button
                  key={state.id}
                  onClick={() => handleStateClick(state.id)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    background: selectedState === state.id ? "#FF0063" : TOURIST_PLACES[state.id] ? "rgba(110,37,148,0.1)" : "rgba(0,0,0,0.05)",
                    border: selectedState === state.id ? "2px solid #FF0063" : TOURIST_PLACES[state.id] ? "1px solid rgba(110,37,148,0.25)" : "1px solid rgba(0,0,0,0.1)",
                    color: selectedState === state.id ? "#fff" : TOURIST_PLACES[state.id] ? "#6E2594" : "#9ca3af",
                  }}
                >
                  {state.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/*pop up modal*/}
        {popupPlace && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div ref={popupRef} className="w-full max-w-md rounded-2xl overflow-hidden animate-popup" style={{ background: "#FFF8E7", border: "3px solid #3BCEAC", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
              {/* Media placeholder */}
              <div className="relative w-full h-48 flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #6E2594 0%, #8B30BB 50%, #FF0063 100%)" }}>
                {popupPlace.media === "video" ? (
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="none"><polygon points="8,5 19,12 8,19" /></svg>
                    </div>
                    <span className="text-white/70 text-xs">Video placeholder</span>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center gap-3">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                    <span className="text-white/70 text-xs">Imagen placeholder</span>
                  </div>
                )}
                <button onClick={() => setPopupPlace(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              {/* contenido */}
              <div className="p-5">
                <h2 className="text-[#6E2594] text-xl font-bold mb-1">{popupPlace.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{MEXICO_STATES.find((s) => s.id === selectedState)?.name || "México"}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleFavorite(popupPlace.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: favorites[popupPlace.id] ? "linear-gradient(135deg, #FFE74C, #FFA414)" : "rgba(255,231,76,0.2)",
                      border: favorites[popupPlace.id] ? "2px solid #FFA414" : "2px solid #FFE74C",
                      color: favorites[popupPlace.id] ? "#6E2594" : "#FFA414",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites[popupPlace.id] ? "#FFE74C" : "none"} stroke={favorites[popupPlace.id] ? "#6E2594" : "#FFE74C"} strokeWidth="2"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                    {favorites[popupPlace.id] ? "Guardado" : "Guardar"}
                  </button>
                  <button onClick={() => setPopupPlace(null)} className="px-5 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]" style={{ background: "rgba(110,37,148,0.08)", border: "1px solid rgba(110,37,148,0.2)", color: "#6E2594" }}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <style>{`
          @keyframes popup-in {
            from { transform: scale(0.9) translateY(20px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-popup { animation: popup-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .leaflet-control-zoom { display: none !important; }
          .state-clickable { cursor: pointer !important; }
          .leaflet-container { background: #1a1a2e !important; }
          .pulse-marker-svg { animation: pulse 2s ease-in-out infinite; transform-origin: center 75%; }
          @keyframes pulse { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.15);opacity:0.85;} }
          .custom-tooltip {
            background: rgba(110,37,148,0.92) !important; border: 1px solid rgba(255,231,76,0.4) !important;
            color: #fff !important; font-family: 'Alata', sans-serif !important;
            font-size: 12px !important; font-weight: 400 !important;
            padding: 5px 12px !important; border-radius: 8px !important;
            box-shadow: 0 4px 15px rgba(110,37,148,0.3) !important;
          }
          .custom-tooltip::before { border-top-color: rgba(110,37,148,0.92) !important; }
        `}</style>


      </div>
      <Footer />
    </div>
  );
}

function MapComponent({
  L,
  mapReady,
  onMapReady,
  selectedState,
  statePlaces,
  allFavoritePlaces,
  favorites,
  userLocation,
  showingFullMap,
  createIcon,
  onStateClick,
  onPlaceClick,
  onShowingFullMapChange
}) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const favoritesLayerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const stateClickAreasRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const ICON_SIZE = [28, 40];

  useEffect(() => {
    if (!L || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MEXICO_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 5,
      maxZoom: 18,
      maxBounds: L.latLngBounds(MEXICO_BOUNDS),
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    favoritesLayerRef.current = L.layerGroup().addTo(map);
    labelsLayerRef.current = L.layerGroup().addTo(map);
    stateClickAreasRef.current = L.layerGroup().addTo(map);

    map.on("movestart", () => { isAnimatingRef.current = true; });
    map.on("moveend", () => { isAnimatingRef.current = false; });

    mapRef.current = map;
    onMapReady(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [L]);

  // area para darle click al estado
  useEffect(() => {
    if (!mapRef.current || !L || !stateClickAreasRef.current || !labelsLayerRef.current) return;

    stateClickAreasRef.current.clearLayers();
    labelsLayerRef.current.clearLayers();

    MEXICO_STATES.forEach((state) => {
      const rect = L.rectangle(state.bounds, {
        color: "transparent",
        fillColor: "rgba(59,206,172,0.05)",
        fillOpacity: 0,
        weight: 0,
        className: "state-clickable",
        interactive: true,
      });

      rect.on("mouseover", () => rect.setStyle({ fillOpacity: 0.2, fillColor: "#3BCEAC" }));
      rect.on("mouseout", () => rect.setStyle({ fillOpacity: 0 }));
      rect.on("click", () => onStateClick(state.id));

      stateClickAreasRef.current.addLayer(rect);
    });
  }, [L, onStateClick]);

  // mostrar segun zoom
  useEffect(() => {
    if (!mapRef.current || !labelsLayerRef.current || !stateClickAreasRef.current) return;

    if (selectedState) {
      if (mapRef.current.hasLayer(labelsLayerRef.current)) labelsLayerRef.current.remove();
      if (mapRef.current.hasLayer(stateClickAreasRef.current)) stateClickAreasRef.current.remove();
    } else {
      if (!mapRef.current.hasLayer(labelsLayerRef.current)) labelsLayerRef.current.addTo(mapRef.current);
      if (!mapRef.current.hasLayer(stateClickAreasRef.current)) stateClickAreasRef.current.addTo(mapRef.current);
    }
  }, [selectedState]);

  // Referencia para acceder a los marcadores por place.id
  const markerMapRef = useRef({});

  // marcadores dentro del estado solo se recrean cuando cambia el estado seleccionado
  useEffect(() => {
    if (!mapRef.current || !L || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    markerMapRef.current = {};
    if (!selectedState) return;

    statePlaces.forEach((place) => {
      const icon = L.divIcon({
        html: MARKER_ICON_SVG,
        className: "",
        iconSize: ICON_SIZE,
        iconAnchor: [ICON_SIZE[0] / 2, ICON_SIZE[1]],
        popupAnchor: [0, -ICON_SIZE[1]],
      });

      const marker = L.marker([place.lat, place.lng], { icon });

      marker.bindTooltip(place.name, {
        direction: "top",
        offset: [0, -ICON_SIZE[1]],
        className: "custom-tooltip",
      });

      marker.on("click", () => onPlaceClick(place));
      markersLayerRef.current.addLayer(marker);
      markerMapRef.current[place.id] = marker;
    });
  }, [L, selectedState, statePlaces, onPlaceClick]);

  // Actualiza solo el ícono cuando cambian los favoritos,no mueve, no recrea marcadores
  useEffect(() => {
    if (!L || !selectedState) return;

    statePlaces.forEach((place) => {
      const marker = markerMapRef.current[place.id];
      if (!marker) return;

      const isFav = favorites[place.id];
      const icon = L.divIcon({
        html: isFav ? FAVORITE_ICON_SVG : MARKER_ICON_SVG,
        className: "",
        iconSize: ICON_SIZE,
        iconAnchor: [ICON_SIZE[0] / 2, ICON_SIZE[1]],
        popupAnchor: [0, -ICON_SIZE[1]],
      });
      marker.setIcon(icon);
    });
  }, [L, favorites, selectedState, statePlaces]);

  // favoritos vista mapa república, espera a que el mapa termine de animarse
  useEffect(() => {
    if (!mapRef.current || !L || !favoritesLayerRef.current) return;

    favoritesLayerRef.current.clearLayers();
    if (selectedState) return;

    const placeFavoriteMarkers = () => {
      if (!favoritesLayerRef.current) return;
      favoritesLayerRef.current.clearLayers();

      allFavoritePlaces.forEach((place) => {
        const icon = L.divIcon({
          html: FAVORITE_ICON_SVG,
          className: "",
          iconSize: ICON_SIZE,
          iconAnchor: [ICON_SIZE[0] / 2, ICON_SIZE[1]],
          popupAnchor: [0, -ICON_SIZE[1]],
        });

        const marker = L.marker([place.lat, place.lng], { icon });

        marker.bindTooltip(`⭐ ${place.name}`, {
          direction: "top",
          offset: [0, -ICON_SIZE[1]],
          className: "custom-tooltip",
        });

        marker.on("click", () => onPlaceClick(place));
        favoritesLayerRef.current.addLayer(marker);
      });
    };

    // Si el mapa está animando (flyTo de regreso), esperar a que termine
    if (isAnimatingRef.current) {
      mapRef.current.once("moveend", placeFavoriteMarkers);
    } else {
      placeFavoriteMarkers();
    }

    return () => {
      mapRef.current?.off("moveend", placeFavoriteMarkers);
    };
  }, [L, selectedState, allFavoritePlaces, onPlaceClick]);

  // ubicacion del usuario
  useEffect(() => {
    if (!mapRef.current || !L || !userLocation) return;

    if (userMarkerRef.current) userMarkerRef.current.remove();

    const icon = L.divIcon({
      html: USER_LOCATION_SVG,
      className: "",
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon })
      .bindTooltip("Tu ubicación", {
        direction: "top",
        offset: [0, -15],
        className: "custom-tooltip",
      })
      .addTo(mapRef.current);
  }, [L, userLocation]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full absolute inset-0"
    />
  );
}
