/**
 * ShieldSight AI - Presentation Mode Styling Utilities
 * Injects modern glassmorphic HUD overlay styles and smooth step fade animations.
 */

const PRESENTATION_STYLES_ID = 'shieldsight-presentation-styles';

export function ensurePresentationStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(PRESENTATION_STYLES_ID)) return;

  const styleEl = document.createElement('style');
  styleEl.id = PRESENTATION_STYLES_ID;
  styleEl.textContent = `
    /* Presentation HUD Container */
    .shieldsight-hud-overlay {
      position: absolute !important;
      inset: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 10000 !important;
      pointer-events: none !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      animation: shieldsightHudFade 3s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
    }

    .shieldsight-hud-card {
      background: rgba(15, 23, 42, 0.92) !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
      border: 1px solid rgba(99, 102, 241, 0.4) !important;
      border-radius: 16px !important;
      padding: 14px 18px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 4px !important;
      box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(99, 102, 241, 0.2) !important;
      min-width: 220px !important;
    }

    .shieldsight-hud-header {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      color: #6366f1 !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      margin-bottom: 6px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      padding-bottom: 4px !important;
      width: 100% !important;
      justify-content: center !important;
    }

    .shieldsight-hud-step {
      font-size: 11px !important;
      font-weight: 600 !important;
      color: #f1f5f9 !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      margin: 0 !important;
    }

    .shieldsight-hud-val {
      color: #38bdf8 !important;
      font-weight: 700 !important;
    }

    .shieldsight-hud-val-blocked {
      color: #ef4444 !important;
      font-weight: 700 !important;
    }

    .shieldsight-hud-val-safe {
      color: #10b981 !important;
      font-weight: 700 !important;
    }

    .shieldsight-hud-arrow {
      color: #64748b !important;
      font-size: 10px !important;
      line-height: 1 !important;
      margin: 1px 0 !important;
    }

    @keyframes shieldsightHudFade {
      0% { opacity: 0; transform: scale(0.92); }
      10% { opacity: 1; transform: scale(1); }
      75% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.96); }
    }
  `;

  (document.head || document.documentElement).appendChild(styleEl);
}
