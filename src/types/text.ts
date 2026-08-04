/**
 * ShieldSight AI - Text Pipeline Data Interfaces
 */

export type ToxicityLabel =
  | 'SAFE'
  | 'ABUSIVE'
  | 'HARASSMENT'
  | 'SEXUAL'
  | 'THREAT'
  | 'HATE'
  | 'GROOMING';

export interface DiscoveredTextBlock {
  id: string;
  element: HTMLElement;
  text: string;
  timestamp: number;
}

export interface ToxicityResult {
  textId: string;
  isHarmful: boolean;
  label: ToxicityLabel;
  confidence: number;
  scores: Record<ToxicityLabel, number>;
  inferenceTimeMs: number;
  timestamp: number;
}
