export type LanguageId = 'singlish' | 'tanglish' | 'hinglish';

export type WritingMode = LanguageId | 'mixed';
export type SegmentLanguage = LanguageId | 'literal';
export type LegacyLiteralPolicy = 'preserve' | 'space';

export type TokenKind =
  | 'phonetic-vowel'
  | 'consonant'
  | 'consonant-vowel-unit'
  | 'cluster'
  | 'sign'
  | 'native-digit'
  | 'whitespace'
  | 'punctuation'
  | 'literal'
  | 'unknown';

export interface SourceSpan {
  /** Zero-based Unicode code-point offsets, displayed as 1-based positions in the UI. */
  start: number;
  end: number;
}

export interface LexicalToken {
  kind: TokenKind;
  lexeme: string;
  span: SourceSpan;
  ruleId: string;
  unicode: string;
}

export interface Diagnostic {
  code: 'UNKNOWN_SEQUENCE' | 'UNCLOSED_LITERAL' | 'UNFINISHED_LITERAL' | 'UNMAPPABLE_LEGACY_SEQUENCE';
  severity: 'warning';
  span: SourceSpan;
  message: string;
}

export interface ConversionStatistics {
  tokenCount: number;
  matchedTokenCount: number;
  unknownTokenCount: number;
  literalTokenCount: number;
  processingTimeMs: number;
}

export interface ConversionResult {
  language: LanguageId;
  normalizedInput: string;
  tokens: readonly LexicalToken[];
  unicode: string;
  diagnostics: readonly Diagnostic[];
  statistics: ConversionStatistics;
}

/** A deliberate language run in the Mixed Writing composer. */
export interface ComposerSegment {
  id: string;
  language: SegmentLanguage;
  text: string;
}

export interface MixedLexicalToken extends LexicalToken {
  segmentId: string;
  segmentIndex: number;
  language: SegmentLanguage;
  /** Offset within the conceptual concatenation of all composer segments. */
  globalSpan: SourceSpan;
}

export interface MixedDiagnostic extends Diagnostic {
  segmentId: string;
  segmentIndex: number;
  language: SegmentLanguage;
}

export interface MixedConversionResult {
  mode: 'mixed';
  segments: readonly ComposerSegment[];
  unicode: string;
  tokens: readonly MixedLexicalToken[];
  diagnostics: readonly MixedDiagnostic[];
  statistics: ConversionStatistics;
}

export type LegacyFontTarget = 'fm-abhaya' | 'bamini' | 'kruti-dev-010';

export interface LegacyConversionResult {
  target: LegacyFontTarget;
  encodedText: string;
  diagnostics: readonly Diagnostic[];
}

export interface LexicalRule {
  source: string;
  unicode: string;
  ruleId: string;
  kind: Exclude<TokenKind, 'whitespace' | 'punctuation' | 'literal' | 'unknown'>;
}
