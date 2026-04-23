import React, { useState } from 'react';

// Configuración por tipo de archivo
const FILE_CONFIG = {
  video: {
    mimeTypes:  ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'],
    extensions: ['.mp4', '.webm', '.ogg', '.mov', '.avi'],
    maxSizeMB:  100,
    label:      'video',
    acceptAttr: 'video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo'
  },
  audio: {
    mimeTypes:  ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac'],
    extensions: ['.mp3', '.wav', '.ogg', '.aac', '.flac'],
    maxSizeMB:  20,
    label:      'audio',
    acceptAttr: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac,audio/flac'
  }
};

//Íconos
function VideoIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AudioIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
}

export default function FileUpload({ type = 'video', file, fileName, onFileUpload }) {
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const config = FILE_CONFIG[type];
  const isVideo = type === 'video';
  const Icon = isVideo ? VideoIcon : AudioIcon;

  //Validación
  const validateFile = (f) => {
    if (!f) return 'No se seleccionó ningún archivo.';

    // Validar tipo MIME
    if (!config.mimeTypes.includes(f.type)) {
      return `Formato no permitido. Solo se aceptan: ${config.extensions.join(', ')}`;
    }

    // Validar extensión (doble check)
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!config.extensions.includes(ext)) {
      return `Extensión no válida. Usa: ${config.extensions.join(', ')}`;
    }

    // Validar tamaño
    const maxBytes = config.maxSizeMB * 1024 * 1024;
    if (f.size > maxBytes) {
      const sizeMB = (f.size / 1024 / 1024).toFixed(1);
      return `El archivo pesa ${sizeMB} MB. El máximo para ${config.label} es ${config.maxSizeMB} MB.`;
    }

    return null;
  };

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      setError(err);
      e.target.value = '';
      return;
    }
    setError('');
    onFileUpload(e);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setError('');
    onFileUpload({ target: { files: [f] } });
  };

  // Render
  return (
    <div className="mb-6">
      <label className="block w-full">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-2xl h-32 sm:h-40 flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed relative overflow-hidden ${
            error
              ? 'bg-red-50 border-[#FF0063]'
              : isDragOver
                ? 'bg-purple-50 border-[#6E2594] scale-[1.01]'
                : file
                  ? 'bg-gray-200 border-transparent hover:bg-gray-300'
                  : 'bg-gray-200 border-transparent hover:bg-gray-300'
          }`}
        >
          {file ? (
            /* Archivo cargado */
            <div className="flex flex-col items-center gap-2 px-4">
              <Icon className="w-10 h-10 text-[#3BCEAC]" />
              <p className="text-sm text-gray-700 font-medium text-center truncate max-w-xs">
                {fileName}
              </p>
              <span className="text-xs text-[#6E2594] font-semibold bg-purple-100 px-3 py-1 rounded-full">
                Clic para cambiar
              </span>
            </div>
          ) : (
            /* Sin archivo */
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              <Icon className={`w-12 h-12 transition-colors ${
                error ? 'text-[#FF0063]' : isDragOver ? 'text-[#6E2594]' : 'text-gray-400'
              }`} />
              <p className={`text-sm font-bold transition-colors ${
                error ? 'text-[#FF0063]' : isDragOver ? 'text-[#6E2594]' : 'text-gray-500'
              }`}>
                {isDragOver
                  ? `Suelta el ${config.label} aquí`
                  : `Haz clic o arrastra un ${config.label}`}
              </p>
              <p className="text-xs text-gray-400">
                {config.extensions.join(', ')} · Máx. {config.maxSizeMB} MB
              </p>
            </div>
          )}
        </div>

        <input
          type="file"
          className="hidden"
          accept={config.acceptAttr}
          onChange={handleChange}
        />
      </label>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-[#FF0063] text-sm font-semibold">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}