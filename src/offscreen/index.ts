/**
 * ShieldSight AI - Offscreen Document Task Processor
 * Runs Tesseract.js OCR inside a real DOM window context to bypass MV3 Service Worker limitations.
 * Uses a persistent cached Singleton Worker session and contrast-enhanced canvas drawing.
 */

import { createWorker, Worker } from 'tesseract.js';

console.log('[ShieldSight Offscreen] Offscreen Document initialized');

let cachedWorker: Worker | null = null;
let workerPromise: Promise<Worker> | null = null;

/**
 * Lazily initializes and caches a single persistent Tesseract WASM worker.
 */
async function getOCRWorker(): Promise<Worker> {
  if (cachedWorker) {
    return cachedWorker;
  }

  if (!workerPromise) {
    workerPromise = (async () => {
      const langPath = chrome.runtime.getURL('tessdata');
      const workerPath = chrome.runtime.getURL('lib/tesseract/worker.min.js');
      const corePath = chrome.runtime.getURL('lib/tesseract/tesseract-core.wasm.js');

      console.log(`[ShieldSight Offscreen OCR] Initializing Persistent Tesseract WASM Worker: langPath=${langPath}`);

      const worker = await createWorker('eng', 1, {
        langPath,
        workerPath,
        corePath,
        cacheMethod: 'none',
      });

      cachedWorker = worker;
      console.log('[ShieldSight Offscreen OCR] Persistent Tesseract WASM Worker Initialized Successfully');
      return worker;
    })();
  }

  return workerPromise;
}

/**
 * Renders an image URL onto an untainted, contrast-enhanced canvas for Tesseract recognition.
 */
async function prepareCanvasFromSrc(imageSrc: string, targetWidth = 300, targetHeight = 300): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) return canvas;

  if (imageSrc.startsWith('data:')) {
    const img = new Image();
    img.src = imageSrc;
    await new Promise<void>((r) => { img.onload = () => r(); img.onerror = () => r(); });
    if ('filter' in ctx) ctx.filter = 'contrast(1.3) brightness(1.05)';
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    return canvas;
  }

  try {
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    if ('filter' in ctx) ctx.filter = 'contrast(1.3) brightness(1.05)';
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    if (typeof bitmap.close === 'function') bitmap.close();
    return canvas;
  } catch {
    try {
      const cleanImg = new Image();
      cleanImg.crossOrigin = 'anonymous';
      await new Promise<void>((r) => {
        cleanImg.onload = () => r();
        cleanImg.onerror = () => r();
        cleanImg.src = imageSrc;
      });
      if ('filter' in ctx) ctx.filter = 'contrast(1.3) brightness(1.05)';
      ctx.drawImage(cleanImg, 0, 0, targetWidth, targetHeight);
      return canvas;
    } catch {
      return canvas;
    }
  }
}

// Run OCR inside the DOM context using persistent worker
async function runOCROffscreen(imageSrc: string): Promise<any> {
  try {
    const worker = await getOCRWorker();
    const canvas = await prepareCanvasFromSrc(imageSrc);
    const recognizeResult = (await worker.recognize(canvas)) as any;
    const data = recognizeResult.data;

    return {
      text: data.text || '',
      confidence: data.confidence || 0,
      words: data.words
        ? data.words.map((w: any) => ({
            text: w.text,
            confidence: w.confidence,
            bbox: w.bbox,
          }))
        : [],
    };
  } catch (err) {
    console.warn('[ShieldSight Offscreen OCR] Recognition attempt failed, resetting worker session...', err);
    if (cachedWorker) {
      try {
        await cachedWorker.terminate();
      } catch {}
      cachedWorker = null;
      workerPromise = null;
    }
    throw err;
  }
}

// Listen for OCR messages from background script
chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: (res: any) => void) => {
  if (message.type === 'RUN_OCR_OFFSCREEN') {
    const src = message.payload.imageSrc || message.payload.dataUrl || '';
    runOCROffscreen(src)
      .then((res) => {
        sendResponse(res);
      })
      .catch((err) => {
        console.error('[ShieldSight Offscreen OCR] Error:', err);
        sendResponse({ error: err.message || String(err) });
      });
    return true; // Keep channel open for async response
  }
});
