const HEADER_SELECTOR = '#brx-header';
const MENU_SURFACE_SELECTOR = '#brxe-spklen';
const MEGA_MENU_SELECTOR = '.mega-menu';
const TOP_LINK_SELECTOR =
  '#brxe-vhhhdt > .bricks-nav-menu-wrapper > .bricks-nav-menu > li > a';
const MEGA_COLUMN_SELECTOR = '.mega-menu-link-wrapper';
const DESKTOP_QUERY = '(min-width: 992px)';
const READY_ATTR = 'data-bemke-mega-menu-ready';
const OPEN_CLASS = 'is-mega-menu-open';
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

const COLUMN_TO_TOP_LINK_INDEX = [0, 2, 3, 4, 5];
const ORIGINAL_TABINDEX_ATTR = 'data-bemke-original-tabindex';

export function initMegaMenu() {
  document.querySelectorAll(HEADER_SELECTOR).forEach((header) => {
    if (header.getAttribute(READY_ATTR) === '1') {
      header.__bemkeMegaMenuRefresh?.();
      return;
    }

    createMegaMenu(header);
  });
}

function createMegaMenu(header) {
  const menuSurface = header.querySelector(MENU_SURFACE_SELECTOR);
  const megaMenu = header.querySelector(MEGA_MENU_SELECTOR);
  const topLinks = Array.from(header.querySelectorAll(TOP_LINK_SELECTOR));
  const megaColumns = megaMenu ? Array.from(megaMenu.querySelectorAll(MEGA_COLUMN_SELECTOR)) : [];
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);

  if (!menuSurface || !megaMenu || !topLinks.length || !megaColumns.length) {
    return;
  }

  let closeTimerId = null;

  header.setAttribute(READY_ATTR, '1');
  setupA11y(header, megaMenu, topLinks);
  setMegaMenuOpen(header, megaMenu, topLinks, false);
  updateColumnAlignment(megaMenu, topLinks, megaColumns, desktopQuery.matches);

  menuSurface.addEventListener('pointerenter', () => openMegaMenu());
  megaMenu.addEventListener('pointerenter', () => openMegaMenu());
  menuSurface.addEventListener('pointerleave', () => scheduleClose(header, megaMenu, topLinks));
  megaMenu.addEventListener('pointerleave', () => scheduleClose(header, megaMenu, topLinks));

  header.addEventListener('focusin', (event) => {
    if (!desktopQuery.matches) {
      return;
    }

    if (menuSurface.contains(event.target) || megaMenu.contains(event.target)) {
      openMegaMenu();
    }
  });

  header.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!header.contains(document.activeElement)) {
        setMegaMenuOpen(header, megaMenu, topLinks, false);
      }
    }, 0);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !header.classList.contains(OPEN_CLASS)) {
      return;
    }

    event.preventDefault();
    setMegaMenuOpen(header, megaMenu, topLinks, false);

    if (megaMenu.contains(document.activeElement)) {
      focusFirstTopLink(topLinks);
    }
  });

  window.addEventListener(
    'resize',
    debounce(() => {
      updateColumnAlignment(megaMenu, topLinks, megaColumns, desktopQuery.matches);

      if (!desktopQuery.matches) {
        setMegaMenuOpen(header, megaMenu, topLinks, false);
      }
    }, 90),
  );

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      updateColumnAlignment(megaMenu, topLinks, megaColumns, desktopQuery.matches);
    });
  }

  header.__bemkeMegaMenuRefresh = () => {
    updateColumnAlignment(megaMenu, topLinks, megaColumns, desktopQuery.matches);
  };

  function openMegaMenu() {
    if (!desktopQuery.matches) {
      return;
    }

    window.clearTimeout(closeTimerId);
    updateColumnAlignment(megaMenu, topLinks, megaColumns, true);
    setMegaMenuOpen(header, megaMenu, topLinks, true);
  }

  function scheduleClose() {
    window.clearTimeout(closeTimerId);
    closeTimerId = window.setTimeout(() => {
      if (header.contains(document.activeElement)) {
        return;
      }

      setMegaMenuOpen(header, megaMenu, topLinks, false);
    }, 120);
  }
}

function setupA11y(header, megaMenu, topLinks) {
  megaMenu.id ||= 'bemke-mega-menu';
  megaMenu.setAttribute('role', 'navigation');
  megaMenu.setAttribute('aria-label', 'Mega menu');

  topLinks.forEach((link) => {
    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-controls', megaMenu.id);
  });

  megaMenu.querySelectorAll(FOCUSABLE_SELECTOR).forEach((element) => {
    if (!element.hasAttribute(ORIGINAL_TABINDEX_ATTR)) {
      element.setAttribute(ORIGINAL_TABINDEX_ATTR, element.getAttribute('tabindex') ?? '');
    }
  });

  header.querySelectorAll('.mega-menu-link:not([href])').forEach((element) => {
    element.setAttribute('role', 'presentation');
  });
}

function setMegaMenuOpen(header, megaMenu, topLinks, isOpen) {
  header.classList.toggle(OPEN_CLASS, isOpen);
  megaMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

  if ('inert' in megaMenu) {
    megaMenu.inert = !isOpen;
  }

  topLinks.forEach((link) => {
    link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  setMegaMenuFocusable(megaMenu, isOpen);
}

function setMegaMenuFocusable(megaMenu, isEnabled) {
  megaMenu.querySelectorAll(FOCUSABLE_SELECTOR).forEach((element) => {
    if (isEnabled) {
      const originalTabindex = element.getAttribute(ORIGINAL_TABINDEX_ATTR);

      if (originalTabindex) {
        element.setAttribute('tabindex', originalTabindex);
        return;
      }

      element.removeAttribute('tabindex');
      return;
    }

    element.setAttribute('tabindex', '-1');
  });
}

function updateColumnAlignment(megaMenu, topLinks, megaColumns, isDesktop) {
  if (!isDesktop) {
    megaColumns.forEach((column) => {
      column.style.removeProperty('--mega-menu-column-left');
    });
    return;
  }

  const menuRect = megaMenu.getBoundingClientRect();

  megaColumns.forEach((column, index) => {
    const topLink = topLinks[COLUMN_TO_TOP_LINK_INDEX[index]];

    if (!topLink) {
      return;
    }

    const linkRect = topLink.getBoundingClientRect();
    const left = Math.max(0, linkRect.left - menuRect.left);
    column.style.setProperty('--mega-menu-column-left', `${Math.round(left)}px`);
  });
}

function focusFirstTopLink(topLinks) {
  const firstTopLink = topLinks[0];

  if (!firstTopLink) {
    return;
  }

  firstTopLink.focus({ preventScroll: true });
}

function debounce(fn, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}
