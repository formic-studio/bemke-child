import { gsap } from 'gsap';
import { HERO_INTRO_COMPLETE_EVENT } from './hero-intro.js';
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from './motion-preference.js';

const HEADER_SELECTOR = '#brx-header';
const HERO_SELECTOR = '.section_hero';
const HERO_COMPLETE_ATTR = 'data-bemke-hero-intro-complete';
const READY_ATTR = 'data-bemke-header-intro-ready';
const COMPLETE_ATTR = 'data-bemke-header-intro-complete';
const ANIMATION_DURATION = 0.72;

const headerStates = new Map();
let lifecycleBound = false;

export function initHeaderIntro() {
  bindLifecycle();

  document.querySelectorAll(HEADER_SELECTOR).forEach((header) => {
    if (headerStates.has(header) || header.getAttribute(COMPLETE_ATTR) === '1') {
      return;
    }

    const state = {
      complete: false,
      header,
      revealing: false,
      sections: Array.from(header.children),
      tween: null,
    };

    headerStates.set(header, state);

    if (!document.querySelector(HERO_SELECTOR) || isReducedMotion()) {
      revealHeader(state, false);
      return;
    }

    const headerHeight = Math.max(header.getBoundingClientRect().height, 1);

    gsap.set(state.sections, {
      transition: 'none',
      y: -headerHeight,
    });
    gsap.set(header, { autoAlpha: 0 });
    header.setAttribute(READY_ATTR, '1');

    if (areHeroIntrosComplete()) {
      revealHeader(state, true);
    }
  });
}

function bindLifecycle() {
  if (lifecycleBound) {
    return;
  }

  lifecycleBound = true;

  document.addEventListener(HERO_INTRO_COMPLETE_EVENT, () => {
    if (!areHeroIntrosComplete()) {
      return;
    }

    headerStates.forEach((state) => {
      revealHeader(state, !isReducedMotion());
    });
  });

  document.addEventListener(MOTION_CHANGE_EVENT, (event) => {
    if (!event.detail?.reduced) {
      return;
    }

    headerStates.forEach((state) => {
      revealHeader(state, false);
    });
  });
}

function areHeroIntrosComplete() {
  const heroes = Array.from(document.querySelectorAll(HERO_SELECTOR));

  return (
    heroes.length > 0 &&
    heroes.every((hero) => hero.getAttribute(HERO_COMPLETE_ATTR) === '1')
  );
}

function revealHeader(state, animate) {
  if (state.complete) {
    return;
  }

  if (state.revealing && animate) {
    return;
  }

  state.header.setAttribute(READY_ATTR, '1');
  state.tween?.kill();
  state.tween = null;
  state.revealing = animate;

  if (!animate) {
    gsap.set(state.header, {
      clearProps: 'opacity,visibility',
    });
    gsap.set(state.sections, {
      clearProps: 'transform,transition',
    });
    markHeaderComplete(state);
    return;
  }

  gsap.set(state.header, { autoAlpha: 1 });

  state.tween = gsap.to(state.sections, {
    duration: ANIMATION_DURATION,
    ease: 'power3.out',
    overwrite: true,
    y: 0,
    onComplete: () => {
      gsap.set(state.header, {
        clearProps: 'opacity,visibility',
      });
      gsap.set(state.sections, {
        clearProps: 'transform,transition',
      });
      markHeaderComplete(state);
    },
  });
}

function markHeaderComplete(state) {
  state.complete = true;
  state.revealing = false;
  state.tween = null;
  state.header.setAttribute(COMPLETE_ATTR, '1');
  headerStates.delete(state.header);
}
