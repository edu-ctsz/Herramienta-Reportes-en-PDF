import React from 'react';
import { Plus, Copy, Trash2, ChevronLeft, ChevronRight, FileText, Sparkles } from 'lucide-react';
import { EvidencePage } from '../types';
import { formatDateToSpanish } from '../utils/dateUtils';

interface PageNavigatorProps {
  pages: EvidencePage[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onMovePage: (fromIndex: number, toIndex: number) => void;
}

export const PageNavigator: React.FC<PageNavigatorProps> = ({
  pages,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm space-y-3">
      {/* Top bar with count & main add button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-700" />
          <h3 className="text-base md:text-lg font-bold text-slate-900">
            Hojas del Reporte ({pages.length})
          </h3>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
            Hoja actual: {activePageIndex + 1}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Duplicate Current Button */}
          {pages.length > 0 && (
            <button
              type="button"
              onClick={() => onDuplicatePage(activePageIndex)}
              title="Copia la fecha y lugar a una nueva hoja para ahorrar tiempo"
              className="flex items-center gap-1.5 text-xs md:text-sm font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 px-3 py-2 rounded-xl border border-slate-200 transition-all active:scale-95"
            >
              <Copy className="w-4 h-4 text-blue-600" />
              Duplicar Hoja Actual
            </button>
          )}

          {/* Add New Page Button */}
          <button
            type="button"
            onClick={onAddPage}
            className="flex items-center gap-2 text-sm md:text-base font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            + Agregar Nueva Hoja
          </button>
        </div>
      </div>

      {/* Pages Horizontal Strip / Thumbnails */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 px-1">
        {pages.map((p, idx) => {
          const isActive = idx === activePageIndex;
          const photoCount = (p.photos || []).length;
          const formattedDate = formatDateToSpanish(p.date);

          return (
            <div
              key={p.id || idx}
              onClick={() => onSelectPage(idx)}
              className={`group shrink-0 w-44 md:w-52 p-3 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between h-32 ${
                isActive
                  ? 'bg-blue-50/90 border-blue-600 shadow-md ring-2 ring-blue-200'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {/* Header inside thumbnail */}
              <div className="flex items-center justify-between">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {idx + 1}
                </span>

                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  📷 {photoCount} foto{photoCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Title / Summary */}
              <div className="my-1">
                <p className={`text-xs font-bold truncate ${isActive ? 'text-blue-950' : 'text-slate-800'}`}>
                  {p.title || 'Sin título aún'}
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {formattedDate || 'Sin fecha'}
                </p>
              </div>

              {/* Action Buttons in thumbnail */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-auto">
                <div className="flex items-center gap-1">
                  {/* Move Left */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovePage(idx, idx - 1);
                    }}
                    title="Mover hoja hacia la izquierda"
                    className="p-1 hover:bg-slate-200 rounded disabled:opacity-20 text-slate-600 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Right */}
                  <button
                    type="button"
                    disabled={idx === pages.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovePage(idx, idx + 1);
                    }}
                    title="Mover hoja hacia la derecha"
                    className="p-1 hover:bg-slate-200 rounded disabled:opacity-20 text-slate-600 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Delete Page */}
                {pages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(idx);
                    }}
                    title="Eliminar esta hoja"
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
