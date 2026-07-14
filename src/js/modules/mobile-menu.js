import { gsap } from 'gsap';

const HEADER_SELECTOR = '#brx-header';
const NAV_SELECTOR = '#brxe-vhhhdt';
const MENU_BAR_SELECTOR = '#brxe-spklen';
const MOBILE_WRAPPER_SELECTOR = '.bricks-mobile-menu-wrapper';
const MOBILE_MENU_SELECTOR = '.bricks-mobile-menu';
const MOBILE_TOGGLE_SELECTOR = '.bricks-mobile-menu-toggle';
const ACCESSIBILITY_SELECTOR = '.section_wcag';
const MOBILE_QUERY = '(max-width: 991px)';
const READY_ATTR = 'data-bemke-mobile-menu-ready';

export function initMobileMenu() {
  document.querySelectorAll(HEADER_SELECTOR).forEach((header) => {
    if (header.getAttribute(READY_ATTR) === '1') {
      header.__bemkeMobileMenuRefresh?.();
      return;
    }

    setupMobileMenu(header);
  });
}

function setupMobileMenu(header) {
  const navigation = header.querySelector(NAV_SELECTOR);
  const menuBar = header.querySelector(MENU_BAR_SELECTOR);
  const mobileWrapper = navigation?.querySelector(MOBILE_WRAPPER_SELECTOR);
  const mobileMenu = mobileWrapper?.querySelector(MOBILE_MENU_SELECTOR);
  const mobileToggle = navigation?.querySelector(MOBILE_TOGGLE_SELECTOR);
  const accessibilitySection = header.querySelector(ACCESSIBILITY_SELECTOR);

  if (
    !navigation ||
    !menuBar ||
    !mobileWrapper ||
    !mobileMenu ||
    !mobileToggle ||
    !accessibilitySection
  ) {
    return;
  }

  const originalAccessibilityParent = accessibilitySection.parentNode;
  const originalAccessibilityNextSibling = accessibilitySection.nextSibling;
  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  const mobileContent = createMobileContent(mobileWrapper, mobileMenu);

  decorateAccessibilitySection(accessibilitySection);
  setupAlwaysOpenNestedBranches(mobileMenu);
  setupPolishMenuLabels(navigation, mobileToggle, mobileWrapper);
  setupMobileMenuAnimation(navigation, mobileContent, mobileQuery);

  header.setAttribute(READY_ATTR, '1');

  const syncLayout = () => {
    updateMobileHeaderHeight(header, menuBar);

    if (mobileQuery.matches) {
      if (accessibilitySection.parentNode !== mobileContent) {
        mobileContent.appendChild(accessibilitySection);
      }

      accessibilitySection.classList.add('bemke-mobile-wcag');
      return;
    }

    accessibilitySection.classList.remove('bemke-mobile-wcag');

    if (accessibilitySection.parentNode === originalAccessibilityParent) {
      return;
    }

    if (originalAccessibilityNextSibling?.parentNode === originalAccessibilityParent) {
      originalAccessibilityParent.insertBefore(
        accessibilitySection,
        originalAccessibilityNextSibling,
      );
      return;
    }

    originalAccessibilityParent.appendChild(accessibilitySection);
  };

  mobileQuery.addEventListener('change', syncLayout);

  if ('ResizeObserver' in window) {
    const menuBarObserver = new ResizeObserver(() => {
      updateMobileHeaderHeight(header, menuBar);
    });
    menuBarObserver.observe(menuBar);
  } else {
    window.addEventListener('resize', () => updateMobileHeaderHeight(header, menuBar));
  }

  syncLayout();

  header.__bemkeMobileMenuRefresh = syncLayout;
}

function createMobileContent(mobileWrapper, mobileMenu) {
  const existingContent = mobileWrapper.querySelector(':scope > .bemke-mobile-menu__content');

  if (existingContent) {
    return existingContent;
  }

  const mobileContent = document.createElement('div');
  mobileContent.className = 'bemke-mobile-menu__content';
  mobileWrapper.insertBefore(mobileContent, mobileMenu);
  mobileContent.appendChild(mobileMenu);

  return mobileContent;
}

function setupMobileMenuAnimation(navigation, mobileContent, mobileQuery) {
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const syncAnimationState = (animate = true) => {
    const isOpen = navigation.classList.contains('show-mobile-menu');
    const yPercent = isOpen ? 0 : -100;

    gsap.killTweensOf(mobileContent);

    if (!animate || !mobileQuery.matches || reducedMotionQuery.matches) {
      gsap.set(mobileContent, { yPercent });
      return;
    }

    gsap.to(mobileContent, {
      duration: isOpen ? 0.58 : 0.46,
      ease: isOpen ? 'power3.out' : 'power2.inOut',
      force3D: true,
      overwrite: true,
      yPercent,
    });
  };

  syncAnimationState(false);

  const navigationObserver = new MutationObserver(() => {
    syncAnimationState(true);
  });

  navigationObserver.observe(navigation, {
    attributeFilter: ['class'],
    attributes: true,
  });

  mobileQuery.addEventListener('change', () => syncAnimationState(false));
  reducedMotionQuery.addEventListener('change', () => syncAnimationState(false));
}

function updateMobileHeaderHeight(header, menuBar) {
  const height = menuBar.getBoundingClientRect().height;

  if (height > 0) {
    header.style.setProperty('--bemke-mobile-header-height', `${Math.round(height)}px`);
  }
}

function decorateAccessibilitySection(section) {
  if (section.querySelector('.bemke-mobile-wcag__title')) {
    return;
  }

  const content = section.querySelector('.brxe-container > .brxe-block');
  const fontSizeControls = section.querySelector('#brxe-kecesp');
  const contrastControls = section.querySelector('#brxe-qcwgax');
  const languageControls = section.querySelector('.lang-switcher-block');

  if (!content || !fontSizeControls || !contrastControls || !languageControls) {
    return;
  }

  const title = document.createElement('h2');
  title.className = 'bemke-mobile-wcag__title';
  title.textContent = 'Dostępność';
  content.insertBefore(title, content.firstChild);

  wrapAccessibilityControl(fontSizeControls, 'Wielkość treści', 'font-size');
  wrapAccessibilityControl(contrastControls, 'Kontrast', 'contrast');
  wrapAccessibilityControl(languageControls, 'Język', 'language');
}

function wrapAccessibilityControl(control, label, key) {
  const row = document.createElement('div');
  const labelElement = document.createElement('span');
  const labelId = `bemke-mobile-wcag-label-${key}`;

  row.className = `bemke-mobile-wcag__row bemke-mobile-wcag__row--${key}`;
  row.setAttribute('role', 'group');
  row.setAttribute('aria-labelledby', labelId);
  labelElement.className = 'bemke-mobile-wcag__label';
  labelElement.id = labelId;
  labelElement.textContent = label;

  control.parentNode.insertBefore(row, control);
  row.append(labelElement, control);
}

function setupAlwaysOpenNestedBranches(mobileMenu) {
  const secondLevelItems = mobileMenu.querySelectorAll(
    ':scope > li > .sub-menu > li',
  );

  secondLevelItems.forEach((item) => {
    const submenuToggle = Array.from(item.children).find((child) =>
      child.matches('.brx-submenu-toggle'),
    );
    const submenu = Array.from(item.children).find((child) =>
      child.matches('.sub-menu'),
    );
    const button = submenuToggle?.querySelector(':scope > button');

    if (!submenuToggle || !submenu) {
      return;
    }

    item.classList.add('bemke-mobile-menu__nested-branch');
    submenu.setAttribute('aria-hidden', 'false');

    if (button) {
      button.hidden = true;
      button.tabIndex = -1;
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-hidden', 'true');
    }
  });
}

function setupPolishMenuLabels(navigation, mobileToggle, mobileWrapper) {
  if (window.bricksData?.i18n) {
    window.bricksData.i18n.openMobileMenu = 'Otwórz menu';
    window.bricksData.i18n.closeMobileMenu = 'Zamknij menu';
  }

  const updateMenuToggleLabel = () => {
    const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
  };

  updateMenuToggleLabel();

  const menuToggleObserver = new MutationObserver(updateMenuToggleLabel);
  menuToggleObserver.observe(mobileToggle, {
    attributeFilter: ['aria-expanded'],
    attributes: true,
  });

  mobileWrapper.querySelectorAll('.brx-submenu-toggle > button').forEach((button) => {
    const updateSubmenuLabel = () => {
      const itemLabel = button.parentElement?.querySelector(':scope > a')?.textContent.trim();
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      if (itemLabel) {
        button.setAttribute(
          'aria-label',
          `${isOpen ? 'Zwiń' : 'Rozwiń'} podmenu: ${itemLabel}`,
        );
      }
    };

    updateSubmenuLabel();

    const submenuObserver = new MutationObserver(updateSubmenuLabel);
    submenuObserver.observe(button, {
      attributeFilter: ['aria-expanded'],
      attributes: true,
    });
  });

  navigation.setAttribute('data-bemke-mobile-navigation', '1');
}
