import React from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';

interface NotebookNavigationProps {
  currentPageIndex: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectPage: (index: number) => void;
  onAddNewPage: () => void;
  onDeleteCurrentPage: () => void;
}

export const NotebookNavigation: React.FC<NotebookNavigationProps> = ({
  currentPageIndex,
  totalPages,
  onPrevPage,
  onNextPage,
  onSelectPage,
  onAddNewPage,
  onDeleteCurrentPage
}) => {
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === totalPages - 1;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2.5">
      {/* Main Navigation Card */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-3 sm:p-4 space-y-3">
        
        {/* Top Section: Page Numbers Row flowing horizontally (clean, no redundant counter) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5 pb-2 border-b border-slate-100">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const isSelected = idx === currentPageIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPage(idx)}
                className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
                title={`Ir a la Hoja #${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Bottom Row: [ ← ]  [ + Nueva Hoja ]  [ → ] */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Left: Previous Page Arrow Button (Only Arrow, no text) */}
          <button
            type="button"
            onClick={onPrevPage}
            disabled={isFirstPage}
            className="w-12 h-11 sm:w-14 sm:h-12 flex items-center justify-center shrink-0 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white text-slate-800 font-extrabold transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed shadow-xs"
            title="Página anterior"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>

          {/* Center: Add New Page Button with FULL visible text "Nueva Hoja" */}
          <button
            type="button"
            onClick={onAddNewPage}
            className="flex-1 h-11 sm:h-12 flex items-center justify-center gap-2 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            title="Crear una nueva hoja en blanco"
          >
            <Plus className="w-5 h-5 stroke-[3] shrink-0" />
            <span className="whitespace-nowrap font-black">Nueva Hoja</span>
          </button>

          {/* Right: Next Page Arrow Button (Only Arrow, no text) */}
          <button
            type="button"
            onClick={onNextPage}
            disabled={isLastPage}
            className="w-12 h-11 sm:w-14 sm:h-12 flex items-center justify-center shrink-0 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white text-slate-800 font-extrabold transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed shadow-xs"
            title="Página siguiente"
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Sub-bar: Auto-save note & Delete current page */}
      <div className="flex items-center justify-between px-2 text-xs sm:text-sm">
        <span className="text-slate-500 font-medium">
          💡 Los cambios se guardan automáticamente en tu equipo.
        </span>

        {totalPages > 1 && (
          <button
            type="button"
            onClick={onDeleteCurrentPage}
            className="text-red-600 hover:text-red-800 font-bold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Borrar esta hoja #{currentPageIndex + 1}
          </button>
        )}
      </div>
    </div>
  );
};
