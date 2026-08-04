/**
 * ShieldSight AI - Conversation UI Protection Utilities
 * Programmatically constructs flat message obscuring overlays to replace toxic chat text.
 * XSS Hardened: 100% Safe DOM node construction.
 * Accessibility-First: Keeps copy/paste, scroll, reply, and selection intact.
 */

import { MessageElement } from './ConversationTypes';
import { ToxicityResult } from '../../types/text';
import { logger } from '../../utils/logger';

// WeakMap storing original inner nodes of the chat bubble to support Reveal Once
const originalContents = new WeakMap<HTMLElement, Node[]>();

/**
 * Obscures toxic message bubbles with a consumer-friendly safety warning card.
 */
export function obscureMessage(message: MessageElement, result: ToxicityResult): void {
  const container = message.element;
  if (originalContents.has(container)) return; // Already obscured

  // 1. Stash current child nodes for Reveal Once restoration
  const kids: Node[] = [];
  while (container.firstChild) {
    kids.push(container.firstChild);
    container.removeChild(container.firstChild);
  }
  originalContents.set(container, kids);

  // 2. Build Warning Pill container
  const pill = document.createElement('div');
  pill.className = 'shieldsight-message-warning-pill';
  pill.style.background = '#0f172a';
  pill.style.border = '1px solid #1e293b';
  pill.style.borderRadius = '6px';
  pill.style.padding = '8px 12px';
  pill.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  pill.style.color = '#f3f4f6';
  pill.style.fontSize = '11px';
  pill.style.lineHeight = '1.4';
  pill.style.width = '100%';
  pill.style.maxWidth = '300px';
  pill.style.display = 'inline-block';
  pill.style.verticalAlign = 'middle';
  pill.style.userSelect = 'text';

  const header = document.createElement('div');
  header.style.fontWeight = '800';
  header.style.color = '#f87171';
  header.style.marginBottom = '2px';
  header.textContent = '🛡️ ShieldSight AI';

  const title = document.createElement('div');
  title.style.fontWeight = '700';
  title.style.color = '#ffffff';
  title.textContent = 'Sensitive Message Hidden';

  const desc = document.createElement('div');
  desc.style.fontSize = '10px';
  desc.style.color = '#9ca3af';
  desc.style.margin = '2px 0 6px 0';
  desc.textContent = 'Reason: Harmful Language';

  // Collapsible diagnostics block
  const diagnostics = document.createElement('div');
  diagnostics.style.display = 'none';
  diagnostics.style.textAlign = 'left';
  diagnostics.style.fontSize = '9px';
  diagnostics.style.color = '#9ca3af';
  diagnostics.style.borderTop = '1px solid #1f2937';
  diagnostics.style.paddingTop = '6px';
  diagnostics.style.marginTop = '6px';
  diagnostics.style.marginBottom = '8px';
  diagnostics.style.lineHeight = '1.3';

  const diagTitle = document.createElement('div');
  diagTitle.style.fontWeight = '700';
  diagTitle.style.textTransform = 'uppercase';
  diagTitle.style.letterSpacing = '0.04em';
  diagTitle.style.color = '#64748b';
  diagTitle.style.marginBottom = '3px';
  diagTitle.textContent = 'Message Telemetry';
  diagnostics.appendChild(diagTitle);

  const stats = [
    { label: 'Platform', val: message.platform },
    { label: 'ID', val: message.id },
    { label: 'Classification', val: result.label },
    { label: 'Confidence', val: `${Math.round(result.confidence * 100)}%` },
    { label: 'Inference Latency', val: `${result.inferenceTimeMs}ms` },
    { label: 'Action Taken', val: 'Obscured content' },
  ];

  stats.forEach((item) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';

    const lbl = document.createElement('span');
    lbl.style.fontWeight = '600';
    lbl.textContent = item.label + ': ';

    const val = document.createElement('span');
    val.style.fontFamily = 'monospace';
    val.textContent = item.val;

    row.appendChild(lbl);
    row.appendChild(val);
    diagnostics.appendChild(row);
  });

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '8px';
  actions.style.marginTop = '6px';

  const revealBtn = document.createElement('button');
  revealBtn.type = 'button';
  revealBtn.textContent = 'Reveal Once';
  revealBtn.style.background = '#1e293b';
  revealBtn.style.color = '#f1f5f9';
  revealBtn.style.border = '1px solid #334155';
  revealBtn.style.borderRadius = '4px';
  revealBtn.style.padding = '4px 8px';
  revealBtn.style.fontSize = '9px';
  revealBtn.style.fontWeight = '700';
  revealBtn.style.cursor = 'pointer';
  revealBtn.style.textTransform = 'uppercase';

  revealBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    restoreMessage(message);
  });

  const learnMoreBtn = document.createElement('button');
  learnMoreBtn.type = 'button';
  learnMoreBtn.textContent = 'Learn More';
  learnMoreBtn.style.background = 'transparent';
  learnMoreBtn.style.color = '#6b7280';
  learnMoreBtn.style.border = 'none';
  learnMoreBtn.style.fontSize = '9px';
  learnMoreBtn.style.fontWeight = '600';
  learnMoreBtn.style.cursor = 'pointer';

  learnMoreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const isHidden = diagnostics.style.display === 'none';
    diagnostics.style.display = isHidden ? 'block' : 'none';
    learnMoreBtn.textContent = isHidden ? 'Collapse' : 'Learn More';
  });

  actions.appendChild(revealBtn);
  actions.appendChild(learnMoreBtn);

  pill.appendChild(header);
  pill.appendChild(title);
  pill.appendChild(desc);
  pill.appendChild(diagnostics);
  pill.appendChild(actions);

  container.appendChild(pill);

  // Structured audit logger output matching specifications
  logger.styled(
    '[ShieldSight Conversation]',
    `Obscured Message: ${message.id} on ${message.platform} | Classification: ${result.label} | Latency: ${result.inferenceTimeMs}ms`,
    'color: #f87171; font-weight: bold;',
    'color: #f3f4f6;'
  );
}

/**
 * Restores original content of the message bubble element upon Reveal Once action.
 */
export function restoreMessage(message: MessageElement): void {
  const container = message.element;
  const kids = originalContents.get(container);

  if (kids) {
    container.textContent = '';
    kids.forEach((k) => container.appendChild(k));
    originalContents.delete(container);
    logger.info(`[ShieldSight Conversation] Revealed message ${message.id}`);
  }
}
