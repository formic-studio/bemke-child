const NAVIGATION_SELECTOR = '#brx-header #brxe-vhhhdt';
const DESKTOP_WRAPPER_SELECTOR = ':scope > .bricks-nav-menu-wrapper';
const MOBILE_WRAPPER_SELECTOR = ':scope > .bricks-mobile-menu-wrapper';
const MOBILE_TOGGLE_SELECTOR = ':scope > .bricks-mobile-menu-toggle';
const MOBILE_QUERY = '(max-width: 991px)';
const READY_ATTR = 'data-bemke-navigation-a11y-ready';

export function initNavigationAccessibility(root = document) {
  root.querySelectorAll(NAVIGATION_SELECTOR).forEach(setupNavigation);
}

function setupNavigation(navigation) {
  if (navigation.getAttribute(READY_ATTR) === '1') {
    navigation.__bemkeNavigationA11ySync?.();
    return;
  }

  const desktopWrapper = navigation.querySelector(DESKTOP_WRAPPER_SELECTOR);
  const mobileWrapper = navigation.querySelector(MOBILE_WRAPPER_SELECTOR);
  const mobileToggle = navigation.querySelector(MOBILE_TOGGLE_SELECTOR);

  if (!desktopWrapper || !mobileWrapper || !mobileToggle) {
    return;
  }

  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  let wasMobileMenuOpen = false;

  mobileWrapper.id ||= 'bemke-mobile-navigation-panel';
  mobileToggle.setAttribute('aria-controls', mobileWrapper.id);

  const setInactive = (element, inactive) => {
    element.setAttribute('aria-hidden', inactive ? 'true' : 'false');
    element.toggleAttribute('inert', inactive);

    if ('inert' in element) {
      element.inert = inactive;
    }
  };

  const isMobileMenuOpen = () =>
    navigation.classList.contains('show-mobile-menu') ||
    mobileToggle.getAttribute('aria-expanded') === 'true';

  const sync = () => {
    const isMobile = mobileQuery.matches;
    const isOpen = isMobile && isMobileMenuOpen();

    setInactive(desktopWrapper, isMobile);
    setInactive(mobileWrapper, !isOpen);

    mobileToggle.setAttribute('aria-hidden', isMobile ? 'false' : 'true');
    mobileToggle.tabIndex = isMobile ? 0 : -1;

    const expanded = isOpen ? 'true' : 'false';
    if (mobileToggle.getAttribute('aria-expanded') !== expanded) {
      mobileToggle.setAttribute('aria-expanded', expanded);
    }

    if (wasMobileMenuOpen && !isOpen && mobileWrapper.contains(document.activeElement)) {
      mobileToggle.focus({ preventScroll: true });
    }

    wasMobileMenuOpen = isOpen;
  };

  const closeMobileMenu = () => {
    if (!mobileQuery.matches || !isMobileMenuOpen()) {
      return false;
    }

    mobileToggle.click();

    window.requestAnimationFrame(() => {
      if (isMobileMenuOpen()) {
        navigation.classList.remove('show-mobile-menu');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }

      sync();
      mobileToggle.focus({ preventScroll: true });
    });

    return true;
  };

  navigation.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Escape' || !closeMobileMenu()) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );

  mobileToggle.addEventListener('click', () => {
    window.requestAnimationFrame(sync);
  });

  const observer = new MutationObserver(sync);
  observer.observe(navigation, {
    attributes: true,
    attributeFilter: ['class'],
  });
  observer.observe(mobileToggle, {
    attributes: true,
    attributeFilter: ['aria-expanded'],
  });

  mobileQuery.addEventListener('change', sync);
  navigation.setAttribute(READY_ATTR, '1');
  navigation.__bemkeNavigationA11ySync = sync;
  sync();
}
