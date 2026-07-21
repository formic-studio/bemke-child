const MOBILE_QUERY = '(max-width: 767px)';
const SCROLL_ATTR = 'data-bemke-horizontal-scroll-gutters';
const CANDIDATE_SELECTOR = [
  'main .brxe-block',
  'main .button-scroll-row',
  'main [data-bemke-explore-card-scroll="1"]',
].join(', ');
const SCROLL_VALUES = new Set(['auto', 'scroll']);
const FLEX_VALUES = new Set(['flex', 'inline-flex']);

let resizeTimer = null;

function toPixels(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

function resetScroller(scroller) {
  scroller.removeAttribute(SCROLL_ATTR);
  scroller.style.removeProperty('--bemke-scroll-bleed-start');
  scroller.style.removeProperty('--bemke-scroll-bleed-end');
  scroller.style.removeProperty('--bemke-scroll-content-start');
  scroller.style.removeProperty('--bemke-scroll-content-end');
  scroller.style.removeProperty('--bemke-scroll-gap');
}

function isHorizontalFlexScroller(scroller, styles) {
  return (
    FLEX_VALUES.has(styles.display) &&
    !styles.flexDirection.startsWith('column') &&
    SCROLL_VALUES.has(styles.overflowX) &&
    scroller.scrollWidth > scroller.clientWidth + 1
  );
}

function setScrollerGutters(scroller, styles) {
  const rect = scroller.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const bleedStart = Math.max(0, rect.left);
  const bleedEnd = Math.max(0, viewportWidth - rect.right);
  const contentStart = bleedStart + toPixels(styles.paddingLeft);
  const contentEnd = bleedEnd + toPixels(styles.paddingRight);

  scroller.style.setProperty('--bemke-scroll-bleed-start', `${bleedStart}px`);
  scroller.style.setProperty('--bemke-scroll-bleed-end', `${bleedEnd}px`);
  scroller.style.setProperty('--bemke-scroll-content-start', `${contentStart}px`);
  scroller.style.setProperty('--bemke-scroll-content-end', `${contentEnd}px`);
  scroller.style.setProperty(
    '--bemke-scroll-gap',
    `${toPixels(styles.columnGap)}px`,
  );
  scroller.setAttribute(SCROLL_ATTR, '1');
}

function updateHorizontalScrollGutters() {
  const enhancedScrollers = document.querySelectorAll(`[${SCROLL_ATTR}]`);
  enhancedScrollers.forEach(resetScroller);

  if (!window.matchMedia(MOBILE_QUERY).matches) {
    return;
  }

  document.querySelectorAll(CANDIDATE_SELECTOR).forEach((scroller) => {
    const styles = window.getComputedStyle(scroller);

    if (isHorizontalFlexScroller(scroller, styles)) {
      setScrollerGutters(scroller, styles);
    }
  });
}

export function initHorizontalScrollGutters() {
  updateHorizontalScrollGutters();

  window.addEventListener('load', updateHorizontalScrollGutters, { once: true });
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateHorizontalScrollGutters, 120);
  });
}
