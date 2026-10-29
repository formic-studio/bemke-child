import { siteText } from './site-language.js';

const COOKIEBOT_TITLE_ID = 'CybotCookiebotDialogBodyContentTitle';
const COOKIEBOT_TEXT_ID = 'CybotCookiebotDialogBodyContentText';
const COOKIEBOT_POWERED_BY_ID = 'CybotCookiebotDialogPoweredbyCybot';
const COOKIEBOT_READY_ATTR = 'data-bemke-cookiebot-a11y-ready';
const COOKIEBOT_INERT_ATTR = 'data-bemke-cookiebot-inert';
const COOKIEBOT_TEXT_READY_ATTR = 'data-bemke-cookiebot-text-ready';

let cookieDialogObserver = null;
let observedCookieDialog = null;

export function initThirdPartyAccessibility() {
  repairCookiebotMarkup();

  if (!window.MutationObserver || !document.documentElement) {
    return;
  }

  new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
      repairCookiebotMarkup();
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function repairCookiebotMarkup() {
  const title = document.getElementById(COOKIEBOT_TITLE_ID);

  if (title && title.tagName !== 'H2') {
    const heading = document.createElement('h2');

    Array.from(title.attributes).forEach(({ name, value }) => {
      if (!['role', 'aria-level'].includes(name)) {
        heading.setAttribute(name, value);
      }
    });

    while (title.firstChild) {
      heading.appendChild(title.firstChild);
    }

    title.replaceWith(heading);
  }

  repairCookiebotDescription();
  syncCookiebotModalState();
  observeCookiebotDialog();

  const poweredBy = document.getElementById(COOKIEBOT_POWERED_BY_ID);

  if (!poweredBy || poweredBy.getAttribute(COOKIEBOT_READY_ATTR) === '1') {
    return;
  }

  poweredBy.setAttribute(COOKIEBOT_READY_ATTR, '1');
  poweredBy.removeAttribute('target');
  poweredBy.setAttribute('tabindex', '0');
  poweredBy.setAttribute(
    'aria-label',
    siteText('Cookiebot od Usercentrics', 'Cookiebot by Usercentrics'),
  );
}

function repairCookiebotDescription() {
  const text = document.getElementById(COOKIEBOT_TEXT_ID);

  if (!text || text.getAttribute(COOKIEBOT_TEXT_READY_ATTR) === '1') {
    return;
  }

  const words = text.textContent.trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return;
  }

  const lines = [];

  words.forEach((word) => {
    const currentLine = lines.at(-1) || '';

    if (!currentLine || `${currentLine} ${word}`.length > 70) {
      lines.push(word);
      return;
    }

    lines[lines.length - 1] = `${currentLine} ${word}`;
  });

  text.replaceChildren(
    ...lines.map((line) => {
      const span = document.createElement('span');
      span.className = 'bemke-cookiebot-description-line';
      span.textContent = line;
      return span;
    }),
  );
  text.setAttribute(COOKIEBOT_TEXT_READY_ATTR, '1');
}

function observeCookiebotDialog() {
  const dialog = document.getElementById('CybotCookiebotDialog');

  if (!dialog || dialog === observedCookieDialog) {
    return;
  }

  cookieDialogObserver?.disconnect();
  observedCookieDialog = dialog;
  cookieDialogObserver = new MutationObserver(syncCookiebotModalState);
  cookieDialogObserver.observe(dialog, {
    attributeFilter: ['aria-hidden', 'class'],
    attributes: true,
  });
}

function syncCookiebotModalState() {
  const dialog = document.getElementById('CybotCookiebotDialog');
  const pageRegions = document.querySelectorAll(
    'body > header, body > main, body > footer, body > .bemke-skip-links',
  );
  const isActive = Boolean(
    dialog &&
    dialog.classList.contains('CybotCookiebotDialogActive') &&
    dialog.getAttribute('aria-hidden') !== 'true',
  );

  if (dialog) {
    if (isActive) {
      dialog.setAttribute('aria-modal', 'true');
    } else {
      dialog.removeAttribute('aria-modal');
    }
  }

  pageRegions.forEach((region) => {
    if (isActive && !region.hasAttribute('inert')) {
      region.setAttribute('inert', '');
      region.setAttribute(COOKIEBOT_INERT_ATTR, '1');
      return;
    }

    if (!isActive && region.getAttribute(COOKIEBOT_INERT_ATTR) === '1') {
      region.removeAttribute('inert');
      region.removeAttribute(COOKIEBOT_INERT_ATTR);
    }
  });
}
