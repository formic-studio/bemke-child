import '../css/main.css';
import { gsap } from 'gsap';

function animateQuickReveal() {
  const target = document.querySelector('#brxe-ejlymw');
  if (!target) {
    return;
  }

  const lines = target.querySelectorAll('h1, h2, h3, h4, p, span, li');

  if (lines.length > 0) {
    gsap.fromTo(
      lines,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power2.out',
        clearProps: 'opacity,visibility,transform',
      }
    );
    return;
  }

  gsap.fromTo(
    target,
    { autoAlpha: 0, y: 18 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
      clearProps: 'opacity,visibility,transform',
    }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  animateQuickReveal();
});
