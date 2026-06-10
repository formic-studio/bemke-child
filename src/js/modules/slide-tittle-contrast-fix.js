const TARGET_SLIDE_TITLE_SELECTOR = '.slide-tittle';

export function initSlideTittleContrastFix() {
  const pathname = window.location.pathname.replace(/\/+$/, '');
  const pagePath = pathname === '' ? '/' : pathname;

  if (pagePath !== '/o-nas') {
    return;
  }

  const applyFix = () => {
    const isHighContrast = document.documentElement.matches(
      'html[data-contrast]:not([data-contrast="default"])',
    );
    const fixedColor = isHighContrast ? 'var(--a11y-text)' : '#fff';

    document.querySelectorAll(TARGET_SLIDE_TITLE_SELECTOR).forEach((el) => {
      el.style.setProperty('color', fixedColor, 'important');
      el.style.setProperty('-webkit-text-fill-color', fixedColor, 'important');
    });
  };

  const initObserver = () => {
    if (!window.MutationObserver) {
      return;
    }

    let rafId = 0;

    const queueFix = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        rafId = 0;
        applyFix();
      });
    };

    const observer = new MutationObserver(() => {
      queueFix();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  };

  applyFix();
  initObserver();
  window.addEventListener('load', applyFix);
}
