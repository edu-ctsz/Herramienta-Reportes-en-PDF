import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Check, X, ChevronLeft, ChevronRight, Sparkles, Camera } from 'lucide-react';
import { getTodayISO } from '../utils/dateUtils';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';

interface DatePickerModalProps {
  isOpen: boolean;
  currentDate: string;
  detectedPhotoDate?: string;
  onSaveDate: (newDate: string) => void;
  onClose: () => void;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEK_DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

/**
 * Formats YYYY-MM-DD to DD/MM/YYYY
 */
function formatDateToDMY(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  currentDate,
  detectedPhotoDate,
  onSaveDate,
  onClose
}) => {
  useBodyScrollLock(isOpen);

  const initialDate = currentDate || getTodayISO();
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);

  // Current viewed month & year in calendar
  const [viewYear, setViewYear] = useState<number>(() => {
    const parts = initialDate.split('-');
    return parts[0] ? parseInt(parts[0], 10) : new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState<number>(() => {
    const parts = initialDate.split('-');
    return parts[1] ? parseInt(parts[1], 10) - 1 : new Date().getMonth();
  });

  const handleApplyPhotoDate = () => {
    if (!detectedPhotoDate) return;
    setSelectedDate(detectedPhotoDate);
    const parts = detectedPhotoDate.split('-');
    if (parts.length === 3) {
      setViewYear(parseInt(parts[0], 10));
      setViewMonth(parseInt(parts[1], 10) - 1);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const active = currentDate || getTodayISO();
      setSelectedDate(active);
      const parts = active.split('-');
      if (parts.length === 3) {
        setViewYear(parseInt(parts[0], 10));
        setViewMonth(parseInt(parts[1], 10) - 1);
      }
    }
  }, [isOpen, currentDate]);

  if (!isOpen) return null;

  const todayISO = getTodayISO();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const yyyy = viewYear;
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  const handleSave = () => {
    onSaveDate(selectedDate);
    onClose();
  };

  // Calendar calculations
  // First day of month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  // Adjust so Monday is 0 and Sunday is 6
  const startingCol = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Parse selected date parts for matching
  const selectedParts = selectedDate.split('-');
  const selYear = parseInt(selectedParts[0], 10);
  const selMonth = parseInt(selectedParts[1], 10) - 1;
  const selDay = parseInt(selectedParts[2], 10);

  const isSelected = (day: number) => {
    return viewYear === selYear && viewMonth === selMonth && day === selDay;
  };

  const isToday = (day: number) => {
    const parts = todayISO.split('-');
    return (
      viewYear === parseInt(parts[0], 10) &&
      viewMonth === parseInt(parts[1], 10) - 1 &&
      day === parseInt(parts[2], 10)
    );
  };

  return (
    <div className="fixed inset-0 z-50 h-[100dvh] w-full bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overscroll-contain">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col max-h-[92dvh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold">Elegir la Fecha</h3>
              <p className="text-xs text-blue-100">Toca el día en el calendario</p>
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

        {/* Scrollable Content with Interactive Calendar */}
        <div className="p-3.5 sm:p-5 space-y-3.5 overflow-y-auto overscroll-contain flex-1">
          
          {/* Optional detected photo date shortcut */}
          {detectedPhotoDate && (
            <button
              type="button"
              onClick={handleApplyPhotoDate}
              className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-xl text-amber-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <Camera className="w-4 h-4 text-amber-700" />
              <span>Usar fecha tomada en la foto ({formatDateToDMY(detectedPhotoDate)})</span>
            </button>
          )}

          {/* Interactive Visual Calendar */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs">
            
            {/* Month & Year Header with Navigation */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors cursor-pointer"
                title="Mes anterior"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="text-center">
                <span className="text-base sm:text-lg font-black text-slate-900 block capitalize">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors cursor-pointer"
                title="Mes siguiente"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {WEEK_DAYS.map((wd) => (
                <div key={wd} className="text-[11px] sm:text-xs font-black text-slate-500 py-1">
                  {wd}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Previous month filler days */}
              {Array.from({ length: startingCol }).map((_, i) => {
                const dayNum = daysInPrevMonth - startingCol + i + 1;
                return (
                  <div
                    key={`prev-${i}`}
                    className="h-9 sm:h-10 flex items-center justify-center text-xs text-slate-300 select-none font-medium"
                  >
                    {dayNum}
                  </div>
                );
              })}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const active = isSelected(dayNum);
                const currentToday = isToday(dayNum);

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-9 sm:h-10 w-full rounded-xl flex flex-col items-center justify-center text-xs sm:text-sm font-extrabold transition-all cursor-pointer relative ${
                      active
                        ? 'bg-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-400 z-10'
                        : currentToday
                        ? 'bg-blue-100/70 text-blue-900 border border-blue-400 hover:bg-blue-200 font-black'
                        : 'hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {currentToday && !active && (
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full -mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Box as requested: "seleccionado: fecha: x/x/x" */}
          <div className="p-3.5 bg-blue-50/90 rounded-2xl border-2 border-blue-200 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-800 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Seleccionado:</span>
            </div>
            
            <div className="text-base sm:text-lg font-black text-slate-900">
              Fecha: <span className="text-blue-700">{formatDateToDMY(selectedDate)}</span>
            </div>
          </div>
        </div>

        {/* Footer: Cancelar y Guardar Fecha */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Guardar Fecha
          </button>
        </div>
      </div>
    </div>
  );
};
