const CARD_SELECTOR = ".steam-block, .card";
const CTA_SELECTOR = "a.btn[href]";
const INTERACTIVE_SELECTOR =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
const LINKED_CARD_CLASS = "bemke-linked-card";
const VISUAL_CTA_CLASS = "bemke-linked-card__visual-cta";
const OVERLAY_LINK_CLASS = "bemke-linked-card__link";
const READY_ATTR = "data-bemke-linked-card-ready";

function normalizeText(value) {
  return value?.replace?.(/\s+/g, " ").trim() ?? "";
}

function getAccessibleLinkLabel(card, link) {
  const explicitLabel = normalizeText(link.getAttribute("aria-label"));

  if (explicitLabel) return explicitLabel;

  const linkLabel = normalizeText(link.textContent);
  const headingLabel = normalizeText(
    card.querySelector("h1, h2, h3, h4, h5, h6")?.textContent,
  );

  if (!headingLabel || linkLabel.toLowerCase().includes(headingLabel.toLowerCase())) {
    return linkLabel;
  }

  return `${linkLabel}: ${headingLabel}`;
}

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
  const linkLabel = getAccessibleLinkLabel(card, link);
  const visualCta = createVisualCta(link);

  link.before(visualCta);
  link.className = OVERLAY_LINK_CLASS;
  link.removeAttribute("style");
  link.replaceChildren();

  if (linkLabel) {
    link.setAttribute("aria-label", linkLabel);
  }

  card.appendChild(link);
  card.classList.add(LINKED_CARD_CLASS);
  card.setAttribute(READY_ATTR, "1");
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
