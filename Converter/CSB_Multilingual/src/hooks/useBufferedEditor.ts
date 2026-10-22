import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { ConversionAdapter, TypingSpeed } from '../types';

const delays: Record<TypingSpeed, number> = { slow: 750, moderate: 500, fast: 250 };
type Buffer = { source: string; start: number; end: number } | null;

function replaceRange(value: string, start: number, end: number, insert: string): string {
  return value.slice(0, start) + insert + value.slice(end);
}

function isMappingCharacter(key: string): boolean {
  return key.length === 1 && !/\s/u.test(key) && !/[.,!?;:()[\]{}]/u.test(key);
}

export function useBufferedEditor({ value, onValueChange, adapter, speed, enabled }: {
  value: string;
  onValueChange(value: string): void;
  adapter: ConversionAdapter;
  speed: TypingSpeed;
  enabled: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);
  const bufferRef = useRef<Buffer>(null);
  const [buffer, setBuffer] = useState<Buffer>(null);
  const preview = useMemo(() => buffer ? replaceRange(value, buffer.start, buffer.end, adapter.convert(buffer.source)) : value, [adapter, buffer, value]);

  const clearTimer = useCallback(() => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); timerRef.current = null; }, []);
  const commit = useCallback(() => {
    const current = bufferRef.current;
    clearTimer();
    if (!current) return;
    onValueChange(replaceRange(value, current.start, current.end, adapter.convert(current.source)));
    bufferRef.current = null; setBuffer(null);
  }, [adapter, clearTimer, onValueChange, value]);
  const appendCommitted = useCallback((append: string) => {
    const current = bufferRef.current;
    clearTimer();
    if (!current) return;
    onValueChange(replaceRange(value, current.start, current.end, adapter.convert(current.source) + append));
    bufferRef.current = null; setBuffer(null);
  }, [adapter, clearTimer, onValueChange, value]);
  const schedule = useCallback(() => { clearTimer(); timerRef.current = window.setTimeout(commit, delays[speed]); }, [clearTimer, commit, speed]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!enabled || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.nativeEvent.isComposing) return;
    if (event.key === 'Backspace' && bufferRef.current) {
      event.preventDefault(); const current = bufferRef.current; const next = current.source.slice(0, -1); const updated = next ? { ...current, source: next } : null;
      bufferRef.current = updated; setBuffer(updated); if (updated) schedule(); else clearTimer(); return;
    }
    if (event.key === 'Enter' && bufferRef.current) { event.preventDefault(); appendCommitted('\n'); return; }
    if (event.key.length !== 1) { if (bufferRef.current && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Delete'].includes(event.key)) commit(); return; }
    if (isMappingCharacter(event.key)) {
      event.preventDefault();
      const current = bufferRef.current;
      const start = event.currentTarget.selectionStart ?? value.length;
      const end = event.currentTarget.selectionEnd ?? start;
      const next = current ? { ...current, source: current.source + event.key } : { source: event.key, start, end };
      bufferRef.current = next; setBuffer(next); schedule(); return;
    }
    if (bufferRef.current) { event.preventDefault(); appendCommitted(event.key); }
  }, [appendCommitted, clearTimer, commit, enabled, schedule, value.length]);
  const onChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => { if (!bufferRef.current) onValueChange(event.target.value); }, [onValueChange]);
  useEffect(() => () => clearTimer(), [clearTimer]);
  useEffect(() => { if (buffer) { const at = buffer.start + adapter.convert(buffer.source).length; textareaRef.current?.setSelectionRange(at, at); } }, [adapter, buffer, preview]);

  return { textareaRef, preview, pending: buffer?.source ?? '', onKeyDown, onChange, commit };
}
