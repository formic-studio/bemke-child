import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from "./motion-preference.js";

const IMAGE_SELECTOR = ".img-scroll-expand";
const COMPLETE_ATTR = "data-bemke-scroll-expand-complete";
const INITIAL_IMAGE_WIDTH = 300;
const ANIMATION_START = "top 90%";
const ANIMATION_DURATION = 1.4;
const ANIMATION_EASE = "power1.inOut";

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
  });
}

function showImageWithoutMotion(image) {
  image.setAttribute(COMPLETE_ATTR, "1");
  gsap.killTweensOf(image);
  gsap.set(image, {
    scale: 1,
    width: "100%",
  });
  gsap.set(image, {
    clearProps: "transform,transformOrigin,willChange",
  });
}

export function initScrollExpandImages() {
  const images = gsap.utils.toArray(IMAGE_SELECTOR);

  if (!images.length) return;

  gsap.registerPlugin(ScrollTrigger);

  if (isReducedMotion()) {
    images.forEach(showImageWithoutMotion);
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
        if (!hasStarted && image.getAttribute(COMPLETE_ATTR) !== "1") {
          prepareImageLayout(image);
        }
      },
      onEnter: () => {
        if (isReducedMotion() || image.getAttribute(COMPLETE_ATTR) === "1") {
          showImageWithoutMotion(image);
          return;
        }

        hasStarted = true;

        gsap.set(image, { willChange: "transform" });

        requestAnimationFrame(() => {
          gsap.to(image, {
            scale: 1,
            duration: ANIMATION_DURATION,
            ease: ANIMATION_EASE,
            force3D: true,
            overwrite: "auto",
            onComplete: () => {
              gsap.set(image, {
                clearProps: "transform,transformOrigin,willChange",
              });
            },
          });
        });
      },
    });
  });

  if (document.readyState !== "complete") {
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }

  document.addEventListener(MOTION_CHANGE_EVENT, (event) => {
    if (event.detail?.reduced) {
      images.forEach(showImageWithoutMotion);
    }
  });
}
