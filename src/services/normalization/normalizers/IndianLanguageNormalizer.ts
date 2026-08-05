/**
 * ShieldSight AI - Indian Language Normalizer
 * Preprocessing engine for Hinglish, Romanized Hindi, and Leetspeak.
 * Handles character substitutions, leetspeak, letter repetition, spaced-out words,
 * punctuation noise, and emoji substitutions.
 */

import { ILanguageNormalizer, DetectedLanguage } from '../types';

export class IndianLanguageNormalizer implements ILanguageNormalizer {
  readonly languageId: DetectedLanguage = 'hinglish';
  readonly name: string = 'Indian Language & Hinglish Normalizer';

  // Emoji to semantic text mapping
  private emojiMap: Map<string, string> = new Map([
    ['🖕', ' fuck '],
    ['🖕🏻', ' fuck '],
    ['🖕🏼', ' fuck '],
    ['🖕🏽', ' fuck '],
    ['🖕🏾', ' fuck '],
    ['🖕🏿', ' fuck '],
    ['💩', ' shit '],
    ['🍆', ' penis '],
    ['🍑', ' butt '],
    ['🤬', ' swearing '],
    ['🔪', ' knife '],
    ['🗡️', ' knife '],
    ['🗡', ' knife '],
    ['💣', ' bomb '],
    ['💥', ' blast '],
  ]);

  // Common leetspeak & character replacements
  private charSubstitutions: Record<string, string> = {
    '@': 'a',
    '$': 's',
    '0': 'o',
    '1': 'i',
    '3': 'e',
    '4': 'a',
    '5': 's',
    '7': 't',
    '©': 'c',
    'v': 'b', // Common Hinglish/Bengali b/v substitution for abusive words (e.g. bhncod -> bhncod)
  };

  /**
   * Normalizes raw text block into clean normalized text.
   */
  normalize(text: string): string {
    if (!text) return '';

    let result = text;

    // 1. Emoji Substitution
    result = this.replaceEmojis(result);

    // 2. Normalize zero-width spaces, non-breaking spaces, and unicode control characters
    result = result.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, ' ');

    // 3. Spaced-Out Abusive Word Reconstruction (e.g., "c h u t i y a" -> "chutiya", "f u c k" -> "fuck")
    result = this.reconstructSpacedWords(result);

    // 4. Leetspeak & Character Substitutions (e.g., "chut!ya" -> "chutiya", "b!tch" -> "bitch", "fu©k" -> "fuck")
    result = this.normalizeLeetspeak(result);

    // 5. Excessive Repeated Letters Reduction (e.g., "chuuuuuutiyaaaaa" -> "chutiya", "fukkkkk" -> "fuk")
    result = this.reduceRepeatedCharacters(result);

    // 6. Mixed Punctuation Noise Cleanup (e.g., "chutiya!!!" -> "chutiya !")
    result = this.cleanupPunctuation(result);

    // 7. Whitespace Normalization
    result = result.replace(/\s+/g, ' ').trim();

    return result;
  }

  /**
   * Replaces emojis with text equivalents.
   */
  private replaceEmojis(text: string): string {
    let result = text;
    this.emojiMap.forEach((replacement, emoji) => {
      result = result.split(emoji).join(replacement);
    });
    return result;
  }

  /**
   * Reconstructs spaced-out words (e.g., "c h u t i y a" -> "chutiya", "b c h d" -> "bchd").
   */
  private reconstructSpacedWords(text: string): string {
    // Matches sequences of single characters separated by spaces (e.g., "c h u t i y a" or "f u c k")
    return text.replace(/\b([a-z0-9!@#$%^&*])(?:\s+([a-z0-9!@#$%^&*])){2,}\b/gi, (fullMatch) => {
      const joined = fullMatch.replace(/\s+/g, '');
      // If joined word matches common abusive patterns or length >= 3
      if (joined.length >= 3) {
        return joined;
      }
      return fullMatch;
    });
  }

  /**
   * Normalizes leetspeak, wildcards, and character substitutions.
   */
  private normalizeLeetspeak(text: string): string {
    // 1. Replace leetspeak ! inside words (e.g. "b!tch" -> "bitch", "chut!ya" -> "chutiya")
    const processed = text.replace(/([a-z])!([a-z])/gi, '$1i$2');

    let normalized = '';

    for (let i = 0; i < processed.length; i++) {
      const char = processed[i];
      const lower = char.toLowerCase();

      // Asterisk wildcards inside words (e.g. "ch*tiya" -> "chutiya", "f*ck" -> "fuck", "b*tch" -> "bitch")
      if (char === '*') {
        const prev = i > 0 ? processed[i - 1].toLowerCase() : '';
        const next = i < processed.length - 1 ? processed[i + 1].toLowerCase() : '';

        if (prev === 'ch' || (prev === 'h' && i >= 2 && text[i - 2].toLowerCase() === 'c')) {
          normalized += 'u';
        } else if (prev === 'f' && next === 'c') {
          normalized += 'u';
        } else if (prev === 'b' && next === 't') {
          normalized += 'i';
        } else if (prev === 'g' && next === 'n') {
          normalized += 'a';
        } else if (prev === 'r' && next === 'n') {
          normalized += 'a';
        } else if (prev === 'm' && next === 'd') {
          normalized += 'a';
        } else if (prev === 'b' && next === 'h') {
          normalized += 'e';
        } else if (prev === 'l' && next === 'd') {
          normalized += 'au';
        } else {
          normalized += 'u'; // default vowel guess for profanity wildcard
        }
      } else if (this.charSubstitutions[lower]) {
        normalized += this.charSubstitutions[lower];
      } else {
        normalized += char;
      }
    }

    return normalized;
  }

  /**
   * Reduces 3+ consecutive repeated characters down to 1 or 2.
   * e.g., "chuuuuutiyaaa" -> "chutiya", "fukkkkk" -> "fuk".
   */
  private reduceRepeatedCharacters(text: string): string {
    // Squeezes 3 or more repeated letters/characters down to a single character if character repeats 3+ times
    return text.replace(/(.)\1{2,}/gi, '$1');
  }

  /**
   * Cleans up noise punctuation while preserving readability.
   */
  private cleanupPunctuation(text: string): string {
    return text
      .replace(/!{2,}/g, '!')
      .replace(/\?{2,}/g, '?')
      .replace(/\.{3,}/g, '...')
      .replace(/[-_]{2,}/g, ' ');
  }
}

export const indianLanguageNormalizer = new IndianLanguageNormalizer();
