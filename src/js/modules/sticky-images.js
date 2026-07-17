import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from "./motion-preference.js";

const WRAPPER_SELECTOR = ".sticky-wrapper";
const STICKY_SELECTOR = ".sticky";
const SECTION_SELECTOR = ".brxe-section";
const DESKTOP_QUERY = "(min-width: 992px)";
const IMAGE_LOAD_MARGIN = "500px 0px";

export function initStickyImages() {
  const wrappers = gsap.utils.toArray(WRAPPER_SELECTOR);

  if (!wrappers.length) return;

  gsap.registerPlugin(ScrollTrigger);
  observeStickyImages(wrappers);

  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  let stickyTriggers = [];

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

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", rebuildSticky);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(rebuildSticky);
  }
}

function observeStickyImages(wrappers) {
  const images = wrappers
    .map((wrapper) => wrapper.querySelector(`:scope > ${STICKY_SELECTOR}`))
    .filter((image) => image?.dataset.bemkeSrc);

  if (!images.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    images.forEach(hydrateStickyImage);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.unobserve(entry.target);
        hydrateStickyImage(entry.target);
      });
    },
    {
      rootMargin: IMAGE_LOAD_MARGIN,
    },
  );

  images.forEach((image) => observer.observe(image));
}

function hydrateStickyImage(image) {
  const src = image.dataset.bemkeSrc;
  const srcset = image.dataset.bemkeSrcset;

  image.setAttribute("loading", "eager");
  image.setAttribute("fetchpriority", "auto");

  if (srcset) {
    image.setAttribute("srcset", srcset);
    delete image.dataset.bemkeSrcset;
  }

  if (src) {
    image.src = src;
    delete image.dataset.bemkeSrc;
  }

  image.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
    },
    { once: true },
  );
}
