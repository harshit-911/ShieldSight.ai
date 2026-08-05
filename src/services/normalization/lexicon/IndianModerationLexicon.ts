/**
 * ShieldSight AI - Indian Moderation Lexicon
 * Configurable moderation lexicon for Romanized Hindi and Hinglish terms.
 * Maps canonical words and variants to toxicity categories and severity levels.
 * Contributes weighted risk score signals without forcing auto-blocking.
 */

import { LexiconEntry, LexiconMatch, LexiconSeverity } from '../types';
import { ToxicityLabel } from '../../../types/text';

export const SEVERITY_WEIGHTS: Record<LexiconSeverity, number> = {
  LOW: 0.10,
  MEDIUM: 0.20,
  HIGH: 0.35,
  CRITICAL: 0.50,
};

export const DEFAULT_INDIAN_LEXICON_ENTRIES: LexiconEntry[] = [
  {
    id: 'hi-chutiya',
    canonicalWord: 'chutiya',
    variants: ['chutiya', 'chutya', 'chuteeya', 'chu7iya', 'chut!ya', 'ch*tiya', 'chootiya', 'chutiye', 'chutiyap', 'chutiyapa'],
    category: 'ABUSIVE',
    severity: 'HIGH',
    language: 'hinglish',
  },
  {
    id: 'hi-madarchod',
    canonicalWord: 'madarchod',
    variants: ['madarchod', 'maadarchod', 'mc', 'mchd', 'm*darchod', 'madarch*d', 'madarchoat', 'maadar'],
    category: 'ABUSIVE',
    severity: 'CRITICAL',
    language: 'hinglish',
  },
  {
    id: 'hi-behenchod',
    canonicalWord: 'behenchod',
    variants: ['behenchod', 'bhenchod', 'bhncod', 'bc', 'bchd', 'behench*d', 'bhench*d', 'behanchod'],
    category: 'ABUSIVE',
    severity: 'CRITICAL',
    language: 'hinglish',
  },
  {
    id: 'hi-bhosdike',
    canonicalWord: 'bhosdike',
    variants: ['bhosdike', 'bhosdi', 'bsdk', 'bhosd1ke', 'bhosdika', 'bhosadike', 'bhosada'],
    category: 'ABUSIVE',
    severity: 'HIGH',
    language: 'hinglish',
  },
  {
    id: 'hi-gaand',
    canonicalWord: 'gaand',
    variants: ['gaand', 'gand', 'g*nd', 'gandu', 'gaandu', 'g&d'],
    category: 'ABUSIVE',
    severity: 'MEDIUM',
    language: 'hinglish',
  },
  {
    id: 'hi-lauda',
    canonicalWord: 'lauda',
    variants: ['lauda', 'loda', 'laund', 'l**d', 'lodu', 'lawda', 'lovda', 'lode'],
    category: 'SEXUAL',
    severity: 'HIGH',
    language: 'hinglish',
  },
  {
    id: 'hi-harami',
    canonicalWord: 'harami',
    variants: ['harami', 'haraami', 'h*rami', 'haramkhor', 'haraamkhor'],
    category: 'ABUSIVE',
    severity: 'MEDIUM',
    language: 'hinglish',
  },
  {
    id: 'hi-kamina',
    canonicalWord: 'kamina',
    variants: ['kamina', 'kameena', 'kamine'],
    category: 'ABUSIVE',
    severity: 'LOW',
    language: 'hinglish',
  },
  {
    id: 'hi-saala',
    canonicalWord: 'saala',
    variants: ['saala', 'sala', 'saale', 'sale'],
    category: 'ABUSIVE',
    severity: 'LOW',
    language: 'hinglish',
  },
  {
    id: 'hi-teri-maa-ki',
    canonicalWord: 'teri maa ki',
    variants: ['teri maa ki', 'tmk', 'tmkc', 'terimaaki', 'terimaaka'],
    category: 'ABUSIVE',
    severity: 'HIGH',
    language: 'hinglish',
  },
  {
    id: 'hi-randi',
    canonicalWord: 'randi',
    variants: ['randi', 'raandi', 'r*ndi', 'randwa', 'r&di'],
    category: 'HARASSMENT',
    severity: 'CRITICAL',
    language: 'hinglish',
  },
  {
    id: 'hi-chakka',
    canonicalWord: 'chakka',
    variants: ['chakka', 'meetha', 'chakk*'],
    category: 'HATE',
    severity: 'CRITICAL',
    language: 'hinglish',
  },
  {
    id: 'hi-marna',
    canonicalWord: 'jaan se maar dunga',
    variants: ['jaan se maar dunga', 'maar dalunga', 'maar dunga', 'khatam kar dunga', 'thok dunga'],
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
   * Scans normalized text for lexicon matches.
   */
  findMatches(normalizedText: string): LexiconMatch[] {
    const matches: LexiconMatch[] = [];
    const textLower = normalizedText.toLowerCase();

    // Word boundary splitting + phrase checking
    this.entries.forEach((entry) => {
      const variants = [entry.canonicalWord.toLowerCase(), ...entry.variants.map((v) => v.toLowerCase())];

      for (const variant of variants) {
        // Escaped regex for multi-word or single-word boundary matching
        const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\b${escaped}\\b`, 'gi');

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
      const weight = SEVERITY_WEIGHTS[m.entry.severity] || 0.1;
      const current = boosts[m.entry.category];
      // Diminishing boost sum to cap maximum boost per category at 0.60
      boosts[m.entry.category] = Math.min(0.60, current + weight * (1 - current));
    });

    return boosts;
  }
}

export const indianModerationLexicon = new IndianModerationLexicon();
