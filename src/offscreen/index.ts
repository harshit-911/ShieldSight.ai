/**
 * ShieldSight AI - Offscreen Document Task Processor
 * Runs Tesseract.js OCR inside a real DOM window context to bypass MV3 Service Worker limitations.
 */

import { createWorker } from 'tesseract.js';

console.log('[ShieldSight Offscreen] Offscreen Document initialized');

// Run OCR inside the DOM context
async function runOCROffscreen(dataUrl: string): Promise<any> {
  const langPath = chrome.runtime.getURL('tessdata');
  const workerPath = chrome.runtime.getURL('lib/tesseract/worker.min.js');
  const corePath = chrome.runtime.getURL('lib/tesseract/tesseract-core.wasm.js');

  console.log(`[ShieldSight Offscreen OCR] Running OCR with local assets: langPath=${langPath}, workerPath=${workerPath}, corePath=${corePath}`);

  const worker = await createWorker('eng', 1, {
    langPath,
    workerPath,
    corePath,
    cacheMethod: 'none',
  });

  try {
    const recognizeResult = await worker.recognize(dataUrl) as any;
    const data = recognizeResult.data;
    await worker.terminate();

    return {
      text: data.text,
      confidence: data.confidence,
      words: data.words ? data.words.map((w: any) => ({
        text: w.text,
        confidence: w.confidence,
        bbox: w.bbox,
      })) : [],
    };
  } catch (err) {
    await worker.terminate();
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
