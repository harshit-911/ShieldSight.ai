/**
 * ShieldSight AI - Text Protection Styling Utilities
 * Injects responsive CSS rules for text blur and flat inline safety badges.
 */

const TEXT_PROTECTION_STYLES_ID = 'shieldsight-text-protection-styles';

export function ensureTextProtectionStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(TEXT_PROTECTION_STYLES_ID)) return;

  const styleEl = document.createElement('style');
  styleEl.id = TEXT_PROTECTION_STYLES_ID;
  styleEl.textContent = `
    /* Text Blur Styling */
    .shieldsight-blurred-text {
      display: inline-block !important;
      filter: blur(8px) !important;
      user-select: none !important;
      pointer-events: none !important;
      transition: filter 0.3s ease-in-out !important;
    }

    /* Flat Cybersecurity Inline Safety Badge */
    .shieldsight-text-badge {
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      margin: 0 6px !important;
      padding: 3px 10px !important;
      background: #0f172a !important;
      border: 1px solid #1e293b !important;
      border-radius: 4px !important;
      color: #f3f4f6 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 10px !important;
      font-weight: 700 !important;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3) !important;
      vertical-align: middle !important;
      z-index: 9990 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.02em !important;
    }

    .shieldsight-badge-icon {
      font-size: 10px !important;
    }

    .shieldsight-badge-text {
      color: #ec4899 !important;
    }

    .shieldsight-badge-reveal {
      background: #1e293b !important;
      border: 1px solid #334155 !important;
      border-radius: 4px !important;
      color: #f1f5f9 !important;
      padding: 1px 8px !important;
      font-size: 9px !important;
      font-weight: 800 !important;
      cursor: pointer !important;
      transition: all 0.15s ease !important;
      text-transform: uppercase !important;
      letter-spacing: 0.02em !important;
    }

    .shieldsight-badge-reveal:hover {
      background: #334155 !important;
      color: #ffffff !important;
    }
  `;

  (document.head || document.documentElement).appendChild(styleEl);
}
