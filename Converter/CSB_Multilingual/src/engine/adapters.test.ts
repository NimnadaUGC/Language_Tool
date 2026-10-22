import { describe, expect, it } from 'vitest';
import { adapters } from './adapters';

describe('CSB conversion adapters', () => {
  it('uses the current Singlish v1.5 mapping without DOM initialization', () => {
    expect(adapters.singlish.convert('mama')).toBe('මම');
    expect(adapters.singlish.convert('oyaata')).toBe('ඔයාට');
  });

  it('uses the authoritative Tanglish and Hinglish mappings', () => {
    expect(adapters.tanglish.convert('thamizh')).toBe('தமிழ்');
    expect(adapters.hinglish.convert('namaste')).toBe('नमस्ते');
  });

  it('keeps unknown characters rather than dropping user input', () => {
    expect(adapters.singlish.convert('@')).toBe('@');
    expect(adapters.tanglish.convert('@')).toBe('@');
    expect(adapters.hinglish.convert('@')).toBe('@');
  });
});
