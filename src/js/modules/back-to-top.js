import { isReducedMotion } from './motion-preference.js';

const BUTTON_CLASS = 'bemke-back-to-top';
const VISIBLE_CLASS = 'is-visible';

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
      <rect x="0.250002" y="41.75" width="41.5" height="41.5" rx="20.75" transform="rotate(-90 0.250002 41.75)" fill="#501819"/>
      <rect x="0.250002" y="41.75" width="41.5" height="41.5" rx="20.75" transform="rotate(-90 0.250002 41.75)" stroke="#1B0508" stroke-width="0.5"/>
      <path d="M28.0711 22.9998L21 15.9287L13.9289 22.9998" stroke="#F6BA62" stroke-width="2"/>
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
