/**
 * ShieldSight AI - Conversation Platform Adapters
 * Implements WhatsAppWebAdapter and GenericConversationAdapter.
 * High Resilience: Uses data-id heuristics (true_/false_ prefix) and class name patterns
 * to reliably intercept WhatsApp Web messages across active updates.
 */

import { ConversationAdapter, MessageElement } from './ConversationTypes';

/**
 * Heuristic to extract unique, stable message text ID and sanitize text.
 */
export function generateMessageId(text: string, timestamp: number, sender: string): string {
  let hash = 0;
  const str = `${sender}_${timestamp}_${text}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `msg_${Math.abs(hash)}`;
}

export class WhatsAppWebAdapter implements ConversationAdapter {
  readonly platformName = 'whatsapp';

  canHandle(url: URL): boolean {
    return url.hostname.includes('web.whatsapp.com');
  }

  async discoverMessages(root: HTMLElement = document.body): Promise<MessageElement[]> {
    const messages: MessageElement[] = [];

    // WhatsApp Web bubble selectors (including partial class patterns & data-id triggers)
    const bubbles = root.querySelectorAll(
      '.message-in, .message-out, [class*="message-in"], [class*="message-out"], [data-id^="true_"], [data-id^="false_"], [data-id*="@c.us"], [data-id*="@g.us"], div[role="row"], div[tabindex="-1"]'
    );

    bubbles.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;

      // Ignore deleted, status updates, or system elements by searching keywords
      const textContent = el.textContent || '';
      if (
        textContent.includes('Waiting for this message') ||
        textContent.includes('This message was deleted') ||
        el.querySelector('[data-icon="status-meta"]')
      ) {
        return;
      }

      // Determine sender: true_ prefix in data-id or class match
      let sender: 'incoming' | 'outgoing' = 'incoming';
      const dataId = el.getAttribute('data-id') || '';
      const classStr = el.className.toLowerCase();

      if (dataId.startsWith('true_') || classStr.includes('message-out')) {
        sender = 'outgoing';
      }

      // Read copyable text wrapper or text span (extremely robust fallbacks)
      const textEl = 
        el.querySelector('.copyable-text span') as HTMLElement || 
        el.querySelector('.selectable-text') as HTMLElement ||
        el.querySelector('span[dir="ltr"]') as HTMLElement ||
        el.querySelector('span._ao3e') as HTMLElement ||
        el.querySelector('span') as HTMLElement ||
        el;

      if (!textEl) return;

      const text = (textEl.textContent || '').trim();
      if (!text || text.length > 2000) return; // Skip noise / large segments

      const idAttr = dataId || generateMessageId(text, Date.now(), sender);

      messages.push({
        id: idAttr,
        timestamp: Date.now(),
        sender,
        text,
        platform: this.platformName,
        element: textEl,
        status: 'pending',
      });
    });

    return messages;
  }
}

export class GenericConversationAdapter implements ConversationAdapter {
  readonly platformName = 'generic_chat';

  canHandle(_url: URL): boolean {
    return true; // Fallback matches all websites
  }

  async discoverMessages(root: HTMLElement = document.body): Promise<MessageElement[]> {
    const messages: MessageElement[] = [];

    // Select common messaging bubble selector heuristics
    const bubbles = root.querySelectorAll(
      '.message, .chat-bubble, .msg, .chat-message, [role="row"] div.bubble, .im-message, [data-testid="messageEntry"]'
    );

    bubbles.forEach((bubble) => {
      if (!(bubble instanceof HTMLElement)) return;

      const text = (bubble.textContent || '').trim();
      if (!text || text.length > 2000) return; // Skip massive node segments or noise

      // Heuristics for outgoing vs incoming
      let sender: 'incoming' | 'outgoing' = 'incoming';
      const classStr = bubble.className.toLowerCase();
      const styleStr = window.getComputedStyle(bubble);
      const isRightAligned =
        styleStr.textAlign === 'right' ||
        styleStr.alignSelf === 'flex-end' ||
        styleStr.justifyContent === 'flex-end';

      if (
        classStr.includes('out') ||
        classStr.includes('right') ||
        classStr.includes('end') ||
        classStr.includes('me') ||
        classStr.includes('self') ||
        isRightAligned
      ) {
        sender = 'outgoing';
      }

      const msgId = generateMessageId(text, Date.now(), sender);

      messages.push({
        id: msgId,
        timestamp: Date.now(),
        sender,
        text,
        platform: this.platformName,
        element: bubble,
        status: 'pending',
      });
    });

    return messages;
  }
}
