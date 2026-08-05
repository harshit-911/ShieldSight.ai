/**
 * ShieldSight AI - Text Normalization & Lexicon Interfaces
 * Defines types for language detection, character normalization, and moderation lexicons.
 */

import { ToxicityLabel } from '../../types/text';

export type DetectedLanguage = 'en' | 'hi-Latn' | 'hinglish' | 'unknown';

export type LexiconSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface LexiconEntry {
  id: string;
  canonicalWord: string;
  variants: string[];
  category: ToxicityLabel;
  severity: LexiconSeverity;
  language: DetectedLanguage;
}

export interface LexiconMatch {
  entry: LexiconEntry;
  matchedVariant: string;
  position: number;
}

export interface LanguageDetectionResult {
  language: DetectedLanguage;
  confidence: number;
  scores: Record<DetectedLanguage, number>;
}

export interface NormalizationResult {
  originalText: string;
  normalizedText: string;
  detectedLanguage: DetectedLanguage;
  languageConfidence: number;
  lexiconMatches: LexiconMatch[];
  riskScoreBoost: Record<ToxicityLabel, number>;
}

export interface ILanguageNormalizer {
  readonly languageId: DetectedLanguage;
  readonly name: string;
  normalize(text: string): string;
}
