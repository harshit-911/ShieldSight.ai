export interface DownloadMetrics {
  downloadsCount: number;
  latestVersion: string;
  releaseDate: string;
  lastDownloadedAt?: string;
}

export interface AnalyticsProvider {
  name: string;
  trackDownload(version: string, source: string): void;
}

const STORAGE_KEY = 'shieldsight_download_analytics_v1';

class DownloadAnalyticsService {
  private providers: AnalyticsProvider[] = [];

  constructor() {
    // Register default local telemetry provider
    this.registerProvider({
      name: 'LocalStorageProvider',
      trackDownload: (version, source) => {
        if (typeof window === 'undefined') return;
        const current = this.getMetrics();
        const updated: DownloadMetrics = {
          ...current,
          downloadsCount: current.downloadsCount + 1,
          latestVersion: version,
          lastDownloadedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore quota errors
        }
      },
    });
  }

  public registerProvider(provider: AnalyticsProvider): void {
    this.providers.push(provider);
  }

  public trackDownload(version: string = '1.0.0 Beta', source: string = 'website'): void {
    console.log(`[ShieldSight Analytics] Download tracked: Version ${version} via ${source}`);
    this.providers.forEach((p) => {
      try {
        p.trackDownload(version, source);
      } catch (e) {
        console.warn(`[Analytics Provider ${p.name}] Error tracking download:`, e);
      }
    });
  }

  public getMetrics(): DownloadMetrics {
    if (typeof window === 'undefined') {
      return { downloadsCount: 1240, latestVersion: '1.0.0 Beta', releaseDate: new Date().toISOString() };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    return {
      downloadsCount: 1240,
      latestVersion: '1.0.0 Beta',
      releaseDate: new Date().toLocaleDateString(),
    };
  }
}

export const analyticsService = new DownloadAnalyticsService();
