const ROOT_SELECTOR = '.video';
const VIDEO_SELECTOR = 'video';

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
    video.removeAttribute('onclick');
    video.onclick = null;
    video.removeAttribute('controls');
    video.controls = false;
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');
    video.setAttribute('focusable', 'false');
    video.style.pointerEvents = 'none';
  });
}

export function initDecorativeVideoControls() {
  getDecorativeVideoRoots().forEach(decorateVideo);
}
