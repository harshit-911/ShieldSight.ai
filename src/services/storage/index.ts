/**
 * ShieldSight AI - Storage Service
 * Handles Chrome Storage API persistence for extension settings, model sensitivity thresholds,
 * real-time statistics, and cross-script state listeners.
 */

export type SensitivityLevel = 'low' | 'medium' | 'high';
export type ProtectionLevel = 'standard' | 'child_safe' | 'maximum';

export interface ShieldSightStats {
  imagesScanned: number;
  nsfwBlocked: number;
  graphicBlocked: number;
  totalAiTimeMs: number;
}

export interface ShieldSightSettings {
  protectionEnabled: boolean;
  nsfwEnabled: boolean;
  violenceEnabled: boolean;
  presentationModeEnabled: boolean;
  protectionLevel: ProtectionLevel;
  nsfwSensitivity: SensitivityLevel;
  violenceSensitivity: SensitivityLevel;
  stats: ShieldSightStats;
}

export const SENSITIVITY_THRESHOLDS: Record<SensitivityLevel, number> = {
  low: 0.8,
  medium: 0.6,
  high: 0.4,
};

const DEFAULT_SETTINGS: ShieldSightSettings = {
  protectionEnabled: true,
  nsfwEnabled: true,
  violenceEnabled: true,
  presentationModeEnabled: false,
  protectionLevel: 'child_safe',
  nsfwSensitivity: 'high',
  violenceSensitivity: 'medium',
  stats: {
    imagesScanned: 0,
    nsfwBlocked: 0,
    graphicBlocked: 0,
    totalAiTimeMs: 0,
  },
};

type SettingsChangeListener = (settings: ShieldSightSettings) => void;

export class StorageService {
  private listeners: Set<SettingsChangeListener> = new Set();
  private mockStorage: ShieldSightSettings = { ...DEFAULT_SETTINGS };

  constructor() {
    this.setupChromeStorageListener();
  }

  private isChromeStorageAvailable(): boolean {
    return (
      typeof chrome !== 'undefined' &&
      !!chrome.storage &&
      !!chrome.storage.local
    );
  }

  private setupChromeStorageListener(): void {
    if (this.isChromeStorageAvailable() && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.shieldsight_settings) {
          const newSettings = changes.shieldsight_settings.newValue as ShieldSightSettings;
          if (newSettings) {
            this.notifyListeners(newSettings);
          }
        }
      });
    }
  }

  /**
   * Retrieves full extension settings object.
   */
  async getSettings(): Promise<ShieldSightSettings> {
    if (this.isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.get(['shieldsight_settings'], (result) => {
          if (result.shieldsight_settings) {
            resolve({ ...DEFAULT_SETTINGS, ...result.shieldsight_settings });
          } else {
            resolve({ ...DEFAULT_SETTINGS });
          }
        });
      });
    }
    return { ...this.mockStorage };
  }

  /**
   * Updates partial settings and persists to chrome.storage.local.
   */
  async updateSettings(partial: Partial<ShieldSightSettings>): Promise<ShieldSightSettings> {
    const current = await this.getSettings();
    const updated: ShieldSightSettings = {
      ...current,
      ...partial,
      stats: {
        ...current.stats,
        ...(partial.stats || {}),
      },
    };

    if (this.isChromeStorageAvailable()) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ shieldsight_settings: updated }, () => resolve());
      });
    } else {
      this.mockStorage = updated;
    }

    this.notifyListeners(updated);
    return updated;
  }

  /**
   * Resets real-time statistics counters.
   */
  async resetStats(): Promise<ShieldSightSettings> {
    return this.updateSettings({
      stats: {
        imagesScanned: 0,
        nsfwBlocked: 0,
        graphicBlocked: 0,
        totalAiTimeMs: 0,
      },
    });
  }

  /**
   * Records a completed image classification in statistics.
   */
  async recordClassification(nsfwBlocked: boolean, graphicBlocked: boolean, aiTimeMs: number): Promise<void> {
    const settings = await this.getSettings();
    const stats = settings.stats;

    const newStats: ShieldSightStats = {
      imagesScanned: stats.imagesScanned + 1,
      nsfwBlocked: stats.nsfwBlocked + (nsfwBlocked ? 1 : 0),
      graphicBlocked: stats.graphicBlocked + (graphicBlocked ? 1 : 0),
      totalAiTimeMs: stats.totalAiTimeMs + aiTimeMs,
    };

    await this.updateSettings({ stats: newStats });
  }

  /**
   * Backwards compatible method for protection status check.
   */
  async getProtectionStatus(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.protectionEnabled;
  }

  /**
   * Backwards compatible method for setting protection status.
   */
  async setProtectionStatus(enabled: boolean): Promise<ShieldSightSettings> {
    return this.updateSettings({ protectionEnabled: enabled });
  }

  /**
   * Backwards compatible listener wrapper.
   */
  onProtectionStatusChange(listener: (enabled: boolean) => void): () => void {
    return this.onSettingsChange((settings) => listener(settings.protectionEnabled));
  }

  /**
   * Registers a listener to be notified when extension settings change in real-time.
   */
  onSettingsChange(listener: SettingsChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(settings: ShieldSightSettings): void {
    this.listeners.forEach((listener) => {
      try {
        listener(settings);
      } catch (err) {
        console.error('[ShieldSight Storage] Listener error:', err);
      }
    });
  }
}

export const storageService = new StorageService();
