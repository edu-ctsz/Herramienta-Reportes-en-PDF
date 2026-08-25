import React, { useState } from 'react';
import { 
  FileDown, 
  Printer, 
  HelpCircle, 
  Calendar, 
  FileSpreadsheet, 
  RefreshCw, 
  FileText, 
  Check, 
  Loader2,
  FolderOpen,
  Save,
  Trash2
} from 'lucide-react';
import { ReportConfig } from '../types';

interface ReportHeaderProps {
  config: ReportConfig;
  onConfigChange: (newConfig: ReportConfig) => void;
  onDownloadPDF: () => void;
  onPrint: () => void;
  onOpenHelp: () => void;
  onLoadSample: () => void;
  onClearReport: () => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isGeneratingPDF: boolean;
  pageCount: number;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  config,
  onConfigChange,
  onDownloadPDF,
  onPrint,
  onOpenHelp,
  onLoadSample,
  onClearReport,
  onExportJSON,
  onImportJSON,
  isGeneratingPDF,
  pageCount
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                Reportes Fotográficos Mensuales
              </h1>
              <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                PDF Imprimible
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Crea tu reporte con fotos, fechas, lugares y descargas con 1 solo clic.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Help Button */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-3 py-2.5 rounded-xl border border-slate-200 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            ¿Cómo usar?
          </button>

          {/* More options (Sample / Reset / Backup) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-xl border border-slate-200 transition-colors"
            >
              <FolderOpen className="w-4 h-4 text-slate-600" />
              Opciones
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-1.5 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onLoadSample();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs md:text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-900 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  Cargar reporte de ejemplo
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportJSON();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs md:text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-900 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4 text-emerald-600" />
                  Guardar copia en archivo
                </button>

                <label className="w-full text-left px-3 py-2 text-xs md:text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-900 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                  <FolderOpen className="w-4 h-4 text-indigo-600" />
                  Cargar copia guardada
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      onImportJSON(e);
                      setShowMenu(false);
                    }}
                    className="hidden"
                  />
                </label>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  type="button"
                  onClick={() => {
                    onClearReport();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs md:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  Empezar nuevo reporte en blanco
                </button>
              </div>
            )}
          </div>

          {/* Direct Print Button */}
          <button
            type="button"
            onClick={onPrint}
            title="Imprimir directamente en papel o guardar como PDF del navegador"
            className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-xl border border-slate-300 shadow-xs transition-all active:scale-95"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            Imprimir
          </button>

          {/* Download PDF Button (The most prominent) */}
          <button
            type="button"
            onClick={onDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 text-sm md:text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando PDF...
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5 stroke-[2.5]" />
                Descargar PDF ({pageCount} {pageCount === 1 ? 'Hoja' : 'Hojas'})
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
