import { hindiPatternMap } from '../engines/hindi-mapping.js';
import { sinhalaPatternMap } from '../engines/sinhala-input.js';
import { tamilPatternMap } from '../engines/tamil-mapping.js';
import type { LanguageId, LexicalRule } from './types';

type PatternMap = Record<string, string>;

function inferKind(source: string, unicode: string): LexicalRule['kind'] {
  if (source.startsWith('#')) return 'native-digit';
  if (/^[aAiIuUeEoOāīūēōṛṝ]/u.test(source) && source.length <= 3) return 'phonetic-vowel';
  if (/\p{M}|්|்|्/u.test(unicode)) return unicode.length > 2 || /(?:kr|tr|shr|ksh|gy|zh|ng|nj|chh)/iu.test(source) ? 'cluster' : 'consonant-vowel-unit';
  if (/^[xXzZHqQM~'.|]+$/u.test(source)) return 'sign';
  return source.length > 2 ? 'consonant-vowel-unit' : 'consonant';
}

function toRules(language: LanguageId, map: PatternMap): readonly LexicalRule[] {
  return Object.entries(map)
    .map(([source, unicode]) => ({
      source,
      unicode,
      ruleId: `${language}:${source}`,
      kind: inferKind(source, unicode),
    }))
    .sort((left, right) => right.source.length - left.source.length || left.source.localeCompare(right.source));
}

export const languageRules: Record<LanguageId, readonly LexicalRule[]> = {
  singlish: toRules('singlish', sinhalaPatternMap),
  tanglish: toRules('tanglish', tamilPatternMap),
  hinglish: toRules('hinglish', hindiPatternMap),
};
