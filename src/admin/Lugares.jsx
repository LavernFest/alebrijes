import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import ListItem from './components/list-items';

const API_BASE = 'http://localhost/Alebrijes_BackEnd_PHP/alebrijes/api/places.php';

export default function Lugares() {
  const navigate = useNavigate();
  const [activeSection,    setActiveSection]    = useState('LUGARES');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lugares,          setLugares]          = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);
  const [filtroEstado,     setFiltroEstado]     = useState('TODOS');

  const menuItems = [
    { id: 'DASHBOARD',   label: 'DASHBOARD'   },
    { id: 'LANDING',     label: 'LANDING'     },
    { id: 'CATALOGO',    label: 'CATALOGO'    },
    { id: 'NOSOTROS',    label: 'NOSOTROS'    },
    { id: 'CONTACTANOS', label: 'CONTACTANOS' },
    { id: 'LUGARES',     label: 'LUGARES'     },
  ];

  // Cargar lista desde la API
  useEffect(() => {
    const fetchLugares = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}?action=list`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)   ? data.data
          : Array.isArray(data.places) ? data.places
          : Array.isArray(data.result) ? data.result
          : [];
        setLugares(list);
      } catch (err) {
        setError('No se pudo cargar la lista de lugares. Verifica la conexión.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLugares();
  }, []);

  // Códigos de estado únicos presentes en la lista, ordenados alfabéticamente
  const estadosDisponibles = useMemo(() => {
    const codigos = [...new Set(lugares.map(l => l.stateCode).filter(Boolean))];
    return codigos.sort();
  }, [lugares]);

  // Lista filtrada según el estado seleccionado
  const lugaresFiltrados = useMemo(() => {
    if (filtroEstado === 'TODOS') return lugares;
    return lugares.filter(l => l.stateCode === filtroEstado);
  }, [lugares, filtroEstado]);

  const handleEdit = (id) => {
    navigate('/lugares-ad-edit', { state: { placeId: id } });
  };

  const handleCreate = () => {
    navigate('/lugares-ad-edit', { state: { placeId: null } });
  };

  const handleDelete = (id) => {
    const lugar = lugares.find(l => l.id === id);
    const confirmed = window.confirm(`¿Estás seguro de eliminar "${lugar?.name}"?`);
    if (confirmed) {
      setLugares(prev => prev.filter(l => l.id !== id));
      // TODO: llamar API de eliminación cuando esté disponible
    }
  };

  const handleGoBack = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#FFE74C] via-[#FFE74C] to-[#3BCEAC] font-['Alata',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alata&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .select-styled {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236E2594' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.1rem;
          padding-right: 2.75rem;
        }
      `}</style>

      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      />
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <DashboardHeader />

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl fade-in-up">

          {/* Encabezado con título y filtro en la misma fila */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              LUGARES
            </h2>

            {/* Filtro — solo se muestra cuando hay datos */}
            {!loading && !error && lugares.length > 0 && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-gray-500 whitespace-nowrap">
                  Filtrar por estado:
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="select-styled bg-gray-100 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF0063] transition-all cursor-pointer"
                >
                  <option value="TODOS">Todos ({lugares.length})</option>
                  {estadosDisponibles.map(codigo => (
                    <option key={codigo} value={codigo}>
                      {codigo} ({lugares.filter(l => l.stateCode === codigo).length})
                    </option>
                  ))}
                </select>

                {/* Botón limpiar filtro */}
                {filtroEstado !== 'TODOS' && (
                  <button
                    onClick={() => setFiltroEstado('TODOS')}
                    className="flex items-center gap-1 px-3 py-2 bg-[#FF0063] text-white text-xs font-bold rounded-full hover:bg-[#cc004f] transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpiar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Indicador de resultados cuando hay filtro activo */}
          {!loading && !error && filtroEstado !== 'TODOS' && (
            <p className="text-sm text-gray-400 mb-4 -mt-4">
              Mostrando {lugaresFiltrados.length} lugar{lugaresFiltrados.length !== 1 ? 'es' : ''} en{' '}
              <span className="font-bold text-[#6E2594]">{filtroEstado}</span>
            </p>
          )}

          <div className="mb-8">
            {/* Estado de carga */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-10 h-10 border-4 border-[#FF0063] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-lg">Cargando lugares...</p>
              </div>
            )}

            {/* Error de red */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <svg className="w-12 h-12 text-[#FF0063]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-[#FF0063] font-semibold text-center">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-6 py-2 bg-[#6E2594] text-white rounded-full text-sm font-bold hover:bg-[#5a1d7a] transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Lista vacía global */}
            {!loading && !error && lugares.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <p className="text-xl">No hay lugares registrados</p>
              </div>
            )}

            {/* Sin resultados para el filtro actual */}
            {!loading && !error && lugares.length > 0 && lugaresFiltrados.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-xl">No hay lugares en el estado <span className="font-bold text-[#6E2594]">{filtroEstado}</span></p>
                <button
                  onClick={() => setFiltroEstado('TODOS')}
                  className="mt-4 px-6 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-300 transition-colors"
                >
                  Ver todos los lugares
                </button>
              </div>
            )}

            {/* Lista de lugares filtrada */}
            {!loading && !error && lugaresFiltrados.map((lugar, index) => (
              <div
                key={lugar.id}
                className="fade-in-up"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <ListItem
                  name={`${lugar.name} · ${lugar.stateCode}`}
                  onEdit={() => handleEdit(lugar.id)}
                  onDelete={() => handleDelete(lugar.id)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={handleGoBack}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-8 rounded-2xl text-lg sm:text-xl transition-colors"
            >
              Regresar
            </button>
            <button
              onClick={handleCreate}
              className="bg-[#6E2594] hover:bg-[#5a1d7a] text-white font-bold py-4 px-8 rounded-2xl text-lg sm:text-xl transition-all shadow-lg"
            >
              Agregar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}