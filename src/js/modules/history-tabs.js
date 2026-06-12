const ROOT_SELECTOR = '.tabs-block';
const TAB_SELECTOR = '.tab[tab-number], .tab[data-tab-number]';
const SLIDE_SELECTOR = '.history-slide[tab-number], .history-slide[data-tab-number]';
const IMAGE_SELECTOR = '.history-img[tab-number], .history-img[data-tab-number]';
const SLIDE_WRAPPER_SELECTOR = '.history-slide-wrapper';
const IMAGE_WRAPPER_SELECTOR = '.history-img-wrapper';

const READY_ATTR = 'data-bemke-history-tabs-ready';
const BOOT_FLAG = '__bemkeHistoryTabsBooted';
const ACTIVE_TAB_CLASS = 'tab-active';
const ACTIVE_ITEM_CLASS = 'is-active';
const TRACK_CLASS = 'history-tabs-track';
const TRACK_IMMEDIATE_CLASS = 'is-immediate';

const ANIMATION_MS = 980;

let instanceId = 0;
const imagePreloads = new Set();

export function initHistoryTabs() {
  initHistoryTabRoots();
  setupHistoryTabsLifecycle();
}

function initHistoryTabRoots(scope = document) {
  scope.querySelectorAll(ROOT_SELECTOR).forEach((tabsBlock) => {
    const root = getRoot(tabsBlock);

    if (!root) {
      return;
    }

    if (root.getAttribute(READY_ATTR) === '1') {
      root.__bemkeHistoryTabsRefresh?.();
      return;
    }

    createHistoryTabs(root, tabsBlock);
  });
}

function setupHistoryTabsLifecycle() {
  if (window[BOOT_FLAG]) {
    return;
  }

  window[BOOT_FLAG] = true;

  const rerunInit = debounce(() => {
    initHistoryTabRoots();
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

function createHistoryTabs(root, tabsBlock) {
  const slideWrapper = root.querySelector(SLIDE_WRAPPER_SELECTOR);
  const imageWrapper = root.querySelector(IMAGE_WRAPPER_SELECTOR);
  const tabs = Array.from(tabsBlock.querySelectorAll(TAB_SELECTOR));
  const slides = slideWrapper ? Array.from(slideWrapper.querySelectorAll(SLIDE_SELECTOR)) : [];
  const images = imageWrapper ? Array.from(imageWrapper.querySelectorAll(IMAGE_SELECTOR)) : [];

  if (!tabs.length || (!slides.length && !images.length)) {
    return;
  }

  const tabsByNumber = groupByNumber(tabs);
  const slidesByNumber = groupByNumber(slides);
  const imagesByNumber = groupByNumber(images);
  const numbers = tabs
    .map(getTabNumber)
    .filter((number, index, all) => {
      if (!number || all.indexOf(number) !== index) {
        return false;
      }

      return slidesByNumber.has(number) || imagesByNumber.has(number);
    });

  if (!numbers.length) {
    return;
  }

  instanceId += 1;

  const slideTrack = setupTrack(slideWrapper, slides, 'slides');
  const imageTrack = setupTrack(imageWrapper, images, 'images');

  let activeNumber = getInitialActiveNumber(tabs, numbers);
  let transitionTimerId = null;

  prepareImages(images);
  resetAnimatedItems(slides);
  resetAnimatedItems(images);
  decorateTabs(tabsBlock, tabs, tabsByNumber, slidesByNumber, numbers, instanceId);
  decoratePanels(slides, images, instanceId);
  updateHeights(slideWrapper, slides, imageWrapper, images);

  root.setAttribute(READY_ATTR, '1');
  sync(activeNumber, 1, true);

  tabs.forEach((tab) => {
    const number = getTabNumber(tab);

    if (!number || !numbers.includes(number)) {
      tab.setAttribute('aria-disabled', 'true');
      return;
    }

    tab.addEventListener('click', () => {
      activate(number);
    });

    tab.addEventListener('keydown', (event) => {
      const nextNumber = getKeyboardTarget(event, number, numbers);

      if (!nextNumber) {
        return;
      }

      event.preventDefault();
      focusTab(tabsByNumber.get(nextNumber)?.[0]);
      activate(nextNumber);
    });
  });

  window.addEventListener(
    'resize',
    debounce(() => {
      updateHeights(slideWrapper, slides, imageWrapper, images);
      sync(activeNumber, 1, true);
    }, 120),
  );

  root.__bemkeHistoryTabsRefresh = () => {
    updateHeights(slideWrapper, slides, imageWrapper, images);
    sync(activeNumber, 1, true);
  };

  function activate(nextNumber) {
    if (nextNumber === activeNumber) {
      return;
    }

    const previousNumber = activeNumber;
    const direction = getDirection(previousNumber, nextNumber, numbers);
    activeNumber = nextNumber;
    sync(nextNumber, direction, false, previousNumber);
  }

  function sync(nextNumber, direction, instant, previousNumber = nextNumber) {
    window.clearTimeout(transitionTimerId);
    syncTabs(tabs, nextNumber);
    syncTrack(slideTrack, slides, previousNumber, nextNumber, direction, instant);
    syncTrack(imageTrack, images, previousNumber, nextNumber, direction, instant);

    if (instant || prefersReducedMotion()) {
      return;
    }

    transitionTimerId = window.setTimeout(() => {
      arrangeActiveItems(slideTrack, slides, nextNumber, true);
      arrangeActiveItems(imageTrack, images, nextNumber, true);
    }, ANIMATION_MS + 80);
  }
}

function setupTrack(wrapper, items, modifier) {
  if (!wrapper || !items.length) {
    return null;
  }

  const existingTrack = wrapper.querySelector(`:scope > .${TRACK_CLASS}`);

  if (existingTrack) {
    items.forEach((item) => existingTrack.appendChild(item));
    return existingTrack;
  }

  const track = document.createElement('div');
  track.className = `${TRACK_CLASS} ${TRACK_CLASS}--${modifier}`;
  wrapper.insertBefore(track, items[0]);
  items.forEach((item) => track.appendChild(item));

  return track;
}

function syncTrack(track, items, previousNumber, activeNumber, direction, instant) {
  if (!track || !items.length) {
    return;
  }

  const previousItems = items.filter((item) => getTabNumber(item) === previousNumber);
  const nextItems = items.filter((item) => getTabNumber(item) === activeNumber);
  const reducedMotion = prefersReducedMotion();

  if (instant || reducedMotion || previousNumber === activeNumber || !previousItems.length || !nextItems.length) {
    arrangeActiveItems(track, items, activeNumber, true);
    return;
  }

  const transitionId = getNextTrackTransitionId(track);
  const isForward = direction > 0;
  const transitionItems = uniqueItems(isForward
    ? [...previousItems, ...nextItems]
    : [...nextItems, ...previousItems]);

  items.forEach((item) => {
    const isNext = nextItems.includes(item);
    const isVisibleDuringTransition = transitionItems.includes(item);

    item.hidden = !isVisibleDuringTransition;
    item.classList.toggle(ACTIVE_ITEM_CLASS, isNext);
    item.setAttribute('aria-hidden', isNext ? 'false' : 'true');
  });

  transitionItems.forEach((item) => track.appendChild(item));

  setTrackOffset(track, isForward ? 0 : 1, true);
  track.offsetHeight;

  window.requestAnimationFrame(() => {
    if (track.__bemkeHistoryTransitionId !== transitionId) {
      return;
    }

    setTrackOffset(track, isForward ? 1 : 0, false);
  });
}

function arrangeActiveItems(track, items, activeNumber, immediate) {
  if (!track || !items.length) {
    return;
  }

  const transitionId = getNextTrackTransitionId(track);

  const activeItems = items.filter((item) => getTabNumber(item) === activeNumber);
  const inactiveItems = items.filter((item) => getTabNumber(item) !== activeNumber);

  [...activeItems, ...inactiveItems].forEach((item) => track.appendChild(item));

  items.forEach((item) => {
    const isActive = activeItems.includes(item);

    item.hidden = !isActive;
    item.classList.toggle(ACTIVE_ITEM_CLASS, isActive);
    item.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  setTrackOffset(track, 0, immediate);

  if (immediate) {
    track.offsetHeight;
    window.requestAnimationFrame(() => {
      if (track.__bemkeHistoryTransitionId !== transitionId) {
        return;
      }

      track.classList.remove(TRACK_IMMEDIATE_CLASS);
    });
  }
}

function getNextTrackTransitionId(track) {
  track.__bemkeHistoryTransitionId = (track.__bemkeHistoryTransitionId || 0) + 1;

  return track.__bemkeHistoryTransitionId;
}

function setTrackOffset(track, offset, immediate) {
  track.classList.toggle(TRACK_IMMEDIATE_CLASS, immediate);
  track.style.transform = `translate3d(${-100 * offset}%, 0, 0)`;
}

function resetAnimatedItems(items) {
  items.forEach((item) => {
    item.hidden = false;
    item.classList.remove('is-entering', 'is-leaving', 'is-immediate', ACTIVE_ITEM_CLASS);
    item.style.removeProperty('inset');
    item.style.removeProperty('opacity');
    item.style.removeProperty('pointer-events');
    item.style.removeProperty('position');
    item.style.removeProperty('transform');
    item.style.removeProperty('transition');
    item.style.removeProperty('width');
    item.style.removeProperty('--history-enter-x');
    item.style.removeProperty('--history-exit-x');
  });
}

function getRoot(tabsBlock) {
  return (
    tabsBlock.closest('.brx-grid') ||
    tabsBlock.closest('.brxe-block')?.parentElement ||
    tabsBlock.parentElement
  );
}

function decorateTabs(tabsBlock, tabs, tabsByNumber, slidesByNumber, numbers, id) {
  tabsBlock.setAttribute('role', 'tablist');

  tabs.forEach((tab) => {
    const number = getTabNumber(tab);
    const isEnabled = Boolean(number && numbers.includes(number));

    if (!isEnabled) {
      return;
    }

    const firstPanel = slidesByNumber.get(number)?.[0];
    const tabId = tab.id || `bemke-history-tab-${id}-${number}`;

    tab.id = tabId;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('tabindex', '-1');
    tab.setAttribute('aria-selected', 'false');

    if (firstPanel) {
      firstPanel.id ||= `bemke-history-panel-${id}-${number}`;
      tab.setAttribute('aria-controls', firstPanel.id);
      firstPanel.setAttribute('aria-labelledby', tabId);
    }

    tabsByNumber.get(number)?.forEach((relatedTab) => {
      if (relatedTab !== tab) {
        relatedTab.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

function decoratePanels(slides, images, id) {
  slides.forEach((slide) => {
    const number = getTabNumber(slide);

    slide.id ||= `bemke-history-panel-${id}-${number}`;
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-hidden', 'true');
  });

  images.forEach((image) => {
    image.setAttribute('aria-hidden', 'true');
    image.setAttribute('draggable', 'false');
    image.draggable = false;
  });
}

function syncTabs(tabs, activeNumber) {
  tabs.forEach((tab) => {
    const isActive = getTabNumber(tab) === activeNumber;

    tab.classList.toggle(ACTIVE_TAB_CLASS, isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
  });
}

function updateHeights(slideWrapper, slides, imageWrapper, images) {
  updateWrapperHeight(slideWrapper, slides, '--history-slide-height');
  updateWrapperHeight(imageWrapper, images, '--history-img-height');
}

function updateWrapperHeight(wrapper, items, variableName) {
  if (!wrapper || !items.length) {
    return;
  }

  let maxHeight = 0;

  items.forEach((item) => {
    const previousHidden = item.hidden;
    const previousPosition = item.style.position;
    const previousVisibility = item.style.visibility;
    const previousOpacity = item.style.opacity;
    const previousTransform = item.style.transform;
    const previousWidth = item.style.width;

    item.hidden = false;
    item.style.position = 'relative';
    item.style.visibility = 'hidden';
    item.style.opacity = '1';
    item.style.transform = 'none';
    item.style.width = `${wrapper.getBoundingClientRect().width}px`;

    const rect = item.getBoundingClientRect();
    maxHeight = Math.max(maxHeight, rect.height, item.scrollHeight, getIntrinsicHeight(item, wrapper));

    item.hidden = previousHidden;
    item.style.position = previousPosition;
    item.style.visibility = previousVisibility;
    item.style.opacity = previousOpacity;
    item.style.transform = previousTransform;
    item.style.width = previousWidth;
  });

  if (maxHeight > 0) {
    wrapper.style.setProperty(variableName, `${Math.ceil(maxHeight)}px`);
  }
}

function getIntrinsicHeight(item, wrapper) {
  if (!(item instanceof HTMLImageElement)) {
    return 0;
  }

  const width = Number(item.getAttribute('width'));
  const height = Number(item.getAttribute('height'));
  const wrapperWidth = wrapper.getBoundingClientRect().width;

  if (!width || !height || !wrapperWidth) {
    return 0;
  }

  return (wrapperWidth * height) / width;
}

function prepareImages(images) {
  images.forEach((image) => {
    image.setAttribute('loading', 'eager');
    image.setAttribute('decoding', 'async');
    image.setAttribute('draggable', 'false');
    image.draggable = false;
    preloadImage(image);
  });
}

function preloadImage(image) {
  const src = image.currentSrc || image.getAttribute('src') || image.src;

  if (!src || (image.complete && image.naturalWidth > 0)) {
    return;
  }

  if (typeof image.decode === 'function') {
    image.decode().catch(() => {});
  }

  const preload = new Image();
  const srcset = image.getAttribute('srcset');
  const sizes = image.getAttribute('sizes');

  if (srcset) {
    preload.srcset = srcset;
  }

  if (sizes) {
    preload.sizes = sizes;
  }

  preload.decoding = 'async';
  preload.onload = () => imagePreloads.delete(preload);
  preload.onerror = () => imagePreloads.delete(preload);
  imagePreloads.add(preload);
  preload.src = src;
}

function getInitialActiveNumber(tabs, numbers) {
  const activeTab = tabs.find((tab) => tab.classList.contains(ACTIVE_TAB_CLASS));
  const activeNumber = getTabNumber(activeTab);

  return activeNumber && numbers.includes(activeNumber) ? activeNumber : numbers[0];
}

function getKeyboardTarget(event, currentNumber, numbers) {
  const currentIndex = numbers.indexOf(currentNumber);

  if (currentIndex < 0) {
    return null;
  }

  if (event.key === 'ArrowLeft') {
    return numbers[wrapIndex(currentIndex - 1, numbers.length)];
  }

  if (event.key === 'ArrowRight') {
    return numbers[wrapIndex(currentIndex + 1, numbers.length)];
  }

  if (event.key === 'Home') {
    return numbers[0];
  }

  if (event.key === 'End') {
    return numbers[numbers.length - 1];
  }

  return null;
}

function getDirection(currentNumber, nextNumber, numbers) {
  const currentIndex = numbers.indexOf(currentNumber);
  const nextIndex = numbers.indexOf(nextNumber);

  if (currentIndex < 0 || nextIndex < 0 || currentIndex === nextIndex) {
    return 1;
  }

  return nextIndex > currentIndex ? 1 : -1;
}

function focusTab(tab) {
  if (!tab || document.activeElement === tab) {
    return;
  }

  tab.focus({ preventScroll: true });
}

function groupByNumber(items) {
  return items.reduce((map, item) => {
    const number = getTabNumber(item);

    if (!number) {
      return map;
    }

    const group = map.get(number) || [];
    group.push(item);
    map.set(number, group);

    return map;
  }, new Map());
}

function uniqueItems(items) {
  return items.filter((item, index, all) => all.indexOf(item) === index);
}

function getTabNumber(element) {
  return element?.getAttribute('tab-number') || element?.getAttribute('data-tab-number') || '';
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
