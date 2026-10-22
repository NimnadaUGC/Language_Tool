// Main entry point for the Tanglish to Tamil converter package.
import './tamil-toggle.css';
import { initializeTamilInput, resetState, setTamilInputEnabled, setTamilTypingDelay } from './tamil-input.js';

const SPEED_CONFIG = {
  slow: { value: 0, delay: 750, label: 'Slow', description: 'Slow Typing Speed' },
  moderate: { value: 1, delay: 500, label: 'Moderate', description: 'Moderate Typing Speed' },
  fast: { value: 2, delay: 250, label: 'Fast', description: 'Fast Typing Speed' }
};

const DEFAULT_PLACEMENT = { offsetX: 20, offsetY: 20, smartFit: true };
const THEME_VARIABLES = {
  fontFamily: '--tamil-toggle-font-family', baseFontSize: '--tamil-toggle-base-font-size',
  background: '--tamil-toggle-background', textColor: '--tamil-toggle-text-color',
  accentColor: '--tamil-toggle-accent-color', mutedColor: '--tamil-toggle-muted-color',
  borderColor: '--tamil-toggle-border-color', toggleOffColor: '--tamil-toggle-off-color',
  radius: '--tamil-toggle-radius', shadow: '--tamil-toggle-shadow'
};

let activeSettings = null;
let globalEventsBound = false;

/**
 * Initialize real-time Tanglish to Tamil conversion.
 * @param {Object} options Converter, placement, and theme options.
 * @returns {Object} Converter controls.
 */
function initTanglishToTamil(options = {}) {
  const { autoAddToggle = true, togglePosition = 'bottom-right', startEnabled = false, placement = {}, theme = {} } = options;
  const normalizedPlacement = { ...DEFAULT_PLACEMENT, ...placement };

  if (autoAddToggle) addToggleToDOM(togglePosition, startEnabled, { placement: normalizedPlacement, theme });
  initializeTamilInput(startEnabled);

  const api = {
    enable: () => setEnabled(true),
    disable: () => setEnabled(false),
    isEnabled: () => getStoredValue('tamilInputEnabled') === 'true',
    setTypingSpeed: (speed) => {
      if (!SPEED_CONFIG[speed]) return;
      setStoredValue('tamilTypingSpeed', speed);
      updateTypingDelay(SPEED_CONFIG[speed].delay);
      updateSpeedUi(speed);
    },
    getTypingSpeed: () => normalizeSpeed(getStoredValue('tamilTypingSpeed')),
    setTheme: (themeValues = {}) => {
      const container = document.getElementById('tamil-toggle-container');
      if (container) applyTheme(container, themeValues);
    },
    showSettings: () => setPopupOpen(true),
    hideSettings: () => setPopupOpen(false),
    toggleSettings: (event) => handleSettingsActivation(event),
    toggle: () => setEnabled(!api.isEnabled())
  };

  publishGlobalInstance(api);
  return api;
}

function setEnabled(enabled) {
  const toggle = document.getElementById('tamilToggle');
  if (toggle) {
    toggle.checked = enabled;
    toggle.dispatchEvent(new Event('change'));
  } else {
    setTamilInputEnabled(enabled);
  }
  if (!enabled) resetState();
}

function addToggleToDOM(position, startEnabled, options) {
  const existing = document.getElementById('tamil-toggle-container');
  if (existing) existing.remove();

  const placement = { ...DEFAULT_PLACEMENT, ...(options.placement || {}) };
  const normalizedPosition = normalizePosition(position);
  const container = document.createElement('div');
  container.id = 'tamil-toggle-container';
  container.className = `tamil-toggle-container tamil-position-${normalizedPosition}`;
  container.dataset.position = normalizedPosition;
  applyPlacement(container, normalizedPosition, placement);
  applyTheme(container, options.theme || {});
  container.innerHTML = createToggleMarkup(startEnabled);
  document.body.appendChild(container);

  activeSettings = {
    container,
    settingsButton: document.getElementById('tamilSettings'),
    settingsPopup: document.getElementById('tamilSpeedSettingsPopup'),
    smartFit: placement.smartFit !== false
  };
  updateSpeedUi(normalizeSpeed(getStoredValue('tamilTypingSpeed')));
  bindToggleEvents(activeSettings);
}

function createToggleMarkup(startEnabled) {
  return `
    <div class="tamil-toggle-label">தமிழ்</div>
    <label class="tamil-switch" aria-label="Toggle Tamil typing">
      <input type="checkbox" id="tamilToggle" ${startEnabled ? 'checked' : ''}>
      <span class="tamil-slider" aria-hidden="true"></span>
    </label>
    <button class="tamil-settings-button" id="tamilSettings" type="button" aria-label="Typing speed settings" aria-expanded="false" aria-controls="tamilSpeedSettingsPopup">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"></path>
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2.1 2.1 0 1 1-2.98 2.98l-.05-.05A1.8 1.8 0 0 0 14.8 19.6a1.8 1.8 0 0 0-1.1 1.65V21.4a2.1 2.1 0 1 1-4.2 0v-.15A1.8 1.8 0 0 0 8.4 19.6a1.8 1.8 0 0 0-1.98.36l-.05.05a2.1 2.1 0 1 1-2.98-2.98l.05-.05A1.8 1.8 0 0 0 3.8 15a1.8 1.8 0 0 0-1.65-1.1H2a2.1 2.1 0 1 1 0-4.2h.15A1.8 1.8 0 0 0 3.8 8.6a1.8 1.8 0 0 0-.36-1.98l-.05-.05a2.1 2.1 0 1 1 2.98-2.98l.05.05A1.8 1.8 0 0 0 8.4 4a1.8 1.8 0 0 0 1.1-1.65V2.2a2.1 2.1 0 1 1 4.2 0v.15A1.8 1.8 0 0 0 14.8 4a1.8 1.8 0 0 0 1.98-.36l.05-.05a2.1 2.1 0 1 1 2.98 2.98l-.05.05A1.8 1.8 0 0 0 19.4 8.6a1.8 1.8 0 0 0 1.65 1.1h.15a2.1 2.1 0 1 1 0 4.2h-.15A1.8 1.8 0 0 0 19.4 15Z"></path>
      </svg>
    </button>
    <div class="tamil-speed-popup" id="tamilSpeedSettingsPopup" role="dialog" aria-labelledby="tamilSpeedSettingsTitle">
      <div class="tamil-speed-content">
        <h4 id="tamilSpeedSettingsTitle">Typing Speed</h4>
        <div class="tamil-speed-options" role="group" aria-label="Typing speed">
          ${Object.keys(SPEED_CONFIG).map(createSpeedButton).join('')}
        </div>
        <div class="tamil-speed-meter" aria-hidden="true">
          <span class="tamil-speed-meter-bar"></span>
          <span class="tamil-speed-meter-bar"></span>
          <span class="tamil-speed-meter-bar"></span>
        </div>
        <div class="tamil-speed-description" id="tamilSpeedDescription">Moderate Typing Speed</div>
      </div>
    </div>`;
}

function createSpeedButton(speed) {
  const config = SPEED_CONFIG[speed];
  return `<button class="tamil-speed-button" type="button" data-speed="${speed}" aria-pressed="false"><span class="tamil-speed-icon" aria-hidden="true">${[1, 2, 3].map((bar) => `<span class="${bar <= config.value + 1 ? 'is-on' : ''}"></span>`).join('')}</span><span>${config.label}</span></button>`;
}

function bindToggleEvents(settings) {
  const { container, settingsButton, settingsPopup } = settings;
  if (!container || !settingsButton || !settingsPopup) return;

  settingsButton.addEventListener('click', (event) => {
    event.stopPropagation();
    setPopupOpen(!settingsPopup.classList.contains('active'));
  });
  settingsPopup.addEventListener('click', (event) => event.stopPropagation());
  settingsPopup.querySelectorAll('.tamil-speed-button').forEach((button) => button.addEventListener('click', () => {
    const speed = button.dataset.speed;
    if (SPEED_CONFIG[speed]) {
      setStoredValue('tamilTypingSpeed', speed);
      updateTypingDelay(SPEED_CONFIG[speed].delay);
      updateSpeedUi(speed);
      positionPopup();
    }
  }));

  if (!globalEventsBound) {
    globalEventsBound = true;
    document.addEventListener('click', (event) => {
      if (activeSettings && !activeSettings.container.contains(event.target)) setPopupOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && activeSettings?.settingsPopup.classList.contains('active')) {
        setPopupOpen(false);
        activeSettings.settingsButton.focus();
      }
    });
    window.addEventListener('resize', positionPopup);
    window.addEventListener('scroll', positionPopup, true);
  }
}

function handleSettingsActivation(event) {
  if (event) event.stopPropagation();
  setPopupOpen(!activeSettings?.settingsPopup.classList.contains('active'));
}

function setPopupOpen(isOpen) {
  if (!activeSettings) return;
  activeSettings.settingsPopup.classList.toggle('active', isOpen);
  activeSettings.settingsButton.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) {
    positionPopup();
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      window.requestAnimationFrame(positionPopup);
    }
  } else {
    resetPopupPosition(activeSettings.settingsPopup);
  }
}

function positionPopup() {
  if (!activeSettings || !activeSettings.smartFit || !activeSettings.settingsPopup.classList.contains('active')) return;
  const { container, settingsPopup } = activeSettings;
  const viewportGap = 12;
  resetPopupPosition(settingsPopup);

  const containerRect = container.getBoundingClientRect();
  const popupRect = settingsPopup.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const preferTop = containerRect.top > viewportHeight - containerRect.bottom;

  let top = preferTop
    ? containerRect.top - popupRect.height - 10
    : containerRect.bottom + 10;
  let left = containerRect.right - popupRect.width;

  if (top < viewportGap) {
    top = Math.min(containerRect.bottom + 10, viewportHeight - popupRect.height - viewportGap);
  }

  if (top + popupRect.height > viewportHeight - viewportGap) {
    top = Math.max(viewportGap, containerRect.top - popupRect.height - 10);
  }

  top = Math.max(viewportGap, top);
  left = Math.max(viewportGap, Math.min(left, viewportWidth - popupRect.width - viewportGap));

  Object.assign(settingsPopup.style, {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    right: 'auto',
    bottom: 'auto'
  });

  // A backdrop-filter on the fixed toggle can make it the containing block for
  // fixed descendants. Correct the resulting offset so these remain viewport
  // coordinates, matching the working Singlish control on mobile browsers.
  const adjustedRect = settingsPopup.getBoundingClientRect();
  const deltaTop = top - adjustedRect.top;
  const deltaLeft = left - adjustedRect.left;

  if (Math.abs(deltaTop) > 1 || Math.abs(deltaLeft) > 1) {
    settingsPopup.style.top = `${top + deltaTop}px`;
    settingsPopup.style.left = `${left + deltaLeft}px`;
  }
}

function resetPopupPosition(popup) {
  Object.assign(popup.style, { position: '', top: '', left: '', right: '', bottom: '' });
}

function updateSpeedUi(speed) {
  const normalized = normalizeSpeed(speed);
  document.querySelectorAll('.tamil-speed-button').forEach((button) => {
    const active = button.dataset.speed === normalized;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const meter = document.querySelector('.tamil-speed-meter');
  if (meter) meter.dataset.speed = normalized;
  const description = document.getElementById('tamilSpeedDescription');
  if (description) description.textContent = SPEED_CONFIG[normalized].description;
}

function applyPlacement(container, position, placement) {
  const x = normalizeCssLength(placement.offsetX, DEFAULT_PLACEMENT.offsetX);
  const y = normalizeCssLength(placement.offsetY, DEFAULT_PLACEMENT.offsetY);
  container.style.top = position.includes('top') ? y : 'auto';
  container.style.bottom = position.includes('top') ? 'auto' : y;
  container.style.left = position.includes('left') ? x : 'auto';
  container.style.right = position.includes('left') ? 'auto' : x;
}

function applyTheme(container, theme) {
  Object.entries(theme || {}).forEach(([key, value]) => {
    if (THEME_VARIABLES[key] && value !== undefined && value !== null) container.style.setProperty(THEME_VARIABLES[key], String(value));
  });
}

function publishGlobalInstance(api) {
  if (typeof window === 'undefined') return;
  window.tanglishToTamil = initTanglishToTamil;
  window.tanglishToTamilInstance = api;
  Object.assign(window.tanglishToTamil, api);
}

function normalizePosition(position) { return ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(position) ? position : 'bottom-right'; }
function normalizeSpeed(speed) { return SPEED_CONFIG[speed] ? speed : 'moderate'; }
function normalizeCssLength(value, fallback) { return value === undefined || value === null || value === '' ? `${fallback}px` : typeof value === 'number' ? `${value}px` : String(value); }
function updateTypingDelay(delay) { setTamilTypingDelay(delay); }
function getStoredValue(key) { try { return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null; } catch (_) { return null; } }
function setStoredValue(key, value) { try { if (typeof localStorage !== 'undefined') localStorage.setItem(key, value); } catch (_) {} }

if (typeof window !== 'undefined') {
  window.tanglishToTamil = initTanglishToTamil;
  if (!window.TANGLISH_NO_AUTO_INIT) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initTanglishToTamil());
    else initTanglishToTamil();
  }
}

export default initTanglishToTamil;
if (typeof module !== 'undefined' && module.exports) module.exports = initTanglishToTamil;
