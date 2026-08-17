import '../css/main.css';
import { initAccessibilitySwitches } from './modules/accessibility-switches.js';
import { initBackToTop } from './modules/back-to-top.js';
import { initContrastControls } from './modules/contrast-controls.js';
import { initFontSizeControls } from './modules/font-size-controls.js';
import { initMotionPreference } from './modules/motion-preference.js';
import { initNavigationAccessibility } from './modules/navigation-accessibility.js';

console.log('[Bemke] Test wdrożenia GitHub → produkcja: 2026-08-17');

const featureModules = [
  {
    name: 'desktop-navigation',
    media: '(min-width: 992px)',
    selector: '#brx-header #brxe-vhhhdt',
    load: () =>
      import('./modules/mega-menu.js').then(({ initMegaMenu }) =>
        initMegaMenu(),
      ),
  },
  {
    name: 'mobile-navigation',
    media: '(max-width: 991px)',
    selector:
      '#brx-header #brxe-vhhhdt .bricks-mobile-menu-wrapper',
    load: () =>
      import('./modules/mobile-menu.js').then(({ initMobileMenu }) =>
        initMobileMenu(),
      ),
  },
  {
    name: 'hero-intro',
    media: '(min-width: 768px)',
    selector: '.section_hero h1',
    load: async () => {
      const [{ initHeaderIntro }, { initHeroIntro }] = await Promise.all([
        import('./modules/header-intro.js'),
        import('./modules/hero-intro.js'),
      ]);

      // The header listens for events emitted by the hero intro.
      initHeaderIntro();
      initHeroIntro();
    },
  },
  {
    name: 'accordion-controls',
    selector: '.accordin-block',
    load: () =>
      import('./modules/accordion-controls.js').then(
        ({ initAccordionControls }) => initAccordionControls(),
      ),
  },
  {
    name: 'decorative-videos',
    selector: '.video video',
    load: () =>
      import('./modules/decorative-video-controls.js').then(
        ({ initDecorativeVideoControls }) => initDecorativeVideoControls(),
      ),
  },
  {
    name: 'thinktank-slider',
    selector: '.slider-thinktank',
    load: () =>
      import('./modules/thinktank-slider.js').then(
        ({ initThinktankSlider }) => initThinktankSlider(),
      ),
  },
  {
    name: 'home-slider',
    selector:
      '.slider:not(.slider-thinktank) > .slider-wrapper > .slide',
    load: () =>
      import('./modules/home-slider.js').then(({ initHomeSlider }) =>
        initHomeSlider(),
      ),
  },
  {
    name: 'project-slider',
    selector: '.slider-block > .slide-wrapper > .slide-project',
    load: () =>
      import('./modules/project-slider.js').then(
        ({ initProjectSlider }) => initProjectSlider(),
      ),
  },
  {
    name: 'text-loop-slider',
    selector:
      '.slider.slider-text-wrapper > .slider-text > .slide-item',
    load: () =>
      import('./modules/text-loop-slider.js').then(
        ({ initTextLoopSlider }) => initTextLoopSlider(),
      ),
  },
  {
    name: 'history-tabs',
    selector: '.tabs-block',
    load: () =>
      import('./modules/history-tabs.js').then(({ initHistoryTabs }) =>
        initHistoryTabs(),
      ),
  },
  {
    name: 'team-popups',
    selector: '.popup-team[data-number]',
    load: () =>
      import('./modules/team-popup.js').then(({ initTeamPopups }) =>
        initTeamPopups(),
      ),
  },
  {
    name: 'team-slider',
    selector:
      '.slider-block > .slider-wrapper [data-number]:not(.popup-team)',
    load: () =>
      import('./modules/team-slider.js').then(({ initTeamSlider }) =>
        initTeamSlider(),
      ),
  },
  {
    name: 'infinity-loop',
    selector: '.infinity-loop-block',
    load: () =>
      import('./modules/infinity-loop.js').then(({ initInfinityLoop }) =>
        initInfinityLoop(),
      ),
  },
  {
    name: 'image-up-reveal',
    selector: '[img-up]',
    load: () =>
      import('./modules/image-up-reveal.js').then(
        ({ initImageUpReveal }) => initImageUpReveal(),
      ),
  },
  {
    name: 'scroll-expand-images',
    selector: '.img-scroll-expand',
    load: () =>
      import('./modules/scroll-expand-images.js').then(
        ({ initScrollExpandImages }) => initScrollExpandImages(),
      ),
  },
  {
    name: 'sticky-images',
    media: '(min-width: 992px)',
    selector: '.sticky-wrapper > .sticky',
    load: () =>
      import('./modules/sticky-images.js').then(({ initStickyImages }) =>
        initStickyImages(),
      ),
  },
  {
    name: 'number-counters',
    selector: '.number-counter',
    load: () =>
      import('./modules/number-counter.js').then(
        ({ initNumberCounters }) => initNumberCounters(),
      ),
  },
  {
    name: 'founders-campaign',
    selector: '.section_book-money .loading-wrapper',
    load: () =>
      import('./modules/founders-campaign-progress.js').then(
        ({ initFoundersCampaignProgress }) =>
          initFoundersCampaignProgress(),
      ),
  },
  {
    name: 'campus-map',
    selector: '.map-desktop, .map-mobile',
    load: () =>
      import('./modules/campus-map.js').then(({ initCampusMap }) =>
        initCampusMap(),
      ),
  },
  {
    name: 'privacy-embeds',
    selector: '.brxe-map[data-bricks-map-options], .video-yt',
    load: () =>
      import('./modules/consent-embeds.js').then(
        ({ initPrivacyConsentEmbeds }) => initPrivacyConsentEmbeds(),
      ),
  },
  {
    name: 'form-accessibility',
    selector: '.brxe-form',
    load: () =>
      import('./modules/form-aria-references.js').then(
        ({ initFormAriaReferences }) => initFormAriaReferences(),
      ),
  },
  {
    name: 'pdf-link-labels',
    selector: 'a[href$=".pdf"], a[href*=".pdf?"]',
    load: () =>
      import('./modules/pdf-link-labels.js').then(
        ({ initPdfLinkLabels }) => initPdfLinkLabels(),
      ),
  },
  {
    name: 'social-link-labels',
    selector:
      'a[href*="instagram.com"], a[href*="facebook.com"], a[href*="linkedin.com"]',
    load: () =>
      import('./modules/social-link-labels.js').then(
        ({ initSocialLinkLabels }) => initSocialLinkLabels(),
      ),
  },
  {
    name: 'linkedin-post-numbers',
    selector: '#brxe-ejpmtj .linkdin-number',
    load: () =>
      import('./modules/linkedin-post-numbers.js').then(
        ({ initLinkedinPostNumbers }) => initLinkedinPostNumbers(),
      ),
  },
  {
    name: 'offer-block-hover',
    selector:
      '.offer-block, .linkedin-block, .donors-block, .link-block',
    load: () =>
      import('./modules/offer-block-hover.js').then(
        ({ initOfferBlockHover }) => initOfferBlockHover(),
      ),
  },
  {
    name: 'linked-cards',
    selector: '.steam-block a.btn, .card a.btn, .area-block a.btn',
    load: () =>
      import('./modules/linked-cards.js').then(({ initLinkedCards }) =>
        initLinkedCards(),
      ),
  },
  {
    name: 'card-image-hover',
    selector: '.card, .steam-block, .area-block',
    load: () =>
      import('./modules/card-image-hover.js').then(
        ({ initCardImageHover }) => initCardImageHover(),
      ),
  },
  {
    name: 'numbered-card-positions',
    selector: '.card',
    load: () =>
      import('./modules/numbered-card-positions.js').then(
        ({ initNumberedCardPositions }) => initNumberedCardPositions(),
      ),
  },
  {
    name: 'bemke-explore-card-scroll',
    selector: '.card',
    predicate: () =>
      window.location.pathname
        .split('/')
        .filter(Boolean)
        .includes('bemke-explore'),
    load: () =>
      import('./modules/bemke-explore-card-scroll.js').then(
        ({ initBemkeExploreCardScroll }) => initBemkeExploreCardScroll(),
      ),
  },
  {
    name: 'horizontal-scroll-gutters',
    media: '(max-width: 767px)',
    selector: 'main',
    load: () =>
      import('./modules/horizontal-scroll-gutters.js').then(
        ({ initHorizontalScrollGutters }) =>
          initHorizontalScrollGutters(),
      ),
  },
  {
    name: 'current-page-links',
    selector: 'a[aria-current="page"], a[href*="#"]',
    load: () =>
      import('./modules/current-page-links.js').then(
        ({ initCurrentPageLinks }) => initCurrentPageLinks(),
      ),
  },
  {
    name: 'page-info-hover',
    selector: '.page-info',
    load: () =>
      import('./modules/page-info-hover.js').then(
        ({ initPageInfoHover }) => initPageInfoHover(),
      ),
  },
  {
    name: 'slide-title-contrast-fix',
    selector: '.slide-tittle',
    predicate: () =>
      window.location.pathname.replace(/\/+$/, '') === '/o-nas',
    load: () =>
      import('./modules/slide-tittle-contrast-fix.js').then(
        ({ initSlideTittleContrastFix }) => initSlideTittleContrastFix(),
      ),
  },
];

featureModules.forEach((feature) => {
  feature.loaded = false;
  feature.loading = null;
  feature.mediaQuery = feature.media
    ? window.matchMedia(feature.media)
    : null;
});

function featureMatches(feature) {
  if (feature.loaded || feature.loading) {
    return false;
  }

  if (feature.mediaQuery && !feature.mediaQuery.matches) {
    return false;
  }

  if (feature.predicate && !feature.predicate()) {
    return false;
  }

  return Boolean(document.querySelector(feature.selector));
}

function loadFeature(feature) {
  if (!featureMatches(feature)) {
    return;
  }

  feature.loading = feature
    .load()
    .then(() => {
      feature.loaded = true;
    })
    .catch((error) => {
      // Keep the rest of the site operational if a single optional chunk fails.
      console.error(`[Bemke] Nie udało się uruchomić: ${feature.name}`, error);
    })
    .finally(() => {
      feature.loading = null;
    });
}

function scanFeatureModules() {
  featureModules.forEach(loadFeature);
}

function initApp() {
  initMotionPreference();
  initAccessibilitySwitches();
  initContrastControls();
  initFontSizeControls();
  initNavigationAccessibility();
  initBackToTop();
  scanFeatureModules();

  document.addEventListener('bricks/ajax/end', scanFeatureModules);
  window.addEventListener('load', scanFeatureModules, { once: true });

  featureModules.forEach((feature) => {
    feature.mediaQuery?.addEventListener('change', scanFeatureModules);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp, { once: true });
} else {
  initApp();
}
