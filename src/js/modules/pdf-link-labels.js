import { siteText } from './site-language.js';

const PDF_READY_ATTR = 'data-bemke-pdf-link-ready';
const FORMAT_LABEL_CLASS = 'bemke-pdf-link-format';
const BOOTED_FLAG = '__bemkePdfLinkLabelsBooted';

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
  const accessibleLabel = siteText('plik PDF', 'PDF, document in Polish');
  const visibleLabel = siteText(' (PDF)', ' (PDF, in Polish)');
  const ariaLabel = normalizeText(link.getAttribute('aria-label'));

  if (ariaLabel && !hasPdfText(ariaLabel)) {
    link.setAttribute('aria-label', `${ariaLabel}, ${accessibleLabel}`);
  }

  if (hasPdfText(link.textContent)) {
    return;
  }

  const formatLabel = document.createElement('span');
  formatLabel.className = `${FORMAT_LABEL_CLASS} bemke-sr-only`;
  formatLabel.textContent = visibleLabel;
  link.appendChild(formatLabel);
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
