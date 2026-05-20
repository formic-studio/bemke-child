const SELECTORS = {
  root: ".slider-thinktank",
  track: ".slider-wrapper",
  slide: ".slide-thinktank",
  title: ".slide-tittle",
  textWrap: ".slider-text-wrapper",
  textSlide: ".slide-text",
  controlsWrap: ".slider-paggination",
  control: ".arrow",
};

const INIT_ATTR = "data-thinktank-ready";
const BOOT_FLAG = "__bemkeThinktankBooted";
const AUTOPLAY_MS = 1200;
const VISIBLE_RANGE = 3;

const SLOT_PROFILE = {
  left: {
    1: {
      xFactor: 2.4,
      clipPath: "polygon(0 0, 74% 16%, 74% 84%, 0 100%)",
      overlayOpacity: 0.62,
      scale: 0.93,
    },
    2: {
      xFactor: 4.22,
      clipPath: "polygon(0 0, 72% 17%, 72% 83%, 0 100%)",
      overlayOpacity: 0.66,
      scale: 0.9,
    },
    3: {
      xFactor: 6.2,
      clipPath: "polygon(0 0, 70% 18%, 70% 82%, 0 100%)",
      overlayOpacity: 0.7,
      scale: 0.87,
    },
  },
  right: {
    1: {
      xFactor: 2.4,
      clipPath: "polygon(26% 16%, 100% 0, 100% 100%, 26% 84%)",
      overlayOpacity: 0.62,
      scale: 0.93,
    },
    2: {
      xFactor: 4.22,
      clipPath: "polygon(28% 17%, 100% 0, 100% 100%, 28% 83%)",
      overlayOpacity: 0.66,
      scale: 0.9,
    },
    3: {
      xFactor: 6.2,
      clipPath: "polygon(30% 18%, 100% 0, 100% 100%, 30% 82%)",
      overlayOpacity: 0.7,
      scale: 0.87,
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
    if (root.getAttribute(INIT_ATTR) === "1") {
      if (typeof root.__bemkeThinktankRefresh === "function") {
        root.__bemkeThinktankRefresh();
      }

      return;
    }

    root.setAttribute(INIT_ATTR, "1");
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

  window.addEventListener("load", rerunInit);
  document.addEventListener("bricks/ajax/end", rerunInit);
  document.addEventListener("bricks/popup/open", rerunInit);
  document.addEventListener("bricks/popup/close", rerunInit);

  window.setTimeout(rerunInit, 200);
  window.setTimeout(rerunInit, 800);
  window.setTimeout(rerunInit, 1800);

  if (!window.MutationObserver || !document.body) {
    return;
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) {
            continue;
          }

          if (
            node.matches(SELECTORS.root) ||
            node.querySelector(SELECTORS.root)
          ) {
            rerunInit();
            return;
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function createSlider(root) {
  const track = root.querySelector(SELECTORS.track);
  const slides = Array.from(root.querySelectorAll(SELECTORS.slide));
  const textWrap = root.querySelector(SELECTORS.textWrap);
  const textSlides = textWrap
    ? Array.from(textWrap.querySelectorAll(SELECTORS.textSlide))
    : [];

  if (!track || slides.length < 3) {
    return;
  }

  const controls = getControls(root);
  let activeIndex = 0;
  let isPlaying = false;
  let intervalId = null;
  let isAnimating = false;
  const queue = [];

  slides.forEach((slide, index) => {
    slide.classList.remove("bricks-lazy-hidden");
    slide
      .querySelector(SELECTORS.title)
      ?.classList.remove("bricks-lazy-hidden");

    if (!slide.querySelector(".slide-overlay")) {
      const overlay = document.createElement("span");
      overlay.className = "slide-overlay";
      overlay.setAttribute("aria-hidden", "true");
      slide.appendChild(overlay);
    }

    if (!slide.hasAttribute("tabindex")) {
      slide.setAttribute("tabindex", "0");
    }

    slide.addEventListener("click", () => {
      const distance = signedCircularDistance(
        activeIndex,
        index,
        slides.length,
      );

      if (distance === 0) {
        return;
      }

      queueMove(distance > 0 ? 1 : -1, Math.abs(distance), true);
    });
  });

  textSlides.forEach((textSlide) => {
    textSlide.classList.remove("bricks-lazy-hidden");
  });

  bindControls(controls, {
    onPause: () => disableAutoplay(),
    onPlay: () => enableAutoplay(),
    onPrev: () => queueMove(-1, 1, true),
    onNext: () => queueMove(1, 1, true),
  });

  render(activeIndex, activeIndex, 0, true);
  updateControlsState(controls, isPlaying);

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", startAutoplay);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }

    startAutoplay();
  });

  window.addEventListener(
    "resize",
    debounce(() => {
      queue.length = 0;
      render(activeIndex, activeIndex, 0, true);
    }, 120),
  );

  root.__bemkeThinktankRefresh = () => {
    queue.length = 0;
    render(activeIndex, activeIndex, 0, true);
  };

  function queueMove(direction, steps = 1, restartTimer = false) {
    for (let i = 0; i < steps; i += 1) {
      queue.push(direction);
    }

    if (restartTimer && isPlaying) {
      startAutoplay();
    }

    processQueue();
  }

  function processQueue() {
    if (isAnimating) {
      return;
    }

    const direction = queue.shift();

    if (!direction) {
      return;
    }

    const previousIndex = activeIndex;
    activeIndex = wrapIndex(activeIndex + direction, slides.length);
    render(previousIndex, activeIndex, direction, false);
  }

  function enableAutoplay() {
    isPlaying = true;
    startAutoplay();
    updateControlsState(controls, isPlaying);
  }

  function disableAutoplay() {
    isPlaying = false;
    stopAutoplay();
    updateControlsState(controls, isPlaying);
  }

  function startAutoplay() {
    if (!isPlaying) {
      return;
    }

    stopAutoplay();
    intervalId = window.setInterval(() => {
      queueMove(1, 1, false);
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (!intervalId) {
      return;
    }

    window.clearInterval(intervalId);
    intervalId = null;
  }

  function render(previousIndex, nextIndex, direction, instant) {
    const range = Math.min(VISIBLE_RANGE, Math.floor((slides.length - 1) / 2));
    const step = getStep(slides[0]);
    const duration =
      instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 760;

    isAnimating = duration > 0;

    slides.forEach((slide, index) => {
      let fromDistance = circularDistance(index, previousIndex, slides.length);
      const toDistance = circularDistance(index, nextIndex, slides.length);

      if (direction === 1 && fromDistance === -range && toDistance === range) {
        fromDistance = range + 1;
      } else if (
        direction === -1 &&
        fromDistance === range &&
        toDistance === -range
      ) {
        fromDistance = -range - 1;
      }

      const fromState = getStateForDistance(fromDistance, range, step);
      const toState = getStateForDistance(toDistance, range, step);

      if (duration > 0) {
        applyState(slide, fromState, true);
      }

      window.requestAnimationFrame(() => {
        applyState(slide, toState, false);
      });

      slide.classList.toggle("is-center", toDistance === 0);
      slide.classList.toggle("is-visible", toState.opacity > 0.01);
      setSlotClass(slide, toDistance, range);
      slide.style.pointerEvents = toDistance === 0 ? "auto" : "none";

      if (duration > 0) {
        window.setTimeout(() => {
          isAnimating = false;
          processQueue();
        }, duration + 34);
      }
    });

    syncTextSlides(textSlides, nextIndex);

    if (duration === 0) {
      isAnimating = false;
      processQueue();
    }
  }
}

function getControls(root) {
  const controlsWrap = root.querySelector(SELECTORS.controlsWrap);

  if (!controlsWrap) {
    return {};
  }

  const arrows = Array.from(controlsWrap.querySelectorAll(SELECTORS.control));

  return {
    pause: arrows[0] || null,
    play: arrows[1] || null,
    prev: arrows[2] || null,
    next: arrows[3] || null,
  };
}

function bindControls(controls, handlers) {
  bindControl(controls.pause, "Pauza autoplay", handlers.onPause);
  bindControl(controls.play, "Start autoplay", handlers.onPlay);
  bindControl(controls.prev, "Poprzedni slajd", handlers.onPrev);
  bindControl(controls.next, "Następny slajd", handlers.onNext);
}

function bindControl(control, label, handler) {
  if (!control || typeof handler !== "function") {
    return;
  }

  control.classList.remove("bricks-lazy-hidden");
  control.setAttribute("role", "button");
  control.setAttribute("tabindex", "0");
  control.setAttribute("aria-label", label);

  control.addEventListener("click", handler);
  control.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handler();
  });
}

function updateControlsState(controls, isPlaying) {
  if (controls.play) {
    controls.play.classList.toggle("is-disabled", isPlaying);
    controls.play.setAttribute("aria-disabled", isPlaying ? "true" : "false");
  }

  if (controls.pause) {
    controls.pause.classList.toggle("is-disabled", !isPlaying);
    controls.pause.setAttribute("aria-disabled", !isPlaying ? "true" : "false");
  }
}

function syncTextSlides(textSlides, activeIndex) {
  if (!textSlides.length) {
    return;
  }

  const normalized = activeIndex % textSlides.length;

  textSlides.forEach((textSlide, index) => {
    const isActive = index === normalized;
    textSlide.classList.toggle("is-active", isActive);
    textSlide.hidden = !isActive;
  });
}

function applyState(slide, state, immediate) {
  if (immediate) {
    slide.classList.add("is-immediate");
  } else {
    slide.classList.remove("is-immediate");
  }

  slide.style.setProperty("--tx", `${state.x}px`);
  slide.style.setProperty("--scale", `${state.scale}`);
  slide.style.setProperty("--overlay-opacity", `${state.overlayOpacity}`);
  slide.style.opacity = String(state.opacity);
  slide.style.zIndex = String(state.zIndex);
}

function getStateForDistance(distance, range, step) {
  const abs = Math.abs(distance);
  const side = distance < 0 ? "left" : "right";

  if (distance === 0) {
    return {
      x: 0,
      scale: 1,
      overlayOpacity: 0,
      opacity: 1,
      zIndex: 50,
    };
  }

  if (abs > range) {
    const edgeProfile = SLOT_PROFILE[side][range] || SLOT_PROFILE[side][3];

    return {
      x: (side === "left" ? -1 : 1) * step * (edgeProfile.xFactor + 0.84),
      scale: edgeProfile.scale,
      overlayOpacity: edgeProfile.overlayOpacity,
      opacity: 0,
      zIndex: 1,
    };
  }

  const profile = SLOT_PROFILE[side][abs];

  return {
    x: (side === "left" ? -1 : 1) * step * profile.xFactor,
    scale: profile.scale,
    overlayOpacity: profile.overlayOpacity,
    opacity: 1,
    zIndex: 40 - abs,
  };
}

function setSlotClass(slide, distance, range) {
  slide.classList.remove(
    "is-slot-center",
    "is-slot-left-1",
    "is-slot-left-2",
    "is-slot-left-3",
    "is-slot-right-1",
    "is-slot-right-2",
    "is-slot-right-3",
    "is-slot-hidden-left",
    "is-slot-hidden-right",
  );

  if (distance === 0) {
    slide.classList.add("is-slot-center");
    return;
  }

  const abs = Math.abs(distance);

  if (abs > range) {
    slide.classList.add(
      distance < 0 ? "is-slot-hidden-left" : "is-slot-hidden-right",
    );
    return;
  }

  slide.classList.add(
    distance < 0 ? `is-slot-left-${abs}` : `is-slot-right-${abs}`,
  );
}

function getStep(firstSlide) {
  const slideWidth = firstSlide
    ? firstSlide.getBoundingClientRect().width
    : 324;
  return clamp(slideWidth * 0.41, 50, 110);
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
