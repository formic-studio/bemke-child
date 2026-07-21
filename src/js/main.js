import '../css/main.css';
import { initAccordionControls } from './modules/accordion-controls.js';
import { initDecorativeVideoControls } from './modules/decorative-video-controls.js';
import { initThinktankSlider } from './modules/thinktank-slider.js';
import { initContrastControls } from './modules/contrast-controls.js';
import { initFontSizeControls } from './modules/font-size-controls.js';
import { initOfferBlockHover } from './modules/offer-block-hover.js';
import { initHomeSlider } from './modules/home-slider.js';
import { initProjectSlider } from './modules/project-slider.js';
import { initTextLoopSlider } from './modules/text-loop-slider.js';
import { initHistoryTabs } from './modules/history-tabs.js';
import { initMegaMenu } from './modules/mega-menu.js';
import { initFormAriaReferences } from './modules/form-aria-references.js';
import { initPdfLinkLabels } from './modules/pdf-link-labels.js';
import { initSocialLinkLabels } from './modules/social-link-labels.js';
import { initLinkedinPostNumbers } from './modules/linkedin-post-numbers.js';
import { initTeamPopups } from './modules/team-popup.js';
import { initSlideTittleContrastFix } from './modules/slide-tittle-contrast-fix.js';
import { initCurrentPageLinks } from './modules/current-page-links.js';
import { initPageInfoHover } from './modules/page-info-hover.js';
import { initInfinityLoop } from './modules/infinity-loop.js';
import { initMobileMenu } from './modules/mobile-menu.js';
import { initScrollExpandImages } from './modules/scroll-expand-images.js';
import { initStickyImages } from './modules/sticky-images.js';
import { initNumberCounters } from './modules/number-counter.js';
import { initCardImageHover } from './modules/card-image-hover.js';
import { initBemkeExploreCardScroll } from './modules/bemke-explore-card-scroll.js';
import { initHorizontalScrollGutters } from './modules/horizontal-scroll-gutters.js';
import { initAccessibilitySwitches } from './modules/accessibility-switches.js';
import { initMotionPreference } from './modules/motion-preference.js';
import { initHeroIntro } from './modules/hero-intro.js';
import { initHeaderIntro } from './modules/header-intro.js';
import { initCampusMap } from './modules/campus-map.js';
import { initBackToTop } from './modules/back-to-top.js';

function initApp() {
  initMotionPreference();
  initAccessibilitySwitches();
  initMegaMenu();
  initMobileMenu();
  initHeaderIntro();
  initBackToTop();
  initCampusMap();
  initHeroIntro();
  initAccordionControls();
  initDecorativeVideoControls();
  initThinktankSlider();
  initContrastControls();
  initFontSizeControls();
  initOfferBlockHover();
  initHomeSlider();
  initProjectSlider();
  initTextLoopSlider();
  initHistoryTabs();
  initFormAriaReferences();
  initPdfLinkLabels();
  initSocialLinkLabels();
  initLinkedinPostNumbers();
  initTeamPopups();
  initSlideTittleContrastFix();
  initCurrentPageLinks();
  initPageInfoHover();
  initInfinityLoop();
  initScrollExpandImages();
  initStickyImages();
  initNumberCounters();
  initCardImageHover();
  initBemkeExploreCardScroll();
  initHorizontalScrollGutters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
