import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { adapters } from '../engine/adapters';
import type { ComposerSegment, SegmentLanguage } from '../engine';
import type { TypingSpeed } from '../types';
import { BufferedUnicodeEditor } from './BufferedUnicodeEditor';
import type { BufferedDocument } from './BufferedUnicodeEditor';

const labels: Record<SegmentLanguage, string> = { singlish: 'සිංහල', tanglish: 'தமிழ்', hinglish: 'हिंदी', literal: 'Literal' };
const EnglishLabels: Record<SegmentLanguage, string> = { singlish: 'Sinhala', tanglish: 'Tamil', hinglish: 'Hindi', literal: 'Literal' };

export type BufferedComposerSegment = { id: string; language: SegmentLanguage; source: string; unicode: string };

function SourcePanel({ source }: { source: string }) {
  return <label className="buffered-source-panel"><span>Romanized remap source <small>Read-only</small></span><textarea readOnly value={source} aria-label="Romanized remap source" /></label>;
}

function LiveSegmentEditor({ segment, index, allowRemove, languageMenu, onChange, onRemove }: { segment: ComposerSegment; index: number; allowRemove: boolean; languageMenu: boolean; onChange: (id: string, change: Partial<Pick<ComposerSegment, 'language' | 'text'>>) => void; onRemove: (id: string) => void; }) {
  const allowedLanguages: SegmentLanguage[] = allowRemove ? ['singlish', 'tanglish', 'hinglish', 'literal'] : ['singlish', 'tanglish', 'hinglish'];
  return <article className={`mixed-segment ${segment.language}`}>
    {(languageMenu || allowRemove) && <div className="segment-toolbar">{languageMenu && <label><FontAwesomeIcon icon={faLanguage} /><span className="sr-only">Language for segment {index + 1}</span><select value={segment.language} onChange={(event) => onChange(segment.id, { language: event.target.value as SegmentLanguage })}>{allowedLanguages.map((id) => <option value={id} key={id}>{labels[id]} — {EnglishLabels[id]}</option>)}</select></label>}{allowRemove && <button className="icon-button quiet" aria-label={`Remove ${EnglishLabels[segment.language]} segment`} data-tooltip={`Remove ${EnglishLabels[segment.language]} segment`} onClick={() => onRemove(segment.id)} disabled={index === 0}><FontAwesomeIcon icon={faTrashCan} /></button>}</div>}
    <textarea value={segment.text} onChange={(event) => onChange(segment.id, { text: event.target.value })} spellCheck={false} aria-label={`${EnglishLabels[segment.language]} segment text`} placeholder={`Romanized ${EnglishLabels[segment.language]} text`} />
  </article>;
}

function BufferedSegmentEditor({ segment, index, allowRemove, languageMenu, speed, onChange, onLanguageChange, onRemove, onPendingChange }: { segment: BufferedComposerSegment; index: number; allowRemove: boolean; languageMenu: boolean; speed: TypingSpeed; onChange: (id: string, document: BufferedDocument) => void; onLanguageChange: (id: string, language: SegmentLanguage) => void; onRemove: (id: string) => void; onPendingChange: (pending: boolean) => void; }) {
  const allowedLanguages: SegmentLanguage[] = ['singlish', 'tanglish', 'hinglish', 'literal'];
  const literalAdapter = { ...adapters.singlish, convert: (value: string) => value };
  const adapter = segment.language === 'literal' ? literalAdapter : adapters[segment.language];
  return <article className={`mixed-segment buffered-segment ${segment.language}`}>
    {(languageMenu || allowRemove) && <div className="segment-toolbar">{languageMenu && <label><FontAwesomeIcon icon={faLanguage} /><span className="sr-only">Language for segment {index + 1}</span><select value={segment.language} onChange={(event) => onLanguageChange(segment.id, event.target.value as SegmentLanguage)}>{allowedLanguages.map((id) => <option value={id} key={id}>{labels[id]} — {EnglishLabels[id]}</option>)}</select></label>}{allowRemove && <button className="icon-button quiet" aria-label={`Remove ${EnglishLabels[segment.language]} segment`} data-tooltip={`Remove ${EnglishLabels[segment.language]} segment`} onClick={() => onRemove(segment.id)} disabled={index === 0}><FontAwesomeIcon icon={faTrashCan} /></button>}</div>}
    <label className="buffered-unicode-field"><span>Unicode section</span><BufferedUnicodeEditor document={{ source: segment.source, unicode: segment.unicode }} adapter={adapter} speed={speed} identitySource={segment.language === 'literal'} label={`${EnglishLabels[segment.language]} Unicode section`} placeholder="Type Romanized text or edit Unicode directly…" onDocumentChange={(document) => onChange(segment.id, document)} onPendingChange={onPendingChange} /></label>
    <SourcePanel source={segment.source} />
  </article>;
}

export function MixedComposer({ entryMode, inputMode, speed, segments, bufferedSegments, onEntryModeChange, onChange, onBufferedChange, onBufferedLanguageChange, onSingleLanguageRequest, onAdd, onRemove, onPendingChange }: {
  entryMode: 'single' | 'segments';
  inputMode: 'live' | 'buffered';
  speed: TypingSpeed;
  segments: readonly ComposerSegment[];
  bufferedSegments: readonly BufferedComposerSegment[];
  onEntryModeChange: (mode: 'single' | 'segments') => void;
  onChange: (id: string, change: Partial<Pick<ComposerSegment, 'language' | 'text'>>) => void;
  onBufferedChange: (id: string, document: BufferedDocument) => void;
  onBufferedLanguageChange: (id: string, language: SegmentLanguage) => void;
  onSingleLanguageRequest: (language: SegmentLanguage) => void;
  onAdd: (language: SegmentLanguage) => void;
  onRemove: (id: string) => void;
  onPendingChange: (pending: boolean) => void;
}) {
  const isBuffered = inputMode === 'buffered';
  const singleSegment = segments[0]!;
  const bufferedSingle = bufferedSegments[0]!;
  const segmentLanguage = isBuffered ? bufferedSingle.language : singleSegment.language;
  return <section className="mixed-composer" aria-label="Mixed Writing composer">
    <div className="mixed-composer-heading"><div><span className="eyebrow">MIXED WRITING</span></div><div className="mixed-heading-actions"><div className="mixed-entry-switch" role="group" aria-label="Mixed writing style"><button className={entryMode === 'single' ? 'active' : ''} onClick={() => onEntryModeChange('single')}>Single editor</button><button className={entryMode === 'segments' ? 'active' : ''} onClick={() => onEntryModeChange('segments')}>Segment-wise</button></div>{entryMode === 'single' && <label className={`single-language-select ${segmentLanguage}`}><span className="sr-only">Single editor language</span><select value={segmentLanguage} aria-label="Single editor language" onChange={(event) => onSingleLanguageRequest(event.target.value as SegmentLanguage)}>{(['singlish', 'tanglish', 'hinglish', 'literal'] as SegmentLanguage[]).map((id) => <option value={id} key={id}>{labels[id]} — {EnglishLabels[id]}</option>)}</select></label>}</div></div>
    <div className="mixed-surface">{entryMode === 'single'
      ? (isBuffered ? <BufferedSegmentEditor segment={bufferedSingle} index={0} allowRemove={false} languageMenu={false} speed={speed} onChange={onBufferedChange} onLanguageChange={onBufferedLanguageChange} onRemove={onRemove} onPendingChange={onPendingChange} /> : <LiveSegmentEditor segment={singleSegment} index={0} allowRemove={false} languageMenu={false} onChange={onChange} onRemove={onRemove} />)
      : (isBuffered ? bufferedSegments.map((segment, index) => <BufferedSegmentEditor key={segment.id} segment={segment} index={index} allowRemove={bufferedSegments.length > 1} languageMenu speed={speed} onChange={onBufferedChange} onLanguageChange={onBufferedLanguageChange} onRemove={onRemove} onPendingChange={onPendingChange} />) : segments.map((segment, index) => <LiveSegmentEditor key={segment.id} segment={segment} index={index} allowRemove={segments.length > 1} languageMenu onChange={onChange} onRemove={onRemove} />))}</div>
    {entryMode === 'segments' && <div className="segment-add" role="group" aria-label="Start another language segment"><span><FontAwesomeIcon icon={faPlus} /> Start next segment</span>{(Object.keys(labels) as SegmentLanguage[]).map((id) => <button className={`add-${id}`} key={id} onClick={() => onAdd(id)}>{labels[id]}</button>)}</div>}
  </section>;
}
