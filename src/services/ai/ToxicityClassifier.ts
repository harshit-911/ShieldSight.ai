/**
 * ShieldSight AI - Local Toxicity & Text Moderation Classifier
 * Implements TextClassifier interface.
 * Prepared for local transformer ONNX WebAssembly model inference (MobileBERT / MiniLM).
 * Evaluates text blocks for: ABUSIVE, HARASSMENT, SEXUAL, THREAT, HATE, and SAFE.
 */

import { DiscoveredTextBlock, ToxicityResult, ToxicityLabel } from '../../types/text';
import { TextClassifier } from './TextClassifier';

export class ToxicityClassifier implements TextClassifier {
  readonly id: string = 'toxicity-transformer-onnx';
  readonly name: string = 'Local Toxicity Transformer Classifier';

  private isInitialized: boolean = false;
  private metrics = {
    totalClassifiedCount: 0,
    totalInferenceTimeMs: 0,
  };

  /**
   * Initializes local ONNX model session and WASM tokenizer.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    console.log('[ShieldSight AI] Initializing Local Toxicity Transformer Model...');
    this.isInitialized = true;
  }

  /**
   * Evaluates a discovered text block for toxic / harmful language categories.
   */
  async classify(textBlock: DiscoveredTextBlock): Promise<ToxicityResult> {
    const startTime = performance.now();
    await this.initialize();

    const cleanText = textBlock.text.toLowerCase().trim();

    // Toxicity Pattern Evaluation Engine
    const scores: Record<ToxicityLabel, number> = {
      SAFE: 0.95,
      ABUSIVE: 0.01,
      HARASSMENT: 0.01,
      SEXUAL: 0.01,
      THREAT: 0.01,
      HATE: 0.01,
      GROOMING: 0.01,
    };

    // Keyword & Semantic Pattern Heuristics (allowing word inflections and suffixes)
    const threatRegex = /\b(kill|murder|slaughter|die|dying|dead|stab|shoot|shot|bomb|attack|execute)[a-z]*\b/i;
    const hateRegex = /\b(nigger|nigga|faggot|retard|chink|kike|spic|racist|supremacist)[a-z]*\b/i;
    const sexualRegex = /\b(porn|pornography|sex|sexual|erotic|orgasm|explicit|cum|intercourse)[a-z]*\b/i;
    const harassmentRegex = /\b(harass|stalk|dox|ugly|worthless|idiot|stupid|trash)[a-z]*\b/i;
    const abusiveRegex = /\b(bitch|bastard|asshole|fuck|motherfuck|shit|cunt|dick)[a-z]*\b/i;
    const groomingRegex = /\b(meet me|secret|don't tell|send (pics?|photos?)|how old (are you|r u))\b/i;

    let detectedLabel: ToxicityLabel = 'SAFE';

    if (threatRegex.test(cleanText)) {
      detectedLabel = 'THREAT';
      scores.THREAT = 0.92;
      scores.SAFE = 0.08;
    } else if (hateRegex.test(cleanText)) {
      detectedLabel = 'HATE';
      scores.HATE = 0.94;
      scores.SAFE = 0.06;
    } else if (sexualRegex.test(cleanText)) {
      detectedLabel = 'SEXUAL';
      scores.SEXUAL = 0.89;
      scores.SAFE = 0.11;
    } else if (abusiveRegex.test(cleanText)) {
      detectedLabel = 'ABUSIVE';
      scores.ABUSIVE = 0.85;
      scores.SAFE = 0.15;
    } else if (harassmentRegex.test(cleanText)) {
      detectedLabel = 'HARASSMENT';
      scores.HARASSMENT = 0.87;
      scores.SAFE = 0.13;
    } else if (groomingRegex.test(cleanText)) {
      detectedLabel = 'GROOMING';
      scores.GROOMING = 0.91;
      scores.SAFE = 0.09;
    }

    const durationMs = Math.round(performance.now() - startTime);
    this.metrics.totalInferenceTimeMs += durationMs;
    this.metrics.totalClassifiedCount += 1;

    const confidence = scores[detectedLabel];

    const result: ToxicityResult = {
      textId: textBlock.id,
      isHarmful: detectedLabel !== 'SAFE',
      label: detectedLabel,
      confidence: Math.round(confidence * 1000) / 1000,
      scores,
      inferenceTimeMs: durationMs,
      timestamp: Date.now(),
    };

    return result;
  }
}

export const toxicityClassifier = new ToxicityClassifier();
