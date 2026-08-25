import React, { useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  FileText, 
  Image as ImageIcon, 
  RotateCw, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Plus, 
  Sparkles,
  LayoutGrid,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { EvidencePage, PhotoItem, PhotoLayout } from '../types';
import { formatDateToSpanish, getTodayISO, addDaysToISO } from '../utils/dateUtils';
import { LocationSelector } from './LocationSelector';
import { COMMON_ACTIVITY_SUGGESTIONS } from '../utils/sampleData';

interface PageEditorProps {
  page: EvidencePage;
  pageNumber: number;
  totalPages: number;
  onChange: (updatedPage: EvidencePage) => void;
  savedLocations: string[];
  onSaveNewLocation: (loc: string) => void;
  onDeleteSavedLocation: (loc: string) => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  page,
  pageNumber,
  totalPages,
  onChange,
  savedLocations,
  onSaveNewLocation,
  onDeleteSavedLocation
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof EvidencePage>(field: K, value: EvidencePage[K]) => {
    onChange({
      ...page,
      [field]: value
    });
  };

  // Image Upload Handler
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPhotos: PhotoItem[] = [];
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const photo: PhotoItem = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          dataUrl,
          fileName: file.name,
          rotation: 0
        };

        onChange({
          ...page,
          photos: [...(page.photos || []), photo]
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Rotate photo 90 degrees
  const handleRotatePhoto = (photoId: string) => {
    const updatedPhotos = (page.photos || []).map((p) => {
      if (p.id === photoId) {
        const nextRotation = ((p.rotation || 0) + 90) % 360;
        return { ...p, rotation: nextRotation };
      }
      return p;
    });
    updateField('photos', updatedPhotos);
  };

  // Delete a photo
  const handleDeletePhoto = (photoId: string) => {
    const updatedPhotos = (page.photos || []).filter((p) => p.id !== photoId);
    updateField('photos', updatedPhotos);
  };

  // Move photo up/down in order
  const handleMovePhoto = (index: number, direction: 'up' | 'down') => {
    const photos = [...(page.photos || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const temp = photos[index];
    photos[index] = photos[targetIndex];
    photos[targetIndex] = temp;

    updateField('photos', photos);
  };

  // Date Quick Helpers
  const handleSetDate = (newDate: string) => {
    updateField('date', newDate);
  };

  const handleQuickAddDays = (days: number) => {
    const current = page.date || getTodayISO();
    const nextDate = addDaysToISO(current, days);
    updateField('date', nextDate);
  };

  const formattedSpanishDate = formatDateToSpanish(page.date);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Editor Header */}
      <div className="p-4 md:p-6 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
            {pageNumber}
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Editando Hoja {pageNumber} de {totalPages}
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Llene los 4 sencillos pasos a continuación para armar esta página del reporte.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Cambios guardados automáticamente
        </div>
      </div>

      <div className="p-5 md:p-7 space-y-7">
        {/* PASO 1: FECHA */}
        <div className="bg-slate-50/50 p-4 md:p-5 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                1
              </span>
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Fecha de la evidencia:
            </label>

            {/* Quick date buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 font-medium mr-1">Atajos:</span>
              <button
                type="button"
                onClick={() => handleSetDate(getTodayISO())}
                className="text-xs px-2.5 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddDays(-1)}
                className="text-xs px-2.5 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                -1 Día
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddDays(1)}
                className="text-xs px-2.5 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                +1 Día
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div className="relative">
              <input
                type="date"
                value={page.date || ''}
                onChange={(e) => updateField('date', e.target.value)}
                className="w-full px-4 py-3 text-base md:text-lg font-medium border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none bg-white text-slate-900 cursor-pointer shadow-sm"
              />
            </div>

            {/* Spanish formatted date badge */}
            <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-center gap-2.5">
              <CalendarIcon className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-blue-800">
                  Formato en el PDF:
                </div>
                <div className="text-base font-bold text-blue-950">
                  {formattedSpanishDate || 'Sin fecha seleccionada'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PASO 2: LUGAR / DIRECCIÓN */}
        <div className="bg-slate-50/50 p-4 md:p-5 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
              2
            </span>
            <span className="text-base md:text-lg font-bold text-slate-900">
              Lugar o Dirección donde se tomó la foto:
            </span>
          </div>

          <LocationSelector
            value={page.location || ''}
            onChange={(loc) => updateField('location', loc)}
            savedLocations={savedLocations}
            onSaveNewLocation={onSaveNewLocation}
            onDeleteSavedLocation={onDeleteSavedLocation}
          />
        </div>

        {/* PASO 3: ACTIVIDAD / DESCRIPCIÓN */}
        <div className="bg-slate-50/50 p-4 md:p-5 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                3
              </span>
              <FileText className="w-5 h-5 text-blue-600" />
              Actividad realizada (Título principal):
            </label>
          </div>

          <input
            type="text"
            value={page.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ejemplo: Cobro de agua potable. / Reparación de fugas de agua potable."
            className="w-full px-4 py-3 text-base md:text-lg font-semibold border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none bg-white text-slate-900 placeholder-slate-400 shadow-sm"
          />

          {/* Quick activity chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Sugerencias de actividades comunes (haz clic para rellenar rápido):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_ACTIVITY_SUGGESTIONS.map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => updateField('title', act)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left ${
                    page.title === act
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-200'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* Optional notes / details */}
          <div className="pt-2">
            <label className="text-xs md:text-sm font-semibold text-slate-700 block mb-1">
              Detalle o explicación adicional (Opcional):
            </label>
            <textarea
              rows={2}
              value={page.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Ejemplo: Se llevó a cabo la consulta e inducción sobre los manuales para el manejo operativo de válvulas..."
              className="w-full px-3.5 py-2.5 text-sm md:text-base border border-slate-300 focus:border-blue-600 rounded-xl outline-none bg-white text-slate-800 placeholder-slate-400 resize-y"
            />
          </div>
        </div>

        {/* PASO 4: FOTOS DE LA EVIDENCIA */}
        <div className="bg-slate-50/50 p-4 md:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                4
              </span>
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <span className="text-base md:text-lg font-bold text-slate-900">
                Fotos de la evidencia ({(page.photos || []).length} agregadas):
              </span>
            </div>

            {/* Layout selector */}
            {(page.photos || []).length > 0 && (
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                <span className="text-slate-500 px-1.5 font-medium">Diseño:</span>
                <button
                  type="button"
                  onClick={() => updateField('layout', 'stacked')}
                  className={`px-2 py-1 rounded font-semibold transition-colors ${
                    (!page.layout || page.layout === 'stacked') ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  2 Apiladas
                </button>
                <button
                  type="button"
                  onClick={() => updateField('layout', 'single')}
                  className={`px-2 py-1 rounded font-semibold transition-colors ${
                    page.layout === 'single' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  1 Grande
                </button>
                <button
                  type="button"
                  onClick={() => updateField('layout', 'featured-left')}
                  className={`px-2 py-1 rounded font-semibold transition-colors ${
                    page.layout === 'featured-left' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  3 Fotos
                </button>
              </div>
            )}
          </div>

          {/* Upload Dropzone & Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFilesSelected(e.dataTransfer.files);
              }}
              className="border-3 border-dashed border-blue-300 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50/90 rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold text-slate-900">
                  Toca aquí para seleccionar fotos
                </p>
                <p className="text-sm text-slate-600 mt-0.5">
                  Puedes seleccionar 1, 2 o varias imágenes desde tu computadora o celular.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold bg-white text-blue-700 px-4 py-2 rounded-xl border border-blue-200 shadow-sm group-hover:border-blue-400">
                <Plus className="w-4 h-4" />
                Buscar fotos en mi dispositivo
              </span>
            </div>
          </div>

          {/* Photos List / Management Cards */}
          {(page.photos || []).length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-sm font-semibold text-slate-700">
                Fotos agregadas a esta hoja (puedes girarlas si salieron de lado o cambiar su orden):
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(page.photos || []).map((photo, index) => (
                  <div
                    key={photo.id}
                    className="bg-white border-2 border-slate-200 rounded-xl p-3 shadow-sm flex gap-3 items-center"
                  >
                    {/* Thumbnail with rotation */}
                    <div className="w-24 h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                      <img
                        src={photo.dataUrl}
                        alt={`Foto ${index + 1}`}
                        style={{
                          transform: `rotate(${photo.rotation || 0}deg)`,
                          transformOrigin: 'center center'
                        }}
                        className="w-full h-full object-contain transition-transform"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 flex flex-col justify-between h-full py-1">
                      <div>
                        <p className="text-xs font-semibold text-slate-800 truncate max-w-[170px]" title={photo.fileName}>
                          {photo.fileName || `Foto ${index + 1}`}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Giro: {photo.rotation || 0}°
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {/* Rotate button */}
                        <button
                          type="button"
                          onClick={() => handleRotatePhoto(photo.id)}
                          title="Girar foto 90 grados"
                          className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-blue-600" />
                          Girar
                        </button>

                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMovePhoto(index, 'up')}
                          title="Mover arriba"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === (page.photos || []).length - 1}
                          onClick={() => handleMovePhoto(index, 'down')}
                          title="Mover abajo"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          title="Eliminar esta foto"
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
