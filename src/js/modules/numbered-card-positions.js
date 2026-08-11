const CARD_SELECTOR = '.card';
const READY_ATTR = 'data-bemke-card-position-ready';
const POSITION_ATTR = 'data-bemke-card-position-label';

function findVisualNumber(card) {
  return Array.from(card.querySelectorAll('*')).find((element) => {
    if (element.children.length > 0) {
      return false;
    }

    return /^0\d+$/u.test(element.textContent?.trim() ?? '');
  });
}

function prepareCardGroup(cards) {
  const numberedCards = cards
    .map((card) => ({ card, number: findVisualNumber(card) }))
    .filter(({ number }) => number);

  if (numberedCards.length < 2) {
    return;
  }

  numberedCards.forEach(({ card, number }, index) => {
    number.setAttribute('aria-hidden', 'true');
    number.parentElement?.querySelectorAll(':scope > svg').forEach((icon) => {
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
    });

    let positionLabel = card.querySelector(`[${POSITION_ATTR}]`);

    if (!positionLabel) {
      positionLabel = document.createElement('span');
      positionLabel.className = 'bemke-sr-only';
      positionLabel.setAttribute(POSITION_ATTR, '');
      number.after(positionLabel);
    }

    positionLabel.textContent = `Karta ${index + 1} z ${numberedCards.length}.`;
    card.setAttribute(READY_ATTR, '1');
  });
}

function prepareNumberedCardPositions(scope = document) {
  const groups = new Map();

  scope.querySelectorAll(CARD_SELECTOR).forEach((card) => {
    const parent = card.parentElement;

    if (!parent) {
      return;
    }

    const cards = groups.get(parent) ?? [];
    cards.push(card);
    groups.set(parent, cards);
  });

  groups.forEach(prepareCardGroup);
}

export function initNumberedCardPositions() {
  prepareNumberedCardPositions();

  document.addEventListener('bricks/ajax/end', () => {
    prepareNumberedCardPositions();
  });
}
