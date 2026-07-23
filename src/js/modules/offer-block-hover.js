const BLOCK_SELECTOR =
  '.offer-block, .linkedin-block, .donors-block, #brxe-ejpmtj .brxe-aepfcc';
const PRIMARY_LINK_SELECTOR = '.link-block';
const FALLBACK_LINK_SELECTORS = [
  '.offer-link',
  '.donors-block .brxe-text-link',
];
const LINK_SELECTORS = [PRIMARY_LINK_SELECTOR, ...FALLBACK_LINK_SELECTORS];
const LINK_SELECTOR = LINK_SELECTORS.join(', ');
const FALLBACK_LINK_SELECTOR = FALLBACK_LINK_SELECTORS.join(', ');
const DEFAULT_ACTIVE_CLASS = 'bg-eggShell';
const DONORS_ACTIVE_CLASS = 'is-darkcream-hover';
const BOOT_FLAG = '__bemkeOfferBlockHoverBooted';

function getOfferBlock(target) {
  return target?.closest?.(BLOCK_SELECTOR) ?? null;
}

function getOfferLink(target) {
  return (
    target?.closest?.(PRIMARY_LINK_SELECTOR) ??
    target?.closest?.(FALLBACK_LINK_SELECTOR) ??
    null
  );
}

function hasFocusedOfferLink(block) {
  const focusedLink = getOfferLink(document.activeElement);

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
  const link = getOfferLink(event.target);
  setOfferBlockActive(getOfferBlock(link), Boolean(link));
}

function handlePointerOut(event) {
  const link = getOfferLink(event.target);
  const block = getOfferBlock(link);

  if (!block || link.contains(event.relatedTarget) || hasFocusedOfferLink(block)) {
    return;
  }

  setOfferBlockActive(block, false);
}

function handleFocusIn(event) {
  const link = getOfferLink(event.target);
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
