/**
 * ShieldSight AI - Language Detector
 * Heuristic detector for English (en), Romanized Hindi (hi-Latn), Hinglish (hinglish), or unknown.
 */

import { DetectedLanguage, LanguageDetectionResult } from '../types';

const COMMON_HINDI_LATN_WORDS = new Set([
  'hai', 'hain', 'hu', 'hoon', 'kya', 'kaise', 'kaisa', 'kisi', 'kaha', 'kahan', 'kyu', 'kyun',
  'ho', 'bhai', 'bhaiya', 'kar', 'karo', 'karna', 'raha', 'rahi', 'rahe', 'sab', 'na', 'bhi',
  'tera', 'teri', 'tere', 'mera', 'meri', 'mere', 'apna', 'apni', 'apne', 'baat', 'kuch', 'bata',
  'dekh', 'dekho', 'jao', 'aao', 'chal', 'chalo', 'sala', 'saala', 'chutiya', 'madarchod', 'behenchod',
  'bhosdike', 'gand', 'lauda', 'harami', 'kamina', 'randi', 'bc', 'mc', 'bsdk', 'tmk',
]);

const COMMON_ENGLISH_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
  'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up',
  'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time',
  'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think',
  'hey', 'bro', 'dude', 'hello', 'hi', 'man', 'guys', 'okay', 'ok', 'thanks', 'please', 'sorry',
]);

export class LanguageDetector {
  detect(text: string): LanguageDetectionResult {
    const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    if (!clean) {
      return {
        language: 'unknown',
        confidence: 0,
        scores: { en: 0, 'hi-Latn': 0, hinglish: 0, unknown: 1 },
      };
    }

    const words = clean.split(/\s+/).filter((w) => w.length > 0);
    if (words.length === 0) {
      return {
        language: 'unknown',
        confidence: 0,
        scores: { en: 0, 'hi-Latn': 0, hinglish: 0, unknown: 1 },
      };
    }

    let englishCount = 0;
    let hindiLatnCount = 0;

    words.forEach((word) => {
      if (COMMON_ENGLISH_WORDS.has(word)) englishCount++;
      if (COMMON_HINDI_LATN_WORDS.has(word)) hindiLatnCount++;
    });

    const totalWords = words.length;

    let detectedLanguage: DetectedLanguage = 'unknown';
    let confidence = 0.5;

    const enScore = englishCount / totalWords;
    const hiLatnScore = hindiLatnCount / totalWords;

    if (englishCount > 0 && hindiLatnCount > 0) {
      detectedLanguage = 'hinglish';
      confidence = Math.min(0.95, (englishCount + hindiLatnCount) / totalWords + 0.2);
    } else if (hindiLatnCount > 0 && englishCount === 0) {
      detectedLanguage = 'hi-Latn';
      confidence = Math.min(0.95, hiLatnScore + 0.3);
    } else if (englishCount > 0 && hindiLatnCount === 0) {
      detectedLanguage = 'en';
      confidence = Math.min(0.95, enScore + 0.3);
    } else {
      detectedLanguage = 'unknown';
      confidence = 0.3;
    }

    const hinglishScore = detectedLanguage === 'hinglish' ? confidence : Math.min(enScore, hiLatnScore);

    return {
      language: detectedLanguage,
      confidence: Math.round(confidence * 100) / 100,
      scores: {
        en: Math.round(enScore * 100) / 100,
        'hi-Latn': Math.round(hiLatnScore * 100) / 100,
        hinglish: Math.round(hinglishScore * 100) / 100,
        unknown: detectedLanguage === 'unknown' ? 0.7 : 0.1,
      },
    };
  }
}

export const languageDetector = new LanguageDetector();
