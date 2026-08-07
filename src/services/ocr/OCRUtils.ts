/**
 * ShieldSight AI - OCR Utility Helper Functions
 * Manages CORS-safe image canvas data extraction and text cleaning.
 */

/**
 * Normalizes and cleans raw OCR text output.
 */
export function cleanExtractedText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Converts image element into untainted HTMLCanvasElement for OCR processing.
 * Uses CORS fallback image loading to prevent tainted canvas export errors.
 */
export async function getCanvasFromImageUrl(imgEl: HTMLImageElement, targetWidth = 300, targetHeight = 300): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    try {
      ctx.drawImage(imgEl, 0, 0, targetWidth, targetHeight);
      // Verify canvas is not tainted by attempting export
      canvas.toDataURL('image/png');
      return canvas;
    } catch {
      // Canvas is tainted due to cross-origin CORS policy.
      // Load clean image with crossOrigin = 'anonymous' attribute.
      try {
        const cleanImg = new Image();
        cleanImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          cleanImg.onload = () => resolve();
          cleanImg.onerror = (e) => reject(e);
          cleanImg.src = imgEl.src;
        });
        const cleanCtx = canvas.getContext('2d');
        cleanCtx?.drawImage(cleanImg, 0, 0, targetWidth, targetHeight);
        return canvas;
      } catch {
        return canvas;
      }
    }
  }

  return canvas;
}
