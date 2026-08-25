import exifr from 'exifr';

/**
 * Extracts the capture date from an image file.
 * 1. Looks for EXIF DateTimeOriginal or CreateDate (camera timestamp)
 * 2. Fallback to file.lastModified timestamp if reasonable
 * Returns an ISO date string 'YYYY-MM-DD' or null if no valid date found.
 */
export async function extractDateFromImageFile(file: File): Promise<string | null> {
  try {
    // 1. Try extracting camera EXIF metadata
    const exifData = await exifr.parse(file, [
      'DateTimeOriginal',
      'CreateDate',
      'ModifyDate',
      'DateTime'
    ]);

    if (exifData) {
      const dateObj: Date | undefined =
        exifData.DateTimeOriginal ||
        exifData.CreateDate ||
        exifData.ModifyDate ||
        exifData.DateTime;

      if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
    }
  } catch (error) {
    // Non-fatal: Some images (PNG, WebP, or non-EXIF JPEGs) may fail parsing
    console.warn('Could not extract EXIF date:', error);
  }

  // 2. Fallback: check file.lastModified
  try {
    if (file.lastModified && typeof file.lastModified === 'number') {
      const dateObj = new Date(file.lastModified);
      if (!isNaN(dateObj.getTime()) && dateObj.getFullYear() > 2000) {
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
    }
  } catch (e) {
    console.warn('Fallback lastModified failed:', e);
  }

  return null;
}
