import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from './motion-preference.js';

const ROOT_SELECTOR = '.infinity-loop-block';
const ITEM_SELECTOR = '.img-wrapper';
const TRACK_CLASS = 'bemke-infinity-loop-track';
const READY_ATTR = 'data-bemke-infinity-loop-ready';
const CLONE_ATTR = 'data-bemke-loop-clone';
const BOOT_FLAG = '__bemkeInfinityLoopBooted';
const PX_PER_SECOND = 50;
const MIN_DURATION = 18;
const MAX_DURATION = 72;

let resizeTimer = null;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function schedule(callback, delay = 120) {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(callback, delay);
}

function removeNodeIds(node) {
  node.removeAttribute('id');
  node.querySelectorAll('[id]').forEach((child) => {
    child.removeAttribute('id');
  });
}

function getTrack(root) {
  let track = root.querySelector(`:scope > .${TRACK_CLASS}`);

  if (track) {
    return track;
  }

  const items = Array.from(root.children).filter((child) => child.matches(ITEM_SELECTOR));

  if (!items.length) {
    return null;
  }

  track = document.createElement('div');
  track.className = TRACK_CLASS;
  root.insertBefore(track, items[0]);

  items.forEach((item) => {
    track.appendChild(item);
  });

  return track;
}

function moveNewItemsIntoTrack(root, track) {
  Array.from(root.children)
    .filter((child) => child !== track && child.matches(ITEM_SELECTOR))
    .forEach((item) => {
      track.appendChild(item);
    });
}

function getOriginalItems(track) {
  return Array.from(track.children).filter(
    (child) => child.matches(ITEM_SELECTOR) && child.getAttribute(CLONE_ATTR) !== '1',
  );
}

function removeClones(track) {
  track.querySelectorAll(`[${CLONE_ATTR}="1"]`).forEach((clone) => {
    clone.remove();
  });
}

function cloneItem(item) {
  const clone = item.cloneNode(true);

  clone.setAttribute(CLONE_ATTR, '1');
  clone.setAttribute('aria-hidden', 'true');
  removeNodeIds(clone);

  clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((focusable) => {
    focusable.setAttribute('tabindex', '-1');
  });

  return clone;
}

function getItemsWidth(items) {
  if (!items.length) {
    return 0;
  }

  const firstRect = items[0].getBoundingClientRect();
  const lastRect = items[items.length - 1].getBoundingClientRect();

  return Math.ceil(lastRect.right - firstRect.left);
}

function getLoopDistance(firstOriginal, firstClone) {
  if (!firstOriginal || !firstClone) {
    return 0;
  }

  const originalRect = firstOriginal.getBoundingClientRect();
  const cloneRect = firstClone.getBoundingClientRect();

  return Math.ceil(cloneRect.left - originalRect.left);
}

function refreshInfinityLoop(root) {
  const track = getTrack(root);

  if (!track) {
    return;
  }

  moveNewItemsIntoTrack(root, track);
  removeClones(track);

  const originals = getOriginalItems(track);

  if (!originals.length) {
    return;
  }

  root.setAttribute(READY_ATTR, '1');
  originals.forEach((item) => {
    item.removeAttribute('aria-hidden');
  });

  if (originals.length < 2) {
    track.style.animation = 'none';
    return;
  }

  if (isReducedMotion()) {
    track.style.animation = 'none';
    track.style.transform = 'none';
    return;
  }

  track.style.animation = 'none';
  track.style.transform = '';
  track.offsetHeight;

  const baseWidth = getItemsWidth(originals);
  const viewportWidth = root.getBoundingClientRect().width;

  if (!baseWidth || !viewportWidth) {
    return;
  }

  let firstClone = null;

  originals.forEach((item, index) => {
    const clone = cloneItem(item);

    if (index === 0) {
      firstClone = clone;
    }

    track.appendChild(clone);
  });

  const loopDistance = getLoopDistance(originals[0], firstClone);

  if (!loopDistance) {
    return;
  }

  const extraSets = Math.max(0, Math.ceil((viewportWidth + loopDistance) / loopDistance) - 1);

  for (let setIndex = 0; setIndex < extraSets; setIndex += 1) {
    originals.forEach((item) => {
      track.appendChild(cloneItem(item));
    });
  }

  const duration = clamp(loopDistance / PX_PER_SECOND, MIN_DURATION, MAX_DURATION);

  root.style.setProperty('--bemke-loop-distance', `${loopDistance}px`);
  root.style.setProperty('--bemke-loop-duration', `${duration}s`);

  track.offsetHeight;
  track.style.animation = '';
}

function refreshAllLoops() {
  document.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
    refreshInfinityLoop(root);
  });
}

function observeImages(root) {
  root.querySelectorAll('img').forEach((image) => {
    if (image.complete) {
      return;
    }

    image.addEventListener(
      'load',
      () => {
        refreshInfinityLoop(root);
      },
      { once: true },
    );
  });
}

function setupInfinityLoop(root) {
  refreshInfinityLoop(root);
  observeImages(root);
}

function initAddedLoops(mutations) {
  let shouldRefresh = false;

  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof Element)) {
        continue;
      }

      if (node.getAttribute(CLONE_ATTR) === '1' || node.closest(`[${CLONE_ATTR}="1"]`)) {
        continue;
      }

      if (node.matches(ROOT_SELECTOR) || node.querySelector(ROOT_SELECTOR) || node.closest(ROOT_SELECTOR)) {
        shouldRefresh = true;
        break;
      }
    }

    if (shouldRefresh) {
      break;
    }
  }

  if (shouldRefresh) {
    schedule(refreshAllLoops);
  }
}

export function initInfinityLoop() {
  document.querySelectorAll(ROOT_SELECTOR).forEach(setupInfinityLoop);

  if (window[BOOT_FLAG]) {
    return;
  }

  window[BOOT_FLAG] = true;

  window.addEventListener('load', () => {
    schedule(refreshAllLoops, 60);
  });

  window.addEventListener('resize', () => {
    schedule(refreshAllLoops, 160);
  });

  document.addEventListener('bricks/ajax/end', () => {
    schedule(refreshAllLoops, 80);
  });

  document.addEventListener(MOTION_CHANGE_EVENT, () => {
    schedule(refreshAllLoops, 0);
  });

  if (window.MutationObserver && document.body) {
    new MutationObserver(initAddedLoops).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}
