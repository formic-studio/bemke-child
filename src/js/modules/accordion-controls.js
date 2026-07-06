const ROOT_SELECTOR = '.accordin-block';
const ITEM_SELECTOR = '.accordin-item';
const HEADING_SELECTOR = '.accordin-heading';
const PANEL_SELECTOR = '.accordin-text';
const BUTTON_SELECTOR = '.accordin-btn';
const TITLE_SELECTOR = '.accordin-tittle';
const NUMBER_SELECTOR = '.accordin-number';
const DECORATIVE_SELECTOR = '.dot';
const OPEN_ITEM_CLASS = 'is-open';
const OPEN_PANEL_CLASS = 'accordin-text-open';
const OPEN_BUTTON_CLASS = 'accordin-btn-oppen';
const BOOT_FLAG = '__bemkeAccordionBooted';

function getAccordionRoots() {
  return Array.from(document.querySelectorAll(ROOT_SELECTOR));
}

function getItems(root) {
  return Array.from(root.querySelectorAll(`:scope > ${ITEM_SELECTOR}`));
}

function getHeading(item) {
  return item.querySelector(HEADING_SELECTOR);
}

function getPanel(item) {
  return item.querySelector(PANEL_SELECTOR);
}

function getButton(item) {
  return item.querySelector(BUTTON_SELECTOR);
}

function getTitle(item) {
  return item.querySelector(TITLE_SELECTOR);
}

function getPreferredDisplay(panel) {
  const stored = panel.dataset.accordionDisplay;
  if (stored) {
    return stored;
  }

  const computedDisplay = window.getComputedStyle(panel).display;
  const resolvedDisplay =
    computedDisplay === 'none'
      ? panel.classList.contains('brxe-block')
        ? 'flex'
        : 'block'
      : computedDisplay;
  panel.dataset.accordionDisplay = resolvedDisplay;

  return resolvedDisplay;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setExpandedState(item, expanded) {
  const heading = getHeading(item);
  const panel = getPanel(item);
  const button = getButton(item);

  item.classList.toggle(OPEN_ITEM_CLASS, expanded);

  if (panel) {
    panel.classList.toggle(OPEN_PANEL_CLASS, expanded);
    panel.setAttribute('aria-hidden', expanded ? 'false' : 'true');
  }

  if (button) {
    button.classList.toggle(OPEN_BUTTON_CLASS, expanded);
    button.setAttribute('aria-hidden', 'true');
  }

  if (heading) {
    heading.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    heading.setAttribute('aria-disabled', 'false');
  }
}

function stopRunningTransition(panel) {
  panel.dataset.accordionAnimating = 'false';
  panel.removeEventListener('transitionend', panel.__bemkeAccordionOnTransitionEnd);
  delete panel.__bemkeAccordionOnTransitionEnd;
}

function setPanelOpen(item, immediate = false) {
  const panel = getPanel(item);
  if (!panel) {
    return;
  }

  const display = getPreferredDisplay(panel);
  panel.style.display = display;
  panel.style.overflow = 'hidden';
  panel.style.visibility = 'visible';

  setExpandedState(item, true);

  if (immediate || prefersReducedMotion()) {
    stopRunningTransition(panel);
    panel.style.opacity = '1';
    panel.style.height = 'auto';
    return;
  }

  stopRunningTransition(panel);

  const targetHeight = panel.scrollHeight;
  panel.style.height = '0px';
  panel.style.opacity = '0';
  panel.offsetHeight;
  panel.style.height = `${targetHeight}px`;
  panel.style.opacity = '1';
  panel.dataset.accordionAnimating = 'true';

  const onTransitionEnd = (event) => {
    if (event.propertyName !== 'height') {
      return;
    }

    stopRunningTransition(panel);

    if (!item.classList.contains(OPEN_ITEM_CLASS)) {
      return;
    }

    panel.style.height = 'auto';
  };

  panel.__bemkeAccordionOnTransitionEnd = onTransitionEnd;
  panel.addEventListener('transitionend', onTransitionEnd);
}

function setPanelClosed(item, immediate = false) {
  const panel = getPanel(item);
  if (!panel) {
    return;
  }

  const display = getPreferredDisplay(panel);
  panel.style.display = display;
  panel.style.overflow = 'hidden';

  setExpandedState(item, false);

  if (immediate || prefersReducedMotion()) {
    stopRunningTransition(panel);
    panel.style.height = '0px';
    panel.style.opacity = '0';
    panel.style.visibility = 'hidden';
    return;
  }

  stopRunningTransition(panel);

  const startHeight = panel.scrollHeight;
  panel.style.height = `${startHeight}px`;
  panel.style.opacity = '1';
  panel.style.visibility = 'visible';
  panel.offsetHeight;
  panel.style.height = '0px';
  panel.style.opacity = '0';
  panel.dataset.accordionAnimating = 'true';

  const onTransitionEnd = (event) => {
    if (event.propertyName !== 'height') {
      return;
    }

    stopRunningTransition(panel);

    if (item.classList.contains(OPEN_ITEM_CLASS)) {
      return;
    }

    panel.style.visibility = 'hidden';
  };

  panel.__bemkeAccordionOnTransitionEnd = onTransitionEnd;
  panel.addEventListener('transitionend', onTransitionEnd);
}

function isItemMarkedOpen(item) {
  const panel = getPanel(item);
  const button = getButton(item);

  return (
    item.classList.contains(OPEN_ITEM_CLASS) ||
    panel?.classList.contains(OPEN_PANEL_CLASS) ||
    button?.classList.contains(OPEN_BUTTON_CLASS)
  );
}

function decorateHeading(item, index) {
  const heading = getHeading(item);
  const panel = getPanel(item);
  const title = getTitle(item);

  if (!heading || !panel) {
    return;
  }

  if (!heading.id) {
    heading.id = `bemke-accordion-trigger-${index + 1}`;
  }

  if (!panel.id) {
    panel.id = `bemke-accordion-panel-${index + 1}`;
  }

  heading.setAttribute('role', 'button');
  heading.setAttribute('tabindex', '0');
  heading.setAttribute('aria-controls', panel.id);
  heading.setAttribute('aria-disabled', 'false');
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', heading.id);

  const titleText = title?.textContent?.trim();
  if (titleText) {
    heading.setAttribute('aria-label', titleText);
  }
}

function decorateDecorativeElements(item) {
  item.querySelectorAll(`${NUMBER_SELECTOR}, ${NUMBER_SELECTOR} *, ${DECORATIVE_SELECTOR}`).forEach((element) => {
    element.setAttribute('aria-hidden', 'true');
  });

  item.querySelectorAll(`${BUTTON_SELECTOR}, ${BUTTON_SELECTOR} *`).forEach((element) => {
    element.setAttribute('aria-hidden', 'true');
  });

  item.querySelectorAll(`${BUTTON_SELECTOR} svg`).forEach((element) => {
    element.setAttribute('focusable', 'false');
  });
}

function toggleItem(item) {
  if (!item) {
    return;
  }

  if (item.classList.contains(OPEN_ITEM_CLASS)) {
    setPanelClosed(item);
    return;
  }

  setPanelOpen(item);
}

function resolveToggleItem(root, target) {
  const item = target.closest(ITEM_SELECTOR);
  if (!item || !root.contains(item)) {
    return null;
  }

  if (
    target.closest(HEADING_SELECTOR) ||
    target.closest(BUTTON_SELECTOR) ||
    target.closest('.accordin-tittle') ||
    target.closest('.accordin-number')
  ) {
    return item;
  }

  return null;
}

function handleAccordionClick(event) {
  const root = event.target.closest(ROOT_SELECTOR);
  if (!root) {
    return;
  }

  const item = resolveToggleItem(root, event.target);
  if (!item) {
    return;
  }

  event.preventDefault();
  toggleItem(item);
}

function handleAccordionKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  const heading = event.target.closest(`${ROOT_SELECTOR} ${HEADING_SELECTOR}`);
  if (!heading) {
    return;
  }

  const root = heading.closest(ROOT_SELECTOR);
  const item = heading.closest(ITEM_SELECTOR);
  if (!root || !item) {
    return;
  }

  event.preventDefault();
  toggleItem(item);
}

function setupAccordion(root) {
  const items = getItems(root);
  if (!items.length) {
    return;
  }

  items.forEach((item, index) => {
    decorateHeading(item, index);
    decorateDecorativeElements(item);
  });

  const markedOpenItems = items.filter(isItemMarkedOpen);
  const initialOpenItems = new Set(markedOpenItems);

  items.forEach((item) => {
    if (initialOpenItems.has(item)) {
      setPanelOpen(item, true);
      return;
    }

    setPanelClosed(item, true);
  });
}

export function initAccordionControls() {
  const roots = getAccordionRoots();
  if (!roots.length) {
    return;
  }

  roots.forEach(setupAccordion);

  if (window[BOOT_FLAG]) {
    return;
  }

  window[BOOT_FLAG] = true;

  document.addEventListener('click', handleAccordionClick);
  document.addEventListener('keydown', handleAccordionKeydown);
}
