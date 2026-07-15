import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const IMAGE_SELECTOR = ".img-scroll-expand";
const ANIMATION_START = "top 95%";
const ANIMATION_DURATION = 1.2;
const ANIMATION_EASE = "power2.inOut";

export function initScrollExpandImages() {
  const images = gsap.utils.toArray(IMAGE_SELECTOR);

  if (!images.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    gsap.set(images, { width: "100%" });
    return;
  }

  images.forEach((image) => {
    gsap.set(image, { width: "300px" });

    ScrollTrigger.create({
      trigger: image,
      start: ANIMATION_START,
      once: true,
      onEnter: () => {
        gsap.to(image, {
          width: "100%",
          duration: ANIMATION_DURATION,
          ease: ANIMATION_EASE,
          overwrite: "auto",
        });
      },
    });
  });

  if (document.readyState !== "complete") {
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }
}
