const ROOT_SELECTOR = '.slider:not(.slider-thinktank)';
const TRACK_SELECTOR = '.slider-wrapper';
const SLIDE_SELECTOR = '.slide';
const CONTROLS_SELECTOR = '.slider-paggination';
const ARROW_SELECTOR = '.arrow';

const READY_ATTR = 'data-bemke-slider-ready';
const ACTIVE_ATTR = 'slide-active';
const BOOT_FLAG = '__bemkeHomeSliderBooted';
const RESETTING_CLASS = 'is-resetting';
const DRAGGING_CLASS = 'is-dragging';

const ANIMATION_MS = 640;
const SWIPE_THRESHOLD = 46;

let sliderId = 0;

export function initHomeSlider() {
  initHomeSliderRoots();
  setupHomeSliderLifecycle();
}

function initHomeSliderRoots(scope = document) {
  scope.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
    if (root.getAttribute(READY_ATTR) === '1') {
      root.__bemkeHomeSliderRefresh?.();
      return;
    }

    createHomeSlider(root);
  });
}

function setupHomeSliderLifecycle() {
  if (window[BOOT_FLAG]) {
    return;
  }

  window[BOOT_FLAG] = true;

  const rerunInit = debounce(() => {
    initHomeSliderRoots();
  }, 90);

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

function createHomeSlider(root) {
  const track = root.querySelector(TRACK_SELECTOR);
  const slides = track ? Array.from(track.querySelectorAll(`:scope > ${SLIDE_SELECTOR}`)) : [];

  if (!track || slides.length < 2) {
    return;
  }

  const controls = getControls(root);
  let activeIndex = getInitialActiveIndex(slides);
  let currentOffset = 0;
  let isAnimating = false;
  let queuedDirection = 0;
  let transitionTimerId = null;
  let pointerState = null;

  root.setAttribute(READY_ATTR, '1');
  decorateSlider(root, track, slides);
  bindControls(controls, track, {
    onPrev: () => queueMove(-1),
    onNext: () => queueMove(1),
  });

  root.addEventListener('keydown', (event) => {
    if (isFormControl(event.target)) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      queueMove(-1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      queueMove(1);
    }
  });

  track.addEventListener('pointerdown', (event) => {
    if (isAnimating || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    pointerState = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offset: currentOffset,
      lockedAxis: null,
      dragged: false,
    };

    try {
      track.setPointerCapture(event.pointerId);
    } catch {
      // setPointerCapture can fail when the pointer is already released.
    }
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

    pointerState.dragged = true;
    track.classList.add(DRAGGING_CLASS);
    applyOffset(track, pointerState.offset + dx * 0.36);
  });

  track.addEventListener('pointerup', (event) => {
    if (!pointerState || pointerState.id !== event.pointerId) {
      return;
    }

    const dx = event.clientX - pointerState.startX;
    const dy = event.clientY - pointerState.startY;
    const shouldMove =
      pointerState.dragged && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy);

    pointerState = null;
    track.classList.remove(DRAGGING_CLASS);

    if (shouldMove) {
      queueMove(dx < 0 ? 1 : -1);
      return;
    }

    applyOffset(track, currentOffset);
  });

  track.addEventListener('pointercancel', () => {
    pointerState = null;
    track.classList.remove(DRAGGING_CLASS);
    applyOffset(track, currentOffset);
  });

  window.addEventListener(
    'resize',
    debounce(() => {
      arrangeSlides(track, slides, activeIndex);
      currentOffset = recenterActive(root, track, slides[activeIndex], currentOffset);
    }, 120),
  );

  root.__bemkeHomeSliderRefresh = () => {
    arrangeSlides(track, slides, activeIndex);
    syncSlides(slides, activeIndex);
    currentOffset = recenterActive(root, track, slides[activeIndex], currentOffset);
  };

  arrangeSlides(track, slides, activeIndex);
  syncSlides(slides, activeIndex);
  currentOffset = recenterActive(root, track, slides[activeIndex], currentOffset);

  function queueMove(direction) {
    const normalizedDirection = direction < 0 ? -1 : 1;

    if (isAnimating) {
      queuedDirection = normalizedDirection;
      return;
    }

    move(normalizedDirection);
  }

  function move(direction) {
    const nextIndex = wrapIndex(activeIndex + direction, slides.length);
    const activeSlide = slides[activeIndex];
    const nextSlide = slides[nextIndex];
    const distance = getSlideCenter(nextSlide) - getSlideCenter(activeSlide);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    syncSlides(slides, nextIndex);

    if (prefersReducedMotion || distance === 0) {
      activeIndex = nextIndex;
      arrangeSlides(track, slides, activeIndex);
      currentOffset = recenterActive(root, track, slides[activeIndex], currentOffset);
      flushQueuedMove();
      return;
    }

    isAnimating = true;
    currentOffset -= distance;
    applyOffset(track, currentOffset);

    window.clearTimeout(transitionTimerId);
    transitionTimerId = window.setTimeout(() => {
      transitionTimerId = null;
      isAnimating = false;
      activeIndex = nextIndex;
      arrangeSlides(track, slides, activeIndex);
      currentOffset = recenterActive(root, track, slides[activeIndex], currentOffset);
      flushQueuedMove();
    }, ANIMATION_MS + 40);
  }

  function flushQueuedMove() {
    if (!queuedDirection) {
      return;
    }

    const direction = queuedDirection;
    queuedDirection = 0;
    move(direction);
  }
}

function decorateSlider(root, track, slides) {
  sliderId += 1;

  if (!track.id) {
    track.id = `bemke-home-slider-track-${sliderId}`;
  }

  if (!root.hasAttribute('role')) {
    root.setAttribute('role', 'region');
  }

  if (!root.hasAttribute('aria-roledescription')) {
    root.setAttribute('aria-roledescription', 'karuzela');
  }

  if (!root.hasAttribute('aria-label') && !root.hasAttribute('aria-labelledby')) {
    root.setAttribute('aria-label', getSliderLabel(root));
  }

  if (!root.hasAttribute('tabindex')) {
    root.setAttribute('tabindex', '0');
  }

  track.setAttribute('aria-live', 'polite');
  track.setAttribute('aria-atomic', 'false');

  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slajd');
    slide.setAttribute('aria-label', `Slajd ${index + 1} z ${slides.length}`);
  });
}

function bindControls(controls, track, handlers) {
  bindControl(controls.prev, 'Poprzedni slajd', track.id, handlers.onPrev);
  bindControl(controls.next, 'Następny slajd', track.id, handlers.onNext);
}

function bindControl(control, label, controlsId, handler) {
  if (!control || typeof handler !== 'function') {
    return;
  }

  control.setAttribute('role', 'button');
  control.setAttribute('tabindex', '0');
  control.setAttribute('aria-label', label);
  control.setAttribute('aria-controls', controlsId);

  control.querySelectorAll('svg').forEach((svg) => {
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
  });

  control.addEventListener('click', handler);
  control.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    handler();
  });
}

function getControls(root) {
  const controlsWrap = root.querySelector(CONTROLS_SELECTOR);
  const arrows = controlsWrap ? Array.from(controlsWrap.querySelectorAll(ARROW_SELECTOR)) : [];

  return {
    prev: arrows[0] ?? null,
    next: arrows[1] ?? null,
  };
}

function getInitialActiveIndex(slides) {
  const activeIndex = slides.findIndex((slide) => slide.getAttribute(ACTIVE_ATTR) === '1');
  return activeIndex >= 0 ? activeIndex : 0;
}

function arrangeSlides(track, slides, activeIndex) {
  const orderedSlides = [];

  for (let offset = -1; offset < slides.length - 1; offset += 1) {
    orderedSlides.push(slides[wrapIndex(activeIndex + offset, slides.length)]);
  }

  orderedSlides.forEach((slide) => {
    track.appendChild(slide);
  });
}

function syncSlides(slides, activeIndex) {
  slides.forEach((slide, index) => {
    const isActive = index === activeIndex;
    slide.setAttribute(ACTIVE_ATTR, isActive ? '1' : '0');
    slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    slide.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function recenterActive(root, track, activeSlide, currentOffset) {
  if (!activeSlide) {
    return currentOffset;
  }

  root.classList.add(RESETTING_CLASS);

  const nextOffset = currentOffset + getRootCenter(root) - getSlideCenter(activeSlide);
  applyOffset(track, nextOffset);
  track.offsetHeight;

  window.requestAnimationFrame(() => {
    root.classList.remove(RESETTING_CLASS);
  });

  return nextOffset;
}

function getRootCenter(root) {
  const rect = root.getBoundingClientRect();
  return rect.left + rect.width / 2;
}

function getSlideCenter(slide) {
  const rect = slide.getBoundingClientRect();
  return rect.left + rect.width / 2;
}

function applyOffset(track, offset) {
  track.style.transform = `translate3d(${offset}px, 0, 0)`;
}

function getSliderLabel(root) {
  const heading = root.closest('section')?.querySelector('h1, h2, h3');
  const label = heading?.textContent?.replace(/\s+/g, ' ').trim();

  return label ? `Slider: ${label}` : 'Slider zdjęć';
}

function isFormControl(target) {
  return Boolean(target?.closest?.('input, textarea, select, button, [contenteditable="true"]'));
}

function wrapIndex(index, total) {
  return (index + total) % total;
}

function debounce(fn, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}
