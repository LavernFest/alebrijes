export default function Sidebar({ activeSection, setActiveSection, menuItems }) {
  return (
    <>
      <style>
        {`
          .scalloped-edge {
          
            clip-path: url(#scalloped);
          }

          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }

          @media (max-width: 1024px) {
            .scalloped-edge {
              clip-path: none;
            }
          }
        `}
      </style>

      <svg width="0" height="0">
        <defs>
          <clipPath id="scalloped" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 0,1 L 1,1 
                     C 1,0.97 0.98,0.95 0.96,0.95
                     C 0.98,0.95 1,0.93 1,0.90
                     C 1,0.87 0.98,0.85 0.96,0.85
                     C 0.98,0.85 1,0.83 1,0.80
                     C 1,0.77 0.98,0.75 0.96,0.75
                     C 0.98,0.75 1,0.73 1,0.70
                     C 1,0.67 0.98,0.65 0.96,0.65
                     C 0.98,0.65 1,0.63 1,0.60
                     C 1,0.57 0.98,0.55 0.96,0.55
                     C 0.98,0.55 1,0.53 1,0.50
                     C 1,0.47 0.98,0.45 0.96,0.45
                     C 0.98,0.45 1,0.43 1,0.40
                     C 1,0.37 0.98,0.35 0.96,0.35
                     C 0.98,0.35 1,0.33 1,0.30
                     C 1,0.27 0.98,0.25 0.96,0.25
                     C 0.98,0.25 1,0.23 1,0.20
                     C 1,0.17 0.98,0.15 0.96,0.15
                     C 0.98,0.15 1,0.13 1,0.10
                     C 1,0.07 0.98,0.05 0.96,0.05
                     C 0.98,0.05 1,0.03 1,0
                     Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 bg-gradient-to-b from-[#FF0063] to-[#6E2594] relative scalloped-edge flex-col py-8 px-6 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-xl float-animation overflow-hidden">
            <img 
              src='/assets/alebrije.png' 
              alt='Alebrije Logo' 
              className='w-50 h-50 object-contain'
            />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-6 py-4 rounded-full text-xl font-bold tracking-wide transition-all duration-300 ${
                activeSection === item.id
                  ? 'bg-white text-[#FF0063] shadow-lg scale-105'
                  : 'text-white hover:bg-white/20 hover:scale-105'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}