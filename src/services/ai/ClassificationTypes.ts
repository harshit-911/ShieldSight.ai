/**
 * ShieldSight AI - AI Classification Types
 * Type definitions for AI classifiers, multi-classifier outputs, and overall decisions.
 */

import { ClassificationResult } from '../../types/queue';
import { ToxicityLabel } from '../../types/text';

export type NSFWLabel = 'SAFE' | 'NSFW';
export type ViolenceLabel = 'SAFE' | 'GRAPHIC';
export type OverallDecision = 'SAFE' | 'NSFW' | 'GRAPHIC' | 'BOTH';

/** Result from OpenNSFW2 classifier */
export interface OpenNSFWResult extends ClassificationResult {
  probability: number;
  nsfwLabel: NSFWLabel;
  inferenceTimeMs: number;
}

/** Result from Graphic Violence & Gore classifier */
export interface ViolenceResult extends ClassificationResult {
  probability: number;
  violenceLabel: ViolenceLabel;
  inferenceTimeMs: number;
}

/** Combined multi-classifier result output by AI Orchestrator */
export interface CombinedClassificationResult extends ClassificationResult {
  /** OpenNSFW2 classification result */
  nsfw: {
    probability: number;
    label: NSFWLabel;
  };
  /** Graphic Violence & Gore classification result */
  violence: {
    probability: number;
    label: ViolenceLabel;
  };
  /** Overall combined decision */
  overallDecision: OverallDecision;
  /** Detailed breakdown of all individual classifier results */
  results: Record<string, ClassificationResult>;
  textBlocked?: boolean;
  ocrText?: string;
  textLabel?: ToxicityLabel;
}

/** Configuration options for image preprocessing */
export interface PreprocessOptions {
  targetWidth: number;
  targetHeight: number;
  mean?: [number, number, number];
  std?: [number, number, number];
}
