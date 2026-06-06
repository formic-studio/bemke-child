import '../css/main.css';
import { initAccordionControls } from './modules/accordion-controls.js';
import { initDecorativeVideoControls } from './modules/decorative-video-controls.js';
import { initThinktankSlider } from './modules/thinktank-slider.js';
import { initContrastControls } from './modules/contrast-controls.js';
import { initFontSizeControls } from './modules/font-size-controls.js';
import { initOfferBlockHover } from './modules/offer-block-hover.js';
import { initHomeSlider } from './modules/home-slider.js';
import { initProjectSlider } from './modules/project-slider.js';

function initApp() {
  initAccordionControls();
  initDecorativeVideoControls();
  initThinktankSlider();
  initContrastControls();
  initFontSizeControls();
  initOfferBlockHover();
  initHomeSlider();
  initProjectSlider();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
