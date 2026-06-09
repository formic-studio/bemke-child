const LINKEDIN_NEWS_SELECTOR = '#brxe-ejpmtj';
const LINKEDIN_NUMBER_SELECTOR = '.linkdin-number';
const LINKEDIN_LOOP_ITEM_SELECTOR = '.brxe-aepfcc';

function formatLinkedinPostNumber(index) {
  return String(index + 1).padStart(2, '0');
}

function updateLinkedinPostNumbers(root) {
  const numbers = Array.from(root.querySelectorAll(LINKEDIN_NUMBER_SELECTOR)).filter((number) =>
    number.closest(LINKEDIN_LOOP_ITEM_SELECTOR),
  );

  numbers.forEach((number, index) => {
    const nextNumber = formatLinkedinPostNumber(index);

    if (number.textContent.trim() !== nextNumber) {
      number.textContent = nextNumber;
    }
  });
}

export function initLinkedinPostNumbers() {
  const root = document.querySelector(LINKEDIN_NEWS_SELECTOR);

  if (!root) {
    return;
  }

  updateLinkedinPostNumbers(root);

  const observer = new MutationObserver(() => {
    updateLinkedinPostNumbers(root);
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
  });
}
