import fmAbhayaPythonSource from '../../../fm_abhaya_to_unicode.py?raw';
import type { Diagnostic, LegacyConversionResult, LegacyFontTarget, LegacyLiteralPolicy, LexicalToken, SourceSpan } from './types';

type LegacyRule = readonly [unicode: string, encoded: string];

function decodePythonEscapes(value: string): string {
  return value.replace(/\\u([\dA-Fa-f]{4})|\\(.)/gu, (_match, codePoint: string | undefined, escaped: string | undefined) => {
    if (codePoint) return String.fromCodePoint(Number.parseInt(codePoint, 16));
    return ({ n: '\n', r: '\r', t: '\t', "'": "'", '"': '"', '\\': '\\' } as Record<string, string>)[escaped ?? ''] ?? escaped ?? '';
  });
}

/** Reads the supplied FM Abhaya reference table at build time. The first pair
 * for a Unicode sequence is the documented canonical output for this tool. */
function fmAbhayaRules(): readonly LegacyRule[] {
  const inverse = new Map<string, string>();
  for (const line of fmAbhayaPythonSource.split('\n')) {
    const match = line.match(/^\s*\((['"])(.*?)\1,\s*(['"])(.*?)\3\),?\s*$/u);
    if (!match) continue;
    const encoded = decodePythonEscapes(match[2]!);
    const unicode = decodePythonEscapes(match[4]!);
    if (!inverse.has(unicode)) inverse.set(unicode, encoded);
  }
  return [...inverse.entries()]
    .map(([unicode, encoded]) => [unicode, encoded] as const)
    .sort((left, right) => Array.from(right[0]).length - Array.from(left[0]).length);
}

// Bamini's common base letters and vowel-positioning rules were independently
// reconstructed from public keyboard mapping references. Complex glyph-specific
// u/uu forms are deliberately reported instead of guessed.
const baminiBase: Record<string, string> = {
  'அ': 'm', 'ஆ': 'M', 'இ': ',', 'ஈ': '.', 'உ': 'c', 'ஊ': 'C', 'எ': 'v', 'ஏ': 'V', 'ஐ': 'I', 'ஒ': 'x', 'ஓ': 'X', 'ஔ': 'xs', 'ஃ': '/',
  'க': 'f', 'ங': 'q', 'ச': 'r', 'ஜ': '[', 'ஞ': 'Q', 'ட': 'l', 'ண': 'z', 'த': 'j', 'ந': 'e', 'ன': 'd', 'ப': 'g', 'ம': 'k', 'ய': 'a', 'ர': 'u', 'ல': 'y', 'வ': 't', 'ழ': 'o', 'ள': 's', 'ற': 'w', 'ஷ': '~', 'ஸ': ']', 'ஹ': '}',
};

const baminiSigns: Record<string, string> = { 'ா': 'h', 'ி': 'p', 'ீ': 'P', 'ெ': 'n', 'ே': 'N', 'ை': 'i', '்': ';' };

function encodeBamini(unicode: string): { encodedText: string; unsupported: SourceSpan[] } {
  const characters = Array.from(unicode);
  const unsupported: SourceSpan[] = [];
  let encodedText = '';
  for (let index = 0; index < characters.length; index += 1) {
    const current = characters[index]!;
    const base = baminiBase[current];
    if (!base) {
      if (current === 'ு' || current === 'ூ' || /[\u0B80-\u0BFF]/u.test(current)) unsupported.push({ start: index, end: index + 1 });
      encodedText += current;
      continue;
    }
    const sign = characters[index + 1];
    if (sign === 'ொ' || sign === 'ோ' || sign === 'ௌ') {
      const tail = sign === 'ொ' ? 'h' : sign === 'ோ' ? 'h' : 's';
      const lead = sign === 'ொ' || sign === 'ௌ' ? 'n' : 'N';
      encodedText += `${lead}${base}${tail}`;
      index += 1;
      continue;
    }
    if (sign === 'ு' || sign === 'ூ') {
      unsupported.push({ start: index, end: index + 2 });
      encodedText += `${base}${sign}`;
      index += 1;
      continue;
    }
    if (sign && baminiSigns[sign]) {
      const mapped = baminiSigns[sign]!;
      encodedText += sign === 'ெ' || sign === 'ே' || sign === 'ை' ? `${mapped}${base}` : `${base}${mapped}`;
      index += 1;
      continue;
    }
    encodedText += base;
  }
  return { encodedText, unsupported };
}

const krutiBase: Record<string, string> = {
  'अ': 'v', 'आ': 'vk', 'इ': 'b', 'ई': 'bZ', 'उ': 'm', 'ऊ': 'Å', 'ऋ': '_', 'ए': ',', 'ऐ': ',s', 'ओ': 'vks', 'औ': 'vkS',
  'क': 'd', 'ख': '[k', 'ग': 'x', 'घ': '?', 'ङ': '³', 'च': 'p', 'छ': 'N', 'ज': 't', 'झ': '>', 'ञ': '¥', 'ट': 'V', 'ठ': 'B', 'ड': 'M', 'ढ': '<', 'ण': '.', 'त': 'r', 'थ': 'F', 'द': 'n', 'ध': '/', 'न': 'u', 'प': 'i', 'फ': 'Q', 'ब': 'c', 'भ': 'H', 'म': 'e', 'य': ';', 'र': 'j', 'ल': 'y', 'व': 'o', 'श': "'k", 'ष': '"k', 'स': 'l', 'ह': 'g', 'ळ': 'G',
  'क़': 'd़', 'ख़': '[़', 'ग़': 'x़', 'ज़': 't़', 'ड़': 'M़', 'ढ़': '<़', 'फ़': 'Q', '।': 'A', '॥': 'AA', 'ं': 'a', 'ँ': '¡', 'ः': '%', 'ऽ': '·',
};

const krutiMarks: Record<string, string> = { 'ा': 'k', 'ी': 'h', 'ु': 'q', 'ू': 'w', 'ृ': '`', 'े': 's', 'ै': 'S', 'ो': 'ks', 'ौ': 'kS', '्': '~' };

function encodeKrutiDev(unicode: string): { encodedText: string; unsupported: SourceSpan[] } {
  const characters = Array.from(unicode);
  const unsupported: SourceSpan[] = [];
  let encodedText = '';
  for (let index = 0; index < characters.length; index += 1) {
    // Reph is stored after its following consonant cluster in Kruti Dev.
    const current = characters[index]!;
    const next = characters[index + 1];
    const afterNext = characters[index + 2];
    const afterMark = characters[index + 3];
    if (current === 'र' && next === '्' && afterNext && krutiBase[afterNext]) {
      const base = krutiBase[afterNext]!;
      const mark = afterMark ? krutiMarks[afterMark] ?? '' : '';
      encodedText += `${afterMark === 'ि' ? 'f' : ''}${base}${afterMark === 'ि' ? '' : mark}Z`;
      index += afterMark && krutiMarks[afterMark] ? 3 : 2;
      continue;
    }
    const base = krutiBase[current];
    if (!base) {
      if (/[\u0900-\u097F]/u.test(current)) unsupported.push({ start: index, end: index + 1 });
      encodedText += current;
      continue;
    }
    const mark = next;
    if (mark === 'ि') {
      encodedText += `f${base}`;
      index += 1;
      continue;
    }
    if (mark && krutiMarks[mark]) {
      encodedText += `${base}${krutiMarks[mark]!}`;
      index += 1;
      continue;
    }
    encodedText += base;
  }
  return { encodedText, unsupported };
}

function encodeWithRules(unicode: string, rules: readonly LegacyRule[]): { encodedText: string; unsupported: SourceSpan[] } {
  const characters = Array.from(unicode);
  let encodedText = '';
  const unsupported: SourceSpan[] = [];
  for (let index = 0; index < characters.length;) {
    const match = rules.find(([value]) => characters.slice(index, index + Array.from(value).length).join('') === value);
    if (match) {
      encodedText += match[1];
      index += Array.from(match[0]).length;
      continue;
    }
    const current = characters[index]!;
    if (/[\u0D80-\u0DFF]/u.test(current)) unsupported.push({ start: index, end: index + 1 });
    encodedText += current;
    index += 1;
  }
  return { encodedText, unsupported };
}

function diagnosticsFor(target: LegacyFontTarget, unsupported: readonly SourceSpan[]): Diagnostic[] {
  return unsupported.map((span) => ({ code: 'UNMAPPABLE_LEGACY_SEQUENCE', severity: 'warning' as const, span, message: `This Unicode sequence has no safe ${target} legacy-font mapping and was preserved.` }));
}

export interface LegacyEncodeOptions {
  literalPolicy?: LegacyLiteralPolicy;
  tokens?: readonly LexicalToken[];
}

/**
 * Encodes post-lexical Unicode. When tokens are supplied, literal spans can be
 * retained verbatim or replaced with one neutral space for legacy-font files.
 */
export function encodeLegacy(unicode: string, target: LegacyFontTarget, options: LegacyEncodeOptions = {}): LegacyConversionResult {
  const literalPolicy = options.literalPolicy ?? 'preserve';
  const preparedUnicode = options.tokens
    ? options.tokens.map((item) => item.kind === 'literal' && literalPolicy === 'space' ? ' ' : item.unicode).join('').normalize('NFC')
    : unicode;
  const encoded = target === 'fm-abhaya'
    ? encodeWithRules(preparedUnicode, fmAbhayaRules())
    : target === 'bamini'
      ? encodeBamini(preparedUnicode)
      : encodeKrutiDev(preparedUnicode);
  return { target, encodedText: encoded.encodedText, diagnostics: diagnosticsFor(target, encoded.unsupported) };
}

export const legacyTargetLabels: Record<LegacyFontTarget, string> = {
  'fm-abhaya': 'FM Abhaya',
  bamini: 'Bamini',
  'kruti-dev-010': 'Kruti Dev 010',
};
