import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

function typeBuffered(label: string, text: string) {
  const editor = screen.getByLabelText(label);
  for (const key of text) fireEvent.keyDown(editor, { key });
  return editor;
}

function flushBuffered() { act(() => vi.advanceTimersByTime(500)); }

describe('academic workspace navigation', () => {
  afterEach(() => { cleanup(); vi.useRealTimers(); localStorage.clear(); });

  it('opens the mapping workspace and exposes its filter', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /Mappings/i })[0]!);
    expect(screen.getByRole('heading', { name: /Unicode and legacy mapping reference/i })).toBeTruthy();
    expect(screen.getByPlaceholderText(/Search Roman input/i)).toBeTruthy();
    expect(screen.getByRole('heading', { name: /How the mapping system works/i })).toBeTruthy();
    expect(screen.getByText(/Greedy rule selection/i)).toBeTruthy();
  });

  it('defaults to Buffered mode and exposes the protected Romanized source', () => {
    render(<App />);
    expect(screen.getByLabelText('Unicode result')).toBeTruthy();
    expect((screen.getByLabelText('Romanized remap source') as HTMLTextAreaElement).readOnly).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Tools/i }));
    expect(screen.getByRole('button', { name: /Buffered typing mode/i }).className).toContain('active');
  });

  it('keeps the Romanized remap source connected to Buffered Unicode insertion and deletion', () => {
    vi.useFakeTimers();
    render(<App />);
    typeBuffered('Unicode result', 'mama');
    expect((screen.getByLabelText('Unicode result') as HTMLTextAreaElement).value).toBe('');
    flushBuffered();
    expect((screen.getByLabelText('Unicode result') as HTMLTextAreaElement).value).toBe('මම');
    expect((screen.getByLabelText('Romanized remap source') as HTMLTextAreaElement).value).toBe('mama');
    const unicodeEditor = screen.getByLabelText('Unicode result') as HTMLTextAreaElement;
    unicodeEditor.setSelectionRange(1, 1);
    typeBuffered('Unicode result', 'a');
    flushBuffered();
    expect((screen.getByLabelText('Romanized remap source') as HTMLTextAreaElement).value).toBe('maama');
    fireEvent.change(unicodeEditor, { target: { value: 'මම' } });
    expect((screen.getByLabelText('Romanized remap source') as HTMLTextAreaElement).value).toBe('mama');
    fireEvent.change(unicodeEditor, { target: { value: 'මම manual' } });
    expect((screen.getByLabelText('Romanized remap source') as HTMLTextAreaElement).value).toBe('mama');
    fireEvent.click(screen.getByRole('button', { name: /Tools/i }));
    fireEvent.click(screen.getByRole('button', { name: /Remap now/i }));
    const dialog = screen.getByRole('dialog', { name: /Replace editable Unicode/i });
    fireEvent.click(within(dialog).getByRole('button', { name: /^Remap now$/i }));
    expect((screen.getByLabelText('Unicode result') as HTMLTextAreaElement).value).toBe('මම');
  });

  it('preserves a Buffered document when changing modes and returning', () => {
    vi.useFakeTimers();
    render(<App />);
    typeBuffered('Unicode result', 'mama');
    flushBuffered();
    fireEvent.click(screen.getByRole('tab', { name: /Tanglish/i }));
    fireEvent.click(screen.getByRole('tab', { name: /Singlish/i }));
    expect((screen.getByLabelText('Unicode result') as HTMLTextAreaElement).value).toBe('මම');
    expect((screen.getByLabelText('Romanized remap source') as HTMLTextAreaElement).value).toBe('mama');
  });

  it('warns before switching a single-language Buffered document back to Live', () => {
    vi.useFakeTimers();
    render(<App />);
    typeBuffered('Unicode result', 'mama');
    flushBuffered();
    fireEvent.click(screen.getByRole('button', { name: /Tools/i }));
    fireEvent.click(screen.getByRole('button', { name: /Live typing mode/i }));
    const dialog = screen.getByRole('dialog', { name: /Switch typing mode and remap/i });
    fireEvent.click(within(dialog).getByRole('button', { name: /Switch to Live/i }));
    expect((screen.getByLabelText('Singlish source text') as HTMLTextAreaElement).value).toBe('mama');
    fireEvent.click(screen.getByRole('button', { name: /Buffered typing mode/i }));
    expect((screen.getByLabelText('Unicode result') as HTMLTextAreaElement).value).toBe('මම');
  });

  it('buffers Mixed Writing sections and concatenates their Unicode document values', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /Mixed Writing/i }));
    typeBuffered('Sinhala Unicode section', 'mama');
    flushBuffered();
    expect((screen.getByLabelText('Mixed Unicode result') as HTMLTextAreaElement).value).toBe('මම');
    expect((screen.getAllByLabelText('Romanized remap source')[0] as HTMLTextAreaElement).value).toBe('mama');
    fireEvent.click(screen.getByRole('button', { name: /Segment-wise/i }));
    typeBuffered('Sinhala Unicode section', 'oya');
    flushBuffered();
    expect((screen.getByLabelText('Mixed Unicode result') as HTMLTextAreaElement).value).toContain('ඔය');
  });

  it('changes the Mixed Single-editor language without remapping existing Unicode', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /Mixed Writing/i }));
    typeBuffered('Sinhala Unicode section', 'mama');
    flushBuffered();
    fireEvent.change(screen.getByLabelText('Single editor language'), { target: { value: 'tanglish' } });
    expect((screen.getByLabelText('Single editor language') as HTMLSelectElement).value).toBe('tanglish');
    expect((screen.getByLabelText('Mixed Unicode result') as HTMLTextAreaElement).value).toBe('මම');
  });

  it('warns before switching Mixed Single-editor between Live and Buffered modes', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /Mixed Writing/i }));
    typeBuffered('Sinhala Unicode section', 'mama');
    flushBuffered();
    fireEvent.click(screen.getByRole('button', { name: /Tools/i }));
    fireEvent.click(screen.getByRole('button', { name: /Live typing mode/i }));
    const dialog = screen.getByRole('dialog', { name: /Switch typing mode and remap/i });
    fireEvent.click(within(dialog).getByRole('button', { name: /Switch to Live/i }));
    expect(screen.getByLabelText('Sinhala segment text')).toBeTruthy();
  });

  it('confirms and remaps a Buffered Segment-wise language change', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /Mixed Writing/i }));
    fireEvent.click(screen.getByRole('button', { name: /Segment-wise/i }));
    typeBuffered('Sinhala Unicode section', 'mama');
    flushBuffered();
    fireEvent.change(screen.getByLabelText('Language for segment 1'), { target: { value: 'tanglish' } });
    const dialog = screen.getByRole('dialog', { name: /Remap this segment in the new language/i });
    fireEvent.click(within(dialog).getByRole('button', { name: /Change language and remap/i }));
    expect((screen.getByLabelText('Tamil Unicode section') as HTMLTextAreaElement).value).not.toBe('මම');
  });

  it('warns before switching a Buffered Segment-wise document back to Live', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /Mixed Writing/i }));
    fireEvent.click(screen.getByRole('button', { name: /Segment-wise/i }));
    typeBuffered('Sinhala Unicode section', 'mama');
    flushBuffered();
    fireEvent.click(screen.getByRole('button', { name: /Tools/i }));
    fireEvent.click(screen.getByRole('button', { name: /Live typing mode/i }));
    const dialog = screen.getByRole('dialog', { name: /Switch typing mode and remap/i });
    expect(dialog.textContent).toMatch(/re-render Unicode/i);
    fireEvent.click(within(dialog).getByRole('button', { name: /Switch to Live/i }));
    expect(screen.getByLabelText('Sinhala segment text')).toBeTruthy();
  });

  it('keeps Mixed Writing Unicode-only and lets Export choose Single or Segment-wise sources', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /Mixed Writing/i }));
    fireEvent.click(screen.getAllByRole('button', { name: /Export/i })[0]!);
    expect(screen.getByText(/Mixed Writing is Unicode-only/i)).toBeTruthy();
    expect(screen.getByRole('group', { name: /Mixed export source/i })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Segment-wise/i }));
    expect(screen.getByRole('button', { name: /Segment-wise/i }).className).toContain('active');
  });

  it('uses the editable Buffered Unicode output for the matching legacy export', () => {
    vi.useFakeTimers();
    render(<App />);
    typeBuffered('Unicode result', 'mama');
    flushBuffered();
    fireEvent.click(screen.getAllByRole('button', { name: /Export/i })[0]!);
    expect((screen.getByLabelText('FM Abhaya export output') as HTMLTextAreaElement).value).not.toBe('');
  });

  it('persists the last chosen typing mode and speed', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Tools/i }));
    fireEvent.click(screen.getByRole('button', { name: /Fast · 250 ms/i }));
    fireEvent.click(screen.getByRole('button', { name: /Live typing mode/i }));
    cleanup();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Tools/i }));
    expect(screen.getByRole('button', { name: /Live typing mode/i }).className).toContain('active');
    fireEvent.click(screen.getByRole('button', { name: /Buffered typing mode/i }));
    expect(screen.getByRole('button', { name: /Fast · 250 ms/i }).className).toContain('active');
  });

  it('reveals creator, department, and supervision details through the information control', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Project information/i }));
    expect(screen.getByRole('complementary', { name: /Project credits/i }).textContent).toContain('A.P.N.K. Abeysekara');
    expect(screen.getByText('Dr. K.D.C.G Kapugama')).toBeTruthy();
  });
});
