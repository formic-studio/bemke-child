import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from './motion-preference.js';

const ROOT_SELECTOR = '.video';
const VIDEO_SELECTOR = 'video';
const videoStates = new WeakMap();
const decorativeVideos = new Set();

function rememberVideoState(video) {
  if (videoStates.has(video)) {
    return videoStates.get(video);
  }

  const state = {
    autoplay: video.autoplay || video.hasAttribute('autoplay'),
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
    const playPromise = video.play();
    playPromise?.catch?.(() => {});
  }

  state.wasPlaying = false;
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

  document.addEventListener(MOTION_CHANGE_EVENT, (event) => {
    decorativeVideos.forEach((video) => {
      applyVideoMotionState(video, Boolean(event.detail?.reduced));
    });
  });
}
