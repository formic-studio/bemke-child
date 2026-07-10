const ANCHOR_LINK_SELECTOR = 'a[href*="#"]';
const CURRENT_PAGE_LINK_SELECTOR = 'a[href][aria-current="page"]';
const CURRENT_PAGE_LINK_SCOPE_SELECTOR = '#brx-header, #brx-footer, footer';
const BOOTED_KEY = '__bemkeCurrentPageLinksBooted';

export function initCurrentPageLinks() {
  if (window[BOOTED_KEY]) {
    return;
  }

  window[BOOTED_KEY] = true;

  document.addEventListener('click', handleCrossPageAnchorClick, true);
  document.addEventListener('click', handleCurrentPageLinkClick);
}

function handleCrossPageAnchorClick(event) {
  if (!isPrimaryPlainClick(event)) {
    return;
  }

  const anchorLink = getScopedLinkFromEvent(event, ANCHOR_LINK_SELECTOR);
  const url = getUrl(anchorLink);

  if (!anchorLink || !url || !shouldForceCrossPageAnchorNavigation(anchorLink, url)) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  window.location.assign(url.href);
}

function handleCurrentPageLinkClick(event) {
  const currentPageLink = getScopedLinkFromEvent(event, CURRENT_PAGE_LINK_SELECTOR);

  if (!currentPageLink) {
    return;
  }

  if (isSamePageAnchorLink(currentPageLink)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
}

function isSamePageAnchorLink(link) {
  const url = getUrl(link);

  if (!url) {
    return false;
  }

  return (
    Boolean(url.hash) &&
    url.origin === window.location.origin &&
    normalizePath(url.pathname) === normalizePath(window.location.pathname) &&
    url.search === window.location.search
  );
}

function shouldForceCrossPageAnchorNavigation(link, url) {
  if (!url.hash || url.origin !== window.location.origin || link.hasAttribute('download')) {
    return false;
  }

  const target = link.getAttribute('target');

  if (target && target.toLowerCase() !== '_self') {
    return false;
  }

  return (
    normalizePath(url.pathname) !== normalizePath(window.location.pathname) ||
    url.search !== window.location.search
  );
}

function getScopedLinkFromEvent(event, selector) {
  const target = event.target instanceof Element ? event.target : null;
  const link = target?.closest(selector);

  return link?.closest(CURRENT_PAGE_LINK_SCOPE_SELECTOR) ? link : null;
}

function getUrl(link) {
  const href = link?.getAttribute('href');

  if (!href) {
    return null;
  }

  try {
    return new URL(href, window.location.href);
  } catch {
    return null;
  }
}

function isPrimaryPlainClick(event) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  );
}

function normalizePath(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}
