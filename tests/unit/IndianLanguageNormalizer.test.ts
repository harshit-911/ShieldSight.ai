/**
 * ShieldSight AI - IndianLanguageNormalizer Unit Tests
 * Tests normalization of Hinglish, Romanized Hindi, Leetspeak, character substitutions,
 * letter repetitions, spaced-out words, and emojis.
 */

import { describe, it, expect } from 'vitest';
import { IndianLanguageNormalizer } from '../../src/services/normalization/normalizers/IndianLanguageNormalizer';

describe('IndianLanguageNormalizer Unit Tests', () => {
  const normalizer = new IndianLanguageNormalizer();

  it('should normalize leetspeak character substitutions', () => {
    expect(normalizer.normalize('chut!ya')).toBe('chutiya');
    expect(normalizer.normalize('b!tch')).toBe('bitch');
    expect(normalizer.normalize('fu©k')).toBe('fuck');
    expect(normalizer.normalize('m4d4rchod')).toBe('madarchod');
    expect(normalizer.normalize('bh0sdike')).toBe('bhosdike');
  });

  it('should reduce excessive repeated letters', () => {
    expect(normalizer.normalize('chuuuuuutiyaaaaa')).toBe('chutiya');
    expect(normalizer.normalize('fukkkkk')).toBe('fuk');
    expect(normalizer.normalize('behenchoddddd')).toBe('behenchod');
  });

  it('should reconstruct spaced-out words', () => {
    expect(normalizer.normalize('c h u t i y a')).toBe('chutiya');
    expect(normalizer.normalize('b c h d')).toBe('bchd');
    expect(normalizer.normalize('f u c k')).toBe('fuck');
  });

  it('should substitute emojis with text equivalents', () => {
    expect(normalizer.normalize('you are 🖕')).toContain('fuck');
    expect(normalizer.normalize('eating 💩')).toContain('shit');
    expect(normalizer.normalize('show 🍆')).toContain('penis');
  });

  it('should cleanup mixed punctuation noise', () => {
    expect(normalizer.normalize('chutiya!!!')).toBe('chutiya!');
    expect(normalizer.normalize('what???')).toBe('what?');
  });

  it('should handle complex combined obfuscated inputs', () => {
    const input = 'c h u t ! y a a a a !!! 🖕';
    const normalized = normalizer.normalize(input);
    expect(normalized).toContain('chutiya');
    expect(normalized).toContain('fuck');
  });
});
