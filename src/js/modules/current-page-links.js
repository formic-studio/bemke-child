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

    event.preventDefault();
    event.stopPropagation();
  });
}
