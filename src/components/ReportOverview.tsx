import React from 'react';
import { 
  Plus, 
  FileDown, 
  Printer, 
  Edit3, 
  Trash2, 
  FileText, 
  Calendar, 
  MapPin, 
  RotateCw, 
  Sparkles, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { EvidencePage, ReportConfig } from '../types';
import { formatDateToSpanish } from '../utils/dateUtils';

interface ReportOverviewProps {
  pages: EvidencePage[];
  config: ReportConfig;
  onAddNewPage: () => void;
  onEditPage: (index: number) => void;
  onDeletePageRequest: (index: number) => void;
  onDownloadPDF: () => void;
  onPrint: () => void;
  onResetReportRequest: () => void;
  onLoadSampleRequest: () => void;
  isGeneratingPDF: boolean;
}

export const ReportOverview: React.FC<ReportOverviewProps> = ({
  pages,
  config,
  onAddNewPage,
  onEditPage,
  onDeletePageRequest,
  onDownloadPDF,
  onPrint,
  onResetReportRequest,
  onLoadSampleRequest,
  isGeneratingPDF
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner with Main Action Buttons */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs md:text-sm font-extrabold px-3 py-1 rounded-full">
                Reporte Listo
              </span>
              <span className="text-slate-500 text-sm font-semibold">
                {pages.length} {pages.length === 1 ? 'Hoja en total' : 'Hojas en total'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              Reporte Mensual de Evidencias
            </h2>
            <p className="text-base text-slate-600 mt-1">
              Revisa tus hojas a continuación, agrega más hojas o descarga el archivo PDF terminado.
            </p>
          </div>

          {/* Primary Big Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Add another page button */}
            <button
              type="button"
              onClick={onAddNewPage}
              className="py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-98"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
              + Agregar Otra Hoja
            </button>

            {/* Giant Download PDF Button */}
            <button
              type="button"
              onClick={onDownloadPDF}
              disabled={isGeneratingPDF || pages.length === 0}
              className="py-4 px-8 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-98"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generando PDF...
                </>
              ) : (
                <>
                  <FileDown className="w-6 h-6 stroke-[2.5]" />
                  Descargar PDF ({pages.length} {pages.length === 1 ? 'Hoja' : 'Hojas'})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Secondary Utility Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrint}
              className="text-xs md:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              Imprimir directamente
            </button>

            <button
              type="button"
              onClick={onLoadSampleRequest}
              className="text-xs md:text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-blue-600" />
              Cargar ejemplo
            </button>
          </div>

          <button
            type="button"
            onClick={onResetReportRequest}
            className="text-xs md:text-sm font-bold text-red-600 hover:text-red-800 hover:bg-red-50 px-3.5 py-2 rounded-xl border border-transparent hover:border-red-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Borrar todo y crear nuevo reporte desde cero
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">
            Hojas que componen este reporte:
          </h3>
          <span className="text-sm font-semibold text-slate-500">
            {pages.length} {pages.length === 1 ? 'página' : 'páginas'} en orden
          </span>
        </div>

        {pages.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-300 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-2xl">
              📄
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">
                Tu reporte no tiene hojas todavía
              </h4>
              <p className="text-slate-600 mt-1">
                Toca el botón azul para crear tu primera hoja paso a paso.
              </p>
            </div>
            <button
              type="button"
              onClick={onAddNewPage}
              className="py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md text-base"
            >
              + Crear Primera Hoja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pages.map((page, index) => {
              const formattedDate = formatDateToSpanish(page.date);
              const photos = page.photos || [];

              return (
                <div
                  key={page.id || index}
                  className="bg-white rounded-3xl p-5 md:p-6 border-2 border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all gap-4"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                        {index + 1}
                      </div>
                      <div>
                        <span className="text-xs uppercase font-extrabold text-blue-700">
                          Hoja #{index + 1} del PDF
                        </span>
                        <h4 className="text-lg font-extrabold text-slate-900 line-clamp-1">
                          {page.title || 'Sin título de actividad'}
                        </h4>
                      </div>
                    </div>

                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold shrink-0">
                      📷 {photos.length} foto{photos.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Metadata (Date & Location) */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl space-y-1.5 text-sm border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{formattedDate || 'Sin fecha'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{page.location || 'Sin lugar asignado'}</span>
                    </div>
                  </div>

                  {/* Photos Thumbnail strip */}
                  <div className="h-32 bg-slate-100 rounded-2xl p-2 flex items-center justify-center gap-2 overflow-hidden border border-slate-200">
                    {photos.length === 0 ? (
                      <span className="text-xs text-slate-400 font-medium">Sin fotos</span>
                    ) : (
                      photos.map((p, pIdx) => (
                        <div key={p.id || pIdx} className="h-full flex-1 max-w-[150px] bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-200">
                          <img
                            src={p.dataUrl}
                            alt={`Foto ${pIdx + 1}`}
                            style={{ transform: `rotate(${p.rotation || 0}deg)` }}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ))
                    )}
                  </div>

                  {/* Action Buttons: Edit and Delete */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onEditPage(index)}
                      className="py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit3 className="w-4 h-4 text-blue-600" />
                      Editar Hoja
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeletePageRequest(index)}
                      className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                      Borrar Hoja
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
