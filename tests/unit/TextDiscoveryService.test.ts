import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextDiscoveryService } from '../../src/services/text/TextDiscoveryService';

describe('TextDiscoveryService Unit Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should discover visible paragraphs and text blocks', () => {
    const service = new TextDiscoveryService();
    const listener = vi.fn();
    service.onDiscovered(listener);

    const p = document.createElement('p');
    p.textContent = 'This is a sample paragraph for text discovery testing.';
    document.body.appendChild(p);

    service.start();

    expect(listener).toHaveBeenCalled();
    const discovered = listener.mock.calls[0][0];
    expect(discovered.text).toBe('This is a sample paragraph for text discovery testing.');
  });

  it('should ignore script, style, nav, and hidden elements', () => {
    const service = new TextDiscoveryService();
    const listener = vi.fn();
    service.onDiscovered(listener);

    const script = document.createElement('script');
    script.textContent = 'var secret = "ignore script tags";';

    const nav = document.createElement('nav');
    const navItem = document.createElement('p');
    navItem.textContent = 'Home Navigation Link';
    nav.appendChild(navItem);

    document.body.appendChild(script);
    document.body.appendChild(nav);

    service.start();

    expect(listener).not.toHaveBeenCalled();
  });
});
