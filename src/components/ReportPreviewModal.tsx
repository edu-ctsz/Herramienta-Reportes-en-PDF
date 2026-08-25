import React, { useState, useEffect } from 'react';
import { EvidencePage } from '../types';
import { formatDateToSpanish } from '../utils/dateUtils';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';
import { 
  Eye, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  FileDown, 
  ZoomIn, 
  ZoomOut, 
  Loader2,
  FileText
} from 'lucide-react';

interface ReportPreviewModalProps {
  isOpen: boolean;
  pages: EvidencePage[];
  initialPageIndex?: number;
  isGeneratingPDF: boolean;
  onDownloadPDF: () => void;
  onClose: () => void;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  pages,
  initialPageIndex = 0,
  isGeneratingPDF,
  onDownloadPDF,
  onClose
}) => {
  useBodyScrollLock(isOpen);

  const [currentPageIndex, setCurrentPageIndex] = useState<number>(initialPageIndex);
  // Zoom mode: 'compact' (480px), 'normal' (580px), 'large' (680px)
  const [zoomMode, setZoomMode] = useState<'compact' | 'normal' | 'large'>('normal');

  useEffect(() => {
    if (isOpen) {
      setCurrentPageIndex(initialPageIndex);
    }
  }, [isOpen, initialPageIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentPageIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pages.length, onClose]);

  if (!isOpen || pages.length === 0) return null;

  const safePageIndex = Math.max(0, Math.min(pages.length - 1, currentPageIndex));
  const activePage = pages[safePageIndex] || pages[0];
  const pageNumber = safePageIndex + 1;
  const totalPages = pages.length;
  const formattedDate = formatDateToSpanish(activePage?.date || '');
  const photos = activePage?.photos || [];

  const maxWidthClass = 
    zoomMode === 'compact' ? 'max-w-[460px]' :
    zoomMode === 'large' ? 'max-w-[680px]' : 'max-w-[580px]';

  return (
    <div className="fixed inset-0 z-50 h-[100dvh] w-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      
      {/* 1. TOP HEADER: Stable Fixed Height */}
      <header className="h-16 bg-slate-900 text-white px-3 sm:px-6 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 z-20">
        {/* Title & Page count */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div className="truncate">
            <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
              Vista Previa del PDF
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300">
              Hoja <strong className="text-white">{pageNumber}</strong> de {totalPages}
            </p>
          </div>
        </div>

        {/* Center: Zoom Buttons (Desktop / Tablet) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setZoomMode((prev) => prev === 'large' ? 'normal' : 'compact')}
            disabled={zoomMode === 'compact'}
            className="p-1.5 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reducir hoja"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-300 px-2 select-none">
            {zoomMode === 'compact' ? '75%' : zoomMode === 'large' ? '125%' : '100%'}
          </span>
          <button
            type="button"
            onClick={() => setZoomMode((prev) => prev === 'compact' ? 'normal' : 'large')}
            disabled={zoomMode === 'large'}
            className="p-1.5 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Aumentar hoja"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Download PDF and Close button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Generando...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 stroke-[2.5]" />
                <span>Descargar PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Cerrar vista previa"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {/* 2. SCROLLABLE MIDDLE CANVAS: Zero-Jitter Scroll Container with generous padding */}
      <main className="flex-1 w-full overflow-y-auto overscroll-contain px-3 py-4 sm:py-6 flex flex-col items-center">
        <div className={`w-full ${maxWidthClass} bg-white text-slate-900 rounded-lg shadow-2xl p-5 sm:p-8 md:p-10 flex flex-col justify-between border-2 border-slate-300 relative my-2 mb-10 shrink-0 min-h-[620px]`}>
          
          {/* Header Right: Date & Location (Only rendered if date or location is provided) */}
          {(formattedDate || activePage?.location) && (
            <div className="text-right space-y-1 ml-auto max-w-[85%] pb-2 border-b border-slate-100">
              {formattedDate && (
                <div className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight">
                  {formattedDate}
                </div>
              )}
              {activePage?.location && (
                <div className="text-[11px] sm:text-xs font-medium text-slate-700 leading-snug">
                  {activePage.location}
                </div>
              )}
            </div>
          )}

          {/* Title & Notes (Only rendered if provided) */}
          {(activePage?.title || activePage?.notes) && (
            <div className="mt-3 mb-2 space-y-1">
              {activePage?.title && activePage.title.trim().length > 0 && (
                <h4 className="text-sm sm:text-base font-bold text-slate-950 leading-tight">
                  {activePage.title}
                </h4>
              )}
              {activePage?.notes && activePage.notes.trim().length > 0 && (
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activePage.notes}
                </p>
              )}
            </div>
          )}

          {/* Center: Photographs matching PDF proportions */}
          <div className="flex-1 flex flex-col justify-center my-3 overflow-hidden">
            {photos.length === 0 ? null : photos.length === 1 ? (
              /* 1 Centered Photo */
              <div className="w-full flex items-center justify-center max-h-[380px] overflow-hidden py-1">
                <img
                  src={photos[0].dataUrl}
                  alt="Evidencia 1"
                  style={{
                    transform: `rotate(${photos[0].rotation || 0}deg)`,
                    maxHeight: '360px'
                  }}
                  className="w-auto h-auto max-w-full object-contain rounded-xs shadow-xs"
                />
              </div>
            ) : photos.length === 2 ? (
              /* 2 Stacked Photos */
              <div className="flex flex-col gap-3 justify-center items-center h-full max-h-[420px]">
                <div className="flex-1 max-h-[195px] w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={photos[0].dataUrl}
                    alt="Evidencia 1"
                    style={{
                      transform: `rotate(${photos[0].rotation || 0}deg)`
                    }}
                    className="max-h-full max-w-full object-contain rounded-xs shadow-xs"
                  />
                </div>
                <div className="flex-1 max-h-[195px] w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={photos[1].dataUrl}
                    alt="Evidencia 2"
                    style={{
                      transform: `rotate(${photos[1].rotation || 0}deg)`
                    }}
                    className="max-h-full max-w-full object-contain rounded-xs shadow-xs"
                  />
                </div>
              </div>
            ) : (
              /* 3 Photos Layout (1 Left, 2 Right) */
              <div className="grid grid-cols-2 gap-2.5 h-full max-h-[420px]">
                <div className="flex items-center justify-center overflow-hidden h-full">
                  <img
                    src={photos[0].dataUrl}
                    alt="Evidencia 1"
                    style={{
                      transform: `rotate(${photos[0].rotation || 0}deg)`
                    }}
                    className="max-h-full max-w-full object-contain rounded-xs"
                  />
                </div>
                <div className="flex flex-col gap-2 justify-center h-full">
                  {photos[1] && (
                    <div className="flex-1 max-h-[190px] flex items-center justify-center overflow-hidden">
                      <img
                        src={photos[1].dataUrl}
                        alt="Evidencia 2"
                        style={{
                          transform: `rotate(${photos[1].rotation || 0}deg)`
                        }}
                        className="max-h-full max-w-full object-contain rounded-xs"
                      />
                    </div>
                  )}
                  {photos[2] && (
                    <div className="flex-1 max-h-[190px] flex items-center justify-center overflow-hidden">
                      <img
                        src={photos[2].dataUrl}
                        alt="Evidencia 3"
                        style={{
                          transform: `rotate(${photos[2].rotation || 0}deg)`
                        }}
                        className="max-h-full max-w-full object-contain rounded-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Right: Page Number with clear visible border */}
          <div className="text-right pt-2 border-t-2 border-slate-200 mt-2">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
              {pageNumber}
            </span>
          </div>
        </div>
      </main>

      {/* 3. BOTTOM NAVIGATION: Rock-solid, touch friendly */}
      <footer className="bg-slate-900 border-t border-slate-800 px-3 py-2.5 sm:px-6 sm:py-3.5 shrink-0 flex items-center justify-between gap-2 z-20">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
          disabled={safePageIndex === 0}
          className="flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Hoja Anterior</span>
        </button>

        {/* Page Jump Bubbles */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[220px] sm:max-w-md py-1 px-1">
          {pages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentPageIndex(idx)}
              className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl font-extrabold text-xs flex items-center justify-center transition-all cursor-pointer ${
                idx === safePageIndex
                  ? 'bg-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
          disabled={safePageIndex === totalPages - 1}
          className="flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Siguiente Hoja</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
