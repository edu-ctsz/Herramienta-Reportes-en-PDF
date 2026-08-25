import React from 'react';
import { X, ShieldCheck, Lock, HardDrive, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Aviso de Privacidad y Términos de Servicio
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Tu información y fotografías están 100% seguras y protegidas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* Main Trust Highlight */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-emerald-950 text-sm sm:text-base">
                Tus fotos nunca salen de tu teléfono o computadora
              </h4>
              <p className="text-emerald-900 font-medium text-xs sm:text-sm">
                Esta aplicación no envía ni guarda tus imágenes en ningún servidor de internet. Todo el proceso de armado del reporte y generación del PDF se realiza de manera local en la memoria de tu propio dispositivo.
              </p>
            </div>
          </div>

          {/* Section 1: Privacidad */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-700" />
              1. Protección y Privacidad de Datos
            </h4>
            <ul className="space-y-2.5 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">•</span>
                <span>
                  <strong>Sin registros ni cuentas:</strong> No solicitamos correos electrónicos, contraseñas, números telefónicos ni datos bancarios.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">•</span>
                <span>
                  <strong>Sin rastreadores ni publicidad:</strong> No recopilamos datos de navegación, historial ni vendemos información a terceros.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">•</span>
                <span>
                  <strong>Almacenamiento en tu equipo:</strong> La información que escribes y tus fotos se guardan en el almacenamiento local de tu navegador para que no pierdas tu trabajo si cierras la ventana. Puedes borrarlos en cualquier momento pulsando <em>"Empezar nuevo reporte"</em>.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 2: Términos y Condiciones */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              2. Términos de Uso y Servicio
            </h4>
            <ul className="space-y-2.5 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">•</span>
                <span>
                  <strong>Uso Gratuito y Libre:</strong> Esta herramienta está diseñada como un servicio gratuito de utilidad comunitaria y laboral para facilitar la creación de reportes fotográficos en PDF listos para imprimir.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">•</span>
                <span>
                  <strong>Propiedad de los Reportes:</strong> Todos los documentos generados, fotografías y contenidos son de exclusiva propiedad del usuario que los genera.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">•</span>
                <span>
                  <strong>Funcionamiento sin conexión:</strong> Una vez cargada la página, puedes continuar trabajando incluso sin conexión a internet activa.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 3: Créditos y Autoría */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-600 text-xs space-y-1">
            <p className="font-bold text-slate-800">
              Desarrollado con dedicación por @edu.ctsz con Google
            </p>
            <p>
              Diseñado con enfoque en la accesibilidad, facilidad de uso para adultos mayores y máxima seguridad de la información.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Entendido y cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
