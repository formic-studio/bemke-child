const BLOCK_SELECTOR = '.offer-block';
const LINK_SELECTOR = '.offer-link';
const ACTIVE_CLASS = 'bg-eggShell';
const BOOT_FLAG = '__bemkeOfferBlockHoverBooted';

function getOfferBlock(target) {
  return target?.closest?.(BLOCK_SELECTOR) ?? null;
}

function hasFocusedOfferLink(block) {
  return Boolean(block?.querySelector(`${LINK_SELECTOR}:focus`));
}

function setOfferBlockActive(block, active) {
  if (!block) {
    return;
  }

  block.classList.toggle(ACTIVE_CLASS, active);
}

function handlePointerOver(event) {
  const link = event.target?.closest?.(LINK_SELECTOR);
  setOfferBlockActive(getOfferBlock(link), Boolean(link));
}

function handlePointerOut(event) {
  const link = event.target?.closest?.(LINK_SELECTOR);
  const block = getOfferBlock(link);

  if (!block || block.contains(event.relatedTarget) || hasFocusedOfferLink(block)) {
    return;
  }

  setOfferBlockActive(block, false);
}

function handleFocusIn(event) {
  const link = event.target?.closest?.(LINK_SELECTOR);
  setOfferBlockActive(getOfferBlock(link), Boolean(link));
}

function handleFocusOut(event) {
  const block = getOfferBlock(event.target);

  window.requestAnimationFrame(() => {
    setOfferBlockActive(block, hasFocusedOfferLink(block));
  });
}

export function initOfferBlockHover() {
  if (window[BOOT_FLAG] || !document.querySelector(`${BLOCK_SELECTOR} ${LINK_SELECTOR}`)) {
    return;
  }

  window[BOOT_FLAG] = true;
  document.addEventListener('pointerover', handlePointerOver);
  document.addEventListener('pointerout', handlePointerOut);
  document.addEventListener('focusin', handleFocusIn);
  document.addEventListener('focusout', handleFocusOut);
}
