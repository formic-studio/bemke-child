const ROOT_SELECTOR = '.tabs-block';
const TAB_SELECTOR = '.tab[tab-number], .tab[data-tab-number]';
const SLIDE_SELECTOR = '.history-slide[tab-number], .history-slide[data-tab-number]';
const IMAGE_SELECTOR = '.history-img[tab-number], .history-img[data-tab-number]';
const SLIDE_WRAPPER_SELECTOR = '.history-slide-wrapper';
const IMAGE_WRAPPER_SELECTOR = '.history-img-wrapper';

const READY_ATTR = 'data-bemke-history-tabs-ready';
const BOOT_FLAG = '__bemkeHistoryTabsBooted';
const ACTIVE_CLASS = 'tab-active';
const ACTIVE_PANEL_CLASS = 'is-active';
const ENTERING_CLASS = 'is-entering';
const LEAVING_CLASS = 'is-leaving';
const IMMEDIATE_CLASS = 'is-immediate';

const ANIMATION_MS = 640;

let instanceId = 0;
const imagePreloads = new Set();

export function initHistoryTabs() {
  initHistoryTabRoots();
  setupHistoryTabsLifecycle();
}

function initHistoryTabRoots(scope = document) {
  scope.querySelectorAll(ROOT_SELECTOR).forEach((tabsBlock) => {
    const root = getRoot(tabsBlock);

    if (!root || root.getAttribute(READY_ATTR) === '1') {
      root?.__bemkeHistoryTabsRefresh?.();
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

  let activeNumber = getInitialActiveNumber(tabs, numbers);
  let transitionTimerId = null;

  prepareImages(images);
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

    const direction = getDirection(activeNumber, nextNumber, numbers);
    activeNumber = nextNumber;
    sync(nextNumber, direction, false);
  }

  function sync(nextNumber, direction, instant) {
    window.clearTimeout(transitionTimerId);
    syncTabs(tabs, nextNumber);
    animateItems(slides, nextNumber, direction, instant);
    animateItems(images, nextNumber, direction, instant);

    if (instant || prefersReducedMotion()) {
      return;
    }

    transitionTimerId = window.setTimeout(() => {
      cleanupItems(slides, nextNumber);
      cleanupItems(images, nextNumber);
    }, ANIMATION_MS + 80);
  }
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

    tab.classList.toggle(ACTIVE_CLASS, isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
  });
}

function animateItems(items, activeNumber, direction, instant) {
  const previousItems = items.filter((item) =>
    item.classList.contains(ACTIVE_PANEL_CLASS),
  );
  const nextItems = items.filter((item) => getTabNumber(item) === activeNumber);
  const reducedMotion = prefersReducedMotion();

  if (instant || reducedMotion || !previousItems.length) {
    items.forEach((item) => {
      const isActive = getTabNumber(item) === activeNumber;
      setItemImmediate(item, isActive);
    });
    return;
  }

  const enterX = direction > 0 ? '100%' : '-100%';
  const exitX = direction > 0 ? '-100%' : '100%';

  items.forEach((item) => {
    if (!previousItems.includes(item) && !nextItems.includes(item)) {
      setItemImmediate(item, false);
    }
  });

  previousItems.forEach((item) => {
    item.classList.remove(ENTERING_CLASS, LEAVING_CLASS, IMMEDIATE_CLASS);
    item.classList.add(ACTIVE_PANEL_CLASS);
    item.style.setProperty('--history-exit-x', exitX);
    item.style.transform = 'translate3d(0, 0, 0)';
    item.style.opacity = '1';
    item.setAttribute('aria-hidden', 'true');
  });

  nextItems.forEach((item) => {
    item.classList.remove(ACTIVE_PANEL_CLASS, LEAVING_CLASS, IMMEDIATE_CLASS);
    item.classList.add(ENTERING_CLASS);
    item.style.setProperty('--history-enter-x', enterX);
    item.style.transform = `translate3d(${enterX}, 0, 0)`;
    item.style.opacity = '1';
    item.setAttribute('aria-hidden', 'false');
  });

  nextItems[0]?.offsetHeight;

  window.requestAnimationFrame(() => {
    previousItems.forEach((item) => {
      item.classList.add(LEAVING_CLASS);
      item.style.transform = `translate3d(${exitX}, 0, 0)`;
      item.style.opacity = '0';
    });

    nextItems.forEach((item) => {
      item.classList.remove(ENTERING_CLASS);
      item.classList.add(ACTIVE_PANEL_CLASS);
      item.style.transform = 'translate3d(0, 0, 0)';
      item.style.opacity = '1';
    });
  });
}

function cleanupItems(items, activeNumber) {
  items.forEach((item) => {
    const isActive = getTabNumber(item) === activeNumber;
    setItemImmediate(item, isActive);
  });
}

function setItemImmediate(item, isActive) {
  item.classList.add(IMMEDIATE_CLASS);
  item.classList.toggle(ACTIVE_PANEL_CLASS, isActive);
  item.classList.remove(ENTERING_CLASS, LEAVING_CLASS);
  item.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  item.style.transform = 'translate3d(0, 0, 0)';
  item.style.opacity = isActive ? '1' : '0';
  item.style.removeProperty('--history-enter-x');
  item.style.removeProperty('--history-exit-x');
  item.offsetHeight;

  window.requestAnimationFrame(() => {
    item.classList.remove(IMMEDIATE_CLASS);
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
    const previousPosition = item.style.position;
    const previousVisibility = item.style.visibility;
    const previousOpacity = item.style.opacity;
    const previousTransform = item.style.transform;

    item.style.position = 'relative';
    item.style.visibility = 'hidden';
    item.style.opacity = '1';
    item.style.transform = 'none';

    const rect = item.getBoundingClientRect();
    maxHeight = Math.max(maxHeight, rect.height, item.scrollHeight, getIntrinsicHeight(item, wrapper));

    item.style.position = previousPosition;
    item.style.visibility = previousVisibility;
    item.style.opacity = previousOpacity;
    item.style.transform = previousTransform;
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
  const activeTab = tabs.find((tab) => tab.classList.contains(ACTIVE_CLASS));
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
