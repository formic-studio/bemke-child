const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const MAP_IMAGE_SELECTOR = '#brxe-hdvixb';

const MAP_AREAS = [
  {
    label: 'Wioska edukacyjna',
    points:
      '3228,1673 3340,1694 3398,1727 3499,1767 3607,1799 3654,1828 3636,1908 3579,2002 3463,2139 3387,2099 3340,2078 3286,2052 3242,2042 3195,2020 3098,1984 3036,1958 3112,1837 3148,1787',
  },
  {
    label: 'Przedszkole',
    points:
      '3101,2065 3047,2105 2996,2148 2986,2188 3000,2213 3072,2249 3123,2217 3174,2159 3195,2108',
  },
  {
    label: 'Collegium Marianum',
    points:
      '2049,1262 2234,1306 2346,1327 2360,1363 2328,1483 2273,1544 2219,1649 2158,1714 2071,1751 1973,1743 1894,1711 1847,1649 1908,1476 1973,1384',
  },
  {
    label: 'Farmlab',
    points:
      '2422,2334 2364,2446 2331,2511 2375,2551 2494,2606 2566,2645 2664,2595 2841,2396 2852,2356 2772,2291 2667,2251 2606,2240 2476,2215',
  },
  {
    label: 'Hala sportowa',
    points:
      '2982,1601 2899,1717 2921,1749 2996,1778 3072,1807 3105,1782 3152,1731 3166,1680 3170,1655 3130,1619 3069,1604',
  },
  {
    label: 'Parking',
    points:
      '2595,1459 2552,1556 2671,1589 2754,1625 2805,1647 2895,1672 2978,1567',
  },
  {
    label: 'Park',
    points:
      '2089,1807 2259,1706 2339,1648 2469,1677 2584,1739 2642,1786 2696,1865 2754,1902 2830,1952 2899,2035 2863,2162 2783,2195 2602,2216 2433,2187 2263,2173 2165,2122 2057,2072 2035,1902',
  },
  {
    label: 'Gospodarstwo',
    points:
      '2107,1236 2169,1250 2288,1279 2451,1312 2512,1225 2577,1116 2592,1087 2490,1051 2523,939 2259,881 2179,1008 2151,1059 2129,1116',
  },
];

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NAMESPACE, name);

  Object.entries(attributes).forEach(([attribute, value]) => {
    element.setAttribute(attribute, value);
  });

  return element;
}

function setTooltipPosition(wrapper, tooltip, clientX, clientY) {
  const wrapperRect = wrapper.getBoundingClientRect();
  const localX = clientX - wrapperRect.left;
  const localY = clientY - wrapperRect.top;
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;
  const horizontalMargin = 8;
  const verticalOffset = 12;

  const minX = tooltipWidth / 2 + horizontalMargin;
  const maxX = wrapperRect.width - tooltipWidth / 2 - horizontalMargin;
  const x =
    minX > maxX
      ? wrapperRect.width / 2
      : Math.min(Math.max(localX, minX), maxX);
  const placeBelow = localY < tooltipHeight + verticalOffset + horizontalMargin;

  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${localY}px`;
  tooltip.dataset.placement = placeBelow ? 'below' : 'above';
}

function setTooltipAtArea(wrapper, tooltip, area) {
  const areaRect = area.getBoundingClientRect();

  setTooltipPosition(
    wrapper,
    tooltip,
    areaRect.left + areaRect.width / 2,
    areaRect.top + areaRect.height / 2,
  );
}

export function initCampusMap() {
  const image = document.querySelector(MAP_IMAGE_SELECTOR);

  if (
    !image ||
    image.closest('[data-bemke-campus-map-ready="1"]') ||
    !(image.currentSrc || image.src).includes('bemke-maps')
  ) {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'campus-map';
  wrapper.dataset.bemkeCampusMapReady = '1';

  image.parentNode.insertBefore(wrapper, image);
  wrapper.append(image);

  const overlay = createSvgElement('svg', {
    class: 'campus-map__areas',
    viewBox: '0 0 4096 4092',
    preserveAspectRatio: 'xMidYMid meet',
    'aria-label': 'Interaktywna mapa Campus Bemke',
  });

  const tooltip = document.createElement('div');
  tooltip.className = 'campus-map__tooltip';
  tooltip.setAttribute('role', 'status');
  tooltip.setAttribute('aria-live', 'polite');

  let touchArea = null;

  const hideTooltip = () => {
    tooltip.removeAttribute('data-visible');
    touchArea?.classList.remove('is-active');
    touchArea = null;
  };

  const showTooltip = (area, label) => {
    tooltip.textContent = label;
    tooltip.dataset.visible = 'true';
    setTooltipAtArea(wrapper, tooltip, area);
  };

  MAP_AREAS.forEach(({ label, points }) => {
    const area = createSvgElement('polygon', {
      class: 'campus-map__area',
      points,
      role: 'button',
      tabindex: '0',
      'aria-label': label,
    });
    const title = createSvgElement('title');
    title.textContent = label;
    area.append(title);

    area.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') {
        return;
      }

      tooltip.textContent = label;
      tooltip.dataset.visible = 'true';
      setTooltipPosition(wrapper, tooltip, event.clientX, event.clientY);
    });

    area.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'touch') {
        setTooltipPosition(wrapper, tooltip, event.clientX, event.clientY);
      }
    });

    area.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'touch' && document.activeElement !== area) {
        hideTooltip();
      }
    });

    area.addEventListener('focus', () => {
      showTooltip(area, label);
    });

    area.addEventListener('blur', hideTooltip);

    area.addEventListener('click', (event) => {
      if (!window.matchMedia('(hover: none)').matches) {
        return;
      }

      event.preventDefault();

      if (touchArea === area) {
        hideTooltip();
        return;
      }

      hideTooltip();
      touchArea = area;
      area.classList.add('is-active');
      showTooltip(area, label);
      touchArea = area;
    });

    overlay.append(area);
  });

  wrapper.append(overlay, tooltip);

  document.addEventListener('pointerdown', (event) => {
    if (touchArea && !wrapper.contains(event.target)) {
      hideTooltip();
    }
  });
}
