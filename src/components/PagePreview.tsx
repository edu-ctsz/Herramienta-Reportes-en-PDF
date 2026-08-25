import React, { useState } from 'react';
import { EvidencePage } from '../types';
import { formatDateToSpanish } from '../utils/dateUtils';
import { ZoomIn, ZoomOut, Maximize2, FileText } from 'lucide-react';

interface PagePreviewProps {
  page: EvidencePage;
  pageNumber: number;
  totalPages: number;
}

export const PagePreview: React.FC<PagePreviewProps> = ({
  page,
  pageNumber,
  totalPages
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const formattedDate = formatDateToSpanish(page.date);
  const photos = page.photos || [];

  return (
    <div className="flex flex-col h-full bg-slate-200/70 rounded-2xl p-4 md:p-6 border border-slate-300">
      {/* Top Preview Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-300/80 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-700" />
          <span className="font-bold text-slate-900 text-sm md:text-base">
            Vista Previa de la Hoja Impresa #{pageNumber}
          </span>
          <span className="text-xs font-semibold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-300">
            {pageNumber} de {totalPages}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
          <button
            type="button"
            onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
            title="Reducir vista"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 w-12 text-center select-none">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel(Math.min(130, zoomLevel + 15))}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
            title="Aumentar vista"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(100)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors text-xs font-semibold px-2"
            title="Restablecer al 100%"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sheet Container with realistic paper look */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-2 min-h-[520px]">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            width: '100%',
            maxWidth: '560px',
            aspectRatio: '1 / 1.35', // Standard Letter ratio
            minHeight: '740px'
          }}
          className="bg-white text-slate-900 shadow-2xl rounded-sm p-8 md:p-10 flex flex-col justify-between relative border border-slate-200 select-none"
        >
          {/* 1. Header Right: Date & Location */}
          <div className="text-right space-y-1 ml-auto max-w-[75%]">
            <div className="text-sm md:text-base font-normal text-slate-800 tracking-tight">
              {formattedDate || <span className="text-slate-300 italic">Fecha pendiente</span>}
            </div>
            <div className="text-xs md:text-sm font-normal text-slate-800 leading-snug">
              {page.location || <span className="text-slate-300 italic">Lugar o dirección</span>}
            </div>
          </div>

          {/* 2. Left side: Activity Title and Notes */}
          <div className="mt-4 mb-3 space-y-1">
            <h3 className="text-sm md:text-base font-bold text-slate-950 leading-tight">
              {page.title || <span className="text-slate-300 italic font-normal">Título de la actividad (ej. Reparación de fugas)</span>}
            </h3>
            {page.notes && page.notes.trim().length > 0 && (
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {page.notes}
              </p>
            )}
          </div>

          {/* 3. Photos Area */}
          <div className="flex-1 flex flex-col justify-center my-2 overflow-hidden">
            {photos.length === 0 ? (
              <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                <span className="text-2xl">📷</span>
                <span className="text-xs md:text-sm font-medium">
                  Aún no has agregado fotos en esta hoja.
                </span>
                <span className="text-[11px] text-slate-400">
                  Usa el panel de la izquierda para seleccionarlas.
                </span>
              </div>
            ) : photos.length === 1 ? (
              // 1 Large Photo
              <div className="w-full flex items-center justify-center max-h-[460px]">
                <img
                  src={photos[0].dataUrl}
                  alt="Foto 1"
                  style={{
                    transform: `rotate(${photos[0].rotation || 0}deg)`,
                    maxHeight: '430px'
                  }}
                  className="w-auto h-auto max-w-full object-contain rounded-sm"
                />
              </div>
            ) : photos.length === 2 ? (
              // 2 Photos Stacked (Exact layout as sample PDF)
              <div className="flex flex-col gap-3 justify-center items-center h-full max-h-[500px]">
                <div className="flex-1 max-h-[235px] w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={photos[0].dataUrl}
                    alt="Foto 1"
                    style={{
                      transform: `rotate(${photos[0].rotation || 0}deg)`
                    }}
                    className="max-h-full max-w-full object-contain rounded-sm"
                  />
                </div>
                <div className="flex-1 max-h-[235px] w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={photos[1].dataUrl}
                    alt="Foto 2"
                    style={{
                      transform: `rotate(${photos[1].rotation || 0}deg)`
                    }}
                    className="max-h-full max-w-full object-contain rounded-sm"
                  />
                </div>
              </div>
            ) : (
              // 3 Photos (1 Tall Left + 2 Stacked Right, as in sample page 6)
              <div className="grid grid-cols-2 gap-2.5 h-full max-h-[480px]">
                <div className="flex items-center justify-center overflow-hidden h-full">
                  <img
                    src={photos[0].dataUrl}
                    alt="Foto 1"
                    style={{
                      transform: `rotate(${photos[0].rotation || 0}deg)`
                    }}
                    className="max-h-full max-w-full object-contain rounded-sm"
                  />
                </div>
                <div className="flex flex-col gap-2 justify-center h-full">
                  {photos[1] && (
                    <div className="flex-1 max-h-[230px] flex items-center justify-center overflow-hidden">
                      <img
                        src={photos[1].dataUrl}
                        alt="Foto 2"
                        style={{
                          transform: `rotate(${photos[1].rotation || 0}deg)`
                        }}
                        className="max-h-full max-w-full object-contain rounded-sm"
                      />
                    </div>
                  )}
                  {photos[2] && (
                    <div className="flex-1 max-h-[230px] flex items-center justify-center overflow-hidden">
                      <img
                        src={photos[2].dataUrl}
                        alt="Foto 3"
                        style={{
                          transform: `rotate(${photos[2].rotation || 0}deg)`
                        }}
                        className="max-h-full max-w-full object-contain rounded-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. Page Number at Bottom Right */}
          <div className="text-right pt-2">
            <span className="text-sm md:text-base font-normal text-slate-800">
              {pageNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
