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
];

const URL_PATTERN = /url\((['"]?)(.*?)\1\)/i;

export function initDecorativeBackgrounds(scope = document) {
  scope.querySelectorAll(TARGET_SELECTORS.join(',')).forEach((surface) => {
    if (surface.dataset.bemkeDecorativeBackground === '1') {
      return;
    }

    const style = window.getComputedStyle(surface);
    const source = style.backgroundImage.match(URL_PATTERN)?.[2];

    if (!source) {
      return;
    }

    const image = document.createElement('img');
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    image.className = 'bemke-decorative-background';
    image.decoding = 'async';
    image.draggable = false;
    image.src = source;
    image.style.objectPosition = style.backgroundPosition;

    if (surface.classList.contains('section_hero')) {
      image.fetchPriority = 'high';
      image.loading = 'eager';
    } else {
      image.loading = 'lazy';
    }

    surface.dataset.bemkeDecorativeBackground = '1';
    surface.prepend(image);
    // Remove the authored CSS background in the same task in which the real
    // decorative image is inserted. Waiting for `load` exposed a short state
    // in which validators still saw a CSS background without an alt text.
    surface.dataset.bemkeDecorativeBackgroundReady = '1';
  });
}
