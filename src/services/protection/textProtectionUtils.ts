/**
 * ShieldSight AI - Text Protection Styling Utilities
 * Injects responsive CSS rules for text blur and minimalist inline safety badges.
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
      filter: blur(8px) !important;
      user-select: none !important;
      pointer-events: none !important;
      transition: filter 0.3s ease-in-out !important;
    }

    span.shieldsight-blurred-text {
      display: inline-block !important;
    }

    /* Minimalist Inline Safety Badge */
    .shieldsight-text-badge {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      margin: 0 4px !important;
      padding: 2px 8px !important;
      background: #0D1322 !important;
      border: 1px solid #1e293b !important;
      border-radius: 4px !important;
      color: #f8fafc !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 10px !important;
      font-weight: 600 !important;
      vertical-align: middle !important;
      z-index: 9990 !important;
    }

    .shieldsight-badge-icon {
      font-size: 10px !important;
    }

    .shieldsight-badge-text {
      color: #f8fafc !important;
      font-weight: 600 !important;
    }

    .shieldsight-badge-reveal {
      background: #1e293b !important;
      border: 1px solid #334155 !important;
      border-radius: 3px !important;
      color: #f8fafc !important;
      padding: 1px 6px !important;
      font-size: 9px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: background 0.15s ease !important;
      text-transform: uppercase !important;
    }

    .shieldsight-badge-reveal:hover {
      background: #334155 !important;
      color: #ffffff !important;
    }
  `;

  (document.head || document.documentElement).appendChild(styleEl);
}
