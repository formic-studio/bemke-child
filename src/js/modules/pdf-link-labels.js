const PDF_READY_ATTR = 'data-bemke-pdf-link-ready';
const HIDDEN_LABEL_CLASS = 'bemke-sr-only';
const BOOTED_FLAG = '__bemkePdfLinkLabelsBooted';
const PDF_LABEL = 'plik PDF';

export function initPdfLinkLabels() {
  labelPdfLinks();

  if (window[BOOTED_FLAG]) {
    return;
  }

  window[BOOTED_FLAG] = true;

  window.addEventListener('load', () => labelPdfLinks());
  document.addEventListener('bricks/ajax/end', () => labelPdfLinks());

  if (!window.MutationObserver || !document.body) {
    return;
  }

  new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
      labelPdfLinks();
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function labelPdfLinks(root = document) {
  const scope = typeof root?.querySelectorAll === 'function' ? root : document;

  scope.querySelectorAll('a[href]').forEach((link) => {
    if (link.getAttribute(PDF_READY_ATTR) === '1' || !isPdfHref(link.getAttribute('href'))) {
      return;
    }

    link.setAttribute(PDF_READY_ATTR, '1');
    link.setAttribute('type', 'application/pdf');
    ensurePdfAccessibleName(link);
  });
}

function ensurePdfAccessibleName(link) {
  const ariaLabel = normalizeText(link.getAttribute('aria-label'));

  if (ariaLabel) {
    if (!hasPdfText(ariaLabel)) {
      link.setAttribute('aria-label', `${ariaLabel}, ${PDF_LABEL}`);
    }

    return;
  }

  if (hasPdfText(link.textContent)) {
    return;
  }

  const hiddenLabel = document.createElement('span');
  hiddenLabel.className = HIDDEN_LABEL_CLASS;
  hiddenLabel.textContent = ` (${PDF_LABEL})`;
  link.appendChild(hiddenLabel);
}

function isPdfHref(href) {
  if (!href) {
    return false;
  }

  try {
    return new URL(href, window.location.href).pathname.toLowerCase().endsWith('.pdf');
  } catch {
    return /\.pdf(?:$|[?#])/i.test(href);
  }
}

function hasPdfText(text) {
  return /\bpdf\b/i.test(normalizeText(text));
}

function normalizeText(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}
