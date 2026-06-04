import '../css/main.css';
import { initAccordionControls } from './modules/accordion-controls.js';
import { initThinktankSlider } from './modules/thinktank-slider.js';
import { initContrastControls } from './modules/contrast-controls.js';
import { initFontSizeControls } from './modules/font-size-controls.js';

function initApp() {
  initAccordionControls();
  initThinktankSlider();
  initContrastControls();
  initFontSizeControls();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
