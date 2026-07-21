import { isReducedMotion } from './motion-preference.js';

const BUTTON_CLASS = 'bemke-back-to-top';
const VISIBLE_CLASS = 'is-visible';
const INVERTED_CLASS = 'is-inverted';
const WINE_RGB = [80, 24, 25];

export function initBackToTop() {
  if (!document.body || document.querySelector(`.${BUTTON_CLASS}`)) {
    return;
  }

  const button = document.createElement('button');
  let animationFrame = null;

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
    const isVisible = window.scrollY >= viewportHeight;

    button.classList.toggle(VISIBLE_CLASS, isVisible);
    button.classList.toggle(
      INVERTED_CLASS,
      isVisible && isOverWineSurface(button),
    );
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
    window.scrollTo({
      behavior: isReducedMotion() ? 'auto' : 'smooth',
      left: 0,
      top: 0,
    });
  });

  document.body.appendChild(button);
  updateVisibility();

  window.addEventListener('scroll', scheduleVisibilityUpdate, {
    passive: true,
  });
  window.addEventListener('resize', scheduleVisibilityUpdate);
}

function isOverWineSurface(button) {
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const elements = document.elementsFromPoint(centerX, centerY);

  for (const element of elements) {
    if (element === button || button.contains(element)) {
      continue;
    }

    const color = parseRgb(window.getComputedStyle(element).backgroundColor);

    if (!color || color.alpha <= 0.05) {
      continue;
    }

    return WINE_RGB.every(
      (channel, index) => Math.abs(channel - color.channels[index]) <= 2,
    );
  }

  return false;
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
