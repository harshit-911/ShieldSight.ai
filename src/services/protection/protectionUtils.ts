/**
 * ShieldSight AI - Protection Styling Utilities
 * Injects responsive CSS rules for flat elevated cybersecurity warnings,
 * pre-blur loading states, and smooth scanning transitions.
 */

const PROTECTION_STYLES_ID = 'shieldsight-protection-styles';

export function ensureProtectionStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(PROTECTION_STYLES_ID)) return;

  const styleEl = document.createElement('style');
  styleEl.id = PROTECTION_STYLES_ID;
  styleEl.textContent = `
    /* Flash-Of-Unprotected-Content (FOUC) Prevention Pre-Blur */
    .shieldsight-pre-blur {
      filter: blur(25px) brightness(0.85) !important;
      transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      will-change: filter !important;
    }

    /* Permanent Protection Blur */
    .shieldsight-blurred-image {
      filter: blur(35px) brightness(0.4) !important;
      user-select: none !important;
      pointer-events: none !important;
      transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      will-change: filter !important;
    }

    /* Flat Cybersecurity Centered Overlay Container */
    .shieldsight-protection-overlay,
    .shieldsight-scanning-overlay {
      position: absolute !important;
      inset: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 9999 !important;
      pointer-events: auto !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }

    /* Scanning Card (Flat elevated style) */
    .shieldsight-scanning-card {
      background: #0f172a !important;
      border: 1px solid #1e293b !important;
      border-radius: 12px !important;
      padding: 12px 18px !important;
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
    }

    .shieldsight-scanning-dot {
      width: 6px !important;
      height: 6px !important;
      border-radius: 50% !important;
      background-color: #38bdf8 !important;
      box-shadow: 0 0 6px #38bdf8 !important;
      animation: shieldsightDotPulse 1.2s ease-in-out infinite !important;
    }

    .shieldsight-scanning-title {
      color: #f1f5f9 !important;
      font-size: 11px !important;
      font-weight: 750 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      margin: 0 !important;
    }

    .shieldsight-scanning-subtitle {
      color: #94a3b8 !important;
      font-size: 10px !important;
      font-weight: 550 !important;
      margin: 2px 0 0 0 !important;
    }

    /* Permanent Safety Overlay Card (Matte Defender style) */
    .shieldsight-overlay-card {
      background: #0b0f19 !important;
      border: 1px solid #1f2937 !important;
      border-radius: 12px !important;
      padding: 20px 24px !important;
      text-align: center !important;
      max-width: 270px !important;
      width: 85% !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6) !important;
      color: #f3f4f6 !important;
    }

    .shieldsight-shield-icon {
      font-size: 22px !important;
      color: #f87171 !important;
      margin-bottom: 8px !important;
    }

    .shieldsight-overlay-title {
      font-size: 13px !important;
      font-weight: 800 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      margin: 0 0 4px 0 !important;
      color: #ffffff !important;
    }

    .shieldsight-overlay-subtitle {
      font-size: 11px !important;
      font-weight: 600 !important;
      color: #9ca3af !important;
      margin: 0 0 14px 0 !important;
    }

    .shieldsight-meta-badge {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      background: #1e1b4b !important;
      border: 1px solid #312e81 !important;
      border-radius: 4px !important;
      padding: 4px 10px !important;
      font-size: 10px !important;
      font-weight: 700;
      color: #c7d2fe !important;
      margin-bottom: 16px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.02em !important;
    }

    .shieldsight-actions {
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
    }

    .shieldsight-btn-reveal {
      background: #1e293b !important;
      color: #f1f5f9 !important;
      border: 1px solid #334155 !important;
      border-radius: 6px !important;
      padding: 8px 14px !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      transition: all 0.15s ease !important;
      text-transform: uppercase !important;
      letter-spacing: 0.03em !important;
    }

    .shieldsight-btn-reveal:hover {
      background: #334155 !important;
      color: #ffffff !important;
    }

    .shieldsight-btn-allow,
    .shieldsight-btn-learn {
      background: transparent !important;
      color: #6b7280 !important;
      border: 1px solid transparent !important;
      border-radius: 6px !important;
      padding: 6px 12px !important;
      font-size: 10px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all 0.15s ease !important;
    }

    .shieldsight-btn-allow:hover,
    .shieldsight-btn-learn:hover {
      color: #9ca3af !important;
    }

    @keyframes shieldsightDotPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.6; }
    }
  `;

  (document.head || document.documentElement).appendChild(styleEl);
}
