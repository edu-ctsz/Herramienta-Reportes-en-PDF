import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Plus, Trash2, Clock, Check } from 'lucide-react';

interface LocationSelectorProps {
  value: string;
  onChange: (newLocation: string) => void;
  savedLocations: string[];
  onSaveNewLocation: (loc: string) => void;
  onDeleteSavedLocation: (loc: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  savedLocations,
  onSaveNewLocation,
  onDeleteSavedLocation
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: string) => {
    onChange(loc);
    setIsOpen(false);
  };

  const handleSaveCurrent = () => {
    if (value.trim()) {
      onSaveNewLocation(value.trim());
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  const isCurrentSaved = savedLocations.some(
    loc => loc.toLowerCase().trim() === value.toLowerCase().trim()
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm md:text-base font-semibold text-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-rose-600" />
            Lugar donde se tomó la foto / Dirección:
          </span>
          {savedLocations.length > 0 && (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs md:text-sm text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              Ver {savedLocations.length} lugares anteriores
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </label>

        {/* Input Box with Dropdown Toggle */}
        <div className="relative flex items-center">
          <input
            id="location-input"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Ejemplo: Calle Los Angeles Centro Santa Catarina Ayometla."
            className="w-full pl-4 pr-24 py-3 text-base md:text-lg border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all text-slate-800 bg-white placeholder-slate-400 font-medium"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {value.trim() && !isCurrentSaved && (
              <button
                type="button"
                onClick={handleSaveCurrent}
                title="Guardar este lugar para usarlo rápido después"
                className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
              >
                {justSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    ¡Guardado!
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Recordar
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Abrir listado de lugares guardados"
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu of Saved Locations */}
      {isOpen && (
        <div className="absolute z-30 left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs md:text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Lugares usados anteriormente (toca uno para elegirlo):
            </span>
            <span className="text-slate-500 font-normal">
              {savedLocations.length} guardados
            </span>
          </div>

          {savedLocations.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              Aún no tienes lugares guardados. Escribe uno arriba y dale a "Recordar".
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {savedLocations.map((loc) => {
                const isSelected = loc.toLowerCase().trim() === value.toLowerCase().trim();
                return (
                  <div
                    key={loc}
                    className={`flex items-center justify-between p-3 hover:bg-blue-50 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-100/70' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(loc)}
                      className="flex-1 text-left flex items-start gap-2.5"
                    >
                      <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
                      <span className={`text-sm md:text-base ${isSelected ? 'font-bold text-blue-900' : 'font-medium text-slate-800'}`}>
                        {loc}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSavedLocation(loc);
                      }}
                      title="Eliminar de la lista de sugerencias"
                      className="opacity-60 hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Fast Quick Selection Chips below input */}
      {savedLocations.length > 0 && !isOpen && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium mr-1">Sugerencias rápidas:</span>
          {savedLocations.slice(0, 4).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => onChange(loc)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all truncate max-w-[280px] ${
                value === loc
                  ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
