/**
 * ShieldSight AI - TextNormalizationEngine Unit Tests
 * Tests normalization pipeline, plugin registration, lexicon matching, and risk boost calculation.
 */

import { describe, it, expect } from 'vitest';
import { TextNormalizationEngine } from '../../src/services/normalization/TextNormalizationEngine';
import { IndianLanguageNormalizer } from '../../src/services/normalization/normalizers/IndianLanguageNormalizer';

describe('TextNormalizationEngine Unit Tests', () => {
  const engine = new TextNormalizationEngine();

  it('should process Hinglish text and detect lexicon matches', () => {
    const result = engine.process('hey bro tu mera b c h d hai samjha');
    expect(result.originalText).toBe('hey bro tu mera b c h d hai samjha');
    expect(result.normalizedText).toContain('bchd');
    expect(result.detectedLanguage).toBe('hinglish');
    expect(result.lexiconMatches.length).toBeGreaterThan(0);
    expect(result.riskScoreBoost.ABUSIVE).toBeGreaterThan(0);
  });

  it('should allow registering new language normalizers for modular extension', () => {
    const mockNormalizer = {
      languageId: 'ta' as any,
      name: 'Mock Tamil Normalizer',
      normalize: (text: string) => text.toLowerCase().replace(/c/g, 'k'),
    };

    engine.registerNormalizer(mockNormalizer);
    expect(engine.getNormalizer('ta' as any)).toBe(mockNormalizer);
  });

  it('should compute risk score boost without forcing auto-blocking', () => {
    const result = engine.process('chut!ya');
    expect(result.riskScoreBoost.ABUSIVE).toBeGreaterThanOrEqual(0.35);
  });
});
