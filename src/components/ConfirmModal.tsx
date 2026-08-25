import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Sí, continuar',
  cancelText = 'Cancelar',
  isDestructive = true,
  onConfirm,
  onCancel
}) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-[100dvh] w-full bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overscroll-contain">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col max-h-[88dvh] animate-in fade-in zoom-in-95">
        <div className={`p-4 sm:p-5 flex items-center gap-3 shrink-0 ${isDestructive ? 'bg-red-50 text-red-950 border-b border-red-200' : 'bg-blue-50 text-blue-950 border-b border-blue-200'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {isDestructive ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold">{title}</h3>
          </div>
        </div>

        <div className="p-5 text-sm sm:text-base text-slate-700 leading-relaxed overflow-y-auto overscroll-contain flex-1">
          {message}
        </div>

        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm transition-colors cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-md transition-all active:scale-95 text-white cursor-pointer ${
              isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
