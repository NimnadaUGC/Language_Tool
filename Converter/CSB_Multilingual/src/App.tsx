import { useEffect, useMemo, useState } from 'react';
import { adapters } from './engine/adapters';
import { analyzeMixed, encodeLegacy } from './engine';
import type { ComposerSegment, LegacyLiteralPolicy, SegmentLanguage, WritingMode } from './engine';
import type { LanguageId } from './engine/types';
import { defaultPreferences } from './types';
import type { TypingSpeed } from './types';
import { languageImages } from './assets';
import { AnalyzerView } from './ui/AnalyzerView';
import type { BufferedDocument } from './ui/BufferedUnicodeEditor';
import { ConvertView } from './ui/ConvertView';
import { ExportView } from './ui/ExportView';
import { MappingsView } from './ui/MappingsView';
import { Navigation } from './ui/Navigation';
import { ProjectInfo } from './ui/ProjectInfo';
import type { AppView } from './ui/Navigation';
import type { BufferedComposerSegment } from './ui/MixedComposer';
import './styles.css';

const legacyTargetForLanguage = { singlish: 'fm-abhaya', tanglish: 'bamini', hinglish: 'kruti-dev-010' } as const;
const emptySources: Record<LanguageId, string> = { singlish: '', tanglish: '', hinglish: '' };
const emptyBufferedDocuments: Record<LanguageId, BufferedDocument> = { singlish: { source: '', unicode: '' }, tanglish: { source: '', unicode: '' }, hinglish: { source: '', unicode: '' } };
const typingPreferenceKey = 'csb-multilingual-typing-preferences';
type TypingPreferences = { inputMode: 'live' | 'buffered'; typingSpeed: TypingSpeed };
let segmentSequence = 0;

function newSegment(language: SegmentLanguage, text = ''): ComposerSegment { segmentSequence += 1; return { id: `segment-${segmentSequence}`, language, text }; }
function bufferedSegment(language: SegmentLanguage, source = '', id = newSegment(language).id): BufferedComposerSegment { return { id, language, source, unicode: renderSegment(language, source) }; }
function renderSegment(language: SegmentLanguage, source: string) { return language === 'literal' ? source : adapters[language].analyze(source).unicode; }
function downloadText(filename: string, content: string) { const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' })), download: filename }); link.click(); URL.revokeObjectURL(link.href); }
function storedTypingPreferences(): TypingPreferences {
  const fallback: TypingPreferences = { inputMode: 'buffered', typingSpeed: 'moderate' };
  try {
    const stored = JSON.parse(window.localStorage.getItem(typingPreferenceKey) ?? '{}') as Partial<TypingPreferences>;
    return { inputMode: stored.inputMode === 'live' || stored.inputMode === 'buffered' ? stored.inputMode : fallback.inputMode, typingSpeed: stored.typingSpeed === 'fast' || stored.typingSpeed === 'moderate' || stored.typingSpeed === 'slow' ? stored.typingSpeed : fallback.typingSpeed };
  } catch { return fallback; }
}

function ConfirmDialog({ title, children, confirmLabel, onCancel, onConfirm }: { title: string; children: React.ReactNode; confirmLabel: string; onCancel: () => void; onConfirm: () => void }) {
  return <div className="confirmation-backdrop" role="presentation"><section className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmation-title"><h2 id="confirmation-title">{title}</h2><p>{children}</p><footer><button className="quiet-action" onClick={onCancel}>Cancel</button><button className="remap-now" onClick={onConfirm}>{confirmLabel}</button></footer></section></div>;
}

export function App() {
  const [view, setView] = useState<AppView>('convert');
  const [language, setLanguage] = useState<LanguageId>(defaultPreferences.language);
  const [writingMode, setWritingMode] = useState<WritingMode>(defaultPreferences.language);
  const [sources, setSources] = useState<Record<LanguageId, string>>(emptySources);
  const [segments, setSegments] = useState<ComposerSegment[]>(() => [newSegment('singlish')]);
  const [singleSegment, setSingleSegment] = useState<ComposerSegment>(() => newSegment('singlish'));
  const [committedSingleSegment, setCommittedSingleSegment] = useState<ComposerSegment>(() => newSegment('singlish'));
  const [mixedEntryMode, setMixedEntryMode] = useState<'single' | 'segments'>('single');
  const [bufferedDocuments, setBufferedDocuments] = useState<Record<LanguageId, BufferedDocument>>(emptyBufferedDocuments);
  const [bufferedSegments, setBufferedSegments] = useState<BufferedComposerSegment[]>(() => [bufferedSegment('singlish')]);
  const [bufferedSingle, setBufferedSingle] = useState<BufferedComposerSegment>(() => bufferedSegment('singlish'));
  const [typingPreferences, setTypingPreferences] = useState(storedTypingPreferences);
  const [bufferPending, setBufferPending] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [legacyLiteralPolicy, setLegacyLiteralPolicy] = useState<LegacyLiteralPolicy>('preserve');
  const [mixedExportSource, setMixedExportSource] = useState<'single' | 'segments'>('single');
  const [pendingInputMode, setPendingInputMode] = useState<'live' | 'buffered' | null>(null);
  const [pendingSegmentLanguage, setPendingSegmentLanguage] = useState<{ id: string; language: SegmentLanguage } | null>(null);
  const [remapConfirmationOpen, setRemapConfirmationOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const inputMode = typingPreferences.inputMode;
  const typingSpeed = typingPreferences.typingSpeed;
  const source = sources[language];
  const bufferedDocument = bufferedDocuments[language];
  const liveVisibleSegments = useMemo(() => mixedEntryMode === 'single' ? [singleSegment] : segments, [mixedEntryMode, segments, singleSegment]);
  const liveSegmentsForAnalysis = useMemo(() => mixedEntryMode === 'single' ? [committedSingleSegment] : segments, [committedSingleSegment, mixedEntryMode, segments]);
  const bufferedVisibleSegments = useMemo(() => mixedEntryMode === 'single' ? [bufferedSingle] : bufferedSegments, [bufferedSegments, bufferedSingle, mixedEntryMode]);
  const liveSingleAnalysis = useMemo(() => writingMode === 'mixed' ? undefined : adapters[language].analyze(source), [language, source, writingMode]);
  const liveMixedAnalysis = useMemo(() => writingMode === 'mixed' ? analyzeMixed(liveSegmentsForAnalysis) : undefined, [liveSegmentsForAnalysis, writingMode]);
  const bufferedMixedAnalysis = useMemo(() => analyzeMixed(bufferedVisibleSegments.map((segment) => ({ id: segment.id, language: segment.language, text: segment.source }))), [bufferedVisibleSegments]);
  const bufferedMixedUnicode = bufferedVisibleSegments.map((segment) => segment.unicode).join('');
  const displayUnicode = inputMode === 'live' ? (writingMode === 'mixed' ? liveMixedAnalysis!.unicode : liveSingleAnalysis!.unicode) : (writingMode === 'mixed' ? bufferedMixedUnicode : bufferedDocument.unicode);
  const tokenCount = inputMode === 'live' ? (writingMode === 'mixed' ? liveMixedAnalysis!.statistics.tokenCount : liveSingleAnalysis!.statistics.tokenCount) : (writingMode === 'mixed' ? bufferedMixedAnalysis.statistics.tokenCount : adapters[language].analyze(bufferedDocument.source).statistics.tokenCount);
  const legacyTarget = legacyTargetForLanguage[language];
  const legacy = useMemo(() => writingMode === 'mixed' ? undefined : encodeLegacy(displayUnicode, legacyTarget, { tokens: adapters[language].analyze(inputMode === 'buffered' ? bufferedDocument.source : source).tokens, literalPolicy: legacyLiteralPolicy }), [bufferedDocument.source, displayUnicode, inputMode, language, legacyLiteralPolicy, legacyTarget, source, writingMode]);
  const exportMixedSegments = mixedExportSource === 'single' ? [inputMode === 'buffered' ? bufferedSingle : singleSegment] : (inputMode === 'buffered' ? bufferedSegments : segments);
  const exportUnicode = writingMode === 'mixed'
    ? (inputMode === 'buffered' ? exportMixedSegments.map((segment) => 'unicode' in segment ? segment.unicode : '').join('') : analyzeMixed(exportMixedSegments as ComposerSegment[]).unicode)
    : displayUnicode;

  useEffect(() => { try { window.localStorage.setItem(typingPreferenceKey, JSON.stringify(typingPreferences)); } catch { /* storage can be unavailable */ } }, [typingPreferences]);
  useEffect(() => { if (!notice) return undefined; const timer = window.setTimeout(() => setNotice(''), 3200); return () => window.clearTimeout(timer); }, [notice]);

  function selectWritingMode(mode: WritingMode) {
    if (mode === 'mixed') { setWritingMode('mixed'); return; }
    setLanguage(mode); setWritingMode(mode);
  }
  function updateSource(value: string) { setSources((current) => ({ ...current, [language]: value })); }
  function updateBufferedDocument(document: BufferedDocument) { setBufferedDocuments((current) => ({ ...current, [language]: document })); }
  function updateSegment(id: string, change: Partial<Pick<ComposerSegment, 'language' | 'text'>>) {
    if (mixedEntryMode === 'single') {
      setSingleSegment((current) => current.id === id ? { ...current, ...change } : current);
      if ('text' in change) setCommittedSingleSegment((current) => current.id === id ? { ...current, ...change, language: singleSegment.language } : current);
      return;
    }
    setSegments((current) => current.map((segment) => segment.id === id ? { ...segment, ...change } : segment));
  }
  function updateBufferedSegment(id: string, document: BufferedDocument) {
    const change = (segment: BufferedComposerSegment) => segment.id === id ? { ...segment, ...document } : segment;
    if (mixedEntryMode === 'single') setBufferedSingle(change); else setBufferedSegments((current) => current.map(change));
  }
  function updateBufferedSegmentLanguage(id: string, nextLanguage: SegmentLanguage, remap = false) {
    const change = (segment: BufferedComposerSegment) => segment.id === id ? { ...segment, language: nextLanguage, unicode: remap ? renderSegment(nextLanguage, segment.source) : segment.unicode } : segment;
    if (mixedEntryMode === 'single') setBufferedSingle(change); else setBufferedSegments((current) => current.map(change));
  }
  function addSegment(nextLanguage: SegmentLanguage) {
    if (inputMode === 'buffered') setBufferedSegments((current) => [...current, bufferedSegment(nextLanguage)]);
    else setSegments((current) => [...current, newSegment(nextLanguage)]);
  }
  function removeSegment(id: string) {
    if (inputMode === 'buffered') setBufferedSegments((current) => current.length === 1 ? current : current.filter((segment) => segment.id !== id));
    else setSegments((current) => current.length === 1 ? current : current.filter((segment) => segment.id !== id));
  }
  function applyInputMode(nextMode: 'live' | 'buffered') {
    if (nextMode === inputMode) return;
    if (nextMode === 'buffered') {
      if (writingMode === 'mixed') {
        if (mixedEntryMode === 'single') setBufferedSingle({ id: singleSegment.id, language: singleSegment.language, source: singleSegment.text, unicode: renderSegment(singleSegment.language, singleSegment.text) });
        else setBufferedSegments(segments.map((segment) => ({ id: segment.id, language: segment.language, source: segment.text, unicode: renderSegment(segment.language, segment.text) })));
      } else setBufferedDocuments((current) => ({ ...current, [language]: { source, unicode: adapters[language].analyze(source).unicode } }));
      setTypingPreferences((current) => ({ ...current, inputMode: 'buffered' }));
      setNotice('Buffered mode now uses an editable Unicode document and a protected Romanized remap source.');
      return;
    }
    if (writingMode === 'mixed') {
      if (mixedEntryMode === 'single') {
        const next = { id: bufferedSingle.id, language: bufferedSingle.language, text: bufferedSingle.source };
        setSingleSegment(next); setCommittedSingleSegment(next);
      }
      else setSegments(bufferedSegments.map((segment) => ({ id: segment.id, language: segment.language, text: segment.source })));
    } else setSources((current) => ({ ...current, [language]: bufferedDocument.source }));
    setTypingPreferences((current) => ({ ...current, inputMode: 'live' }));
    setNotice('Live mode remapped from the saved Romanized source; manual Buffered Unicode edits may have changed.');
  }
  function requestInputMode(nextMode: 'live' | 'buffered') {
    if (nextMode === inputMode) return;
    const hasMixedSingleContent = writingMode === 'mixed' && mixedEntryMode === 'single' && (inputMode === 'buffered' ? Boolean(bufferedSingle.source || bufferedSingle.unicode) : Boolean(singleSegment.text));
    const hasBufferedContent = writingMode === 'mixed'
      ? bufferedVisibleSegments.some((segment) => Boolean(segment.source || segment.unicode))
      : Boolean(bufferedDocument.source || bufferedDocument.unicode);
    const needsBufferedToLiveWarning = inputMode === 'buffered' && nextMode === 'live' && hasBufferedContent;
    if (hasMixedSingleContent || needsBufferedToLiveWarning) { setPendingInputMode(nextMode); return; }
    applyInputMode(nextMode);
  }
  function requestSingleLanguage(nextLanguage: SegmentLanguage) {
    const currentLanguage = inputMode === 'buffered' ? bufferedSingle.language : singleSegment.language;
    if (currentLanguage === nextLanguage) return;
    if (inputMode === 'buffered') updateBufferedSegmentLanguage(bufferedSingle.id, nextLanguage); else updateSegment(singleSegment.id, { language: nextLanguage });
    setNotice('The selected language applies to future typing; existing Single-editor Unicode remains unchanged.');
  }
  function requestBufferedSegmentLanguage(id: string, nextLanguage: SegmentLanguage) {
    const segment = bufferedSegments.find((item) => item.id === id);
    if (!segment || segment.language === nextLanguage) return;
    if (segment.source || segment.unicode) { setPendingSegmentLanguage({ id, language: nextLanguage }); return; }
    updateBufferedSegmentLanguage(id, nextLanguage);
  }
  function confirmBufferedSegmentLanguage() {
    if (!pendingSegmentLanguage) return;
    updateBufferedSegmentLanguage(pendingSegmentLanguage.id, pendingSegmentLanguage.language, true);
    setPendingSegmentLanguage(null);
    setNotice('The segment was remapped using its newly selected language.');
  }
  function performRemap() {
    if (writingMode === 'mixed') {
      if (mixedEntryMode === 'single') setBufferedSingle((current) => ({ ...current, unicode: renderSegment(current.language, current.source) }));
      else setBufferedSegments((current) => current.map((segment) => ({ ...segment, unicode: renderSegment(segment.language, segment.source) })));
    } else setBufferedDocuments((current) => ({ ...current, [language]: { ...current[language], unicode: adapters[language].analyze(current[language].source).unicode } }));
    setRemapConfirmationOpen(false);
    setNotice('Unicode was replaced by a fresh remap of the saved Romanized source.');
  }
  function requestRemap() {
    const hasSource = writingMode === 'mixed' ? bufferedVisibleSegments.some((segment) => Boolean(segment.source)) : Boolean(bufferedDocument.source);
    if (hasSource) setRemapConfirmationOpen(true); else performRemap();
  }
  async function copy(text: string, label: string) { try { await navigator.clipboard.writeText(text); setNotice(`${label} copied to the clipboard.`); } catch { setNotice(`Browser copy was unavailable. Select and copy the ${label.toLowerCase()} manually.`); } }
  function clear() {
    if (writingMode === 'mixed') {
      if (inputMode === 'buffered') {
        if (mixedEntryMode === 'single') setBufferedSingle((current) => ({ ...current, source: '', unicode: '' }));
        else setBufferedSegments((current) => current.map((segment) => ({ ...segment, source: '', unicode: '' })));
      } else if (mixedEntryMode === 'single') setSingleSegment((current) => ({ ...current, text: '' })); else setSegments((current) => current.map((segment) => ({ ...segment, text: '' })));
    } else if (inputMode === 'buffered') setBufferedDocuments((current) => ({ ...current, [language]: { source: '', unicode: '' } }));
    else setSources((current) => ({ ...current, [language]: '' }));
    setNotice('Current editor cleared.');
  }

  const accent = writingMode === 'mixed' ? '#26384e' : adapters[language].accent;
  const activeImage = languageImages[writingMode === 'mixed' ? 'mixed' : language];
  return <div className="academic-app" style={{ '--accent': accent } as React.CSSProperties}>
    <header className="app-header"><div className="brand-mark" aria-hidden="true"><img src={activeImage} alt="" /></div><span className="brand-divider" aria-hidden="true" /><div className="brand-copy"><span>CSC 4212 · ASSIGNMENT 2</span><h1>Multilingual Lexical Analyzer</h1><p>Deterministic Romanized-text analysis and Unicode rendering.</p></div><div className="header-status"><b>{writingMode === 'mixed' ? 'Mixed Writing' : adapters[language].label}</b><small>{inputMode === 'live' ? 'Live auto-remap' : bufferPending ? 'Buffered chunk pending' : 'Editable Unicode document'}</small></div><ProjectInfo open={infoOpen} onToggle={() => setInfoOpen((open) => !open)} /></header>
    <div className="app-shell"><Navigation view={view} onChange={(next) => { setView(next); setToolsOpen(false); setInfoOpen(false); }} /><main className="academic-main">{view === 'convert' && <ConvertView writingMode={writingMode} language={language} source={source} bufferedDocument={bufferedDocument} unicode={displayUnicode} tokenCount={tokenCount} pending={bufferPending} inputMode={inputMode} speed={typingSpeed} remapAvailable toolsOpen={toolsOpen} segments={liveVisibleSegments} bufferedSegments={bufferedVisibleSegments} mixedEntryMode={mixedEntryMode} onSelectMode={selectWritingMode} onSourceChange={updateSource} onBufferedDocumentChange={updateBufferedDocument} onSegmentChange={updateSegment} onBufferedSegmentChange={updateBufferedSegment} onBufferedSegmentLanguageChange={requestBufferedSegmentLanguage} onSingleLanguageRequest={requestSingleLanguage} onSegmentAdd={addSegment} onSegmentRemove={removeSegment} onInputModeChange={requestInputMode} onMixedEntryModeChange={setMixedEntryMode} onSpeedChange={(speed) => setTypingPreferences((current) => ({ ...current, typingSpeed: speed }))} onRemap={requestRemap} onToggleTools={() => setToolsOpen((open) => !open)} onCopy={(text, label) => void copy(text, label)} onDownload={downloadText} onClear={clear} onPendingChange={setBufferPending} />}{view === 'analyzer' && <AnalyzerView analysis={inputMode === 'live' ? (writingMode === 'mixed' ? liveMixedAnalysis! : liveSingleAnalysis!) : (writingMode === 'mixed' ? bufferedMixedAnalysis : adapters[language].analyze(bufferedDocument.source))} />}{view === 'mappings' && <MappingsView language={language} />}{view === 'export' && <ExportView writingMode={writingMode} unicode={exportUnicode} mixed={writingMode === 'mixed'} target={legacyTarget} legacy={legacy} literalPolicy={legacyLiteralPolicy} mixedSource={mixedExportSource} onSelectMode={selectWritingMode} onMixedSourceChange={setMixedExportSource} onPolicyChange={setLegacyLiteralPolicy} onCopy={(text, label) => void copy(text, label)} onDownload={downloadText} />}</main></div>
    {pendingInputMode && <ConfirmDialog title="Switch typing mode and remap?" confirmLabel={`Switch to ${pendingInputMode === 'live' ? 'Live' : 'Buffered'}`} onCancel={() => setPendingInputMode(null)} onConfirm={() => { const nextMode = pendingInputMode; setPendingInputMode(null); applyInputMode(nextMode); }}>{pendingInputMode === 'live' ? 'Live mode will re-render Unicode from the saved Romanized source. Any direct Buffered Unicode edits may be replaced.' : 'Switching Single editor mode remaps all saved Romanized text in the selected language. In Buffered mode, manual Unicode edits may be replaced.'}</ConfirmDialog>}
    {pendingSegmentLanguage && <ConfirmDialog title="Remap this segment in the new language?" confirmLabel="Change language and remap" onCancel={() => setPendingSegmentLanguage(null)} onConfirm={confirmBufferedSegmentLanguage}>Changing the language of a Buffered segment remaps its saved Romanized source and replaces that section’s editable Unicode.</ConfirmDialog>}
    {remapConfirmationOpen && <ConfirmDialog title="Replace editable Unicode?" confirmLabel="Remap now" onCancel={() => setRemapConfirmationOpen(false)} onConfirm={performRemap}>This replaces the current Unicode document with a full conversion of the read-only Romanized remap source. Manual Unicode edits will be lost.</ConfirmDialog>}
    {notice && <div className="toast" role="status">{notice}</div>}
  </div>;
}
