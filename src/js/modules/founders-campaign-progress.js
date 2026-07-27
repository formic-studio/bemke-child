import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MOTION_CHANGE_EVENT,
  isReducedMotion,
} from "./motion-preference.js";

const WRAPPER_SELECTOR = ".book-money-animation .loading-wrapper";
const PROGRESS_SELECTOR = ".loading-progress";
const BAR_SELECTOR = ".progress-bar";
const DOT_SELECTOR = ".progress-dot";
const GOAL_LABEL_SELECTOR =
  ".loading-progress + .brxe-block > .font-size-h4:last-child";
const PROGRESS_PROPERTY = "--bemke-campaign-progress";
const SCROLL_START = "top 90%";
const ANIMATION_DURATION = 2.2;
const ANIMATION_EASE = "power2.out";

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getCampaignAmounts() {
  const currentAmount = Number(
    window.bemkeFoundersCampaign?.currentAmount,
  );
  const goalAmount = Number(window.bemkeFoundersCampaign?.goalAmount);

  if (
    !Number.isFinite(currentAmount) ||
    !Number.isFinite(goalAmount) ||
    goalAmount <= 0
  ) {
    return null;
  }

  return {
    currentAmount: Math.max(currentAmount, 0),
    goalAmount,
  };
}

function formatAmount(amount) {
  return new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatGoalLabel(amount) {
  if (amount >= 1000000) {
    const millions = new Intl.NumberFormat("pl-PL", {
      maximumFractionDigits: 2,
    }).format(amount / 1000000);

    return `${millions} mln PLN`;
  }

  return `${formatAmount(amount)} PLN`;
}

function setProgress(progressElement, percent) {
  progressElement.style.setProperty(
    PROGRESS_PROPERTY,
    `${clamp(percent, 0, 100)}%`,
  );
}

export function initFoundersCampaignProgress() {
  const amounts = getCampaignAmounts();

  if (!amounts) return;

  const { currentAmount, goalAmount } = amounts;
  const targetPercent = clamp((currentAmount / goalAmount) * 100, 0, 100);
  const entries = [];

  document.querySelectorAll(WRAPPER_SELECTOR).forEach((wrapper) => {
    const progressElement = wrapper.querySelector(PROGRESS_SELECTOR);
    const bar = progressElement?.querySelector(BAR_SELECTOR);
    const dot = progressElement?.querySelector(DOT_SELECTOR);
    const goalLabel = wrapper.querySelector(GOAL_LABEL_SELECTOR);

    if (!progressElement || !bar || !dot) return;

    const roundedPercent = Math.round(targetPercent * 10) / 10;
    const state = { percent: 0 };
    const entry = {
      progressElement,
      state,
      tween: null,
    };

    const showFinalState = () => {
      entry.state.percent = targetPercent;
      setProgress(entry.progressElement, targetPercent);
    };

    entry.showFinalState = showFinalState;

    progressElement.dataset.bemkeCampaignProgress = "ready";
    progressElement.setAttribute("role", "progressbar");
    progressElement.setAttribute(
      "aria-label",
      "Postęp Kampanii Założycielskiej",
    );
    progressElement.setAttribute("aria-valuemin", "0");
    progressElement.setAttribute("aria-valuemax", String(goalAmount));
    progressElement.setAttribute(
      "aria-valuenow",
      String(Math.min(currentAmount, goalAmount)),
    );
    progressElement.setAttribute(
      "aria-valuetext",
      `Zebrano ${formatAmount(currentAmount)} PLN z ${formatAmount(goalAmount)} PLN (${roundedPercent}%)`,
    );

    if (goalLabel) {
      goalLabel.textContent = formatGoalLabel(goalAmount);
    }

    setProgress(progressElement, 0);
    entries.push(entry);
  });

  if (!entries.length) return;

  gsap.registerPlugin(ScrollTrigger);

  entries.forEach((entry) => {
    ScrollTrigger.create({
      trigger: entry.progressElement,
      start: SCROLL_START,
      once: true,
      onEnter: () => {
        if (isReducedMotion() || targetPercent === 0) {
          entry.showFinalState();
          return;
        }

        entry.tween = gsap.to(entry.state, {
          percent: targetPercent,
          duration: ANIMATION_DURATION,
          ease: ANIMATION_EASE,
          overwrite: true,
          onUpdate: () => {
            setProgress(entry.progressElement, entry.state.percent);
          },
          onComplete: () => {
            entry.tween = null;
            entry.showFinalState();
          },
        });
      },
    });
  });

  document.addEventListener(MOTION_CHANGE_EVENT, (event) => {
    if (!event.detail?.reduced) return;

    entries.forEach((entry) => {
      entry.tween?.kill();
      entry.tween = null;
      entry.showFinalState();
    });
  });
}
