import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// helpers
const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

const validate = ({ name, email, password, confirmPassword, changePassword }) => {
  const errs = {};
  if (!name.trim() || name.trim().length < 2) errs.name = "Mínimo 2 caracteres";
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Correo inválido";
  if (changePassword) {
    if (password.length < 6) errs.password = "Mínimo 6 caracteres";
    if (password !== confirmPassword) errs.confirmPassword = "Las contraseñas no coinciden";
  }
  return errs;
};

// SUbcomponent: campo de formulario
function Field({ label, id, type = "text", value, onChange, error, placeholder, icon, rightSlot }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-bold text-[#6E2594] font-['Alata',sans-serif] tracking-wide">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E2594]/50 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-11" : "pl-4"} ${rightSlot ? "pr-12" : "pr-4"} py-3 rounded-2xl bg-white border-2 font-['Alata',sans-serif] text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-200
            ${error ? "border-[#FF0063] focus:border-[#FF0063]" : "border-[#FFE74C] focus:border-[#6E2594]"}`}
        />
        {rightSlot && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</span>
        )}
      </div>
      {error && (
        <p className="text-xs text-[#FF0063] font-semibold font-['Alata',sans-serif] ml-1">{error}</p>
      )}
    </div>
  );
}
export default function UserProfile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  // Estado del usuario
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [changePassword, setChangePassword] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Cargar usuario desde localStorage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm({ name: parsed.name || "", email: parsed.email || "", password: "", confirmPassword: "" });
        if (parsed.pfp) {
          setAvatarPreview(`http://localhost/Alebrijes_BackEnd_PHP/alebrijes/${parsed.pfp}`);
          }
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Guardar
  const handleSave = async () => {
      const errs = validate({ ...form, changePassword });
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
      setErrors({});

      // Armar FormData para poder enviar la foto
      const fd = new FormData();
      fd.append("id_user", user.id_user);
      if (form.name  !== user.name)  fd.append("name",  form.name.trim());
      if (form.email !== user.email) fd.append("email", form.email.trim());
      if (changePassword)            fd.append("password", form.password);
      if (avatarFile)                fd.append("pfp", avatarFile);

      try {
          const res = await fetch("Alebrijes_BackEnd_PHP/alebrijes/api/users.php", {
              method: "PUT",
              body: fd 
          });
          const data = await res.json();

          if (!res.ok) { setErrors({ general: data.error }); return; }

          // Actualizar localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          setSaved(true);
          setChangePassword(false);
          setForm(f => ({ ...f, password: "", confirmPassword: "" }));
          setTimeout(() => setSaved(false), 3000);

      } catch {
          setErrors({ general: "No se pudo conectar al servidor" });
      }
  };


  if (!user || !mounted) return null;

  const eyeIcon = (show, toggle) => (
    <button type="button" onClick={toggle} className="text-[#6E2594]/40 hover:text-[#6E2594] transition-colors">
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
          <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM21.25 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 21.25 12ZM8.25 12a3.75 3.75 0 0 1 3.75-3.75c.183 0 .363.013.54.039L8.289 12.54A3.736 3.736 0 0 1 8.25 12ZM11.998 17.25c-1.739 0-3.37-.44-4.793-1.216L5.37 14.2A11.21 11.21 0 0 1 1.325 12.55a1.125 1.125 0 0 1 0-1.1 11.248 11.248 0 0 1 2.63-4.31l3.1 3.1A5.25 5.25 0 0 0 8.25 12c0 2.9 2.35 5.25 5.25 5.25.182 0 .362-.01.54-.03l1.84 1.84a11.241 11.241 0 0 1-3.882.69Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-['Alata',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alata&family=Lobster+Two:ital,wght@1,700&display=swap');
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp .5s ease-out forwards; }
        .fade-up-1 { animation: fadeUp .5s .1s ease-out both; }
        .fade-up-2 { animation: fadeUp .5s .2s ease-out both; }
        .fade-up-3 { animation: fadeUp .5s .3s ease-out both; }
      `}</style>

      <Navbar />

      {/* Hero banner */}
      <div className="relative bg-[#FFA414] pt-20 pb-32 px-6 overflow-hidden">
        {/* Círculos decorativos */}
        
        <div className="max-w-3xl mx-auto text-center relative z-10 fade-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-white font-['Lobster_Two',cursive] italic drop-shadow-lg">
            Mi Perfil
          </h1>
          <p className="text-white/70 mt-2 text-sm tracking-wide font-['Alata',sans-serif]">
            Actualiza tu información personal
          </p>
        </div>

        {/* Scalloped bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-10 sm:h-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path fill="#FFF8E7" d="M0,60 L0,0 C40,30 80,30 120,0 C160,30 200,30 240,0 C280,30 320,30 360,0 C400,30 440,30 480,0 C520,30 560,30 600,0 C640,30 680,30 720,0 C760,30 800,30 840,0 C880,30 920,30 960,0 C1000,30 1040,30 1080,0 C1120,30 1160,30 1200,0 C1240,30 1280,30 1320,0 C1360,30 1400,30 1440,0 L1440,60 Z" />
          </svg>
        </div>
      </div>

      {/* Tarjeta principal — sobresale sobre el banner */}
      <div className="max-w-2xl mx-auto px-4 -mt-16 pb-16 relative z-20">

        {/* Toast de guardado */}
        {saved && (
          <div className="mb-4 px-5 py-3 rounded-2xl bg-[#3BCEAC] text-white font-bold text-sm flex items-center gap-2 shadow-lg fade-up font-['Alata',sans-serif]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>
            ¡Perfil actualizado exitosamente!
          </div>
        )}

        {/* Avatar */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-5 fade-up-1">
          <h2 className="text-lg font-bold text-[#6E2594] mb-6 font-['Alata',sans-serif] flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#6E2594]/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 fill-[#6E2594]">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
            </span>
            Foto de perfil
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar preview */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#FFE74C] shadow-lg bg-gradient-to-br from-[#6E2594] to-[#FF0063] flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white select-none font-['Alata',sans-serif]">
                    {getInitials(form.name)}
                  </span>
                )}
              </div>
              {/* Botón de cámara superpuesto */}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#FF0063] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                  <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

            {/* Acciones */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={() => fileRef.current?.click()}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#6E2594] to-[#FF0063] text-white text-sm font-bold hover:opacity-90 hover:scale-[1.02] transition-all shadow-md font-['Alata',sans-serif]"
              >
                Subir foto
              </button>
              {avatarPreview && (
                <button
                  onClick={handleRemoveAvatar}
                  className="px-6 py-2.5 rounded-2xl border-2 border-gray-200 text-gray-500 text-sm font-bold hover:border-[#FF0063] hover:text-[#FF0063] transition-all font-['Alata',sans-serif]"
                >
                  Quitar foto
                </button>
              )}
              <p className="text-xs text-gray-400 font-['Alata',sans-serif]">JPG, PNG o GIF · Máx. 5 MB</p>
            </div>
          </div>
        </div>

        {/* Datos personales */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-5 fade-up-2">
          <h2 className="text-lg font-bold text-[#FF0063] mb-6 font-['Alata',sans-serif] flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#FF0063]/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 fill-[#FF0063]">
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
              </svg>
            </span>
            Datos personales
          </h2>

          <div className="flex flex-col gap-5">
            <Field
              label="Nombre de usuario"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tu nombre completo"
              error={errors.name}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
              }
            />
            <Field
              label="Correo electrónico"
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@correo.com"
              error={errors.email}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-8 fade-up-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#FFA414] font-['Alata',sans-serif] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FFA414]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 fill-[#FFA414]">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                </svg>
              </span>
              Contraseña
            </h2>
            {/* Toggle cambiar contraseña */}
            <button
              onClick={() => { setChangePassword((v) => !v); setErrors({}); setForm((f) => ({ ...f, password: "", confirmPassword: "" })); }}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${changePassword ? "bg-[#FFA414]" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${changePassword ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>

          {!changePassword ? (
            <p className="text-sm text-gray-400 font-['Alata',sans-serif]">
              Activa el interruptor para cambiar tu contraseña.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              <Field
                label="Nueva contraseña"
                id="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                error={errors.password}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                  </svg>
                }
                rightSlot={eyeIcon(showPass, () => setShowPass((v) => !v))}
              />
              <Field
                label="Confirmar contraseña"
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                error={errors.confirmPassword}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                  </svg>
                }
                rightSlot={eyeIcon(showConfirm, () => setShowConfirm((v) => !v))}
              />
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-base hover:border-[#6E2594] hover:text-[#6E2594] transition-all font-['Alata',sans-serif]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#FF0063] to-[#6E2594] text-white font-bold text-base hover:opacity-90 hover:scale-[1.01] transition-all shadow-lg font-['Alata',sans-serif]"
          >
            Guardar cambios
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}