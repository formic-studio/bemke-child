const AUDIT_MODE_CLASS = 'bemke-solid-cta-surface';
const SOLID_SURFACE_CLASS = 'bemke-audit-solid-surface';
const TARGET_SELECTORS = [
  '#brxe-qfwoiw',
  '#brxe-sexdoq',
  '#brxe-gjgfwv',
  '#brxe-xqkthr',
  '#brxe-myvzgs',
  '#brxe-lkpjqh',
  '#brxe-wdxhhg',
  '#brxe-hodjrt',
  '#brxe-bbanty',
  '#brxe-qojxqo',
  '#brxe-mmupgf',
  'section.brxe-befjdw.brxe-section',
  '#brxe-nhnlmx',
  '#brxe-opvhtv',
  '#brxe-jnnken',
  '#brxe-hwvmgr',
  '#brxe-aczboh',
  '#brxe-pmnpjr',
  '#brxe-pychhk',
  '#brxe-zlijyg',
  '#brxe-fevifx',
  '#brxe-tptwiv',
  '#brxe-wnmlbd',
  '#brxe-rtmgoa',
  '#brxe-denlsj',
  '#brxe-endwhl',
  '#brxe-rdqawz',
  '#brxe-mtqbja',
  '#brxe-muffhb',
  '#brxe-emvvnc',
  '#brxe-czozav',
  '#brxe-xulazv',
  '#brxe-idpfye',
  '#brxe-fhbueq',
  '#brxe-spkpsw',
  '#brxe-iwkgeq',
  '#brxe-grcchl',
  '#brxe-zcuunj',
  '#brxe-dgpqjs',
  '#brxe-kzzwob',
];

const PALETTE = [
  ['--eggshell', '#ffe9c6'],
  ['--darkcream', '#fff3e0'],
  ['--yellow', '#f9bb59'],
  ['--wine', '#501819'],
  ['--red', '#741618'],
  ['--brown', '#1b0508'],
];

export function initAuditSolidSurfaces(scope = document) {
  if (!document.body.classList.contains(AUDIT_MODE_CLASS)) {
    return;
  }

  const palette = resolvePalette();

  scope.querySelectorAll(TARGET_SELECTORS.join(',')).forEach((surface) => {
    const textColors = collectTextColors(surface);
    const color = chooseSurfaceColor(textColors, palette);

    surface.classList.add(SOLID_SURFACE_CLASS);
    surface.style.setProperty('--bemke-audit-surface-color', color);
  });
}

function resolvePalette() {
  const rootStyle = window.getComputedStyle(document.documentElement);

  return PALETTE.map(([property, fallback]) => {
    const value = rootStyle.getPropertyValue(property).trim() || fallback;
    return { rgb: parseColor(value), value };
  }).filter(({ rgb }) => rgb);
}

function collectTextColors(surface) {
  const colors = new Map();
  const elements = [surface, ...surface.querySelectorAll('*')];

  elements.forEach((element) => {
    if (!element.textContent.trim()) {
      return;
    }

    const style = window.getComputedStyle(element);

    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      Number.parseFloat(style.opacity) === 0
    ) {
      return;
    }

    const rgb = parseColor(style.color);

    if (rgb) {
      colors.set(rgb.join(','), rgb);
    }
  });

  return Array.from(colors.values());
}

function chooseSurfaceColor(textColors, palette) {
  if (!palette.length) {
    return '#fff3e0';
  }

  if (!textColors.length) {
    return palette[0].value;
  }

  return palette.reduce((best, candidate) => {
    const minimumContrast = Math.min(
      ...textColors.map((color) => contrastRatio(color, candidate.rgb)),
    );

    return minimumContrast > best.minimumContrast
      ? { minimumContrast, value: candidate.value }
      : best;
  }, { minimumContrast: -1, value: palette[0].value }).value;
}

function parseColor(value) {
  const match = value.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)/i);

  if (match) {
    return match.slice(1, 4).map(Number);
  }

  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];

  if (!hex) {
    return null;
  }

  const normalized = hex.length === 3
    ? hex.split('').map((character) => character + character).join('')
    : hex;

  return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
}

function contrastRatio(first, second) {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));

  return (lighter + 0.05) / (darker + 0.05);
}

function luminance(rgb) {
  return rgb
    .map((channel) => channel / 255)
    .map((channel) =>
      channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    )
    .reduce(
      (total, channel, index) =>
        total + channel * [0.2126, 0.7152, 0.0722][index],
      0,
    );
}
