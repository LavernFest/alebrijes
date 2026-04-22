import React, { useState, useRef, useEffect } from "react";

const BARS = 26;

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const animRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [bars, setBars] = useState(Array(BARS).fill(4));

  // ── Pon aquí la URL o ruta de tu audio ──
  const AUDIO_SRC = "/assets/musicamex.mp3";

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.addEventListener("timeupdate", () => setCurrent(a.currentTime));
    a.addEventListener("loadedmetadata", () => setDuration(a.duration));
    a.addEventListener("ended", () => setPlaying(false));
  }, []);

  useEffect(() => {
    if (playing) {
      const go = () => {
        setBars(Array.from({ length: BARS }, () => Math.random() * 38 + 5));
        animRef.current = requestAnimationFrame(go);
      };
      animRef.current = requestAnimationFrame(go);
    } else {
      cancelAnimationFrame(animRef.current);
      setBars(Array(BARS).fill(4));
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

  const toggleMute = () => {
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;
  const barColors = ["#3BCEAC", "#FF0063", "#FFE74C", "#3BCEAC", "#8B30BB", "#FF0063"];

  return (
    <div style={{
      width: 380, borderRadius: 22, overflow: "hidden",
      border: "3px solid #3BCEAC", background: "#FFF8E7",
      boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
      fontFamily: "'Alata', sans-serif",
    }}>

      <audio ref={audioRef} src={AUDIO_SRC} muted={muted} preload="metadata" />

      {/* ── Visualizador (sin controles encima) ── */}
      <div style={{
        height: 180,
        background: "linear-gradient(135deg, #1a0a2e, #160a30, #001824)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 12, overflow: "hidden", position: "relative",
      }}>
        {/* Aros decorativos */}
        {[150, 110, 75].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: s, height: s, borderRadius: "50%",
            border: `1px solid rgba(59,206,172,${0.07 + i * 0.05})`,
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          }} />
        ))}

        {/* Disco */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%", flexShrink: 0, zIndex: 1,
          background: playing ? "linear-gradient(135deg,#FFE74C,#FFA414)" : "rgba(255,255,255,0.07)",
          border: `2px solid ${playing ? "#FFA414" : "rgba(255,255,255,0.15)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: playing ? "0 0 28px rgba(255,164,20,0.45)" : "none",
          animation: playing ? "spin 4s linear infinite" : "none",
          transition: "all 0.4s",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke={playing ? "#6E2594" : "rgba(255,255,255,0.35)"} strokeWidth="1.5">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
        </div>

        {/* Barras visualizador */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          gap: 3, height: 44, flexShrink: 0, zIndex: 1,
        }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              width: 4, height: h, borderRadius: 2,
              background: barColors[i % barColors.length],
              opacity: playing ? 0.82 : 0.18,
              transition: playing ? "height 0.07s ease" : "height 0.5s ease",
            }} />
          ))}
        </div>
      </div>

      {/* ── Controles ABAJO del visualizador ── */}
      <div style={{
        background: "#1a0a2e",
        padding: "10px 16px 14px",
        display: "flex", flexDirection: "column", gap: 8,
      }}>

        {/* Barra de progreso */}
        <div onClick={seek} style={{
          height: 5, borderRadius: 3, background: "rgba(255,255,255,0.2)",
          cursor: "pointer", position: "relative",
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${pct}%`, borderRadius: 3, background: "#FFE74C",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: `${pct}%`,
            transform: "translate(-50%,-50%)",
            width: 13, height: 13, borderRadius: "50%",
            background: "#fff", boxShadow: "0 0 6px #FFE74C",
          }} />
        </div>

        {/* Tiempos */}
        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>

          {/* Atrás 15s */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={() => skip(-15)} style={btn("rgba(255,255,255,0.12)", 38)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <polygon points="19,5 8,12 19,19"/><rect x="4" y="5" width="3" height="14" rx="1"/>
              </svg>
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>15s</span>
          </div>

          {/* Play / Pause */}
          <button onClick={togglePlay} style={btn("linear-gradient(135deg,#FFE74C,#FFA414)", 52, "0 4px 20px rgba(255,164,20,0.5)")}>
            {playing
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="#6E2594"><rect x="5" y="4" width="4" height="16" rx="1.5"/><rect x="15" y="4" width="4" height="16" rx="1.5"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="#6E2594"><polygon points="6,4 20,12 6,20"/></svg>
            }
          </button>

          {/* Adelante 15s */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={() => skip(15)} style={btn("rgba(255,255,255,0.12)", 38)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <polygon points="5,5 16,12 5,19"/><rect x="17" y="5" width="3" height="14" rx="1"/>
              </svg>
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>15s</span>
          </div>

          {/* Mute */}
          <button onClick={toggleMute} style={{ ...btn("rgba(255,255,255,0.08)", 34), marginLeft: "auto" }}>
            {muted
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="rgba(255,255,255,0.5)" stroke="none"/>
                  <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="rgba(255,255,255,0.5)" stroke="none"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
            }
          </button>

        </div>
      </div>

      {/* ── Info del lugar ── */}
      <div style={{ padding: "14px 20px 18px" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#6E2594" }}>Cosmovitral Jardín Botánico</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#999" }}>Estado de México</p>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: "#bbb" }}>🕐 10:00 - 18:00</p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}

function btn(bg, size, shadow) {
  return {
    width: size, height: size, borderRadius: "50%",
    background: bg, border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: shadow || "none", flexShrink: 0,
  };
}