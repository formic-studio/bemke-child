const HEADER_SELECTOR = '#brx-header';
const NAV_SELECTOR = '#brxe-vhhhdt';
const MOBILE_WRAPPER_SELECTOR = '.bricks-mobile-menu-wrapper';
const MOBILE_MENU_SELECTOR = '.bricks-mobile-menu';
const MOBILE_TOGGLE_SELECTOR = '.bricks-mobile-menu-toggle';
const ACCESSIBILITY_SELECTOR = '.section_wcag';
const LOGO_SELECTOR = '#brxe-etginj';
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
  const mobileWrapper = navigation?.querySelector(MOBILE_WRAPPER_SELECTOR);
  const mobileMenu = mobileWrapper?.querySelector(MOBILE_MENU_SELECTOR);
  const mobileToggle = navigation?.querySelector(MOBILE_TOGGLE_SELECTOR);
  const accessibilitySection = header.querySelector(ACCESSIBILITY_SELECTOR);
  const logo = header.querySelector(LOGO_SELECTOR);

  if (
    !navigation ||
    !mobileWrapper ||
    !mobileMenu ||
    !mobileToggle ||
    !accessibilitySection ||
    !logo
  ) {
    return;
  }

  const originalAccessibilityParent = accessibilitySection.parentNode;
  const originalAccessibilityNextSibling = accessibilitySection.nextSibling;
  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  const panelHeader = createPanelHeader(logo);

  decorateAccessibilitySection(accessibilitySection);
  setupPolishMenuLabels(navigation, mobileToggle, mobileWrapper);

  mobileWrapper.insertBefore(panelHeader, mobileMenu);
  header.setAttribute(READY_ATTR, '1');

  const syncLayout = () => {
    if (mobileQuery.matches) {
      if (accessibilitySection.parentNode !== mobileWrapper) {
        mobileWrapper.appendChild(accessibilitySection);
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
  syncLayout();

  header.__bemkeMobileMenuRefresh = syncLayout;
}

function createPanelHeader(logo) {
  const panelHeader = document.createElement('div');
  const panelLogo = logo.cloneNode(true);

  panelHeader.className = 'bemke-mobile-menu__header';
  panelLogo.className = 'bemke-mobile-menu__logo';
  panelLogo.removeAttribute('id');
  panelLogo.removeAttribute('aria-current');
  panelLogo.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
  panelHeader.appendChild(panelLogo);

  return panelHeader;
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
