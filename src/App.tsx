import React, { useState, useEffect } from 'react';
import { EvidencePage, PhotoItem } from './types';
import { SAMPLE_PAGES, INITIAL_SAVED_LOCATIONS, createBlankPage } from './utils/sampleData';
import { getTodayISO, getMonthYearSpanish } from './utils/dateUtils';
import { generateReportPDF, downloadBlobAsFile } from './utils/pdfGenerator';
import { optimizeImageFile } from './utils/imageUtils';
import { extractDateFromImageFile } from './utils/imageDateExtractor';
import { NotebookPage } from './components/NotebookPage';
import { NotebookNavigation } from './components/NotebookNavigation';
import { DatePickerModal } from './components/DatePickerModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { HelpModal } from './components/HelpModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ReportPreviewModal } from './components/ReportPreviewModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { PrintContainer } from './components/PrintContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import confetti from 'canvas-confetti';
import { 
  FileDown, 
  HelpCircle, 
  Trash2, 
  Loader2,
  BookOpen,
  Eye,
  Plus,
  Sparkles,
  RotateCcw
} from 'lucide-react';

const STORAGE_KEY_PAGES = 'report_evidence_pages_v3';
const STORAGE_KEY_LOCATIONS = 'report_saved_locations_v3';

function MainApp() {
  // 1. Pages State: Starts Clean and Blank by Default!
  const [pages, setPages] = useState<EvidencePage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved pages from storage', e);
    }
    // Clean initial blank page
    return [createBlankPage(INITIAL_SAVED_LOCATIONS[0])];
  });

  // 2. Current Active Page Index
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // 3. Saved Locations for quick picking
  const [savedLocations, setSavedLocations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved locations', e);
    }
    return INITIAL_SAVED_LOCATIONS;
  });

  // 4. Modals and Processing States
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-app confirmation dialog
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Safe Auto-persistence to LocalStorage (won't crash on mobile quota limits)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PAGES, JSON.stringify(pages));
    } catch (e) {
      console.warn('LocalStorage limit reached or disabled', e);
    }
  }, [pages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(savedLocations));
    } catch (e) {
      console.warn('LocalStorage save failed for locations', e);
    }
  }, [savedLocations]);

  // Ensure valid current index bound
  useEffect(() => {
    if (currentPageIndex >= pages.length && pages.length > 0) {
      setCurrentPageIndex(pages.length - 1);
    }
  }, [pages.length, currentPageIndex]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Safe access to current page
  const safeIndex = Math.max(0, Math.min(pages.length - 1, currentPageIndex));
  const currentPage: EvidencePage = pages[safeIndex] || createBlankPage(savedLocations[0]);

  // Field updater for active page
  const handleUpdateCurrentField = <K extends keyof EvidencePage>(field: K, value: EvidencePage[K]) => {
    setPages((prev) => {
      const updated = [...prev];
      if (updated[safeIndex]) {
        updated[safeIndex] = {
          ...updated[safeIndex],
          [field]: value
        };
      }
      return updated;
    });
  };

  // Add photos with optimization and automatic capture date extraction
  const handleAddPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setIsProcessingPhotos(true);
      const fileArray = Array.from(files);
      const newPhotos: PhotoItem[] = [];
      let detectedDate: string | null = null;

      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) continue;
        
        // Extract camera capture date if available
        const photoDate = await extractDateFromImageFile(file);
        if (photoDate && !detectedDate) {
          detectedDate = photoDate;
        }

        const optimizedDataUrl = await optimizeImageFile(file, 1600, 0.82);
        if (optimizedDataUrl) {
          newPhotos.push({
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            dataUrl: optimizedDataUrl,
            fileName: file.name,
            rotation: 0,
            capturedDate: photoDate || undefined
          });
        }
      }

      if (newPhotos.length > 0) {
        setPages((prev) => {
          const updated = [...prev];
          const targetIndex = Math.max(0, Math.min(updated.length - 1, currentPageIndex));
          if (updated[targetIndex]) {
            const currentPhotos = updated[targetIndex].photos || [];
            updated[targetIndex] = {
              ...updated[targetIndex],
              // Automatically apply detected photo date to the page
              date: detectedDate || updated[targetIndex].date,
              photos: [...currentPhotos, ...newPhotos]
            };
          }
          return updated;
        });

        if (detectedDate) {
          const parts = detectedDate.split('-');
          const dmy = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : detectedDate;
          showToast(`✓ Foto agregada (Fecha detectada: ${dmy})`);
        } else {
          showToast(`✓ ${newPhotos.length === 1 ? 'Foto agregada' : `${newPhotos.length} fotos agregadas`}`);
        }
      }
    } catch (err) {
      console.error('Error procesando fotos:', err);
      showToast('⚠️ No se pudo procesar alguna imagen');
    } finally {
      setIsProcessingPhotos(false);
    }
  };

  // Rotate photo 90 degrees
  const handleRotatePhoto = (photoId: string) => {
    setPages((prev) => {
      const updated = [...prev];
      if (updated[safeIndex]) {
        const currentPhotos = updated[safeIndex].photos || [];
        updated[safeIndex] = {
          ...updated[safeIndex],
          photos: currentPhotos.map((p) =>
            p.id === photoId
              ? { ...p, rotation: ((p.rotation || 0) + 90) % 360 }
              : p
          )
        };
      }
      return updated;
    });
  };

  // Remove photo
  const handleRemovePhoto = (photoId: string) => {
    setPages((prev) => {
      const updated = [...prev];
      if (updated[safeIndex]) {
        const currentPhotos = updated[safeIndex].photos || [];
        updated[safeIndex] = {
          ...updated[safeIndex],
          photos: currentPhotos.filter((p) => p.id !== photoId)
        };
      }
      return updated;
    });
    showToast('✓ Foto quitada');
  };

  // Add a new blank page to the notebook
  const handleAddNewPage = () => {
    setPages((prevPages) => {
      const lastPage = prevPages[prevPages.length - 1];
      const newPage: EvidencePage = {
        id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        date: lastPage ? lastPage.date : getTodayISO(),
        location: lastPage ? lastPage.location : (savedLocations[0] || ''),
        title: '',
        notes: '',
        photos: [],
        layout: 'stacked'
      };
      const updated = [...prevPages, newPage];
      setCurrentPageIndex(updated.length - 1);
      return updated;
    });
    showToast(`✓ Nueva Hoja agregada`);
  };

  // Delete current page
  const handleDeleteCurrentPage = () => {
    if (pages.length <= 1) {
      // If only 1 page left, clear its contents instead of deleting
      setConfirmModal({
        isOpen: true,
        title: '¿Limpiar esta hoja?',
        message: 'Se borrarán las fotos y el título de esta hoja para que quede en blanco.',
        confirmText: 'Sí, limpiar hoja',
        isDestructive: true,
        onConfirm: () => {
          setPages([createBlankPage(savedLocations[0])]);
          setCurrentPageIndex(0);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          showToast('✓ Hoja en blanco');
        }
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: `¿Borrar Hoja #${safeIndex + 1}?`,
      message: `¿Estás seguro de que deseas eliminar la Hoja #${safeIndex + 1}?`,
      confirmText: 'Sí, borrar hoja',
      isDestructive: true,
      onConfirm: () => {
        setPages((prev) => {
          const updated = prev.filter((_, idx) => idx !== safeIndex);
          const nextIndex = Math.min(safeIndex, Math.max(0, updated.length - 1));
          setCurrentPageIndex(nextIndex);
          return updated.length > 0 ? updated : [createBlankPage(savedLocations[0])];
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('✓ Hoja eliminada');
      }
    });
  };

  // Reset entire report for a clean blank start
  const handleResetReport = () => {
    setConfirmModal({
      isOpen: true,
      title: '¿Empezar un nuevo reporte en blanco?',
      message: 'Se borrarán las hojas actuales para que comiences un reporte nuevo y limpio desde la Hoja #1.',
      confirmText: 'Sí, empezar de cero',
      isDestructive: true,
      onConfirm: () => {
        const blank = createBlankPage(savedLocations[0]);
        setPages([blank]);
        setCurrentPageIndex(0);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('✓ Reporte en blanco listo');
      }
    });
  };

  // Load sample report for demo/testing
  const handleLoadSample = () => {
    setPages(SAMPLE_PAGES);
    setCurrentPageIndex(0);
    showToast('✓ Reporte de ejemplo cargado (4 hojas)');
  };

  // Saved location management
  const handleAddSavedLocation = (loc: string) => {
    if (!loc || !loc.trim()) return;
    const trimmed = loc.trim();
    if (!savedLocations.includes(trimmed)) {
      setSavedLocations([trimmed, ...savedLocations]);
    }
  };

  const handleDeleteSavedLocation = (locToDelete: string) => {
    setSavedLocations(savedLocations.filter((l) => l !== locToDelete));
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    if (pages.length === 0) {
      showToast('⚠️ Agrega al menos 1 hoja para descargar');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      const pdfBlob = await generateReportPDF(pages, 'Reporte Mensual de Evidencias');
      const filename = `Reporte_Evidencias_${getMonthYearSpanish(pages[0]?.date || getTodayISO()).replace(/\s+/g, '_')}.pdf`;
      downloadBlobAsFile(pdfBlob, filename);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast('🎉 ¡PDF descargado con éxito!');
    } catch (err) {
      console.error('Error al generar PDF', err);
      showToast('❌ Error al generar el PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-200 text-slate-900 font-sans pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white font-extrabold text-sm sm:text-base px-5 sm:px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR: High Contrast, Touch Friendly & Responsive */}
      <header className="bg-white border-b-2 border-slate-300 sticky top-0 z-30 shadow-sm no-print">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
          
          {/* Mobile Top Row / Desktop Left Side: Logo & Main Title & Hoja Actual */}
          <div className="flex items-center justify-between gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-md shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg md:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Mi Reporte de Evidencias
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bold">
                  {pages.length} {pages.length === 1 ? 'Hoja' : 'Hojas'} en tu reporte
                </p>
              </div>
            </div>

            {/* Hoja actual indicator on top row */}
            <div className="text-xs sm:text-sm font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 select-none shrink-0">
              📄 Hoja: #{safeIndex + 1} de {pages.length}
            </div>
          </div>

          {/* Mobile Bottom Row (Full Width Grid) / Desktop Right Side */}
          <div className="grid grid-cols-3 md:flex md:items-center gap-1.5 sm:gap-2.5 w-full md:w-auto">
            {/* Help Button */}
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-800 font-bold text-xs sm:text-sm border border-slate-300 transition-colors cursor-pointer text-center"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700 shrink-0" />
              <span className="truncate">¿Cómo usar?</span>
            </button>

            {/* Previsualizar Button */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-center"
              title="Previsualizar cómo quedará el PDF"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
              <span className="truncate">Previsualizar</span>
            </button>

            {/* Emerald Green Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-center"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="truncate">Generando...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
                  <span className="truncate">Descargar PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER UTILITY BAR: Clean and minimal */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-3 pb-0 flex items-center justify-end text-xs sm:text-sm no-print">
        <button
          type="button"
          onClick={handleResetReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-700 hover:text-red-800 border border-red-200 shadow-xs font-extrabold text-xs transition-all active:scale-95 cursor-pointer"
          title="Empezar un nuevo reporte desde cero"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Empezar nuevo reporte</span>
        </button>
      </div>

      {/* MAIN DESK CANVAS: The Physical Notebook Sheet */}
      <main className="max-w-6xl w-full mx-auto p-3 sm:p-6 flex-1 flex flex-col items-center gap-5 no-print">
        {/* Navigation Controls Above the Sheet */}
        <NotebookNavigation
          currentPageIndex={safeIndex}
          totalPages={pages.length}
          onPrevPage={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
          onNextPage={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
          onSelectPage={(idx) => setCurrentPageIndex(idx)}
          onAddNewPage={handleAddNewPage}
          onDeleteCurrentPage={handleDeleteCurrentPage}
        />

        {/* The Interactive Sheet */}
        <NotebookPage
          page={currentPage}
          pageNumber={safeIndex + 1}
          totalPages={pages.length}
          isProcessingPhotos={isProcessingPhotos}
          onUpdateField={handleUpdateCurrentField}
          onAddPhotos={handleAddPhotos}
          onRotatePhoto={handleRotatePhoto}
          onRemovePhoto={handleRemovePhoto}
          onOpenDatePicker={() => setIsDatePickerOpen(true)}
          onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        />

        {/* Subtle, unpretentious developer attribution & privacy footer */}
        <footer className="w-full text-center py-6 text-[11px] sm:text-xs text-slate-400 select-none no-print space-y-1.5">
          <div>
            <span>Desarrollado por </span>
            <a
              href="https://edu-ctsz.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              @edu.ctsz
            </a>
            <span> con Google (</span>
            <a
              href="https://g.dev/edu-ctsz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              g.dev/edu-ctsz
            </a>
            <span>)</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400 flex-wrap">
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-slate-600 underline cursor-pointer transition-colors"
            >
              Aviso de Privacidad y Políticas de Servicio
            </button>
            <span>•</span>
            <span className="text-slate-400">
              🔒 Tus fotos se procesan de forma 100% local y segura
            </span>
          </div>
        </footer>
      </main>

      {/* Browser Print Output Container */}
      <PrintContainer pages={pages} />

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        currentDate={currentPage.date}
        detectedPhotoDate={currentPage.photos.find((p) => p.capturedDate)?.capturedDate}
        onSaveDate={(newDate) => handleUpdateCurrentField('date', newDate)}
        onClose={() => setIsDatePickerOpen(false)}
      />

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        currentLocation={currentPage.location}
        savedLocations={savedLocations}
        onSaveLocation={(newLoc) => handleUpdateCurrentField('location', newLoc)}
        onAddSavedLocation={handleAddSavedLocation}
        onDeleteSavedLocation={handleDeleteSavedLocation}
        onClose={() => setIsLocationPickerOpen(false)}
      />

      {/* Report Preview Modal */}
      <ReportPreviewModal
        isOpen={isPreviewOpen}
        pages={pages}
        initialPageIndex={safeIndex}
        isGeneratingPDF={isGeneratingPDF}
        onDownloadPDF={handleDownloadPDF}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Privacy Policy & Terms Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onLoadSample={handleLoadSample}
        onStartBlank={() => {
          const blank = createBlankPage(savedLocations[0]);
          setPages([blank]);
          setCurrentPageIndex(0);
          showToast('✓ Reporte en blanco listo');
        }}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
