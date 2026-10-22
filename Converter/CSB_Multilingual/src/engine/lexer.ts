import { languageRules } from './rules';
import { compilePrefixTrie, findLongestMatch } from '../../../../Shared_Lexer/lexer.js';
import type { ConversionResult, Diagnostic, LanguageId, LexicalRule, LexicalToken } from './types';

const tries: Record<LanguageId, ReturnType<typeof compilePrefixTrie>> = {
  singlish: compilePrefixTrie(languageRules.singlish),
  tanglish: compilePrefixTrie(languageRules.tanglish),
  hinglish: compilePrefixTrie(languageRules.hinglish),
};

const punctuation = new Set(Array.from('(){}[]"\',.!?;:/\\@#$%^&*+=<>|~`_-'));

function token(kind: LexicalToken['kind'], lexeme: string, start: number, end: number, ruleId: string, unicode = lexeme): LexicalToken {
  return { kind, lexeme, span: { start, end }, ruleId, unicode };
}

/**
 * Tokenize with maximal munch. Bracketed text is an explicit literal span:
 * [hello@example.com] is copied as hello@example.com without transliteration.
 */
export function analyze(source: string, language: LanguageId): ConversionResult {
  const startedAt = performance.now();
  const normalizedInput = source.normalize('NFC');
  const characters = Array.from(normalizedInput);
  const tokens: LexicalToken[] = [];
  const diagnostics: Diagnostic[] = [];
  const trie = tries[language];
  let position = 0;

  while (position < characters.length) {
    const current = characters[position]!;
    if (current === '[') {
      const close = characters.indexOf(']', position + 1);
      if (close < 0) {
        tokens.push(token('punctuation', current, position, position + 1, 'separator:unfinished-literal'));
        diagnostics.push({ code: 'UNFINISHED_LITERAL', severity: 'warning', span: { start: position, end: position + 1 }, message: 'Opening [ has no closing ]. It was kept as punctuation and following text was remapped normally.' });
        position += 1;
        continue;
      }
      const literal = characters.slice(position + 1, close).join('');
      tokens.push(token('literal', literal, position, close + 1, 'literal:brackets', literal));
      position = close + 1;
      continue;
    }
    if (/\s/u.test(current)) {
      tokens.push(token('whitespace', current, position, position + 1, 'separator:whitespace'));
      position += 1;
      continue;
    }
    const rule = findLongestMatch(trie, characters, position) as LexicalRule | undefined;
    if (rule) {
      const end = position + Array.from(rule.source).length;
      tokens.push(token(rule.kind, rule.source, position, end, rule.ruleId, rule.unicode));
      position = end;
      continue;
    }
    if (punctuation.has(current) || /\d/u.test(current)) {
      tokens.push(token('punctuation', current, position, position + 1, 'separator:punctuation'));
      position += 1;
      continue;
    }
    tokens.push(token('unknown', current, position, position + 1, 'unknown:preserved'));
    diagnostics.push({ code: 'UNKNOWN_SEQUENCE', severity: 'warning', span: { start: position, end: position + 1 }, message: `No ${language} lexical rule matches “${current}”; it was preserved.` });
    position += 1;
  }

  const unicode = tokens.map((item) => item.unicode).join('').normalize('NFC');
  const unknownTokenCount = tokens.filter((item) => item.kind === 'unknown').length;
  const literalTokenCount = tokens.filter((item) => item.kind === 'literal').length;
  return {
    language,
    normalizedInput,
    tokens,
    unicode,
    diagnostics,
    statistics: {
      tokenCount: tokens.length,
      matchedTokenCount: tokens.filter(
        (item) => !['unknown', 'whitespace', 'punctuation', 'literal'].includes(item.kind),
      ).length,
      unknownTokenCount,
      literalTokenCount,
      processingTimeMs: Number((performance.now() - startedAt).toFixed(3)),
    },
  };
}
