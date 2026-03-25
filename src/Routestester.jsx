import { Link, useLocation } from 'react-router-dom'

const routes = [
  { path: '/map', label: 'Map', group: 'Usuario' },
  { path: '/', label: 'Landing', group: 'Usuario' },
  { path: '/admin-dashboard', label: 'Dashboard', group: 'Admin' },
  { path: '/contactanos-ad', label: 'Contáctanos', group: 'Admin' },
  { path: '/nosotros-ad', label: 'Nosotros Admin', group: 'Admin' },
  { path: '/lugares-ad', label: 'Lugares', group: 'Admin' },
  { path: '/lugares-ad-edit', label: 'Lugares Edit', group: 'Admin' },
  { path: '/landing-ad', label: 'Landing Admin', group: 'Admin' },
  { path: '/login', label: 'Login', group: 'Usuario' },
  { path: '/nosotros', label: 'Nosotros', group: 'Usuario' },
  { path: '/perfil-edit', label: 'Usuario Panel', group: 'Usuario' },
]

const groupColors = {
  Usuario: { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  Admin:   { badge: 'bg-violet-100 text-violet-700',  dot: 'bg-violet-400'  },
}

export default function DevNav() {
  const location = useLocation()
  const groups = [...new Set(routes.map(r => r.group))]

  return (
    <div className="fixed bottom-4 right-4 z-[2001]">
      {/* Toggle checkbox trick */}
      <input type="checkbox" id="devnav-toggle" className="hidden peer" />

      {/* Panel */}
      <div className="hidden peer-checked:block mb-2 w-64 rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <span className="ml-2 text-xs font-mono text-gray-400 tracking-widest uppercase">Dev Routes</span>
        </div>

        {/* Routes */}
        <div className="p-3 space-y-3">
          {groups.map(group => (
            <div key={group}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1 px-1">{group}</p>
              <div className="space-y-1">
                {routes.filter(r => r.group === group).map(route => {
                  const isActive = location.pathname === route.path
                  const colors = groupColors[group]
                  return (
                    <Link
                      key={route.path}
                      to={route.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all
                        ${isActive
                          ? 'bg-gray-900 text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : colors.dot}`}></span>
                        {route.label}
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-white/20 text-white' : colors.badge}`}>
                        {route.path}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Current path */}
        <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
          <p className="text-[10px] text-gray-400 font-mono">
            current: <span className="text-gray-700">{location.pathname}</span>
          </p>
        </div>
      </div>

      {/* Toggle button */}
      <label
        htmlFor="devnav-toggle"
        className="flex items-center gap-2 cursor-pointer ml-auto w-fit bg-gray-900 hover:bg-gray-700 text-white text-xs font-mono px-4 py-2 rounded-full shadow-lg transition-all select-none"
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        DEV NAV
      </label>
    </div>
  )
}