const CURRENT_PAGE_LINK_SELECTOR = 'a[href][aria-current="page"]';
const CURRENT_PAGE_LINK_SCOPE_SELECTOR = '#brx-header, #brx-footer, footer';
const BOOTED_KEY = '__bemkeCurrentPageLinksBooted';

export function initCurrentPageLinks() {
  if (window[BOOTED_KEY]) {
    return;
  }

  window[BOOTED_KEY] = true;

  document.addEventListener('click', (event) => {
    const currentPageLink = event.target.closest(CURRENT_PAGE_LINK_SELECTOR);

    if (!currentPageLink || !currentPageLink.closest(CURRENT_PAGE_LINK_SCOPE_SELECTOR)) {
      return;
    }

    if (isSamePageAnchorLink(currentPageLink)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  });
}

function isSamePageAnchorLink(link) {
  const href = link.getAttribute('href');

  if (!href) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);

    return (
      Boolean(url.hash) &&
      url.origin === window.location.origin &&
      normalizePath(url.pathname) === normalizePath(window.location.pathname)
    );
  } catch {
    return false;
  }
}

function normalizePath(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}
