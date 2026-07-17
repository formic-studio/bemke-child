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
const GROW_DURATION = 0.45;
const FULL_SIZE_DURATION = 0.1;
const SHRINK_DURATION = 0.45;

function restoreInlineStyle(image, originalStyle) {
  if (originalStyle === null) {
    image.removeAttribute("style");
    return;
  }

  image.setAttribute("style", originalStyle);
}

function measureImageWidths(image, originalStyle) {
  restoreInlineStyle(image, originalStyle);

  const initialRect = image.getBoundingClientRect();
  const initialWidth = Math.min(INITIAL_IMAGE_WIDTH, initialRect.width);

  gsap.set(image, {
    width: "100%",
  });

  const expandedRect = image.getBoundingClientRect();
  const expandedWidth = Math.max(expandedRect.width, initialWidth);

  restoreInlineStyle(image, originalStyle);
  gsap.set(image, {
    width: initialWidth,
  });

  return { initialWidth, expandedWidth };
}

function showImageWithoutMotion(image) {
  image.setAttribute(COMPLETE_ATTR, "1");
  gsap.killTweensOf(image);
  gsap.set(image, {
    width: "100%",
  });
  gsap.set(image, {
    clearProps: "transform,transformOrigin,willChange",
  });
}

function createScrollAnimation(image) {
  const originalStyle = image.getAttribute("style");
  const metrics = {
    initialWidth: INITIAL_IMAGE_WIDTH,
    expandedWidth: INITIAL_IMAGE_WIDTH,
  };

  const prepare = () => {
    if (
      isReducedMotion() ||
      image.getAttribute(COMPLETE_ATTR) === "1"
    ) {
      return;
    }

    Object.assign(metrics, measureImageWidths(image, originalStyle));
  };

  const enableWidthRendering = () => {
    gsap.set(image, { willChange: "width" });
  };

  const disableWidthRendering = () => {
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
        width: () => metrics.initialWidth,
      },
      {
        width: () => metrics.expandedWidth,
        duration: GROW_DURATION,
        immediateRender: true,
      },
    )
    .to(image, {
      width: () => metrics.expandedWidth,
      duration: FULL_SIZE_DURATION,
    })
    .to(image, {
      width: () => metrics.initialWidth,
      duration: SHRINK_DURATION,
    });

  const trigger = ScrollTrigger.create({
    trigger: image.parentElement ?? image,
    animation: timeline,
    start: SCROLL_START,
    end: SCROLL_END,
    scrub: true,
    invalidateOnRefresh: true,
    onRefreshInit: prepare,
    onEnter: enableWidthRendering,
    onEnterBack: enableWidthRendering,
    onLeave: disableWidthRendering,
    onLeaveBack: disableWidthRendering,
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
