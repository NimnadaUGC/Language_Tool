// Main entry point for the Hinglish to Hindi converter package
import './hindi-toggle.css';
import { initializeHindiInput, resetState, setHindiInputEnabled, setHindiTypingDelay } from './hindi-input.js';

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
  fontFamily: '--hindi-toggle-font-family',
  baseFontSize: '--hindi-toggle-base-font-size',
  background: '--hindi-toggle-background',
  textColor: '--hindi-toggle-text-color',
  accentColor: '--hindi-toggle-accent-color',
  mutedColor: '--hindi-toggle-muted-color',
  borderColor: '--hindi-toggle-border-color',
  toggleOffColor: '--hindi-toggle-off-color',
  radius: '--hindi-toggle-radius',
  shadow: '--hindi-toggle-shadow'
};

let activeSettings = null;
let globalEventsBound = false;

/**
 * Initialize the Hinglish to Hindi converter
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoAddToggle - Automatically add the toggle button (default: true)
 * @param {string} options.togglePosition - Position of toggle ('bottom-right', 'bottom-left', 'top-right', 'top-left') (default: 'bottom-right')
 * @param {boolean} options.startEnabled - Start with conversion enabled (default: false)
 * @param {Object} options.placement - Placement offsets and smart-fit behavior
 * @param {Object} options.theme - Theme values mapped to CSS custom properties
 * @returns {Object} - API object with control methods
 */
function initHinglishToHindi(options = {}) {
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

  initializeHindiInput(startEnabled);

  const api = {
    enable: () => setEnabled(true),
    disable: () => setEnabled(false),
    isEnabled: () => getStoredValue('hindiInputEnabled') === 'true',
    setTypingSpeed: (speed) => {
      if (!SPEED_CONFIG[speed]) return;

      setStoredValue('hindiTypingSpeed', speed);
      updateTypingDelay(SPEED_CONFIG[speed].delay);
      updateSpeedUi(speed);
    },
    getTypingSpeed: () => normalizeSpeed(getStoredValue('hindiTypingSpeed')),
    setTheme: (nextTheme = {}) => {
      const container = document.getElementById('hindi-toggle-container');
      if (container) {
        applyTheme(container, nextTheme);
      }
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
  const toggle = document.getElementById('hindiToggle');
  if (toggle) {
    toggle.checked = enabled;
    toggle.dispatchEvent(new Event('change'));
  } else {
    setHindiInputEnabled(enabled);
  }
  if (!enabled) resetState();
}

function addToggleToDOM(position = 'bottom-right', startEnabled = false, options = {}) {
  const existingToggle = document.getElementById('hindi-toggle-container');
  if (existingToggle) {
    existingToggle.parentNode.removeChild(existingToggle);
  }

  const placement = { ...DEFAULT_PLACEMENT, ...(options.placement || {}) };
  const normalizedPosition = normalizePosition(position);
  const container = document.createElement('div');
  container.id = 'hindi-toggle-container';
  container.className = `hindi-toggle-container hindi-position-${normalizedPosition}`;
  container.setAttribute('data-position', normalizedPosition);

  applyPlacement(container, normalizedPosition, placement);
  applyTheme(container, options.theme || {});
  container.innerHTML = createToggleMarkup(startEnabled);

  document.body.appendChild(container);

  activeSettings = {
    container,
    settingsButton: document.getElementById('hindiSettings'),
    settingsPopup: document.getElementById('hindiSpeedSettingsPopup'),
    smartFit: placement.smartFit !== false
  };

  const savedSpeed = normalizeSpeed(getStoredValue('hindiTypingSpeed'));
  updateSpeedUi(savedSpeed);
  bindToggleEvents(activeSettings);
}

function createToggleMarkup(startEnabled) {
  return `
    <div class="hindi-toggle-label">हिंदी</div>
    <label class="hindi-switch" aria-label="Toggle Hindi typing">
      <input type="checkbox" id="hindiToggle" ${startEnabled ? 'checked' : ''}>
      <span class="hindi-slider" aria-hidden="true"></span>
    </label>
    <button class="hindi-settings-button" id="hindiSettings" type="button" aria-label="Typing speed settings" aria-expanded="false" aria-controls="hindiSpeedSettingsPopup">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"></path>
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2.1 2.1 0 1 1-2.98 2.98l-.05-.05A1.8 1.8 0 0 0 14.8 19.6a1.8 1.8 0 0 0-1.1 1.65V21.4a2.1 2.1 0 1 1-4.2 0v-.15A1.8 1.8 0 0 0 8.4 19.6a1.8 1.8 0 0 0-1.98.36l-.05.05a2.1 2.1 0 1 1-2.98-2.98l.05-.05A1.8 1.8 0 0 0 3.8 15a1.8 1.8 0 0 0-1.65-1.1H2a2.1 2.1 0 1 1 0-4.2h.15A1.8 1.8 0 0 0 3.8 8.6a1.8 1.8 0 0 0-.36-1.98l-.05-.05a2.1 2.1 0 1 1 2.98-2.98l.05.05A1.8 1.8 0 0 0 8.4 4a1.8 1.8 0 0 0 1.1-1.65V2.2a2.1 2.1 0 1 1 4.2 0v.15A1.8 1.8 0 0 0 14.8 4a1.8 1.8 0 0 0 1.98-.36l.05-.05a2.1 2.1 0 1 1 2.98 2.98l-.05.05A1.8 1.8 0 0 0 19.4 8.6a1.8 1.8 0 0 0 1.65 1.1h.15a2.1 2.1 0 1 1 0 4.2h-.15A1.8 1.8 0 0 0 19.4 15Z"></path>
      </svg>
    </button>
    <div class="hindi-speed-popup" id="hindiSpeedSettingsPopup" role="dialog" aria-labelledby="hindiSpeedSettingsTitle">
      <div class="hindi-speed-content">
        <h4 id="hindiSpeedSettingsTitle">Typing Speed</h4>
        <div class="hindi-speed-options" role="group" aria-label="Typing speed">
          ${createSpeedButton('slow')}
          ${createSpeedButton('moderate')}
          ${createSpeedButton('fast')}
        </div>
        <div class="hindi-speed-meter" aria-hidden="true">
          <span class="hindi-speed-meter-bar"></span>
          <span class="hindi-speed-meter-bar"></span>
          <span class="hindi-speed-meter-bar"></span>
        </div>
        <div class="hindi-speed-description" id="hindiSpeedDescription">Moderate Typing Speed</div>
      </div>
    </div>
  `;
}

function createSpeedButton(speed) {
  const config = SPEED_CONFIG[speed];
  return `
    <button class="hindi-speed-button" type="button" data-speed="${speed}" aria-pressed="false">
      <span class="hindi-speed-icon" aria-hidden="true">${createSpeedBars(config.value + 1)}</span>
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
    setPopupOpen(!settingsPopup.classList.contains('active'));
  });

  settingsPopup.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  settingsPopup.querySelectorAll('.hindi-speed-button').forEach((button) => {
    button.addEventListener('click', () => {
      const speed = button.getAttribute('data-speed');
      if (!SPEED_CONFIG[speed]) return;

      setStoredValue('hindiTypingSpeed', speed);
      updateTypingDelay(SPEED_CONFIG[speed].delay);
      updateSpeedUi(speed);
      positionPopup();
    });
  });

  if (!globalEventsBound) {
    globalEventsBound = true;

    document.addEventListener('click', (event) => {
      if (activeSettings && !activeSettings.container.contains(event.target)) {
        setPopupOpen(false);
      }
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
  if (!activeSettings || !activeSettings.settingsPopup || !activeSettings.settingsButton) return;

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

  document.querySelectorAll('.hindi-speed-button, .speed-label').forEach((control) => {
    const isActive = control.getAttribute('data-speed') === normalizedSpeed;
    control.classList.toggle('active', isActive);
    control.setAttribute('aria-pressed', String(isActive));
  });

  const meter = document.querySelector('.hindi-speed-meter');
  if (meter) {
    meter.setAttribute('data-speed', normalizedSpeed);
  }

  const hindiSpeedDescription = document.getElementById('hindiSpeedDescription');
  if (hindiSpeedDescription) {
    hindiSpeedDescription.textContent = SPEED_CONFIG[normalizedSpeed].description;
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

  window.hinglishToHindi = initHinglishToHindi;
  window.hinglishToHindiInstance = api;

  Object.keys(api).forEach((methodName) => {
    window.hinglishToHindi[methodName] = api[methodName];
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
  setHindiTypingDelay(delayMs);
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
  window.hinglishToHindi = initHinglishToHindi;

  // Auto-initialize if autoInit is not disabled.
  if (!window.HINGLISH_NO_AUTO_INIT) {
    function initOnReady() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          initHinglishToHindi();
        });
      } else {
        initHinglishToHindi();
      }
    }

    initOnReady();
  }
}

export default initHinglishToHindi;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = initHinglishToHindi;
}
