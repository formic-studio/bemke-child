const FORM_PREFIX = 'brxe-';
const FORM_SELECTOR = '#brxe-afpmhc';
const pendingSubmissions = new WeakMap();

function getConfig() {
  const config = window.bemkeGetResponseConfig;

  if (
    !config ||
    typeof config.endpoint !== 'string' ||
    typeof config.campaignToken !== 'string' ||
    !Array.isArray(config.consentFields) ||
    config.consentFields.length === 0
  ) {
    return null;
  }

  return config;
}

function getEventForm(event, config) {
  const elementId = String(event.detail?.elementId || '').replace(
    new RegExp(`^${FORM_PREFIX}`),
    '',
  );

  if (elementId !== config.formId) {
    return null;
  }

  return document.getElementById(`${FORM_PREFIX}${config.formId}`);
}

function captureSubmission(event) {
  const form = event.target.closest?.(FORM_SELECTOR);

  if (!form || !form.checkValidity()) {
    return;
  }

  const name = form.elements.namedItem('name')?.value?.trim();
  const email = form.elements.namedItem('email')?.value?.trim();
  const consent = Array.from(
    form.querySelectorAll('input[name="privacy[]"]'),
  ).some((field) => field.checked);

  if (!name || !email || !consent) {
    return;
  }

  pendingSubmissions.set(form, { name, email });
}

function appendHiddenField(form, name, value) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  form.append(input);
}

function submitToGetResponse(payload, config) {
  const frameName = `bemke-getresponse-${Date.now()}`;
  const frame = document.createElement('iframe');
  const form = document.createElement('form');

  frame.name = frameName;
  frame.hidden = true;
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;

  form.method = 'post';
  form.action = config.endpoint;
  form.target = frameName;
  form.acceptCharset = 'utf-8';
  form.hidden = true;

  appendHiddenField(form, 'email', payload.email);
  appendHiddenField(form, 'name', payload.name);
  appendHiddenField(form, 'campaign_token', config.campaignToken);
  appendHiddenField(form, 'thankyou_url', '');
  appendHiddenField(form, 'start_day', '0');

  config.consentFields.forEach((fieldName) => {
    appendHiddenField(form, fieldName, 'true');
  });

  document.body.append(frame, form);
  form.submit();
  form.remove();

  window.setTimeout(() => frame.remove(), 60000);
}

function handleBricksSuccess(event) {
  const config = getConfig();

  if (!config) {
    return;
  }

  const form = getEventForm(event, config);
  const payload = form ? pendingSubmissions.get(form) : null;

  if (!form || !payload) {
    return;
  }

  pendingSubmissions.delete(form);
  submitToGetResponse(payload, config);
}

export function initGetResponseNewsletter() {
  const form = document.querySelector(FORM_SELECTOR);

  if (!form || !getConfig() || form.dataset.bemkeGetResponse === 'ready') {
    return;
  }

  form.dataset.bemkeGetResponse = 'ready';
  form.addEventListener('submit', captureSubmission, true);
  document.addEventListener('bricks/form/success', handleBricksSuccess);
}
