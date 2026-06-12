import '../css/main.css';
import { initAccordionControls } from './modules/accordion-controls.js';
import { initDecorativeVideoControls } from './modules/decorative-video-controls.js';
import { initThinktankSlider } from './modules/thinktank-slider.js';
import { initContrastControls } from './modules/contrast-controls.js';
import { initFontSizeControls } from './modules/font-size-controls.js';
import { initOfferBlockHover } from './modules/offer-block-hover.js';
import { initHomeSlider } from './modules/home-slider.js';
import { initProjectSlider } from './modules/project-slider.js';
import { initHistoryTabs } from './modules/history-tabs.js';
import { initMegaMenu } from './modules/mega-menu.js';
import { initFormAriaReferences } from './modules/form-aria-references.js';
import { initPdfLinkLabels } from './modules/pdf-link-labels.js';
import { initLinkedinPostNumbers } from './modules/linkedin-post-numbers.js';
import { initTeamPopups } from './modules/team-popup.js';
import { initSlideTittleContrastFix } from './modules/slide-tittle-contrast-fix.js';
import { initCurrentPageLinks } from './modules/current-page-links.js';

function initApp() {
  initAccordionControls();
  initDecorativeVideoControls();
  initThinktankSlider();
  initContrastControls();
  initFontSizeControls();
  initOfferBlockHover();
  initHomeSlider();
  initProjectSlider();
  initHistoryTabs();
  initMegaMenu();
  initFormAriaReferences();
  initPdfLinkLabels();
  initLinkedinPostNumbers();
  initTeamPopups();
  initSlideTittleContrastFix();
  initCurrentPageLinks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
