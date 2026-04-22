import React, { useState, useRef, useEffect } from "react";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  // ── Pon aquí la URL o ruta de tu video ──
  const VIDEO_SRC = "/assets/palacio.mp4";

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.addEventListener("timeupdate", () => setCurrent(v.currentTime));
    v.addEventListener("loadedmetadata", () => setDuration(v.duration));
    v.addEventListener("ended", () => setPlaying(false));
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

  const toggleMute = () => {
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div style={{
      width: 380, borderRadius: 22, overflow: "hidden",
      border: "3px solid #3BCEAC", background: "#FFF8E7",
      boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
      fontFamily: "'Alata', sans-serif",
    }}>

      {/* ── Video (solo el video, sin nada encima) ── */}
      <div style={{ width: "100%", height: 220, background: "#000" }}>
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted={muted}
          playsInline
          onClick={togglePlay}
          style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer", display: "block" }}
        />
      </div>

      {/* ── Controles ABAJO del video ── */}
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
            width: `${pct}%`, borderRadius: 3, background: "#3BCEAC",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: `${pct}%`,
            transform: "translate(-50%,-50%)",
            width: 13, height: 13, borderRadius: "50%",
            background: "#fff", boxShadow: "0 0 6px #3BCEAC",
          }} />
        </div>

        {/* Tiempos */}
        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>

          {/* Atrás 10s */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={() => skip(-10)} style={btn("rgba(255,255,255,0.12)", 38)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <polygon points="19,5 8,12 19,19"/><rect x="4" y="5" width="3" height="14" rx="1"/>
              </svg>
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>10s</span>
          </div>

          {/* Play / Pause */}
          <button onClick={togglePlay} style={btn("linear-gradient(135deg,#FF0063,#6E2594)", 52, "0 4px 18px rgba(255,0,99,0.45)")}>
            {playing
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><rect x="5" y="4" width="4" height="16" rx="1.5"/><rect x="15" y="4" width="4" height="16" rx="1.5"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><polygon points="6,4 20,12 6,20"/></svg>
            }
          </button>

          {/* Adelante 10s */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={() => skip(10)} style={btn("rgba(255,255,255,0.12)", 38)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <polygon points="5,5 16,12 5,19"/><rect x="17" y="5" width="3" height="14" rx="1"/>
              </svg>
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>10s</span>
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