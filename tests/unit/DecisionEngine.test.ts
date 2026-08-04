import { describe, it, expect } from 'vitest';
import { DecisionEngine } from '../../src/services/ai/DecisionEngine';

describe('DecisionEngine Unit Tests', () => {
  it('should compute correct decision from labels', () => {
    expect(DecisionEngine.evaluateDecision('SAFE', 'SAFE')).toBe('SAFE');
    expect(DecisionEngine.evaluateDecision('NSFW', 'SAFE')).toBe('NSFW');
    expect(DecisionEngine.evaluateDecision('SAFE', 'GRAPHIC')).toBe('GRAPHIC');
    expect(DecisionEngine.evaluateDecision('NSFW', 'GRAPHIC')).toBe('BOTH');
  });

  it('should evaluate text decision threshold correctly', () => {
    expect(DecisionEngine.evaluateTextDecision('SAFE', 0.9)).toBe('SAFE');
    expect(DecisionEngine.evaluateTextDecision('ABUSIVE', 0.8)).toBe('ABUSIVE');
    expect(DecisionEngine.evaluateTextDecision('ABUSIVE', 0.4)).toBe('SAFE'); // Below threshold
  });

  it('should assess risk score and map to correct Risk Levels', () => {
    // SAFE case
    const safeAssessment = DecisionEngine.assessRisk(0.05, 0.02, false, 0.0);
    expect(safeAssessment.riskLevel).toBe('SAFE');
    expect(safeAssessment.score).toBeLessThan(20);

    // LOW case
    const lowAssessment = DecisionEngine.assessRisk(0.2, 0.1, false, 0.2);
    expect(lowAssessment.riskLevel).toBe('LOW');
    expect(lowAssessment.score).toBe(26);

    // MEDIUM case
    const medAssessment = DecisionEngine.assessRisk(0.45, 0.2, false, 0.1);
    expect(medAssessment.riskLevel).toBe('MEDIUM');
    expect(medAssessment.violationCategories).toContain('NSFW_CONTENT');

    // HIGH case
    const highAssessment = DecisionEngine.assessRisk(0.65, 0.1, false, 0.0);
    expect(highAssessment.riskLevel).toBe('HIGH');
    expect(highAssessment.score).toBe(45); // Triggered by threshold elevation rule

    // CRITICAL case
    const critAssessment = DecisionEngine.assessRisk(0.85, 0.3, true, 0.5);
    expect(critAssessment.riskLevel).toBe('CRITICAL');
    expect(critAssessment.violationCategories).toContain('NSFW_CONTENT');
    expect(critAssessment.violationCategories).toContain('EMBEDDED_TEXT');
  });
});
