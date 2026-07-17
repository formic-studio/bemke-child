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
    const setActive = (isActive) => {
      block.classList.toggle(ACTIVE_CLASS, isActive);
      block.setAttribute('aria-checked', isActive ? 'true' : 'false');
    };
    const syncMotionSwitch = () => {
      if (!isMotionSwitch) {
        return;
      }

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
      if (isMotionSwitch) {
        if (isSystemReducedMotion()) {
          return;
        }

        setUserReducedMotion(!isReducedMotion());
        return;
      }

      setActive(!block.classList.contains(ACTIVE_CLASS));
    };

    block.setAttribute(READY_ATTR, '1');
    block.setAttribute('role', 'switch');
    block.setAttribute('tabindex', '0');
    block.setAttribute('aria-label', 'Język angielski');

    if (isMotionSwitch) {
      syncMotionSwitch();
      document.addEventListener(MOTION_CHANGE_EVENT, syncMotionSwitch);
    } else {
      setActive(false);
    }

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
