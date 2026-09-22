import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
  isSystemReducedMotion,
  setUserReducedMotion,
} from './motion-preference.js';
import { siteText } from './site-language.js';

const SWITCH_BLOCK_SELECTOR = '.lang-switcher-block';
const SWITCH_TRACK_SELECTOR = '.animation-switcher, .lang-switcher';
const READY_ATTR = 'data-bemke-switch-ready';
const ACTIVE_CLASS = 'is-active';

export function initAccessibilitySwitches(root = document) {
  root.querySelectorAll(SWITCH_BLOCK_SELECTOR).forEach((block) => {
    if (block.getAttribute(READY_ATTR) === '1') {
      return;
    }

    const track = block.querySelector(SWITCH_TRACK_SELECTOR);

    if (!track) {
      return;
    }

    const isMotionSwitch = track.classList.contains('animation-switcher');

    if (!isMotionSwitch) {
      setupLanguageSwitcher(block, track);
      return;
    }

    const setActive = (isActive) => {
      block.classList.toggle(ACTIVE_CLASS, isActive);
      block.setAttribute('aria-checked', isActive ? 'true' : 'false');
    };
    const syncMotionSwitch = () => {
      const isSystemPreference = isSystemReducedMotion();
      setActive(isReducedMotion());
      block.setAttribute('aria-disabled', isSystemPreference ? 'true' : 'false');
      block.setAttribute(
        'aria-label',
        isSystemPreference
          ? siteText('Ogranicz animacje — włączone w ustawieniach systemu', 'Reduce motion — enabled in system settings')
          : siteText('Ogranicz animacje', 'Reduce motion'),
      );
    };
    const toggle = () => {
      if (isSystemReducedMotion()) {
        return;
      }

      setUserReducedMotion(!isReducedMotion());
    };

    block.setAttribute(READY_ATTR, '1');
    block.setAttribute('role', 'switch');
    block.setAttribute('tabindex', '0');
    syncMotionSwitch();
    document.addEventListener(MOTION_CHANGE_EVENT, syncMotionSwitch);

    block.addEventListener('click', toggle);
    block.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      toggle();
    });
  });
}

function setupLanguageSwitcher(block, track) {
  const languageItems = Array.from(block.children).filter(
    (element) => element !== track && isLanguageLabel(element),
  );

  if (languageItems.length < 2) {
    return;
  }

  const alternateUrls = getPolylangAlternateUrls();
  const currentItem = getCurrentLanguageItem(languageItems, alternateUrls);
  const targetItem =
    languageItems.find((item) => item !== currentItem) ?? languageItems[1];
  const targetUrl = getLanguageUrl(targetItem, alternateUrls);

  if (!targetUrl) {
    return;
  }

  const currentIndex = Math.max(languageItems.indexOf(currentItem), 0);
  const currentLanguage = getLanguageCode(currentItem);
  const targetLanguage = getLanguageCode(targetItem);
  const languageSwitch = document.createElement('a');

  Array.from(block.attributes).forEach(({ name, value }) => {
    if (
      ![
        'aria-checked',
        'aria-disabled',
        'aria-label',
        'role',
        'tabindex',
      ].includes(name)
    ) {
      languageSwitch.setAttribute(name, value);
    }
  });

  languageItems.forEach((item) => {
    const label = document.createElement('span');

    Array.from(item.attributes).forEach(({ name, value }) => {
      if (!['aria-current', 'href', 'rel', 'target'].includes(name)) {
        label.setAttribute(name, value);
      }
    });

    label.classList.toggle('in-active', item === targetItem);
    label.setAttribute('aria-hidden', 'true');
    label.replaceChildren(...item.childNodes);
    item.replaceWith(label);
  });

  languageSwitch.href = targetUrl;
  languageSwitch.setAttribute(READY_ATTR, '1');
  languageSwitch.setAttribute(
    'aria-label',
    currentLanguage === 'en'
      ? 'Switch to the Polish language version'
      : 'Przejdź do angielskiej wersji językowej',
  );
  languageSwitch.setAttribute('hreflang', targetLanguage);
  languageSwitch.setAttribute(
    'data-bemke-current-language',
    currentLanguage,
  );

  if (targetItem.getAttribute('target')) {
    languageSwitch.target = targetItem.getAttribute('target');
  }

  if (targetItem.getAttribute('rel')) {
    languageSwitch.rel = targetItem.getAttribute('rel');
  }

  languageSwitch.classList.toggle(ACTIVE_CLASS, currentIndex > 0);
  track.setAttribute('aria-hidden', 'true');
  languageSwitch.replaceChildren(...block.childNodes);
  block.replaceWith(languageSwitch);
}

/**
 * Bricks stores fallback URLs in the custom switcher, while Polylang prints
 * the translated URL for the current page as a rel="alternate" link. Keep the
 * Bricks markup and styling, but replace its stale URLs before the switcher is
 * made interactive.
 */
function getPolylangAlternateUrls() {
  const alternateUrls = new Map();

  document
    .querySelectorAll('head link[rel~="alternate"][hreflang][href]')
    .forEach((link) => {
      const language = normalizeLanguageCode(link.getAttribute('hreflang'));

      if (language === 'pl' || language === 'en') {
        alternateUrls.set(language, link.href);
      }
    });

  return alternateUrls;
}

function getCurrentLanguageItem(languageItems, alternateUrls) {
  const documentLanguage = normalizeLanguageCode(
    document.documentElement.lang,
  );
  const languageMatch = languageItems.find(
    (item) => getLanguageCode(item) === documentLanguage,
  );

  if (languageMatch) {
    return languageMatch;
  }

  const explicitCurrent = languageItems.find(
    (item) => item.getAttribute('aria-current') === 'page',
  );

  if (explicitCurrent) {
    return explicitCurrent;
  }

  const currentUrl = normalizeUrl(window.location.href);
  const matchingItem = languageItems.find(
    (item) => {
      const languageUrl = getLanguageUrl(item, alternateUrls);

      return languageUrl && normalizeUrl(languageUrl) === currentUrl;
    },
  );

  return matchingItem ?? languageItems[0];
}

function getLanguageUrl(item, alternateUrls) {
  const alternateUrl = alternateUrls.get(getLanguageCode(item));

  if (alternateUrl) {
    return alternateUrl;
  }

  const fallbackUrl = item.getAttribute('href');

  return fallbackUrl ? new URL(fallbackUrl, window.location.href).href : '';
}

function normalizeUrl(value) {
  const url = new URL(value, window.location.href);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  return `${url.origin}${pathname}`;
}

function isLanguageLabel(element) {
  return /^(polski|angielski|polish|english)$/i.test(
    element.textContent.trim(),
  );
}

function getLanguageCode(item) {
  const label = item.textContent.trim().toLowerCase();

  return /angiel|english/.test(label) ? 'en' : 'pl';
}

function normalizeLanguageCode(value = '') {
  return value.trim().toLowerCase().split(/[-_]/)[0];
}
