/**
 * ShieldSight AI - OCR Utility Helper Functions
 * Manages image canvas data extraction and text cleaning.
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
 * Converts image element into untainted OffscreenCanvas or HTMLCanvasElement for OCR processing.
 */
export async function getCanvasFromImageUrl(imgEl: HTMLImageElement, targetWidth = 300, targetHeight = 300): Promise<HTMLCanvasElement | OffscreenCanvas> {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      try {
        ctx.drawImage(imgEl, 0, 0, targetWidth, targetHeight);
      } catch (err) {
        console.warn('[ShieldSight OCR] Failed to draw image to OffscreenCanvas:', err);
      }
    }
    return canvas;
  }
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    try {
      ctx.drawImage(imgEl, 0, 0, targetWidth, targetHeight);
    } catch (err) {
      console.warn('[ShieldSight OCR] Failed to draw image to HTMLCanvas:', err);
    }
  }
  return canvas;
}
