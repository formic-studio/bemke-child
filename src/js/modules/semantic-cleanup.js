function replaceTag(element, tagName) {
  const replacement = document.createElement(tagName);

  Array.from(element.attributes).forEach(({ name, value }) => {
    replacement.setAttribute(name, value);
  });

  replacement.replaceChildren(...element.childNodes);
  element.replaceWith(replacement);

  return replacement;
}

function structureHeroTitles(scope = document) {
  scope.querySelectorAll('main .section_hero').forEach((hero) => {
    const visualTitle = Array.from(
      hero.querySelectorAll('.font-size-display'),
    ).find((element) => element.tagName === 'DIV');

    if (visualTitle) {
      const wrapper = visualTitle.parentElement;
      const existingHeading = wrapper?.querySelector(':scope > h1');

      replaceTag(visualTitle, 'h1');

      if (existingHeading) {
        const supportingHeading = replaceTag(existingHeading, 'h2');
        supportingHeading.setAttribute('data-bemke-hero-intro-heading', '1');
      }
    }

    markHeroTextSurfaces(hero);
  });
}

function markHeroTextSurfaces(hero) {
  const animationHeading =
    hero.querySelector('[data-bemke-hero-intro-heading="1"]') ||
    hero.querySelector('h1');
  const wrapper = animationHeading?.parentElement;

  if (!wrapper) {
    return;
  }

  Array.from(wrapper.children)
    .filter(
      (element) =>
        element.matches('h1, h2, h3, .brxe-text-basic, .brxe-text, p') &&
        element.textContent.trim(),
    )
    .forEach(addHeroTextSurface);
}

function addHeroTextSurface(element) {
  element.setAttribute('data-bemke-hero-text-surface', '1');

  if (element.querySelector(':scope > .bemke-hero-text-surface__inline')) {
    return;
  }

  normalizeHeroTextLineBlocks(element);

  const inline = document.createElement('span');
  inline.className = 'bemke-hero-text-surface__inline';
  appendHeroTextSurfaceSegments(inline, Array.from(element.childNodes));
  element.replaceChildren(inline);
}

function appendHeroTextSurfaceSegments(wrapper, nodes) {
  let segment = createHeroTextSurfaceSegment();

  const flushSegment = () => {
    if (!segment.childNodes.length) {
      return;
    }

    if (segment.textContent.trim()) {
      wrapper.append(segment);
    } else {
      wrapper.append(...segment.childNodes);
    }

    segment = createHeroTextSurfaceSegment();
  };

  nodes.forEach((node) => {
    if (isHeroTextLineBreak(node)) {
      flushSegment();
      wrapper.append(node);
      return;
    }

    segment.append(node);
  });

  flushSegment();
}

function createHeroTextSurfaceSegment() {
  const segment = document.createElement('span');
  segment.className = 'bemke-hero-text-surface__segment';
  return segment;
}

function isHeroTextLineBreak(node) {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    (node.tagName === 'BR' || node.classList.contains('bemke-heading-break'))
  );
}

function normalizeHeroTextLineBlocks(element) {
  Array.from(element.children)
    .filter((child) => child.tagName === 'DIV')
    .forEach((block) => {
      const line = document.createElement('span');

      Array.from(block.attributes).forEach(({ name, value }) => {
        line.setAttribute(name, value);
      });

      line.classList.add('bemke-hero-text-surface__line');
      line.replaceChildren(...block.childNodes);

      if (hasLineContentBefore(block)) {
        const lineBreak = document.createElement('br');
        lineBreak.className = 'bemke-hero-text-surface__break';
        lineBreak.setAttribute('aria-hidden', 'true');
        block.replaceWith(lineBreak, line);
        return;
      }

      block.replaceWith(line);
    });
}

function hasLineContentBefore(element) {
  let sibling = element.previousSibling;

  while (sibling) {
    if (sibling.nodeType === Node.TEXT_NODE) {
      if (sibling.textContent.trim()) {
        return true;
      }
    } else if (sibling.nodeType === Node.ELEMENT_NODE) {
      return (
        sibling.tagName !== 'BR' &&
        !sibling.classList.contains('bemke-heading-break')
      );
    }

    sibling = sibling.previousSibling;
  }

  return false;
}

function structureDonorTitles(scope = document) {
  if (!window.location.pathname.startsWith('/darczynca/')) {
    return;
  }

  const wrapper = scope.querySelector('#brxe-msohgn');
  const context = wrapper?.querySelector(':scope > #brxe-bohwxm');
  const title = wrapper?.querySelector(':scope > h1');

  if (!wrapper || !context || !title) {
    return;
  }

  const contextHeading = replaceTag(context, 'h2');
  contextHeading.classList.add('bemke-donor-heading__context');

  // Keep the primary page title first in reading order. CSS restores the
  // authored visual order with the donor context above it.
  wrapper.prepend(title);
}

function wrapContentsWithRole(element, role, level) {
  if (!element || element.querySelector(':scope > [data-bemke-text-role]')) {
    return;
  }

  const wrapper = document.createElement('span');
  wrapper.dataset.bemkeTextRole = role;
  wrapper.setAttribute('role', role);

  if (level) {
    wrapper.setAttribute('aria-level', String(level));
  }

  wrapper.replaceChildren(...element.childNodes);
  element.append(wrapper);
}

function structureVisualHeadings(scope = document) {
  scope
    .querySelectorAll(
      [
        '.brxe-daxhjb > .brxe-krqols',
        '.contact-block > .font-size-h4',
        '.contact-wrapper > .font-size-caption-italic:first-child',
        '#brxe-fawham',
        '#brxe-aeibpe',
        '#brxe-dnxzhd',
        '#brxe-fkwadu',
        '#brxe-hmcnvc',
        '#brxe-kxsvlg',
        '#brxe-qcrjty',
        '#brxe-tejrbc',
        '#brxe-tfgojg',
        '#brxe-yqzyif',
      ].join(','),
    )
    .forEach((element) => wrapContentsWithRole(element, 'heading', 3));

  scope
    .querySelectorAll(
      [
        '#brxe-atxqxt',
        '#brxe-enlpmr',
        '#brxe-gnreux',
        '#brxe-hljnqp',
        '#brxe-leraon',
        '#brxe-mymwic',
        '#brxe-punajk',
        '#brxe-tpxjgn',
        '#brxe-udgkda',
        '#brxe-vkohwe',
        'h1 > div',
        'h2 > div',
        'h3 > div',
        'h4 > div',
        'h5 > div',
        'h6 > div',
      ].join(','),
    )
    .forEach((element) => wrapContentsWithRole(element, 'presentation'));

  scope.querySelectorAll('main p').forEach((paragraph) => {
    const text = paragraph.textContent.replace(/\s+/g, ' ').trim();

    if (text.startsWith('Fundacja Campus Bemke') && text.includes('Nr konta:')) {
      wrapContentsWithRole(paragraph, 'note');
    }
  });
}

function addContrastTextSurfaces(scope = document) {
  scope
    .querySelectorAll(
      [
        '.single-darczynca #brxe-hhqzeu',
        '.single-darczynca #brxe-fawham',
        '.single-darczynca #brxe-hcqahx',
        '.single-darczynca #brxe-jgkmro',
        '.single-oferta-pracy #brxe-ziflsk',
        '.single-oferta-pracy #brxe-douozj',
        '.single-oferta-pracy #brxe-etlyvi',
      ].join(','),
    )
    .forEach((element) => {
      if (element.querySelector(':scope > .bemke-contrast-text-surface')) {
        return;
      }

      const surface = document.createElement('span');
      surface.className = 'bemke-contrast-text-surface';
      surface.replaceChildren(...element.childNodes);
      element.append(surface);
    });
}

function normalizeAnimatedLinkUnderlines(scope = document) {
  scope
    .querySelectorAll('.donors-block > a[href]')
    .forEach((link) => link.classList.add('bemke-gradient-underline-link'));

  scope
    .querySelectorAll('a[href]:not(.brxe-button):not(.btn):not(:has(img, svg))')
    .forEach((link) => {
      const background = window.getComputedStyle(link).backgroundImage;

      if (background.includes('linear-gradient')) {
        link.classList.add('bemke-gradient-underline-link');
      }
    });
}

function structurePressContent(scope = document) {
  scope.querySelectorAll('div#brxe-okyfdw').forEach((date) => {
    const time = replaceTag(date, 'time');
    const match = time.textContent.match(/(\d{2})\.(\d{2})\.(\d{4})/);

    if (match) {
      time.dateTime = `${match[3]}-${match[2]}-${match[1]}`;
    }
  });

  scope.querySelectorAll('div#brxe-iqitbt').forEach((downloads) => {
    const navigation = replaceTag(downloads, 'nav');
    navigation.setAttribute('aria-label', 'Pliki do pobrania');
  });

  scope.querySelectorAll('div.brxe-tdovsh').forEach((title) => {
    replaceTag(title, 'h2');
  });

  scope.querySelectorAll('div.brxe-ojvyof').forEach((date) => {
    const time = replaceTag(date, 'time');
    const match = time.textContent.match(/(\d{2})\.(\d{2})\.(\d{4})/);

    if (match) {
      time.dateTime = `${match[3]}-${match[2]}-${match[1]}`;
    }
  });
}

function structurePrivacyHeadings(scope = document) {
  if (!window.location.pathname.includes('polityka-prywatnosci')) {
    return;
  }

  scope.querySelectorAll('main p').forEach((paragraph) => {
    const text = paragraph.textContent.replace(/[\u00a0\u202f]+/g, ' ').trim();

    if (/^[12]\.\s/.test(text) && text.length < 100) {
      paragraph.textContent = text.replace(/^\d+\.\s*/, '');
      replaceTag(paragraph, 'h2');
      return;
    }

    if (!/^I\.\s*GOOGLE ANALYTICS/i.test(text)) {
      return;
    }

    const leadingStrong = [];

    for (const child of paragraph.children) {
      if (child.tagName === 'BR') {
        break;
      }

      if (child.tagName === 'STRONG') {
        leadingStrong.push(child);
      }
    }
    const headingText = leadingStrong
      .map((element) => element.textContent)
      .join(' ')
      .replace(/[\u00a0\u202f]+/g, ' ')
      .trim();

    if (!headingText) {
      return;
    }

    const heading = document.createElement('h2');
    heading.textContent = headingText;
    paragraph.before(heading);
    leadingStrong.forEach((element) => element.remove());

    if (paragraph.firstElementChild?.tagName === 'BR') {
      paragraph.firstElementChild.remove();
    }
  });

  scope
    .querySelectorAll('main p > strong:first-child, main h2 > strong:first-child')
    .forEach((strong) => {
      const text = strong.textContent
        .replace(/[\u00a0\u202f]+/g, ' ')
        .trim();

      if (!/^\d+\.\s/.test(text)) {
        return;
      }

      const headingText = text.replace(/^\d+\.\s*/, '');
      const parent = strong.parentElement;

      if (parent.tagName === 'H2') {
        strong.textContent = headingText;
        return;
      }

      const heading = document.createElement('h2');
      heading.textContent = headingText;
      parent.before(heading);
      strong.remove();

      if (parent.firstElementChild?.tagName === 'BR') {
        parent.firstElementChild.remove();
      }

      if (!parent.textContent.trim() && !parent.children.length) {
        parent.remove();
      }
    });
}

function removeEmptyHeadings(scope = document) {
  scope.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const text = heading.textContent.replace(/\u00a0/g, ' ').trim();
    const imageText = Array.from(heading.querySelectorAll('img[alt]')).some(
      (image) => image.alt.trim(),
    );

    if (!text && !imageText) {
      heading.remove();
    }
  });
}

function identifyQuotedSources(scope = document) {
  scope.querySelectorAll('blockquote:not([cite])').forEach((quote) => {
    quote.setAttribute('cite', window.location.href);
  });
}

function normalizePrivacyWhitespace(scope = document) {
  if (!window.location.pathname.includes('polityka-prywatnosci')) {
    return;
  }

  const content = scope.querySelector('main') || scope.body || scope;
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.parentElement?.closest('script, style, noscript, textarea')) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    },
  });

  while (walker.nextNode()) {
    const node = walker.currentNode;
    node.nodeValue = node.nodeValue
      .replace(/[\u00a0\u202f]+/g, ' ')
      .replace(/lit\. b i f RODO/gi, 'lit. b oraz lit. f RODO');
  }
}

export function initSemanticCleanup() {
  structureHeroTitles();
  structureDonorTitles();
  structureVisualHeadings();
  addContrastTextSurfaces();
  normalizeAnimatedLinkUnderlines();
  structurePressContent();
  structurePrivacyHeadings();
  removeEmptyHeadings();
  identifyQuotedSources();
  normalizePrivacyWhitespace();
}
