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
export const HERO_INTRO_COMPLETE_EVENT = 'bemke:hero-intro-complete';
export const HERO_INTRO_HEADER_REVEAL_EVENT =
  'bemke:hero-intro-header-reveal';
const HEADER_REVEAL_ATTR = 'data-bemke-hero-intro-header-reveal';
const HEADER_REVEAL_PROGRESS = 0.7;
const MOBILE_QUERY = '(max-width: 767px)';
const START_Y = 10;
const DESKTOP_BLUR = 8;
const HIDDEN_CLIP = 'inset(100% 0 0 0)';
// Keep the final mask outside the line box so accents and italic overhangs
// are already fully visible before SplitText restores the original markup.
const VISIBLE_CLIP = 'inset(-35% -2% -35% -2%)';
const HEADING_DURATION = 1.2;
const SUPPLEMENTARY_DURATION = 1;
const LINE_STAGGER = 0.32;
const ELEMENT_GAP = 0.32;
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

  if (isMobile) {
    markHeroComplete(hero);
    return;
  }

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
    clipPath: HIDDEN_CLIP,
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
      clipPath: VISIBLE_CLIP,
      y: 0,
    };
    const lineInitialState = {
      clipPath: HIDDEN_CLIP,
      willChange: 'clip-path, transform',
      y: START_Y,
    };

    if (!isMobile) {
      parentFinalState.filter = 'none';
      lineInitialState.filter = `blur(${DESKTOP_BLUR}px)`;
      lineInitialState.willChange = 'clip-path, transform, filter';
    }

    gsap.set(state.elements, parentFinalState);
    gsap.set(lines, lineInitialState);

    const headingTween = {
      clipPath: VISIBLE_CLIP,
      duration: isMobile ? 0.66 : HEADING_DURATION,
      stagger: LINE_STAGGER,
      y: 0,
    };
    const supplementaryTween = {
      clipPath: VISIBLE_CLIP,
      duration: isMobile ? 0.54 : SUPPLEMENTARY_DURATION,
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
    if (!supplementaryLines.length) {
      timeline.to(headingLines, headingTween);
    } else if (document.body.classList.contains('home')) {
      timeline.to(headingLines, headingTween);
      timeline.to(
        supplementaryLines,
        supplementaryTween,
        `+=${ELEMENT_GAP}`,
      );
    } else {
      timeline.to(supplementaryLines, supplementaryTween);
      timeline.to(headingLines, headingTween, `+=${ELEMENT_GAP}`);
    }

    timeline.add(
      () => signalHeaderReveal(state.hero),
      timeline.duration() * HEADER_REVEAL_PROGRESS,
    );
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
 * SplitText keeps every line in its normal document flow. Clip-path reveals
 * each line while filter and translateY preserve the original intro feel.
 * The text keeps full opacity, so automated contrast checks see its real
 * foreground colour throughout the animation.
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
  signalHeaderReveal(hero);
  hero.setAttribute(READY_ATTR, '1');
  hero.setAttribute(COMPLETE_ATTR, '1');
  document.dispatchEvent(
    new CustomEvent(HERO_INTRO_COMPLETE_EVENT, {
      detail: { hero },
    }),
  );
}

function signalHeaderReveal(hero) {
  if (hero.getAttribute(HEADER_REVEAL_ATTR) === '1') {
    return;
  }

  hero.setAttribute(HEADER_REVEAL_ATTR, '1');
  document.dispatchEvent(
    new CustomEvent(HERO_INTRO_HEADER_REVEAL_EVENT, {
      detail: { hero },
    }),
  );
}
