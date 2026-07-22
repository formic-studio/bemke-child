const STORAGE_KEY = 'bemke_a11y_font_scale';
const CONTROLS_CONTAINER_ID = 'brxe-kecesp';
const BOOT_FLAG = '__bemkeFontSizeControlsBooted';

export const FONT_SCALE_CHANGE_EVENT = 'bemke:font-scale-change';

const SCALE_CONTROLS = [
  {
    id: 'brxe-qmbqwm',
    label: 'Normalny rozmiar tekstu',
    scale: 1,
  },
  {
    id: 'brxe-cqxcbv',
    label: 'Duży rozmiar tekstu',
    scale: 1.125,
  },
  {
    id: 'brxe-toalqu',
    label: 'Bardzo duży rozmiar tekstu',
    scale: 1.25,
  },
];

function getControlsContainer() {
  return document.getElementById(CONTROLS_CONTAINER_ID);
}

function getInteractiveControls() {
  const container = getControlsContainer();
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll('a, button'));
}

function applyFontScale(scale) {
  const root = document.documentElement;
  const previousScale = Number.parseFloat(
    root.style.getPropertyValue('--a11y-font-scale')
  );

  root.style.setProperty('--a11y-font-scale', String(scale));

  if (!Number.isFinite(previousScale) || previousScale !== scale) {
    document.dispatchEvent(
      new CustomEvent(FONT_SCALE_CHANGE_EVENT, {
        detail: { scale },
      })
    );
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

function findClosestControl(scale) {
  let closest = SCALE_CONTROLS[0];
  let minDiff = Math.abs(scale - closest.scale);

  SCALE_CONTROLS.forEach((control) => {
    const diff = Math.abs(scale - control.scale);
    if (diff < minDiff) {
      closest = control;
      minDiff = diff;
    }
  });

  return closest;
}

function decorateControls() {
  const elements = getInteractiveControls();

  elements.forEach((element, index) => {
    const control = SCALE_CONTROLS[index];
    if (!control) {
      return;
    }

    if (element.tagName === 'A' && !element.getAttribute('href')) {
      element.setAttribute('href', '#');
    }

    element.setAttribute('role', 'button');
    element.setAttribute('aria-label', control.label);
    element.setAttribute('data-a11y-scale', String(control.scale));

    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function setPressedState(activeScale) {
  getInteractiveControls().forEach((element) => {
    const scale = Number(element.getAttribute('data-a11y-scale'));
    element.setAttribute(
      'aria-pressed',
      Number.isFinite(scale) && scale === activeScale ? 'true' : 'false'
    );
  });
}

function resolveControl(element) {
  if (!element) {
    return null;
  }

  const label = element.getAttribute('aria-label');
  const byLabel = SCALE_CONTROLS.find((control) => control.label === label);
  if (byLabel) {
    return byLabel;
  }

  const byId = SCALE_CONTROLS.find((control) => control.id === element.id);
  if (byId) {
    return byId;
  }

  const controls = getInteractiveControls();
  const index = controls.indexOf(element);
  return index >= 0 ? SCALE_CONTROLS[index] ?? null : null;
}

function activateControl(control) {
  if (!control) {
    return;
  }

  applyFontScale(control.scale);
  window.localStorage.setItem(STORAGE_KEY, String(control.scale));
  setPressedState(control.scale);
}

function handleControlClick(event) {
  const target = event.target.closest(`#${CONTROLS_CONTAINER_ID} a, #${CONTROLS_CONTAINER_ID} button`);
  if (!target) {
    return;
  }

  const control = resolveControl(target);
  if (!control) {
    return;
  }

  event.preventDefault();
  activateControl(control);
}

function handleControlKeydown(event) {
  if (event.key !== ' ' && event.key !== 'Enter') {
    return;
  }

  const target = event.target.closest(`#${CONTROLS_CONTAINER_ID} a, #${CONTROLS_CONTAINER_ID} button`);
  if (!target) {
    return;
  }

  const control = resolveControl(target);
  if (!control) {
    return;
  }

  event.preventDefault();
  activateControl(control);
}

export function initFontSizeControls() {
  if (!getControlsContainer()) {
    return;
  }

  if (window[BOOT_FLAG]) {
    decorateControls();
    return;
  }

  window[BOOT_FLAG] = true;

  decorateControls();

  const initialControl = findClosestControl(
    getSavedScale() ?? SCALE_CONTROLS[0].scale
  );

  activateControl(initialControl);

  document.addEventListener('click', handleControlClick);
  document.addEventListener('keydown', handleControlKeydown);
}
