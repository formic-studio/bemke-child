const STORAGE_KEY = 'bemke_a11y_font_scale';

const SCALE_CONTROLS = [
  {
    id: 'brxe-qmbqwm',
    scale: 1,
    label: 'Normalny rozmiar tekstu',
  },
  {
    id: 'brxe-cqxcbv',
    scale: 1.15,
    label: 'Duży rozmiar tekstu',
  },
  {
    id: 'brxe-toalqu',
    scale: 1.3,
    label: 'Bardzo duży rozmiar tekstu',
  },
];

function applyFontScale(scale) {
  const root = document.documentElement;
  root.style.setProperty('--a11y-font-scale', String(scale));
  root.setAttribute('data-a11y-font-scale', String(scale));
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
}
