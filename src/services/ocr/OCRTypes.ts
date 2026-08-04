/**
 * ShieldSight AI - OCR Pipeline Data Interfaces & Provider Contract
 */

import { DiscoveredImage } from '../../types';

export interface OCRBoundingBox {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface OCRResult {
  imageId: string;
  extractedText: string;
  confidence: number;
  processingTimeMs: number;
  boundingBoxes: OCRBoundingBox[];
  language?: string;
  timestamp: number;
}

export interface OCRProvider {
  readonly id: string;
  readonly name: string;

  /**
   * Pre-initializes OCR WASM binary engine or model weights.
   */
  initialize(): Promise<void>;

  /**
   * Performs Optical Character Recognition on a discovered image element.
   */
  recognize(image: DiscoveredImage): Promise<OCRResult>;
}
