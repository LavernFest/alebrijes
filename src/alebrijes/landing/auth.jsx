import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


const COLORS = {
  yellow: "#FFE74C",
  pink: "#FF0063",
  purple: "#6E2594",
  orange: "#FFA414",
  teal: "#3BCEAC",
  cream: "#FFF8E7",
};
const InputField = ({ id, label, type, value, onChange, placeholder, error, icon }) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-semibold mb-1 transition-colors duration-200"
        style={{ color: focused ? "#6E2594" : "#4a4a4a" }}
      >
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute inset-0 rounded-xl transition-all duration-300"
          style={{
            border: focused ? `2px solid #6E2594` : `2px solid ${error ? COLORS.pink : "#e0d0b0"}`,
            background: focused ? "#fff" : "FFF8E7",
            boxShadow: focused ? `0 0 0 4px #FFE74C 55` : "none",
            pointerEvents: "none",
          }}
        />
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-lg">{icon}</span>
        )}
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="relative w-full py-3 pr-10 rounded-xl outline-none text-sm bg-transparent z-10 text-[#2a1a3e]"
          style={{
            paddingLeft: icon ? "2.5rem" : "1rem",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-sm opacity-60 hover:opacity-100 transition-opacity text-[#6E2594]"
          >
            {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>
 : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
}
          </button>
        )}
      </div>
      {error && (
        <p
          className="text-xs mt-1 font-medium animate-pulse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
</svg>
 {error}
        </p>
      )}
    </div>
  );
};

const LoadingDots = () => (
  <span className="inline-flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full animate-bounce"
        style={{
          backgroundColor: "#fff",
          animationDelay: `${i * 0.15}s`,
          display: "inline-block",
        }}
      />
    ))}
  </span>
);

export default function AlebrijesAuth() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => setCardVisible(true), 100);
    // Load Google Font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Alata&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const switchMode = (newMode) => {
    if (newMode === mode || isAnimating) return;
    setIsAnimating(true);
    setErrors({});
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setShowForgot(false);
    setTimeout(() => {
      setMode(newMode);
      setIsAnimating(false);
    }, 350);
  };

  const validate = () => {
    const e = {};
    if (mode === "register" && !form.name.trim()) e.name = "El nombre es requerido";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Correo inválido";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (mode === "register" && form.password !== form.confirmPassword)
      e.confirmPassword = "Las contraseñas no coinciden";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/alebrijes/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.error });
      } else {
        localStorage.setItem("user", JSON.stringify(data.user))
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);    
      }
    } catch (err) {
      setErrors({ email: "No se pudo conectar al servidor" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!forgotEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setForgotSent(true);
  };
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#3BCEAC]"
    >
      {/* Main card */}
      <div
        className="relative w-full max-w-md mx-4 rounded-3xl overflow-hidden shadow-xl bg-[#FFF8E7]"
      >

        {/* Header with logo */}
        <div
          className="px-8 pt-8 pb-4 text-center"
        >
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <div
              className="flex items-center justify-center"
            >
                <img 
                    src="/assets/alebrije.png" 
                    alt="Alebrijes Logo"
                    className="w-25 h-20"
                />
            </div>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-gray-800 font-['Lobster_Two',cursive] italic"
          >
            Alebrijes
          </h1>
          <p className="text-sm mt-1 opacity-60 text-coal font-semibold">
            {mode === "login" ? "Bienvenido de vuelta" : "Únete a la comunidad"}
          </p>
        </div>

        {/* pills */}
        <div className="px-8 mb-2">
          <div
            className="flex rounded-2xl p-1"
          >
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{
                  background: mode === m ? "#6E2594" : "transparent",
                  color: mode === m ? "#fff" : "#6E2594",
                  boxShadow: mode === m ? `0 4px 12px #6E2594 44` : "none",
                  transform: mode === m ? "scale(1.02)" : "scale(1)",
                }}
              >
                {m === "login" ? "Iniciar Sesión" : "Registrarse"}
              </button>
            ))}
          </div>
        </div>

        {/* Form area */}
        <div className="px-8 pb-8">
          {/* Forgot password overlay */}
          {showForgot ? (
            <div
              className="py-4"
              style={{
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <button
                onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
                className="flex items-center gap-1 text-sm mb-4 opacity-60 hover:opacity-100 transition-opacity text-[#6E2594]"
              >
                Volver
              </button>
              <h3 className="text-lg font-bold mb-1 text-[#6E2594]">
                Recuperar contraseña
              </h3>
              <p className="text-xs mb-4 opacity-60">
                Te enviaremos un enlace a tu correo para restablecer tu contraseña.
              </p>
              {forgotSent ? (
                <div
                  className="text-center py-6 rounded-2xl bg-[#FFE74C]"
                >
                  <div className="text-3xl mb-2"></div>
                  <p className="font-semibold text-sm">
                    ¡Correo enviado!
                  </p>
                  <p className="text-xs mt-1 opacity-70">
                    Revisa tu bandeja de entrada
                  </p>
                </div>
              ) : (
                <>
                  <InputField
                    id="forgot-email"
                    label="Correo electrónico"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
</svg>
}
                  />
                  <button
                    onClick={handleForgot}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 mt-2 bg-[#FFE74C] text-[#212120]"
                  >
                    {isLoading ? <LoadingDots /> : "Enviar enlace"}
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Main form */
            <div
              style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? "translateY(12px)" : "translateY(0)",
                transition: "all 0.35s ease",
              }}
            >
              {/* Success toast */}
              {success && (
                <div
                  className="flex items-center gap-2 mb-4 py-3 px-4 rounded-xl text-sm font-semibold border-solid border-2 border-[#3BCEAC] bg-[3BCEAC]"
                  style={{
                    animation: "slideIn 0.3s ease-out",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3BCEAC" className="size-6">
  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
</svg>
 {mode === "login" ? "¡Sesión iniciada!" : "¡Cuenta creada exitosamente!"}
                </div>
              )}

              <div className="mt-4">
                {/* Name field - only in register */}
                <div
                  style={{
                    maxHeight: mode === "register" ? "120px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
                    opacity: mode === "register" ? 1 : 0,
                  }}
                >
                  <InputField
                    id="name"
                    label="Nombre completo"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre"
                    error={errors.name}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6E2594" className="size-6">
  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
</svg>
}
                  />
                </div>

                <InputField
                  id="email"
                  label="Correo electrónico"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@correo.com"
                  error={errors.email}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6E2594" className="size-6">
  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
</svg>

}
                />

                <InputField
                  id="password"
                  label="Contraseña"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  error={errors.password}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6E2594" className="size-6">
  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
</svg>
}
                />

                {/* Confirm password - only in register */}
                <div
                  style={{
                    maxHeight: mode === "register" ? "120px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.05s, opacity 0.3s ease 0.05s",
                    opacity: mode === "register" ? 1 : 0,
                  }}
                >
                  <InputField
                    id="confirmPassword"
                    label="Confirmar contraseña"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    error={errors.confirmPassword}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6E2594" className="size-6">
  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
</svg>}
                  />
                </div>

                {/* Forgot password link */}
                {mode === "login" && (
                  <div className="text-right -mt-2 mb-4">
                    <button
                      onClick={() => setShowForgot(true)}
                      className="text-xs font-semibold transition-all duration-200 hover:underline"
                      style={{ color: COLORS.pink, fontFamily: "'Alata', sans-serif" }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-300 mt-1 relative overflow-hidden"
                  style={{
                    fontFamily: "'Alata', sans-serif",
                    background: isLoading
                      ? COLORS.purple
                      : `linear-gradient(135deg, #6E2594 0%, #FF0063 100%)`,
                    boxShadow: isLoading
                      ? "none"
                      : `0 8px 24px #6E2594 55, 0 2px 8px #FF0063 33`,
                    transform: isLoading ? "scale(0.98)" : "scale(1)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {/* Shimmer effect */}
                  {!isLoading && (
                    <span
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: "linear-gradient(90deg, transparent, #fff, transparent)",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  )}
                  {isLoading ? (
                    <LoadingDots />
                  ) : mode === "login" ? (
                    "Iniciar Sesión"
                  ) : (
                    "Crear Cuenta"
                  )}
                </button>
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}