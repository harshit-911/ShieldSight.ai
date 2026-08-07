/**
 * ShieldSight AI - OCR Utility Helper Functions
 * Manages CORS-safe image canvas data extraction, contrast enhancement, and text cleaning.
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
 * Converts image element into untainted, contrast-enhanced HTMLCanvasElement for OCR processing.
 * Applies subtle contrast and sharpening filters to boost character recognition accuracy on memes and banners.
 */
export async function getCanvasFromImageUrl(imgEl: HTMLImageElement, targetWidth = 300, targetHeight = 300): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    try {
      // Apply contrast sharpening filter for text recognition on memes/banners
      if ('filter' in ctx) {
        ctx.filter = 'contrast(1.3) brightness(1.05)';
      }
      ctx.drawImage(imgEl, 0, 0, targetWidth, targetHeight);
      // Reset filter
      if ('filter' in ctx) {
        ctx.filter = 'none';
      }
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
        if (cleanCtx) {
          if ('filter' in cleanCtx) {
            cleanCtx.filter = 'contrast(1.3) brightness(1.05)';
          }
          cleanCtx.drawImage(cleanImg, 0, 0, targetWidth, targetHeight);
          if ('filter' in cleanCtx) {
            cleanCtx.filter = 'none';
          }
        }
        return canvas;
      } catch {
        return canvas;
      }
    }
  }

  return canvas;
}
