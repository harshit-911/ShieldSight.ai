/**
 * ShieldSight AI - Text Normalization Engine
 * Main orchestrator for text preprocessing before toxicity classification.
 * Runs language detection, language-specific normalizers, and moderation lexicons.
 * Pluggable architecture allowing future language normalizers to be registered.
 */

import { ILanguageNormalizer, NormalizationResult, DetectedLanguage } from './types';
import { IndianLanguageNormalizer } from './normalizers/IndianLanguageNormalizer';
import { IndianModerationLexicon, indianModerationLexicon } from './lexicon/IndianModerationLexicon';
import { LanguageDetector, languageDetector } from './detectors/LanguageDetector';

export class TextNormalizationEngine {
  private normalizers: Map<DetectedLanguage | string, ILanguageNormalizer> = new Map();
  private defaultNormalizer: ILanguageNormalizer;
  private lexicon: IndianModerationLexicon;
  private detector: LanguageDetector;

  constructor(
    defaultNormalizer: ILanguageNormalizer = new IndianLanguageNormalizer(),
    lexicon: IndianModerationLexicon = indianModerationLexicon,
    detector: LanguageDetector = languageDetector
  ) {
    this.defaultNormalizer = defaultNormalizer;
    this.lexicon = lexicon;
    this.detector = detector;

    // Register default normalizer
    this.registerNormalizer(defaultNormalizer);
  }

  /**
   * Registers a new language normalizer plugin (e.g. Tamil, Telugu, Marathi).
   */
  registerNormalizer(normalizer: ILanguageNormalizer): void {
    this.normalizers.set(normalizer.languageId, normalizer);
  }

  /**
   * Returns registered normalizer for a given language ID or default normalizer.
   */
  getNormalizer(language: DetectedLanguage): ILanguageNormalizer {
    return this.normalizers.get(language) || this.defaultNormalizer;
  }

  /**
   * Returns the moderation lexicon instance for configuration.
   */
  getLexicon(): IndianModerationLexicon {
    return this.lexicon;
  }

  /**
   * Preprocesses raw text, detects language, normalizes text, scans lexicon, and computes risk boosts.
   */
  process(originalText: string): NormalizationResult {
    if (!originalText || !originalText.trim()) {
      return {
        originalText: originalText || '',
        normalizedText: '',
        detectedLanguage: 'unknown',
        languageConfidence: 0,
        lexiconMatches: [],
        riskScoreBoost: {
          SAFE: 0,
          ABUSIVE: 0,
          HARASSMENT: 0,
          SEXUAL: 0,
          THREAT: 0,
          HATE: 0,
          GROOMING: 0,
        },
      };
    }

    // 1. Detect language
    const detectionResult = this.detector.detect(originalText);

    // 2. Select normalizer plugin based on detected language
    const normalizer = this.getNormalizer(detectionResult.language);

    // 3. Normalize text
    const normalizedText = normalizer.normalize(originalText);

    // 4. Scan moderation lexicon on normalized text
    const lexiconMatches = this.lexicon.findMatches(normalizedText);

    // 5. Calculate category risk score boosts
    const riskScoreBoost = this.lexicon.calculateRiskBoosts(lexiconMatches);

    return {
      originalText,
      normalizedText,
      detectedLanguage: detectionResult.language,
      languageConfidence: detectionResult.confidence,
      lexiconMatches,
      riskScoreBoost,
    };
  }
}

export const textNormalizationEngine = new TextNormalizationEngine();
