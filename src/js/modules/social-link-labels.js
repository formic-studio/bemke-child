const READY_ATTR = 'data-bemke-social-link-ready';
const BOOTED_FLAG = '__bemkeSocialLinkLabelsBooted';

const SOCIAL_LABELS = [
  {
    hostPattern: /(^|\.)instagram\.com$/,
    label: 'Profil Bemke na Instagramie',
  },
  {
    hostPattern: /(^|\.)facebook\.com$/,
    label: 'Profil Bemke na Facebooku',
  },
  {
    hostPattern: /(^|\.)linkedin\.com$/,
    label: 'Profil Bemke na LinkedInie',
  },
];

export function initSocialLinkLabels() {
  labelSocialLinks();

  if (window[BOOTED_FLAG]) {
    return;
  }

  window[BOOTED_FLAG] = true;

  window.addEventListener('load', () => labelSocialLinks());
  document.addEventListener('bricks/ajax/end', () => labelSocialLinks());

  if (!window.MutationObserver || !document.body) {
    return;
  }

  new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
      labelSocialLinks();
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function labelSocialLinks(root = document) {
  const scope = typeof root?.querySelectorAll === 'function' ? root : document;

  scope.querySelectorAll('a[href]').forEach((link) => {
    if (link.getAttribute(READY_ATTR) === '1') {
      return;
    }

    const label = getSocialLabel(link.getAttribute('href'));

    if (!label) {
      return;
    }

    link.setAttribute(READY_ATTR, '1');
    ensureLinkLabel(link, label);
    hideDecorativeMedia(link);
  });
}

function ensureLinkLabel(link, label) {
  if (!normalizeText(link.getAttribute('aria-label')) && !normalizeText(link.textContent)) {
    link.setAttribute('aria-label', label);
  }
}

function hideDecorativeMedia(link) {
  link.querySelectorAll('svg').forEach((svg) => {
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
  });

  link.querySelectorAll('img').forEach((image) => {
    if (!normalizeText(image.getAttribute('alt'))) {
      image.setAttribute('alt', '');
    }
  });
}

function getSocialLabel(href) {
  if (!href) {
    return null;
  }

  try {
    const hostname = new URL(href, window.location.href).hostname.toLowerCase();
    const match = SOCIAL_LABELS.find(({ hostPattern }) => hostPattern.test(hostname));

    return match?.label ?? null;
  } catch {
    return null;
  }
}

function normalizeText(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}
