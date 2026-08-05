/**
 * ShieldSight AI - Conversation UI Protection Utilities
 * Programmatically constructs minimalist message obscuring overlays to replace toxic chat text.
 * XSS Hardened: 100% Safe DOM node construction.
 * Accessibility-First: Keeps copy/paste, scroll, reply, and selection intact.
 */

import { MessageElement } from './ConversationTypes';
import { ToxicityResult } from '../../types/text';
import { logger } from '../../utils/logger';

// WeakMap storing original inner nodes of the chat bubble to support Reveal Once
const originalContents = new WeakMap<HTMLElement, Node[]>();

/**
 * Obscures toxic message bubbles with a minimalist safety warning card.
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
  pill.style.background = '#0D1322';
  pill.style.border = '1px solid #1e293b';
  pill.style.borderRadius = '8px';
  pill.style.padding = '8px 12px';
  pill.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  pill.style.color = '#f8fafc';
  pill.style.fontSize = '11px';
  pill.style.lineHeight = '1.4';
  pill.style.width = '100%';
  pill.style.maxWidth = '280px';
  pill.style.display = 'inline-block';
  pill.style.verticalAlign = 'middle';
  pill.style.userSelect = 'text';

  const header = document.createElement('div');
  header.style.fontWeight = '700';
  header.style.color = '#f8fafc';
  header.style.fontSize = '11px';
  header.style.marginBottom = '2px';
  header.textContent = 'Sensitive Message Hidden';

  const desc = document.createElement('div');
  desc.style.fontSize = '10px';
  desc.style.color = '#94a3b8';
  desc.style.marginBottom = '6px';
  desc.textContent = 'Reason: Harmful Language';

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '6px';
  actions.style.marginTop = '6px';

  const revealBtn = document.createElement('button');
  revealBtn.type = 'button';
  revealBtn.textContent = 'Reveal Once';
  revealBtn.style.background = '#1e293b';
  revealBtn.style.color = '#f8fafc';
  revealBtn.style.border = '1px solid #334155';
  revealBtn.style.borderRadius = '4px';
  revealBtn.style.padding = '3px 8px';
  revealBtn.style.fontSize = '9px';
  revealBtn.style.fontWeight = '600';
  revealBtn.style.cursor = 'pointer';
  revealBtn.style.textTransform = 'uppercase';

  revealBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    restoreMessage(message);
  });

  actions.appendChild(revealBtn);

  pill.appendChild(header);
  pill.appendChild(desc);
  pill.appendChild(actions);

  container.appendChild(pill);

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
