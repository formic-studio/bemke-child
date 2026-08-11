import { ensureButtonElement } from './semantic-button.js';

const TEAM_POPUP_SELECTOR = '.popup-team[data-number]';
const TEAM_LINK_SELECTOR = '[data-number]:not(.popup-team)';
const TEAM_CARD_SELECTOR = '.team-link';
const TEAM_EXIT_SELECTOR = '.exit-button';
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');
const TEAM_POPUP_READY_ATTR = 'data-bemke-team-popup-ready';
const TEAM_POPUP_BOOTED_FLAG = '__bemkeTeamPopupBooted';
const OVERLAY_CLASS = 'bemke-team-popup-overlay';
const OVERLAY_VISIBLE_CLASS = 'is-visible';
const POPUP_CLASS = 'bemke-team-popup';
const POPUP_PORTAL_CLASS = 'bemke-team-popup-portal';
const POPUP_VISIBLE_CLASS = 'is-visible';
const POPUP_CONTENT_CLASS = 'bemke-team-popup__content';
const POPUP_DESCRIPTION_CLASS = 'bemke-team-popup__description';
const POPUP_SCROLLABLE_CLASS = 'is-scrollable';
const POPUP_SCROLL_END_CLASS = 'is-at-scroll-end';
const POPUP_SCROLL_READY_ATTR = 'data-bemke-scroll-indicator-ready';
const TEAM_CARD_CLASS = TEAM_CARD_SELECTOR.slice(1);
const TEAM_TRIGGER_LABELS = new Map([
  ['01', 'Więcej o Przemysławie Powalaczu'],
  ['02', 'Więcej o Katarzynie Przybył-Tamowicz'],
  ['03', 'Więcej o Darii Rybińskiej'],
  ['04', 'Więcej o Urszuli Szudarek'],
]);

let popupMap = new Map();
let activePopup = null;
let activeTrigger = null;
let popupOverlay = null;
let popupPortal = null;

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
  restoreContentLeakedIntoPopups(popups);
  normalizePopupExitButtons(popups);
  movePopupsToPortal(popups);

  popups.forEach((popup) => {
    const number = normalizeNumber(popup.dataset.number);

    if (!number) {
      return;
    }

    popup.classList.add(POPUP_CLASS);
    popup.id ||= `bemke-team-popup-${number}`;
    popup.setAttribute(TEAM_POPUP_READY_ATTR, '1');
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('tabindex', '-1');
    setupScrollableDescription(popup);
    setupPopupAccessibleName(popup, number);

    if (
      popup === activePopup &&
      popup.classList.contains(POPUP_VISIBLE_CLASS)
    ) {
      popup.hidden = false;
      popup.setAttribute('aria-hidden', 'false');
    } else {
      popup.classList.remove(POPUP_VISIBLE_CLASS);
      popup.setAttribute('aria-hidden', 'true');
      popup.setAttribute('hidden', '');
    }

    addPopupByNumber(number, popup);
  });

  setupTeamCards(scope);
}

function setupPopupAccessibleName(popup, number) {
  if (popup.hasAttribute('aria-label') || popup.hasAttribute('aria-labelledby')) {
    return;
  }

  const heading = popup.querySelector('h1, h2, h3, h4, h5, h6');

  if (heading?.textContent?.trim()) {
    heading.id ||= `bemke-team-popup-title-${number}`;
    popup.setAttribute('aria-labelledby', heading.id);
    return;
  }

  popup.setAttribute('aria-label', `Zespół: ${number}`);
}

function setupScrollableDescription(popup) {
  const description = popup.querySelector('.font-size-body-xs');

  if (!description) {
    return;
  }

  description.classList.add(POPUP_DESCRIPTION_CLASS);
  description.setAttribute('role', 'region');
  const content = description.parentElement;
  content?.classList.add(POPUP_CONTENT_CLASS);

  if (description.hasAttribute(POPUP_SCROLL_READY_ATTR)) {
    return;
  }

  description.setAttribute(POPUP_SCROLL_READY_ATTR, '1');
  description.addEventListener(
    'scroll',
    () => updateScrollableDescription(description),
    { passive: true },
  );
}

function updateScrollableDescription(description) {
  if (!description) {
    return;
  }

  const content = description.closest(`.${POPUP_CONTENT_CLASS}`);
  if (!content) {
    return;
  }

  const isScrollable = description.scrollHeight > description.clientHeight + 2;
  const isAtEnd =
    !isScrollable ||
    description.scrollTop + description.clientHeight >=
      description.scrollHeight - 2;

  content.classList.toggle(POPUP_SCROLLABLE_CLASS, isScrollable);
  content.classList.toggle(POPUP_SCROLL_END_CLASS, isAtEnd);

  if (isScrollable) {
    description.setAttribute('tabindex', '0');
    description.setAttribute(
      'aria-label',
      'Opis członka zespołu, treść przewijana',
    );
    return;
  }

  description.removeAttribute('tabindex');
  description.setAttribute('aria-label', 'Opis członka zespołu');
}

function setupTeamCards(scope) {
  scope.querySelectorAll(TEAM_LINK_SELECTOR).forEach((link) => {
    if (link.closest(TEAM_POPUP_SELECTOR)) {
      return;
    }

    const number = normalizeNumber(link.dataset.number);
    const popup = getPopupByNumber(number);
    if (!popup) {
      return;
    }

    const card = link.closest(TEAM_CARD_SELECTOR) ?? link.parentElement;
    const trigger = ensureButtonElement(link);
    const name = normalizeText(
      card?.querySelector('.font-size-caption-big')?.textContent,
    );

    if (!trigger) {
      return;
    }

    trigger.setAttribute(
      'aria-label',
      TEAM_TRIGGER_LABELS.get(number) ||
        (name ? `Więcej o osobie: ${name}` : 'Więcej o członku zespołu'),
    );
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute(
      'aria-expanded',
      activePopup === popup ? 'true' : 'false',
    );
    trigger.setAttribute('aria-controls', popup.id);
    card?.classList.add(TEAM_CARD_CLASS);
  });
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function setupTeamPopupLifecycle() {
  if (window[TEAM_POPUP_BOOTED_FLAG]) {
    return;
  }

  window[TEAM_POPUP_BOOTED_FLAG] = true;

  const rerun = debounce(() => {
    setupTeamPopupElements();
  }, 90);
  const refreshScrollableDescription = debounce(() => {
    const description = activePopup?.querySelector(
      `.${POPUP_DESCRIPTION_CLASS}`,
    );
    updateScrollableDescription(description);
  }, 90);

  rerun();

  window.addEventListener('load', rerun);
  window.addEventListener('resize', refreshScrollableDescription);
  window.visualViewport?.addEventListener(
    'resize',
    refreshScrollableDescription,
  );
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
      if (mutation.target === popupPortal) {
        continue;
      }

      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) {
          continue;
        }

        if (
          node !== popupPortal &&
          node !== popupOverlay &&
          (node.matches(TEAM_POPUP_SELECTOR) ||
            node.querySelector?.(TEAM_POPUP_SELECTOR))
        ) {
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
  const card = event.target.closest(TEAM_CARD_SELECTOR);
  const link = event.target.closest(TEAM_LINK_SELECTOR);
  const trigger = link ?? card?.querySelector(TEAM_LINK_SELECTOR) ?? card;
  const isCloseButton = event.target.closest(TEAM_EXIT_SELECTOR);

  if (isCloseButton) {
    closeTeamPopup();
    return;
  }

  if (popupOverlay && event.target === popupOverlay) {
    closeTeamPopup();
    return;
  }

  if (!trigger) {
    return;
  }

  const numberSource = trigger.matches(TEAM_LINK_SELECTOR)
    ? trigger
    : trigger.querySelector(TEAM_LINK_SELECTOR);
  const number = normalizeNumber(numberSource?.dataset.number);
  const popup = getPopupByNumber(number);

  if (!popup) {
    return;
  }

  if (trigger.closest('.' + POPUP_CLASS)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (activePopup === popup && popup.classList.contains(POPUP_VISIBLE_CLASS)) {
    closeTeamPopup();
    return;
  }

  openTeamPopup(popup, trigger);
}

function handleTeamPopupKeydown(event) {
  if (!activePopup) {
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    closeTeamPopup();
    return;
  }

  if (event.key === 'Tab') {
    trapPopupFocus(event, activePopup);
  }
}

function trapPopupFocus(event, popup) {
  const focusableElements = Array.from(
    popup.querySelectorAll(FOCUSABLE_SELECTOR),
  ).filter((element) => element.getClientRects().length > 0);

  if (!focusableElements.length) {
    event.preventDefault();
    popup.focus({ preventScroll: true });
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const focusIsOutside = !popup.contains(document.activeElement);

  if (event.shiftKey && (document.activeElement === firstElement || focusIsOutside)) {
    event.preventDefault();
    lastElement.focus({ preventScroll: true });
    return;
  }

  if (!event.shiftKey && (document.activeElement === lastElement || focusIsOutside)) {
    event.preventDefault();
    firstElement.focus({ preventScroll: true });
  }
}

function openTeamPopup(popup, trigger) {
  if (!popup) {
    return;
  }

  if (!popupOverlay) {
    return;
  }

  closeTeamPopup({ restoreFocus: false });
  activePopup = popup;
  activeTrigger = trigger;

  if (activeTrigger) {
    activeTrigger.setAttribute('aria-expanded', 'true');
  }

  popup.hidden = false;
  popup.setAttribute('aria-hidden', 'false');
  popup.classList.add(POPUP_VISIBLE_CLASS);
  popupOverlay.classList.add(OVERLAY_VISIBLE_CLASS);
  document.documentElement.classList.add('is-team-popup-open');
  document.body.classList.add('is-team-popup-open');

  const description = popup.querySelector(`.${POPUP_DESCRIPTION_CLASS}`);
  if (description) {
    description.scrollTop = 0;
    window.requestAnimationFrame(() => {
      updateScrollableDescription(description);
    });
  }

  popup.focus({
    preventScroll: true,
  });
}

function closeTeamPopup({ restoreFocus = true } = {}) {
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
  document.documentElement.classList.remove('is-team-popup-open');
  document.body.classList.remove('is-team-popup-open');

  const triggerToRestore = activeTrigger;

  if (triggerToRestore) {
    triggerToRestore.setAttribute('aria-expanded', 'false');
  }

  activeTrigger = null;
  activePopup = null;

  if (restoreFocus && triggerToRestore?.isConnected) {
    triggerToRestore.focus({ preventScroll: true });
  }
}

function ensurePopupOverlay() {
  if (popupOverlay?.isConnected) {
    return;
  }

  popupOverlay =
    document.querySelector(`.${OVERLAY_CLASS}`) ??
    document.createElement('div');
  popupOverlay.classList.add(OVERLAY_CLASS);
  popupOverlay.setAttribute('aria-hidden', 'true');
  popupOverlay.tabIndex = -1;
  popupOverlay.style.zIndex = '2147483000';

  if (!popupOverlay.isConnected) {
    document.body.appendChild(popupOverlay);
  }
}

function ensurePopupPortal() {
  if (popupPortal?.isConnected) {
    return;
  }

  popupPortal =
    document.querySelector(`.${POPUP_PORTAL_CLASS}`) ??
    document.createElement('div');
  popupPortal.classList.add(POPUP_PORTAL_CLASS);

  if (!popupPortal.isConnected) {
    document.body.appendChild(popupPortal);
  }
}

function movePopupsToPortal(popups) {
  if (!popupPortal) {
    return;
  }

  popups.forEach((popup) => {
    if (popup.parentElement !== popupPortal) {
      popupPortal.appendChild(popup);
    }
  });
}

function restoreContentLeakedIntoPopups(popups) {
  const popupSet = new Set(popups);
  const outerPopups = popups.filter(
    (popup) => !popup.parentElement?.closest(TEAM_POPUP_SELECTOR),
  );

  outerPopups.forEach((outerPopup) => {
    const sourceParent = outerPopup.parentElement;

    if (!sourceParent) {
      return;
    }

    const sourceAnchor = outerPopup.nextSibling;
    const popupGroup = [
      outerPopup,
      ...outerPopup.querySelectorAll(TEAM_POPUP_SELECTOR),
    ];

    popupGroup.forEach((popup) => {
      const directChildren = Array.from(popup.children);
      const exitButton = Array.from(
        popup.querySelectorAll(TEAM_EXIT_SELECTOR),
      ).find(
        (button) => button.closest(TEAM_POPUP_SELECTOR) === popup,
      );
      const exitContainer = getDirectChildOfPopup(popup, exitButton);

      if (!exitContainer) {
        return;
      }

      const exitIndex = directChildren.indexOf(exitContainer);
      const leakedContent = directChildren
        .slice(exitIndex + 1)
        .filter((child) => !popupSet.has(child));

      leakedContent.forEach((element) => {
        sourceParent.insertBefore(element, sourceAnchor);
      });
    });
  });
}

function normalizePopupExitButtons(popups) {
  popups.forEach((popup) => {
    const exitButton = Array.from(
      popup.querySelectorAll(TEAM_EXIT_SELECTOR),
    ).find((button) => button.closest(TEAM_POPUP_SELECTOR) === popup);

    if (!exitButton || exitButton.parentElement === popup) {
      return;
    }

    popup.appendChild(exitButton);
  });
}

function getDirectChildOfPopup(popup, element) {
  let current = element;

  while (current?.parentElement && current.parentElement !== popup) {
    current = current.parentElement;
  }

  return current?.parentElement === popup ? current : null;
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
