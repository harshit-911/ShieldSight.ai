/**
 * ShieldSight AI - LanguageDetector Unit Tests
 * Tests detection of English (en), Romanized Hindi (hi-Latn), Hinglish (hinglish), and unknown.
 */

import { describe, it, expect } from 'vitest';
import { LanguageDetector } from '../../src/services/normalization/detectors/LanguageDetector';

describe('LanguageDetector Unit Tests', () => {
  const detector = new LanguageDetector();

  it('should detect pure English text', () => {
    const result = detector.detect('This is a clean and polite English message.');
    expect(result.language).toBe('en');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should detect Romanized Hindi text', () => {
    const result = detector.detect('kya kar raha hai bhai tu tera bata');
    expect(result.language).toBe('hi-Latn');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should detect Hinglish text', () => {
    const result = detector.detect('hey bro kya kar raha hai you know that');
    expect(result.language).toBe('hinglish');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should handle empty or unknown text', () => {
    const result = detector.detect('1234 5678');
    expect(result.language).toBe('unknown');
  });
});
