import { gsap } from 'gsap';
import { bindSliderControl, getSliderControls } from './slider-controls.js';
import { bindTouchSwipeFallback } from './touch-swipe-fallback.js';
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from './motion-preference.js';

const ROOT_SELECTOR = '.slider-block';
const TRACK_SELECTOR = ':scope > .slider-wrapper';
const CONTROLS_SELECTOR = ':scope > .slider-paggination';
const TEAM_TRIGGER_SELECTOR = '[data-number]:not(.popup-team)';
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

const READY_ATTR = 'data-bemke-team-slider-ready';
const ACTIVE_ATTR = 'slide-active';
const VISIBLE_ATTR = 'data-bemke-team-slide-visible';
const ORIGINAL_TABINDEX_ATTR = 'data-bemke-team-original-tabindex';
const STATUS_CLASS = 'bemke-team-slider-status';
const BOOT_FLAG = '__bemkeTeamSliderBooted';
const DRAGGING_CLASS = 'is-dragging';

const ANIMATION_DURATION = 0.8;
const SNAP_DURATION = 0.35;
const AUTOPLAY_MS = 3500;
const SWIPE_THRESHOLD = 46;
const ANIMATION_EASE = 'power3.inOut';
const SNAP_EASE = 'power3.out';

let sliderId = 0;

export function initTeamSlider() {
  initTeamSliderRoots();
  setupTeamSliderLifecycle();
}

function initTeamSliderRoots(scope = document) {
  scope.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
    const track = root.querySelector(TRACK_SELECTOR);

    if (!track || getTeamSlides(track).length < 2) {
      return;
    }

    if (root.getAttribute(READY_ATTR) === '1') {
      root.__bemkeTeamSliderRefresh?.();
      return;
    }

    createTeamSlider(root, track);
  });
}

function setupTeamSliderLifecycle() {
  if (window[BOOT_FLAG]) {
    return;
  }

  window[BOOT_FLAG] = true;

  const rerunInit = debounce(() => initTeamSliderRoots(), 90);

  window.addEventListener('load', rerunInit);
  document.addEventListener('bricks/ajax/end', rerunInit);
  window.setTimeout(rerunInit, 200);
  window.setTimeout(rerunInit, 800);

  if (!window.MutationObserver || !document.body) {
    return;
  }

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) {
          continue;
        }

        if (node.matches(ROOT_SELECTOR) || node.querySelector(ROOT_SELECTOR)) {
          rerunInit();
          return;
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function createTeamSlider(root, track) {
  const slides = getTeamSlides(track);
  const controls = getSliderControls(root, CONTROLS_SELECTOR);
  let isAnimating = false;
  let queuedDirection = 0;
  let isPlaying = false;
  let autoplayTimerId = null;
  let movementTween = null;
  let pointerState = null;
  let shouldSuppressClick = false;
  let currentPosition = 0;

  slides.forEach((slide) => slide.classList.add('team-link'));
  root.setAttribute(READY_ATTR, '1');
  decorateSlider(root, track, slides);
  prepareSlides(slides);
  bindControls(controls, track, {
    onPause: () => disableAutoplay(),
    onPlay: () => enableAutoplay(true),
    onPrev: () => queueMove(-1, true),
    onNext: () => queueMove(1, true),
  });

  const touchSwipeFallback = bindTouchSwipeFallback(track, {
    canStart: () => !isAnimating,
    onStart: () => {
      movementTween?.kill();
      gsap.killTweensOf(track);
    },
    onMove: ({ dx }) => {
      const step = getSlideStep(track);
      const dragOffset = clamp(dx * 0.5, -step * 0.8, step * 0.8);

      track.classList.add(DRAGGING_CLASS);
      applyOffset(
        track,
        getPositionOffset(track, currentPosition) + dragOffset,
      );
    },
    onSwipe: ({ direction }) => {
      const dragOffset = getRenderedOffset(track);

      track.classList.remove(DRAGGING_CLASS);
      shouldSuppressClick = true;
      queueMove(direction, true, dragOffset);
    },
    onCancel: () => {
      track.classList.remove(DRAGGING_CLASS);
      snapToPosition(track, currentPosition);
    },
    threshold: SWIPE_THRESHOLD,
  });

  root.addEventListener('keydown', (event) => {
    if (isFormControl(event.target)) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      if (currentPosition <= 0) {
        return;
      }

      event.preventDefault();
      focusControl(controls.prev);
      queueMove(-1, true);
      return;
    }

    if (event.key === 'ArrowRight') {
      if (currentPosition >= getMaxPosition(root, track)) {
        return;
      }

      event.preventDefault();
      focusControl(controls.next);
      queueMove(1, true);
    }
  });

  root.addEventListener('focusin', (event) => {
    const slide = event.target.closest?.('.team-link');

    if (
      !slide ||
      slide.parentElement !== track ||
      slide.getAttribute(VISIBLE_ATTR) !== 'false'
    ) {
      return;
    }

    const slideIndex = slides.indexOf(slide);
    const visibleCount = getVisibleSlideCount(root, track);
    const nextPosition =
      slideIndex < currentPosition
        ? slideIndex
        : slideIndex - visibleCount + 1;

    // Keep every profile available to assistive technology. When keyboard
    // focus reaches an off-screen card, move the finite track just far enough
    // to reveal it without changing the DOM or looping back to the beginning.
    moveToPosition(nextPosition, true);
  });

  track.addEventListener('pointerdown', (event) => {
    if (isAnimating || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    movementTween?.kill();
    gsap.killTweensOf(track);

    pointerState = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: getPositionOffset(track, currentPosition),
      lockedAxis: null,
      dragged: false,
    };
  });

  track.addEventListener('pointermove', (event) => {
    if (!pointerState || pointerState.id !== event.pointerId) {
      return;
    }

    const dx = event.clientX - pointerState.startX;
    const dy = event.clientY - pointerState.startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (!pointerState.lockedAxis && (absX > 8 || absY > 8)) {
      pointerState.lockedAxis = absX > absY ? 'x' : 'y';
    }

    if (pointerState.lockedAxis !== 'x') {
      return;
    }

    event.preventDefault();

    if (!track.hasPointerCapture(event.pointerId)) {
      try {
        track.setPointerCapture(event.pointerId);
      } catch {
        // setPointerCapture can fail when the pointer is already released.
      }
    }

    const step = getSlideStep(track);
    const dragOffset = clamp(dx * 0.5, -step * 0.8, step * 0.8);

    pointerState.dragged = true;
    track.classList.add(DRAGGING_CLASS);
    applyOffset(track, pointerState.startOffset + dragOffset);
  });

  track.addEventListener('pointerup', (event) => {
    if (!pointerState || pointerState.id !== event.pointerId) {
      return;
    }

    const dx = event.clientX - pointerState.startX;
    const dy = event.clientY - pointerState.startY;
    const shouldMove =
      pointerState.dragged &&
      Math.abs(dx) > SWIPE_THRESHOLD &&
      Math.abs(dx) > Math.abs(dy);
    const dragOffset = getRenderedOffset(track);
    const wasDragged = pointerState.dragged;

    pointerState = null;
    track.classList.remove(DRAGGING_CLASS);

    if (wasDragged) {
      touchSwipeFallback.markPointerHandled();
    }

    if (shouldMove) {
      shouldSuppressClick = true;
      queueMove(dx < 0 ? 1 : -1, true, dragOffset);
      return;
    }

    snapToPosition(track, currentPosition);
  });

  track.addEventListener('pointercancel', () => {
    pointerState = null;
    track.classList.remove(DRAGGING_CLASS);
    snapToPosition(track, currentPosition);
  });

  track.addEventListener(
    'click',
    (event) => {
      if (!shouldSuppressClick) {
        return;
      }

      shouldSuppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );

  const refresh = debounce(() => {
    cancelMovement();
    currentPosition = clamp(
      currentPosition,
      0,
      getMaxPosition(root, track),
    );
    applyOffset(track, getPositionOffset(track, currentPosition));
    syncSlides(root, track, currentPosition);
    updateControlsState(
      controls,
      isPlaying,
      currentPosition,
      getMaxPosition(root, track),
    );
  }, 120);

  window.addEventListener('resize', refresh);
  root.__bemkeTeamSliderRefresh = refresh;

  applyOffset(track, 0);
  updateControlsState(
    controls,
    isPlaying,
    currentPosition,
    getMaxPosition(root, track),
  );
  window.requestAnimationFrame(() => {
    syncSlides(root, track, currentPosition);
    updateControlsState(
      controls,
      isPlaying,
      currentPosition,
      getMaxPosition(root, track),
    );
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }

    startAutoplay();
  });

  document.addEventListener(MOTION_CHANGE_EVENT, (event) => {
    if (!event.detail?.reduced) {
      return;
    }

    cancelMovement();
    currentPosition = clamp(
      currentPosition,
      0,
      getMaxPosition(root, track),
    );
    applyOffset(track, getPositionOffset(track, currentPosition));
    syncSlides(root, track, currentPosition);
    updateControlsState(
      controls,
      isPlaying,
      currentPosition,
      getMaxPosition(root, track),
    );
  });

  function queueMove(direction, restartTimer = false, dragOffset = null) {
    const normalizedDirection = direction < 0 ? -1 : 1;

    if (isAnimating) {
      queuedDirection = normalizedDirection;
      return;
    }

    moveToPosition(
      currentPosition + normalizedDirection,
      restartTimer,
      dragOffset,
    );
  }

  function moveToPosition(
    requestedPosition,
    restartTimer = false,
    renderedOffset = null,
  ) {
    const maxPosition = getMaxPosition(root, track);
    const nextPosition = clamp(requestedPosition, 0, maxPosition);
    const step = getSlideStep(track);

    if (restartTimer && isPlaying) {
      startAutoplay();
    }

    if (nextPosition === currentPosition || step <= 0) {
      snapToPosition(track, currentPosition);

      if (isPlaying && currentPosition >= maxPosition) {
        disableAutoplay();
      } else {
        updateControlsState(
          controls,
          isPlaying,
          currentPosition,
          maxPosition,
        );
      }

      return;
    }

    currentPosition = nextPosition;
    const targetOffset = getPositionOffset(track, currentPosition);

    if (Number.isFinite(renderedOffset)) {
      applyOffset(track, renderedOffset);
    }

    if (isReducedMotion()) {
      applyOffset(track, targetOffset);
      syncSlides(root, track, currentPosition);
      finishPositionChange();
      flushQueuedMove();
      return;
    }

    isAnimating = true;
    updateControlsState(
      controls,
      isPlaying,
      currentPosition,
      maxPosition,
    );
    movementTween = animateOffset(track, targetOffset, finishMove);
  }

  function finishMove() {
    movementTween = null;
    isAnimating = false;
    applyOffset(track, getPositionOffset(track, currentPosition));
    syncSlides(root, track, currentPosition);
    finishPositionChange();
    flushQueuedMove();
  }

  function finishPositionChange() {
    const maxPosition = getMaxPosition(root, track);

    if (isPlaying && currentPosition >= maxPosition) {
      disableAutoplay();
      return;
    }

    updateControlsState(
      controls,
      isPlaying,
      currentPosition,
      maxPosition,
    );
  }

  function cancelMovement() {
    movementTween?.kill();
    movementTween = null;
    gsap.killTweensOf(track);
    isAnimating = false;
    queuedDirection = 0;
  }

  function flushQueuedMove() {
    if (!queuedDirection) {
      return;
    }

    const direction = queuedDirection;
    queuedDirection = 0;
    queueMove(direction);
  }

  function enableAutoplay(shouldAdvance = false) {
    if (currentPosition >= getMaxPosition(root, track)) {
      updateControlsState(
        controls,
        false,
        currentPosition,
        getMaxPosition(root, track),
      );
      return;
    }

    isPlaying = true;

    if (shouldAdvance) {
      queueMove(1);
    }

    startAutoplay();
    updateControlsState(
      controls,
      isPlaying,
      currentPosition,
      getMaxPosition(root, track),
    );
  }

  function disableAutoplay() {
    isPlaying = false;
    stopAutoplay();
    updateControlsState(
      controls,
      isPlaying,
      currentPosition,
      getMaxPosition(root, track),
    );
  }

  function startAutoplay() {
    if (!isPlaying) {
      return;
    }

    stopAutoplay();
    autoplayTimerId = window.setInterval(() => queueMove(1), AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (!autoplayTimerId) {
      return;
    }

    window.clearInterval(autoplayTimerId);
    autoplayTimerId = null;
  }
}

function getTeamSlides(track) {
  return Array.from(track?.children ?? []).filter((slide) =>
    slide.querySelector(TEAM_TRIGGER_SELECTOR),
  );
}

function decorateSlider(root, track, slides) {
  sliderId += 1;

  if (!track.id) {
    track.id = `bemke-team-slider-track-${sliderId}`;
  }

  if (!root.hasAttribute('role')) {
    root.setAttribute('role', 'region');
  }

  root.setAttribute('aria-roledescription', 'karuzela');

  if (!root.hasAttribute('aria-label') && !root.hasAttribute('aria-labelledby')) {
    root.setAttribute('aria-label', getSliderLabel(root));
  }

  if (!root.hasAttribute('tabindex')) {
    root.setAttribute('tabindex', '0');
  }

  track.setAttribute('aria-live', 'off');
  track.setAttribute('aria-atomic', 'false');

  ensureSliderStatus(root);

  slides.forEach((slide, index) => {
    const name = slide
      .querySelector('.font-size-h4')
      ?.textContent?.replace(/\s+/g, ' ')
      .trim();

    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slajd');
    slide.setAttribute(
      'aria-label',
      `${name ? `${name}, ` : ''}osoba ${index + 1} z ${slides.length}`,
    );
  });
}

function prepareSlides(slides) {
  slides.forEach((slide) => {
    slide.querySelectorAll(FOCUSABLE_SELECTOR).forEach((node) => {
      if (!node.hasAttribute(ORIGINAL_TABINDEX_ATTR)) {
        node.setAttribute(
          ORIGINAL_TABINDEX_ATTR,
          node.getAttribute('tabindex') ?? '',
        );
      }
    });

    slide.querySelectorAll('img').forEach((image) => {
      image.setAttribute('draggable', 'false');
      image.setAttribute('decoding', 'async');
      image.draggable = false;
    });
  });
}

function syncSlides(root, track, currentPosition = 0) {
  const rootRect = root.getBoundingClientRect();
  const slides = getTeamSlides(track);

  slides.forEach((slide, index) => {
    const rect = slide.getBoundingClientRect();
    const overlap = Math.max(
      0,
      Math.min(rect.right, rootRect.right) - Math.max(rect.left, rootRect.left),
    );
    const isVisible = rect.width > 0 && overlap >= Math.min(rect.width * 0.5, 80);
    const isCurrent = index === currentPosition;

    slide.setAttribute(ACTIVE_ATTR, isCurrent ? '1' : '0');
    slide.setAttribute(VISIBLE_ATTR, isVisible ? 'true' : 'false');
    slide.removeAttribute('aria-hidden');

    if (isCurrent) {
      slide.setAttribute('aria-current', 'true');
    } else {
      slide.removeAttribute('aria-current');
    }

    restoreSlideInteractivity(slide);
  });

  updateSliderStatus(root, currentPosition, slides.length, track);
}

function ensureSliderStatus(root) {
  const existingStatus = root.querySelector(`:scope > .${STATUS_CLASS}`);

  if (existingStatus) {
    return existingStatus;
  }

  const status = document.createElement('p');
  status.className = `${STATUS_CLASS} bemke-sr-only`;
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  root.appendChild(status);

  return status;
}

function updateSliderStatus(root, currentPosition, total, track) {
  const status = ensureSliderStatus(root);
  const visibleCount = getVisibleSlideCount(root, track);
  const first = Math.min(total, currentPosition + 1);
  const last = Math.min(total, currentPosition + visibleCount);
  const message =
    first === last
      ? `Wyświetlana osoba ${first} z ${total}.`
      : `Wyświetlane osoby ${first}–${last} z ${total}.`;

  if (status.textContent !== message) {
    status.textContent = message;
  }
}

function restoreSlideInteractivity(slide) {
  if ('inert' in slide) {
    slide.inert = false;
  }

  slide.removeAttribute('inert');

  slide.querySelectorAll(FOCUSABLE_SELECTOR).forEach((node) => {
    const originalTabindex = node.getAttribute(ORIGINAL_TABINDEX_ATTR);

    if (originalTabindex) {
      node.setAttribute('tabindex', originalTabindex);
      return;
    }

    node.removeAttribute('tabindex');
  });
}

function bindControls(controls, track, handlers) {
  bindSliderControl(controls.pause, {
    label: 'Pauza autoplay',
    controlsId: track.id,
    handler: handlers.onPause,
  });
  bindSliderControl(controls.play, {
    label: 'Start autoplay',
    controlsId: track.id,
    handler: handlers.onPlay,
  });
  bindSliderControl(controls.prev, {
    label: 'Poprzednia osoba',
    controlsId: track.id,
    handler: handlers.onPrev,
  });
  bindSliderControl(controls.next, {
    label: 'Następna osoba',
    controlsId: track.id,
    handler: handlers.onNext,
  });
}

function updateControlsState(
  controls,
  isPlaying,
  currentPosition,
  maxPosition,
) {
  setControlDisabled(controls.prev, currentPosition <= 0);
  setControlDisabled(controls.next, currentPosition >= maxPosition);
  setControlDisabled(
    controls.play,
    isPlaying || currentPosition >= maxPosition,
  );
  setControlDisabled(controls.pause, !isPlaying);
}

function setControlDisabled(control, disabled) {
  if (!control) {
    return;
  }

  control.classList.toggle('is-disabled', disabled);
  control.setAttribute('aria-disabled', disabled ? 'true' : 'false');
}

function getVisibleSlideCount(root, track) {
  const slides = getTeamSlides(track);
  const firstRect = slides[0]?.getBoundingClientRect();
  const step = getSlideStep(track);
  const rootWidth = root.getBoundingClientRect().width;

  if (!firstRect?.width || step <= 0 || rootWidth <= 0) {
    return 1;
  }

  const gap = Math.max(0, step - firstRect.width);

  return clamp(
    Math.floor((rootWidth + gap + 1) / step),
    1,
    slides.length,
  );
}

function getMaxPosition(root, track) {
  return Math.max(
    0,
    getTeamSlides(track).length - getVisibleSlideCount(root, track),
  );
}

function getPositionOffset(track, position) {
  return (
    -clamp(position, 0, getTeamSlides(track).length - 1) *
    getSlideStep(track)
  );
}

function getSlideStep(track) {
  const slides = getTeamSlides(track);
  const firstRect = slides[0]?.getBoundingClientRect();
  const secondRect = slides[1]?.getBoundingClientRect();

  if (firstRect && secondRect) {
    const measuredStep = secondRect.left - firstRect.left;

    if (measuredStep > 0) {
      return measuredStep;
    }
  }

  const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
  return (firstRect?.width ?? 0) + gap;
}

function applyOffset(track, offset) {
  gsap.set(track, { x: offset, force3D: true });
}

function animateOffset(track, offset, onComplete) {
  return gsap.to(track, {
    x: offset,
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
    force3D: true,
    overwrite: 'auto',
    onComplete,
  });
}

function snapToPosition(track, position) {
  const targetOffset = getPositionOffset(track, position);

  if (isReducedMotion()) {
    applyOffset(track, targetOffset);
    return;
  }

  gsap.to(track, {
    x: targetOffset,
    duration: SNAP_DURATION,
    ease: SNAP_EASE,
    force3D: true,
    overwrite: 'auto',
  });
}

function getRenderedOffset(track) {
  const offset = Number(gsap.getProperty(track, 'x'));
  return Number.isFinite(offset) ? offset : 0;
}

function getSliderLabel(root) {
  const heading = root.closest('section')?.querySelector('h1, h2, h3');
  const label = heading?.textContent?.replace(/\s+/g, ' ').trim();

  return label ? `Slider: ${label}` : 'Slider zespołu';
}

function focusControl(control) {
  if (control && document.activeElement !== control) {
    control.focus({ preventScroll: true });
  }
}

function isFormControl(target) {
  return Boolean(target?.closest?.('input, textarea, select, button, [contenteditable="true"]'));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function debounce(fn, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}
