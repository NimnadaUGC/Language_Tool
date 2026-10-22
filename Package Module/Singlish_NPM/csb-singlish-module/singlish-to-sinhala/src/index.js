// Main entry point for the Singlish to Sinhala converter package
import './sinhala-toggle.css';
import { initializeSinhalaInput, resetState } from './sinhala-input.js';

const SPEED_CONFIG = {
  slow: { value: 0, delay: 750, label: 'Slow', description: 'Slow Typing Speed' },
  moderate: { value: 1, delay: 500, label: 'Moderate', description: 'Moderate Typing Speed' },
  fast: { value: 2, delay: 250, label: 'Fast', description: 'Fast Typing Speed' }
};

const DEFAULT_PLACEMENT = {
  offsetX: 20,
  offsetY: 20,
  smartFit: true
};

const THEME_VARIABLES = {
  fontFamily: '--sinhala-toggle-font-family',
  baseFontSize: '--sinhala-toggle-base-font-size',
  background: '--sinhala-toggle-background',
  textColor: '--sinhala-toggle-text-color',
  accentColor: '--sinhala-toggle-accent-color',
  mutedColor: '--sinhala-toggle-muted-color',
  borderColor: '--sinhala-toggle-border-color',
  toggleOffColor: '--sinhala-toggle-off-color',
  radius: '--sinhala-toggle-radius',
  shadow: '--sinhala-toggle-shadow'
};

let activeSettings = null;

/**
 * Initialize the Singlish to Sinhala converter
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoAddToggle - Automatically add the toggle button (default: true)
 * @param {string} options.togglePosition - Position of toggle ('bottom-right', 'bottom-left', 'top-right', 'top-left') (default: 'bottom-right')
 * @param {boolean} options.startEnabled - Start with conversion enabled (default: false)
 * @param {Object} options.placement - Placement offsets and smart-fit behavior
 * @param {Object} options.theme - Theme values mapped to CSS custom properties
 * @returns {Object} - API object with control methods
 */
function initSinglishToSinhala(options = {}) {
  const {
    autoAddToggle = true,
    togglePosition = 'bottom-right',
    startEnabled = false,
    placement = {},
    theme = {}
  } = options;

  const normalizedPlacement = { ...DEFAULT_PLACEMENT, ...placement };

  if (autoAddToggle) {
    addToggleToDOM(togglePosition, startEnabled, {
      placement: normalizedPlacement,
      theme
    });
  }

  initializeSinhalaInput(startEnabled);

  const api = {
    enable: () => {
      const toggle = document.getElementById('sinhalaToggle');
      if (toggle) {
        toggle.checked = true;
        toggle.dispatchEvent(new Event('change'));
      }
      setStoredValue('sinhalaInputEnabled', 'true');
    },
    disable: () => {
      const toggle = document.getElementById('sinhalaToggle');
      if (toggle) {
        toggle.checked = false;
        toggle.dispatchEvent(new Event('change'));
      }
      setStoredValue('sinhalaInputEnabled', 'false');
      resetState();
    },
    isEnabled: () => getStoredValue('sinhalaInputEnabled') === 'true',
    setTypingSpeed: (speed) => {
      if (!SPEED_CONFIG[speed]) return;

      setStoredValue('sinhalaTypingSpeed', speed);
      updateTypingDelay(SPEED_CONFIG[speed].delay);
      updateSpeedUi(speed);
    },
    getTypingSpeed: () => normalizeSpeed(getStoredValue('sinhalaTypingSpeed')),
    setTheme: (nextTheme = {}) => {
      const container = document.getElementById('sinhala-toggle-container');
      if (container) {
        applyTheme(container, nextTheme);
      }
    },
    toggle: () => {
      const toggle = document.getElementById('sinhalaToggle');
      if (toggle) {
        toggle.checked = !toggle.checked;
        toggle.dispatchEvent(new Event('change'));
      }
    }
  };

  publishGlobalInstance(api);

  return api;
}

function addToggleToDOM(position = 'bottom-right', startEnabled = false, options = {}) {
  const existingToggle = document.getElementById('sinhala-toggle-container');
  if (existingToggle) {
    existingToggle.parentNode.removeChild(existingToggle);
  }

  const placement = { ...DEFAULT_PLACEMENT, ...(options.placement || {}) };
  const normalizedPosition = normalizePosition(position);
  const container = document.createElement('div');
  container.id = 'sinhala-toggle-container';
  container.className = `sinhala-toggle-container sinhala-position-${normalizedPosition}`;
  container.setAttribute('data-position', normalizedPosition);

  applyPlacement(container, normalizedPosition, placement);
  applyTheme(container, options.theme || {});
  container.innerHTML = createToggleMarkup(startEnabled);

  document.body.appendChild(container);

  activeSettings = {
    container,
    settingsButton: document.getElementById('sinhalaSettings'),
    settingsPopup: document.getElementById('speedSettingsPopup'),
    smartFit: placement.smartFit !== false
  };

  const savedSpeed = normalizeSpeed(getStoredValue('sinhalaTypingSpeed'));
  updateSpeedUi(savedSpeed);
  bindToggleEvents(activeSettings);
}

function createToggleMarkup(startEnabled) {
  return `
    <div class="sinhala-toggle-label">සිංහල</div>
    <label class="sinhala-switch" aria-label="Toggle Sinhala typing">
      <input type="checkbox" id="sinhalaToggle" ${startEnabled ? 'checked' : ''}>
      <span class="sinhala-slider" aria-hidden="true"></span>
    </label>
    <button class="sinhala-settings-button" id="sinhalaSettings" type="button" aria-label="Typing speed settings" aria-expanded="false" aria-controls="speedSettingsPopup">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"></path>
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2.1 2.1 0 1 1-2.98 2.98l-.05-.05A1.8 1.8 0 0 0 14.8 19.6a1.8 1.8 0 0 0-1.1 1.65V21.4a2.1 2.1 0 1 1-4.2 0v-.15A1.8 1.8 0 0 0 8.4 19.6a1.8 1.8 0 0 0-1.98.36l-.05.05a2.1 2.1 0 1 1-2.98-2.98l.05-.05A1.8 1.8 0 0 0 3.8 15a1.8 1.8 0 0 0-1.65-1.1H2a2.1 2.1 0 1 1 0-4.2h.15A1.8 1.8 0 0 0 3.8 8.6a1.8 1.8 0 0 0-.36-1.98l-.05-.05a2.1 2.1 0 1 1 2.98-2.98l.05.05A1.8 1.8 0 0 0 8.4 4a1.8 1.8 0 0 0 1.1-1.65V2.2a2.1 2.1 0 1 1 4.2 0v.15A1.8 1.8 0 0 0 14.8 4a1.8 1.8 0 0 0 1.98-.36l.05-.05a2.1 2.1 0 1 1 2.98 2.98l-.05.05A1.8 1.8 0 0 0 19.4 8.6a1.8 1.8 0 0 0 1.65 1.1h.15a2.1 2.1 0 1 1 0 4.2h-.15A1.8 1.8 0 0 0 19.4 15Z"></path>
      </svg>
    </button>
    <div class="sinhala-speed-popup" id="speedSettingsPopup" role="dialog" aria-labelledby="speedSettingsTitle">
      <div class="sinhala-speed-content">
        <h4 id="speedSettingsTitle">Typing Speed</h4>
        <div class="sinhala-speed-options" role="group" aria-label="Typing speed">
          ${createSpeedButton('slow')}
          ${createSpeedButton('moderate')}
          ${createSpeedButton('fast')}
        </div>
        <div class="sinhala-speed-meter" aria-hidden="true">
          <span class="sinhala-speed-meter-bar"></span>
          <span class="sinhala-speed-meter-bar"></span>
          <span class="sinhala-speed-meter-bar"></span>
        </div>
        <div class="sinhala-speed-description" id="speedDescription">Moderate Typing Speed</div>
      </div>
    </div>
  `;
}

function createSpeedButton(speed) {
  const config = SPEED_CONFIG[speed];
  return `
    <button class="sinhala-speed-button" type="button" data-speed="${speed}" aria-pressed="false">
      <span class="sinhala-speed-icon" aria-hidden="true">${createSpeedBars(config.value + 1)}</span>
      <span>${config.label}</span>
    </button>
  `;
}

function createSpeedBars(activeBars) {
  return [1, 2, 3]
    .map((bar) => `<span class="${bar <= activeBars ? 'is-on' : ''}"></span>`)
    .join('');
}

function bindToggleEvents(settings) {
  const { container, settingsButton, settingsPopup } = settings;

  if (!container || !settingsButton || !settingsPopup) return;

  settingsButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const shouldOpen = !settingsPopup.classList.contains('active');
    setPopupOpen(shouldOpen);
  });

  settingsPopup.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  settingsPopup.querySelectorAll('.sinhala-speed-button').forEach((button) => {
    button.addEventListener('click', () => {
      const speed = button.getAttribute('data-speed');
      if (!SPEED_CONFIG[speed]) return;

      setStoredValue('sinhalaTypingSpeed', speed);
      updateTypingDelay(SPEED_CONFIG[speed].delay);
      updateSpeedUi(speed);
      positionPopup();
    });
  });

  document.addEventListener('click', (event) => {
    if (!container.contains(event.target)) {
      setPopupOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && settingsPopup.classList.contains('active')) {
      setPopupOpen(false);
      settingsButton.focus();
    }
  });

  window.addEventListener('resize', positionPopup);
  window.addEventListener('scroll', positionPopup, true);
}

function setPopupOpen(isOpen) {
  if (!activeSettings || !activeSettings.settingsPopup || !activeSettings.settingsButton) return;

  activeSettings.settingsPopup.classList.toggle('active', isOpen);
  activeSettings.settingsButton.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    positionPopup();
  } else {
    resetPopupPosition(activeSettings.settingsPopup);
  }
}

function positionPopup() {
  if (
    !activeSettings ||
    !activeSettings.smartFit ||
    !activeSettings.settingsPopup.classList.contains('active')
  ) {
    return;
  }

  const { container, settingsPopup } = activeSettings;
  const viewportGap = 12;
  resetPopupPosition(settingsPopup);

  const containerRect = container.getBoundingClientRect();
  const popupRect = settingsPopup.getBoundingClientRect();
  const preferTop = containerRect.top > window.innerHeight - containerRect.bottom;

  let top = preferTop
    ? containerRect.top - popupRect.height - 10
    : containerRect.bottom + 10;
  let left = containerRect.left + containerRect.width - popupRect.width;

  if (top < viewportGap) {
    top = Math.min(containerRect.bottom + 10, window.innerHeight - popupRect.height - viewportGap);
  }

  if (top + popupRect.height > window.innerHeight - viewportGap) {
    top = Math.max(viewportGap, containerRect.top - popupRect.height - 10);
  }

  left = Math.max(viewportGap, Math.min(left, window.innerWidth - popupRect.width - viewportGap));

  const desiredTop = Math.max(viewportGap, top);
  const desiredLeft = left;

  settingsPopup.style.position = 'fixed';
  settingsPopup.style.top = `${desiredTop}px`;
  settingsPopup.style.left = `${desiredLeft}px`;
  settingsPopup.style.right = 'auto';
  settingsPopup.style.bottom = 'auto';

  const adjustedRect = settingsPopup.getBoundingClientRect();
  const deltaTop = desiredTop - adjustedRect.top;
  const deltaLeft = desiredLeft - adjustedRect.left;

  if (Math.abs(deltaTop) > 1 || Math.abs(deltaLeft) > 1) {
    settingsPopup.style.top = `${desiredTop + deltaTop}px`;
    settingsPopup.style.left = `${desiredLeft + deltaLeft}px`;
  }
}

function resetPopupPosition(settingsPopup) {
  settingsPopup.style.position = '';
  settingsPopup.style.top = '';
  settingsPopup.style.left = '';
  settingsPopup.style.right = '';
  settingsPopup.style.bottom = '';
}

function updateSpeedUi(speed) {
  const normalizedSpeed = normalizeSpeed(speed);
  const speedSlider = document.getElementById('speedSlider');

  if (speedSlider) {
    speedSlider.value = SPEED_CONFIG[normalizedSpeed].value;
  }

  document.querySelectorAll('.sinhala-speed-button, .speed-label').forEach((control) => {
    const isActive = control.getAttribute('data-speed') === normalizedSpeed;
    control.classList.toggle('active', isActive);
    control.setAttribute('aria-pressed', String(isActive));
  });

  const meter = document.querySelector('.sinhala-speed-meter');
  if (meter) {
    meter.setAttribute('data-speed', normalizedSpeed);
  }

  const speedDescription = document.getElementById('speedDescription');
  if (speedDescription) {
    speedDescription.textContent = SPEED_CONFIG[normalizedSpeed].description;
  }
}

function applyPlacement(container, position, placement) {
  const offsetX = normalizeCssLength(placement.offsetX, DEFAULT_PLACEMENT.offsetX);
  const offsetY = normalizeCssLength(placement.offsetY, DEFAULT_PLACEMENT.offsetY);

  container.style.top = 'auto';
  container.style.right = 'auto';
  container.style.bottom = 'auto';
  container.style.left = 'auto';

  if (position.includes('top')) {
    container.style.top = offsetY;
  } else {
    container.style.bottom = offsetY;
  }

  if (position.includes('left')) {
    container.style.left = offsetX;
  } else {
    container.style.right = offsetX;
  }
}

function applyTheme(container, theme) {
  Object.keys(theme || {}).forEach((key) => {
    const cssVariable = THEME_VARIABLES[key];
    const value = theme[key];

    if (cssVariable && value !== undefined && value !== null) {
      container.style.setProperty(cssVariable, String(value));
    }
  });
}

function publishGlobalInstance(api) {
  if (typeof window === 'undefined') return;

  window.singlishToSinhala = initSinglishToSinhala;
  window.singlishToSinhalaInstance = api;

  Object.keys(api).forEach((methodName) => {
    window.singlishToSinhala[methodName] = api[methodName];
  });
}

function normalizePosition(position) {
  return ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(position)
    ? position
    : 'bottom-right';
}

function normalizeSpeed(speed) {
  return SPEED_CONFIG[speed] ? speed : 'moderate';
}

function normalizeCssLength(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return `${fallback}px`;
  }

  return typeof value === 'number' ? `${value}px` : String(value);
}

function updateTypingDelay(delayMs) {
  if (typeof window !== 'undefined') {
    window.SINHALA_TYPING_DELAY = delayMs;
  }
}

function getStoredValue(key) {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch (error) {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    // Ignore storage failures so the converter can still run in restricted contexts.
  }
}

function getTypingDelayFromSpeed(speed) {
  return SPEED_CONFIG[normalizeSpeed(speed)].delay;
}

if (typeof window !== 'undefined') {
  window.singlishToSinhala = initSinglishToSinhala;

  // Auto-initialize if autoInit is not disabled.
  if (!window.SINGLISH_NO_AUTO_INIT) {
    function initOnReady() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          initSinglishToSinhala();
        });
      } else {
        initSinglishToSinhala();
      }
    }

    initOnReady();
  }
}

export default initSinglishToSinhala;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = initSinglishToSinhala;
}
