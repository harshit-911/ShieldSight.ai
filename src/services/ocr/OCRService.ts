/**
 * ShieldSight AI - OCR Service Orchestrator
 * Connects Image OCR extraction to the existing Text Moderation Pipeline.
 * Extracts embedded text from images and enqueues extracted text blocks into TextProcessingQueue.
 */

import { DiscoveredImage } from '../../types';
import { DiscoveredTextBlock } from '../../types/text';
import { OCRProvider, OCRResult } from './OCRTypes';
import { tesseractOCRProvider } from './TesseractOCRProvider';
import { textProcessingQueue, TextProcessingQueue } from '../queue/TextProcessingQueue';

type OCRResultListener = (result: OCRResult) => void;

export class OCRService {
  private provider: OCRProvider;
  private textQueue: TextProcessingQueue;
  private listeners: Set<OCRResultListener> = new Set();

  constructor(
    provider: OCRProvider = tesseractOCRProvider,
    textQueue: TextProcessingQueue = textProcessingQueue
  ) {
    this.provider = provider;
    this.textQueue = textQueue;
  }

  /**
   * Initializes active OCR provider WASM engine.
   */
  async initialize(): Promise<void> {
    await this.provider.initialize();
  }

  /**
   * Processes a discovered image, extracts embedded text, and bridges non-empty text to Text Processing Queue.
   */
  async recognizeImage(image: DiscoveredImage): Promise<OCRResult> {
    const result = await this.provider.recognize(image);

    // If text was extracted from the image, convert to DiscoveredTextBlock & bridge to Text Moderation Queue
    if (result.extractedText && result.extractedText.length >= 5) {
      const textBlock: DiscoveredTextBlock = {
        id: `ocr-text-${image.id}`,
        element: image.element,
        text: result.extractedText,
        timestamp: Date.now(),
      };

      console.log(`[ShieldSight OCR Service] Bridging Extracted Image Text to Text Processing Queue: "${result.extractedText}"`);
      this.textQueue.enqueue(textBlock);
    }

    this.notifyListeners(result);
    return result;
  }

  /**
   * Registers a listener for completed OCR recognition results.
   */
  onResult(listener: OCRResultListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(result: OCRResult): void {
    this.listeners.forEach((listener) => {
      try {
        listener(result);
      } catch (err) {
        console.error('[ShieldSight OCR Service] Listener error:', err);
      }
    });
  }
}

export const ocrService = new OCRService();
