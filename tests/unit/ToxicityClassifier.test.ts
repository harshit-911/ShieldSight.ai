import { describe, it, expect } from 'vitest';
import { ToxicityClassifier } from '../../src/services/ai/ToxicityClassifier';
import { DiscoveredTextBlock } from '../../src/types/text';

describe('ToxicityClassifier Unit Tests', () => {
  const classifier = new ToxicityClassifier();

  it('should classify safe text as SAFE', async () => {
    const block: DiscoveredTextBlock = {
      id: 'text-1',
      element: document.createElement('p'),
      text: 'The weather today is warm and sunny.',
      timestamp: Date.now(),
    };

    const result = await classifier.classify(block);
    expect(result.isHarmful).toBe(false);
    expect(result.label).toBe('SAFE');
  });

  it('should classify abusive text as ABUSIVE', async () => {
    const block: DiscoveredTextBlock = {
      id: 'text-2',
      element: document.createElement('p'),
      text: 'Fuck off you piece of trash.',
      timestamp: Date.now(),
    };

    const result = await classifier.classify(block);
    expect(result.isHarmful).toBe(true);
    expect(result.label).toBe('ABUSIVE');
  });

  it('should classify threat text as THREAT', async () => {
    const block: DiscoveredTextBlock = {
      id: 'text-3',
      element: document.createElement('p'),
      text: 'I will find you and kill you.',
      timestamp: Date.now(),
    };

    const result = await classifier.classify(block);
    expect(result.isHarmful).toBe(true);
    expect(result.label).toBe('THREAT');
  });

  it('should classify harassment text as HARASSMENT', async () => {
    const block: DiscoveredTextBlock = {
      id: 'text-4',
      element: document.createElement('p'),
      text: 'Stop posting, you are worthless trash.',
      timestamp: Date.now(),
    };

    const result = await classifier.classify(block);
    expect(result.isHarmful).toBe(true);
    expect(result.label).toBe('HARASSMENT');
  });

  it('should classify inflected abusive variations and grooming patterns', async () => {
    // 1. Inflected abusive
    const blockAbusive: DiscoveredTextBlock = {
      id: 'text-5',
      element: document.createElement('p'),
      text: 'This is fucking ridiculous.',
      timestamp: Date.now(),
    };
    const resultAbusive = await classifier.classify(blockAbusive);
    expect(resultAbusive.isHarmful).toBe(true);
    expect(resultAbusive.label).toBe('ABUSIVE');

    // 2. Grooming
    const blockGrooming: DiscoveredTextBlock = {
      id: 'text-6',
      element: document.createElement('p'),
      text: 'Hey sweetheart how old r u?',
      timestamp: Date.now(),
    };
    const resultGrooming = await classifier.classify(blockGrooming);
    expect(resultGrooming.isHarmful).toBe(true);
    expect(resultGrooming.label).toBe('GROOMING');

    // 3. Explicit song words (nigga, motherfucking)
    const blockSong: DiscoveredTextBlock = {
      id: 'text-7',
      element: document.createElement('p'),
      text: 'A young nigga got it bad cause of motherfucking rules.',
      timestamp: Date.now(),
    };
    const resultSong = await classifier.classify(blockSong);
    expect(resultSong.isHarmful).toBe(true);
    expect(resultSong.label).toBe('HATE');
  });

  it('should normalize and classify obfuscated Hinglish / Romanized Hindi inputs', async () => {
    // Leetspeak & character substitution Hinglish
    const block1: DiscoveredTextBlock = {
      id: 'text-h1',
      element: document.createElement('p'),
      text: 'tu mera b c h d hai',
      timestamp: Date.now(),
    };
    const res1 = await classifier.classify(block1);
    expect(res1.isHarmful).toBe(true);
    expect(res1.label).toBe('ABUSIVE');

    // Repeated letters & leetspeak
    const block2: DiscoveredTextBlock = {
      id: 'text-h2',
      element: document.createElement('p'),
      text: 'chuuuutiyaaa mat ban',
      timestamp: Date.now(),
    };
    const res2 = await classifier.classify(block2);
    expect(res2.isHarmful).toBe(true);
    expect(res2.label).toBe('ABUSIVE');

    // Threat in Romanized Hindi
    const block3: DiscoveredTextBlock = {
      id: 'text-h3',
      element: document.createElement('p'),
      text: 'bhai mai tujhe jaan se maar dunga',
      timestamp: Date.now(),
    };
    const res3 = await classifier.classify(block3);
    expect(res3.isHarmful).toBe(true);
    expect(res3.label).toBe('THREAT');
  });
});
