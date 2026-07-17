import { gsap } from 'gsap';
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from './motion-preference.js';

const ROOT_SELECTOR = '.section_hero';
const HEADING_SELECTOR = 'h1';
const SUPPLEMENTARY_SELECTOR = '.brxe-text-basic, .brxe-text, p';
const READY_ATTR = 'data-bemke-hero-intro-ready';
const COMPLETE_ATTR = 'data-bemke-hero-intro-complete';
const MOBILE_QUERY = '(max-width: 767px)';
const START_Y = 10;

const activeStates = new Set();
let lifecycleBound = false;

export function initHeroIntro() {
  bindLifecycle();

  document.querySelectorAll(ROOT_SELECTOR).forEach(setupHeroIntro);
}

function bindLifecycle() {
  if (lifecycleBound) {
    return;
  }

  lifecycleBound = true;

  document.addEventListener(MOTION_CHANGE_EVENT, (event) => {
    if (!event.detail?.reduced) {
      return;
    }

    Array.from(activeStates).forEach(finishHeroIntro);
  });
}

function setupHeroIntro(hero) {
  if (hero.getAttribute(READY_ATTR) === '1') {
    return;
  }

  const heading = hero.querySelector(HEADING_SELECTOR);
  const supplementary = heading ? getSupplementaryText(heading) : null;

  hero.setAttribute(READY_ATTR, '1');

  if (!heading || !supplementary || isReducedMotion()) {
    markHeroComplete(hero);
    return;
  }

  const state = {
    element: supplementary,
    finished: false,
    hero,
    originalStyle: supplementary.getAttribute('style'),
    tween: null,
  };

  activeStates.add(state);

  state.tween = gsap.fromTo(
    supplementary,
    { y: START_Y },
    {
      duration: window.matchMedia(MOBILE_QUERY).matches ? 0.4 : 0.5,
      ease: 'power2.out',
      onComplete: () => finishHeroIntro(state),
      y: 0,
    },
  );
}

function getSupplementaryText(heading) {
  const wrapper = heading.parentElement;

  if (!wrapper) {
    return null;
  }

  return (
    Array.from(wrapper.children).find((element) => {
      if (
        element === heading ||
        !element.matches(SUPPLEMENTARY_SELECTOR) ||
        !element.textContent.trim()
      ) {
        return false;
      }

      const style = window.getComputedStyle(element);

      return style.display !== 'none' && style.visibility !== 'hidden';
    }) ?? null
  );
}

function finishHeroIntro(state) {
  if (state.finished) {
    return;
  }

  state.finished = true;
  state.tween?.kill();
  restoreInlineStyle(state.element, state.originalStyle);
  markHeroComplete(state.hero);
  activeStates.delete(state);
}

function restoreInlineStyle(element, originalStyle) {
  if (originalStyle === null) {
    element.removeAttribute('style');
    return;
  }

  element.setAttribute('style', originalStyle);
}

function markHeroComplete(hero) {
  hero.setAttribute(READY_ATTR, '1');
  hero.setAttribute(COMPLETE_ATTR, '1');
}
