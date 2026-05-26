import '../css/main.css';
import { initThinktankSlider } from './modules/thinktank-slider.js';
import { initFontSizeControls } from './modules/font-size-controls.js';

function initApp() {
  initThinktankSlider();
  initFontSizeControls();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
