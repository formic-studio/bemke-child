const BLOCK_SELECTOR =
  '.offer-block, .linkedin-block, .donors-block, #brxe-ejpmtj .brxe-aepfcc';
const LINK_SELECTORS = ['.offer-link', '.donors-block .brxe-text-link'];
const LINK_SELECTOR = LINK_SELECTORS.join(', ');
const DEFAULT_ACTIVE_CLASS = 'bg-eggShell';
const DONORS_ACTIVE_CLASS = 'is-darkcream-hover';
const BOOT_FLAG = '__bemkeOfferBlockHoverBooted';

function getOfferBlock(target) {
  return target?.closest?.(BLOCK_SELECTOR) ?? null;
}

function hasFocusedOfferLink(block) {
  const focusedLink = document.activeElement?.closest?.(LINK_SELECTOR);

  return Boolean(focusedLink && getOfferBlock(focusedLink) === block);
}

function setOfferBlockActive(block, active) {
  if (!block) {
    return;
  }

  const activeClass = block.matches('.donors-block')
    ? DONORS_ACTIVE_CLASS
    : DEFAULT_ACTIVE_CLASS;

  block.classList.toggle(activeClass, active);
}

function handlePointerOver(event) {
  const link = event.target?.closest?.(LINK_SELECTOR);
  setOfferBlockActive(getOfferBlock(link), Boolean(link));
}

function handlePointerOut(event) {
  const link = event.target?.closest?.(LINK_SELECTOR);
  const block = getOfferBlock(link);

  if (!block || link.contains(event.relatedTarget) || hasFocusedOfferLink(block)) {
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
  if (window[BOOT_FLAG] || !document.querySelector(LINK_SELECTOR)) {
    return;
  }

  window[BOOT_FLAG] = true;
  document.addEventListener('pointerover', handlePointerOver);
  document.addEventListener('pointerout', handlePointerOut);
  document.addEventListener('focusin', handleFocusIn);
  document.addEventListener('focusout', handleFocusOut);
}
