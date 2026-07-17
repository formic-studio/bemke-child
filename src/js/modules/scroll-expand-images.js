import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from "./motion-preference.js";

const IMAGE_SELECTOR = ".img-scroll-expand";
const COMPLETE_ATTR = "data-bemke-scroll-expand-complete";
const INITIAL_IMAGE_WIDTH = 300;
const SCROLL_START = "center bottom";
const SCROLL_END = "center top";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function restoreInlineStyle(image, originalStyle) {
  if (originalStyle === null) {
    image.removeAttribute("style");
    return;
  }

  image.setAttribute("style", originalStyle);
}

function prepareImageLayout(image, originalStyle) {
  restoreInlineStyle(image, originalStyle);

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

  return { startScale };
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

function createScrollAnimation(image) {
  const originalStyle = image.getAttribute("style");
  const metrics = { startScale: 1 };

  const prepare = () => {
    if (
      isReducedMotion() ||
      image.getAttribute(COMPLETE_ATTR) === "1"
    ) {
      return;
    }

    metrics.startScale = prepareImageLayout(image, originalStyle).startScale;
  };

  const enableTransformRendering = () => {
    gsap.set(image, { willChange: "transform" });
  };

  const disableTransformRendering = () => {
    gsap.set(image, { clearProps: "willChange" });
  };

  prepare();

  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "none" },
  });

  timeline
    .fromTo(
      image,
      {
        scale: () => metrics.startScale,
      },
      {
        scale: 1,
        duration: 0.5,
        force3D: true,
        immediateRender: true,
      },
    )
    .to(image, {
      scale: () => metrics.startScale,
      duration: 0.5,
      force3D: true,
    });

  const trigger = ScrollTrigger.create({
    trigger: image.parentElement ?? image,
    animation: timeline,
    start: SCROLL_START,
    end: SCROLL_END,
    scrub: true,
    invalidateOnRefresh: true,
    onRefreshInit: prepare,
    onEnter: enableTransformRendering,
    onEnterBack: enableTransformRendering,
    onLeave: disableTransformRendering,
    onLeaveBack: disableTransformRendering,
  });

  return { image, timeline, trigger };
}

export function initScrollExpandImages() {
  const images = gsap.utils.toArray(IMAGE_SELECTOR);

  if (!images.length) return;

  gsap.registerPlugin(ScrollTrigger);

  if (isReducedMotion()) {
    images.forEach(showImageWithoutMotion);
    return;
  }

  const imageAnimations = images.map(createScrollAnimation);

  if (document.readyState !== "complete") {
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }

  document.addEventListener(MOTION_CHANGE_EVENT, (event) => {
    if (!event.detail?.reduced) return;

    imageAnimations.forEach(({ image, timeline, trigger }) => {
      trigger.kill();
      timeline.kill();
      showImageWithoutMotion(image);
    });
  });
}
