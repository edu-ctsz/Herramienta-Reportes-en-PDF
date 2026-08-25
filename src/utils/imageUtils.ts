/**
 * Helper to compress and optimize images before storing in memory or state.
 * Crucial for mobile phones where camera photos can be 10MB+ each.
 * Compresses to max 1600px width/height and 82% JPEG quality (~150-250KB).
 */
export async function optimizeImageFile(file: File, maxDimension: number = 1600, quality: number = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        resolve('');
        return;
      }

      // If it's not a standard image or is an SVG, return directly
      if (file.type === 'image/svg+xml' || !file.type.startsWith('image/')) {
        resolve(result);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Only scale down if it exceeds max dimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(result);
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG dataUrl with high-compression efficiency
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Could not compress image via canvas, using original', err);
          resolve(result);
        }
      };

      img.onerror = () => {
        resolve(result);
      };

      img.src = result;
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
}
