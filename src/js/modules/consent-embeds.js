const COOKIEBOT_SCRIPT_SELECTOR =
  'script#Cookiebot, script[src*="consent.cookiebot.com/uc.js"]';
const GOOGLE_MAP_SELECTOR = '.brxe-map[data-bricks-map-options]';
const GOOGLE_MAP_SCRIPT_SELECTOR =
  'script[data-bemke-consent-service="google-maps"]';
const YOUTUBE_ROOT_SELECTOR = '.video-yt';
const YOUTUBE_PREVIEW_SELECTOR =
  '[data-bemke-cookieblock-iframe-src*="youtube-nocookie.com/embed/"], [data-iframe-src*="youtube.com/embed/"], [data-iframe-src*="youtube-nocookie.com/embed/"]';
const COOKIEBOT_EVENTS = [
  'CookiebotOnConsentReady',
  'CookiebotOnAccept',
  'CookiebotOnDecline',
  'CookiebotOnLoad',
];
const initializedMaps = new WeakSet();
const initializedVideos = new WeakSet();
let messageId = 0;
let consentLifecycleReady = false;
let previousMarketingConsent = null;

function hasCookiebot() {
  return Boolean(window.Cookiebot || document.querySelector(COOKIEBOT_SCRIPT_SELECTOR));
}

function hasMarketingConsent() {
  return Boolean(window.Cookiebot?.consent?.marketing);
}

function openPrivacySettings(status) {
  if (typeof window.Cookiebot?.renew === 'function') {
    window.Cookiebot.renew();
    return;
  }

  if (status) {
    status.textContent =
      'Ustawienia prywatności jeszcze się ładują. Spróbuj ponownie za chwilę.';
  }
}

function createConsentPanel(service) {
  messageId += 1;

  const panel = document.createElement('div');
  const copy = document.createElement('p');
  const actions = document.createElement('div');
  const settingsButton = document.createElement('button');
  const status = document.createElement('span');
  const copyId = `bemke-consent-copy-${messageId}`;

  panel.className = `bemke-consent-panel bemke-consent-panel--${service}`;
  panel.dataset.bemkeConsentPanel = service;
  copy.className = 'bemke-consent-panel__copy';
  copy.id = copyId;
  copy.textContent =
    service === 'google-maps'
      ? 'Interaktywna mapa Google wymaga zgody na treści marketingowe.'
      : 'Odtwarzacz YouTube wymaga zgody na treści marketingowe.';

  actions.className = 'bemke-consent-panel__actions';
  settingsButton.className = 'bemke-consent-panel__button';
  settingsButton.type = 'button';
  settingsButton.textContent = 'Ustawienia prywatności';
  settingsButton.setAttribute('aria-describedby', copyId);

  status.className = 'bemke-consent-panel__status bemke-sr-only';
  status.setAttribute('aria-live', 'polite');

  settingsButton.addEventListener('click', () => {
    openPrivacySettings(status);
  });

  actions.append(settingsButton);

  if (service === 'google-maps') {
    const mapLink = document.createElement('a');
    mapLink.className = 'bemke-consent-panel__link';
    mapLink.href = 'https://maps.app.goo.gl/ejUvGMftTiDrTMt26';
    mapLink.target = '_blank';
    mapLink.rel = 'noopener noreferrer';
    mapLink.textContent = 'Otwórz trasę w Google Maps';
    actions.append(mapLink);
  }

  panel.append(copy, actions, status);

  return { panel, status };
}

function updateConsentPanel(root, panel) {
  const requiresConsent = hasCookiebot() && !hasMarketingConsent();

  root.classList.toggle('bemke-consent-required', requiresConsent);
  panel.hidden = !requiresConsent;
}

function initGoogleMap(map) {
  if (
    initializedMaps.has(map) ||
    !document.querySelector(GOOGLE_MAP_SCRIPT_SELECTOR)
  ) {
    return;
  }

  initializedMaps.add(map);
  map.classList.add('bemke-consent-embed', 'bemke-consent-embed--map');

  const { panel } = createConsentPanel('google-maps');
  map.append(panel);

  const update = () => {
    if (!panel.isConnected) {
      map.append(panel);
    }

    updateConsentPanel(map, panel);
  };
  COOKIEBOT_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, update);
  });
  update();
}

function normalizeYouTubeUrl(preview) {
  const source =
    preview.dataset.bemkeCookieblockIframeSrc || preview.dataset.iframeSrc;

  if (!source) {
    return '';
  }

  const normalizedSource = source
    .replace('https://www.youtube.com/embed/', 'https://www.youtube-nocookie.com/embed/')
    .replace('https://youtube.com/embed/', 'https://www.youtube-nocookie.com/embed/');

  preview.dataset.bemkeCookieblockIframeSrc = normalizedSource;

  return normalizedSource;
}

function initYouTubeVideo(root) {
  if (initializedVideos.has(root)) {
    return;
  }

  const preview = root.querySelector(YOUTUBE_PREVIEW_SELECTOR);
  if (!preview) {
    return;
  }

  initializedVideos.add(root);
  const source = normalizeYouTubeUrl(preview);
  if (!source) {
    return;
  }

  root.classList.add('bemke-consent-embed', 'bemke-consent-embed--youtube');

  const { panel, status } = createConsentPanel('youtube');
  root.append(panel);

  const guardPlayback = (event) => {
    if (!hasCookiebot() || hasMarketingConsent()) {
      return;
    }

    if (
      event.type === 'keydown' &&
      event.key !== 'Enter' &&
      event.key !== ' '
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openPrivacySettings(status);
  };

  root.addEventListener('click', guardPlayback, true);
  root.addEventListener('keydown', guardPlayback, true);

  const update = () => {
    const requiresConsent = hasCookiebot() && !hasMarketingConsent();

    if (requiresConsent) {
      delete preview.dataset.iframeSrc;
    } else {
      preview.dataset.iframeSrc = source;
    }

    updateConsentPanel(root, panel);
  };
  COOKIEBOT_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, update);
  });
  update();
}

function initConsentEmbeds() {
  document.querySelectorAll(GOOGLE_MAP_SELECTOR).forEach(initGoogleMap);
  document.querySelectorAll(YOUTUBE_ROOT_SELECTOR).forEach(initYouTubeVideo);
}

function syncConsentLifecycle() {
  if (!hasCookiebot()) {
    return;
  }

  const marketingConsent = hasMarketingConsent();

  // Cookiebot cannot undo requests made by an iframe or the Maps API in the
  // current document. Reload only when an already granted consent is revoked;
  // the next page load starts clean and the manual blockers apply again.
  if (previousMarketingConsent === true && marketingConsent === false) {
    window.location.reload();
    return;
  }

  previousMarketingConsent = marketingConsent;
}

function initConsentLifecycle() {
  if (consentLifecycleReady) {
    return;
  }

  consentLifecycleReady = true;
  COOKIEBOT_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, () => {
      window.setTimeout(syncConsentLifecycle, 0);
    });
  });
  syncConsentLifecycle();
}

export function initPrivacyConsentEmbeds() {
  initConsentLifecycle();
  initConsentEmbeds();
  document.addEventListener('bricks/ajax/end', initConsentEmbeds);
}
