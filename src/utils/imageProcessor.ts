export interface ImageFilterOptions {
  rotation: number; // 0, 90, 180, 270
  grayscale: boolean;
  highContrast: boolean;
  invert: boolean;
}

export const DEFAULT_FILTERS: ImageFilterOptions = {
  rotation: 0,
  grayscale: false,
  highContrast: false,
  invert: false,
};

/**
 * Applies filters (rotation, grayscale, high-contrast, invert) on an image using Canvas
 * and returns a new processed File object ready for Tesseract OCR.
 */
export async function applyImageFilters(
  originalFile: File,
  filters: ImageFilterOptions
): Promise<{ file: File; previewUrl: string }> {
  // If no filters are active, return original
  if (
    filters.rotation === 0 &&
    !filters.grayscale &&
    !filters.highContrast &&
    !filters.invert
  ) {
    const previewUrl = URL.createObjectURL(originalFile);
    return { file: originalFile, previewUrl };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(originalFile);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context oluşturulamadı');
        }

        const isRotated90or270 = filters.rotation === 90 || filters.rotation === 270;
        const width = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
        const height = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

        canvas.width = width;
        canvas.height = height;

        // Apply transformations
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((filters.rotation * Math.PI) / 180);

        // Build CSS filter string for canvas
        const filterTokens: string[] = [];
        if (filters.grayscale) filterTokens.push('grayscale(100%)');
        if (filters.highContrast) filterTokens.push('contrast(160%) brightness(105%)');
        if (filters.invert) filterTokens.push('invert(100%)');

        if (filterTokens.length > 0) {
          ctx.filter = filterTokens.join(' ');
        }

        ctx.drawImage(
          img,
          -img.naturalWidth / 2,
          -img.naturalHeight / 2,
          img.naturalWidth,
          img.naturalHeight
        );

        ctx.restore();

        // Convert to Blob
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error('Filtrelenmiş görsel oluşturulamadı'));
            return;
          }
          const cleanName = originalFile.name.replace(/\.[^/.]+$/, '');
          const newFile = new File([blob], `${cleanName}-filtered.png`, {
            type: 'image/png',
          });
          const previewUrl = URL.createObjectURL(newFile);
          resolve({ file: newFile, previewUrl });
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}
