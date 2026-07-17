import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from './motion-preference.js';

const ROOT_SELECTOR = '.video';
const VIDEO_SELECTOR = 'video';
const videoStates = new WeakMap();
const decorativeVideos = new Set();
const VIDEO_START_DELAY_MS = 150;
const VIDEO_IDLE_TIMEOUT_MS = 800;
let activationDelayId = null;
let activationIdleId = null;

function rememberVideoState(video) {
  if (videoStates.has(video)) {
    return videoStates.get(video);
  }

  const state = {
    autoplay:
      video.dataset.bemkeAutoplay === 'true' ||
      video.autoplay ||
      video.hasAttribute('autoplay'),
    loop: video.loop || video.hasAttribute('loop'),
    wasPlaying: false,
  };

  videoStates.set(video, state);

  return state;
}

function applyVideoMotionState(video, reduced) {
  const state = rememberVideoState(video);

  if (reduced) {
    state.wasPlaying = state.wasPlaying || !video.paused;
    video.pause();
    video.autoplay = false;
    video.loop = false;
    video.removeAttribute('autoplay');
    video.removeAttribute('loop');
    return;
  }

  video.autoplay = state.autoplay;
  video.loop = state.loop;

  if (state.autoplay) {
    video.setAttribute('autoplay', '');
  }

  if (state.loop) {
    video.setAttribute('loop', '');
  }

  if (state.wasPlaying || state.autoplay) {
    if (video.dataset.bemkeSrc) {
      return;
    }

    const playPromise = video.play();
    playPromise?.catch?.(() => {});
  }

  state.wasPlaying = false;
}

function hydrateDeferredVideo(video) {
  const source = video.dataset.bemkeSrc;

  if (!source || isReducedMotion()) {
    return false;
  }

  const state = rememberVideoState(video);

  video.src = source;
  delete video.dataset.bemkeSrc;
  video.preload = 'metadata';
  video.loop = state.loop;
  video.autoplay = state.autoplay;
  video.load();

  if (state.autoplay) {
    const playPromise = video.play();
    playPromise?.catch?.(() => {});
  }

  return true;
}

function activateDeferredVideos() {
  if (isReducedMotion()) {
    return;
  }

  decorativeVideos.forEach((video) => {
    hydrateDeferredVideo(video);
  });
}

function scheduleDeferredVideoActivation() {
  if (
    activationDelayId !== null ||
    activationIdleId !== null ||
    isReducedMotion() ||
    !Array.from(decorativeVideos).some((video) => video.dataset.bemkeSrc)
  ) {
    return;
  }

  activationDelayId = window.setTimeout(() => {
    activationDelayId = null;

    if (isReducedMotion()) {
      return;
    }

    if (typeof window.requestIdleCallback === 'function') {
      activationIdleId = window.requestIdleCallback(
        () => {
          activationIdleId = null;
          activateDeferredVideos();
        },
        { timeout: VIDEO_IDLE_TIMEOUT_MS },
      );
      return;
    }

    activateDeferredVideos();
  }, VIDEO_START_DELAY_MS);
}

function cancelDeferredVideoActivation() {
  if (activationDelayId !== null) {
    window.clearTimeout(activationDelayId);
    activationDelayId = null;
  }

  if (
    activationIdleId !== null &&
    typeof window.cancelIdleCallback === 'function'
  ) {
    window.cancelIdleCallback(activationIdleId);
    activationIdleId = null;
  }
}

function getDecorativeVideoRoots() {
  return Array.from(document.querySelectorAll(ROOT_SELECTOR));
}

function decorateVideo(root) {
  const videos = Array.from(root.querySelectorAll(VIDEO_SELECTOR));
  if (!videos.length) {
    return;
  }

  root.setAttribute('aria-hidden', 'true');

  videos.forEach((video) => {
    decorativeVideos.add(video);
    rememberVideoState(video);
    video.removeAttribute('onclick');
    video.onclick = null;
    video.removeAttribute('controls');
    video.controls = false;
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');
    video.setAttribute('focusable', 'false');
    video.style.pointerEvents = 'none';

    if (isReducedMotion()) {
      applyVideoMotionState(video, true);
    }
  });
}

export function initDecorativeVideoControls() {
  getDecorativeVideoRoots().forEach(decorateVideo);
  scheduleDeferredVideoActivation();

  document.addEventListener(MOTION_CHANGE_EVENT, (event) => {
    const reduced = Boolean(event.detail?.reduced);

    decorativeVideos.forEach((video) => {
      applyVideoMotionState(video, reduced);
    });

    if (reduced) {
      cancelDeferredVideoActivation();
      return;
    }

    scheduleDeferredVideoActivation();
  });
}
