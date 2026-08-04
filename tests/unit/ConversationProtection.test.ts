import { describe, it, expect, vi } from 'vitest';
import { WhatsAppWebAdapter, GenericConversationAdapter } from '../../src/services/conversation/ConversationAdapter';
import { ConversationDiscoveryService } from '../../src/services/conversation/ConversationDiscoveryService';
import { conversationQueue } from '../../src/services/conversation/ConversationQueue';
import { obscureMessage, restoreMessage } from '../../src/services/conversation/ConversationUtils';
import { MessageElement } from '../../src/services/conversation/ConversationTypes';
import { ToxicityResult } from '../../src/types/text';

function createMockMessageNode(text: string, isOutgoing: boolean = false): HTMLElement {
  const bubble = document.createElement('div');
  bubble.className = isOutgoing ? 'chat-bubble bubble-right' : 'chat-bubble';
  bubble.textContent = text;
  document.body.appendChild(bubble);
  return bubble;
}

describe('Conversation Protection Engine Tests', () => {
  it('should discover messages correctly using Generic Adapter', async () => {
    const adapter = new GenericConversationAdapter();
    const node = createMockMessageNode('Hello family', false);

    const discovered = await adapter.discoverMessages(document.body);
    expect(discovered.length).toBeGreaterThan(0);
    const item = discovered.find((m) => m.element === node);
    expect(item).toBeDefined();
    expect(item?.text).toBe('Hello family');
    expect(item?.sender).toBe('incoming');
  });

  it('should detect outgoing vs incoming sender alignment correctly', async () => {
    const adapter = new GenericConversationAdapter();
    const node = createMockMessageNode('Outgoing warning test', true);

    const discovered = await adapter.discoverMessages(document.body);
    const item = discovered.find((m) => m.element === node);
    expect(item).toBeDefined();
    expect(item?.sender).toBe('outgoing');
  });

  it('should obscure toxic message bubble and restore it on Reveal Once', () => {
    const bubble = createMockMessageNode('harmful text', false);
    const message: MessageElement = {
      id: 'msg-test-1',
      timestamp: Date.now(),
      sender: 'incoming',
      text: 'harmful text',
      platform: 'generic_chat',
      element: bubble,
      status: 'pending',
    };

    const result: ToxicityResult = {
      textId: 'msg-test-1',
      isHarmful: true,
      label: 'ABUSIVE',
      confidence: 0.95,
      scores: { SAFE: 0.05, ABUSIVE: 0.95, HARASSMENT: 0.0, SEXUAL: 0.0, THREAT: 0.0, HATE: 0.0, GROOMING: 0.0 },
      inferenceTimeMs: 12,
      timestamp: Date.now(),
    };

    // Obscure element
    obscureMessage(message, result);
    const parent = bubble.parentElement!;
    expect(parent.querySelector('.shieldsight-message-warning-pill')).not.toBeNull();
    expect(bubble.classList.contains('shieldsight-blurred-text')).toBe(true);

    // Reveal Once element
    restoreMessage(message);
    expect(parent.querySelector('.shieldsight-message-warning-pill')).toBeNull();
    expect(bubble.classList.contains('shieldsight-blurred-text')).toBe(false);
  });

  it('should handle large conversations efficiently (1000+ messages performance test)', async () => {
    const adapter = new GenericConversationAdapter();
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render 1000 message bubbles inside a container
    for (let i = 0; i < 1000; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble';
      bubble.textContent = `message number ${i}`;
      container.appendChild(bubble);
    }

    const startTime = performance.now();
    const discovered = await adapter.discoverMessages(container);
    const duration = performance.now() - startTime;

    expect(discovered.length).toBe(1000);
    // Performance target: scanning 1000 message DOM nodes should be fast
    expect(duration).toBeLessThan(800);

    document.body.removeChild(container);
  });
});
