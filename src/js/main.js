import '../css/main.css';
import { initThinktankSlider } from './modules/thinktank-slider.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThinktankSlider);
} else {
  initThinktankSlider();
}
