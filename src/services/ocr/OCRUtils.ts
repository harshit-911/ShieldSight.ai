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
 * Converts image URL into untainted OffscreenCanvas or HTMLCanvasElement for OCR processing.
 */
export async function getCanvasFromImageUrl(_src: string, targetWidth = 300, targetHeight = 300): Promise<HTMLCanvasElement | OffscreenCanvas> {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    return canvas;
  }
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  return canvas;
}
