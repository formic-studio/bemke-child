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

  const inline = document.createElement('span');
  inline.className = 'bemke-hero-text-surface__inline';
  inline.replaceChildren(...element.childNodes);
  element.append(inline);
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
  structurePressContent();
  structurePrivacyHeadings();
  removeEmptyHeadings();
  identifyQuotedSources();
  normalizePrivacyWhitespace();
}
