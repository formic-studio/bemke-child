const PAGE_INFO_SELECTOR = '.page-info';
const READY_ATTR = 'data-bemke-page-info-hover-ready';
const ACTIVE_COLOR_PROPERTY = '--bemke-page-info-active-color';
const BOOTED_FLAG = '__bemkePageInfoHoverBooted';

export function initPageInfoHover() {
  updatePageInfoColors();

  if (window[BOOTED_FLAG]) {
    return;
  }

  window[BOOTED_FLAG] = true;

  window.addEventListener('load', updatePageInfoColors);
  document.addEventListener('bricks/ajax/end', updatePageInfoColors);

  if (!window.MutationObserver || !document.documentElement) {
    return;
  }

  let updateFrame = 0;

  new MutationObserver((mutations) => {
    const needsUpdate = mutations.some(
      (mutation) =>
        mutation.addedNodes.length > 0 ||
        (mutation.type === 'attributes' &&
          mutation.attributeName === 'data-contrast'),
    );

    if (!needsUpdate) {
      return;
    }

    window.cancelAnimationFrame(updateFrame);
    updateFrame = window.requestAnimationFrame(updatePageInfoColors);
  }).observe(document.documentElement, {
    attributeFilter: ['data-contrast'],
    attributes: true,
    childList: true,
    subtree: true,
  });
}

function updatePageInfoColors() {
  document.querySelectorAll(PAGE_INFO_SELECTOR).forEach((pageInfo) => {
    const currentItem = pageInfo.lastElementChild;
    const links = pageInfo.querySelectorAll(':scope > a[href]');

    if (!currentItem || links.length === 0) {
      return;
    }

    const activeColor = window.getComputedStyle(currentItem).color;

    if (!activeColor || activeColor === 'rgba(0, 0, 0, 0)') {
      return;
    }

    pageInfo.style.setProperty(ACTIVE_COLOR_PROPERTY, activeColor);
    pageInfo.setAttribute(READY_ATTR, '1');
  });
}
