// Hinglish to Hindi conversion core with delayed input buffering.
import { hindiMaxPatternLength, hindiPatternMap } from './hindi-mapping.js';

const elementsWithListeners = new WeakSet();
let hindiInputEnabled = false;
let keyBuffer = [];
let typingTimer = null;
let observer = null;

function getStoredValue(key) {
  try { return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null; } catch (_) { return null; }
}

function setStoredValue(key, value) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(key, value); } catch (_) {}
}

function getTypingDelayFromSpeed(speed) {
  return speed === 'slow' ? 750 : speed === 'fast' ? 250 : 500;
}

function getTypingDelay() {
  if (typeof window !== 'undefined' && window.HINDI_TYPING_DELAY) return window.HINDI_TYPING_DELAY;
  return getTypingDelayFromSpeed(getStoredValue('hindiTypingSpeed') || 'moderate');
}

export function initializeHindiInput(startEnabled = false) {
  if (typeof window !== 'undefined') {
    window.HINDI_TYPING_DELAY = getTypingDelayFromSpeed(getStoredValue('hindiTypingSpeed') || 'moderate');
  }
  hindiInputEnabled = startEnabled;
  setStoredValue('hindiInputEnabled', String(startEnabled));

  const toggle = document.getElementById('hindiToggle');
  if (toggle && !toggle.dataset.hindiInputBound) {
    toggle.dataset.hindiInputBound = 'true';
    toggle.addEventListener('change', function onToggleChange() {
      hindiInputEnabled = this.checked;
      setStoredValue('hindiInputEnabled', String(hindiInputEnabled));
      resetState();
    });
  }
  if (toggle) toggle.checked = hindiInputEnabled;
  setupKeyboardMapping();
}

export function setHindiInputEnabled(enabled) {
  hindiInputEnabled = Boolean(enabled);
  setStoredValue('hindiInputEnabled', String(hindiInputEnabled));
  resetState();
}

export function setHindiTypingDelay(delay) {
  if (typeof window !== 'undefined') {
    window.HINDI_TYPING_DELAY = delay;
  }
}

export function resetState() {
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = null;
  keyBuffer = [];
}

function setupKeyboardMapping() {
  document.querySelectorAll('input[type="text"], input[type="search"], textarea, [contenteditable="true"]').forEach(attachKeyListenerIfNeeded);
  if (observer) return;
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
      if (isSupportedEditable(node)) attachKeyListenerIfNeeded(node);
      if (node.querySelectorAll) node.querySelectorAll('input[type="text"], input[type="search"], textarea, [contenteditable="true"]').forEach(attachKeyListenerIfNeeded);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('click', resetState);
}

function isSupportedEditable(element) {
  return (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) || element.tagName === 'TEXTAREA' || element.contentEditable === 'true';
}

function attachKeyListenerIfNeeded(element) {
  if (!elementsWithListeners.has(element)) {
    element.addEventListener('keydown', handleKeyEvent, true);
    elementsWithListeners.add(element);
  }
}

function handleKeyEvent(event) {
  if (!hindiInputEnabled || !isSupportedEditable(event.target)) return;
  const target = event.target;
  if (event.key === 'Backspace') {
    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = null;
    if (keyBuffer.length) { keyBuffer.pop(); event.preventDefault(); }
    return;
  }
  if (event.key === ' ' || event.key === 'Enter' || event.key === 'Tab' || event.key === 'Delete' || event.key.startsWith('Arrow') || event.ctrlKey || event.metaKey || event.altKey) {
    flushBuffer(target);
    if (event.key === ' ') { insertText(target, ' '); resetState(); event.preventDefault(); }
    else if (event.key === 'Enter') resetState();
    return;
  }
  if (event.key.length === 1) {
    keyBuffer.push(event.key);
    event.preventDefault();
    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(() => flushBuffer(target), getTypingDelay());
  }
}

function flushBuffer(target) {
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = null;
  if (!keyBuffer.length) return;
  insertText(target, convertHinglishSequence(keyBuffer.join('')));
  keyBuffer = [];
}

export function convertHinglishSequence(source) {
  let result = '';
  let position = 0;
  while (position < source.length) {
    let match = null;
    for (let length = Math.min(hindiMaxPatternLength, source.length - position); length; length -= 1) {
      const candidate = source.slice(position, position + length);
      if (Object.prototype.hasOwnProperty.call(hindiPatternMap, candidate)) { match = candidate; break; }
    }
    result += match ? hindiPatternMap[match] : source[position];
    position += match ? match.length : 1;
  }
  return result;
}

function insertText(target, text) {
  if (target.contentEditable === 'true') {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    return;
  }
  const start = target.selectionStart;
  const end = target.selectionEnd;
  target.value = target.value.slice(0, start) + text + target.value.slice(end);
  const nextPosition = start + text.length;
  target.selectionStart = nextPosition;
  target.selectionEnd = nextPosition;
}
