import { gsap } from 'gsap';

const SELECTORS = {
  root: '.slider-thinktank',
  track: '.slider-wrapper',
  slide: '.slide-thinktank',
  title: '.slide-tittle',
  pagination: '.slider-paggination',
};

const AUTOPLAY_MS = 4200;
const INIT_ATTR = 'data-thinktank-ready';
const BOOT_FLAG = '__bemkeThinktankBooted';

// Tuning: tutaj najszybciej dopasujesz "kąty" paneli do makiety.
const GEOMETRY = {
  desktop: {
    visibleRange: 3,
    minStep: 120,
    maxStep: 210,
    side: {
      left: {
        1: {
          clipPath: 'polygon(0 0, 92% 8%, 92% 92%, 0 100%)',
          overlayOpacity: 0.5,
          rotateY: 8,
          rotateZ: -1.1,
          scale: 1,
        },
        2: {
          clipPath: 'polygon(0 0, 84% 18%, 84% 82%, 0 100%)',
          overlayOpacity: 0.63,
          rotateY: 11,
          rotateZ: -1.9,
          scale: 0.99,
        },
        3: {
          clipPath: 'polygon(0 0, 76% 28%, 76% 72%, 0 100%)',
          overlayOpacity: 0.74,
          rotateY: 13,
          rotateZ: -2.7,
          scale: 0.98,
        },
      },
      right: {
        1: {
          clipPath: 'polygon(0 8%, 100% 0, 100% 100%, 0 92%)',
          overlayOpacity: 0.5,
          rotateY: -8,
          rotateZ: 1.1,
          scale: 1,
        },
        2: {
          clipPath: 'polygon(0 18%, 100% 0, 100% 100%, 0 82%)',
          overlayOpacity: 0.63,
          rotateY: -11,
          rotateZ: 1.9,
          scale: 0.99,
        },
        3: {
          clipPath: 'polygon(0 28%, 100% 0, 100% 100%, 0 72%)',
          overlayOpacity: 0.74,
          rotateY: -13,
          rotateZ: 2.7,
          scale: 0.98,
        },
      },
    },
  },
  tablet: {
    visibleRange: 2,
    minStep: 105,
    maxStep: 180,
    side: {
      left: {
        1: {
          clipPath: 'polygon(0 0, 90% 12%, 90% 88%, 0 100%)',
          overlayOpacity: 0.56,
          rotateY: 8,
          rotateZ: -1,
          scale: 1,
        },
        2: {
          clipPath: 'polygon(0 0, 80% 22%, 80% 78%, 0 100%)',
          overlayOpacity: 0.68,
          rotateY: 11,
          rotateZ: -1.8,
          scale: 0.98,
        },
      },
      right: {
        1: {
          clipPath: 'polygon(0 12%, 100% 0, 100% 100%, 0 88%)',
          overlayOpacity: 0.56,
          rotateY: -8,
          rotateZ: 1,
          scale: 1,
        },
        2: {
          clipPath: 'polygon(0 22%, 100% 0, 100% 100%, 0 78%)',
          overlayOpacity: 0.68,
          rotateY: -11,
          rotateZ: 1.8,
          scale: 0.98,
        },
      },
    },
  },
  mobile: {
    visibleRange: 0,
    minStep: 0,
    maxStep: 0,
    side: {
      left: {},
      right: {},
    },
  },
};

export function initThinktankSlider() {
  initThinktankSliderRoots();
  setupThinktankLifecycle();
}

function initThinktankSliderRoots(scope = document) {
  const roots = scope.querySelectorAll(SELECTORS.root);

  roots.forEach((root) => {
    if (root.getAttribute(INIT_ATTR) === '1') {
      return;
    }

    root.setAttribute(INIT_ATTR, '1');
    createSlider(root);
  });
}

function setupThinktankLifecycle() {
  if (window[BOOT_FLAG]) {
    return;
  }

  window[BOOT_FLAG] = true;

  const rerunInit = debounce(() => {
    initThinktankSliderRoots();
  }, 90);

  window.addEventListener('load', rerunInit);
  document.addEventListener('bricks/ajax/end', rerunInit);
  document.addEventListener('bricks/popup/open', rerunInit);
  document.addEventListener('bricks/popup/close', rerunInit);

  window.setTimeout(rerunInit, 150);
  window.setTimeout(rerunInit, 700);
  window.setTimeout(rerunInit, 1600);

  if (!window.MutationObserver || !document.body) {
    return;
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        if (mutation.target.matches(SELECTORS.root) || mutation.target.closest(SELECTORS.root)) {
          rerunInit();
          return;
        }
      }

      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) {
            continue;
          }

          if (node.matches(SELECTORS.root) || node.querySelector(SELECTORS.root)) {
            rerunInit();
            return;
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
    childList: true,
    subtree: true,
  });
}

function createSlider(root) {
  const track = root.querySelector(SELECTORS.track);
  const slides = Array.from(root.querySelectorAll(SELECTORS.slide));
  const pagination = root.querySelector(SELECTORS.pagination);

  if (!track || slides.length < 3) {
    return;
  }

  let activeIndex = Math.floor(slides.length / 2);
  let autoplay = false;
  let timer = null;
  let isAnimating = false;
  const pendingDirections = [];

  const controls = buildControls(pagination, {
    onPrev: () => queueMove(-1, 1, true),
    onNext: () => queueMove(1, 1, true),
    onPlay: () => enableAutoplay(),
    onStop: () => disableAutoplay(),
  });

  slides.forEach((slide, index) => {
    gsap.set(slide, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      transformOrigin: 'center center',
      force3D: true,
      willChange: 'transform, opacity, clip-path',
    });

    slide.addEventListener('click', () => {
      if (index !== activeIndex) {
        goTo(index);
      }
    });
  });

  render(activeIndex, activeIndex, 0, true);
  syncPlayStopButtons();

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }

    startAutoplay();
  });

  window.addEventListener('resize', debounce(() => {
    pendingDirections.length = 0;
    render(activeIndex, activeIndex, 0, true);
  }, 120));

  function goTo(rawIndex) {
    const targetIndex = wrapIndex(rawIndex, slides.length);

    if (targetIndex === activeIndex) {
      return;
    }

    const distance = signedCircularDistance(activeIndex, targetIndex, slides.length);
    const direction = distance > 0 ? 1 : -1;
    queueMove(direction, Math.abs(distance), true);
  }

  function queueMove(direction, steps, resetAutoplay) {
    for (let i = 0; i < steps; i += 1) {
      pendingDirections.push(direction);
    }

    if (resetAutoplay && autoplay) {
      startAutoplay();
    }

    processQueue();
  }

  function processQueue() {
    if (isAnimating) {
      return;
    }

    const direction = pendingDirections.shift();

    if (!direction) {
      return;
    }

    const previousIndex = activeIndex;
    activeIndex = wrapIndex(activeIndex + direction, slides.length);
    render(previousIndex, activeIndex, direction, false);
  }

  function enableAutoplay() {
    autoplay = true;
    startAutoplay();
    syncPlayStopButtons();
  }

  function disableAutoplay() {
    autoplay = false;
    stopAutoplay();
    syncPlayStopButtons();
  }

  function syncPlayStopButtons() {
    if (controls.playButton) {
      controls.playButton.disabled = autoplay;
      controls.playButton.setAttribute('aria-pressed', autoplay ? 'true' : 'false');
    }

    if (controls.stopButton) {
      controls.stopButton.disabled = !autoplay;
      controls.stopButton.setAttribute('aria-pressed', autoplay ? 'false' : 'true');
    }
  }

  function startAutoplay() {
    if (!autoplay) {
      return;
    }

    stopAutoplay();
    timer = window.setInterval(() => {
      queueMove(1, 1, false);
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function render(previousIndex, nextIndex, direction, instant) {
    const mode = getMode();
    const geometry = GEOMETRY[mode];
    const range = getEffectiveRange(geometry.visibleRange, slides.length);
    const step = getStep(track, slides[0], range, geometry);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = instant || reducedMotion ? 0 : 0.58;
    const shouldAnimate = !instant && !reducedMotion;
    let pending = slides.length;

    isAnimating = shouldAnimate;

    slides.forEach((slide, index) => {
      let fromDistance = circularDistance(index, previousIndex, slides.length);
      const toDistance = circularDistance(index, nextIndex, slides.length);
      const title = slide.querySelector(SELECTORS.title);

      // Zapobiega "teleportowi" przez środek: element zawijany przechodzi spoza krawędzi.
      if (direction === 1 && fromDistance === -range && toDistance === range) {
        fromDistance = range + 1;
      } else if (direction === -1 && fromDistance === range && toDistance === -range) {
        fromDistance = -range - 1;
      }

      const fromState = getSlideState(fromDistance, geometry, step, range);
      const toState = getSlideState(toDistance, geometry, step, range);

      slide.classList.toggle('is-center', toDistance === 0);
      slide.classList.toggle('is-visible', toState.autoAlpha > 0.01);
      slide.style.pointerEvents = toState.autoAlpha > 0.01 ? 'auto' : 'none';

      if (shouldAnimate) {
        gsap.set(slide, slideStateToGsap(fromState));
      }

      gsap.to(slide, {
        ...slideStateToGsap(toState),
        duration,
        ease: 'power3.out',
        overwrite: true,
        onComplete: () => {
          pending -= 1;

          if (pending === 0) {
            isAnimating = false;
            processQueue();
          }
        },
      });

      gsap.to(slide, {
        '--overlay-opacity': toState.overlayOpacity,
        duration,
        ease: 'power2.out',
        overwrite: true,
      });

      if (title) {
        gsap.to(title, {
          autoAlpha: toDistance === 0 ? 1 : 0,
          y: toDistance === 0 ? 0 : 18,
          duration,
          ease: 'power2.out',
          overwrite: true,
        });
      }
    });

    if (!shouldAnimate) {
      isAnimating = false;
      processQueue();
    }

  }
}

function buildControls(pagination, handlers) {
  const empty = { playButton: null, stopButton: null };

  if (!pagination) {
    return empty;
  }

  pagination.innerHTML = '';

  const controls = document.createElement('div');
  controls.className = 'thinktank-controls';

  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.className = 'thinktank-btn thinktank-btn--play';
  playButton.textContent = '▶';
  playButton.setAttribute('aria-label', 'Włącz autoplay');
  playButton.addEventListener('click', handlers.onPlay);

  const stopButton = document.createElement('button');
  stopButton.type = 'button';
  stopButton.className = 'thinktank-btn thinktank-btn--stop';
  stopButton.textContent = '■';
  stopButton.setAttribute('aria-label', 'Zatrzymaj autoplay');
  stopButton.addEventListener('click', handlers.onStop);

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'thinktank-btn thinktank-btn--prev';
  prevButton.textContent = '‹';
  prevButton.setAttribute('aria-label', 'Poprzedni slajd');
  prevButton.addEventListener('click', handlers.onPrev);

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'thinktank-btn thinktank-btn--next';
  nextButton.textContent = '›';
  nextButton.setAttribute('aria-label', 'Następny slajd');
  nextButton.addEventListener('click', handlers.onNext);

  controls.appendChild(playButton);
  controls.appendChild(stopButton);
  controls.appendChild(prevButton);
  controls.appendChild(nextButton);

  pagination.appendChild(controls);

  return {
    playButton,
    stopButton,
  };
}

function getMode() {
  if (window.innerWidth >= 1200) {
    return 'desktop';
  }

  if (window.innerWidth >= 768) {
    return 'tablet';
  }

  return 'mobile';
}

function getStep(track, firstSlide, range, geometry) {
  if (!range) {
    return 0;
  }

  const trackWidth = track.getBoundingClientRect().width || window.innerWidth;
  const slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width : 324;
  const availableHalf = Math.max(0, (trackWidth - slideWidth) / 2 - 12);
  const rawStep = availableHalf / range;

  return clamp(rawStep, geometry.minStep, geometry.maxStep);
}

function getEffectiveRange(preferredRange, totalSlides) {
  return Math.min(preferredRange, Math.max(0, Math.floor((totalSlides - 1) / 2)));
}

function getSlideState(distance, geometry, step, visibleRange) {
  const abs = Math.abs(distance);
  const side = distance < 0 ? 'left' : 'right';

  if (abs > visibleRange) {
    return {
      x: side === 'left' ? -step * (visibleRange + 1) : step * (visibleRange + 1),
      y: 0,
      z: -80,
      scale: 0.95,
      rotationY: side === 'left' ? 10 : -10,
      rotationZ: side === 'left' ? -2 : 2,
      zIndex: 1,
      autoAlpha: 0,
      overlayOpacity: 0.8,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    };
  }

  if (distance === 0) {
    return {
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
      rotationY: 0,
      rotationZ: 0,
      zIndex: 50,
      autoAlpha: 1,
      overlayOpacity: 0,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    };
  }

  const profile = geometry.side[side][abs] || geometry.side[side][Math.min(abs, 1)] || {
    clipPath: side === 'left'
      ? 'polygon(0 0, 90% 12%, 90% 88%, 0 100%)'
      : 'polygon(0 12%, 100% 0, 100% 100%, 0 88%)',
    overlayOpacity: 0.62,
    rotateY: side === 'left' ? 10 : -10,
    rotateZ: side === 'left' ? -1.6 : 1.6,
    scale: 0.99,
  };

  return {
    x: step * abs * (side === 'left' ? -1 : 1),
    y: 0,
    z: -18 * abs,
    scale: profile.scale,
    rotationY: profile.rotateY,
    rotationZ: profile.rotateZ,
    zIndex: 40 - abs,
    autoAlpha: 1,
    overlayOpacity: profile.overlayOpacity,
    clipPath: profile.clipPath,
  };
}

function circularDistance(index, activeIndex, total) {
  let distance = index - activeIndex;
  const half = total / 2;

  if (distance > half) {
    distance -= total;
  }

  if (distance < -half) {
    distance += total;
  }

  return distance;
}

function signedCircularDistance(from, to, total) {
  let distance = to - from;
  const half = total / 2;

  if (distance > half) {
    distance -= total;
  }

  if (distance < -half) {
    distance += total;
  }

  return distance;
}

function slideStateToGsap(state) {
  return {
    x: state.x,
    y: state.y,
    z: state.z,
    scale: state.scale,
    rotationY: state.rotationY,
    rotation: state.rotationZ,
    zIndex: state.zIndex,
    autoAlpha: state.autoAlpha,
    clipPath: state.clipPath,
  };
}

function wrapIndex(index, total) {
  return (index + total) % total;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function debounce(fn, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}
