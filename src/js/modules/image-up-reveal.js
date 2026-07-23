import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from "./motion-preference.js";

const IMAGE_SELECTOR = "[img-up]";
const SCROLL_START = "top 95%";
const REVEAL_DURATION = 0.8;
const REVEAL_EASE = "power2.out";

export function initImageUpReveal() {
  const images = gsap.utils.toArray(IMAGE_SELECTOR);

  if (!images.length) return;

  gsap.registerPlugin(ScrollTrigger);

  let tweens = [];

  const stopAnimations = () => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    tweens = [];
  };

  const showImages = () => {
    gsap.set(images, {
      clearProps: "opacity,transform,willChange",
    });
  };

  const createAnimations = () => {
    stopAnimations();
    showImages();

    if (isReducedMotion()) return;

    tweens = images.map((image) =>
      gsap.fromTo(
        image,
        {
          opacity: 0.6,
          willChange: "transform, opacity",
          y: 10,
        },
        {
          duration: REVEAL_DURATION,
          ease: REVEAL_EASE,
          opacity: 1,
          overwrite: "auto",
          scrollTrigger: {
            trigger: image,
            start: SCROLL_START,
            once: true,
          },
          y: 0,
          onComplete: () => {
            gsap.set(image, {
              clearProps: "opacity,transform,willChange",
            });
          },
        },
      ),
    );
  };

  createAnimations();

  document.addEventListener(MOTION_CHANGE_EVENT, createAnimations);

  if (document.readyState !== "complete") {
    window.addEventListener(
      "load",
      () => {
        ScrollTrigger.refresh();
      },
      { once: true },
    );
  }
}
