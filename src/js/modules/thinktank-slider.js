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
    stepFactor: 0.128,
    minStep: 175,
    maxStep: 255,
    side: {
      left: {
        1: {
          clipPath: 'polygon(0 0, 96% 9%, 96% 91%, 0 100%)',
          overlayOpacity: 0.5,
          rotateY: 10,
          rotateZ: -1.3,
          scale: 1,
        },
        2: {
          clipPath: 'polygon(0 0, 90% 18%, 90% 82%, 0 100%)',
          overlayOpacity: 0.64,
          rotateY: 14,
          rotateZ: -2.1,
          scale: 0.99,
        },
        3: {
          clipPath: 'polygon(0 0, 84% 28%, 84% 72%, 0 100%)',
          overlayOpacity: 0.76,
          rotateY: 18,
          rotateZ: -3,
          scale: 0.98,
        },
      },
      right: {
        1: {
          clipPath: 'polygon(0 9%, 100% 0, 100% 100%, 0 91%)',
          overlayOpacity: 0.5,
          rotateY: -10,
          rotateZ: 1.3,
          scale: 1,
        },
        2: {
          clipPath: 'polygon(0 18%, 100% 0, 100% 100%, 0 82%)',
          overlayOpacity: 0.64,
          rotateY: -14,
          rotateZ: 2.1,
          scale: 0.99,
        },
        3: {
          clipPath: 'polygon(0 28%, 100% 0, 100% 100%, 0 72%)',
          overlayOpacity: 0.76,
          rotateY: -18,
          rotateZ: 3,
          scale: 0.98,
        },
      },
    },
  },
  tablet: {
    visibleRange: 1,
    stepFactor: 0.185,
    minStep: 140,
    maxStep: 220,
    side: {
      left: {
        1: {
          clipPath: 'polygon(0 0, 94% 13%, 94% 87%, 0 100%)',
          overlayOpacity: 0.58,
          rotateY: 9,
          rotateZ: -1,
          scale: 0.99,
        },
      },
      right: {
        1: {
          clipPath: 'polygon(0 13%, 100% 0, 100% 100%, 0 87%)',
          overlayOpacity: 0.58,
          rotateY: -9,
          rotateZ: 1,
          scale: 0.99,
        },
      },
    },
  },
  mobile: {
    visibleRange: 0,
    stepFactor: 0,
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
  let autoplay = true;
  let timer = null;
  let animating = false;

  const controls = buildControls(pagination, slides.length, {
    onPrev: () => goTo(activeIndex - 1),
    onNext: () => goTo(activeIndex + 1),
    onToggle: () => toggleAutoplay(),
    onDot: (index) => goTo(index),
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

  render(true);
  startAutoplay();

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

  window.addEventListener('resize', debounce(() => render(true), 120));

  function goTo(rawIndex) {
    if (animating) {
      return;
    }

    activeIndex = wrapIndex(rawIndex, slides.length);
    render(false);

    if (autoplay) {
      startAutoplay();
    }
  }

  function toggleAutoplay() {
    autoplay = !autoplay;

    if (autoplay) {
      startAutoplay();
    } else {
      stopAutoplay();
    }

    if (controls.toggleButton) {
      controls.toggleButton.textContent = autoplay ? 'II' : '▶';
      controls.toggleButton.setAttribute('aria-label', autoplay ? 'Wstrzymaj autoplay' : 'Wznów autoplay');
    }
  }

  function startAutoplay() {
    if (!autoplay) {
      return;
    }

    stopAutoplay();
    timer = window.setInterval(() => {
      goTo(activeIndex + 1);
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function render(instant) {
    const mode = getMode();
    const geometry = GEOMETRY[mode];
    const step = getStep(geometry);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = instant || reducedMotion ? 0 : 0.72;

    animating = !instant && !reducedMotion;

    slides.forEach((slide, index) => {
      const distance = circularDistance(index, activeIndex, slides.length);
      const state = getSlideState(distance, geometry, step);
      const title = slide.querySelector(SELECTORS.title);

      slide.classList.toggle('is-center', distance === 0);
      slide.classList.toggle('is-visible', state.autoAlpha > 0.01);
      slide.style.pointerEvents = state.autoAlpha > 0.01 ? 'auto' : 'none';

      gsap.to(slide, {
        x: state.x,
        y: state.y,
        z: state.z,
        scale: state.scale,
        rotationY: state.rotationY,
        rotation: state.rotationZ,
        zIndex: state.zIndex,
        autoAlpha: state.autoAlpha,
        clipPath: state.clipPath,
        duration,
        ease: 'power3.inOut',
        overwrite: true,
        onComplete: () => {
          animating = false;
        },
      });

      gsap.to(slide, {
        '--overlay-opacity': state.overlayOpacity,
        duration,
        ease: 'power2.out',
        overwrite: true,
      });

      if (title) {
        gsap.to(title, {
          autoAlpha: distance === 0 ? 1 : 0,
          y: distance === 0 ? 0 : 18,
          duration,
          ease: 'power2.out',
          overwrite: true,
        });
      }
    });

    updateDots(controls.dots, activeIndex);
  }
}

function buildControls(pagination, total, handlers) {
  const empty = { dots: [], toggleButton: null };

  if (!pagination) {
    return empty;
  }

  pagination.innerHTML = '';

  const controls = document.createElement('div');
  controls.className = 'thinktank-controls';

  const pauseButton = document.createElement('button');
  pauseButton.type = 'button';
  pauseButton.className = 'thinktank-btn thinktank-btn--toggle';
  pauseButton.textContent = 'II';
  pauseButton.setAttribute('aria-label', 'Wstrzymaj autoplay');
  pauseButton.addEventListener('click', handlers.onToggle);

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

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'thinktank-dots';

  const dots = Array.from({ length: total }).map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'thinktank-dot';
    dot.setAttribute('aria-label', `Przejdź do slajdu ${index + 1}`);
    dot.addEventListener('click', () => handlers.onDot(index));
    dotsWrap.appendChild(dot);
    return dot;
  });

  controls.appendChild(pauseButton);
  controls.appendChild(prevButton);
  controls.appendChild(nextButton);

  pagination.appendChild(controls);
  pagination.appendChild(dotsWrap);

  return {
    dots,
    toggleButton: pauseButton,
  };
}

function updateDots(dots, activeIndex) {
  dots.forEach((dot, index) => {
    const isActive = index === activeIndex;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
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

function getStep(geometry) {
  if (!geometry.stepFactor) {
    return 0;
  }

  return clamp(window.innerWidth * geometry.stepFactor, geometry.minStep, geometry.maxStep);
}

function getSlideState(distance, geometry, step) {
  const abs = Math.abs(distance);
  const side = distance < 0 ? 'left' : 'right';

  if (abs > geometry.visibleRange) {
    return {
      x: side === 'left' ? -step * 4 : step * 4,
      y: 0,
      z: -120,
      scale: 0.9,
      rotationY: side === 'left' ? 20 : -20,
      rotationZ: side === 'left' ? -3 : 3,
      zIndex: 1,
      autoAlpha: 0,
      overlayOpacity: 0.72,
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

  const profile = geometry.side[side][abs] || geometry.side[side][1];

  return {
    x: step * abs * (side === 'left' ? -1 : 1),
    y: 0,
    z: -24 * abs,
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
