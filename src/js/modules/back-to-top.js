import { isReducedMotion } from './motion-preference.js';

const BUTTON_CLASS = 'bemke-back-to-top';
const VISIBLE_CLASS = 'is-visible';
const DARK_SURFACE_CLASS = 'is-on-dark-surface';
const DARK_LUMINANCE_THRESHOLD = 0.21;

export function initBackToTop() {
  if (!document.body || document.querySelector(`.${BUTTON_CLASS}`)) {
    return;
  }

  const button = document.createElement('button');
  let animationFrame = null;
  let scrollToTopFrame = null;

  button.className = BUTTON_CLASS;
  button.type = 'button';
  button.tabIndex = -1;
  button.setAttribute('aria-hidden', 'true');
  button.setAttribute('aria-label', 'Wróć na górę strony');
  button.innerHTML = `
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <rect class="bemke-back-to-top__surface" x="0.250002" y="41.75" width="41.5" height="41.5" rx="20.75" transform="rotate(-90 0.250002 41.75)"/>
      <rect class="bemke-back-to-top__border" x="0.250002" y="41.75" width="41.5" height="41.5" rx="20.75" transform="rotate(-90 0.250002 41.75)" stroke-width="0.5"/>
      <path class="bemke-back-to-top__arrow" d="M28.0711 22.9998L21 15.9287L13.9289 22.9998" stroke-width="2"/>
    </svg>
  `;

  const updateVisibility = () => {
    animationFrame = null;

    const viewportHeight = Math.max(
      1,
      window.innerHeight || document.documentElement.clientHeight,
    );
    const isVisible = getScrollTop() >= viewportHeight;
    const surfaceColor = isVisible ? getSurfaceColor(button) : null;

    button.classList.toggle(VISIBLE_CLASS, isVisible);
    button.classList.toggle(
      DARK_SURFACE_CLASS,
      Boolean(
        surfaceColor &&
          getRelativeLuminance(surfaceColor.channels) <
            DARK_LUMINANCE_THRESHOLD,
      ),
    );

    if (surfaceColor) {
      button.style.setProperty(
        '--bemke-back-to-top-underlay',
        surfaceColor.css,
      );
    } else {
      button.style.removeProperty('--bemke-back-to-top-underlay');
    }

    button.tabIndex = isVisible ? 0 : -1;
    button.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
  };

  const scheduleVisibilityUpdate = () => {
    if (animationFrame !== null) {
      return;
    }

    animationFrame = window.requestAnimationFrame(updateVisibility);
  };

  button.addEventListener('click', () => {
    const reducedMotion = isReducedMotion();
    const monitorStartedAt = window.performance.now();

    window.scrollTo({
      behavior: reducedMotion ? 'auto' : 'smooth',
      left: 0,
      top: 0,
    });

    if (scrollToTopFrame !== null) {
      window.cancelAnimationFrame(scrollToTopFrame);
    }

    const monitorScrollToTop = (timestamp) => {
      updateVisibility();

      if (
        getScrollTop() <= 1 ||
        timestamp - monitorStartedAt >= 3000
      ) {
        scrollToTopFrame = null;
        return;
      }

      scrollToTopFrame = window.requestAnimationFrame(monitorScrollToTop);
    };

    scrollToTopFrame = window.requestAnimationFrame(monitorScrollToTop);
  });

  document.body.appendChild(button);
  updateVisibility();

  window.addEventListener('scroll', scheduleVisibilityUpdate, {
    passive: true,
  });
  window.addEventListener('resize', scheduleVisibilityUpdate);
}

function getScrollTop() {
  const scrollingElement = document.scrollingElement;

  return Math.max(
    0,
    scrollingElement?.scrollTop ?? window.scrollY ?? window.pageYOffset ?? 0,
  );
}

function getSurfaceColor(button) {
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const elements = document.elementsFromPoint(centerX, centerY);
  const layers = [];

  for (const element of elements) {
    if (element === button || button.contains(element)) {
      continue;
    }

    const color = parseRgb(window.getComputedStyle(element).backgroundColor);

    if (!color || color.alpha <= 0.05) {
      continue;
    }

    layers.push(color);

    if (color.alpha >= 0.99) {
      break;
    }
  }

  if (!layers.length) {
    return null;
  }

  let channels = [255, 255, 255];

  for (let index = layers.length - 1; index >= 0; index -= 1) {
    const layer = layers[index];
    channels = layer.channels.map(
      (channel, channelIndex) =>
        channel * layer.alpha + channels[channelIndex] * (1 - layer.alpha),
    );
  }

  const roundedChannels = channels.map(Math.round);

  return {
    channels: roundedChannels,
    css: `rgb(${roundedChannels.join(' ')})`,
  };
}

function parseRgb(value) {
  const values = value.match(/[\d.]+/g)?.map(Number);

  if (!values || values.length < 3) {
    return null;
  }

  return {
    alpha: values.length > 3 ? values[3] : 1,
    channels: values.slice(0, 3),
  };
}

function getRelativeLuminance(channels) {
  const [red, green, blue] = channels.map((channel) => {
    const normalized = channel / 255;

    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}
