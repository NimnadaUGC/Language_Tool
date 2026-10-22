import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong, faArrowRotateRight, faBolt, faBookOpen, faChevronLeft, faChevronRight, faLayerGroup, faMagnifyingGlass, faShieldHalved, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { encodeLegacy, languageRules, legacyTargetLabels } from '../engine';
import type { LanguageId, LexicalRule } from '../engine/types';

const pageSize = 18;
const languageLabels: Record<LanguageId, string> = { singlish: 'Singlish · Sinhala', tanglish: 'Tanglish · Tamil', hinglish: 'Hinglish · Hindi' };
const languageImages: Record<LanguageId, string> = { singlish: '/assets/singlish_trans.png', tanglish: '/assets/tanglish_trans.png', hinglish: '/assets/hinglish_trans.png' };
const legacyTargetForLanguage = { singlish: 'fm-abhaya', tanglish: 'bamini', hinglish: 'kruti-dev-010' } as const;
type CategoryId = 'all' | 'primary' | 'vowels' | 'consonants' | 'units' | 'clusters' | 'signs' | 'digits';
const categories: readonly { id: CategoryId; label: string; matches: (rule: LexicalRule) => boolean }[] = [
  { id: 'all', label: 'All rules', matches: () => true },
  { id: 'primary', label: 'Primary rules', matches: (rule) => rule.kind === 'phonetic-vowel' || rule.kind === 'consonant' },
  { id: 'vowels', label: 'Vowels', matches: (rule) => rule.kind === 'phonetic-vowel' },
  { id: 'consonants', label: 'Consonants', matches: (rule) => rule.kind === 'consonant' },
  { id: 'units', label: 'Vowel units', matches: (rule) => rule.kind === 'consonant-vowel-unit' },
  { id: 'clusters', label: 'Clusters', matches: (rule) => rule.kind === 'cluster' },
  { id: 'signs', label: 'Signs', matches: (rule) => rule.kind === 'sign' },
  { id: 'digits', label: 'Digits', matches: (rule) => rule.kind === 'native-digit' },
];

export function MappingsView({ language }: { language: LanguageId }) {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>(language);
  const [category, setCategory] = useState<CategoryId>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => { setSelectedLanguage(language); }, [language]);
  useEffect(() => { setPage(1); }, [selectedLanguage, category, query]);
  const activeCategory = categories.find((item) => item.id === category)!;
  const rules = useMemo(() => languageRules[selectedLanguage].filter((rule) => activeCategory.matches(rule) && `${rule.source} ${rule.unicode} ${rule.ruleId}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [activeCategory, query, selectedLanguage]);
  const pageCount = Math.max(1, Math.ceil(rules.length / pageSize));
  const pageRules = rules.slice((page - 1) * pageSize, page * pageSize);
  const first = rules.length ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(page * pageSize, rules.length);
  const legacyTarget = legacyTargetForLanguage[selectedLanguage];

  return <section className="view-card mappings-view"><header className="view-heading"><div><span className="eyebrow">RULE CATALOGUE</span><h2><FontAwesomeIcon icon={faBookOpen} /> Unicode and legacy mapping reference</h2></div><p>Browse the rules implemented by this tool. Greedy priority is preserved, and legacy status reports current encoder support.</p></header>
    <div className="mapping-language-tabs" role="tablist" aria-label="Mapping language">{(Object.keys(languageLabels) as LanguageId[]).map((id) => <button key={id} role="tab" aria-selected={selectedLanguage === id} className={`mode-${id} ${selectedLanguage === id ? 'active' : ''}`} onClick={() => setSelectedLanguage(id)}><img src={languageImages[id]} alt="" aria-hidden="true" /><span>{languageLabels[id]}<small>{languageRules[id].length.toLocaleString()} rules</small></span></button>)}</div>
    <div className="mapping-toolbar"><label className="mapping-search"><FontAwesomeIcon icon={faMagnifyingGlass} /><span className="sr-only">Search mapping rules</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Roman input, Unicode, or rule ID" /></label><div className="mapping-count"><FontAwesomeIcon icon={faLayerGroup} /><b>{rules.length.toLocaleString()}</b> matching rules</div></div>
    <div className="category-strip" role="tablist" aria-label="Mapping category">{categories.map((item) => <button key={item.id} role="tab" aria-selected={category === item.id} className={category === item.id ? 'active' : ''} onClick={() => setCategory(item.id)}>{item.label}<small>{languageRules[selectedLanguage].filter(item.matches).length}</small></button>)}</div>
    <div className="mapping-grid" aria-label="Paginated mapping rules">{pageRules.map((rule) => { const status = encodeLegacy(rule.unicode, legacyTarget); const priority = languageRules[selectedLanguage].indexOf(rule) + 1; return <article className="mapping-rule" key={rule.ruleId}><header><span>Priority {priority}</span><span className={status.diagnostics.length ? 'status-partial' : 'status-supported'}><FontAwesomeIcon icon={faShieldHalved} /> {status.diagnostics.length ? 'Partial legacy support' : 'Legacy supported'}</span></header><div className="rule-pair"><code>{rule.source}</code><FontAwesomeIcon icon={faArrowRightLong} /><strong>{rule.unicode}</strong></div><footer><span>{rule.kind}</span><code>{rule.ruleId}</code></footer></article>; })}</div>
    {rules.length === 0 && <p className="empty-state">No implemented rules match this search. Try a different language, category, or search term.</p>}
    <footer className="pagination"><span>{first}–{last} of {rules.length.toLocaleString()} rules</span><div><button aria-label="Previous mapping page" disabled={page === 1} onClick={() => setPage((value) => value - 1)}><FontAwesomeIcon icon={faChevronLeft} /> Previous</button><b>Page {page} / {pageCount}</b><button aria-label="Next mapping page" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>Next <FontAwesomeIcon icon={faChevronRight} /></button></div><small>Legacy target: {legacyTargetLabels[legacyTarget]}</small></footer>
    <section className="mapping-explainer" aria-labelledby="mapping-explainer-title"><header><span className="eyebrow">IMPLEMENTATION NOTES</span><h3 id="mapping-explainer-title">How the mapping system works</h3><p>This catalogue documents the deterministic rules used by the lexer and the two editor execution strategies.</p></header><div className="mapping-explainer-grid"><article><FontAwesomeIcon icon={faLayerGroup} /><h4>Greedy rule selection</h4><p>The lexer scans left to right and gives the longest applicable Romanized sequence priority. The displayed priority identifies the ordered rule set used to resolve overlapping candidates consistently.</p></article><article><FontAwesomeIcon icon={faBolt} /><h4>Live mapping</h4><p>Each Romanized edit reruns lexical analysis for the active input. The Unicode pane is therefore a fresh, read-only rendering of the current source.</p></article><article><FontAwesomeIcon icon={faStopwatch} /><h4>Buffered mapping</h4><p>A paused key chunk is mapped into the editable Unicode document. Its Romanized source is kept alongside it, with middle insertions and deletions tracked at the corresponding source position.</p></article><article><FontAwesomeIcon icon={faArrowRotateRight} /><h4>General remap and legacy output</h4><p>Remap now recomputes from the complete saved Romanized source and can replace manual Unicode edits. Unicode is the primary output; legacy encoding is a separate target-specific stage with support warnings.</p></article></div><p className="mapping-explainer-note"><b>Literal spans:</b> bracketed source such as <code>[email@example.com]</code> is preserved as literal text instead of being interpreted as a language rule.</p></section>
  </section>;
}
