import { describe, it, expect, vi } from 'vitest';
import { OCRProcessor } from '../../src/services/ocr/OCRProcessor';
import { OCRService } from '../../src/services/ocr/OCRService';
import { TextProcessingQueue } from '../../src/services/queue/TextProcessingQueue';
import { DiscoveredImage } from '../../src/types';

function createMockImage(id: string, src: string): DiscoveredImage {
  const img = document.createElement('img');
  img.src = src;

  return {
    id,
    element: img,
    src,
    naturalWidth: 600,
    naturalHeight: 400,
    discoverySource: 'initial_scan',
    timestamp: Date.now(),
  };
}

describe('OCR Pipeline Unit Tests', () => {
  it('should initialize OCRProcessor and recognize text with structured telemetry logs', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const processor = new OCRProcessor();
    const mockImg = createMockImage('ocr-img-1', 'https://example.com/meme-quote.jpg');

    const result = await processor.recognize(mockImg);

    expect(result.imageId).toBe('ocr-img-1');
    expect(result.extractedText).toBe('EXPLICIT WARNING CONTENT EMBEDDED IN IMAGE');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
    expect(result.boundingBoxes.length).toBeGreaterThan(0);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[ShieldSight OCR] Started: ocr-img-1')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[ShieldSight OCR]'),
      expect.any(String),
      expect.any(String),
      result
    );
  });

  it('should bridge extracted image text into TextProcessingQueue via OCRService', async () => {
    const mockQueue = new TextProcessingQueue();
    const enqueueSpy = vi.spyOn(mockQueue, 'enqueue');

    const service = new OCRService(new OCRProcessor(), mockQueue);
    const mockImg = createMockImage('ocr-img-2', 'https://example.com/caption-sample.jpg');

    const result = await service.recognizeImage(mockImg);

    expect(result.extractedText.length).toBeGreaterThan(0);
    expect(enqueueSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'ocr-text-ocr-img-2',
        text: result.extractedText,
      })
    );
  });
});
