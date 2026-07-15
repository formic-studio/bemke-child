import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const IMAGE_SELECTOR = ".img-scroll-expand";
const ANIMATION_START = "top 95%";
const ANIMATION_END = "top 40%";
const SCRUB_SMOOTHING = 0.8;

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
    gsap.to(image, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: image,
        start: ANIMATION_START,
        end: ANIMATION_END,
        scrub: SCRUB_SMOOTHING,
        invalidateOnRefresh: true,
      },
    });
  });

  if (document.readyState !== "complete") {
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }
}
