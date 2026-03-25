import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function UserMenu({ isAdminPage = false }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>

      {/* Botón icono usuario */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Menú de usuario"
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none
          ${open ? "bg-[#6E2594] ring-2 ring-[#FFE74C]" : "bg-transparent"}`}
      >
        {user ? (
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-[#6E2594] to-[#FF0063] select-none font-['Alata',sans-serif]">
            {getInitials(user.name)}
          </span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-7 h-7 transition-colors duration-200 ${open ? "fill-[#FFF8E7]" : "fill-[#6E2594]"}`}
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className={`absolute right-0 mt-3 w-64 rounded-2xl overflow-hidden z-[1100] bg-[#FFF8E7] ...`}>
          {user ? (
            <>
              {/* Header con info del usuario */}
              <div className="px-5 py-4 bg-gradient-to-br from-[#6E2594] to-[#FF0063]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 select-none bg-white/20 border-2 border-[#FFE74C] font-['Alata',sans-serif]">
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold truncate text-[0.95rem] font-['Alata',sans-serif]">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-white/70 text-xs truncate font-['Alata',sans-serif]">
                        {user.email}
                      </p>
                    )}
                    {/* Badge de admin */}
                    {user.role === "admin" && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#FFE74C]/30 border border-[#FFE74C]/60 text-[#FFE74C] text-[10px] font-bold tracking-wide font-['Alata',sans-serif]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Z" clipRule="evenodd" />
                        </svg>
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="p-3 flex flex-col gap-1">

                {/* Botón contextual: Panel Admin ↔ Ir a Landing */}
                {user.role === "admin" && (
                  <>
                    {isAdminPage ? (
                      /* Estando en admin → botón para volver a la landing */
                      <button
                        onClick={() => { setOpen(false); navigate("/"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#3BCEAC] bg-gray-800 hover:bg-gray-700 hover:scale-[1.02] transition-all duration-200 shadow-md font-['Alata',sans-serif]"
                      >
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/10">
                          {/* Icono casa */}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                          </svg>
                        </span>
                        Ir a Landing
                      </button>
                    ) : (
                      /* Estando fuera del admin → botón para ir al panel */
                      <button
                        onClick={() => { setOpen(false); navigate("/admin-dashboard"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6E2594] to-[#FF0063] hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-md font-['Alata',sans-serif]"
                      >
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/20">
                          {/* Icono escudo */}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Z" clipRule="evenodd" />
                          </svg>
                        </span>
                        Panel de Administrador
                      </button>
                    )}
                    {/* Divisor */}
                    <div className="my-1 mx-2 h-px bg-[#6E2594]/10" />
                  </>
                )}

                {/* Editar perfil */}
                <button
                  onClick={() => { setOpen(false); navigate("/perfil-edit"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#6E2594] hover:bg-[#6E2594]/10 hover:border-[#6E2594]/20 border border-transparent transition-all duration-200 font-['Alata',sans-serif]"
                >
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#6E2594]/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>
                  </span>
                  Editar perfil
                </button>

                {/* Mis favoritos */}
                <button
                  onClick={() => { setOpen(false); navigate("/favoritos"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#FF0063] hover:bg-[#FF0063]/10 hover:border-[#FF0063]/20 border border-transparent transition-all duration-200 font-['Alata',sans-serif]"
                >
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#FF0063]/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  </span>
                  Mis favoritos
                </button>

                {/* Divisor */}
                <div className="my-1 mx-2 h-px bg-[#6E2594]/10" />

                {/* Cerrar sesión */}
                <button
                  onClick={() => { localStorage.removeItem("user"); setUser(null); setOpen(false); navigate("/"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-black/5 hover:text-gray-600 border border-transparent transition-all duration-200 font-['Alata',sans-serif]"
                >
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-black/5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            /* Sin usuario */
            <div className="p-4">
              <div className="flex flex-col items-center py-3 pb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-[#6E2594]/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 fill-[#6E2594] opacity-40">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-center text-[#4a4a4a] font-['Alata',sans-serif]">
                  ¡Hola, visitante!
                </p>
                <p className="text-xs text-center mt-1 text-[#9a9a9a] font-['Alata',sans-serif]">
                  Inicia sesión para ver tu perfil y favoritos
                </p>
              </div>

              <button
                onClick={() => { setOpen(false); navigate("/login"); }}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-[#6E2594] to-[#FF0063] hover:scale-[1.02] hover:shadow-lg transition-all duration-300 tracking-wide font-['Alata',sans-serif]"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}