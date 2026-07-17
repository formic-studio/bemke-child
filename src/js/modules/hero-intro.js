import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
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
const LINE_STAGGER = 0.12;
const FONT_WAIT_MS = 1000;

const activeStates = new Set();
let lifecycleBound = false;

gsap.registerPlugin(SplitText);

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
    splits: [],
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

  animateHeroLines(state, isMobile);
}

async function animateHeroLines(state, isMobile) {
  try {
    await waitForFonts();

    if (state.finished) {
      return;
    }

    if (isReducedMotion()) {
      finishHeroIntro(state);
      return;
    }

    const headingLines = splitIntoLines(state, state.heading);
    const supplementaryLines = state.supplementary
      ? splitIntoLines(state, state.supplementary)
      : [];
    const lines = [...headingLines, ...supplementaryLines];

    if (!headingLines.length) {
      finishHeroIntro(state);
      return;
    }

    const parentFinalState = {
      opacity: 1,
      y: 0,
    };
    const lineInitialState = {
      opacity: 0,
      willChange: 'transform, opacity',
      y: START_Y,
    };

    if (!isMobile) {
      parentFinalState.filter = 'none';
      lineInitialState.filter = `blur(${DESKTOP_BLUR}px)`;
      lineInitialState.willChange = 'transform, opacity, filter';
    }

    gsap.set(state.elements, parentFinalState);
    gsap.set(lines, lineInitialState);

    const headingTween = {
      duration: isMobile ? 0.66 : 0.78,
      opacity: 1,
      stagger: LINE_STAGGER,
      y: 0,
    };
    const supplementaryTween = {
      duration: isMobile ? 0.54 : 0.66,
      opacity: 1,
      stagger: LINE_STAGGER,
      y: 0,
    };

    if (!isMobile) {
      headingTween.filter = 'blur(0px)';
      supplementaryTween.filter = 'blur(0px)';
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: 'power2.out',
      },
      onComplete: () => finishHeroIntro(state),
    });

    state.timeline = timeline;
    timeline.to(headingLines, headingTween);

    if (supplementaryLines.length) {
      timeline.to(supplementaryLines, supplementaryTween, '-=0.08');
    }
  } catch {
    finishHeroIntro(state);
  }
}

function splitIntoLines(state, element) {
  const split = SplitText.create(element, {
    aria: 'auto',
    linesClass: 'bemke-hero-intro-line',
    type: 'lines',
  });
  const lines = split.lines.filter((line) => line.textContent.trim());

  state.splits.push(split);

  return lines;
}

async function waitForFonts() {
  if (!document.fonts?.ready) {
    return;
  }

  await Promise.race([
    document.fonts.ready,
    new Promise((resolve) => {
      window.setTimeout(resolve, FONT_WAIT_MS);
    }),
  ]);
}

/*
 * SplitText keeps every line in its normal document flow. Only opacity,
 * filter and translateY are animated, so Bricks remains responsible for
 * the final alignment and position.
 */

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

  [...state.splits].reverse().forEach((split) => {
    split.revert();
  });
  state.splits.length = 0;

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
