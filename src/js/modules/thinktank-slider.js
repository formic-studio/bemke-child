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
const AUTOPLAY_MS = 2200;
const VISIBLE_RANGE = 3;
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const SCROLL_TRIGGER_MEDIA_QUERY = "(min-width: 768px)";
const SCROLL_TRIGGER_OPTIONS = {
  rootMargin: "0px 0px -18% 0px",
  threshold: 0.18,
};

let hasDesktopScrollOccurred = false;
let viewportObserver = null;

const SLOT_PROFILE = {
  left: {
    1: {
      xFactor: 2.4,
      clipPath: "polygon(0 0, 74% 16%, 74% 84%, 0 100%)",
      overlayOpacity: 0.62,
      scale: 0.93,
    },
    2: {
      xFactor: 4.225,
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
      xFactor: 4.225,
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

const MOBILE_SLOT_PROFILE = {
  left: {
    1: {
      xFactor: 3.2,
      overlayOpacity: 0,
      scale: 1,
    },
  },
  right: {
    1: {
      xFactor: 3.2,
      overlayOpacity: 0,
      scale: 1,
    },
  },
};

const TEXT_ANIMATION_MS = 720;
const TEXT_TRACK_CLASS = "slider-text-track";
const TEXT_GHOST_CLASS = "is-text-ghost";

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

    if (shouldDeferThinktankInitUntilVisible()) {
      observeThinktankRoot(root);
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

  if (window.matchMedia) {
    window.addEventListener(
      "resize",
      debounce(() => {
        initThinktankSliderRoots();
      }, 120),
    );
  }

  if (window.matchMedia?.(SCROLL_TRIGGER_MEDIA_QUERY).matches) {
    window.addEventListener(
      "scroll",
      debounce(() => {
        if (hasDesktopScrollOccurred) {
          return;
        }

        hasDesktopScrollOccurred = true;
        activateVisibleObservedThinktankRoots();
      }, 60),
      { passive: true },
    );
  }

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

function shouldDeferThinktankInitUntilVisible() {
  if (!window.matchMedia || !window.IntersectionObserver) {
    return false;
  }

  if (!window.matchMedia(SCROLL_TRIGGER_MEDIA_QUERY).matches) {
    return false;
  }

  return true;
}

function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();

  return rect.top < window.innerHeight && rect.bottom > 0;
}

function observeThinktankRoot(root) {
  if (!window.IntersectionObserver) {
    createSlider(root);
    return;
  }

  if (root.__bemkeThinktankObserved) {
    return;
  }

  const observer = getThinktankViewportObserver();

  if (!observer) {
    createSlider(root);
    return;
  }

  root.__bemkeThinktankObserved = true;
  observer.observe(root);
}

function getThinktankViewportObserver() {
  if (viewportObserver) {
    return viewportObserver;
  }

  viewportObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const root = entry.target;
      if (!hasDesktopScrollOccurred) {
        return;
      }

      root.__bemkeThinktankObserved = false;

      if (root.getAttribute(INIT_ATTR) === "1") {
        viewportObserver?.unobserve(root);
        return;
      }

      viewportObserver?.unobserve(root);
      root.setAttribute(INIT_ATTR, "1");
      createSlider(root);
    });
  }, SCROLL_TRIGGER_OPTIONS);

  return viewportObserver;
}

function activateVisibleObservedThinktankRoots() {
  if (!window.IntersectionObserver) {
    return;
  }

  const roots = document.querySelectorAll(SELECTORS.root);

  roots.forEach((root) => {
    if (
      root.__bemkeThinktankObserved &&
      root.getAttribute(INIT_ATTR) !== "1" &&
      isElementInViewport(root)
    ) {
      root.__bemkeThinktankObserved = false;
      viewportObserver?.unobserve(root);
      root.setAttribute(INIT_ATTR, "1");
      createSlider(root);
    }
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
  let transitionTimerId = null;
  let pointerState = null;
  let ignoreClickUntil = 0;
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
      if (Date.now() < ignoreClickUntil) {
        return;
      }

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

  const textTrack = setupTextTrack(textWrap, textSlides);
  updateTextHeight(textWrap, textSlides);

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => updateTextHeight(textWrap, textSlides));
  }

  bindControls(controls, {
    onPause: () => disableAutoplay(),
    onPlay: () => enableAutoplay(),
    onPrev: () => queueMove(-1, 1, true),
    onNext: () => queueMove(1, 1, true),
  });

  if (!root.hasAttribute("tabindex")) {
    root.setAttribute("tabindex", "0");
  }

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      queueMove(-1, 1, true);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      queueMove(1, 1, true);
    }
  });

  bindSwipeSurface(track);
  bindSwipeSurface(textWrap);

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
      updateTextHeight(textWrap, textSlides);
      render(activeIndex, activeIndex, 0, true);
    }, 120),
  );

  root.__bemkeThinktankRefresh = () => {
    queue.length = 0;
    updateTextHeight(textWrap, textSlides);
    render(activeIndex, activeIndex, 0, true);
  };

  function bindSwipeSurface(surface) {
    if (!surface) {
      return;
    }

    surface.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      pointerState = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        lockedAxis: null,
        surface,
      };

      try {
        surface.setPointerCapture(event.pointerId);
      } catch {
        // setPointerCapture can fail when the pointer is already released.
      }
    });

    surface.addEventListener("pointermove", (event) => {
      if (!pointerState || pointerState.id !== event.pointerId) {
        return;
      }

      const dx = event.clientX - pointerState.startX;
      const dy = event.clientY - pointerState.startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (!pointerState.lockedAxis && (absX > 8 || absY > 8)) {
        pointerState.lockedAxis = absX > absY ? "x" : "y";
      }

      if (pointerState.lockedAxis !== "x") {
        return;
      }

      event.preventDefault();
      pointerState.moved = true;
      pointerState.surface.classList.add("is-dragging");
    });

    surface.addEventListener("pointerup", (event) => {
      if (!pointerState || pointerState.id !== event.pointerId) {
        return;
      }

      const dx = event.clientX - pointerState.startX;
      const dy = event.clientY - pointerState.startY;
      const shouldMove =
        pointerState.moved && Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy);
      const activeSurface = pointerState.surface;

      pointerState = null;
      activeSurface.classList.remove("is-dragging");

      if (!shouldMove) {
        return;
      }

      // Drag left -> next slide, drag right -> previous slide.
      queueMove(dx < 0 ? 1 : -1, 1, true);
      ignoreClickUntil = Date.now() + 260;
    });

    surface.addEventListener("pointercancel", () => {
      if (pointerState?.surface) {
        pointerState.surface.classList.remove("is-dragging");
      }

      pointerState = null;
    });

    surface.addEventListener(
      "click",
      (event) => {
        if (Date.now() >= ignoreClickUntil) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
      },
      true,
    );
  }

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
    const isMobileLayout = window.matchMedia(MOBILE_MEDIA_QUERY).matches;
    const range = getVisibleRange(slides.length, isMobileLayout);
    const step = getStep(slides[0], isMobileLayout);
    const duration =
      instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 1100;

    if (transitionTimerId) {
      window.clearTimeout(transitionTimerId);
      transitionTimerId = null;
    }

    isAnimating = duration > 0;

    slides.forEach((slide, index) => {
      const rawFromDistance = circularDistance(index, previousIndex, slides.length);
      let fromDistance = rawFromDistance;
      const toDistance = circularDistance(index, nextIndex, slides.length);
      const wrapsLeftToRight =
        direction === 1 && rawFromDistance === -range && toDistance === range;
      const wrapsRightToLeft =
        direction === -1 && rawFromDistance === range && toDistance === -range;

      if (wrapsLeftToRight) {
        fromDistance = range + 1;
      } else if (wrapsRightToLeft) {
        fromDistance = -range - 1;
      }

      const fromState = getStateForDistance(
        fromDistance,
        range,
        step,
        isMobileLayout,
      );
      const toState = getStateForDistance(toDistance, range, step, isMobileLayout);
      const rawFromState = getStateForDistance(
        rawFromDistance,
        range,
        step,
        isMobileLayout,
      );

      if (duration > 0) {
        if (wrapsLeftToRight) {
          spawnWrapGhost(
            track,
            slide,
            rawFromState,
            getStateForDistance(-range - 1, range, step, isMobileLayout),
            rawFromDistance,
            -range - 1,
            range,
            duration,
          );
        } else if (wrapsRightToLeft) {
          spawnWrapGhost(
            track,
            slide,
            rawFromState,
            getStateForDistance(range + 1, range, step, isMobileLayout),
            rawFromDistance,
            range + 1,
            range,
            duration,
          );
        }

        applyState(slide, fromState, true);
        setSlotClass(slide, fromDistance, range);

        window.requestAnimationFrame(() => {
          setSlotClass(slide, toDistance, range);
          applyState(slide, toState, false);
          slide.classList.toggle("is-center", toDistance === 0);
          slide.classList.toggle("is-visible", toState.opacity > 0.01);
          slide.style.pointerEvents = toDistance === 0 ? "auto" : "none";
        });
      } else {
        setSlotClass(slide, toDistance, range);
        applyState(slide, toState, false);
        slide.classList.toggle("is-center", toDistance === 0);
        slide.classList.toggle("is-visible", toState.opacity > 0.01);
        slide.style.pointerEvents = toDistance === 0 ? "auto" : "none";
      }
    });

    syncTextSlides(textTrack, textSlides, nextIndex, direction, duration === 0);

    if (duration > 0) {
      transitionTimerId = window.setTimeout(() => {
        transitionTimerId = null;
        isAnimating = false;
        processQueue();
      }, duration + 34);
    }

    if (duration === 0) {
      isAnimating = false;
      processQueue();
    }
  }
}

function spawnWrapGhost(
  track,
  slide,
  fromState,
  toState,
  fromDistance,
  toDistance,
  range,
  duration
) {
  const width = slide.offsetWidth || slide.clientWidth || 324;
  const height = slide.offsetHeight || slide.clientHeight || 470;
  const ghost = slide.cloneNode(true);
  ghost.classList.add("is-ghost", "is-immediate");
  ghost.removeAttribute("id");
  ghost.style.pointerEvents = "none";
  ghost.style.width = `${width}px`;
  ghost.style.height = `${height}px`;
  ghost.setAttribute("aria-hidden", "true");
  ghost.removeAttribute("tabindex");

  ghost.querySelectorAll("[id]").forEach((node) => {
    node.removeAttribute("id");
  });

  track.appendChild(ghost);

  applyState(ghost, fromState, true);
  setSlotClass(ghost, fromDistance, range);
  ghost.classList.remove("is-center");
  ghost.classList.add("is-visible");

  window.requestAnimationFrame(() => {
    ghost.classList.remove("is-immediate");
    setSlotClass(ghost, toDistance, range);
    applyState(ghost, toState, false);
  });

  window.setTimeout(() => {
    ghost.remove();
  }, duration + 120);
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

function syncTextSlides(textTrack, textSlides, activeIndex, direction = 1, instant = false) {
  if (!textSlides.length) {
    return;
  }

  const normalized = activeIndex % textSlides.length;
  const previousIndex = textSlides.findIndex((textSlide) =>
    textSlide.classList.contains("is-active"),
  );
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const targetPosition = getTextTrackPosition(
    previousIndex,
    normalized,
    direction,
    textSlides.length,
  );
  const shouldMoveInstantly =
    instant ||
    prefersReducedMotion ||
    previousIndex < 0 ||
    previousIndex === normalized;

  textSlides.forEach((textSlide, index) => {
    const isActive = index === normalized;
    textSlide.hidden = false;
    textSlide.classList.toggle("is-active", isActive);
    textSlide.setAttribute("aria-hidden", isActive ? "false" : "true");
  });

  setTextTrackPosition(textTrack, targetPosition, shouldMoveInstantly);

  if (
    shouldMoveInstantly ||
    !isTextWraparound(previousIndex, normalized, direction, textSlides.length)
  ) {
    return;
  }

  window.setTimeout(() => {
    setTextTrackPosition(textTrack, normalized + 1, true);
  }, TEXT_ANIMATION_MS + 40);
}

function setupTextTrack(textWrap, textSlides) {
  if (!textWrap || !textSlides.length) {
    return null;
  }

  const existingTrack = textWrap.querySelector(`:scope > .${TEXT_TRACK_CLASS}`);

  if (existingTrack) {
    return existingTrack;
  }

  const textTrack = document.createElement("div");
  textTrack.className = TEXT_TRACK_CLASS;
  textTrack.setAttribute("aria-live", "polite");
  textTrack.setAttribute("aria-atomic", "true");

  textWrap.insertBefore(textTrack, textSlides[0]);
  textTrack.appendChild(createTextGhost(textSlides[textSlides.length - 1]));

  textSlides.forEach((textSlide) => {
    textSlide.hidden = false;
    textTrack.appendChild(textSlide);
  });

  textTrack.appendChild(createTextGhost(textSlides[0]));
  setTextTrackPosition(textTrack, 1, true);

  return textTrack;
}

function createTextGhost(sourceSlide) {
  const ghost = sourceSlide.cloneNode(true);

  ghost.classList.add(TEXT_GHOST_CLASS);
  ghost.classList.remove("is-active");
  ghost.hidden = false;
  ghost.setAttribute("aria-hidden", "true");
  ghost.removeAttribute("id");

  ghost.querySelectorAll("[id]").forEach((node) => {
    node.removeAttribute("id");
  });

  return ghost;
}

function getTextTrackPosition(previousIndex, nextIndex, direction, total) {
  if (previousIndex === total - 1 && nextIndex === 0 && direction > 0) {
    return total + 1;
  }

  if (previousIndex === 0 && nextIndex === total - 1 && direction < 0) {
    return 0;
  }

  return nextIndex + 1;
}

function isTextWraparound(previousIndex, nextIndex, direction, total) {
  return (
    (previousIndex === total - 1 && nextIndex === 0 && direction > 0) ||
    (previousIndex === 0 && nextIndex === total - 1 && direction < 0)
  );
}

function setTextTrackPosition(textTrack, position, instant = false) {
  if (!textTrack) {
    return;
  }

  if (instant) {
    textTrack.classList.add("is-immediate");
  } else {
    textTrack.classList.remove("is-immediate");
  }

  textTrack.style.transform = `translate3d(${-position * 100}%, 0, 0)`;

  if (!instant) {
    return;
  }

  textTrack.offsetHeight;

  window.requestAnimationFrame(() => {
    textTrack.classList.remove("is-immediate");
  });
}

function updateTextHeight(textWrap, textSlides) {
  if (!textWrap || !textSlides.length) {
    return;
  }

  let maxHeight = 0;

  textSlides.forEach((textSlide) => {
    const wasHidden = textSlide.hidden;
    const previousPosition = textSlide.style.position;
    const previousVisibility = textSlide.style.visibility;
    const previousDisplay = textSlide.style.display;

    textSlide.hidden = false;
    textSlide.style.position = "relative";
    textSlide.style.visibility = "hidden";
    textSlide.style.display = "flex";

    maxHeight = Math.max(
      maxHeight,
      textSlide.scrollHeight,
      textSlide.getBoundingClientRect().height,
    );

    textSlide.style.position = previousPosition;
    textSlide.style.visibility = previousVisibility;
    textSlide.style.display = previousDisplay;
    textSlide.hidden = wasHidden;
  });

  if (maxHeight > 0) {
    textWrap.style.setProperty("--tt-text-height", `${Math.ceil(maxHeight)}px`);
  }
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

function getStateForDistance(distance, range, step, isMobileLayout = false) {
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
    const edgeProfile = getSlotProfile(side, range, isMobileLayout);

    return {
      x: (side === "left" ? -1 : 1) * step * (edgeProfile.xFactor + 0.84),
      scale: edgeProfile.scale,
      overlayOpacity: edgeProfile.overlayOpacity,
      opacity: 0,
      zIndex: 1,
    };
  }

  const profile = getSlotProfile(side, abs, isMobileLayout);

  return {
    x: (side === "left" ? -1 : 1) * step * profile.xFactor,
    scale: profile.scale,
    overlayOpacity: profile.overlayOpacity,
    opacity: 1,
    zIndex: 40 - abs,
  };
}

function getSlotProfile(side, distance, isMobileLayout) {
  const profiles = isMobileLayout ? MOBILE_SLOT_PROFILE : SLOT_PROFILE;
  const fallbackProfiles = SLOT_PROFILE[side];

  return (
    profiles[side]?.[distance] ||
    profiles[side]?.[1] ||
    fallbackProfiles[distance] ||
    fallbackProfiles[1]
  );
}

function getVisibleRange(total, isMobileLayout) {
  const maxRange = isMobileLayout ? 1 : VISIBLE_RANGE;
  return Math.min(maxRange, Math.floor((total - 1) / 2));
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

function getStep(firstSlide, isMobileLayout = false) {
  // Use layout width (transform-independent) to keep spacing stable.
  const rawWidth = firstSlide
    ? firstSlide.offsetWidth || firstSlide.clientWidth || 324
    : 324;
  const slideWidth = rawWidth > 40 ? rawWidth : 324;

  if (isMobileLayout) {
    return clamp(slideWidth * 0.42, 76, 124);
  }

  const root = firstSlide?.closest?.(SELECTORS.root);
  const factor = getCssNumber(root, "--tt-step-factor", 0.41);
  const min = getCssNumber(root, "--tt-step-min", 50);
  const max = getCssNumber(root, "--tt-step-max", 110);

  return clamp(slideWidth * factor, min, max);
}

function getCssNumber(element, propertyName, fallback) {
  if (!element) {
    return fallback;
  }

  const value = Number.parseFloat(
    window.getComputedStyle(element).getPropertyValue(propertyName),
  );

  return Number.isFinite(value) ? value : fallback;
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
