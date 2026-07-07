const HEADER_SELECTOR = '#brx-header';
const MENU_SURFACE_SELECTOR = '#brxe-spklen';
const NAV_MENU_SELECTOR =
  '#brxe-vhhhdt > .bricks-nav-menu-wrapper > .bricks-nav-menu';
const MEGA_MENU_SELECTOR = '.mega-menu';
const MEGA_CLIP_CLASS = 'mega-menu-clip';
const DESKTOP_QUERY = '(min-width: 992px)';
const READY_ATTR = 'data-bemke-mega-menu-ready';
const GENERATED_ATTR = 'data-bemke-generated-mega-menu';
const OPEN_CLASS = 'is-mega-menu-open';
const ACTIVE_ITEM_CLASS = 'is-mega-menu-item-active';
const HAS_MEGA_CLASS = 'bemke-has-mega-menu';
const TOP_ARROW_CLASS = 'bemke-menu-arrow';
const PANEL_CLASS = 'bemke-mega-panel';
const PANEL_ACTIVE_CLASS = 'is-active';
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
  const topLinks = topItems.map((item) => getDirectLink(item)).filter(Boolean);
  const entries = topItems
    .map((item, topIndex) => {
      const link = getDirectLink(item);
      const submenu = getDirectSubmenu(item);

      if (!link || !submenu) {
        return null;
      }

      return { item, link, submenu, topIndex };
    })
    .filter(Boolean);

  if (!entries.length) {
    return;
  }

  const megaMenu = createOrResetMegaMenu(header, menuSurface);
  const megaMenuClip = ensureMegaMenuClip(megaMenu);
  const panelEntries = buildPanels(megaMenu, entries);
  const entryByTopItem = new WeakMap(panelEntries.map((entry) => [entry.item, entry]));

  let activeEntry = null;
  let closeTimerId = null;

  header.setAttribute(READY_ATTR, '1');
  megaMenu.id ||= 'bemke-mega-menu';
  megaMenu.setAttribute(GENERATED_ATTR, '1');
  megaMenu.setAttribute('role', 'navigation');
  megaMenu.setAttribute('aria-label', 'Mega menu');

  setupTopLinks(panelEntries, megaMenu);
  closeMegaMenu();
  updatePanelAlignment(megaMenu, panelEntries, desktopQuery.matches);

  topItems.forEach((item) => {
    const link = getDirectLink(item);

    if (!link) {
      return;
    }

    link.addEventListener('pointerenter', () => {
      if (!desktopQuery.matches) {
        return;
      }

      const entry = entryByTopItem.get(item);

      if (entry) {
        openPanel(entry);
        return;
      }

      closeMegaMenu();
    });

    link.addEventListener('focus', () => {
      if (!desktopQuery.matches) {
        return;
      }

      const entry = entryByTopItem.get(item);

      if (entry) {
        openPanel(entry);
      }
    });

    link.addEventListener('keydown', (event) => {
      const entry = entryByTopItem.get(item);

      if (!entry || !desktopQuery.matches) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        openPanel(entry);
        focusFirstPanelLink(entry.panel);
        return;
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        focusSiblingTopLink(topLinks, link, event.key === 'ArrowRight' ? 1 : -1);
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMegaMenu();
        link.focus({ preventScroll: true });
      }
    });
  });

  menuSurface.addEventListener('pointerleave', scheduleClose);
  megaMenuClip.addEventListener('pointerenter', cancelClose);
  megaMenuClip.addEventListener('pointerleave', scheduleClose);

  header.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!header.contains(document.activeElement)) {
        closeMegaMenu();
      }
    }, 0);
  });

  megaMenu.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !activeEntry) {
      return;
    }

    event.preventDefault();
    const linkToFocus = activeEntry.link;
    closeMegaMenu();
    linkToFocus.focus({ preventScroll: true });
  });

  document.addEventListener('pointerdown', (event) => {
    if (!header.contains(event.target)) {
      closeMegaMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !header.classList.contains(OPEN_CLASS)) {
      return;
    }

    event.preventDefault();
    closeMegaMenu();
  });

  window.addEventListener(
    'resize',
    debounce(() => {
      updatePanelAlignment(megaMenu, panelEntries, desktopQuery.matches);

      if (!desktopQuery.matches) {
        closeMegaMenu();
        return;
      }

      if (activeEntry) {
        updateMegaMenuHeight(megaMenuClip, megaMenu, activeEntry.panel, true);
      }
    }, 90),
  );

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      updatePanelAlignment(megaMenu, panelEntries, desktopQuery.matches);

      if (activeEntry) {
        updateMegaMenuHeight(megaMenuClip, megaMenu, activeEntry.panel, desktopQuery.matches);
      }
    });
  }

  header.__bemkeMegaMenuRefresh = () => {
    updatePanelAlignment(megaMenu, panelEntries, desktopQuery.matches);

    if (activeEntry) {
      updateMegaMenuHeight(megaMenuClip, megaMenu, activeEntry.panel, desktopQuery.matches);
    }
  };

  function openPanel(entry) {
    if (!desktopQuery.matches) {
      return;
    }

    cancelClose();
    activeEntry = entry;
    header.classList.add(OPEN_CLASS);
    megaMenu.setAttribute('aria-hidden', 'false');

    if ('inert' in megaMenu) {
      megaMenu.inert = false;
    }

    panelEntries.forEach((panelEntry) => {
      const isActive = panelEntry === entry;

      panelEntry.item.classList.toggle(ACTIVE_ITEM_CLASS, isActive);
      panelEntry.link.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      panelEntry.panel.hidden = !isActive;
      panelEntry.panel.classList.toggle(PANEL_ACTIVE_CLASS, isActive);
      panelEntry.panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      setPanelFocusable(panelEntry.panel, isActive);
    });

    updatePanelAlignment(megaMenu, panelEntries, true);
    updateMegaMenuHeight(megaMenuClip, megaMenu, entry.panel, true);
  }

  function closeMegaMenu() {
    cancelClose();
    activeEntry = null;
    header.classList.remove(OPEN_CLASS);
    megaMenu.setAttribute('aria-hidden', 'true');
    megaMenu.style.removeProperty('min-height');
    megaMenuClip.style.setProperty('--mega-menu-height', '0px');

    if ('inert' in megaMenu) {
      megaMenu.inert = true;
    }

    panelEntries.forEach((entry) => {
      entry.item.classList.remove(ACTIVE_ITEM_CLASS);
      entry.link.setAttribute('aria-expanded', 'false');
      entry.panel.hidden = true;
      entry.panel.classList.remove(PANEL_ACTIVE_CLASS);
      entry.panel.setAttribute('aria-hidden', 'true');
      setPanelFocusable(entry.panel, false);
    });
  }

  function scheduleClose() {
    window.clearTimeout(closeTimerId);
    closeTimerId = window.setTimeout(() => {
      if (header.contains(document.activeElement)) {
        return;
      }

      closeMegaMenu();
    }, 120);
  }

  function cancelClose() {
    window.clearTimeout(closeTimerId);
    closeTimerId = null;
  }
}

function createOrResetMegaMenu(header, menuSurface) {
  const existingMenu = header.querySelector(MEGA_MENU_SELECTOR);

  if (existingMenu) {
    existingMenu.replaceChildren();
    return existingMenu;
  }

  const megaMenu = document.createElement('div');
  megaMenu.className = MEGA_MENU_SELECTOR.slice(1);

  if (menuSurface.parentElement) {
    menuSurface.parentElement.insertBefore(megaMenu, menuSurface.nextSibling);
    return megaMenu;
  }

  header.appendChild(megaMenu);
  return megaMenu;
}

function ensureMegaMenuClip(megaMenu) {
  const existingClip = megaMenu.parentElement?.classList.contains(MEGA_CLIP_CLASS)
    ? megaMenu.parentElement
    : null;

  if (existingClip) {
    return existingClip;
  }

  const clip = document.createElement('div');
  clip.className = MEGA_CLIP_CLASS;
  megaMenu.parentElement.insertBefore(clip, megaMenu);
  clip.appendChild(megaMenu);

  return clip;
}

function buildPanels(megaMenu, entries) {
  return entries.map((entry) => {
    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.id = `bemke-mega-panel-${entry.topIndex + 1}`;
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('aria-labelledby', ensureElementId(entry.link, `bemke-mega-trigger-${entry.topIndex + 1}`));

    const inner = document.createElement('div');
    inner.className = 'bemke-mega-panel__inner';
    inner.appendChild(buildMegaList(entry.submenu, 1));

    panel.appendChild(inner);
    megaMenu.appendChild(panel);

    return { ...entry, panel };
  });
}

function buildMegaList(sourceList, depth) {
  const list = document.createElement('ul');
  list.className = `bemke-mega-list bemke-mega-list--depth-${depth}`;

  getDirectMenuItems(sourceList).forEach((item) => {
    const link = getDirectLink(item);

    if (!link) {
      return;
    }

    const childSubmenu = getDirectSubmenu(item);
    const listItem = document.createElement('li');
    const clonedLink = cloneMenuLink(link, depth, Boolean(childSubmenu));

    listItem.className = 'bemke-mega-list__item';
    listItem.appendChild(clonedLink);

    if (childSubmenu) {
      listItem.classList.add('bemke-mega-list__item--has-children');
      listItem.appendChild(buildMegaList(childSubmenu, depth + 1));
    }

    list.appendChild(listItem);
  });

  return list;
}

function cloneMenuLink(link, depth, hasChildren) {
  const clonedLink = link.cloneNode(true);

  removeIds(clonedLink);
  clonedLink.querySelectorAll(`.${TOP_ARROW_CLASS}`).forEach((arrow) => arrow.remove());
  clonedLink.className = [
    'bemke-mega-link',
    `bemke-mega-link--depth-${Math.min(depth, 3)}`,
    hasChildren ? 'bemke-mega-link--has-children' : '',
  ]
    .filter(Boolean)
    .join(' ');
  clonedLink.removeAttribute('aria-controls');
  clonedLink.removeAttribute('aria-expanded');
  clonedLink.removeAttribute('aria-haspopup');
  clonedLink.removeAttribute('tabindex');

  return clonedLink;
}

function setupTopLinks(panelEntries, megaMenu) {
  panelEntries.forEach((entry) => {
    entry.item.classList.add(HAS_MEGA_CLASS);
    entry.link.setAttribute('aria-haspopup', 'true');
    entry.link.setAttribute('aria-expanded', 'false');
    entry.link.setAttribute('aria-controls', entry.panel.id);
    ensureTopLinkArrow(entry.link);
  });

  megaMenu.querySelectorAll(FOCUSABLE_SELECTOR).forEach((element) => {
    if (!element.hasAttribute(ORIGINAL_TABINDEX_ATTR)) {
      element.setAttribute(ORIGINAL_TABINDEX_ATTR, element.getAttribute('tabindex') ?? '');
    }
  });
}

function ensureTopLinkArrow(link) {
  if (link.querySelector(`:scope > .${TOP_ARROW_CLASS}`)) {
    return;
  }

  const arrow = document.createElement('span');
  arrow.className = TOP_ARROW_CLASS;
  arrow.setAttribute('aria-hidden', 'true');
  link.appendChild(arrow);
}

function setPanelFocusable(panel, isEnabled) {
  panel.querySelectorAll(FOCUSABLE_SELECTOR).forEach((element) => {
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

function updateMegaMenuHeight(megaMenuClip, megaMenu, activePanel, isDesktop) {
  if (!isDesktop || !activePanel) {
    megaMenuClip.style.setProperty('--mega-menu-height', '0px');
    megaMenu.style.removeProperty('min-height');
    return;
  }

  const height = measurePanelHeight(activePanel);

  if (height > 0) {
    megaMenuClip.style.setProperty('--mega-menu-height', `${height}px`);
    megaMenu.style.setProperty('min-height', `${height}px`);
  }
}

function measurePanelHeight(panel) {
  const panelRect = panel.getBoundingClientRect();
  return Math.ceil(Math.max(panel.scrollHeight, panelRect.height));
}

function updatePanelAlignment(megaMenu, panelEntries, isDesktop) {
  if (!isDesktop) {
    panelEntries.forEach((entry) => {
      entry.panel.style.removeProperty('--mega-menu-panel-left');
    });
    return;
  }

  const menuRect = megaMenu.getBoundingClientRect();

  panelEntries.forEach((entry) => {
    const linkRect = entry.link.getBoundingClientRect();
    const left = Math.max(0, linkRect.left - menuRect.left);
    entry.panel.style.setProperty('--mega-menu-panel-left', `${Math.round(left)}px`);
  });
}

function focusFirstPanelLink(panel) {
  const firstLink = panel.querySelector(FOCUSABLE_SELECTOR);

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

function getDirectMenuItems(list) {
  return Array.from(list.children).filter((child) => child.matches('li'));
}

function getDirectLink(menuItem) {
  const submenu = getDirectSubmenu(menuItem);

  for (const child of Array.from(menuItem.children)) {
    if (child === submenu) {
      continue;
    }

    if (child.matches('a, button')) {
      return child;
    }

    const link = child.querySelector('a, button');

    if (link && (!submenu || !submenu.contains(link))) {
      return link;
    }
  }

  return null;
}

function getDirectSubmenu(menuItem) {
  return Array.from(menuItem.children).find((child) =>
    child.matches('ul, .sub-menu, .bricks-nav-menu-submenu'),
  );
}

function ensureElementId(element, fallbackId) {
  element.id ||= fallbackId;
  return element.id;
}

function removeIds(element) {
  element.removeAttribute('id');
  element.querySelectorAll('[id]').forEach((child) => child.removeAttribute('id'));
}

function debounce(fn, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}
