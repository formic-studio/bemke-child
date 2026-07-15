import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const COUNTER_SELECTOR = ".number-counter";
const COUNTER_START = "top 90%";
const COUNTER_DURATION = 1.8;
const COUNTER_EASE = "power2.out";

function getCounterData(element) {
  const finalText = element.textContent.trim();
  const numberMatch = finalText.match(/-?\d[\d\s.,]*/);

  if (!numberMatch) return null;

  const target = Number.parseInt(numberMatch[0].replace(/[^\d-]/g, ""), 10);

  if (!Number.isFinite(target)) return null;

  const numberStart = numberMatch.index ?? 0;

  return {
    finalText,
    prefix: finalText.slice(0, numberStart),
    suffix: finalText.slice(numberStart + numberMatch[0].length),
    target,
  };
}

export function initNumberCounters() {
  const counters = gsap.utils.toArray(COUNTER_SELECTOR);

  if (!counters.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  counters.forEach((counter) => {
    const counterData = getCounterData(counter);

    if (!counterData) return;

    const { finalText, prefix, suffix, target } = counterData;

    counter.setAttribute("aria-label", finalText);

    if (prefersReducedMotion || target === 0) return;

    const counterValue = { value: 0 };

    counter.textContent = `${prefix}0${suffix}`;

    ScrollTrigger.create({
      trigger: counter,
      start: COUNTER_START,
      once: true,
      onEnter: () => {
        gsap.to(counterValue, {
          value: target,
          duration: COUNTER_DURATION,
          ease: COUNTER_EASE,
          snap: { value: 1 },
          overwrite: true,
          onUpdate: () => {
            counter.textContent = `${prefix}${Math.round(counterValue.value)}${suffix}`;
          },
          onComplete: () => {
            counter.textContent = finalText;
          },
        });
      },
    });
  });
}
