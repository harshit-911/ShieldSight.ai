/**
 * ShieldSight AI - Offscreen Document Task Processor
 * Runs Tesseract.js OCR inside a real DOM window context to bypass MV3 Service Worker limitations.
 * Uses a persistent cached Singleton Worker session to eliminate WASM re-initialization overhead.
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

// Run OCR inside the DOM context using persistent worker
async function runOCROffscreen(dataUrl: string): Promise<any> {
  try {
    const worker = await getOCRWorker();
    const recognizeResult = (await worker.recognize(dataUrl)) as any;
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
    console.warn('[ShieldSight Offscreen OCR] Primary recognition failed, resetting worker session...', err);
    // Reset worker session on error
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
    runOCROffscreen(message.payload.dataUrl)
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
