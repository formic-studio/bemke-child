const HEADER_SELECTOR = '#brx-header';
const MENU_SURFACE_SELECTOR = '#brxe-spklen';
const NAV_MENU_SELECTOR =
  '#brxe-vhhhdt > .bricks-nav-menu-wrapper > .bricks-nav-menu';
const DESKTOP_QUERY = '(min-width: 992px)';
const READY_ATTR = 'data-bemke-mega-menu-ready';
const OPEN_CLASS = 'is-mega-menu-open';
const ITEM_CLASS = 'bemke-mega-item';
const ACTIVE_ITEM_CLASS = 'is-mega-menu-item-active';
const SUBMENU_CLASS = 'bemke-mega-submenu';
const SUBMENU_OPEN_CLASS = 'is-mega-submenu-open';
const ORIGINAL_TABINDEX_ATTR = 'data-bemke-original-tabindex';
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

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
  const navMenu = header.querySelector(NAV_MENU_SELECTOR);
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);

  if (!menuSurface || !navMenu) {
    return;
  }

  const topItems = getDirectMenuItems(navMenu);
  const topLinks = topItems.map((item) => getTopLink(item)).filter(Boolean);
  const entries = topItems
    .map((item, index) => {
      const toggle = getDirectToggle(item);
      const link = getTopLink(item);
      const button = getTopButton(item);
      const submenu = getDirectSubmenu(item);

      if (!toggle || !link || !submenu) {
        return null;
      }

      return { button, index, item, link, submenu, toggle };
    })
    .filter(Boolean);

  if (!entries.length) {
    return;
  }

  let activeEntry = null;
  let closeTimerId = null;

  header.setAttribute(READY_ATTR, '1');
  menuSurface.setAttribute('data-bemke-mega-menu-host', '1');
  setupEntries(entries);
  closeMegaMenu();
  updateSubmenuPositions(menuSurface, entries, desktopQuery.matches);

  entries.forEach((entry) => {
    entry.toggle.addEventListener('pointerenter', () => openEntry(entry));
    entry.submenu.addEventListener('pointerenter', () => openEntry(entry));
    entry.toggle.addEventListener('pointerleave', scheduleClose);
    entry.submenu.addEventListener('pointerleave', scheduleClose);

    entry.link.addEventListener('focus', () => openEntry(entry));

    entry.button?.addEventListener('focus', () => openEntry(entry));
    entry.button?.addEventListener(
      'click',
      (event) => {
        if (!desktopQuery.matches) {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        if (activeEntry === entry) {
          closeMegaMenu();
          return;
        }

        openEntry(entry);
      },
      true,
    );
  });

  navMenu.addEventListener('pointerenter', (event) => {
    const entry = findEntryFromTarget(entries, event.target);

    if (!entry && desktopQuery.matches) {
      scheduleClose();
    }
  });

  header.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!header.contains(document.activeElement)) {
        closeMegaMenu();
      }
    }, 0);
  });

  header.addEventListener('keydown', (event) => {
    const entry = findEntryFromTarget(entries, event.target);

    if (event.key === 'Escape' && activeEntry) {
      event.preventDefault();
      const linkToFocus = activeEntry.link;
      closeMegaMenu();
      linkToFocus.focus({ preventScroll: true });
      return;
    }

    if (!entry || !desktopQuery.matches) {
      return;
    }

    if (event.key === 'ArrowDown' && (entry.toggle.contains(event.target) || entry.link === event.target)) {
      event.preventDefault();
      openEntry(entry);
      focusFirstSubmenuLink(entry.submenu);
      return;
    }

    if (
      (event.key === 'ArrowLeft' || event.key === 'ArrowRight') &&
      (entry.toggle.contains(event.target) || entry.link === event.target)
    ) {
      event.preventDefault();
      focusSiblingTopLink(topLinks, entry.link, event.key === 'ArrowRight' ? 1 : -1);
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!header.contains(event.target)) {
      closeMegaMenu();
    }
  });

  window.addEventListener(
    'resize',
    debounce(() => {
      updateSubmenuPositions(menuSurface, entries, desktopQuery.matches);

      if (!desktopQuery.matches) {
        closeMegaMenu();
      }
    }, 90),
  );

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      updateSubmenuPositions(menuSurface, entries, desktopQuery.matches);
    });
  }

  header.__bemkeMegaMenuRefresh = () => {
    updateSubmenuPositions(menuSurface, entries, desktopQuery.matches);
  };

  function openEntry(entry) {
    if (!desktopQuery.matches) {
      return;
    }

    window.clearTimeout(closeTimerId);
    closeTimerId = null;
    activeEntry = entry;
    header.classList.add(OPEN_CLASS);
    updateSubmenuPositions(menuSurface, entries, true);

    entries.forEach((currentEntry) => {
      setEntryOpen(currentEntry, currentEntry === entry);
    });
  }

  function closeMegaMenu() {
    window.clearTimeout(closeTimerId);
    closeTimerId = null;
    activeEntry = null;
    header.classList.remove(OPEN_CLASS);

    entries.forEach((entry) => {
      setEntryOpen(entry, false);
    });
  }

  function scheduleClose() {
    window.clearTimeout(closeTimerId);
    closeTimerId = window.setTimeout(() => {
      const focusedElement = document.activeElement;

      if (
        activeEntry &&
        focusedElement &&
        (activeEntry.toggle.contains(focusedElement) || activeEntry.submenu.contains(focusedElement))
      ) {
        return;
      }

      closeMegaMenu();
    }, 140);
  }
}

function setupEntries(entries) {
  entries.forEach((entry) => {
    entry.item.classList.add(ITEM_CLASS);
    entry.submenu.classList.add(SUBMENU_CLASS);
    entry.submenu.id ||= `bemke-submenu-${entry.index + 1}`;
    entry.submenu.setAttribute('aria-labelledby', ensureElementId(entry.link, `bemke-menu-link-${entry.index + 1}`));

    entry.link.setAttribute('aria-haspopup', 'true');
    entry.link.setAttribute('aria-expanded', 'false');
    entry.link.setAttribute('aria-controls', entry.submenu.id);

    if (entry.button) {
      entry.button.setAttribute('aria-controls', entry.submenu.id);
      entry.button.setAttribute('aria-expanded', 'false');
    }

    entry.submenu.querySelectorAll(FOCUSABLE_SELECTOR).forEach((element) => {
      if (!element.hasAttribute(ORIGINAL_TABINDEX_ATTR)) {
        element.setAttribute(ORIGINAL_TABINDEX_ATTR, element.getAttribute('tabindex') ?? '');
      }
    });
  });
}

function setEntryOpen(entry, isOpen) {
  entry.item.classList.toggle(ACTIVE_ITEM_CLASS, isOpen);
  entry.submenu.classList.toggle(SUBMENU_OPEN_CLASS, isOpen);
  entry.submenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  entry.link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  entry.button?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  setSubmenuFocusable(entry.submenu, isOpen);
}

function setSubmenuFocusable(submenu, isEnabled) {
  submenu.querySelectorAll(FOCUSABLE_SELECTOR).forEach((element) => {
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

function updateSubmenuPositions(menuSurface, entries, isDesktop) {
  if (!isDesktop) {
    entries.forEach((entry) => {
      entry.submenu.style.removeProperty('--bemke-mega-left');
    });
    return;
  }

  const surfaceRect = menuSurface.getBoundingClientRect();

  entries.forEach((entry) => {
    const itemRect = entry.item.getBoundingClientRect();
    const left = Math.max(0, itemRect.left - surfaceRect.left);
    entry.submenu.style.setProperty('--bemke-mega-left', `${Math.round(left)}px`);
  });
}

function focusFirstSubmenuLink(submenu) {
  const firstLink = submenu.querySelector('a[href]');

  if (firstLink) {
    firstLink.focus({ preventScroll: true });
  }
}

function focusSiblingTopLink(topLinks, currentLink, direction) {
  const currentIndex = topLinks.indexOf(currentLink);

  if (currentIndex < 0 || !topLinks.length) {
    return;
  }

  const nextIndex = (currentIndex + direction + topLinks.length) % topLinks.length;
  topLinks[nextIndex].focus({ preventScroll: true });
}

function findEntryFromTarget(entries, target) {
  return entries.find((entry) => entry.toggle.contains(target) || entry.submenu.contains(target)) ?? null;
}

function getDirectMenuItems(list) {
  return Array.from(list.children).filter((child) => child.matches('li'));
}

function getDirectToggle(menuItem) {
  return Array.from(menuItem.children).find((child) => child.matches('.brx-submenu-toggle'));
}

function getDirectSubmenu(menuItem) {
  return Array.from(menuItem.children).find((child) => child.matches('ul.sub-menu'));
}

function getTopLink(menuItem) {
  return getDirectToggle(menuItem)?.querySelector(':scope > a') ?? null;
}

function getTopButton(menuItem) {
  return getDirectToggle(menuItem)?.querySelector(':scope > button') ?? null;
}

function ensureElementId(element, fallbackId) {
  element.id ||= fallbackId;
  return element.id;
}

function debounce(fn, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}
