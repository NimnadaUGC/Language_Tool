import { useCallback, useEffect, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { ConversionAdapter, TypingSpeed } from '../types';

const delays: Record<TypingSpeed, number> = { fast: 250, moderate: 500, slow: 750 };

export type BufferedDocument = { source: string; unicode: string };
type PendingChunk = { start: number; end: number; text: string } | null;

function replaceRange(value: string, start: number, end: number, insert: string) {
  return value.slice(0, start) + insert + value.slice(end);
}

function sourceOffsetForUnicodePosition(adapter: ConversionAdapter, source: string, position: number, identitySource: boolean) {
  if (identitySource) return Math.min(position, source.length);
  const tokens = adapter.analyze(source).tokens;
  let unicodeOffset = 0;
  for (const token of tokens) {
    const tokenLength = token.unicode.length;
    const tokenEnd = unicodeOffset + tokenLength;
    if (position < tokenEnd) {
      if (position <= unicodeOffset || tokenLength === 0) return token.span.start;
      const sourceLength = token.span.end - token.span.start;
      return token.span.start + Math.round(((position - unicodeOffset) / tokenLength) * sourceLength);
    }
    if (position === tokenEnd) return token.span.end;
    unicodeOffset = tokenEnd;
  }
  return source.length;
}

/**
 * Buffered mode deliberately keeps the rendered Unicode document separate from
 * the Romanized key history. Unicode edits and timed Romanized chunks retain a
 * position-aware connection so the remap source follows the visible document.
 */
export function BufferedUnicodeEditor({ document, adapter, speed, label, placeholder, className, identitySource = false, onDocumentChange, onPendingChange }: {
  document: BufferedDocument;
  adapter: ConversionAdapter;
  speed: TypingSpeed;
  label: string;
  placeholder: string;
  className?: string;
  identitySource?: boolean;
  onDocumentChange: (next: BufferedDocument) => void;
  onPendingChange: (pending: boolean) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const documentRef = useRef(document);
  const pendingRef = useRef<PendingChunk>(null);
  const timerRef = useRef<number | null>(null);
  const commitRef = useRef<() => void>(() => undefined);

  useEffect(() => { documentRef.current = document; }, [document]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const commit = useCallback(() => {
    const pending = pendingRef.current;
    clearTimer();
    if (!pending) return;
    const current = documentRef.current;
    const mapped = adapter.convert(pending.text);
    const sourceStart = sourceOffsetForUnicodePosition(adapter, current.source, pending.start, identitySource);
    const sourceEnd = sourceOffsetForUnicodePosition(adapter, current.source, pending.end, identitySource);
    const next = {
      source: replaceRange(current.source, sourceStart, sourceEnd, pending.text),
      unicode: replaceRange(current.unicode, pending.start, pending.end, mapped),
    };
    pendingRef.current = null;
    documentRef.current = next;
    onPendingChange(false);
    onDocumentChange(next);
    window.requestAnimationFrame(() => textareaRef.current?.setSelectionRange(pending.start + mapped.length, pending.start + mapped.length));
  }, [adapter, clearTimer, identitySource, onDocumentChange, onPendingChange]);

  commitRef.current = commit;

  const schedule = useCallback(() => {
    clearTimer();
    timerRef.current = window.setTimeout(commit, delays[speed]);
  }, [clearTimer, commit, speed]);

  const queueCharacter = useCallback((event: KeyboardEvent<HTMLTextAreaElement>, text: string) => {
    event.preventDefault();
    const current = pendingRef.current;
    const start = event.currentTarget.selectionStart ?? documentRef.current.unicode.length;
    const end = event.currentTarget.selectionEnd ?? start;
    const next = current && current.start === start && current.end === end
      ? { ...current, text: current.text + text }
      : { start, end, text };
    pendingRef.current = next;
    onPendingChange(true);
    schedule();
  }, [onPendingChange, schedule]);

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.nativeEvent.isComposing) return;
    if (event.key === 'Backspace' && pendingRef.current) {
      event.preventDefault();
      const pending = pendingRef.current;
      const text = pending.text.slice(0, -1);
      pendingRef.current = text ? { ...pending, text } : null;
      if (text) schedule(); else { clearTimer(); onPendingChange(false); }
      return;
    }
    if (event.key === 'Enter') { queueCharacter(event, '\n'); return; }
    if (event.key.length === 1) { queueCharacter(event, event.key); return; }
    if (pendingRef.current && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Delete'].includes(event.key)) commit();
  }

  function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const current = documentRef.current;
    const unicode = event.target.value;
    let prefixLength = 0;
    while (prefixLength < current.unicode.length && prefixLength < unicode.length && current.unicode[prefixLength] === unicode[prefixLength]) prefixLength += 1;
    let suffixLength = 0;
    while (suffixLength < current.unicode.length - prefixLength && suffixLength < unicode.length - prefixLength && current.unicode[current.unicode.length - 1 - suffixLength] === unicode[unicode.length - 1 - suffixLength]) suffixLength += 1;
    const removedEnd = current.unicode.length - suffixLength;
    const sourceStart = sourceOffsetForUnicodePosition(adapter, current.source, prefixLength, identitySource);
    const sourceEnd = sourceOffsetForUnicodePosition(adapter, current.source, removedEnd, identitySource);
    // Direct Unicode insertion stays Unicode-only; a deletion removes the matching Romanized range.
    const next = { source: replaceRange(current.source, sourceStart, sourceEnd, ''), unicode };
    documentRef.current = next;
    onDocumentChange(next);
  }

  useEffect(() => () => { commitRef.current(); }, []);

  return <textarea ref={textareaRef} className={className} value={document.unicode} onKeyDown={onKeyDown} onChange={onChange} onBlur={commit} spellCheck={false} aria-label={label} placeholder={placeholder} />;
}
