import { jsPDF } from 'jspdf';
import { EvidencePage } from '../types';
import { formatDateToSpanish } from './dateUtils';

// Helper to convert an image/dataUrl to a rotated canvas / base64 jpeg if rotation is applied
async function processImageForPDF(dataUrl: string, rotation = 0): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const origW = img.naturalWidth || img.width || 600;
      const origH = img.naturalHeight || img.height || 450;
      
      const rad = (rotation % 360) * (Math.PI / 180);
      const isOrthogonal = (rotation % 180) !== 0;
      const canvasW = isOrthogonal ? origH : origW;
      const canvasH = isOrthogonal ? origW : origH;
      
      const canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve({ dataUrl, width: origW, height: origH });
        return;
      }
      
      // Draw background white just in case
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasW, canvasH);
      
      ctx.translate(canvasW / 2, canvasH / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -origW / 2, -origH / 2);
      
      const resultDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      resolve({ dataUrl: resultDataUrl, width: canvasW, height: canvasH });
    };
    img.onerror = () => {
      resolve({ dataUrl, width: 600, height: 450 });
    };
    img.src = dataUrl;
  });
}

export async function generateReportPDF(
  pages: EvidencePage[],
  reportTitle = 'Reporte Mensual de Evidencias'
): Promise<Blob> {
  // Standard Letter page dimensions in millimeters
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~215.9 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~279.4 mm
  const marginX = 24;
  const rightMarginX = pageWidth - marginX; // ~191.9 mm
  const maxWidth = pageWidth - marginX * 2; // ~167.9 mm

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) {
      doc.addPage('letter', 'portrait');
    }

    const page = pages[i];
    const pageNum = i + 1;

    // 1. Header Right: Date & Location
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFontSize(10.5);

    // Date
    const formattedDate = page.date ? formatDateToSpanish(page.date) : '';
    let currentY = 24;
    if (formattedDate && formattedDate.trim().length > 0) {
      doc.text(formattedDate, rightMarginX, currentY, { align: 'right' });
      currentY += 6;
    }

    // Location (multi-line if long)
    if (page.location && page.location.trim().length > 0) {
      const locationLines = doc.splitTextToSize(page.location.trim(), 130);
      doc.text(locationLines, rightMarginX, currentY, { align: 'right' });
      currentY += locationLines.length * 5;
    }

    // 2. Left side: Activity Title and optional notes
    let contentStartY = Math.max(currentY + 6, 44);

    if (page.title && page.title.trim().length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.setFontSize(11.5);
      const titleLines = doc.splitTextToSize(page.title.trim(), maxWidth);
      doc.text(titleLines, marginX, contentStartY);
      contentStartY += titleLines.length * 5.5 + 2;
    }

    if (page.notes && page.notes.trim().length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85); // Slate-700
      doc.setFontSize(10);
      const noteLines = doc.splitTextToSize(page.notes.trim(), maxWidth);
      doc.text(noteLines, marginX, contentStartY);
      contentStartY += noteLines.length * 4.8 + 3;
    }

    // 3. Photos Placement
    const photos = page.photos || [];
    const photoAreaTop = Math.max(contentStartY + 2, 54);
    const photoAreaBottom = pageHeight - 25; // leave room for page number at 265mm
    const availableHeight = photoAreaBottom - photoAreaTop;

    if (photos.length === 1) {
      // 1 Large Photo
      const p = photos[0];
      try {
        const processed = await processImageForPDF(p.dataUrl, p.rotation || 0);
        const imgAspect = processed.width / processed.height;
        
        let targetW = Math.min(maxWidth, 140);
        let targetH = targetW / imgAspect;
        
        if (targetH > availableHeight) {
          targetH = availableHeight;
          targetW = targetH * imgAspect;
        }

        const posX = marginX; // align with text or center
        const posY = photoAreaTop + (availableHeight - targetH) / 6;

        doc.addImage(processed.dataUrl, 'JPEG', posX, posY, targetW, targetH, undefined, 'FAST');
      } catch (err) {
        console.error('Error adding photo 1:', err);
      }
    } else if (photos.length === 2) {
      // 2 Stacked Photos (Standard layout as in sample PDF pages 1, 2, 4, 5, 7, 8, 9)
      const slotHeight = (availableHeight - 6) / 2;
      const targetMaxW = Math.min(maxWidth, 130);

      for (let pIdx = 0; pIdx < 2; pIdx++) {
        const p = photos[pIdx];
        try {
          const processed = await processImageForPDF(p.dataUrl, p.rotation || 0);
          const imgAspect = processed.width / processed.height;

          let targetW = targetMaxW;
          let targetH = targetW / imgAspect;

          if (targetH > slotHeight) {
            targetH = slotHeight;
            targetW = targetH * imgAspect;
          }

          const slotTop = photoAreaTop + pIdx * (slotHeight + 6);
          const posX = marginX;
          const posY = slotTop;

          doc.addImage(processed.dataUrl, 'JPEG', posX, posY, targetW, targetH, undefined, 'FAST');
        } catch (err) {
          console.error(`Error adding photo ${pIdx + 1}:`, err);
        }
      }
    } else if (photos.length >= 3) {
      // 3 Photos: 1 tall on left or 1 large top + 2 small bottom
      if (page.layout === 'featured-left' || photos.length === 3) {
        // Page 6 layout: Left tall image + Right 2 stacked images
        const leftWidth = (maxWidth - 6) * 0.48;
        const rightWidth = (maxWidth - 6) * 0.48;
        const rightSlotHeight = (availableHeight - 6) / 2;

        // Photo 1 (Left tall)
        try {
          const processed1 = await processImageForPDF(photos[0].dataUrl, photos[0].rotation || 0);
          const aspect1 = processed1.width / processed1.height;
          let w1 = leftWidth;
          let h1 = w1 / aspect1;
          if (h1 > availableHeight) {
            h1 = availableHeight;
            w1 = h1 * aspect1;
          }
          doc.addImage(processed1.dataUrl, 'JPEG', marginX, photoAreaTop, w1, h1, undefined, 'FAST');
        } catch (err) {
          console.error('Error photo 1 layout 3', err);
        }

        // Photo 2 (Right top)
        if (photos[1]) {
          try {
            const processed2 = await processImageForPDF(photos[1].dataUrl, photos[1].rotation || 0);
            const aspect2 = processed2.width / processed2.height;
            let w2 = rightWidth;
            let h2 = w2 / aspect2;
            if (h2 > rightSlotHeight) {
              h2 = rightSlotHeight;
              w2 = h2 * aspect2;
            }
            doc.addImage(processed2.dataUrl, 'JPEG', marginX + leftWidth + 6, photoAreaTop, w2, h2, undefined, 'FAST');
          } catch (err) {
            console.error('Error photo 2 layout 3', err);
          }
        }

        // Photo 3 (Right bottom)
        if (photos[2]) {
          try {
            const processed3 = await processImageForPDF(photos[2].dataUrl, photos[2].rotation || 0);
            const aspect3 = processed3.width / processed3.height;
            let w3 = rightWidth;
            let h3 = w3 / aspect3;
            if (h3 > rightSlotHeight) {
              h3 = rightSlotHeight;
              w3 = h3 * aspect3;
            }
            doc.addImage(processed3.dataUrl, 'JPEG', marginX + leftWidth + 6, photoAreaTop + rightSlotHeight + 6, w3, h3, undefined, 'FAST');
          } catch (err) {
            console.error('Error photo 3 layout 3', err);
          }
        }
      }
    }

    // 4. Page Number at Bottom Right
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text(String(pageNum), rightMarginX, pageHeight - 16, { align: 'right' });
  }

  return doc.output('blob');
}

export function downloadBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
