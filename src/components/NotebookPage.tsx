import React from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  RotateCw, 
  Trash2, 
  Camera, 
  Plus, 
  Sparkles, 
  ChevronDown, 
  Loader2,
  FileText,
  AlignLeft
} from 'lucide-react';
import { EvidencePage, PhotoItem } from '../types';
import { formatDateToSpanish } from '../utils/dateUtils';
import { COMMON_ACTIVITY_SUGGESTIONS } from '../utils/sampleData';

interface NotebookPageProps {
  page: EvidencePage;
  pageNumber: number;
  totalPages: number;
  isProcessingPhotos?: boolean;
  onUpdateField: <K extends keyof EvidencePage>(field: K, value: EvidencePage[K]) => void;
  onAddPhotos: (files: FileList | null) => void;
  onRotatePhoto: (photoId: string) => void;
  onRemovePhoto: (photoId: string) => void;
  onOpenDatePicker: () => void;
  onOpenLocationPicker: () => void;
}

export const NotebookPage: React.FC<NotebookPageProps> = ({
  page,
  pageNumber,
  totalPages,
  isProcessingPhotos = false,
  onUpdateField,
  onAddPhotos,
  onRotatePhoto,
  onRemovePhoto,
  onOpenDatePicker,
  onOpenLocationPicker
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const photos = page.photos || [];
  const isPageBlank = photos.length === 0 && (!page.title || page.title.trim() === '');

  // Auto-resize textarea according to text content
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(84, textareaRef.current.scrollHeight)}px`;
    }
  }, [page.notes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddPhotos(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Friendly Step-by-Step Guide Banner (Shown when page is blank) */}
      {isPageBlank && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 sm:p-5 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center">
              💡
            </span>
            <h3 className="text-base font-extrabold text-blue-950">
              Pasos para llenar la Hoja #{pageNumber}:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs sm:text-sm">
            <div className="bg-white p-3 rounded-xl border border-blue-100 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-slate-900 block font-bold">1. Fotografías</strong>
                <span className="text-slate-600">Toca el recuadro para poner las fotos de la evidencia.</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-slate-900 block font-bold">2. Lugar o Dirección</strong>
                <span className="text-slate-600">Indica la calle, colonia o ubicación.</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-slate-900 block font-bold">3. Actividad realizada</strong>
                <span className="text-slate-600">Escribe el trabajo o elige una opción rápida.</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-100 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-slate-900 block font-bold">4. Observaciones</strong>
                <span className="text-slate-600">Detalles adicionales u observaciones del trabajo.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The Physical Paper Sheet (La Hoja de Reporte) */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-300 p-5 sm:p-8 md:p-10 transition-all space-y-6 min-h-[640px] flex flex-col justify-between">
        
        {/* Top Header Badge & Date Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-2">
            <span className="bg-blue-700 text-white font-extrabold text-sm sm:text-base px-3.5 sm:px-4 py-1.5 rounded-xl shadow-xs">
              Hoja #{pageNumber}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-500">
              de {totalPages} en el reporte
            </span>
          </div>

          {/* Date Selector Button */}
          <button
            type="button"
            onClick={onOpenDatePicker}
            className="group flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-2xl text-left transition-all cursor-pointer w-full sm:w-auto"
            title="Toca para seleccionar o cambiar la fecha"
          >
            <CalendarIcon className="w-5 h-5 text-blue-700 shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] uppercase font-extrabold text-blue-800 block">
                Fecha del reporte
              </span>
              {page.date && page.date.trim() ? (
                <span className="text-sm sm:text-base font-extrabold text-slate-900 block">
                  {formatDateToSpanish(page.date)}
                </span>
              ) : (
                <span className="text-xs sm:text-sm font-bold text-blue-700 block leading-tight">
                  Tu fecha se extrae automáticamente al colocar la imagen
                </span>
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-blue-600 group-hover:translate-y-0.5 transition-transform shrink-0" />
          </button>
        </div>

        {/* 1. CAMPO: FOTOGRAFÍAS / IMÁGENES (PRIMER CAMPO) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-700" />
              <span>1. Fotografías de la evidencia ({photos.length}):</span>
            </label>

            {photos.length > 0 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingPhotos}
                className="text-xs sm:text-sm font-extrabold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 sm:px-3.5 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {isProcessingPhotos ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 stroke-[3]" />
                )}
                Agregar otra foto
              </button>
            )}
          </div>

          {isProcessingPhotos ? (
            <div className="h-60 border-2 border-dashed border-blue-300 rounded-3xl bg-blue-50/60 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-base font-bold text-slate-800">
                Optimizando y cargando fotografías...
              </p>
            </div>
          ) : photos.length === 0 ? (
            /* Big, Welcoming Empty Upload Box */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-blue-400 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-3xl p-6 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 group min-h-[240px] sm:min-h-[280px]"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Camera className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-1">
                <p className="text-lg sm:text-2xl font-extrabold text-slate-900">
                  Toca aquí para seleccionar las fotos
                </p>
                <p className="text-xs sm:text-base text-slate-600 max-w-md mx-auto">
                  Toca con tu dedo para abrir la cámara o seleccionar de tu galería.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 bg-blue-600 text-white font-extrabold px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-md group-hover:bg-blue-700 text-sm sm:text-base">
                <Plus className="w-5 h-5 stroke-[3]" />
                Seleccionar Fotos
              </span>
            </div>
          ) : (
            /* Photos Display with Controls */
            <div className={`grid gap-4 sm:gap-5 ${photos.length === 1 ? 'grid-cols-1 max-w-xl mx-auto w-full' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {photos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 flex flex-col gap-3 shadow-xs"
                >
                  {/* Photo Frame */}
                  <div className="h-56 sm:h-68 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center relative p-1">
                    <img
                      src={photo.dataUrl}
                      alt={`Foto ${idx + 1}`}
                      style={{
                        transform: `rotate(${photo.rotation || 0}deg)`,
                        transformOrigin: 'center center'
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      Foto #{idx + 1}
                    </span>
                  </div>

                  {/* Friendly Photo Controls */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onRotatePhoto(photo.id)}
                      className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-1.5 text-xs sm:text-sm active:scale-95 cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4 text-blue-700" />
                      Girar ({photo.rotation || 0}°)
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemovePhoto(photo.id)}
                      className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5 text-xs sm:text-sm active:scale-95 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. CAMPO: LUGAR O DIRECCIÓN */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center justify-between flex-wrap gap-1">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span>2. Lugar o Dirección:</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              Calle / Colonia / Domicilio
            </span>
          </label>

          <button
            type="button"
            onClick={onOpenLocationPicker}
            className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 hover:border-slate-400 rounded-2xl text-left transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <MapPin className="w-5 h-5 text-red-600 shrink-0" />
              <span className={`text-base sm:text-lg font-bold truncate block ${page.location ? 'text-slate-900' : 'text-slate-400'}`}>
                {page.location || 'Toca para escribir o elegir el lugar / calle...'}
              </span>
            </div>
            <div className="shrink-0 flex items-center gap-1 text-xs font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200 group-hover:border-blue-300">
              <span>Cambiar</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* 3. CAMPO: ACTIVIDAD QUE SE REALIZÓ */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center justify-between flex-wrap gap-1">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-700" />
              <span>3. Actividad que se realizó:</span>
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Título del trabajo
            </span>
          </label>

          <input
            type="text"
            value={page.title || ''}
            onChange={(e) => onUpdateField('title', e.target.value)}
            placeholder="Escribe aquí el trabajo realizado (Ejemplo: Cobro de agua potable)"
            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-base sm:text-lg font-bold border-2 border-slate-300 focus:border-blue-600 rounded-2xl outline-none bg-white text-slate-900 placeholder-slate-400 shadow-inner"
          />

          {/* Quick Frequent Activity Suggestions */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Opciones rápidas (toca una para rellenar):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_ACTIVITY_SUGGESTIONS.slice(0, 4).map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => onUpdateField('title', act)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    page.title === act
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-800 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. CAMPO: BARRA DE DESCRIPCIÓN, DETALLE ADICIONAL U OBSERVACIONES */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center justify-between flex-wrap gap-1">
            <span className="flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-slate-700" />
              <span>4. Descripción, detalle adicional u observaciones:</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              (Opcional)
            </span>
          </label>

          <textarea
            ref={textareaRef}
            rows={3}
            value={page.notes || ''}
            onChange={(e) => onUpdateField('notes', e.target.value)}
            placeholder="Escribe aquí los detalles, notas u observaciones del trabajo (Opcional)..."
            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-sm sm:text-base font-medium border-2 border-slate-300 focus:border-blue-600 rounded-2xl outline-none bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 shadow-xs resize-none transition-all min-h-[88px] leading-relaxed"
          />
        </div>

      </div>
    </div>
  );
};
