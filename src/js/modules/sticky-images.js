import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from "./motion-preference.js";
import { FONT_SCALE_CHANGE_EVENT } from "./font-size-controls.js";

const WRAPPER_SELECTOR = ".sticky-wrapper";
const STICKY_SELECTOR = ".sticky";
const SECTION_SELECTOR = ".brxe-section";
const DESKTOP_QUERY = "(min-width: 992px)";

export function initStickyImages() {
  const wrappers = gsap.utils.toArray(WRAPPER_SELECTOR);

  if (!wrappers.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  let stickyTriggers = [];
  let refreshFrame = null;

  const stopSticky = () => {
    stickyTriggers.forEach((trigger) => trigger.kill());
    stickyTriggers = [];
  };

  const startSticky = () => {
    if (
      stickyTriggers.length ||
      !desktopQuery.matches ||
      isReducedMotion()
    ) {
      return;
    }

    stickyTriggers = wrappers.flatMap((wrapper) => {
      const image = wrapper.querySelector(`:scope > ${STICKY_SELECTOR}`);
      const section = wrapper.closest(SECTION_SELECTOR);
      const nextSection = section?.nextElementSibling;

      if (!image || !nextSection?.matches(SECTION_SELECTOR)) {
        return [];
      }

      return [
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          endTrigger: nextSection,
          end: "top top",
          pin: image,
          pinSpacing: false,
          pinType: "fixed",
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }),
      ];
    });

    if (stickyTriggers.length) {
      ScrollTrigger.refresh();
    }
  };

  const syncSticky = () => {
    if (isReducedMotion() || !desktopQuery.matches) {
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

  const refreshAfterFontScaleChange = () => {
    if (refreshFrame !== null) {
      window.cancelAnimationFrame(refreshFrame);
    }

    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = null;

        if (stickyTriggers.length) {
          ScrollTrigger.refresh();
        } else {
          syncSticky();
        }
      });
    });
  };

  document.addEventListener(
    FONT_SCALE_CHANGE_EVENT,
    refreshAfterFontScaleChange,
  );

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", rebuildSticky);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(rebuildSticky);
  }
}
