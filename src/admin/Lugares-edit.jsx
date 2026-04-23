import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar';
import MobileHeader from './components/mobile-header';
import DashboardHeader from './components/dashboard-header';
import ImageUpload from './components/image-upload';
import FileUpload from './components/file-upload';
import FormActions from './components/forms-actions';

const API_BASE = 'http://localhost/Alebrijes_BackEnd_PHP/alebrijes/api/places.php';

const MEXICO_STATES = [
  { id: 'AGU', name: 'Aguascalientes' },
  { id: 'BCN', name: 'Baja California' },
  { id: 'BCS', name: 'Baja California Sur' },
  { id: 'CAM', name: 'Campeche' },
  { id: 'CHP', name: 'Chiapas' },
  { id: 'CHH', name: 'Chihuahua' },
  { id: 'CMX', name: 'Ciudad de México' },
  { id: 'COA', name: 'Coahuila' },
  { id: 'COL', name: 'Colima' },
  { id: 'DUR', name: 'Durango' },
  { id: 'GUA', name: 'Guanajuato' },
  { id: 'GRO', name: 'Guerrero' },
  { id: 'HID', name: 'Hidalgo' },
  { id: 'JAL', name: 'Jalisco' },
  { id: 'MEX', name: 'Estado de México' },
  { id: 'MIC', name: 'Michoacán' },
  { id: 'MOR', name: 'Morelos' },
  { id: 'NAY', name: 'Nayarit' },
  { id: 'NLE', name: 'Nuevo León' },
  { id: 'OAX', name: 'Oaxaca' },
  { id: 'PUE', name: 'Puebla' },
  { id: 'QUE', name: 'Querétaro' },
  { id: 'ROO', name: 'Quintana Roo' },
  { id: 'SLP', name: 'San Luis Potosí' },
  { id: 'SIN', name: 'Sinaloa' },
  { id: 'SON', name: 'Sonora' },
  { id: 'TAB', name: 'Tabasco' },
  { id: 'TAM', name: 'Tamaulipas' },
  { id: 'TLA', name: 'Tlaxcala' },
  { id: 'VER', name: 'Veracruz' },
  { id: 'YUC', name: 'Yucatán' },
  { id: 'ZAC', name: 'Zacatecas' },
];

const LAT_REGEX = /^-?(([0-8]?\d)(\.\d+)?|90(\.0+)?)$/;
const LNG_REGEX = /^-?((1[0-7]\d|[0-9]{1,2})(\.\d+)?|180(\.0+)?)$/;

const VALIDATIONS = {
  name: {
    validate: (v) => v.trim().length >= 3 && v.trim().length <= 150,
    message: 'El nombre debe tener entre 3 y 150 caracteres.'
  },
  latitude: {
    validate: (v) => LAT_REGEX.test(String(v).trim()),
    message: 'Latitud inválida. Debe estar entre -90 y 90 (ej: 19.4326).'
  },
  longitude: {
    validate: (v) => LNG_REGEX.test(String(v).trim()),
    message: 'Longitud inválida. Debe estar entre -180 y 180 (ej: -99.1332).'
  },
  schedule: {
    validate: (v) => v.trim().length >= 3 && v.trim().length <= 200,
    message: 'El horario es requerido (ej: 9:00-18:00).'
  },
  stateCode: {
    validate: (v) => v !== '',
    message: 'Selecciona el estado al que pertenece el lugar.'
  },
  image: {
    validate: (v) => v !== null && v !== '',
    message: 'La imagen del lugar es obligatoria.'
  }
};

const emptyForm = {
  name:         '',
  latitude:     '',
  longitude:    '',
  schedule:     '',
  stateCode:    '',
  image:        null,
  imagePreview: null,
  video:        null,
  videoName:    '',
  audio:        null,
  audioName:    ''
};

const emptyErrors = {
  name: false, latitude: false, longitude: false,
  schedule: false, stateCode: false, image: false
};

// Muestra el valor actual de la BD debajo del campo, solo en modo edición
function CurrentValue({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <p className="mt-1.5 ml-1 text-xs text-gray-400 flex items-center gap-1">
      <svg className="w-3 h-3 text-[#3BCEAC] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd" />
      </svg>
      <span>
        {label && <span className="font-semibold">{label}: </span>}
        <span className="text-gray-500">{value}</span>
      </span>
    </p>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="mt-2 mb-1 flex items-center gap-2 text-[#FF0063] text-sm font-semibold">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none transition-all ${
    hasError
      ? 'bg-red-50 ring-2 ring-[#FF0063] focus:ring-[#FF0063]'
      : 'bg-gray-200 focus:ring-2 focus:ring-[#FF0063]'
  }`;

export default function LugaresEdit() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const placeId   = location.state?.placeId ?? null;
  const isEditing = placeId !== null;

  const [activeSection,    setActiveSection]    = useState('LUGARES');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData,         setFormData]         = useState(emptyForm);
  // Valores originales de la API, usados solo como referencia visual debajo de cada campo
  const [originalData,     setOriginalData]     = useState(null);
  const [errors,           setErrors]           = useState(emptyErrors);
  const [submitted,        setSubmitted]        = useState(false);
  const [loadingDetail,    setLoadingDetail]    = useState(isEditing);
  const [loadError,        setLoadError]        = useState(null);

  const menuItems = [
    { id: 'DASHBOARD',   label: 'DASHBOARD'   },
    { id: 'LANDING',     label: 'LANDING'     },
    { id: 'CATALOGO',    label: 'CATALOGO'    },
    { id: 'NOSOTROS',    label: 'NOSOTROS'    },
    { id: 'CONTACTANOS', label: 'CONTACTANOS' },
    { id: 'LUGARES',     label: 'LUGARES'     },
  ];

  // Cargar detalle del lugar cuando hay un id
  useEffect(() => {
    if (!isEditing) return;

    const fetchDetail = async () => {
      try {
        setLoadingDetail(true);
        setLoadError(null);
        const res = await fetch(`${API_BASE}?action=detail&id=${placeId}`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const json = await res.json();

        // La API envuelve la respuesta en { success, data }
        const place = json.data ?? json;

        // imageUrl puede venir como string vacío "" — tratarlo como null
        const imageUrl = place.imageUrl && place.imageUrl.trim() !== '' ? place.imageUrl : null;

        const mapped = {
          name:         place.name       ?? '',
          latitude:     place.lat        ?? '',
          longitude:    place.lng        ?? '',
          schedule:     place.storeHours ?? '',
          stateCode:    place.stateCode  ?? '',
          image:        imageUrl,
          imagePreview: imageUrl,
          video:        null,
          videoName:    place.videoUrl   ? place.videoUrl : '',
          audio:        null,
          audioName:    place.audioUrl   ? place.audioUrl : '',
        };

        setFormData(mapped);

        // Guardar los valores originales para los previews debajo de cada campo
        setOriginalData({
          name:      place.name       ?? null,
          latitude:  place.lat        ?? null,
          longitude: place.lng        ?? null,
          schedule:  place.storeHours ?? null,
          stateCode: place.stateCode  ?? null,
          imageUrl:  imageUrl,
          videoUrl:  place.videoUrl   ?? null,
          audioUrl:  place.audioUrl   ?? null,
        });
      } catch (err) {
        setLoadError('No se pudo cargar la información del lugar.');
        console.error(err);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [placeId]);

  // Validación
  const validateField = (field, value) => {
    const rule = VALIDATIONS[field];
    return rule && !rule.validate(value) ? rule.message : false;
  };

  const validateAll = () => {
    const newErrors = {
      name:      validateField('name',      formData.name),
      latitude:  validateField('latitude',  formData.latitude),
      longitude: validateField('longitude', formData.longitude),
      schedule:  validateField('schedule',  formData.schedule),
      stateCode: validateField('stateCode', formData.stateCode),
      image:     validateField('image',     formData.image),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // Handlers
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (submitted) setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleBlur = (field) =>
    setErrors((prev) => ({ ...prev, [field]: validateField(field, formData[field]) }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    if (submitted) setErrors((prev) => ({ ...prev, image: false }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, video: file, videoName: file.name }));
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, audio: file, audioName: file.name }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!validateAll()) return;

    const payload = {
      ...(isEditing && { id: placeId }),
      name:        formData.name.trim(),
      latitude:    parseFloat(formData.latitude),
      longitude:   parseFloat(formData.longitude),
      store_hours: formData.schedule.trim(),
      state_code:  formData.stateCode,
      image:       formData.image instanceof File ? formData.image : undefined,
      video_url:   formData.video ?? null,
      audio_url:   formData.audio ?? null,
    };
    console.log('Payload para API:', payload);
    alert(isEditing ? '¡Lugar actualizado exitosamente!' : '¡Lugar guardado exitosamente!');
  };

  const handleCancel = () => navigate('/lugares-ad');

  // Nombre completo del estado para el preview del dropdown
  const nombreEstadoOriginal = originalData?.stateCode
    ? MEXICO_STATES.find(s => s.id === originalData.stateCode)?.name ?? originalData.stateCode
    : null;

  // Pantalla de carga
  if (loadingDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFE74C] via-[#FFE74C] to-[#3BCEAC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#FF0063] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 font-medium">Cargando lugar...</p>
        </div>
      </div>
    );
  }

  // Error de carga
  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFE74C] via-[#FFE74C] to-[#3BCEAC]">
        <div className="bg-white rounded-3xl p-12 shadow-xl flex flex-col items-center gap-4 max-w-md text-center">
          <svg className="w-12 h-12 text-[#FF0063]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-[#FF0063] font-semibold text-lg">{loadError}</p>
          <button
            onClick={() => navigate('/lugares-ad')}
            className="mt-2 px-8 py-3 bg-[#6E2594] text-white rounded-2xl font-bold hover:bg-[#5a1d7a] transition-colors"
          >
            Volver a Lugares
          </button>
        </div>
      </div>
    );
  }

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
          background-position: right 1.25rem center;
          background-size: 1.25rem;
          padding-right: 3.5rem;
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

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
            {isEditing ? 'EDITAR LUGAR' : 'NUEVO LUGAR'}
          </h2>
          {isEditing && <p className="text-xs text-gray-400 mb-8">ID: {placeId}</p>}
          {!isEditing && <div className="mb-8" />}

          {/* Imagen — imagePreview ya trae la URL actual de la BD */}
          <ImageUpload
            imagePreview={formData.imagePreview}
            onImageUpload={handleImageUpload}
            required
          />
          {isEditing && originalData?.imageUrl && (
            <CurrentValue label="URL actual" value={originalData.imageUrl} />
          )}
          {errors.image && <div className="mt-2 mb-4"><ErrorMessage message={errors.image} /></div>}

          {/* Nombre */}
          <div className="mb-6 mt-6">
            <div className="flex justify-end mb-1">
              <span className={`text-xs ${formData.name.length > 150 ? 'text-[#FF0063] font-bold' : 'text-gray-400'}`}>
                {formData.name.length}/150
              </span>
            </div>
            <input
              type="text"
              placeholder="Nombre del lugar"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              maxLength={155}
              className={inputClass(errors.name)}
            />
            {isEditing && <CurrentValue label="Actual" value={originalData?.name} />}
            {errors.name && <ErrorMessage message={errors.name} />}
          </div>

          {/* Coordenadas */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-500 mb-3">
              Coordenadas{' '}
              <span className="font-normal text-gray-400">(clic derecho en Google Maps)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1 ml-1">Latitud · entre -90 y 90</p>
                <input
                  type="number"
                  step="any"
                  placeholder="19.4326"
                  value={formData.latitude}
                  onChange={(e) => handleFieldChange('latitude', e.target.value)}
                  onBlur={() => handleBlur('latitude')}
                  className={inputClass(errors.latitude)}
                />
                {isEditing && <CurrentValue label="Actual" value={originalData?.latitude} />}
                {errors.latitude && <ErrorMessage message={errors.latitude} />}
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 ml-1">Longitud · entre -180 y 180</p>
                <input
                  type="number"
                  step="any"
                  placeholder="-99.1332"
                  value={formData.longitude}
                  onChange={(e) => handleFieldChange('longitude', e.target.value)}
                  onBlur={() => handleBlur('longitude')}
                  className={inputClass(errors.longitude)}
                />
                {isEditing && <CurrentValue label="Actual" value={originalData?.longitude} />}
                {errors.longitude && <ErrorMessage message={errors.longitude} />}
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-1 ml-1">Estado</p>
            <select
              value={formData.stateCode}
              onChange={(e) => handleFieldChange('stateCode', e.target.value)}
              onBlur={() => handleBlur('stateCode')}
              className={`select-styled ${inputClass(errors.stateCode)} ${
                formData.stateCode === '' ? 'text-gray-500' : 'text-gray-700'
              }`}
            >
              <option value="" disabled>Selecciona un estado…</option>
              {MEXICO_STATES.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name} · {state.id}
                </option>
              ))}
            </select>
            {isEditing && (
              <CurrentValue
                label="Actual"
                value={nombreEstadoOriginal
                  ? `${nombreEstadoOriginal} · ${originalData.stateCode}`
                  : null}
              />
            )}
            {errors.stateCode && <ErrorMessage message={errors.stateCode} />}
          </div>

          {/* Horario */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-1 ml-1">
              Horario de atención · {String(formData.schedule).length}/200
            </p>
            <input
              type="text"
              placeholder="9:00-18:00"
              value={formData.schedule}
              onChange={(e) => handleFieldChange('schedule', e.target.value)}
              onBlur={() => handleBlur('schedule')}
              maxLength={205}
              className={inputClass(errors.schedule)}
            />
            {isEditing && <CurrentValue label="Actual" value={originalData?.schedule} />}
            {errors.schedule && <ErrorMessage message={errors.schedule} />}
          </div>

          {/* Video */}
          <p className="text-sm font-bold text-gray-500 mb-1 ml-1">
            Video{' '}
            <span className="font-normal text-gray-400">(opcional · mp4, webm, mov, avi · máx. 100 MB)</span>
          </p>
          {isEditing && (originalData?.videoUrl
            ? <CurrentValue label="URL actual" value={originalData.videoUrl} />
            : <p className="text-xs text-gray-400 ml-1 mb-1">Sin video actualmente</p>
          )}
          <div className="mt-2">
            <FileUpload
              type="video"
              file={formData.video}
              fileName={formData.videoName}
              onFileUpload={handleVideoUpload}
            />
          </div>

          {/* Audio */}
          <p className="text-sm font-bold text-gray-500 mb-1 ml-1">
            Audio{' '}
            <span className="font-normal text-gray-400">(opcional · mp3, wav, ogg, aac · máx. 20 MB)</span>
          </p>
          {isEditing && (originalData?.audioUrl
            ? <CurrentValue label="URL actual" value={originalData.audioUrl} />
            : <p className="text-xs text-gray-400 ml-1 mb-1">Sin audio actualmente</p>
          )}
          <div className="mt-2">
            <FileUpload
              type="audio"
              file={formData.audio}
              fileName={formData.audioName}
              onFileUpload={handleAudioUpload}
            />
          </div>

          <FormActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            cancelText="Volver"
            submitText={isEditing ? 'Actualizar' : 'Guardar'}
          />
        </div>
      </main>
    </div>
  );
}