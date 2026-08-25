import React, { useState } from 'react';
import { MapPin, Check, X, Plus, Trash2, Clock } from 'lucide-react';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';

interface LocationPickerModalProps {
  isOpen: boolean;
  currentLocation: string;
  savedLocations: string[];
  onSaveLocation: (newLocation: string) => void;
  onDeleteSavedLocation: (loc: string) => void;
  onAddSavedLocation: (loc: string) => void;
  onClose: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  currentLocation,
  savedLocations,
  onSaveLocation,
  onDeleteSavedLocation,
  onAddSavedLocation,
  onClose
}) => {
  useBodyScrollLock(isOpen);

  const [typedLocation, setTypedLocation] = useState<string>(currentLocation || '');
  const [justSavedToHistory, setJustSavedToHistory] = useState(false);

  if (!isOpen) return null;

  const handleSelectFromList = (loc: string) => {
    setTypedLocation(loc);
    onSaveLocation(loc);
    onClose();
  };

  const handleConfirm = () => {
    if (typedLocation.trim()) {
      onAddSavedLocation(typedLocation.trim());
      onSaveLocation(typedLocation.trim());
    }
    onClose();
  };

  const handleSaveToFavorites = () => {
    if (typedLocation.trim()) {
      onAddSavedLocation(typedLocation.trim());
      setJustSavedToHistory(true);
      setTimeout(() => setJustSavedToHistory(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 h-[100dvh] w-full bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overscroll-contain">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col max-h-[88dvh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold">Elegir Lugar o Dirección</h3>
              <p className="text-xs text-slate-300">Donde se tomaron las fotos de la evidencia</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto overscroll-contain flex-1">
          {/* Text Input */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between flex-wrap gap-1">
              <span>Escribe la calle o lugar:</span>
              {typedLocation.trim() && (
                <button
                  type="button"
                  onClick={handleSaveToFavorites}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {justSavedToHistory ? (
                    <>
                      <Check className="w-3 h-3" /> ¡Guardado en lista!
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" /> Guardar en favoritos
                    </>
                  )}
                </button>
              )}
            </label>

            <input
              type="text"
              value={typedLocation}
              onChange={(e) => setTypedLocation(e.target.value)}
              placeholder="Ejemplo: Calle Los Angeles Centro Santa Catarina Ayometla."
              className="w-full px-3.5 py-3 text-sm sm:text-base font-bold border-2 border-slate-300 focus:border-blue-600 rounded-2xl outline-none bg-white text-slate-900 shadow-inner placeholder-slate-400"
            />
          </div>

          {/* Quick Frequent Places List */}
          <div className="space-y-2 pt-1">
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Lugares frecuentes (toca uno para seleccionarlo):
            </span>

            {savedLocations.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                Aún no hay lugares frecuentes guardados.
              </p>
            ) : (
              <div className="space-y-1.5">
                {savedLocations.map((loc) => (
                  <div
                    key={loc}
                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 transition-all group"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectFromList(loc)}
                      className="flex-1 text-left flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-950 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="truncate">{loc}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSavedLocation(loc);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1 cursor-pointer"
                      title="Quitar este lugar de la lista"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Guardar Lugar
          </button>
        </div>
      </div>
    </div>
  );
};
