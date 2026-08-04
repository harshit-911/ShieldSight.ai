import { describe, it, expect, vi } from 'vitest';
import { storageService, SENSITIVITY_THRESHOLDS } from '../../src/services/storage';

describe('StorageService Unit Tests', () => {
  it('should return default settings initially', async () => {
    const settings = await storageService.getSettings();

    expect(settings.protectionEnabled).toBe(true);
    expect(settings.nsfwEnabled).toBe(true);
    expect(settings.violenceEnabled).toBe(true);
    expect(settings.nsfwSensitivity).toBeDefined();
    expect(settings.violenceSensitivity).toBeDefined();
  });

  it('should map sensitivity levels to correct numerical thresholds', () => {
    expect(SENSITIVITY_THRESHOLDS.low).toBe(0.8);
    expect(SENSITIVITY_THRESHOLDS.medium).toBe(0.6);
    expect(SENSITIVITY_THRESHOLDS.high).toBe(0.4);
  });

  it('should update partial settings and notify listeners in real-time', async () => {
    const listener = vi.fn();
    const unsubscribe = storageService.onSettingsChange(listener);

    const updated = await storageService.updateSettings({
      nsfwSensitivity: 'high',
      violenceSensitivity: 'low',
    });

    expect(updated.nsfwSensitivity).toBe('high');
    expect(updated.violenceSensitivity).toBe('low');
    expect(listener).toHaveBeenCalledWith(updated);

    unsubscribe();
  });

  it('should record classification statistics and reset stats correctly', async () => {
    await storageService.resetStats();

    await storageService.recordClassification(true, false, 50);
    await storageService.recordClassification(false, true, 30);

    const settings = await storageService.getSettings();
    expect(settings.stats.imagesScanned).toBe(2);
    expect(settings.stats.nsfwBlocked).toBe(1);
    expect(settings.stats.graphicBlocked).toBe(1);
    expect(settings.stats.totalAiTimeMs).toBe(80);

    await storageService.resetStats();
    const resetSettings = await storageService.getSettings();
    expect(resetSettings.stats.imagesScanned).toBe(0);
  });
});
