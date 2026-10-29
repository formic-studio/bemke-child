import { siteText } from './site-language.js';

const COOKIEBOT_TITLE_ID = 'CybotCookiebotDialogBodyContentTitle';
const COOKIEBOT_TEXT_ID = 'CybotCookiebotDialogBodyContentText';
const COOKIEBOT_POWERED_BY_ID = 'CybotCookiebotDialogPoweredbyCybot';
const COOKIEBOT_READY_ATTR = 'data-bemke-cookiebot-a11y-ready';
const COOKIEBOT_TEXT_READY_ATTR = 'data-bemke-cookiebot-text-ready';

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
  document.getElementById('CybotCookiebotDialog')?.removeAttribute('aria-modal');

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
