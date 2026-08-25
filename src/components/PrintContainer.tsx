import React from 'react';
import { EvidencePage } from '../types';
import { formatDateToSpanish } from '../utils/dateUtils';

interface PrintContainerProps {
  pages: EvidencePage[];
}

export const PrintContainer: React.FC<PrintContainerProps> = ({ pages }) => {
  return (
    <div className="print-only">
      {pages.map((page, index) => {
        const formattedDate = formatDateToSpanish(page.date || '');
        const photos = page.photos || [];
        const pageNum = index + 1;

        return (
          <div key={page.id || index} className="print-page flex flex-col justify-between">
            {/* Header Right: Date & Location */}
            <div className="text-right space-y-1 ml-auto max-w-[80%]">
              <div className="text-base font-normal text-black">
                {formattedDate}
              </div>
              <div className="text-sm font-normal text-black leading-snug">
                {page.location}
              </div>
            </div>

            {/* Left side: Title & Notes */}
            <div className="mt-4 mb-3 space-y-1">
              <h3 className="text-base font-bold text-black leading-tight">
                {page.title}
              </h3>
              {page.notes && page.notes.trim().length > 0 && (
                <p className="text-sm text-black leading-relaxed font-normal">
                  {page.notes}
                </p>
              )}
            </div>

            {/* Photos Area */}
            <div className="flex-1 flex flex-col justify-center my-3 overflow-hidden">
              {photos.length === 0 ? (
                <div className="h-48 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 text-sm">
                  Sin fotografías en esta hoja
                </div>
              ) : photos.length === 1 && photos[0] ? (
                <div className="w-full flex items-center justify-center max-h-[600px]">
                  <img
                    src={photos[0].dataUrl}
                    alt="Evidencia 1"
                    style={{
                      transform: `rotate(${photos[0].rotation || 0}deg)`,
                      maxHeight: '580px'
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : photos.length === 2 && photos[0] && photos[1] ? (
                <div className="flex flex-col gap-4 justify-center items-center h-full max-h-[620px]">
                  <div className="flex-1 max-h-[295px] w-full flex items-center justify-center overflow-hidden">
                    <img
                      src={photos[0].dataUrl}
                      alt="Evidencia 1"
                      style={{
                        transform: `rotate(${photos[0].rotation || 0}deg)`
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 max-h-[295px] w-full flex items-center justify-center overflow-hidden">
                    <img
                      src={photos[1].dataUrl}
                      alt="Evidencia 2"
                      style={{
                        transform: `rotate(${photos[1].rotation || 0}deg)`
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              ) : photos.length >= 3 && photos[0] ? (
                <div className="grid grid-cols-2 gap-3 h-full max-h-[600px]">
                  <div className="flex items-center justify-center overflow-hidden h-full">
                    <img
                      src={photos[0].dataUrl}
                      alt="Evidencia 1"
                      style={{
                        transform: `rotate(${photos[0].rotation || 0}deg)`
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-3 justify-center h-full">
                    {photos[1] && (
                      <div className="flex-1 max-h-[285px] flex items-center justify-center overflow-hidden">
                        <img
                          src={photos[1].dataUrl}
                          alt="Evidencia 2"
                          style={{
                            transform: `rotate(${photos[1].rotation || 0}deg)`
                          }}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                    {photos[2] && (
                      <div className="flex-1 max-h-[285px] flex items-center justify-center overflow-hidden">
                        <img
                          src={photos[2].dataUrl}
                          alt="Evidencia 3"
                          style={{
                            transform: `rotate(${photos[2].rotation || 0}deg)`
                          }}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer Bottom Right: Page Number */}
            <div className="text-right pt-2">
              <span className="text-base font-normal text-black">
                {pageNum}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
