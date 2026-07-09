const ROOT_SELECTOR = '.slider.slider-text-wrapper';
const TRACK_SELECTOR = ':scope > .slider-text';
const ITEM_SELECTOR = ':scope > .slide-item';
const READY_ATTR = 'data-bemke-text-slider-ready';
const ACTIVE_CLASS = 'is-text-slider-active';
const EXITING_CLASS = 'is-text-slider-exiting';
const BOOT_FLAG = '__bemkeTextLoopSliderBooted';

const ENTER_MS = 1200;
const HOLD_MS = 1200;
const EXIT_MS = 800;
const EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

export function initTextLoopSlider() {
  initTextLoopSliderRoots();
  setupTextLoopSliderLifecycle();
}

function initTextLoopSliderRoots(scope = document) {
  scope.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
    if (root.closest('.slider-thinktank')) {
      return;
    }

    if (root.getAttribute(READY_ATTR) === '1') {
      root.__bemkeTextLoopSliderRefresh?.();
      return;
    }

    createTextLoopSlider(root);
  });
}

function setupTextLoopSliderLifecycle() {
  if (window[BOOT_FLAG]) {
    return;
  }

  window[BOOT_FLAG] = true;

  const rerunInit = debounce(() => {
    initTextLoopSliderRoots();
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

function createTextLoopSlider(root) {
  const track = root.querySelector(TRACK_SELECTOR);
  const items = track ? Array.from(track.querySelectorAll(ITEM_SELECTOR)) : [];

  if (!track || items.length < 2) {
    return;
  }

  let activeIndex = 0;
  let hasStarted = false;
  let isVisible = false;
  let isAnimating = false;
  let timerId = null;
  let observer = null;

  root.setAttribute(READY_ATTR, '1');
  track.setAttribute('aria-live', 'polite');
  track.setAttribute('aria-atomic', 'true');

  items.forEach((item) => {
    item.classList.remove('bricks-lazy-hidden');
    hideItem(item);
  });

  root.__bemkeTextLoopSliderRefresh = () => {
    if (!hasStarted) {
      observeVisibility();
    }
  };

  observeVisibility();

  function observeVisibility() {
    observer?.disconnect();

    if (prefersReducedMotion()) {
      showItemInstant(items[activeIndex]);
      return;
    }

    if (!window.IntersectionObserver) {
      startLoop();
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;

          if (entry.isIntersecting) {
            startLoop();
            return;
          }

          clearTimer();
        });
      },
      { rootMargin: '0px 0px -16% 0px', threshold: 0.24 },
    );

    observer.observe(root);
  }

  function startLoop() {
    if (!isVisible && window.IntersectionObserver) {
      return;
    }

    if (!hasStarted) {
      hasStarted = true;
      isAnimating = true;
      enterItem(items[activeIndex]).then(() => {
        isAnimating = false;
        scheduleNext();
      });
      return;
    }

    if (isAnimating) {
      return;
    }

    scheduleNext();
  }

  function scheduleNext() {
    clearTimer();

    if (!isVisible && window.IntersectionObserver) {
      return;
    }

    timerId = window.setTimeout(() => {
      showNext();
    }, HOLD_MS);
  }

  function clearTimer() {
    window.clearTimeout(timerId);
    timerId = null;
  }

  function showNext() {
    if (isAnimating) {
      scheduleNext();
      return;
    }

    const currentItem = items[activeIndex];
    const nextIndex = wrapIndex(activeIndex + 1, items.length);
    const nextItem = items[nextIndex];

    isAnimating = true;

    exitItem(currentItem)
      .then(() => {
        activeIndex = nextIndex;
        return enterItem(nextItem);
      })
      .then(() => {
        isAnimating = false;
        scheduleNext();
      });
  }
}

function enterItem(item) {
  item.classList.add(ACTIVE_CLASS);
  item.classList.remove(EXITING_CLASS);
  item.setAttribute('aria-hidden', 'false');
  item.style.visibility = 'visible';

  return runAnimation(
    item,
    [
      {
        opacity: '0',
        transform: 'translate3d(0, 0, 0) scale(0.95)',
        filter: 'blur(8px)',
      },
      {
        opacity: '1',
        transform: 'translate3d(0, 0, 0) scale(1)',
        filter: 'blur(0px)',
      },
    ],
    ENTER_MS,
  );
}

function exitItem(item) {
  item.classList.remove(ACTIVE_CLASS);
  item.classList.add(EXITING_CLASS);
  item.setAttribute('aria-hidden', 'true');

  return runAnimation(
    item,
    [
      {
        opacity: '1',
        transform: 'translate3d(0, 0, 0) scale(1)',
        filter: 'blur(0px)',
      },
      {
        opacity: '0',
        transform: 'translate3d(0, 0, 0) scale(0.95)',
        filter: 'blur(8px)',
      },
    ],
    EXIT_MS,
  ).then(() => {
    hideItem(item);
  });
}

function showItemInstant(item) {
  item.classList.add(ACTIVE_CLASS);
  item.classList.remove(EXITING_CLASS);
  item.setAttribute('aria-hidden', 'false');
  item.style.opacity = '1';
  item.style.transform = 'translate3d(0, 0, 0) scale(1)';
  item.style.filter = 'blur(0px)';
  item.style.visibility = 'visible';
}

function hideItem(item) {
  item.classList.remove(ACTIVE_CLASS, EXITING_CLASS);
  item.setAttribute('aria-hidden', 'true');
  item.style.opacity = '0';
  item.style.transform = 'translate3d(0, 0, 0) scale(0.95)';
  item.style.filter = 'blur(8px)';
  item.style.visibility = 'hidden';
}

function runAnimation(element, keyframes, duration) {
  if (prefersReducedMotion() || typeof element.animate !== 'function') {
    applyFrame(element, keyframes[keyframes.length - 1]);
    return Promise.resolve();
  }

  const animation = element.animate(keyframes, {
    duration,
    easing: EASING,
    fill: 'forwards',
  });

  return animation.finished
    .catch(() => {})
    .then(() => {
      applyFrame(element, keyframes[keyframes.length - 1]);
      animation.cancel();
    });
}

function applyFrame(element, frame) {
  Object.entries(frame).forEach(([property, value]) => {
    element.style[property] = value;
  });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
