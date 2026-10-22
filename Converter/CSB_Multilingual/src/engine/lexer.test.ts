import { describe, expect, it } from 'vitest';
import { analyze, analyzeMixed, encodeLegacy, languageRules } from './index';
import type { LanguageId } from './types';

const languages: readonly LanguageId[] = ['singlish', 'tanglish', 'hinglish'];

const phraseCorpora: Record<LanguageId, readonly string[]> = {
  singlish: ['mama', 'oya', 'api', 'gedara', 'amma', 'thaththa', 'aayuboowan', 'suba', 'dawasak', 'hari', 'kohomada', 'hondai', 'oyata', 'mata', 'api yamu', 'sri lanka', 'pahala', 'udeta', 'raatriye', 'pusthakaya', 'iskole', 'panthiye', 'lamai', 'watura', 'kaema'],
  tanglish: ['thamizh', 'vanakkam', 'eppadi', 'nalla', 'amma', 'appaa', 'naan', 'nee', 'indru', 'naalai', 'veedu', 'palli', 'putthagam', 'kadal', 'kaadhal', 'paadal', 'azhagu', 'chennai', 'madurai', 'kovil', 'mazhai', 'thottam', 'vaNakkam', 'tamil mozhi', 'sri lanka'],
  hinglish: ['namaste', 'kaise', 'shakti', 'rang', 'bharat', 'hindi', 'namaskar', 'aap', 'tum', 'mera', 'dost', 'ghar', 'paani', 'kitaab', 'school', 'subah', 'raat', 'sundar', 'achha', 'dhanyavaad', 'kripaya', 'bharatiya', 'shree', 'pranaam', 'kaise ho'],
};

describe('compiled lexical analyzer', () => {
  for (const language of languages) {
    it(`recognizes every declared ${language} rule with its own Unicode rendering`, () => {
      const declaredRules = languageRules[language];
      expect(declaredRules.length).toBeGreaterThanOrEqual(75);
      for (const rule of declaredRules) {
        const result = analyze(rule.source, language);
        expect(result.unicode, rule.source).toBe(rule.unicode);
        expect(result.tokens).toHaveLength(1);
        expect(result.tokens[0]?.ruleId).toBe(rule.ruleId);
      }
    });

    it(`converts the 25-item ${language} evaluation corpus without unmatched lexical input`, () => {
      const corpus = phraseCorpora[language];
      expect(corpus).toHaveLength(25);
      for (const phrase of corpus) {
        const result = analyze(phrase, language);
        expect(result.diagnostics.filter((item) => item.code === 'UNKNOWN_SEQUENCE'), phrase).toHaveLength(0);
        expect(result.unicode).not.toBe(phrase);
      }
    });
  }

  it('applies longest-match rules and exposes the selected rule in the trace', () => {
    const tamil = analyze('thamizh', 'tanglish');
    const hindi = analyze('namaste', 'hinglish');
    expect(tamil.unicode).toBe('தமிழ்');
    expect(tamil.tokens.some((item) => item.lexeme === 'zh')).toBe(true);
    expect(hindi.unicode).toBe('नमस्ते');
    expect(hindi.tokens.some((item) => item.ruleId.startsWith('hinglish:'))).toBe(true);
  });

  it('preserves punctuation, whitespace, normal digits, and explicit literal spans', () => {
    const result = analyze('mama [https://example.com] (42)!', 'singlish');
    expect(result.unicode).toBe('මම https://example.com (42)!');
    expect(result.tokens.find((item) => item.kind === 'literal')?.unicode).toBe('https://example.com');
    expect(result.diagnostics).toHaveLength(0);
  });

  it('remaps text after an unclosed literal marker and returns a useful diagnostic', () => {
    const result = analyze('mama [oya', 'singlish');
    expect(result.unicode).toBe('මම [ඔය');
    expect(result.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'UNFINISHED_LITERAL' })]));
  });

  it('preserves unmatched source and identifies it as unknown', () => {
    const result = analyze('mama €', 'singlish');
    expect(result.unicode).toBe('මම €');
    expect(result.diagnostics).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'UNKNOWN_SEQUENCE' })]));
  });

  it('normalizes Unicode output and supplies stable source spans', () => {
    const result = analyze('kaise ho', 'hinglish');
    expect(result.unicode).toBe(result.unicode.normalize('NFC'));
    expect(result.tokens[0]?.span).toEqual({ start: 0, end: 3 });
    expect(result.unicode).toBe('कैसे हो');
  });
});

describe('mixed writing analysis', () => {
  it('concatenates explicit Sinhala, Tamil, Hindi, and literal segments in order', () => {
    const result = analyzeMixed([
      { id: 'si', language: 'singlish', text: 'mama ' },
      { id: 'ta', language: 'tanglish', text: 'thamizh ' },
      { id: 'hi', language: 'hinglish', text: 'namaste ' },
      { id: 'literal', language: 'literal', text: 'https://example.com' },
    ]);
    expect(result.unicode).toBe('මම தமிழ் नमस्ते https://example.com');
    expect(result.tokens.some((item) => item.language === 'literal' && item.unicode === 'https://example.com')).toBe(true);
    expect(result.tokens.some((item) => item.language === 'tanglish')).toBe(true);
    expect(result.statistics.literalTokenCount).toBe(1);
  });

  it('keeps diagnostics attached to the segment that produced them', () => {
    const result = analyzeMixed([{ id: 'si', language: 'singlish', text: 'mama €' }]);
    expect(result.diagnostics[0]).toMatchObject({ code: 'UNKNOWN_SEQUENCE', segmentId: 'si', language: 'singlish' });
  });
});

describe('legacy-font post-processing', () => {
  it('builds FM Abhaya output from the supplied local mapping table', () => {
    expect(encodeLegacy('ක', 'fm-abhaya').encodedText).toBe('l');
  });

  it('handles representative Bamini ordering and reports unsupported Tamil forms', () => {
    expect(encodeLegacy('தமிழ்', 'bamini').encodedText).toBe('jkpo;');
    expect(encodeLegacy('கு', 'bamini').diagnostics).toHaveLength(1);
  });

  it('handles Kruti Dev i-matra ordering and reports unsupported Devanagari', () => {
    expect(encodeLegacy('कि', 'kruti-dev-010').encodedText).toBe('fd');
    expect(encodeLegacy('ॡ', 'kruti-dev-010').diagnostics).toHaveLength(1);
  });

  it('supports preserving or replacing literal spans before legacy encoding', () => {
    const result = analyze('mama [English]', 'singlish');
    const preserved = encodeLegacy(result.unicode, 'fm-abhaya', { tokens: result.tokens, literalPolicy: 'preserve' });
    const replaced = encodeLegacy(result.unicode, 'fm-abhaya', { tokens: result.tokens, literalPolicy: 'space' });
    expect(preserved.encodedText).toContain('English');
    expect(replaced.encodedText).not.toContain('English');
    expect(replaced.encodedText).toContain(' ');
  });
});
