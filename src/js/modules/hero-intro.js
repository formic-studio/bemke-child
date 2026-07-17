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
const DESKTOP_BLUR = 8;

const activeStates = new Set();
let lifecycleBound = false;

export function initHeroIntro() {
  bindLifecycle();

  document.querySelectorAll(ROOT_SELECTOR).forEach((hero) => {
    setupHeroIntro(hero);
  });
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

  if (!heading) {
    markHeroComplete(hero);
    return;
  }

  const supplementary = getSupplementaryText(heading);
  const elements = [heading, supplementary].filter(Boolean);
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  const state = {
    elements,
    finished: false,
    heading,
    hero,
    originalStyles: new Map(
      elements.map((element) => [element, element.getAttribute('style')]),
    ),
    supplementary,
    timeline: null,
  };

  activeStates.add(state);

  if (isReducedMotion()) {
    finishHeroIntro(state);
    return;
  }

  const initialState = {
    opacity: 0,
    y: START_Y,
  };

  if (!isMobile) {
    initialState.filter = `blur(${DESKTOP_BLUR}px)`;
  }

  gsap.set(elements, initialState);
  hero.setAttribute(READY_ATTR, '1');

  const timeline = gsap.timeline({
    defaults: {
      ease: 'power2.out',
    },
    onComplete: () => finishHeroIntro(state),
  });

  state.timeline = timeline;

  const headingTween = {
    duration: isMobile ? 0.55 : 0.65,
    opacity: 1,
    y: 0,
  };

  if (!isMobile) {
    headingTween.filter = 'blur(0px)';
  }

  timeline.to(heading, headingTween);

  if (supplementary) {
    const supplementaryTween = {
      duration: isMobile ? 0.45 : 0.55,
      opacity: 1,
      y: 0,
    };

    if (!isMobile) {
      supplementaryTween.filter = 'blur(0px)';
    }

    timeline.to(
      supplementary,
      supplementaryTween,
      '-=0.08',
    );
  }
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

  const timeline = state.timeline;
  state.timeline = null;
  timeline?.kill();

  state.elements.forEach((element) => {
    restoreInlineStyle(element, state.originalStyles.get(element));
  });

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
