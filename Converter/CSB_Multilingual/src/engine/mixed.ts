import { analyze } from './lexer';
import type { ComposerSegment, ConversionStatistics, MixedConversionResult, MixedDiagnostic, MixedLexicalToken, SegmentLanguage } from './types';

function literalToken(segment: ComposerSegment, segmentIndex: number, start: number): MixedLexicalToken {
  const text = segment.text.normalize('NFC');
  const length = Array.from(text).length;
  return {
    kind: 'literal', lexeme: text, unicode: text, ruleId: 'mixed:literal',
    span: { start: 0, end: length }, globalSpan: { start, end: start + length },
    segmentId: segment.id, segmentIndex, language: 'literal',
  };
}

export function analyzeMixed(segments: readonly ComposerSegment[]): MixedConversionResult {
  const tokens: MixedLexicalToken[] = [];
  const diagnostics: MixedDiagnostic[] = [];
  let unicode = '';
  let offset = 0;
  const totals: ConversionStatistics = { tokenCount: 0, matchedTokenCount: 0, unknownTokenCount: 0, literalTokenCount: 0, processingTimeMs: 0 };

  segments.forEach((segment, segmentIndex) => {
    const language: SegmentLanguage = segment.language;
    if (language === 'literal') {
      const item = literalToken(segment, segmentIndex, offset);
      tokens.push(item);
      unicode += item.unicode;
      offset += Array.from(item.unicode).length;
      totals.tokenCount += 1;
      totals.literalTokenCount += 1;
      return;
    }

    const result = analyze(segment.text, language);
    result.tokens.forEach((item) => tokens.push({
      ...item, language, segmentId: segment.id, segmentIndex,
      globalSpan: { start: item.span.start + offset, end: item.span.end + offset },
    }));
    result.diagnostics.forEach((item) => diagnostics.push({ ...item, language, segmentId: segment.id, segmentIndex }));
    unicode += result.unicode;
    offset += Array.from(result.normalizedInput).length;
    totals.tokenCount += result.statistics.tokenCount;
    totals.matchedTokenCount += result.statistics.matchedTokenCount;
    totals.unknownTokenCount += result.statistics.unknownTokenCount;
    totals.literalTokenCount += result.statistics.literalTokenCount;
    totals.processingTimeMs += result.statistics.processingTimeMs;
  });

  return { mode: 'mixed', segments, unicode: unicode.normalize('NFC'), tokens, diagnostics, statistics: { ...totals, processingTimeMs: Number(totals.processingTimeMs.toFixed(3)) } };
}
