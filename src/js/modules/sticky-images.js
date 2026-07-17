import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from "./motion-preference.js";

const WRAPPER_SELECTOR = ".sticky-wrapper";
const STICKY_SELECTOR = ".sticky";
const SECTION_SELECTOR = ".brxe-section";

export function initStickyImages() {
  const wrappers = gsap.utils.toArray(WRAPPER_SELECTOR);

  if (!wrappers.length) return;

  gsap.registerPlugin(ScrollTrigger);

  let stickyTriggers = [];

  const stopSticky = () => {
    stickyTriggers.forEach((trigger) => trigger.kill());
    stickyTriggers = [];
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

      return [
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          endTrigger: nextSection,
          end: "top top",
          pin: image,
          pinSpacing: false,
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
}
