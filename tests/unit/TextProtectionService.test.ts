import { describe, it, expect, beforeEach } from 'vitest';
import { TextProtectionService } from '../../src/services/protection/TextProtectionService';
import { DiscoveredTextBlock, ToxicityResult } from '../../src/types/text';

describe('TextProtectionService Unit Tests', () => {
  let service: TextProtectionService;

  beforeEach(() => {
    document.body.innerHTML = '';
    service = new TextProtectionService();
  });

  it('should apply CSS blur and inline safety badge for toxic text', () => {
    const container = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = 'Harmful abusive message';
    container.appendChild(p);
    document.body.appendChild(container);

    const block: DiscoveredTextBlock = {
      id: 'text-test-1',
      element: p,
      text: 'Harmful abusive message',
      timestamp: Date.now(),
    };

    const result: ToxicityResult = {
      textId: 'text-test-1',
      isHarmful: true,
      label: 'ABUSIVE',
      confidence: 0.9,
      scores: { SAFE: 0.1, ABUSIVE: 0.9, HARASSMENT: 0.0, SEXUAL: 0.0, THREAT: 0.0, HATE: 0.0 },
      inferenceTimeMs: 12,
      timestamp: Date.now(),
    };

    const applied = service.protect(block, result);
    expect(applied).toBe(true);
    expect(p.classList.contains('shieldsight-blurred-text')).toBe(true);

    const badge = document.querySelector('[data-shieldsight-text-id="text-test-1"]');
    expect(badge).not.toBeNull();
    expect(badge?.textContent).toContain('Sensitive Language Hidden');
  });

  it('should unblur text when Reveal button is clicked', () => {
    const container = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = 'Harmful abusive message';
    container.appendChild(p);
    document.body.appendChild(container);

    const block: DiscoveredTextBlock = {
      id: 'text-test-2',
      element: p,
      text: 'Harmful abusive message',
      timestamp: Date.now(),
    };

    const result: ToxicityResult = {
      textId: 'text-test-2',
      isHarmful: true,
      label: 'ABUSIVE',
      confidence: 0.9,
      scores: { SAFE: 0.1, ABUSIVE: 0.9, HARASSMENT: 0.0, SEXUAL: 0.0, THREAT: 0.0, HATE: 0.0 },
      inferenceTimeMs: 12,
      timestamp: Date.now(),
    };

    service.protect(block, result);
    const revealBtn = document.querySelector('.shieldsight-badge-reveal') as HTMLButtonElement;
    expect(revealBtn).not.toBeNull();

    revealBtn.click();
    expect(p.classList.contains('shieldsight-blurred-text')).toBe(false);
  });
});
