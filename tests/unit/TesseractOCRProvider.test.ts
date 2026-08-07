import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TesseractOCRProvider } from '../../src/services/ocr/TesseractOCRProvider';
import { DiscoveredImage } from '../../src/types';

vi.mock('tesseract.js', () => ({
  createWorker: vi.fn().mockResolvedValue({
    recognize: vi.fn().mockResolvedValue({
      data: {
        text: 'SAMPLE OCR EMBEDDED TEXT',
        confidence: 96,
        words: [
          { text: 'SAMPLE', bbox: { x0: 10, y0: 10, x1: 50, y1: 25 }, confidence: 96 },
          { text: 'OCR', bbox: { x0: 55, y0: 10, x1: 85, y1: 25 }, confidence: 96 },
        ],
      },
    }),
  }),
}));

function createMockImage(id: string, width = 400, height = 300, isHidden = false): DiscoveredImage {
  const container = document.createElement('div');
  const img = document.createElement('img');
  img.src = `https://example.com/${id}.jpg`;
  img.width = width;
  img.height = height;
  Object.defineProperty(img, 'naturalWidth', { value: width });
  Object.defineProperty(img, 'naturalHeight', { value: height });

  if (isHidden) {
    img.setAttribute('hidden', 'true');
    img.style.display = 'none';
  }

  container.appendChild(img);
  document.body.appendChild(container);

  return {
    id,
    element: img,
    src: img.src,
    naturalWidth: width,
    naturalHeight: height,
    discoverySource: 'initial_scan',
    timestamp: Date.now(),
  };
}

describe('TesseractOCRProvider Unit Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should skip OCR if image resolution is below 80x80', async () => {
    const provider = new TesseractOCRProvider();
    const lowResImg = createMockImage('lowres-1', 50, 50);

    const result = await provider.recognize(lowResImg);
    expect(result.extractedText).toBe('');
    expect(result.confidence).toBe(0);
    expect(result.processingTimeMs).toBe(0);
  });

  it('should skip OCR if image is hidden in DOM', async () => {
    const provider = new TesseractOCRProvider();
    const hiddenImg = createMockImage('hidden-2', 400, 300, true);

    const result = await provider.recognize(hiddenImg);
    expect(result.extractedText).toBe('');
    expect(result.confidence).toBe(0);
  });

  it('should skip OCR if image was already processed (duplicate guard)', async () => {
    const provider = new TesseractOCRProvider();
    const validImg = createMockImage('valid-3', 400, 300);

    const firstResult = await provider.recognize(validImg);
    const secondResult = await provider.recognize(validImg);

    expect(firstResult.extractedText).toBe('SAMPLE OCR EMBEDDED TEXT');
    expect(secondResult.extractedText).toBe(''); // Skipped duplicate
  });

  it('should extract text, confidence, words, and log structured telemetry', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const provider = new TesseractOCRProvider();
    const validImg = createMockImage('valid-4', 500, 400);

    const result = await provider.recognize(validImg);

    expect(result.imageId).toBe('valid-4');
    expect(result.extractedText).toBe('SAMPLE OCR EMBEDDED TEXT');
    expect(result.confidence).toBe(0.96);
    expect(result.boundingBoxes.length).toBe(2);

    expect(consoleSpy).toHaveBeenCalledWith(
      '[ShieldSight AI]',
      expect.stringContaining('[ShieldSight OCR] Started: valid-4')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[ShieldSight OCR]'),
      expect.any(String),
      expect.any(String),
      result
    );
  });
});
