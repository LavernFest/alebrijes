import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const BASE_URL = "http://localhost/Alebrijes_BackEnd_PHP/alebrijes/api";
const MEDIA_BASE_URL = "http://localhost/Alebrijes_BackEnd_PHP/alebrijes";

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



// ─── Sub-componente: Audio Player inline ──────────────────────────────────────
const AUDIO_BARS = 26;
function InlineAudioPlayer({ src, name, stateName, storeHours }) {
  const audioRef = useRef(null);
  const animRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [bars, setBars] = useState(Array(AUDIO_BARS).fill(4));

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.addEventListener("timeupdate", () => setCurrent(a.currentTime));
    a.addEventListener("loadedmetadata", () => setDuration(a.duration));
    a.addEventListener("ended", () => setPlaying(false));
    return () => { a.pause(); };
  }, []);

  useEffect(() => {
    if (playing) {
      const go = () => {
        setBars(Array.from({ length: AUDIO_BARS }, () => Math.random() * 38 + 5));
        animRef.current = requestAnimationFrame(go);
      };
      animRef.current = requestAnimationFrame(go);
    } else {
      cancelAnimationFrame(animRef.current);
      setBars(Array(AUDIO_BARS).fill(4));
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  };
  const skip = (seg) => {
    const a = audioRef.current;
    a.currentTime = Math.max(0, Math.min(duration, a.currentTime + seg));
  };
  const seek = (e) => {
    const bar = e.currentTarget;
    const ratio = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth;
    audioRef.current.currentTime = ratio * duration;
  };
  const toggleMute = () => { audioRef.current.muted = !muted; setMuted(!muted); };
  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };
  const pct = duration > 0 ? (current / duration) * 100 : 0;
  const barColors = ["#3BCEAC", "#FF0063", "#FFE74C", "#3BCEAC", "#8B30BB", "#FF0063"];
  const btnStyle = (bg, size, shadow) => ({
    width: size, height: size, borderRadius: "50%", background: bg,
    border: "none", cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", boxShadow: shadow || "none", flexShrink: 0,
  });

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: "#FFF8E7", border: "2px solid #3BCEAC" }}>
      <audio ref={audioRef} src={src} muted={muted} preload="metadata" />
      {/* Visualizador */}
      <div style={{
        height: 140, background: "linear-gradient(135deg, #1a0a2e, #160a30, #001824)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 10, overflow: "hidden", position: "relative",
      }}>
        {[120, 85, 55].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: s, height: s, borderRadius: "50%",
            border: `1px solid rgba(59,206,172,${0.07 + i * 0.05})`,
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          }} />
        ))}
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0, zIndex: 1,
          background: playing ? "linear-gradient(135deg,#FFE74C,#FFA414)" : "rgba(255,255,255,0.07)",
          border: `2px solid ${playing ? "#FFA414" : "rgba(255,255,255,0.15)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: playing ? "0 0 24px rgba(255,164,20,0.45)" : "none",
          animation: playing ? "spin 4s linear infinite" : "none", transition: "all 0.4s",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={playing ? "#6E2594" : "rgba(255,255,255,0.35)"} strokeWidth="1.5">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: 36, flexShrink: 0, zIndex: 1 }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              width: 3, height: h, borderRadius: 2, background: barColors[i % barColors.length],
              opacity: playing ? 0.82 : 0.18, transition: playing ? "height 0.07s ease" : "height 0.5s ease",
            }} />
          ))}
        </div>
      </div>
      {/* Controles */}
      <div style={{ background: "#1a0a2e", padding: "8px 14px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
        <div onClick={seek} style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.2)", cursor: "pointer", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 3, background: "#FFE74C" }} />
          <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 11, height: 11, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px #FFE74C" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
          <span>{fmt(current)}</span><span>{fmt(duration)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={() => skip(-15)} style={btnStyle("rgba(255,255,255,0.12)", 34)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><polygon points="19,5 8,12 19,19"/><rect x="4" y="5" width="3" height="14" rx="1"/></svg>
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>15s</span>
          </div>
          <button onClick={togglePlay} style={btnStyle("linear-gradient(135deg,#FFE74C,#FFA414)", 46, "0 4px 18px rgba(255,164,20,0.5)")}>
            {playing
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="#6E2594"><rect x="5" y="4" width="4" height="16" rx="1.5"/><rect x="15" y="4" width="4" height="16" rx="1.5"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="#6E2594"><polygon points="6,4 20,12 6,20"/></svg>
            }
          </button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={() => skip(15)} style={btnStyle("rgba(255,255,255,0.12)", 34)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><polygon points="5,5 16,12 5,19"/><rect x="17" y="5" width="3" height="14" rx="1"/></svg>
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>15s</span>
          </div>
          <button onClick={toggleMute} style={{ ...btnStyle("rgba(255,255,255,0.08)", 30), marginLeft: "auto" }}>
            {muted
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="rgba(255,255,255,0.5)" stroke="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="rgba(255,255,255,0.5)" stroke="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-componente: Video Player inline ──────────────────────────────────────
function InlineVideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.addEventListener("timeupdate", () => setCurrent(v.currentTime));
    v.addEventListener("loadedmetadata", () => setDuration(v.duration));
    v.addEventListener("ended", () => setPlaying(false));
    return () => { v.pause(); };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play(); setPlaying(true); }
  };
  const skip = (seg) => {
    const v = videoRef.current;
    v.currentTime = Math.max(0, Math.min(duration, v.currentTime + seg));
  };
  const seek = (e) => {
    const bar = e.currentTarget;
    const ratio = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth;
    videoRef.current.currentTime = ratio * duration;
  };
  const toggleMute = () => { videoRef.current.muted = !muted; setMuted(!muted); };
  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };
  const pct = duration > 0 ? (current / duration) * 100 : 0;
  const btnStyle = (bg, size, shadow) => ({
    width: size, height: size, borderRadius: "50%", background: bg,
    border: "none", cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", boxShadow: shadow || "none", flexShrink: 0,
  });

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", border: "2px solid #3BCEAC" }}>
      <div style={{ width: "100%", height: 180, background: "#000" }}>
        <video
          ref={videoRef} src={src} muted={muted} playsInline
          onClick={togglePlay}
          style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer", display: "block" }}
        />
      </div>
      <div style={{ background: "#1a0a2e", padding: "8px 14px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
        <div onClick={seek} style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.2)", cursor: "pointer", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 3, background: "#3BCEAC" }} />
          <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 11, height: 11, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px #3BCEAC" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
          <span>{fmt(current)}</span><span>{fmt(duration)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={() => skip(-10)} style={btnStyle("rgba(255,255,255,0.12)", 34)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><polygon points="19,5 8,12 19,19"/><rect x="4" y="5" width="3" height="14" rx="1"/></svg>
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>10s</span>
          </div>
          <button onClick={togglePlay} style={btnStyle("linear-gradient(135deg,#FF0063,#6E2594)", 46, "0 4px 18px rgba(255,0,99,0.45)")}>
            {playing
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><rect x="5" y="4" width="4" height="16" rx="1.5"/><rect x="15" y="4" width="4" height="16" rx="1.5"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><polygon points="6,4 20,12 6,20"/></svg>
            }
          </button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={() => skip(10)} style={btnStyle("rgba(255,255,255,0.12)", 34)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><polygon points="5,5 16,12 5,19"/><rect x="17" y="5" width="3" height="14" rx="1"/></svg>
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>10s</span>
          </div>
          <button onClick={toggleMute} style={{ ...btnStyle("rgba(255,255,255,0.08)", 30), marginLeft: "auto" }}>
            {muted
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="rgba(255,255,255,0.5)" stroke="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="rgba(255,255,255,0.5)" stroke="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

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

// ─── Popup Modal con imagen + tabs de audio/video ────────────────────────────
function PopupModal({ place, defaultTab, hasAudio, hasVideo, hasMedia, favorites, selectedState, onClose, onToggleFavorite }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const popupRef = useRef(null);

  // Resetear tab cuando cambia el lugar
  useEffect(() => { setActiveTab(defaultTab); }, [place.id, defaultTab]);

  const stateName = MEXICO_STATES.find((s) => s.id === selectedState)?.name || "México";
  const isFav = favorites[place.id];

  return createPortal(
    <>
      {/* ── MOBILE: bottom sheet (< 640px) ── */}
      <div className="fixed inset-0 z-[9999] flex flex-col justify-end sm:hidden bg-black/50 backdrop-blur-sm" style={{ top: "84px" }} onClick={onClose}>
        <div
          ref={popupRef}
          className="w-full rounded-t-3xl overflow-hidden animate-popup-up"
          style={{ background: "#FFF8E7", border: "3px solid #3BCEAC", borderBottom: "none", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)", maxHeight: "calc(100vh - 84px)", overflowY: "auto" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: "rgba(110,37,148,0.2)" }} />
          </div>
          {/* Imagen */}
          <div className="relative w-full h-44 flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #6E2594 0%, #8B30BB 50%, #FF0063 100%)" }}>
            {place.imageUrl ? (
              <img src={`${MEDIA_BASE_URL}/${place.imageUrl}`} alt={place.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                <span className="text-white/70 text-xs">Sin imagen disponible</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {hasAudio && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(59,206,172,0.9)", color: "#1a0a2e" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>Audio</span>}
              {hasVideo && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(255,0,99,0.9)", color: "#fff" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>Video</span>}
            </div>
            <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          {/* Info */}
          <div className="px-5 pt-4 pb-2">
            <h2 className="text-[#6E2594] text-lg font-bold mb-0.5">{place.name}</h2>
            <p className="text-gray-500 text-sm mb-0.5">{stateName}</p>
            {place.storeHours && <p className="text-gray-400 text-xs">🕐 {place.storeHours}</p>}
          </div>
          {/* Media tabs */}
          {hasMedia && (
            <div className="px-5 pb-2">
              {hasAudio && hasVideo && (
                <div className="flex gap-2 mb-3 mt-2">
                  <button onClick={() => setActiveTab("video")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200" style={{ background: activeTab === "video" ? "linear-gradient(135deg,#FF0063,#6E2594)" : "rgba(255,0,99,0.08)", border: activeTab === "video" ? "2px solid #FF0063" : "2px solid rgba(255,0,99,0.2)", color: activeTab === "video" ? "#fff" : "#FF0063" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>Video
                  </button>
                  <button onClick={() => setActiveTab("audio")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200" style={{ background: activeTab === "audio" ? "linear-gradient(135deg,#3BCEAC,#1a8a72)" : "rgba(59,206,172,0.08)", border: activeTab === "audio" ? "2px solid #3BCEAC" : "2px solid rgba(59,206,172,0.2)", color: activeTab === "audio" ? "#fff" : "#3BCEAC" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>Audio
                  </button>
                </div>
              )}
              {activeTab === "video" && hasVideo && <InlineVideoPlayer key={`video-${place.id}`} src={`${MEDIA_BASE_URL}/${place.videoUrl}`} />}
              {activeTab === "audio" && hasAudio && <InlineAudioPlayer key={`audio-${place.id}`} src={`${MEDIA_BASE_URL}/${place.audioUrl}`} name={place.name} stateName={stateName} storeHours={place.storeHours} />}
            </div>
          )}
          {/* Acciones */}
          <div className="px-5 pb-6 pt-2 flex gap-3">
            <button onClick={() => onToggleFavorite(place.id)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300" style={{ background: isFav ? "linear-gradient(135deg, #FFE74C, #FFA414)" : "rgba(255,231,76,0.2)", border: isFav ? "2px solid #FFA414" : "2px solid #FFE74C", color: isFav ? "#6E2594" : "#FFA414" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? "#FFE74C" : "none"} stroke={isFav ? "#6E2594" : "#FFE74C"} strokeWidth="2"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
              {isFav ? "Guardado" : "Guardar"}
            </button>
            <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(110,37,148,0.08)", border: "1px solid rgba(110,37,148,0.2)", color: "#6E2594" }}>Cerrar</button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: modal centrado más ancho (≥ 640px) ── */}
      <div className="fixed inset-0 z-[9999] hidden sm:flex items-center justify-center bg-black/50 backdrop-blur-sm px-6" style={{ paddingTop: "96px", paddingBottom: "20px" }} onClick={onClose}>
        <div
          ref={popupRef}
          className="w-full rounded-2xl overflow-hidden animate-popup"
          style={{ maxWidth: "760px", background: "#FFF8E7", border: "3px solid #3BCEAC", boxShadow: "0 25px 60px rgba(0,0,0,0.3)", maxHeight: "calc(100vh - 116px)", overflowY: "auto" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Imagen full-width arriba */}
          <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: "260px", background: "linear-gradient(135deg, #6E2594 0%, #8B30BB 50%, #FF0063 100%)" }}>
            {place.imageUrl ? (
              <img src={`${MEDIA_BASE_URL}/${place.imageUrl}`} alt={place.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                <span className="text-white/70 text-xs">Sin imagen disponible</span>
              </div>
            )}
            <div className="absolute bottom-3 left-4 flex gap-2">
              {hasAudio && <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(59,206,172,0.92)", color: "#1a0a2e" }}><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>Audio</span>}
              {hasVideo && <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,0,99,0.92)", color: "#fff" }}><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>Video</span>}
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Dos columnas: info izquierda + media derecha */}
          <div className="flex gap-0">
            {/* Columna izquierda: info + acciones */}
            <div className={`flex flex-col p-6 ${hasMedia ? "w-64 shrink-0 border-r border-[#3BCEAC]/20" : "flex-1"}`}>
              <h2 className="text-[#6E2594] text-xl font-bold mb-1 leading-tight">{place.name}</h2>
              <p className="text-gray-500 text-sm mb-1">{stateName}</p>
              {place.storeHours && <p className="text-gray-400 text-xs mb-4">🕐 {place.storeHours}</p>}
              <div className="mt-auto flex flex-col gap-2 pt-4">
                <button onClick={() => onToggleFavorite(place.id)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02]" style={{ background: isFav ? "linear-gradient(135deg, #FFE74C, #FFA414)" : "rgba(255,231,76,0.2)", border: isFav ? "2px solid #FFA414" : "2px solid #FFE74C", color: isFav ? "#6E2594" : "#FFA414" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={isFav ? "#FFE74C" : "none"} stroke={isFav ? "#6E2594" : "#FFE74C"} strokeWidth="2"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                  {isFav ? "Guardado" : "Guardar"}
                </button>
                <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]" style={{ background: "rgba(110,37,148,0.08)", border: "1px solid rgba(110,37,148,0.2)", color: "#6E2594" }}>Cerrar</button>
              </div>
            </div>

            {/* Columna derecha: media */}
            {hasMedia && (
              <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
                {hasAudio && hasVideo && (
                  <div className="flex gap-2">
                    <button onClick={() => setActiveTab("video")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200" style={{ background: activeTab === "video" ? "linear-gradient(135deg,#FF0063,#6E2594)" : "rgba(255,0,99,0.08)", border: activeTab === "video" ? "2px solid #FF0063" : "2px solid rgba(255,0,99,0.2)", color: activeTab === "video" ? "#fff" : "#FF0063" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>Video
                    </button>
                    <button onClick={() => setActiveTab("audio")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200" style={{ background: activeTab === "audio" ? "linear-gradient(135deg,#3BCEAC,#1a8a72)" : "rgba(59,206,172,0.08)", border: activeTab === "audio" ? "2px solid #3BCEAC" : "2px solid rgba(59,206,172,0.2)", color: activeTab === "audio" ? "#fff" : "#3BCEAC" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>Audio
                    </button>
                  </div>
                )}
                {activeTab === "video" && hasVideo && <InlineVideoPlayer key={`video-${place.id}`} src={`${MEDIA_BASE_URL}/${place.videoUrl}`} />}
                {activeTab === "audio" && hasAudio && <InlineAudioPlayer key={`audio-${place.id}`} src={`${MEDIA_BASE_URL}/${place.audioUrl}`} name={place.name} stateName={stateName} storeHours={place.storeHours} />}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popup-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-popup-up { animation: popup-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </>,
    document.body
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
  const [geoLoading, setGeoLoading] = useState(false);
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
  // Guarda el id que viene desde la galería hasta que allPlaces esté listo
  const pendingPlaceIdRef = useRef(null);
  const [pendingPlaceId, setPendingPlaceId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("panel") === "favoritos") {
      arrivedViaFavoritesRef.current = true;
      navigate("/map", { replace: true });
      // Resetear scroll al inicio cada vez que se navega a esta página
      // Usar setTimeout para que el mapInstance ya esté disponible
      setTimeout(() => handleOpenFavorites(), 100);
    }
    const placeIdParam = params.get("placeId");
    if (placeIdParam) {
      // Bloquear geolocalización igual que con favoritos
      arrivedViaFavoritesRef.current = true;
      const numericId = parseInt(placeIdParam, 10);
      pendingPlaceIdRef.current = numericId;
      setPendingPlaceId(numericId);
      navigate("/map", { replace: true });
    }
  }, [location.search]);

  useEffect(() => {
        window.scrollTo(0, 0);
  }, []);

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
    if (arrivedViaFavoritesRef.current) return;

    setGeoLoading(true);
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        navigator.geolocation.clearWatch(watchId);
        setGeoLoading(false);
        if (arrivedViaFavoritesRef.current) return;
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        const foundState = MEXICO_STATES.find((s) => {
          const [[minLat, minLng], [maxLat, maxLng]] = s.bounds;
          return latitude >= minLat && latitude <= maxLat && longitude >= minLng && longitude <= maxLng;
        });
        if (foundState) setUserStateId(foundState.id);
      },
      () => {
        navigator.geolocation.clearWatch(watchId);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
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

  // Reset completo: cerrar popup, panel y volver al mapa de república
  setPopupPlace(null);
  setSelectedState(null);
  setShowFavoritesPanel(false);
  setShowingFullMap(true);
  if (mapInstance) mapInstance.flyTo(MEXICO_CENTER, DEFAULT_ZOOM, { duration: 0.8 });

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
}, [favorites, user, navigate, mapInstance, setShowFavoritesPanel, setShowingFullMap]);

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
    // El panel de favoritos permanece abierto si ya estaba — no lo cerramos aquí
    if (mapInstance) mapInstance.flyTo(MEXICO_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
  }, [mapInstance]);

  // Reset completo + abrir panel de favoritos
  const handleOpenFavorites = useCallback(() => {
    setSelectedState(null);
    setPopupPlace(null);
    setShowingFullMap(true);
    setShowFavoritesPanel(true);
    if (mapInstance) mapInstance.flyTo(MEXICO_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
  }, [mapInstance]);

  useEffect(() => {
    if (userStateId && mapInstance && !selectedState) {
      const state = MEXICO_STATES.find((s) => s.id === userStateId);
      if (state) setTimeout(() => handleStateClick(userStateId), 1200);
    }
  }, [userStateId, mapInstance]);

  // Si vino desde la galería con ?placeId=X, esperar a que allPlaces esté cargado
  // y luego hacer flyTo + abrir popup del lugar
  useEffect(() => {
    const id = pendingPlaceId;
    if (!id || !mapInstance || Object.keys(allPlaces).length === 0) return;

    // Buscar el lugar en todos los estados
    let found = null;
    for (const places of Object.values(allPlaces)) {
      const match = places.find(p => Number(p.id) === id);
      if (match) { found = match; break; }
    }

    if (!found) return;

    // Limpiar para no repetir
    setPendingPlaceId(null);
    pendingPlaceIdRef.current = null;

    // Navegar al estado del lugar y abrir su popup
    setTimeout(() => {
      handleStateClick(found.stateCode);
      setTimeout(() => {
        mapInstance.flyTo([found.lat, found.lng], 13, { duration: 0.8 });
        setPopupPlace(found);
      }, 800);
    }, 400);
  }, [pendingPlaceId, allPlaces, mapInstance]);

  // El click-outside del popup se maneja dentro de PopupModal

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

        {/* Banner de geolocalización buscando */}
        {geoLoading && !arrivedViaFavoritesRef.current && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[1002] flex items-center gap-3 px-5 py-2.5 rounded-full"
            style={{
              background: "rgba(255,248,231,0.95)",
              border: "2px solid #3BCEAC",
              boxShadow: "0 4px 20px rgba(59,206,172,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Icono de pin pulsante */}
            <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
              <div className="absolute w-5 h-5 rounded-full animate-ping opacity-40" style={{ background: "#3BCEAC" }} />
              <svg width="14" height="14" viewBox="0 0 24 36" className="relative z-10">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#3BCEAC"/>
                <circle cx="12" cy="11" r="5" fill="#FFF8E7"/>
              </svg>
            </div>
            <span className="text-sm font-medium font-['Alata',sans-serif]" style={{ color: "#6E2594" }}>
              Buscando tu ubicación…
            </span>
            {/* Puntos animados */}
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#3BCEAC",
                    animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
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

        {/* ── Panel lateral unificado ── */}
        {(selectedState || showFavoritesPanel) && (() => {
          const isFavMode = showFavoritesPanel;
          const accentColor = isFavMode ? "#FFE74C" : "#3BCEAC";

          const closePanel = () => {
            if (isFavMode) { setShowFavoritesPanel(false); }
            else { setSelectedState(null); setPopupPlace(null); }
          };

          const panelHeader = (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {isFavMode ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFE74C" stroke="#6E2594" strokeWidth="1.5"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3BCEAC" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                )}
                <h3 className="text-[#6E2594] text-sm font-bold tracking-wide">
                  {isFavMode ? "Mis Favoritos" : MEXICO_STATES.find((s) => s.id === selectedState)?.name || "Lugares Turísticos"}
                </h3>
              </div>
              <button onClick={closePanel} className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "rgba(110,37,148,0.1)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6E2594" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          );

          const panelContent = (
            <>
              {/* Estado seleccionado */}
              {!isFavMode && (
                <>
                  {placesLoading && (
                    <div className="flex items-center justify-center py-10 gap-2">
                      <div className="w-4 h-4 border-2 border-[#FF0063] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-[#6E2594]">Cargando...</span>
                    </div>
                  )}
                  {!placesLoading && statePlaces.length === 0 && (
                    <div className="flex flex-col items-center py-10 gap-2">
                      <p className="text-4xl">🗺️</p>
                      <p className="text-[#6E2594] text-sm font-medium">Sin lugares registrados</p>
                      <p className="text-gray-400 text-xs text-center">Agrega lugares en el panel de administración</p>
                    </div>
                  )}
                  {!placesLoading && statePlaces.length > 0 && (
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
                          <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: favorites[place.id] ? "linear-gradient(135deg, #FFE74C, #FFA414)" : "#f3f4f6" }}>
                            {favorites[place.id] ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFE74C" stroke="#6E2594" strokeWidth="1"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                            ) : place.videoUrl ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0063" strokeWidth="2"><polygon points="5,3 19,12 5,21" /></svg>
                            ) : place.audioUrl ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3BCEAC" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E2594" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 text-xs font-medium truncate">{place.name}</p>
                            <p className="text-gray-500 text-[10px] mt-0.5">
                              {place.videoUrl && place.audioUrl ? "🎬 Video + 🎵 Audio" : place.videoUrl ? "🎬 Video" : place.audioUrl ? "🎵 Audio" : "🖼 Imagen"} • {favorites[place.id] ? "⭐ Guardado" : "Toca para ver"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Favoritos */}
              {isFavMode && (
                <>
                  {allFavoritePlaces.length === 0 && (
                    <div className="flex flex-col items-center py-10 gap-3">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6E2594" strokeWidth="1" opacity="0.25"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                      <p className="text-[#6E2594] text-sm font-medium text-center">Aún no tienes favoritos</p>
                      <p className="text-gray-400 text-xs text-center">Explora el mapa y guarda los lugares que más te gusten</p>
                    </div>
                  )}
                  {allFavoritePlaces.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {Object.entries(
                        allFavoritePlaces.reduce((acc, place) => {
                          const stateName = MEXICO_STATES.find((s) => s.id === place.stateId)?.name || place.stateId;
                          if (!acc[stateName]) acc[stateName] = { stateId: place.stateId, places: [] };
                          acc[stateName].places.push(place);
                          return acc;
                        }, {})
                      ).map(([stateName, { stateId, places }]) => (
                        <div key={stateId}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 h-px" style={{ background: "rgba(110,37,148,0.15)" }} />
                            <span className="text-[10px] font-bold text-[#6E2594]/60 uppercase tracking-widest shrink-0">{stateName}</span>
                            <div className="flex-1 h-px" style={{ background: "rgba(110,37,148,0.15)" }} />
                          </div>
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
                                <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FFE74C, #FFA414)" }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFE74C" stroke="#6E2594" strokeWidth="1"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-800 text-xs font-medium truncate">{place.name}</p>
                                  <p className="text-gray-500 text-[10px] mt-0.5">
                                    {place.videoUrl && place.audioUrl ? "🎬 Video + 🎵 Audio" : place.videoUrl ? "🎬 Video" : place.audioUrl ? "🎵 Audio" : "🖼 Imagen"} • Toca para ver
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          );

          return (
            <>
              {/* ── DESKTOP: panel lateral derecho (≥ 640px) ── */}
              <div
                className="absolute top-0 right-0 bottom-0 z-[999] w-72 overflow-y-auto flex-col hidden sm:flex"
                style={{
                  background: "linear-gradient(180deg, rgba(255,248,231,0.97), rgba(255,248,231,0.99))",
                  borderLeft: `3px solid ${accentColor}`,
                  boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
                }}
              >
                <div className="p-4 pb-40 flex flex-col flex-1">
                  {panelHeader}
                  {panelContent}
                </div>
              </div>

              {/* ── MOBILE: favoritos como chips en barra inferior — manejado en botones inferiores ── */}
            </>
          );
        })()}

        {/*botones inferiores*/}
        <div className="absolute bottom-0 left-0 right-0 z-[1000]">
          <div className="flex items-center justify-between px-4 pb-2 pt-6">
            <div className="flex items-center gap-2">
              {(selectedState || !showingFullMap || showFavoritesPanel) && (
                <button onClick={handleBackToMap} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105" style={{ background: "#6E2594", color: "#fff", boxShadow: "0 2px 10px rgba(110,37,148,0.3)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  Ver República
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenFavorites}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105"
                style={{ background: showFavoritesPanel ? "linear-gradient(135deg,#FFE74C,#FFA414)" : "#FFE74C", border: showFavoritesPanel ? "2px solid #FFA414" : "2px solid #FFA414", boxShadow: "0 2px 10px rgba(255,164,20,0.25)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFE74C" stroke="#6E2594" strokeWidth="1"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                <span className="text-gray-800 font-medium">{Object.keys(favorites).length}</span>
                <span className="text-gray-600 hidden sm:inline">favoritos</span>
              </button>
              <div className="flex flex-col rounded-full overflow-hidden" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
                <button onClick={() => mapInstance?.zoomIn()} className="w-9 h-9 flex items-center justify-center text-white text-lg font-bold transition-colors hover:brightness-125" style={{ background: "#6E2594" }}>+</button>
                <button onClick={() => mapInstance?.zoomOut()} className="w-9 h-9 flex items-center justify-center text-white text-lg font-bold transition-colors border-t border-white/20 hover:brightness-125" style={{ background: "#6E2594" }}>−</button>
              </div>
            </div>
          </div>

          {/* ── Fila de chips: estados (sin estado seleccionado) o lugares del estado (mobile) ── */}
          <div className="px-4 pb-4">

            {/* Chips de estados — siempre visibles cuando no hay estado seleccionado */}
            {!selectedState && (
              <>
                <p className="text-gray-500 text-xs mb-2 text-center">Selecciona un estado haciendo clic en el mapa o elige uno:</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                  {MEXICO_STATES.sort((a, b) => a.name.localeCompare(b.name)).map((state) => (
                    <button
                      key={state.id}
                      onClick={() => handleStateClick(state.id)}
                      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                      style={{
                        background: "rgba(110,37,148,0.1)",
                        border: allPlaces[state.id]?.length > 0 ? "1px solid rgba(110,37,148,0.25)" : "1px solid rgba(0,0,0,0.1)",
                        color: allPlaces[state.id]?.length > 0 ? "#6E2594" : "#9ca3af",
                      }}
                    >
                      {state.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Chips de estados — cuando hay estado seleccionado, solo en desktop */}
            {selectedState && (
              <div className="hidden sm:flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
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
            )}

            {/* ── MOBILE: chips de lugares del estado (< 640px) ── */}
            {selectedState && statePlaces.length > 0 && (
              <div className="flex sm:hidden gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {statePlaces.map((place) => {
                  const isSelected = popupPlace?.id === place.id;
                  const isFav = favorites[place.id];
                  return (
                    <button
                      key={place.id}
                      onClick={() => {
                        setPopupPlace(place);
                        if (mapInstance) mapInstance.flyTo([place.lat, place.lng], 13, { duration: 0.5 });
                      }}
                      className="shrink-0 flex items-center gap-2 pl-2 pr-3 py-2 rounded-2xl transition-all duration-200"
                      style={{
                        background: isSelected ? "rgba(255,0,99,0.12)" : "rgba(255,255,255,0.92)",
                        border: isSelected ? "2px solid #FF0063" : isFav ? "2px solid #FFA414" : "1.5px solid rgba(59,206,172,0.5)",
                        boxShadow: isSelected ? "0 2px 12px rgba(255,0,99,0.2)" : "0 1px 6px rgba(0,0,0,0.08)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {/* Icono pequeño */}
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: isFav ? "linear-gradient(135deg,#FFE74C,#FFA414)" : isSelected ? "rgba(255,0,99,0.15)" : "rgba(110,37,148,0.08)" }}>
                        {isFav ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFE74C" stroke="#6E2594" strokeWidth="1.5"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                        ) : place.videoUrl ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF0063" strokeWidth="2.5"><polygon points="5,3 19,12 5,21" /></svg>
                        ) : place.audioUrl ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3BCEAC" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6E2594" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                        )}
                      </div>
                      {/* Nombre */}
                      <span className="text-xs font-medium whitespace-nowrap max-w-[110px] truncate" style={{ color: isSelected ? "#FF0063" : "#374151" }}>
                        {place.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── MOBILE: chips de favoritos (< 640px) ── */}
            {showFavoritesPanel && !selectedState && (
              <>
                {allFavoritePlaces.length === 0 ? (
                  <div className="flex sm:hidden items-center gap-2 py-2">
                    <span className="text-xs text-gray-400">Aún no tienes favoritos guardados</span>
                  </div>
                ) : (
                  <div className="flex sm:hidden gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {allFavoritePlaces.map((place) => {
                      const isSelected = popupPlace?.id === place.id;
                      const stateName = MEXICO_STATES.find((s) => s.id === place.stateId)?.name;
                      return (
                        <button
                          key={place.id}
                          onClick={() => {
                            setPopupPlace(place);
                            if (mapInstance) mapInstance.flyTo([place.lat, place.lng], 13, { duration: 0.5 });
                          }}
                          className="shrink-0 flex items-center gap-2 pl-2 pr-3 py-2 rounded-2xl transition-all duration-200"
                          style={{
                            background: isSelected ? "rgba(255,164,20,0.15)" : "rgba(255,255,255,0.92)",
                            border: isSelected ? "2px solid #FFA414" : "2px solid rgba(255,164,20,0.5)",
                            boxShadow: isSelected ? "0 2px 12px rgba(255,164,20,0.25)" : "0 1px 6px rgba(0,0,0,0.08)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#FFE74C,#FFA414)" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFE74C" stroke="#6E2594" strokeWidth="1.5"><polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" /></svg>
                          </div>
                          <div className="flex flex-col items-start min-w-0">
                            <span className="text-xs font-medium whitespace-nowrap max-w-[100px] truncate leading-tight" style={{ color: isSelected ? "#FFA414" : "#374151" }}>
                              {place.name}
                            </span>
                            {stateName && (
                              <span className="text-[10px] whitespace-nowrap max-w-[100px] truncate leading-tight" style={{ color: "#9ca3af" }}>
                                {stateName}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {selectedState && placesLoading && (
              <div className="flex sm:hidden items-center gap-2 py-2">
                <div className="w-3 h-3 border-2 border-[#FF0063] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-[#6E2594]">Cargando lugares...</span>
              </div>
            )}
            {selectedState && !placesLoading && statePlaces.length === 0 && (
              <div className="flex sm:hidden items-center gap-2 py-2">
                <span className="text-xs text-gray-400">Sin lugares registrados en este estado</span>
              </div>
            )}

          </div>
        </div>

        {/*pop up modal*/}
        {popupPlace && (() => {
          const hasAudio = !!popupPlace.audioUrl;
          const hasVideo = !!popupPlace.videoUrl;
          const hasMedia = hasAudio || hasVideo;
          // tab activo: "audio" | "video" — inicializa al primero disponible
          const defaultTab = hasVideo ? "video" : hasAudio ? "audio" : null;
          return (
            <PopupModal
              place={popupPlace}
              defaultTab={defaultTab}
              hasAudio={hasAudio}
              hasVideo={hasVideo}
              hasMedia={hasMedia}
              favorites={favorites}
              selectedState={selectedState}
              onClose={() => setPopupPlace(null)}
              onToggleFavorite={toggleFavorite}
            />
          );
        })()}

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
          @keyframes dotPulse {
            0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
            40% { transform: scale(1.2); opacity: 1; }
          }
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