const STORAGE_KEY = 'bemke_a11y_contrast_mode';
const CONTROLS_CONTAINER_ID = 'brxe-qcwgax';
const BOOT_FLAG = '__bemkeContrastControlsBooted';

const CONTRAST_MODES = new Map([
  ['default', 'Domyślny kontrast'],
  ['white-black', 'Biały tekst na czarnym tle'],
  ['black-yellow', 'Czarny tekst na żółtym tle'],
  ['yellow-black', 'Żółty tekst na czarnym tle'],
]);

function getControlsContainer() {
  return document.getElementById(CONTROLS_CONTAINER_ID);
}

function getControls() {
  const container = getControlsContainer();
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll('[data-contrast]'));
}

function normalizeMode(mode) {
  return CONTRAST_MODES.has(mode) ? mode : 'default';
}

function applyContrastMode(mode) {
  document.documentElement.setAttribute('data-contrast', normalizeMode(mode));
}

function getSavedMode() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved ? normalizeMode(saved) : null;
}

function setPressedState(activeMode) {
  getControls().forEach((element) => {
    const mode = normalizeMode(element.getAttribute('data-contrast'));
    element.setAttribute('aria-pressed', mode === activeMode ? 'true' : 'false');
  });
}

function decorateControls() {
  getControls().forEach((element) => {
    const mode = normalizeMode(element.getAttribute('data-contrast'));

    if (element.tagName === 'A' && !element.getAttribute('href')) {
      element.setAttribute('href', '#');
    }

    element.setAttribute('role', 'button');
    element.setAttribute('aria-label', CONTRAST_MODES.get(mode) ?? 'Tryb kontrastu');
    element.setAttribute('data-a11y-contrast-fixed', 'true');

    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function activateMode(mode) {
  const normalizedMode = normalizeMode(mode);
  applyContrastMode(normalizedMode);
  window.localStorage.setItem(STORAGE_KEY, normalizedMode);
  setPressedState(normalizedMode);
}

function resolveControl(target) {
  if (!target) {
    return null;
  }

  const control = target.closest(`#${CONTROLS_CONTAINER_ID} [data-contrast]`);
  if (!control) {
    return null;
  }

  return normalizeMode(control.getAttribute('data-contrast'));
}

function handleClick(event) {
  const mode = resolveControl(event.target);
  if (!mode) {
    return;
  }

  event.preventDefault();
  activateMode(mode);
}

function handleKeydown(event) {
  if (event.key !== ' ' && event.key !== 'Enter') {
    return;
  }

  const mode = resolveControl(event.target);
  if (!mode) {
    return;
  }

  event.preventDefault();
  activateMode(mode);
}

export function initContrastControls() {
  if (!getControlsContainer()) {
    return;
  }

  decorateControls();

  const initialMode = getSavedMode() ?? 'default';
  activateMode(initialMode);

  if (window[BOOT_FLAG]) {
    return;
  }

  window[BOOT_FLAG] = true;
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeydown);
}
