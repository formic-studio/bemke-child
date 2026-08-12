import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
  isSystemReducedMotion,
  setUserReducedMotion,
} from './motion-preference.js';

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
          ? 'Ogranicz animacje — włączone w ustawieniach systemu'
          : 'Ogranicz animacje',
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
  const languageLinks = Array.from(block.children).filter((element) =>
    element.matches('a[href]'),
  );

  if (languageLinks.length < 2) {
    return;
  }

  const currentLink = getCurrentLanguageLink(languageLinks);
  const targetLink =
    languageLinks.find((link) => link !== currentLink) ?? languageLinks[1];
  const currentIndex = Math.max(languageLinks.indexOf(currentLink), 0);
  const currentLanguage = getLanguageCode(currentLink);
  const targetLanguage = getLanguageCode(targetLink);
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

  languageLinks.forEach((link) => {
    const label = document.createElement('span');

    Array.from(link.attributes).forEach(({ name, value }) => {
      if (!['aria-current', 'href', 'rel', 'target'].includes(name)) {
        label.setAttribute(name, value);
      }
    });

    label.classList.toggle('in-active', link === targetLink);
    label.setAttribute('aria-hidden', 'true');
    label.replaceChildren(...link.childNodes);
    link.replaceWith(label);
  });

  languageSwitch.href = targetLink.href;
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

  if (targetLink.target) {
    languageSwitch.target = targetLink.target;
  }

  if (targetLink.rel) {
    languageSwitch.rel = targetLink.rel;
  }

  languageSwitch.classList.toggle(ACTIVE_CLASS, currentIndex > 0);
  track.setAttribute('aria-hidden', 'true');
  languageSwitch.replaceChildren(...block.childNodes);
  block.replaceWith(languageSwitch);
}

function getCurrentLanguageLink(languageLinks) {
  const explicitCurrent = languageLinks.find(
    (link) => link.getAttribute('aria-current') === 'page',
  );

  if (explicitCurrent) {
    return explicitCurrent;
  }

  const currentUrl = normalizeUrl(window.location.href);
  const matchingLink = languageLinks.find(
    (link) => normalizeUrl(link.href) === currentUrl,
  );

  return matchingLink ?? languageLinks[0];
}

function normalizeUrl(value) {
  const url = new URL(value, window.location.href);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  return `${url.origin}${pathname}`;
}

function getLanguageCode(link) {
  const label = link.textContent.trim().toLowerCase();

  return /angiel|english/.test(label) ? 'en' : 'pl';
}
