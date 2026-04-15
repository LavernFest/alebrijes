import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const BASE_URL = "http://localhost/Alebrijes_BackEnd_PHP/alebrijes/api";

// Helper para obtener el usuario del localStorage
const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user")); } 
  catch { return null; }
};

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
const ICON_SIZE = [28, 40];



// ─── Componente del mapa ───────────────────────────────────────────────────────
function MapComponent({
  L, mapReady, onMapReady, selectedState, statePlaces,
  allFavoritePlaces, favorites, userLocation, showingFullMap,
  createIcon, onStateClick, onPlaceClick, onShowingFullMapChange,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const favoritesLayerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const stateClickAreasRef = useRef(null);
  const userMarkerRef = useRef(null);
  const isAnimatingRef = useRef(false);
  

  // Inicializar mapa
  useEffect(() => {
    if (!mapReady || !L || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MEXICO_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      minZoom: 4,
      maxZoom: 16,
      maxBounds: MEXICO_BOUNDS,
      maxBoundsViscosity: 0.8,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '© OpenStreetMap © CARTO',
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
  }, [mapReady, L]);

  // labels y áreas de clic por estado
  useEffect(() => {
    if (!L || !labelsLayerRef.current || !stateClickAreasRef.current) return;

    labelsLayerRef.current.clearLayers();
    stateClickAreasRef.current.clearLayers();

    MEXICO_STATES.forEach((state) => {
      const label = L.divIcon({
        html: `<div style="font-family:'Alata',sans-serif;font-size:11px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.8),0 0 8px rgba(110,37,148,0.6);white-space:nowrap;pointer-events:none;font-weight:400;letter-spacing:0.05em;">${state.name}</div>`,
        className: "",
        iconAnchor: [40, 10],
      });
      L.marker(state.center, { icon: label, interactive: false }).addTo(labelsLayerRef.current);

      const [[minLat, minLng], [maxLat, maxLng]] = state.bounds;
      const rect = L.rectangle([[minLat, minLng], [maxLat, maxLng]], {
        color: "transparent",
        fillColor: "#6E2594",
        fillOpacity: 0,
        weight: 0,
        className: "state-clickable",
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

  

  // Actualiza solo el ícono cuando cambian los favoritos, no mueve, no recrea marcadores
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

// ─── Componente principal ──────────────────────────────────────────────────────
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

  // ── Estado para los places de la BD ──
  const [allPlaces, setAllPlaces] = useState({});       // { stateCode: [place, ...] }
  const [placesLoading, setPlacesLoading] = useState(true);
  const [placesError, setPlacesError] = useState(null);

  const user = useMemo(() => getUser(), []);
  const navigate = useNavigate();
  const location = useLocation();

  // Abrir panel de favoritos si viene desde userMenu con ?panel=favoritos
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false);
  const arrivedViaFavoritesRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("panel") === "favoritos") {
      setShowFavoritesPanel(true);
      arrivedViaFavoritesRef.current = true;
      // Limpiar el query param de la URL sin recargar
      navigate("/map", { replace: true });
    }
  }, [location.search]);

  // ── Cargar Leaflet ──
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

  // ── Cargar places desde la API PHP ──
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setPlacesLoading(true);
        setPlacesError(null);
        const res = await fetch(`${BASE_URL}/places.php`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const json = await res.json();

        if (!json.success) throw new Error(json.error || "Error desconocido");

        // Agrupar por stateCode para mantener la misma estructura que antes
        const grouped = {};
        json.data.forEach((place) => {
          const code = place.stateCode;
          if (!code) return;
          if (!grouped[code]) grouped[code] = [];
          grouped[code].push(place);
        });

        setAllPlaces(grouped);
      } catch (err) {
        console.error("Error cargando places:", err);
        setPlacesError(err.message);
      } finally {
        setPlacesLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // ── Geolocalización ──
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Si el usuario llegó desde favoritos, no mostrar su ubicación ni hacer flyTo
        if (arrivedViaFavoritesRef.current) return;
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

/*   const toggleFavorite = useCallback((placeId) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[placeId]) delete next[placeId];
      else next[placeId] = true;
      return next;
    });
  }, []); */

  useEffect(() => {
  if (!user) return;
  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${BASE_URL}/favorites.php?id_user=${user.id_user}`);
      const json = await res.json();
      if (!json.success) return;
      const favMap = {};
      json.data.forEach(f => { favMap[f.id] = true; });
      setFavorites(favMap);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    }
  };
  fetchFavorites();
}, [user]);

const toggleFavorite = useCallback(async (placeId) => {
  if (!user) {
    navigate("/login");
    return;
  }
  const isFav = favorites[placeId];
  setFavorites((prev) => {
    const next = { ...prev };
    if (next[placeId]) delete next[placeId];
    else next[placeId] = true;
    return next;
  });
  try {
    if (isFav) {
      await fetch(`${BASE_URL}/favorites.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: user.id_user, id_place: placeId }),
      });
    } else {
      await fetch(`${BASE_URL}/favorites.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: user.id_user, id_place: placeId, alias: "" }),
      });
    }
  } catch (err) {
    console.error("Error al actualizar favorito:", err);
    setFavorites((prev) => {
      const next = { ...prev };
      if (isFav) next[placeId] = true;
      else delete next[placeId];
      return next;
    });
  }
}, [favorites, user, navigate]);

  // Todos los favoritos (para mostrar en vista república)
  const allFavoritePlaces = useMemo(() => {
    const favs = [];
    Object.entries(allPlaces).forEach(([stateId, places]) => {
      places.forEach((p) => { if (favorites[p.id]) favs.push({ ...p, stateId }); });
    });
    return favs;
  }, [favorites, allPlaces]);

  // Places del estado seleccionado
  const statePlaces = useMemo(() => {
    if (!selectedState) return [];
    return allPlaces[selectedState] || [];
  }, [selectedState, allPlaces]);

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
      setShowFavoritesPanel(false);
      const state = MEXICO_STATES.find((s) => s.id === stateId);
      if (state && mapInstance) mapInstance.flyTo(state.center, 8, { duration: 0.8 });
    },
    [mapInstance]
  );

  const handleBackToMap = useCallback(() => {
    setSelectedState(null);
    setPopupPlace(null);
    setShowingFullMap(true);
    if (arrivedViaFavoritesRef.current) setShowFavoritesPanel(true);
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

  // ── Pantalla de carga (mapa o places) ──
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

  // ── Render principal ──
  return (
    <div className="min-h-screen bg-[#D5E8EB]">
      <Navbar/>

      <div className="relative w-full flex-1 font-['Alata',sans-serif]" style={{ minHeight: "calc(100vh - 84px)", isolation: "isolate" }}>

        {/* Banner de estado seleccionado */}
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

        {/* Indicador de carga de places */}
        {placesLoading && (
          <div className="absolute top-4 right-4 z-[1001] flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 shadow-md">
            <div className="w-4 h-4 border-2 border-[#FF0063] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#6E2594]">Cargando lugares...</span>
          </div>
        )}

        {/* Indicador de error de places */}
        {placesError && (
          <div className="absolute top-4 right-4 z-[1001] flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 shadow-md border border-red-300">
            <span className="text-xs text-red-600">⚠ Error al cargar lugares</span>
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

        {/* Panel vacío cuando el estado no tiene lugares en la BD */}
        {selectedState && !placesLoading && statePlaces.length === 0 && (
          <div
            className="absolute top-0 right-0 bottom-0 z-[999] w-72 flex items-center justify-center"
            style={{
              background: "linear-gradient(180deg, rgba(255,248,231,0.97), rgba(255,248,231,0.99))",
              borderLeft: "3px solid #3BCEAC",
            }}
          >
            <div className="text-center px-4">
              <p className="text-4xl mb-2">🗺️</p>
              <p className="text-[#6E2594] text-sm font-medium">Sin lugares registrados</p>
              <p className="text-gray-400 text-xs mt-1">Agrega lugares en el panel de administración</p>
            </div>
          </div>
        )}

        {/* Panel de Mis Favoritos (desde userMenu) */}
        {showFavoritesPanel && !selectedState && (
          <div
            className="absolute top-0 right-0 bottom-0 z-[999] w-72 overflow-y-auto"
            style={{
              background: "linear-gradient(180deg, rgba(255,248,231,0.97), rgba(255,248,231,0.99))",
              borderLeft: "3px solid #FFE74C",
              boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
            }}
          >
            <div className="p-4 pb-40">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFE74C" stroke="#6E2594" strokeWidth="1.5">
                    <polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" />
                  </svg>
                  <h3 className="text-[#6E2594] text-sm font-bold tracking-wide">Mis Favoritos</h3>
                </div>
                <button
                  onClick={() => setShowFavoritesPanel(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(110,37,148,0.1)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6E2594" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Sin favoritos */}
              {allFavoritePlaces.length === 0 && (
                <div className="flex flex-col items-center py-10 gap-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6E2594" strokeWidth="1" opacity="0.25">
                    <polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" />
                  </svg>
                  <p className="text-[#6E2594] text-sm font-medium text-center">Aún no tienes favoritos</p>
                  <p className="text-gray-400 text-xs text-center">Explora el mapa y guarda los lugares que más te gusten</p>
                </div>
              )}

              {/* Lista agrupada por estado */}
              {allFavoritePlaces.length > 0 && (
                <div className="flex flex-col gap-4">
                  {/* Agrupar por estado */}
                  {Object.entries(
                    allFavoritePlaces.reduce((acc, place) => {
                      const stateName = MEXICO_STATES.find((s) => s.id === place.stateId)?.name || place.stateId;
                      if (!acc[stateName]) acc[stateName] = { stateId: place.stateId, places: [] };
                      acc[stateName].places.push(place);
                      return acc;
                    }, {})
                  ).map(([stateName, { stateId, places }]) => (
                    <div key={stateId}>
                      {/* Encabezado de estado */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-px" style={{ background: "rgba(110,37,148,0.15)" }} />
                        <span className="text-[10px] font-bold text-[#6E2594]/60 uppercase tracking-widest shrink-0">{stateName}</span>
                        <div className="flex-1 h-px" style={{ background: "rgba(110,37,148,0.15)" }} />
                      </div>
                      {/* Lugares del estado */}
                      <div className="flex flex-col gap-2">
                        {places.map((place) => (
                          <button
                            key={place.id}
                            onClick={() => {
                              setShowFavoritesPanel(false);
                              setPopupPlace(place);
                              setShowingFullMap(false);
                              if (mapInstance) mapInstance.flyTo([place.lat, place.lng], 12, { duration: 0.8 });
                            }}
                            className="group flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.02]"
                            style={{
                              background: popupPlace?.id === place.id ? "rgba(255,231,76,0.15)" : "rgba(255,255,255,0.6)",
                              border: popupPlace?.id === place.id ? "2px solid #FFE74C" : "1px solid rgba(255,231,76,0.4)",
                            }}
                          >
                            <div
                              className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ background: "linear-gradient(135deg, #FFE74C, #FFA414)" }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFE74C" stroke="#6E2594" strokeWidth="1">
                                <polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-800 text-xs font-medium truncate">{place.name}</p>
                              <p className="text-gray-500 text-[10px] mt-0.5">
                                {place.media === "video" ? "🎬 Video" : "🖼 Imagen"} • Toca para ver
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/*botones inferiores*/}
        <div className="absolute bottom-0 left-0 right-0 z-[1000]">
          <div className="flex items-center justify-between px-4 pb-2 pt-6">
            <div className="flex items-center gap-2">
              {(selectedState || !showingFullMap) && (
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
                    background: selectedState === state.id ? "#FF0063" : allPlaces[state.id]?.length > 0 ? "rgba(110,37,148,0.1)" : "rgba(0,0,0,0.05)",
                    border: selectedState === state.id ? "2px solid #FF0063" : allPlaces[state.id]?.length > 0 ? "1px solid rgba(110,37,148,0.25)" : "1px solid rgba(0,0,0,0.1)",
                    color: selectedState === state.id ? "#fff" : allPlaces[state.id]?.length > 0 ? "#6E2594" : "#9ca3af",
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
              {/* Media real desde la BD */}
              <div className="relative w-full h-48 flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #6E2594 0%, #8B30BB 50%, #FF0063 100%)" }}>
                {popupPlace.mediaSrc ? (
                  popupPlace.media === "video" ? (
                    <video
                      src={popupPlace.mediaSrc}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                    />
                  ) : (
                    <img
                      src={popupPlace.mediaSrc}
                      alt={popupPlace.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )
                ) : (
                  // Fallback cuando no hay media
                  <div className="relative flex flex-col items-center gap-3">
                    {popupPlace.media === "video" ? (
                      <>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)" }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="none"><polygon points="8,5 19,12 8,19" /></svg>
                        </div>
                        <span className="text-white/70 text-xs">Sin video disponible</span>
                      </>
                    ) : (
                      <>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                        <span className="text-white/70 text-xs">Sin imagen disponible</span>
                      </>
                    )}
                  </div>
                )}
                <button onClick={() => setPopupPlace(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {/* contenido */}
              <div className="p-5">
                <h2 className="text-[#6E2594] text-xl font-bold mb-1">{popupPlace.name}</h2>
                <p className="text-gray-500 text-sm mb-1">{MEXICO_STATES.find((s) => s.id === selectedState)?.name || "México"}</p>
                {popupPlace.storeHours && (
                  <p className="text-gray-400 text-xs mb-4">🕐 {popupPlace.storeHours}</p>
                )}
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
          .leaflet-container { background: #e8e0d8 !important; }
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
      <Footer/>
    </div>
  );
}