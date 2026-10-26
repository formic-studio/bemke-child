import { ensureButtonElement } from './semantic-button.js';
import { isEnglishPage } from './site-language.js';

const STORAGE_KEY = 'bemke_a11y_contrast_mode';
const CONTROLS_CONTAINER_ID = 'brxe-qcwgax';
const BOOT_FLAG = '__bemkeContrastControlsBooted';
const TRANSLUCENT_SURFACE_CLASS = 'bemke-a11y-translucent-surface';
const DESCRIPTION_CLASS = 'bemke-contrast-control-description';

const CONTRAST_MODES = new Map([
  ['default', 'domyślny kontrast'],
  ['white-black', 'biały tekst na czarnym tle'],
  ['black-yellow', 'czarny tekst na żółtym tle'],
  ['yellow-black', 'żółty tekst na czarnym tle'],
]);
const CONTRAST_MODES_EN = new Map([
  ['default', 'default contrast'],
  ['white-black', 'white text on a black background'],
  ['black-yellow', 'black text on a yellow background'],
  ['yellow-black', 'yellow text on a black background'],
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
    const button = ensureButtonElement(element);

    const labels = isEnglishPage() ? CONTRAST_MODES_EN : CONTRAST_MODES;
    const label = labels.get(mode) ?? (isEnglishPage() ? 'Contrast mode' : 'Tryb kontrastu');
    const accessibleLabel = `A — ${label}`;
    let description = button.querySelector(`.${DESCRIPTION_CLASS}`);

    if (!description) {
      description = document.createElement('span');
      description.className = `${DESCRIPTION_CLASS} bemke-sr-only`;
      button.appendChild(description);
    }

    description.textContent = ` — ${label}`;
    button.removeAttribute('aria-label');
    button.setAttribute('title', accessibleLabel);
    button.setAttribute('data-a11y-contrast-fixed', 'true');
  });
}

function decorateTranslucentSurfaces(scope = document) {
  scope.querySelectorAll('.brxe-block, .brxe-container').forEach((element) => {
    if (element.classList.contains(TRANSLUCENT_SURFACE_CLASS)) {
      return;
    }

    const styles = window.getComputedStyle(element);
    const backdropFilter =
      styles.backdropFilter ||
      styles.getPropertyValue('-webkit-backdrop-filter');

    if (backdropFilter && backdropFilter !== 'none') {
      element.classList.add(TRANSLUCENT_SURFACE_CLASS);
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
  decorateTranslucentSurfaces();

  const initialMode = getSavedMode() ?? 'default';
  activateMode(initialMode);

  if (window[BOOT_FLAG]) {
    return;
  }

  window[BOOT_FLAG] = true;
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('bricks/ajax/end', () => {
    decorateTranslucentSurfaces();
  });
}
