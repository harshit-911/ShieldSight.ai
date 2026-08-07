/**
 * ShieldSight AI - Indian Moderation Lexicon
 * Configurable moderation lexicon for Romanized Hindi, Hinglish, and Devanagari Hindi terms.
 * Maps canonical words and variants to toxicity categories and severity levels.
 * Contributes direct risk score signals for real-time text redaction.
 */

import { LexiconEntry, LexiconMatch, LexiconSeverity } from '../types';
import { ToxicityLabel } from '../../../types/text';

export const SEVERITY_WEIGHTS: Record<LexiconSeverity, number> = {
  LOW: 0.70,
  MEDIUM: 0.80,
  HIGH: 0.90,
  CRITICAL: 0.95,
};

export const DEFAULT_INDIAN_LEXICON_ENTRIES: LexiconEntry[] = [
  {
    id: 'hi-chutiya',
    canonicalWord: 'chutiya',
    variants: ['chutiya', 'chutya', 'chuteeya', 'chu7iya', 'chut!ya', 'ch*tiya', 'chootiya', 'chutiye', 'chutiyap', 'chutiyapa', 'चूतिया', 'चूतिये', 'चूतियापा'],
    category: 'ABUSIVE',
    severity: 'HIGH',
    language: 'hinglish',
  },
  {
    id: 'hi-madarchod',
    canonicalWord: 'madarchod',
    variants: ['madarchod', 'maadarchod', 'mc', 'mchd', 'm*darchod', 'madarch*d', 'madarchoat', 'maadar', 'मादरचोद', 'मादरचोध', 'एमसी'],
    category: 'ABUSIVE',
    severity: 'CRITICAL',
    language: 'hinglish',
  },
  {
    id: 'hi-behenchod',
    canonicalWord: 'behenchod',
    variants: ['behenchod', 'bhenchod', 'bhncod', 'bc', 'bchd', 'behench*d', 'bhench*d', 'behanchod', 'बहनचोद', 'बहनचोध', 'बीसी'],
    category: 'ABUSIVE',
    severity: 'CRITICAL',
    language: 'hinglish',
  },
  {
    id: 'hi-bhosdike',
    canonicalWord: 'bhosdike',
    variants: ['bhosdike', 'bhosdi', 'bsdk', 'bhosd1ke', 'bhosdika', 'bhosadike', 'bhosada', 'भोसड़ीके', 'भोसडीके', 'भोसडी'],
    category: 'ABUSIVE',
    severity: 'HIGH',
    language: 'hinglish',
  },
  {
    id: 'hi-gaand',
    canonicalWord: 'gaand',
    variants: ['gaand', 'gand', 'g*nd', 'gandu', 'gaandu', 'g&d', 'गांड', 'गांडू'],
    category: 'ABUSIVE',
    severity: 'MEDIUM',
    language: 'hinglish',
  },
  {
    id: 'hi-lauda',
    canonicalWord: 'lauda',
    variants: ['lauda', 'loda', 'laund', 'l**d', 'lodu', 'lawda', 'lovda', 'lode', 'लौड़ा', 'लौडा', 'लोडा'],
    category: 'SEXUAL',
    severity: 'HIGH',
    language: 'hinglish',
  },
  {
    id: 'hi-harami',
    canonicalWord: 'harami',
    variants: ['harami', 'haraami', 'h*rami', 'haramkhor', 'haraamkhor', 'हरामी', 'हरामखोर'],
    category: 'ABUSIVE',
    severity: 'MEDIUM',
    language: 'hinglish',
  },
  {
    id: 'hi-kamina',
    canonicalWord: 'kamina',
    variants: ['kamina', 'kameena', 'kamine', 'कमीना', 'कमीने'],
    category: 'ABUSIVE',
    severity: 'LOW',
    language: 'hinglish',
  },
  {
    id: 'hi-saala',
    canonicalWord: 'saala',
    variants: ['saala', 'sala', 'saale', 'sale', 'साला', 'साले'],
    category: 'ABUSIVE',
    severity: 'LOW',
    language: 'hinglish',
  },
  {
    id: 'hi-kutta',
    canonicalWord: 'kutta',
    variants: ['kutta', 'kutte', 'kutteh', 'kuttiya', 'कुत्ता', 'कुत्ते', 'कुतिया'],
    category: 'ABUSIVE',
    severity: 'LOW',
    language: 'hinglish',
  },
  {
    id: 'hi-gadha',
    canonicalWord: 'gadha',
    variants: ['gadha', 'gadhe', 'गधा', 'गधे'],
    category: 'ABUSIVE',
    severity: 'LOW',
    language: 'hinglish',
  },
  {
    id: 'hi-teri-maa-ki',
    canonicalWord: 'teri maa ki',
    variants: ['teri maa ki', 'tmk', 'tmkc', 'terimaaki', 'terimaaka', 'तेरी माँ की', 'तेरी मां की'],
    category: 'ABUSIVE',
    severity: 'HIGH',
    language: 'hinglish',
  },
  {
    id: 'hi-randi',
    canonicalWord: 'randi',
    variants: ['randi', 'raandi', 'r*ndi', 'randwa', 'r&di', 'रंडी', 'रांडी'],
    category: 'HARASSMENT',
    severity: 'CRITICAL',
    language: 'hinglish',
  },
  {
    id: 'hi-chakka',
    canonicalWord: 'chakka',
    variants: ['chakka', 'meetha', 'chakk*', 'छक्का', 'मीठा'],
    category: 'HATE',
    severity: 'CRITICAL',
    language: 'hinglish',
  },
  {
    id: 'hi-marna',
    canonicalWord: 'jaan se maar dunga',
    variants: ['jaan se maar dunga', 'maar dalunga', 'maar dunga', 'khatam kar dunga', 'thok dunga', 'जान से मार दूंगा', 'मार डालूंगा'],
    category: 'THREAT',
    severity: 'CRITICAL',
    language: 'hinglish',
  },
];

export class IndianModerationLexicon {
  private entries: Map<string, LexiconEntry> = new Map();
  private variantMap: Map<string, LexiconEntry> = new Map();

  constructor(initialEntries: LexiconEntry[] = DEFAULT_INDIAN_LEXICON_ENTRIES) {
    initialEntries.forEach((entry) => this.addEntry(entry));
  }

  /**
   * Adds or updates a lexicon entry.
   */
  addEntry(entry: LexiconEntry): void {
    this.entries.set(entry.id, entry);

    // Index canonical word and variants
    const allVariants = new Set([entry.canonicalWord.toLowerCase(), ...entry.variants.map((v) => v.toLowerCase())]);
    allVariants.forEach((variant) => {
      this.variantMap.set(variant, entry);
    });
  }

  /**
   * Removes an entry by ID.
   */
  removeEntry(id: string): boolean {
    const entry = this.entries.get(id);
    if (!entry) return false;

    const allVariants = [entry.canonicalWord.toLowerCase(), ...entry.variants.map((v) => v.toLowerCase())];
    allVariants.forEach((v) => this.variantMap.delete(v));
    this.entries.delete(id);
    return true;
  }

  /**
   * Returns all active entries.
   */
  getEntries(): LexiconEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Scans normalized text for lexicon matches (supports Romanized Hinglish & Devanagari script).
   */
  findMatches(normalizedText: string): LexiconMatch[] {
    const matches: LexiconMatch[] = [];
    const textLower = normalizedText.toLowerCase();

    this.entries.forEach((entry) => {
      const variants = [entry.canonicalWord.toLowerCase(), ...entry.variants.map((v) => v.toLowerCase())];

      for (const variant of variants) {
        // Handle regex matching for both English/Hinglish (alphanumeric) and Devanagari script
        const isDevanagari = /[\u0900-\u097F]/.test(variant);
        const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        let pattern: RegExp;
        if (isDevanagari) {
          pattern = new RegExp(`${escaped}`, 'gi');
        } else {
          const isMultiWord = variant.includes(' ');
          pattern = isMultiWord
            ? new RegExp(`\\b${escaped}\\b`, 'gi')
            : new RegExp(`\\b${escaped}[a-z]*\\b`, 'gi');
        }

        let match: RegExpExecArray | null;
        while ((match = pattern.exec(textLower)) !== null) {
          matches.push({
            entry,
            matchedVariant: variant,
            position: match.index,
          });
        }
      }
    });

    return matches;
  }

  /**
   * Computes risk score boosts per category based on lexicon matches.
   */
  calculateRiskBoosts(matches: LexiconMatch[]): Record<ToxicityLabel, number> {
    const boosts: Record<ToxicityLabel, number> = {
      SAFE: 0,
      ABUSIVE: 0,
      HARASSMENT: 0,
      SEXUAL: 0,
      THREAT: 0,
      HATE: 0,
      GROOMING: 0,
    };

    matches.forEach((m) => {
      const weight = SEVERITY_WEIGHTS[m.entry.severity] || 0.70;
      const current = boosts[m.entry.category];
      boosts[m.entry.category] = Math.max(current, weight);
    });

    return boosts;
  }
}

export const indianModerationLexicon = new IndianModerationLexicon();
