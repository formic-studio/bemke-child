import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const IMAGE_SELECTOR = ".img-scroll-expand";
const INITIAL_IMAGE_WIDTH = 300;
const ANIMATION_START = "top 90%";
const ANIMATION_DURATION = 1.6;
const ANIMATION_EASE = "power2.inOut";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function prepareImageLayout(image) {
  const initialRect = image.getBoundingClientRect();
  const initialWidth = Math.min(INITIAL_IMAGE_WIDTH, initialRect.width);
  const initialHeight = initialRect.height;
  const initialLeft = initialRect.left;
  const initialTop = initialRect.top;

  gsap.set(image, {
    width: "100%",
    scale: 1,
    force3D: true,
  });

  const expandedRect = image.getBoundingClientRect();
  const startScale = expandedRect.width
    ? clamp(initialWidth / expandedRect.width, 0, 1)
    : 1;
  const horizontalSpace = Math.max(expandedRect.width - initialWidth, 0);
  const verticalSpace = Math.max(expandedRect.height - initialHeight, 0);
  const originX = horizontalSpace
    ? clamp((initialLeft - expandedRect.left) / horizontalSpace, 0, 1) * 100
    : 50;
  const originY = verticalSpace
    ? clamp((initialTop - expandedRect.top) / verticalSpace, 0, 1) * 100
    : 0;

  gsap.set(image, {
    scale: startScale,
    transformOrigin: `${originX}% ${originY}%`,
    force3D: true,
  });
}

export function initScrollExpandImages() {
  const images = gsap.utils.toArray(IMAGE_SELECTOR);

  if (!images.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    gsap.set(images, { width: "100%", scale: 1 });
    return;
  }

  images.forEach((image) => {
    let hasStarted = false;

    prepareImageLayout(image);

    ScrollTrigger.create({
      trigger: image.parentElement ?? image,
      start: ANIMATION_START,
      once: true,
      onRefresh: () => {
        if (!hasStarted) prepareImageLayout(image);
      },
      onEnter: () => {
        hasStarted = true;

        gsap.to(image, {
          scale: 1,
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
