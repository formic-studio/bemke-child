import { gsap } from 'gsap';

const SELECTORS = {
  root: '.slider-thinktank',
  track: '.slider-wrapper',
  slide: '.slide-thinktank',
  title: '.slide-tittle',
  pagination: '.slider-paggination',
};

const AUTOPLAY_MS = 4200;

export function initThinktankSlider() {
  const roots = document.querySelectorAll(SELECTORS.root);

  roots.forEach((root) => {
    createSlider(root);
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
    const step = getStep(mode);
    const visibleRange = mode === 'desktop' ? 3 : mode === 'tablet' ? 1 : 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = instant || reducedMotion ? 0 : 0.72;

    animating = !instant && !reducedMotion;

    slides.forEach((slide, index) => {
      const distance = circularDistance(index, activeIndex, slides.length);
      const state = getSlideState(distance, visibleRange, step);
      const title = slide.querySelector(SELECTORS.title);

      slide.classList.toggle('is-center', distance === 0);
      slide.classList.toggle('is-visible', state.autoAlpha > 0.01);
      slide.style.pointerEvents = state.autoAlpha > 0.01 ? 'auto' : 'none';

      gsap.to(slide, {
        x: state.x,
        scale: state.scale,
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

function getStep(mode) {
  if (mode === 'desktop') {
    return clamp(window.innerWidth * 0.13, 170, 260);
  }

  if (mode === 'tablet') {
    return clamp(window.innerWidth * 0.18, 140, 230);
  }

  return 0;
}

function getSlideState(distance, visibleRange, step) {
  const abs = Math.abs(distance);
  const side = distance < 0 ? 'left' : 'right';

  if (abs > visibleRange) {
    return {
      x: side === 'left' ? -step * 4 : step * 4,
      scale: 0.86,
      zIndex: 1,
      autoAlpha: 0,
      overlayOpacity: 0.62,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    };
  }

  if (distance === 0) {
    return {
      x: 0,
      scale: 1,
      zIndex: 50,
      autoAlpha: 1,
      overlayOpacity: 0,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    };
  }

  const x = step * abs * (side === 'left' ? -1 : 1);
  const zIndex = 40 - abs;
  const opacityMap = { 1: 1, 2: 0.95, 3: 0.88 };
  const overlayMap = { 1: 0.54, 2: 0.67, 3: 0.78 };
  const clipMapLeft = {
    1: 'polygon(0 0, 100% 14%, 100% 86%, 0 100%)',
    2: 'polygon(0 0, 100% 22%, 100% 78%, 0 100%)',
    3: 'polygon(0 0, 100% 30%, 100% 70%, 0 100%)',
  };
  const clipMapRight = {
    1: 'polygon(0 14%, 100% 0, 100% 100%, 0 86%)',
    2: 'polygon(0 22%, 100% 0, 100% 100%, 0 78%)',
    3: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)',
  };

  return {
    x,
    scale: 1,
    zIndex,
    autoAlpha: opacityMap[abs] ?? 0.82,
    overlayOpacity: overlayMap[abs] ?? 0.8,
    clipPath: side === 'left' ? clipMapLeft[abs] : clipMapRight[abs],
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
