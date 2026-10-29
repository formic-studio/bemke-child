const CARD_SELECTOR = ".steam-block, .card, .area-block";
const CTA_SELECTOR = "a.btn[href]";
const INTERACTIVE_SELECTOR =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
const LINKED_CARD_CLASS = "bemke-linked-card";
const VISUAL_CTA_CLASS = "bemke-linked-card__visual-cta";
const READY_ATTR = "data-bemke-linked-card-ready";

function createVisualCta(link) {
  const visualCta = document.createElement("span");

  visualCta.className = `${link.className} ${VISUAL_CTA_CLASS}`.trim();
  visualCta.setAttribute("aria-hidden", "true");

  if (link.id) {
    visualCta.id = link.id;
    link.removeAttribute("id");
  }

  if (link.hasAttribute("style")) {
    visualCta.setAttribute("style", link.getAttribute("style"));
  }

  visualCta.append(
    ...Array.from(link.childNodes, (node) => node.cloneNode(true)),
  );

  return visualCta;
}

function enhanceLinkedCard(card) {
  if (card.hasAttribute(READY_ATTR)) return;

  const ctas = Array.from(card.querySelectorAll(CTA_SELECTOR));
  const interactiveElements = Array.from(
    card.querySelectorAll(INTERACTIVE_SELECTOR),
  );

  if (
    ctas.length !== 1 ||
    interactiveElements.length !== 1 ||
    interactiveElements[0] !== ctas[0]
  ) {
    return;
  }

  const link = ctas[0];
  const visualCta = createVisualCta(link);
  const linkedCard = document.createElement("a");

  Array.from(card.attributes).forEach(({ name, value }) => {
    linkedCard.setAttribute(name, value);
  });

  ["href", "target", "rel", "download", "hreflang", "referrerpolicy"].forEach(
    (name) => {
      if (link.hasAttribute(name)) {
        linkedCard.setAttribute(name, link.getAttribute(name));
      }
    },
  );

  link.replaceWith(visualCta);
  linkedCard.replaceChildren(...card.childNodes);
  linkedCard.classList.add(LINKED_CARD_CLASS);
  linkedCard.setAttribute(READY_ATTR, "1");
  card.replaceWith(linkedCard);
}

function enhanceLinkedCards(scope = document) {
  scope.querySelectorAll(CARD_SELECTOR).forEach(enhanceLinkedCard);
}

export function initLinkedCards() {
  enhanceLinkedCards();

  document.addEventListener("bricks/ajax/end", () => {
    enhanceLinkedCards();
  });
}
