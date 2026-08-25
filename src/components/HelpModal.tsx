import React from 'react';
import { HelpCircle, X, Camera, FileText, FileDown, Sparkles, Plus } from 'lucide-react';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSample: () => void;
  onStartBlank: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ 
  isOpen, 
  onClose,
  onLoadSample,
  onStartBlank
}) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-[100dvh] w-full bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overscroll-contain">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col max-h-[88dvh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold leading-tight">
                ¿Cómo usar la aplicación?
              </h3>
              <p className="text-xs text-blue-100">Guía rápida de 3 pasos</p>
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

        {/* Scrollable Steps Content */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto overscroll-contain flex-1">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-700" />
                Paso 1: Pon tus fotos
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Toca el recuadro grande con icono de cámara en la hoja para subir tus fotos tomadas en campo. Si alguna foto queda de lado, usa el botón <strong>"🔄 Girar"</strong>.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-700" />
                Paso 2: Escribe la actividad, fecha y lugar
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Escribe qué trabajo se realizó (ej. <em>"Cobro de agua"</em> o <em>"Reparación de fuga"</em>) y toca los botones de la esquina superior para ajustar el día y la calle.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-1.5">
                <FileDown className="w-4 h-4 text-emerald-700" />
                Paso 3: Previsualiza o Descarga tu PDF
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Puedes agregar más hojas con <strong>"➕ Nueva Hoja"</strong>. Cuando termines, pulsa <strong>"Previsualizar"</strong> para revisar cómo quedó y luego <strong>"Descargar PDF"</strong>.
              </p>
            </div>
          </div>

          {/* Quick Choice Buttons */}
          <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-300 space-y-2.5">
            <span className="text-[11px] font-extrabold text-slate-700 block uppercase tracking-wide">
              ¿Qué deseas hacer ahora?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onStartBlank();
                  onClose();
                }}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 text-blue-700 stroke-[3]" />
                Empezar en blanco
              </button>

              <button
                type="button"
                onClick={() => {
                  onLoadSample();
                  onClose();
                }}
                className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                Ver ejemplo (4 hojas)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm shadow-md transition-colors text-center cursor-pointer"
          >
            ¡Entendido, gracias!
          </button>
        </div>
      </div>
    </div>
  );
};
