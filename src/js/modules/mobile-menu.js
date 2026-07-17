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
  const accessibilityLayout = createMobileAccessibilityLayout(
    accessibilitySection,
  );

  setupAlwaysOpenNestedBranches(mobileMenu);
  setupPolishMenuLabels(navigation, mobileToggle, mobileWrapper);
  setupMobileSubmenuAnimation(navigation, mobileMenu, mobileQuery);
  setupMobileMenuAnimation(navigation, mobileContent, mobileQuery);

  header.setAttribute(READY_ATTR, '1');

  const syncLayout = () => {
    updateMobileHeaderHeight(header, menuBar);

    if (mobileQuery.matches) {
      if (accessibilitySection.parentNode !== mobileContent) {
        mobileContent.appendChild(accessibilitySection);
      }

      accessibilitySection.classList.add('bemke-mobile-wcag');
      accessibilityLayout.mount();
      return;
    }

    accessibilityLayout.unmount();
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
      gsap.set(mobileContent, { y: 0, yPercent });
      return;
    }

    gsap.to(mobileContent, {
      duration: isOpen ? 0.58 : 0.46,
      ease: isOpen ? 'power3.out' : 'power2.inOut',
      force3D: true,
      overwrite: true,
      y: 0,
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

function setupMobileSubmenuAnimation(navigation, mobileMenu, mobileQuery) {
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuItems = Array.from(mobileMenu.children).filter((item) =>
    item.matches('li'),
  );
  const animatedBranches = menuItems
    .map((item) => ({
      item,
      link: item.querySelector(':scope > .brx-submenu-toggle > a'),
      submenu: item.querySelector(':scope > .sub-menu'),
    }))
    .filter(({ link, submenu }) => link && submenu);

  if (!animatedBranches.length) {
    return;
  }

  navigation.classList.add('bemke-mobile-menu--gsap-submenus');

  mobileMenu.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest('.brx-submenu-toggle > a');
      const item = link?.closest('li');

      if (!link || item?.parentElement !== mobileMenu) {
        return;
      }

      event.stopPropagation();
    },
    true,
  );

  const syncBranch = ({ item, submenu }, animate = true) => {
    const isOpen = item.classList.contains('open');

    gsap.killTweensOf(submenu);

    if (!animate || !mobileQuery.matches || reducedMotionQuery.matches) {
      gsap.set(submenu, {
        autoAlpha: isOpen ? 1 : 0,
        height: isOpen ? 'auto' : 0,
        overflow: isOpen ? 'visible' : 'hidden',
      });
      return;
    }

    if (isOpen) {
      gsap.set(submenu, { overflow: 'hidden', visibility: 'visible' });
      gsap.to(submenu, {
        autoAlpha: 1,
        duration: 0.44,
        ease: 'power2.out',
        height: 'auto',
        onComplete: () => gsap.set(submenu, { overflow: 'visible' }),
        overwrite: true,
      });
      return;
    }

    gsap.set(submenu, { overflow: 'hidden', visibility: 'visible' });
    gsap.to(submenu, {
      autoAlpha: 0,
      duration: 0.34,
      ease: 'power2.inOut',
      height: 0,
      overwrite: true,
    });
  };

  animatedBranches.forEach((branch) => {
    syncBranch(branch, false);

    const itemObserver = new MutationObserver(() => syncBranch(branch, true));
    itemObserver.observe(branch.item, {
      attributeFilter: ['class'],
      attributes: true,
    });
  });

  const syncAllBranches = () => {
    animatedBranches.forEach((branch) => syncBranch(branch, false));
  };

  mobileQuery.addEventListener('change', syncAllBranches);
  reducedMotionQuery.addEventListener('change', syncAllBranches);
}

function updateMobileHeaderHeight(header, menuBar) {
  const height = menuBar.getBoundingClientRect().height;

  if (height > 0) {
    header.style.setProperty('--bemke-mobile-header-height', `${Math.round(height)}px`);
  }
}

function createMobileAccessibilityLayout(section) {
  const content = section.querySelector('.brxe-container > .brxe-block');
  // Bricks remains the source of truth for the desktop structure and order.
  let originalChildren = null;
  let cleanupDisclosure = null;

  const mount = () => {
    if (!content || originalChildren) {
      return;
    }

    const fontSizeControls = section.querySelector('#brxe-kecesp');
    const contrastControls = section.querySelector('#brxe-qcwgax');
    const switcherBlocks = Array.from(
      section.querySelectorAll('.lang-switcher-block'),
    );
    const animationControls = switcherBlocks.find((control) =>
      control.querySelector('.animation-switcher'),
    );
    const languageControls = switcherBlocks.find((control) =>
      control.querySelector('.lang-switcher:not(.animation-switcher)'),
    );

    if (!fontSizeControls || !contrastControls || !languageControls) {
      return;
    }

    originalChildren = Array.from(content.childNodes);

    const heading = document.createElement('div');
    const title = document.createElement('h2');
    const panel = document.createElement('div');
    const panelId = 'bemke-mobile-wcag-panel';
    const sourceToggle = section
      .closest(HEADER_SELECTOR)
      ?.querySelector(
        `${NAV_SELECTOR} .bricks-mobile-menu > li > .brx-submenu-toggle > button`,
      );
    const toggle =
      sourceToggle?.cloneNode(true) ?? document.createElement('button');

    heading.className = 'bemke-mobile-wcag__heading';
    title.className = 'bemke-mobile-wcag__title';
    title.textContent = 'Dostępność';
    toggle.classList.add('bemke-mobile-wcag__toggle');
    toggle.hidden = false;
    toggle.removeAttribute('id');
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', panelId);
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Zwiń dostępność');
    panel.className = 'bemke-mobile-wcag__panel';
    panel.id = panelId;

    toggle
      .querySelectorAll('[id]')
      .forEach((element) => element.removeAttribute('id'));
    toggle.querySelectorAll('svg').forEach((arrow) => {
      arrow.setAttribute('aria-hidden', 'true');
      arrow.setAttribute('focusable', 'false');
    });

    if (!toggle.firstElementChild) {
      toggle.replaceChildren();
      const arrow = document.createElement('span');
      arrow.className = 'bemke-mobile-wcag__toggle-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      toggle.appendChild(arrow);
    }

    heading.append(title, toggle);
    content.insertBefore(heading, content.firstChild);

    const controls = [
      animationControls
        ? {
            control: animationControls,
            key: 'motion',
            label: 'Ogranicz animacje',
          }
        : null,
      {
        control: fontSizeControls,
        key: 'font-size',
        label: 'Wielkość treści',
      },
      { control: contrastControls, key: 'contrast', label: 'Kontrast' },
      { control: languageControls, key: 'language', label: 'Język' },
    ].filter(Boolean);

    controls.forEach(({ control, label, key }) => {
      panel.appendChild(wrapAccessibilityControl(control, label, key));
    });

    heading.insertAdjacentElement('afterend', panel);
    cleanupDisclosure = setupAccessibilityDisclosure(section);
  };

  const unmount = () => {
    if (!content || !originalChildren) {
      return;
    }

    cleanupDisclosure?.();
    cleanupDisclosure = null;
    content.replaceChildren(...originalChildren);
    originalChildren = null;
  };

  return { mount, unmount };
}

function setupAccessibilityDisclosure(section) {
  const toggle = section.querySelector('.bemke-mobile-wcag__toggle');
  const panel = section.querySelector('.bemke-mobile-wcag__panel');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!toggle || !panel) {
    return null;
  }

  const setExpanded = (isExpanded, animate = true) => {
    toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    toggle.setAttribute(
      'aria-label',
      isExpanded ? 'Zwiń dostępność' : 'Rozwiń dostępność',
    );
    panel.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');

    gsap.killTweensOf(panel);

    if (!animate || reducedMotionQuery.matches) {
      gsap.set(panel, {
        autoAlpha: isExpanded ? 1 : 0,
        height: isExpanded ? 'auto' : 0,
        overflow: isExpanded ? 'visible' : 'hidden',
      });
      return;
    }

    if (isExpanded) {
      gsap.set(panel, { overflow: 'hidden', visibility: 'visible' });
      gsap.to(panel, {
        autoAlpha: 1,
        duration: 0.44,
        ease: 'power2.out',
        height: 'auto',
        onComplete: () => gsap.set(panel, { overflow: 'visible' }),
        overwrite: true,
      });
      return;
    }

    gsap.set(panel, { overflow: 'hidden', visibility: 'visible' });
    gsap.to(panel, {
      autoAlpha: 0,
      duration: 0.34,
      ease: 'power2.inOut',
      height: 0,
      overwrite: true,
    });
  };

  const handleToggleClick = () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    setExpanded(!isExpanded, true);
  };
  const syncDisclosure = () => {
    setExpanded(toggle.getAttribute('aria-expanded') === 'true', false);
  };

  toggle.addEventListener('click', handleToggleClick);
  syncDisclosure();
  reducedMotionQuery.addEventListener('change', syncDisclosure);

  return () => {
    toggle.removeEventListener('click', handleToggleClick);
    reducedMotionQuery.removeEventListener('change', syncDisclosure);
    gsap.killTweensOf(panel);
    gsap.set(panel, {
      clearProps: 'height,opacity,overflow,visibility',
    });
  };
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

  return row;
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
