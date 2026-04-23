import React, { useState } from 'react';

// Formatos permitidos para imágenes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export default function ImageUpload({ imagePreview, onImageUpload, required = false }) {
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = (file) => {
    if (!file) return 'No se seleccionó ningún archivo.';

    // Validar tipo MIME
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `Formato no permitido. Solo se aceptan: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`;
    }

    // Validar extensión (doble check)
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      return `Extensión no válida. Usa: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`;
    }

    // Validar tamaño
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      return `La imagen pesa ${sizeMB} MB. El máximo permitido es ${MAX_IMAGE_SIZE_MB} MB.`;
    }

    return null; // sin error
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = ''; // limpiar input
      return;
    }

    setError('');
    onImageUpload(e);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    // Crear un evento sintético compatible con el handler del padre
    const syntheticEvent = { target: { files: [file] } };
    onImageUpload(syntheticEvent);
  };

  return (
    <div className="mb-6">
      <label className="block w-full">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-2xl h-48 sm:h-56 lg:h-64 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden border-2 border-dashed
            ${error
              ? 'bg-red-50 border-[#FF0063]'
              : isDragOver
                ? 'bg-purple-50 border-[#6E2594] scale-[1.01]'
                : imagePreview
                  ? 'bg-gray-200 border-transparent'
                  : 'bg-gray-200 border-transparent hover:bg-gray-300'
            }`}
        >
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Overlay de reemplazo */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-sm font-bold">Cambiar imagen</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 px-4 text-center">
              <svg
                className={`w-16 h-16 transition-colors ${error ? 'text-[#FF0063]' : isDragOver ? 'text-[#6E2594]' : 'text-gray-400'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className={`text-base font-bold ${error ? 'text-[#FF0063]' : 'text-gray-500'}`}>
                  {isDragOver ? 'Suelta la imagen aquí' : 'Haz clic o arrastra una imagen'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {ALLOWED_IMAGE_EXTENSIONS.join(', ')} · Máx. {MAX_IMAGE_SIZE_MB} MB
                </p>
              </div>
            </div>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
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

      {/* Indicador de campo requerido */}
      {required && !imagePreview && !error && (
        <p className="mt-1 text-xs text-gray-500 ml-1">* La imagen es obligatoria</p>
      )}
    </div>
  );
}