/**
 * ShieldSight AI - Risk Assessment Decision Engine
 * Evaluates individual classifier outputs (OpenNSFW2, Violence & Gore, OCR, and Toxicity)
 * and determines the overall threat score and corresponding risk level.
 * Risk Levels: SAFE, LOW, MEDIUM, HIGH, CRITICAL.
 */

import { OverallDecision, NSFWLabel, ViolenceLabel } from './ClassificationTypes';
import { ToxicityLabel } from '../../types/text';

export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskAssessment {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  violationCategories: string[];
}

export class DecisionEngine {
  /**
   * Computes overall classification decision based on NSFW and Graphic Violence flags.
   */
  static evaluateDecision(
    nsfwLabel: NSFWLabel,
    violenceLabel: ViolenceLabel
  ): OverallDecision {
    const isNsfw = nsfwLabel === 'NSFW';
    const isGraphic = violenceLabel === 'GRAPHIC';

    if (isNsfw && isGraphic) {
      return 'BOTH';
    }
    if (isNsfw) {
      return 'NSFW';
    }
    if (isGraphic) {
      return 'GRAPHIC';
    }
    return 'SAFE';
  }

  /**
   * Computes text decision based on toxicity classification label and confidence.
   */
  static evaluateTextDecision(label: ToxicityLabel, confidence: number, threshold: number = 0.6): ToxicityLabel {
    if (confidence >= threshold && label !== 'SAFE') {
      return label;
    }
    return 'SAFE';
  }

  /**
   * Evaluates a multi-factor risk assessment score and level.
   * Future classifiers can contribute by passing new probability parameters.
   */
  static assessRisk(
    nsfwProb: number,
    violenceProb: number,
    ocrFound: boolean = false,
    toxicityProb: number = 0.0
  ): RiskAssessment {
    const violationCategories: string[] = [];

    // Calculate individual factor contributions
    const nsfwContribution = nsfwProb * 60; // Max 60 points
    const violenceContribution = violenceProb * 60; // Max 60 points
    const ocrContribution = ocrFound ? 10 : 0; // Max 10 points
    const toxicityContribution = toxicityProb * 40; // Max 40 points

    let score = Math.min(100, Math.round(nsfwContribution + violenceContribution + ocrContribution + toxicityContribution));

    if (nsfwProb >= 0.4) violationCategories.push('NSFW_CONTENT');
    if (violenceProb >= 0.4) violationCategories.push('GRAPHIC_VIOLENCE');
    if (toxicityProb >= 0.4) violationCategories.push('TOXIC_LANGUAGE');
    if (ocrFound) violationCategories.push('EMBEDDED_TEXT');

    // Risk mapping rules based on score and triggers
    let riskLevel: RiskLevel = 'SAFE';

    if (score >= 80 || nsfwProb >= 0.8 || violenceProb >= 0.8) {
      riskLevel = 'CRITICAL';
    } else if (score >= 60 || nsfwProb >= 0.6 || violenceProb >= 0.6) {
      riskLevel = 'HIGH';
    } else if (score >= 40 || nsfwProb >= 0.4 || violenceProb >= 0.4) {
      riskLevel = 'MEDIUM';
    } else if (score >= 20) {
      riskLevel = 'LOW';
    }

    return {
      score,
      riskLevel,
      violationCategories,
    };
  }
}
