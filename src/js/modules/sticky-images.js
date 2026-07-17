import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from "./motion-preference.js";

const WRAPPER_SELECTOR = ".sticky-wrapper";
const STICKY_SELECTOR = ".sticky";
const SECTION_SELECTOR = ".brxe-section";
const MOBILE_QUERY = "(max-width: 767px)";

function restoreInlineStyle(element, originalStyle) {
  if (originalStyle === null) {
    element.removeAttribute("style");
    return;
  }

  element.setAttribute("style", originalStyle);
}

export function initStickyImages() {
  const wrappers = gsap.utils.toArray(WRAPPER_SELECTOR);

  if (!wrappers.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  let stickyTriggers = [];
  const mobileLayerStyles = new Map();

  const prepareMobileLayers = (image, section, nextSection) => {
    [image, section, nextSection].forEach((element) => {
      if (!mobileLayerStyles.has(element)) {
        mobileLayerStyles.set(element, element.getAttribute("style"));
      }
    });

    section.style.position = "relative";
    section.style.zIndex = "0";
    section.style.isolation = "isolate";

    image.style.zIndex = "0";

    nextSection.style.position = "relative";
    nextSection.style.zIndex = "10";
    nextSection.style.isolation = "isolate";
    nextSection.style.transform = "translateZ(0)";
  };

  const restoreMobileLayers = () => {
    mobileLayerStyles.forEach((originalStyle, element) => {
      restoreInlineStyle(element, originalStyle);
    });
    mobileLayerStyles.clear();
  };

  const stopSticky = () => {
    stickyTriggers.forEach((trigger) => trigger.kill());
    stickyTriggers = [];
    restoreMobileLayers();
  };

  const startSticky = () => {
    if (stickyTriggers.length || isReducedMotion()) return;

    stickyTriggers = wrappers.flatMap((wrapper) => {
      const image = wrapper.querySelector(`:scope > ${STICKY_SELECTOR}`);
      const section = wrapper.closest(SECTION_SELECTOR);
      const nextSection = section?.nextElementSibling;

      if (!image || !nextSection?.matches(SECTION_SELECTOR)) {
        return [];
      }

      if (mobileQuery.matches) {
        prepareMobileLayers(image, section, nextSection);
      }

      return [
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          endTrigger: nextSection,
          end: "top top",
          pin: image,
          pinSpacing: false,
          pinType: mobileQuery.matches ? "transform" : "fixed",
          anticipatePin: mobileQuery.matches ? 0 : 1,
          invalidateOnRefresh: true,
        }),
      ];
    });

    if (stickyTriggers.length) {
      ScrollTrigger.refresh();
    }
  };

  const syncSticky = () => {
    if (isReducedMotion()) {
      stopSticky();
      return;
    }

    startSticky();
  };

  syncSticky();

  if (document.readyState !== "complete") {
    window.addEventListener(
      "load",
      () => {
        if (stickyTriggers.length) {
          ScrollTrigger.refresh();
        }
      },
      { once: true },
    );
  }

  document.addEventListener(MOTION_CHANGE_EVENT, syncSticky);

  const rebuildSticky = () => {
    stopSticky();
    syncSticky();
  };

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", rebuildSticky);
  } else if (typeof mobileQuery.addListener === "function") {
    mobileQuery.addListener(rebuildSticky);
  }
}
