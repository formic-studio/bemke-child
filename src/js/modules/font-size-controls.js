const STORAGE_KEY = 'bemke_a11y_font_scale';
let currentScale = 1;

const SCALE_CONTROLS = [
  {
    id: 'brxe-qmbqwm',
    scale: 1,
    label: 'Normalny rozmiar tekstu',
  },
  {
    id: 'brxe-cqxcbv',
    scale: 1.125,
    label: 'Duży rozmiar tekstu',
  },
  {
    id: 'brxe-toalqu',
    scale: 1.25,
    label: 'Bardzo duży rozmiar tekstu',
  },
];

function applyFontScale(scale) {
  const root = document.documentElement;
  currentScale = scale;
  root.style.setProperty('--a11y-font-scale', String(scale));

  // Fallback: enforce a scaled root font-size in px for browsers that
  // don't reliably re-evaluate the CSS calc() chain with custom properties.
  const previousInlineFontSize = root.style.fontSize;
  const previousInlineScale = root.style.getPropertyValue('--a11y-font-scale');

  root.style.removeProperty('font-size');
  root.style.setProperty('--a11y-font-scale', '1');

  const baseFontSizePx = Number.parseFloat(
    window.getComputedStyle(root).fontSize
  );
  const safeBaseFontSizePx = Number.isFinite(baseFontSizePx) ? baseFontSizePx : 16;

  root.style.fontSize = `${(safeBaseFontSizePx * scale).toFixed(3)}px`;
  root.style.setProperty('--a11y-font-scale', previousInlineScale || String(scale));

  if (!previousInlineFontSize && scale === 1) {
    root.style.removeProperty('font-size');
  }
}

function getSavedScale() {
  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return null;
  }

  const parsed = Number(saved);
  return Number.isFinite(parsed) ? parsed : null;
}

function setPressedState(activeId) {
  SCALE_CONTROLS.forEach(({ id }) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    element.setAttribute('aria-pressed', id === activeId ? 'true' : 'false');
  });
}

function findClosestControlId(scale) {
  let closest = SCALE_CONTROLS[0];
  let minDiff = Math.abs(scale - closest.scale);

  SCALE_CONTROLS.forEach((control) => {
    const diff = Math.abs(scale - control.scale);
    if (diff < minDiff) {
      closest = control;
      minDiff = diff;
    }
  });

  return closest.id;
}

function bindControl({ id, scale, label }) {
  const element = document.getElementById(id);
  if (!element) {
    return false;
  }

  if (element.tagName === 'A' && !element.getAttribute('href')) {
    element.setAttribute('href', '#');
  }

  element.setAttribute('role', 'button');
  element.setAttribute('aria-label', label);

  const isNaturallyFocusable =
    element.matches('a[href]') ||
    element.matches('button') ||
    element.matches('input') ||
    element.matches('select') ||
    element.matches('textarea') ||
    element.hasAttribute('tabindex');

  if (!isNaturallyFocusable) {
    element.setAttribute('tabindex', '0');
  }

  element.addEventListener('click', (event) => {
    event.preventDefault();
    applyFontScale(scale);
    window.localStorage.setItem(STORAGE_KEY, String(scale));
    setPressedState(id);
  });

  element.addEventListener('keydown', (event) => {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    element.click();
  });

  return true;
}

export function initFontSizeControls() {
  const hasAnyControl = SCALE_CONTROLS.some((control) => bindControl(control));
  if (!hasAnyControl) {
    return;
  }

  const savedScale = getSavedScale();
  const initialScale = savedScale ?? SCALE_CONTROLS[0].scale;
  const activeId = findClosestControlId(initialScale);

  applyFontScale(initialScale);
  setPressedState(activeId);

  window.addEventListener(
    'resize',
    () => {
      applyFontScale(currentScale);
    },
    { passive: true }
  );
}
