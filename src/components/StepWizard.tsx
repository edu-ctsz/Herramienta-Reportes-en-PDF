import React, { useState, useRef } from 'react';
import { 
  EvidencePage, 
  PhotoItem 
} from '../types';
import { 
  formatDateToSpanish, 
  getTodayISO, 
  addDaysToISO 
} from '../utils/dateUtils';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  FileText, 
  Image as ImageIcon, 
  RotateCw, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Plus, 
  Check, 
  Sparkles,
  ChevronDown,
  Clock,
  Eye,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import { COMMON_ACTIVITY_SUGGESTIONS } from '../utils/sampleData';

interface StepWizardProps {
  initialPage: EvidencePage;
  pageNumber: number;
  totalExistingPages: number;
  savedLocations: string[];
  onSaveNewLocation: (loc: string) => void;
  onDeleteSavedLocation: (loc: string) => void;
  onSavePageAndAddAnother: (page: EvidencePage) => void;
  onSavePageAndFinish: (page: EvidencePage) => void;
  onCancel: () => void;
}

export const StepWizard: React.FC<StepWizardProps> = ({
  initialPage,
  pageNumber,
  totalExistingPages,
  savedLocations,
  onSaveNewLocation,
  onDeleteSavedLocation,
  onSavePageAndAddAnother,
  onSavePageAndFinish,
  onCancel
}) => {
  // Wizard current step: 1 (Fotos), 2 (Fecha), 3 (Lugar), 4 (Actividad), 5 (Vista Previa)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [pageData, setPageData] = useState<EvidencePage>(() => ({
    ...initialPage,
    date: initialPage.date || getTodayISO(),
    location: initialPage.location || (savedLocations[0] || ''),
    title: initialPage.title || '',
    notes: initialPage.notes || '',
    photos: initialPage.photos || [],
    layout: initialPage.layout || 'stacked'
  }));

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationJustSaved, setLocationJustSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Updates
  const updateField = <K extends keyof EvidencePage>(field: K, value: EvidencePage[K]) => {
    setPageData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Upload handler
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newPhoto: PhotoItem = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          dataUrl,
          fileName: file.name,
          rotation: 0
        };
        setPageData((prev) => ({
          ...prev,
          photos: [...(prev.photos || []), newPhoto]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Rotate photo 90 deg
  const handleRotate = (photoId: string) => {
    setPageData((prev) => ({
      ...prev,
      photos: (prev.photos || []).map((p) => {
        if (p.id === photoId) {
          return { ...p, rotation: ((p.rotation || 0) + 90) % 360 };
        }
        return p;
      })
    }));
  };

  // Remove photo
  const handleRemovePhoto = (photoId: string) => {
    setPageData((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter((p) => p.id !== photoId)
    }));
  };

  // Save location to quick list
  const handleSaveLocation = () => {
    if (pageData.location && pageData.location.trim()) {
      onSaveNewLocation(pageData.location.trim());
      setLocationJustSaved(true);
      setTimeout(() => setLocationJustSaved(false), 2000);
    }
  };

  // Step navigation validation
  const canGoNext = () => {
    if (currentStep === 1) {
      return (pageData.photos || []).length > 0;
    }
    if (currentStep === 2) {
      return !!pageData.date;
    }
    if (currentStep === 3) {
      return !!pageData.location && pageData.location.trim().length > 0;
    }
    if (currentStep === 4) {
      return !!pageData.title && pageData.title.trim().length > 0;
    }
    return true;
  };

  const stepsList = [
    { num: 1, title: 'Fotos', icon: ImageIcon },
    { num: 2, title: 'Fecha', icon: CalendarIcon },
    { num: 3, title: 'Lugar', icon: MapPin },
    { num: 4, title: 'Actividad', icon: FileText },
    { num: 5, title: 'Revisar Hoja', icon: Eye }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden max-w-4xl mx-auto my-4">
      {/* Wizard Header Bar */}
      <div className="bg-slate-900 text-white p-5 md:p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-xs md:text-sm font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Paso a Paso
              </span>
              <h2 className="text-xl md:text-2xl font-bold">
                Llenando la Hoja #{pageNumber}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Sigue los 4 pasos para armar esta página de evidencias.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-xs md:text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            Cancelar y volver
          </button>
        </div>

        {/* Step Indicator Progress */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          {stepsList.map((st) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            const Icon = st.icon;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => {
                  // Only allow jumping to previous steps or next if valid
                  if (st.num < currentStep) setCurrentStep(st.num);
                }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all text-center ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-md ring-2 ring-blue-400'
                    : isCompleted
                    ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                    : 'bg-slate-800/60 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs md:text-sm">
                    {st.num}. {st.title}
                  </span>
                </div>
                {isCompleted && <span className="text-[10px] text-emerald-400 font-bold">✓ Listo</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wizard Main Content Body */}
      <div className="p-6 md:p-8 min-h-[420px]">
        {/* ================= PASO 1: FOTOS ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-blue-600 text-sm font-bold tracking-wide uppercase">
                Paso 1 de 4
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Selecciona las fotos de esta hoja
              </h3>
              <p className="text-base text-slate-600 mt-1">
                Agrega las fotografías tomadas en campo (generalmente 1 o 2 fotos por página).
              </p>
            </div>

            {/* Hidden input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />

            {/* Big Dropzone Button */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-blue-400 hover:border-blue-600 bg-blue-50/60 hover:bg-blue-50 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 shadow-inner group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  Toca aquí para seleccionar las fotos
                </p>
                <p className="text-base text-slate-600 mt-1">
                  Puedes buscar las imágenes en tu computadora o galería del teléfono.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl border border-blue-200 shadow-sm group-hover:border-blue-400 text-base">
                <Plus className="w-5 h-5" />
                Buscar Fotos
              </span>
            </div>

            {/* Photos Preview & Management */}
            {(pageData.photos || []).length > 0 ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-800">
                    Fotos cargadas ({(pageData.photos || []).length}):
                  </h4>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Agregar otra foto más
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(pageData.photos || []).map((photo, idx) => (
                    <div
                      key={photo.id}
                      className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm"
                    >
                      {/* Photo Thumbnail */}
                      <div className="h-52 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center relative">
                        <img
                          src={photo.dataUrl}
                          alt={`Foto ${idx + 1}`}
                          style={{
                            transform: `rotate(${photo.rotation || 0}deg)`,
                            transformOrigin: 'center center'
                          }}
                          className="max-h-full max-w-full object-contain"
                        />
                        <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-xs font-bold px-2 py-1 rounded-md">
                          Foto #{idx + 1}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        {/* Rotate button */}
                        <button
                          type="button"
                          onClick={() => handleRotate(photo.id)}
                          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold px-3 py-2 rounded-xl text-sm border border-blue-200 transition-colors"
                        >
                          <RotateCw className="w-4 h-4 text-blue-600" />
                          Girar 90° ({photo.rotation || 0}°)
                        </button>

                        {/* Delete button (clear and large) */}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-2 rounded-xl text-sm border border-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                          Quitar Foto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-medium flex items-center gap-2">
                <span>⚠️ Por favor selecciona al menos 1 foto para continuar al siguiente paso.</span>
              </div>
            )}
          </div>
        )}

        {/* ================= PASO 2: FECHA ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-blue-600 text-sm font-bold tracking-wide uppercase">
                Paso 2 de 4
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                ¿En qué fecha se tomó la foto?
              </h3>
              <p className="text-base text-slate-600 mt-1">
                La fecha aparecerá en la esquina superior derecha del reporte en formato formal en español.
              </p>
            </div>

            {/* Quick date buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-700">Botones rápidos:</span>
              <button
                type="button"
                onClick={() => updateField('date', getTodayISO())}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl border border-blue-200 text-sm transition-colors"
              >
                📅 Hoy
              </button>
              <button
                type="button"
                onClick={() => updateField('date', addDaysToISO(pageData.date || getTodayISO(), -1))}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 text-sm transition-colors"
              >
                -1 Día (Ayer)
              </button>
              <button
                type="button"
                onClick={() => updateField('date', addDaysToISO(pageData.date || getTodayISO(), 1))}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 text-sm transition-colors"
              >
                +1 Día (Mañana)
              </button>
            </div>

            {/* Date visual input */}
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-800 block">
                Selecciona la fecha en el calendario:
              </label>
              <input
                type="date"
                value={pageData.date || ''}
                onChange={(e) => updateField('date', e.target.value)}
                className="w-full md:w-2/3 px-5 py-4 text-xl font-bold border-2 border-slate-300 focus:border-blue-600 rounded-2xl outline-none bg-white text-slate-900 shadow-sm cursor-pointer"
              />
            </div>

            {/* Formal Preview */}
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-extrabold text-blue-700">
                  Así se imprimirá en el PDF:
                </div>
                <div className="text-xl md:text-2xl font-extrabold text-blue-950 mt-0.5">
                  {formatDateToSpanish(pageData.date) || 'Selecciona una fecha arriba'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PASO 3: LUGAR / DIRECCIÓN ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-blue-600 text-sm font-bold tracking-wide uppercase">
                Paso 3 de 4
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                ¿En qué lugar o dirección se tomó?
              </h3>
              <p className="text-base text-slate-600 mt-1">
                Puedes escribir la calle o elegir un lugar que hayas usado antes.
              </p>
            </div>

            {/* Location Input & Save */}
            <div className="space-y-3">
              <label className="text-base font-bold text-slate-800 flex items-center justify-between">
                <span>Escribe la calle, colonia o lugar:</span>
                {pageData.location && pageData.location.trim() && (
                  <button
                    type="button"
                    onClick={handleSaveLocation}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1"
                  >
                    {locationJustSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> ¡Guardado en tu lista!
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Guardar este lugar para después
                      </>
                    )}
                  </button>
                )}
              </label>

              <input
                type="text"
                value={pageData.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="Ejemplo: Calle Los Angeles Centro Santa Catarina Ayometla."
                className="w-full px-5 py-4 text-lg md:text-xl font-medium border-2 border-slate-300 focus:border-blue-600 rounded-2xl outline-none bg-white text-slate-900 shadow-sm placeholder-slate-400"
              />
            </div>

            {/* Saved Locations List (One-click selection) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Lugares guardados anteriormente (toca uno para seleccionarlo):
                </span>
                <span className="text-xs text-slate-500">
                  {savedLocations.length} guardados
                </span>
              </div>

              {savedLocations.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500">
                  Aún no tienes lugares guardados. Escribe uno arriba y dale al botón "Guardar este lugar".
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {savedLocations.map((loc) => {
                    const isSelected = (pageData.location || '').trim().toLowerCase() === loc.trim().toLowerCase();
                    return (
                      <div
                        key={loc}
                        className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => updateField('location', loc)}
                          className="flex-1 text-left flex items-start gap-3"
                        >
                          <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className={`text-base ${isSelected ? 'font-bold text-blue-950' : 'font-medium text-slate-800'}`}>
                            {loc}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSavedLocation(loc);
                          }}
                          title="Eliminar este lugar de la lista"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= PASO 4: ACTIVIDAD ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-blue-600 text-sm font-bold tracking-wide uppercase">
                Paso 4 de 4
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                ¿Qué actividad se realizó?
              </h3>
              <p className="text-base text-slate-600 mt-1">
                Escribe el título de la actividad o toca una de las opciones frecuentes.
              </p>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-800 block">
                Título de la actividad:
              </label>
              <input
                type="text"
                value={pageData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Ejemplo: Cobro de agua potable. / Reparación de fugas."
                className="w-full px-5 py-4 text-lg md:text-xl font-bold border-2 border-slate-300 focus:border-blue-600 rounded-2xl outline-none bg-white text-slate-900 shadow-sm placeholder-slate-400"
              />
            </div>

            {/* Quick Activity Chips */}
            <div className="space-y-2 pt-2">
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Opciones frecuentes (toca para rellenar rápido):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_ACTIVITY_SUGGESTIONS.map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => updateField('title', act)}
                    className={`p-3 rounded-xl border text-left text-sm md:text-base font-medium transition-all ${
                      pageData.title === act
                        ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-bold text-slate-700 block">
                Detalle adicional u observaciones (Opcional):
              </label>
              <textarea
                rows={3}
                value={pageData.notes || ''}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Ejemplo: Se llevó a cabo la consulta e inducción sobre los manuales para el manejo operativo..."
                className="w-full px-4 py-3 text-base border-2 border-slate-300 focus:border-blue-600 rounded-2xl outline-none bg-white text-slate-800"
              />
            </div>
          </div>
        )}

        {/* ================= PASO 5: REVISAR HOJA & FINALIZAR ================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-emerald-600 text-sm font-bold tracking-wide uppercase">
                  Revisión Final
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  ¡Hoja #{pageNumber} Lista!
                </h3>
                <p className="text-base text-slate-600 mt-1">
                  Revisa que los datos y fotos estén correctos antes de guardarla.
                </p>
              </div>

              <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Todos los pasos completados
              </div>
            </div>

            {/* Summary Preview Box */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-500">Fecha:</span>
                  <p className="text-base font-extrabold text-slate-900">
                    {formatDateToSpanish(pageData.date)}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-500">Lugar:</span>
                  <p className="text-base font-bold text-slate-900">
                    {pageData.location}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-slate-500">Actividad:</span>
                <p className="text-base font-bold text-slate-900">
                  {pageData.title}
                </p>
                {pageData.notes && (
                  <p className="text-sm text-slate-600 mt-1 italic">
                    "{pageData.notes}"
                  </p>
                )}
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-slate-500">Fotos agregadas:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  {(pageData.photos || []).map((p, idx) => (
                    <div key={p.id} className="h-32 bg-white rounded-xl border border-slate-300 overflow-hidden flex items-center justify-center">
                      <img
                        src={p.dataUrl}
                        alt={`Foto ${idx + 1}`}
                        style={{ transform: `rotate(${p.rotation || 0}deg)` }}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Big Action Buttons */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Button 1: Save and add another page */}
              <button
                type="button"
                onClick={() => onSavePageAndAddAnother(pageData)}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-98"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
                Guardar y Agregar Otra Hoja
              </button>

              {/* Button 2: Save and finish to download PDF */}
              <button
                type="button"
                onClick={() => onSavePageAndFinish(pageData)}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-98"
              >
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                Listo, Ver Reporte y Descargar PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Navigation Controls */}
      <div className="bg-slate-50 p-4 md:p-6 border-t border-slate-200 flex items-center justify-between gap-3">
        {/* Back Button */}
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Paso Anterior
          </button>
        ) : (
          <div></div>
        )}

        {/* Next / Finish Button */}
        {currentStep < 5 && (
          <button
            type="button"
            disabled={!canGoNext()}
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-base md:text-lg shadow-md transition-all ml-auto"
          >
            Siguiente Paso
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
