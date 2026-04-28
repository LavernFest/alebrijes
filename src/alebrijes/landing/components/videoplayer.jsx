import React, { useState, useRef, useEffect, useCallback } from "react";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const isDragging = useRef(false);
  const wasPlayingBeforeDrag = useRef(false);
  const progressBarRef = useRef(null);

  const VIDEO_SRC = "/assets/pal.mp4";

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      if (!isDragging.current) setCurrent(v.currentTime);
    };
    const onLoadedMetadata = () => setDuration(v.duration);
    const onEnded = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("loadedmetadata", onLoadedMetadata);
    v.addEventListener("ended", onEnded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    return () => {
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  // Calcula la posición en la barra y aplica el seek
  const applySeek = useCallback((e) => {
    const bar = progressBarRef.current;
    const v = videoRef.current;
    if (!bar || !v || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    v.currentTime = newTime;
    setCurrent(newTime);
  }, [duration]);

  const onPointerDown = useCallback((e) => {
    const v = videoRef.current;
    if (!v) return;
    isDragging.current = true;
    wasPlayingBeforeDrag.current = !v.paused;
    v.pause();
    progressBarRef.current.setPointerCapture(e.pointerId);
    applySeek(e);
  }, [applySeek]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    applySeek(e);
  }, [applySeek]);

  const onPointerUp = useCallback((e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    applySeek(e);
    const v = videoRef.current;
    if (wasPlayingBeforeDrag.current && v) {
      v.play().catch(() => {});
    }
  }, [applySeek]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const skip = (seg) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(duration, v.currentTime + seg));
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
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

      <div style={{
        background: "#1a0a2e",
        padding: "10px 16px 14px",
        display: "flex", flexDirection: "column", gap: 8,
      }}>

        {/* Barra de progreso — con pointer events para drag */}
        <div
          ref={progressBarRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            height: 16, display: "flex", alignItems: "center",
            cursor: "pointer", touchAction: "none", userSelect: "none",
          }}
        >
          <div style={{
            position: "relative", width: "100%", height: 5,
            borderRadius: 3, background: "rgba(255,255,255,0.2)",
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
              pointerEvents: "none",
            }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={() => skip(-10)} style={btn("rgba(255,255,255,0.12)", 38)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <polygon points="19,5 8,12 19,19"/><rect x="4" y="5" width="3" height="14" rx="1"/>
              </svg>
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>10s</span>
          </div>

          <button onClick={togglePlay} style={btn("linear-gradient(135deg,#FF0063,#6E2594)", 52, "0 4px 18px rgba(255,0,99,0.45)")}>
            {playing
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><rect x="5" y="4" width="4" height="16" rx="1.5"/><rect x="15" y="4" width="4" height="16" rx="1.5"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><polygon points="6,4 20,12 6,20"/></svg>
            }
          </button>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={() => skip(10)} style={btn("rgba(255,255,255,0.12)", 38)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <polygon points="5,5 16,12 5,19"/><rect x="17" y="5" width="3" height="14" rx="1"/>
              </svg>
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>10s</span>
          </div>

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