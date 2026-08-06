const FORM_SELECTOR = '.brxe-form';
const ARIA_REFERENCE_ATTRS = ['aria-labelledby', 'aria-describedby'];
const HIDDEN_LABEL_CLASS = 'bemke-sr-only';
const FIELD_LABEL_CLASS = 'bemke-field-label';
const FIELD_ERROR_CLASS = 'bemke-field-error';
const STATUS_CLASS = 'bemke-form-status';
const READY_ATTR = 'data-bemke-accessible-form-ready';
const BOOTED_FLAG = '__bemkeFormAriaReferencesBooted';
const focusFrames = new WeakMap();
let generatedFieldId = 0;

export function initFormAriaReferences() {
  repairFormAriaReferences();
  enhanceAccessibleForms();

  if (window[BOOTED_FLAG]) {
    return;
  }

  window[BOOTED_FLAG] = true;

  window.addEventListener('load', refreshForms);
  document.addEventListener('bricks/ajax/end', refreshForms);
  document.addEventListener('bricks/form/success', (event) =>
    handleBricksFormResult(event, 'success'),
  );
  document.addEventListener('bricks/form/error', (event) =>
    handleBricksFormResult(event, 'error'),
  );

  if (!window.MutationObserver || !document.body) {
    return;
  }

  new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
      refreshForms();
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function refreshForms() {
  repairFormAriaReferences();
  enhanceAccessibleForms();
}

function enhanceAccessibleForms(root = document) {
  const scope = typeof root?.querySelectorAll === 'function' ? root : document;

  scope.querySelectorAll(FORM_SELECTOR).forEach((form) => {
    prepareFormFields(form);
    ensureStatusRegion(form);

    if (form.getAttribute(READY_ATTR) === '1') {
      return;
    }

    form.setAttribute(READY_ATTR, '1');
    form.addEventListener(
      'invalid',
      (event) => {
        event.preventDefault();
        handleInvalidField(form, event.target);
      },
      true,
    );
    form.addEventListener('input', (event) => clearValidFieldError(event.target));
    form.addEventListener('change', (event) => clearValidFieldError(event.target));
    form.addEventListener('submit', () => clearFormStatus(form), true);
  });
}

function prepareFormFields(form) {
  form.querySelectorAll('.form-group').forEach((group) => {
    const controls = Array.from(
      group.querySelectorAll('input, select, textarea'),
    ).filter((control) => control.type !== 'hidden');

    if (controls.length === 1) {
      group.removeAttribute('role');
      group.removeAttribute('aria-label');
      group.removeAttribute('aria-labelledby');
    }

    controls.forEach((control) => {
      applyAutocomplete(control);

      if (!supportsPersistentLabel(control)) {
        return;
      }

      const controlId = ensureControlId(control);
      const existingLabel = Array.from(group.querySelectorAll('label[for]')).find(
        (label) => label.htmlFor === controlId,
      );

      if (existingLabel) {
        control.removeAttribute('aria-label');
        return;
      }

      const labelText = getControlLabel(control);

      if (!labelText) {
        return;
      }

      const label = document.createElement('label');
      label.className = FIELD_LABEL_CLASS;
      label.htmlFor = controlId;
      label.textContent = labelText;
      group.insertBefore(label, control);
      control.removeAttribute('aria-label');
    });
  });
}

function supportsPersistentLabel(control) {
  if (control.matches('select, textarea')) {
    return true;
  }

  return (
    control.matches('input') &&
    !['button', 'checkbox', 'file', 'hidden', 'image', 'radio', 'reset', 'submit'].includes(
      control.type,
    )
  );
}

function ensureControlId(control) {
  if (control.id) {
    return control.id;
  }

  generatedFieldId += 1;
  control.id = `bemke-form-field-${generatedFieldId}`;
  return control.id;
}

function getControlLabel(control) {
  const suppliedLabel =
    control.getAttribute('aria-label') ||
    control.getAttribute('placeholder') ||
    (control.matches('select') ? control.options[0]?.textContent : '') ||
    '';
  const normalized = suppliedLabel.replace(/\s+/g, ' ').replace(/^\*\s*/, '').trim();
  const lowerLabel = normalized.toLocaleLowerCase('pl');

  if (control.type === 'email' || /\be-?mail\b/i.test(lowerLabel)) {
    return 'E-mail';
  }

  if (lowerLabel.includes('imię') && lowerLabel.includes('nazwisko')) {
    return 'Imię i nazwisko';
  }

  if (lowerLabel.includes('temat')) {
    return 'Temat';
  }

  return normalized;
}

function applyAutocomplete(control) {
  const label = `${control.name || ''} ${control.getAttribute('aria-label') || ''} ${
    control.getAttribute('placeholder') || ''
  }`.toLocaleLowerCase('pl');

  if (control.type === 'email' || /\be-?mail\b/i.test(label)) {
    control.setAttribute('autocomplete', 'email');
    return;
  }

  if (label.includes('imię') && label.includes('nazwisko')) {
    control.setAttribute('autocomplete', 'name');
  }
}

function ensureStatusRegion(form) {
  let status = form.querySelector(`:scope > .${STATUS_CLASS}`);

  if (status) {
    return status;
  }

  status = document.createElement('div');
  status.className = `${STATUS_CLASS} ${HIDDEN_LABEL_CLASS}`;
  status.setAttribute('aria-atomic', 'true');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('role', 'status');
  form.append(status);
  return status;
}

function handleInvalidField(form, field) {
  if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
    return;
  }

  showFieldError(field, getValidationMessage(field));
  queueFirstInvalidFieldFocus(form);
}

function getValidationMessage(field) {
  const label = getAssociatedLabel(field) || 'To pole';

  if (field.validity.valueMissing) {
    if (field.type === 'checkbox' || field.type === 'radio') {
      return 'Zaznacz wymaganą zgodę.';
    }

    if (field.matches('select')) {
      return `Wybierz wartość w polu „${label}”.`;
    }

    return `Uzupełnij pole „${label}”.`;
  }

  if (field.validity.typeMismatch && field.type === 'email') {
    return 'Wpisz poprawny adres e-mail, np. nazwa@domena.pl.';
  }

  if (field.validity.tooShort) {
    return `Wpisz co najmniej ${field.minLength} znaków.`;
  }

  if (field.validity.tooLong) {
    return `Wpisz nie więcej niż ${field.maxLength} znaków.`;
  }

  if (field.validity.patternMismatch) {
    return `Sprawdź format wartości w polu „${label}”.`;
  }

  return `Sprawdź wartość w polu „${label}”.`;
}

function getAssociatedLabel(field) {
  if (!field.id) {
    return getControlLabel(field);
  }

  const label = Array.from(field.form?.querySelectorAll('label[for]') || []).find(
    (candidate) => candidate.htmlFor === field.id,
  );

  return label?.textContent?.replace(/^\*\s*/, '').replace(/\s+/g, ' ').trim() || getControlLabel(field);
}

function showFieldError(field, message) {
  const fieldId = ensureControlId(field);
  const errorId = `${fieldId}-bemke-error`;
  let error = document.getElementById(errorId);

  if (!error) {
    error = document.createElement('span');
    error.id = errorId;
    error.className = FIELD_ERROR_CLASS;
    (field.closest('.form-group') || field.parentElement)?.append(error);
  }

  error.textContent = message;
  field.setAttribute('aria-invalid', 'true');
  addReference(field, 'aria-describedby', errorId);
}

function clearValidFieldError(field) {
  if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
    return;
  }

  if (!field.validity.valid) {
    return;
  }

  const errorId = field.id ? `${field.id}-bemke-error` : '';

  if (errorId) {
    document.getElementById(errorId)?.remove();
    removeReference(field, 'aria-describedby', errorId);
  }

  field.removeAttribute('aria-invalid');
}

function queueFirstInvalidFieldFocus(form) {
  const previousFrame = focusFrames.get(form);

  if (previousFrame) {
    window.cancelAnimationFrame(previousFrame);
  }

  const frame = window.requestAnimationFrame(() => {
    const firstInvalid = form.querySelector('input:invalid, select:invalid, textarea:invalid');
    firstInvalid?.focus();
    focusFrames.delete(form);
  });

  focusFrames.set(form, frame);
}

function handleBricksFormResult(event, type) {
  const form = getEventForm(event.detail);

  if (!form) {
    return;
  }

  const fallback =
    type === 'success'
      ? 'Dziękujemy. Formularz został wysłany.'
      : 'Nie udało się wysłać formularza. Sprawdź dane i spróbuj ponownie.';
  const message = getResponseMessage(event.detail?.res) || fallback;
  announceFormResult(form, message, type);

  window.setTimeout(() => enhanceVisibleResult(form, type), 0);
}

function getEventForm(detail) {
  const elementId = String(detail?.elementId || '').replace(/^brxe-/, '');

  if (!elementId) {
    return null;
  }

  return (
    document.getElementById(`brxe-${elementId}`) ||
    document.querySelector(`${FORM_SELECTOR}[data-element-id="${elementId}"]`)
  );
}

function getResponseMessage(response) {
  const message = response?.data?.message;

  if (typeof message === 'string') {
    return htmlToText(message);
  }

  if (message?.errors && typeof message.errors === 'object') {
    return Object.values(message.errors)
      .flat()
      .map((item) => htmlToText(String(item)))
      .filter(Boolean)
      .join(' ');
  }

  return '';
}

function htmlToText(markup) {
  const container = document.createElement('div');
  container.innerHTML = markup;
  return container.textContent?.replace(/\s+/g, ' ').trim() || '';
}

function announceFormResult(form, message, type) {
  const status = ensureStatusRegion(form);
  status.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  status.setAttribute('role', type === 'error' ? 'alert' : 'status');
  status.textContent = '';

  window.requestAnimationFrame(() => {
    status.textContent = message;
  });
}

function enhanceVisibleResult(form, type) {
  const message = form.querySelector('.message');

  if (!message) {
    return;
  }

  message.setAttribute('aria-atomic', 'true');
  message.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  message.setAttribute('role', type === 'error' ? 'alert' : 'status');

  if (type !== 'error') {
    return;
  }

  const firstInvalid = form.querySelector('input:invalid, select:invalid, textarea:invalid');

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  message.setAttribute('tabindex', '-1');
  message.focus();
}

function clearFormStatus(form) {
  const status = ensureStatusRegion(form);
  status.textContent = '';
  form.querySelectorAll(`.${FIELD_ERROR_CLASS}`).forEach((error) => {
    const field = form.querySelector(`[aria-describedby~="${error.id}"]`);

    if (field?.validity?.valid) {
      clearValidFieldError(field);
    }
  });
}

function addReference(element, attribute, reference) {
  const references = splitReferences(element.getAttribute(attribute));
  element.setAttribute(attribute, unique([...references, reference]).join(' '));
}

function removeReference(element, attribute, reference) {
  const references = splitReferences(element.getAttribute(attribute)).filter(
    (item) => item !== reference,
  );

  if (references.length) {
    element.setAttribute(attribute, references.join(' '));
    return;
  }

  element.removeAttribute(attribute);
}

function repairFormAriaReferences(root = document) {
  const scope = typeof root?.querySelectorAll === 'function' ? root : document;

  scope.querySelectorAll(FORM_SELECTOR).forEach((form) => {
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
