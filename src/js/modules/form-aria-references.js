const FORM_SELECTOR = '.brxe-form';
const ARIA_REFERENCE_ATTRS = ['aria-labelledby', 'aria-describedby'];
const HIDDEN_LABEL_CLASS = 'bemke-sr-only';
const BOOTED_FLAG = '__bemkeFormAriaReferencesBooted';

export function initFormAriaReferences() {
  repairFormAriaReferences();

  if (window[BOOTED_FLAG]) {
    return;
  }

  window[BOOTED_FLAG] = true;

  window.addEventListener('load', repairFormAriaReferences);
  document.addEventListener('bricks/ajax/end', repairFormAriaReferences);

  if (!window.MutationObserver || !document.body) {
    return;
  }

  new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
      repairFormAriaReferences();
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function repairFormAriaReferences(root = document) {
  root.querySelectorAll(FORM_SELECTOR).forEach((form) => {
    ARIA_REFERENCE_ATTRS.forEach((attribute) => {
      form.querySelectorAll(`[${attribute}]`).forEach((element) => {
        repairReferenceAttribute(element, attribute);
      });
    });
  });
}

function repairReferenceAttribute(element, attribute) {
  const references = splitReferences(element.getAttribute(attribute));

  if (!references.length) {
    element.removeAttribute(attribute);
    return;
  }

  const validReferences = references
    .map((reference) => ensureReference(element, reference, attribute))
    .filter(Boolean);

  if (validReferences.length) {
    element.setAttribute(attribute, unique(validReferences).join(' '));
    return;
  }

  element.removeAttribute(attribute);
}

function ensureReference(element, reference, attribute) {
  if (document.getElementById(reference)) {
    return reference;
  }

  if (attribute !== 'aria-labelledby') {
    return null;
  }

  const labelText = getFallbackLabelText(element);

  if (!labelText) {
    return null;
  }

  const hiddenLabel = document.createElement('span');
  hiddenLabel.id = reference;
  hiddenLabel.className = HIDDEN_LABEL_CLASS;
  hiddenLabel.textContent = labelText;
  element.insertBefore(hiddenLabel, element.firstChild);

  return reference;
}

function getFallbackLabelText(element) {
  const label = element.querySelector('label');
  const text = label?.textContent || element.textContent;

  return text?.replace(/\s+/g, ' ').trim() || '';
}

function splitReferences(value) {
  return (value || '').split(/\s+/).filter(Boolean);
}

function unique(items) {
  return Array.from(new Set(items));
}
