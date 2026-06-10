const TEAM_POPUP_SELECTOR = '.popup-team[data-number]';
const TEAM_LINK_SELECTOR = '[data-number]:not(.popup-team)';
const TEAM_EXIT_SELECTOR = '.exit-button';
const TEAM_POPUP_READY_ATTR = 'data-bemke-team-popup-ready';
const TEAM_POPUP_BOOTED_FLAG = '__bemkeTeamPopupBooted';
const OVERLAY_CLASS = 'bemke-team-popup-overlay';
const OVERLAY_VISIBLE_CLASS = 'is-visible';
const POPUP_CLASS = 'bemke-team-popup';
const POPUP_VISIBLE_CLASS = 'is-visible';
const POPUP_PORTAL_CLASS = 'bemke-team-popup-portal';

let popupMap = new Map();
let activePopup = null;
let activeTrigger = null;
let popupOverlay = null;
let popupPortal = null;
const popupOriginalPlacement = new Map();

export function initTeamPopups() {
  setupTeamPopupElements();
  setupTeamPopupLifecycle();
}

function setupTeamPopupElements(scope = document) {
  popupMap = new Map();
  const popups = Array.from(scope.querySelectorAll(TEAM_POPUP_SELECTOR));

  if (!popups.length) {
    closeTeamPopup();
    return;
  }

  ensurePopupOverlay();
  ensurePopupPortal();

  popups.forEach((popup) => {
    const number = normalizeNumber(popup.dataset.number);

    if (!number) {
      return;
    }

    popup.classList.add(POPUP_CLASS);
    popup.setAttribute(TEAM_POPUP_READY_ATTR, '1');
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-hidden', 'true');
    popup.setAttribute('tabindex', '-1');
    popup.setAttribute('hidden', '');

    if (popup.getAttribute('aria-label') === null) {
      popup.setAttribute('aria-label', `Zespół: ${number}`);
    }

    addPopupByNumber(number, popup);
  });
}

function setupTeamPopupLifecycle() {
  if (window[TEAM_POPUP_BOOTED_FLAG]) {
    return;
  }

  window[TEAM_POPUP_BOOTED_FLAG] = true;

  const rerun = debounce(() => {
    setupTeamPopupElements();
  }, 90);

  rerun();

  window.addEventListener('load', rerun);
  document.addEventListener('bricks/ajax/end', rerun);
  document.addEventListener('click', handleTeamPopupClick);
  document.addEventListener('keydown', handleTeamPopupKeydown);
  window.setTimeout(rerun, 200);
  window.setTimeout(rerun, 800);

  if (!window.MutationObserver || !document.body) {
    return;
  }

  new MutationObserver((mutations) => {
    if (!mutations.some((mutation) => mutation.addedNodes.length > 0)) {
      return;
    }

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) {
          continue;
        }

        if (node.matches(TEAM_POPUP_SELECTOR) || node.querySelector?.(TEAM_POPUP_SELECTOR)) {
          rerun();
          return;
        }
      }
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function handleTeamPopupClick(event) {
  const link = event.target.closest(TEAM_LINK_SELECTOR);
  const isCloseButton = event.target.closest(TEAM_EXIT_SELECTOR);

  if (isCloseButton) {
    closeTeamPopup();
    return;
  }

  if (popupOverlay && event.target === popupOverlay) {
    closeTeamPopup();
    return;
  }

  if (!link) {
    return;
  }

  const number = normalizeNumber(link.dataset.number);
  const popup = getPopupByNumber(number);

  if (!popup) {
    return;
  }

  if (link.closest('.' + POPUP_CLASS)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (activePopup === popup && popup.classList.contains(POPUP_VISIBLE_CLASS)) {
    closeTeamPopup();
    return;
  }

  openTeamPopup(popup, link);
}

function handleTeamPopupKeydown(event) {
  if (event.key !== 'Escape' || !activePopup) {
    return;
  }

  closeTeamPopup();
}

function openTeamPopup(popup, trigger) {
  if (!popup) {
    return;
  }

  if (!popupOverlay) {
    return;
  }

  closeTeamPopup();
  activePopup = popup;
  activeTrigger = trigger;

  if (activeTrigger) {
    activeTrigger.setAttribute('aria-expanded', 'true');
  }

  popup.hidden = false;
  popup.setAttribute('aria-hidden', 'false');
  popup.classList.add(POPUP_VISIBLE_CLASS);
  movePopupToPortal(popup);
  popup.style.display = 'block';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.right = 'auto';
  popup.style.bottom = 'auto';
  popup.style.transform = 'translate(-50%, -50%)';
  popupOverlay.classList.add(OVERLAY_VISIBLE_CLASS);
  document.documentElement.classList.add('is-team-popup-open');
  document.body.classList.add('is-team-popup-open');

  popup.focus({
    preventScroll: true,
  });
}

function closeTeamPopup() {
  if (!activePopup && popupOverlay) {
    popupOverlay.classList.remove(OVERLAY_VISIBLE_CLASS);
    document.documentElement.classList.remove('is-team-popup-open');
    document.body.classList.remove('is-team-popup-open');
    return;
  }

  if (!activePopup) {
    return;
  }

  popupOverlay.classList.remove(OVERLAY_VISIBLE_CLASS);
  activePopup.classList.remove(POPUP_VISIBLE_CLASS);
  activePopup.setAttribute('aria-hidden', 'true');
  activePopup.setAttribute('hidden', '');
  restorePopup(activePopup);
  activePopup.style.display = '';
  activePopup.style.position = '';
  activePopup.style.top = '';
  activePopup.style.left = '';
  activePopup.style.right = '';
  activePopup.style.bottom = '';
  activePopup.style.transform = '';
  document.documentElement.classList.remove('is-team-popup-open');
  document.body.classList.remove('is-team-popup-open');

  if (activeTrigger) {
    activeTrigger.setAttribute('aria-expanded', 'false');
    activeTrigger = null;
  }

  activePopup = null;
}

function ensurePopupOverlay() {
  if (popupOverlay) {
    return;
  }

  popupOverlay = document.createElement('div');
  popupOverlay.className = OVERLAY_CLASS;
  popupOverlay.setAttribute('aria-hidden', 'true');
  popupOverlay.tabIndex = -1;
  popupOverlay.style.zIndex = '2147483000';
  document.body.appendChild(popupOverlay);
}

function ensurePopupPortal() {
  if (popupPortal) {
    return;
  }

  popupPortal = document.createElement('div');
  popupPortal.className = POPUP_PORTAL_CLASS;
  popupPortal.setAttribute('aria-hidden', 'true');
  document.body.appendChild(popupPortal);
}

function movePopupToPortal(popup) {
  if (!popupPortal || popup.parentElement === popupPortal) {
    return;
  }

  const parent = popup.parentElement;
  const nextSibling = popup.nextSibling;
  popupOriginalPlacement.set(popup, { parent, nextSibling });
  popupPortal.appendChild(popup);
}

function restorePopup(popup) {
  const placement = popupOriginalPlacement.get(popup);
  if (!placement) {
    return;
  }

  const { parent, nextSibling } = placement;
  if (popup.parentElement !== parent) {
    if (parent && parent.isConnected) {
      parent.insertBefore(popup, nextSibling);
    }
  }

  popupOriginalPlacement.delete(popup);
}

function addPopupByNumber(number, popup) {
  const keys = getNumberKeys(number);

  keys.forEach((key) => {
    popupMap.set(key, popup);
  });
}

function normalizeNumber(value) {
  return value?.trim?.() ?? '';
}

function getNumberKeys(number) {
  const raw = normalizeNumber(number);
  if (!raw) {
    return [];
  }

  const withoutLeadingZero = raw.replace(/^0+(?=\d)/, '');
  return withoutLeadingZero === raw ? [raw] : [raw, withoutLeadingZero];
}

function getPopupByNumber(number) {
  if (!number) {
    return null;
  }

  const keys = getNumberKeys(number);
  return popupMap.get(keys[0]) ?? popupMap.get(keys[1]) ?? null;
}

function debounce(callback, delay) {
  let timerId;

  return (...args) => {
    if (timerId) {
      window.clearTimeout(timerId);
    }

    timerId = window.setTimeout(() => {
      timerId = undefined;
      callback(...args);
    }, delay);
  };
}
