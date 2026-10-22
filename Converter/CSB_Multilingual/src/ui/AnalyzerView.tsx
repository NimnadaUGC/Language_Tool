import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong, faChevronLeft, faChevronRight, faCircleExclamation, faCodeBranch, faFilter } from '@fortawesome/free-solid-svg-icons';
import type { ConversionResult, MixedConversionResult } from '../engine/types';

type AnalyzerResult = ConversionResult | MixedConversionResult;
const pageSize = 16;

export function AnalyzerView({ analysis }: { analysis: AnalyzerResult }) {
  const [rulesOnly, setRulesOnly] = useState(false);
  const [page, setPage] = useState(1);
  const fallbackLanguage = 'language' in analysis ? (analysis as ConversionResult).language : 'mixed';
  const tokens = rulesOnly ? analysis.tokens.filter((item) => !['whitespace', 'punctuation', 'literal'].includes(item.kind)) : analysis.tokens;
  const pageCount = Math.max(1, Math.ceil(tokens.length / pageSize));
  const visibleTokens = tokens.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => setPage(1), [analysis.tokens, rulesOnly]);
  return <section className="view-card analyzer-view"><header className="view-heading"><div><span className="eyebrow">LEXICAL ANALYSIS</span><h2><FontAwesomeIcon icon={faCodeBranch} /> Greedy token trace</h2></div><p>Each position consumes the longest valid rule from the compiled prefix trie. Filter separators to focus on language rules.</p></header>
    <div className="stat-grid"><span><b>{analysis.statistics.tokenCount}</b> Tokens</span><span><b>{analysis.statistics.matchedTokenCount}</b> Matched rules</span><span><b>{analysis.statistics.literalTokenCount}</b> Literal spans</span><span><b>{analysis.statistics.unknownTokenCount}</b> Warnings</span></div>
    {analysis.diagnostics.length > 0 && <aside className="diagnostics"><b><FontAwesomeIcon icon={faCircleExclamation} /> Diagnostics</b>{analysis.diagnostics.map((item, index) => <p key={`${item.code}-${index}`}><code>{item.code}</code> · positions {item.span.start + 1}–{item.span.end}: {item.message}</p>)}</aside>}
    <div className="trace-controls"><button className={rulesOnly ? '' : 'active'} onClick={() => setRulesOnly(false)}><FontAwesomeIcon icon={faFilter} /> All tokens</button><button className={rulesOnly ? 'active' : ''} onClick={() => setRulesOnly(true)}>Rules only</button><span>{tokens.length} visible entries</span></div>
    <div className="trace-wrap"><table><thead><tr><th>#</th><th>Language</th><th>Span</th><th>Lexeme</th><th>Class</th><th>Longest-match rule</th><th>Unicode</th></tr></thead><tbody>{visibleTokens.length ? visibleTokens.map((item, index) => <tr key={`${item.ruleId}-${index}`}><td>{(page - 1) * pageSize + index + 1}</td><td>{'language' in item ? (item as { language: string }).language : fallbackLanguage}</td><td>{item.span.start + 1}–{item.span.end}</td><td><code>{item.lexeme || '∅'}</code></td><td>{item.kind}</td><td><code>{item.ruleId}</code></td><td><FontAwesomeIcon className="trace-arrow" icon={faArrowRightLong} /> {item.unicode || '∅'}</td></tr>) : <tr><td colSpan={7}>Start writing to see the lexical trace.</td></tr>}</tbody></table></div>
    <footer className="pagination trace-pagination"><span>{tokens.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, tokens.length)} of {tokens.length}</span><div><button aria-label="Previous analysis page" disabled={page === 1} onClick={() => setPage((value) => value - 1)}><FontAwesomeIcon icon={faChevronLeft} /> Previous</button><b>Page {page} / {pageCount}</b><button aria-label="Next analysis page" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>Next <FontAwesomeIcon icon={faChevronRight} /></button></div></footer>
  </section>;
}
