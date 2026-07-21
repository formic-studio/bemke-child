const PAGE_SLUG = 'bemke-explore';
const CARD_SELECTOR = '.card';
const SCROLL_ATTR = 'data-bemke-explore-card-scroll';

function isBemkeExplorePage() {
  return window.location.pathname
    .split('/')
    .filter(Boolean)
    .includes(PAGE_SLUG);
}

export function initBemkeExploreCardScroll() {
  if (!isBemkeExplorePage()) {
    return;
  }

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const groups = new Map();

  document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
    const track = card.parentElement;

    if (!track) {
      return;
    }

    const cards = groups.get(track) ?? [];
    cards.push(card);
    groups.set(track, cards);
  });

  groups.forEach((cards, track) => {
    if (cards.length < 2) {
      return;
    }

    track.setAttribute(SCROLL_ATTR, '1');

    if (isMobile) {
      track.setAttribute('role', 'region');
      track.setAttribute('aria-label', 'Przewijana lista kart');

      if (!track.hasAttribute('tabindex')) {
        track.tabIndex = 0;
      }
    }
  });
}
