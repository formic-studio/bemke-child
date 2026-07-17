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
const MOBILE_START_Y = 10;
const DESKTOP_BLUR = 8;
const MIN_STAGE_GAP = 16;
const MAX_STAGE_GAP = 40;
const FONT_WAIT_MS = 1400;

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
    viewportInterrupt: null,
  };

  activeStates.add(state);

  if (isReducedMotion()) {
    finishHeroIntro(state);
    return;
  }

  gsap.set(elements, { opacity: 0 });
  hero.setAttribute(READY_ATTR, '1');

  if (window.matchMedia(MOBILE_QUERY).matches) {
    animateMobileHero(state);
    return;
  }

  animateDesktopHero(state);
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

function animateMobileHero(state) {
  const { elements, heading, supplementary } = state;

  gsap.set(elements, {
    opacity: 0,
    y: MOBILE_START_Y,
  });

  const timeline = gsap.timeline({
    defaults: {
      ease: 'power2.out',
    },
    onComplete: () => finishHeroIntro(state),
  });

  state.timeline = timeline;

  timeline.to(heading, {
    duration: 0.55,
    opacity: 1,
    y: 0,
  });

  if (supplementary) {
    timeline.to(
      supplementary,
      {
        duration: 0.45,
        opacity: 1,
        y: 0,
      },
      '-=0.08',
    );
  }
}

async function animateDesktopHero(state) {
  try {
    await waitForFonts();
    await nextFrame();

    if (state.finished) {
      return;
    }

    if (isReducedMotion()) {
      finishHeroIntro(state);
      return;
    }

    if (window.matchMedia(MOBILE_QUERY).matches) {
      animateMobileHero(state);
      return;
    }

    const heroRect = state.hero.getBoundingClientRect();

    if (heroRect.bottom <= 0 || heroRect.top >= window.innerHeight) {
      finishHeroIntro(state);
      return;
    }

    const elementRects = new Map(
      state.elements.map((element) => [
        element,
        element.getBoundingClientRect(),
      ]),
    );
    const headingGroup = splitIntoLineGroup(state, state.heading);
    const supplementaryGroup = state.supplementary
      ? splitIntoLineGroup(state, state.supplementary)
      : null;
    const groups = [headingGroup, supplementaryGroup].filter(
      (group) => group?.records.length,
    );

    if (!headingGroup.records.length) {
      finishHeroIntro(state);
      return;
    }

    const records = groups.flatMap((group) => group.records);

    positionGroupsInHero(groups, heroRect);
    prepareDesktopLines(records);

    state.elements.forEach((element) => {
      const rect = elementRects.get(element);

      gsap.set(element, {
        minHeight: rect.height,
        minWidth: rect.width,
        opacity: 1,
        textAlign: 'center',
      });
    });

    bindViewportInterrupt(state);

    const headingLines = headingGroup.records.map((record) => record.line);
    const supplementaryLines =
      supplementaryGroup?.records.map((record) => record.line) ?? [];
    const movingLines = [...headingLines, ...supplementaryLines];
    const timeline = gsap.timeline({
      onComplete: () => finishHeroIntro(state),
    });

    state.timeline = timeline;

    timeline.to(headingLines, {
      duration: 0.55,
      ease: 'power2.out',
      filter: 'blur(0px)',
      opacity: 1,
      stagger: 0.08,
    });

    if (supplementaryLines.length) {
      timeline.to(
        supplementaryLines,
        {
          duration: 0.42,
          ease: 'power2.out',
          filter: 'blur(0px)',
          opacity: 1,
          stagger: 0.06,
        },
        '+=0.04',
      );
    }

    timeline.to(
      movingLines,
      {
        duration: 0.9,
        ease: 'power3.inOut',
        stagger: 0.07,
        x: 0,
        y: 0,
      },
      '+=0.08',
    );
  } catch {
    finishHeroIntro(state);
  }
}

function splitIntoLineGroup(state, element) {
  const split = SplitText.create(element, {
    aria: 'auto',
    linesClass: 'bemke-hero-intro-line',
    type: 'lines',
  });
  const records = split.lines
    .filter((line) => line.textContent.trim())
    .map(createLineRecord);

  state.splits.push(split);

  if (!records.length) {
    return {
      bottom: 0,
      height: 0,
      records,
      top: 0,
    };
  }

  const top = Math.min(...records.map((record) => record.finalTop));
  const bottom = Math.max(
    ...records.map((record) => record.finalTop + record.height),
  );

  return {
    bottom,
    height: bottom - top,
    records,
    top,
  };
}

function createLineRecord(line) {
  const lineRect = line.getBoundingClientRect();
  const contentRect = getLineContentRect(line);

  return {
    finalLeft: contentRect.left,
    finalTop: lineRect.top,
    height: lineRect.height,
    line,
    stageX: 0,
    stageY: 0,
    width: contentRect.width,
  };
}

function getLineContentRect(line) {
  const range = document.createRange();

  range.selectNodeContents(line);

  const contentRect = range.getBoundingClientRect();
  const lineRect = line.getBoundingClientRect();

  range.detach?.();

  if (contentRect.width > 0 && contentRect.height > 0) {
    return contentRect;
  }

  return lineRect;
}

function positionGroupsInHero(groups, heroRect) {
  const orderedGroups = [...groups].sort((first, second) => {
    return first.top - second.top;
  });
  const gaps = orderedGroups.slice(0, -1).map((group, index) => {
    const nextGroup = orderedGroups[index + 1];
    const finalGap = nextGroup.top - group.bottom;

    return clamp(finalGap, MIN_STAGE_GAP, MAX_STAGE_GAP);
  });
  const totalHeight =
    orderedGroups.reduce((sum, group) => sum + group.height, 0) +
    gaps.reduce((sum, gap) => sum + gap, 0);
  const centerX = heroRect.left + heroRect.width / 2;
  let groupTop = heroRect.top + (heroRect.height - totalHeight) / 2;

  orderedGroups.forEach((group, groupIndex) => {
    group.records.forEach((record) => {
      const stageTop = groupTop + (record.finalTop - group.top);
      const stageLeft = centerX - record.width / 2;

      record.stageX = stageLeft - record.finalLeft;
      record.stageY = stageTop - record.finalTop;
    });

    groupTop += group.height + (gaps[groupIndex] ?? 0);
  });
}

function prepareDesktopLines(records) {
  records.forEach((record) => {
    gsap.set(record.line, {
      boxSizing: 'border-box',
      display: 'block',
      filter: `blur(${DESKTOP_BLUR}px)`,
      height: record.height,
      left: record.finalLeft,
      margin: 0,
      minWidth: record.width,
      opacity: 0,
      overflow: 'visible',
      pointerEvents: 'none',
      position: 'fixed',
      textAlign: 'center',
      top: record.finalTop,
      transformOrigin: '50% 50%',
      whiteSpace: 'nowrap',
      width: record.width,
      willChange: 'transform, opacity, filter',
      x: record.stageX,
      y: record.stageY,
      zIndex: 5,
    });
  });
}

function bindViewportInterrupt(state) {
  const finish = () => finishHeroIntro(state);

  state.viewportInterrupt = finish;
  window.addEventListener('resize', finish, { once: true });
  window.addEventListener('scroll', finish, { once: true, passive: true });
}

function finishHeroIntro(state) {
  if (state.finished) {
    return;
  }

  state.finished = true;

  const timeline = state.timeline;
  state.timeline = null;
  timeline?.kill();

  if (state.viewportInterrupt) {
    window.removeEventListener('resize', state.viewportInterrupt);
    window.removeEventListener('scroll', state.viewportInterrupt);
    state.viewportInterrupt = null;
  }

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

function nextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}
