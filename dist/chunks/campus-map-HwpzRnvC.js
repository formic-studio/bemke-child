//#region src/js/modules/campus-map.js
var e = "http://www.w3.org/2000/svg", t = ".map-desktop, .map-mobile", n = () => document.documentElement.lang.toLowerCase().startsWith("en"), r = (e, t) => n() ? t : e, i = [
	{
		label: "Wioska Edukacyjna",
		labelEn: "Educational Village",
		points: "3228,1673 3340,1694 3398,1727 3499,1767 3607,1799 3654,1828 3636,1908 3579,2002 3463,2139 3387,2099 3340,2078 3286,2052 3242,2042 3195,2020 3098,1984 3036,1958 3112,1837 3148,1787"
	},
	{
		label: "Przedszkole",
		labelEn: "Preschool",
		points: "3101,2065 3047,2105 2996,2148 2986,2188 3000,2213 3072,2249 3123,2217 3174,2159 3195,2108"
	},
	{
		label: "Collegium Marianum",
		labelEn: "Collegium Marianum",
		points: "2049,1262 2234,1306 2346,1327 2360,1363 2328,1483 2273,1544 2219,1649 2158,1714 2071,1751 1973,1743 1894,1711 1847,1649 1908,1476 1973,1384"
	},
	{
		label: "FarmLab",
		labelEn: "FarmLab",
		points: "2422,2334 2364,2446 2331,2511 2375,2551 2494,2606 2566,2645 2664,2595 2841,2396 2852,2356 2772,2291 2667,2251 2606,2240 2476,2215"
	},
	{
		label: "Hala sportowa",
		labelEn: "Sports hall",
		points: "2982,1601 2899,1717 2921,1749 2996,1778 3072,1807 3105,1782 3152,1731 3166,1680 3170,1655 3130,1619 3069,1604"
	},
	{
		label: "Parking",
		labelEn: "Parking",
		points: "2595,1459 2552,1556 2671,1589 2754,1625 2805,1647 2895,1672 2978,1567"
	},
	{
		label: "Park",
		labelEn: "Park",
		points: "2089,1807 2259,1706 2339,1648 2469,1677 2584,1739 2642,1786 2696,1865 2754,1902 2830,1952 2899,2035 2863,2162 2783,2195 2602,2216 2433,2187 2263,2173 2165,2122 2057,2072 2035,1902"
	},
	{
		label: "Gospodarstwo",
		labelEn: "Farm",
		points: "2107,1236 2169,1250 2288,1279 2451,1312 2512,1225 2577,1116 2592,1087 2490,1051 2523,939 2259,881 2179,1008 2151,1059 2129,1116"
	}
];
function a(t, n = {}) {
	let r = document.createElementNS(e, t);
	return Object.entries(n).forEach(([e, t]) => {
		r.setAttribute(e, t);
	}), r;
}
function o(e, t, n, r) {
	let i = e.getBoundingClientRect(), a = e.closest(".map-block")?.getBoundingClientRect() || i, o = r - i.top, s = t.offsetWidth, c = t.offsetHeight, l = a.left + s / 2 + 8, u = a.right - s / 2 - 8, d = (l > u ? a.left + a.width / 2 : Math.min(Math.max(n, l), u)) - i.left, f = r < a.top + c + 12 + 8;
	t.style.left = `${d}px`, t.style.top = `${o}px`, t.dataset.placement = f ? "below" : "above";
}
function s(e, t, n) {
	let r = n.getBoundingClientRect();
	o(e, t, r.left + r.width / 2, r.top + r.height / 2);
}
function c() {
	let e = document.createElement("div");
	return e.className = "campus-map__controls", e.setAttribute("role", "group"), e.setAttribute("aria-label", r("Sterowanie mapą", "Map controls")), [
		{
			direction: "up",
			label: r("Przesuń widok mapy w górę", "Move map view up")
		},
		{
			direction: "left",
			label: r("Przesuń widok mapy w lewo", "Move map view left")
		},
		{
			direction: "right",
			label: r("Przesuń widok mapy w prawo", "Move map view right")
		},
		{
			direction: "down",
			label: r("Przesuń widok mapy w dół", "Move map view down")
		}
	].forEach(({ direction: t, label: n }) => {
		let r = document.createElement("button");
		r.className = "campus-map__control", r.type = "button", r.dataset.direction = t, r.setAttribute("aria-label", n);
		let i = a("svg", {
			width: "22",
			height: "22",
			viewBox: "0 0 22 22",
			fill: "none",
			"aria-hidden": "true",
			focusable: "false"
		}), o = a("rect", {
			x: "0.340427",
			y: "0.340427",
			width: "21.1065",
			height: "21.1065",
			rx: "3.7447",
			fill: "#F6BA62",
			"fill-opacity": "0.7"
		}), s = a("rect", {
			x: "0.340427",
			y: "0.340427",
			width: "21.1065",
			height: "21.1065",
			rx: "3.7447",
			stroke: "#E0A545",
			"stroke-width": "0.680855"
		}), c = a("path", {
			d: "M6.88976 12.5554L10.8941 8.55108L14.8984 12.5554",
			stroke: "#1B0508",
			"stroke-width": "1.36171",
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		});
		i.append(o, s, c), r.append(i), e.append(r);
	}), e;
}
function l(e, t, n, i) {
	let a = {
		x: 0,
		y: 0
	}, o = null, s = {
		x: 0,
		y: 0
	}, l = {
		x: 0,
		y: 0
	}, u = !1, d = !0, f = () => ({
		minX: Math.min(0, e.clientWidth - t.offsetWidth),
		minY: Math.min(0, e.clientHeight - t.offsetHeight)
	}), p = (e) => {
		let { minX: t, minY: n } = f();
		return {
			x: Math.min(0, Math.max(t, e.x)),
			y: Math.min(0, Math.max(n, e.y))
		};
	}, m = () => {
		t.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`;
	}, h = (e) => {
		a = p(e), m();
	}, g = (e, t = 48) => {
		let n = {
			left: {
				x: t,
				y: 0
			},
			right: {
				x: -t,
				y: 0
			},
			up: {
				x: 0,
				y: t
			},
			down: {
				x: 0,
				y: -t
			}
		}[e];
		n && (i(), h({
			x: a.x + n.x,
			y: a.y + n.y
		}));
	}, _ = () => {
		d ? (a = p({
			x: e.clientWidth / 2 - t.offsetWidth * .64,
			y: e.clientHeight / 2 - t.offsetHeight * .44
		}), d = !1) : a = p(a), m();
	}, v = (n) => {
		o === null || n.pointerId !== o || (e.hasPointerCapture(o) && e.releasePointerCapture(o), u && (t.dataset.dragged = "1", window.setTimeout(() => {
			delete t.dataset.dragged;
		}, 100)), o = null, e.classList.remove("is-dragging"));
	};
	n.forEach((e) => {
		e.draggable = !1;
	}), e.dataset.bemkeCampusMapPan = "1", e.hasAttribute("tabindex") || (e.tabIndex = 0), e.setAttribute("role", "region"), e.setAttribute("aria-label", r("Interaktywna mapa Campus Bemke. Przeciągnij mapę lub użyj klawiszy strzałek.", "Interactive Campus Bemke map. Drag the map or use the arrow keys."));
	let y = c();
	e.append(y), y.addEventListener("click", (e) => {
		let t = e.target.closest(".campus-map__control");
		t && (e.preventDefault(), g(t.dataset.direction));
	}), e.addEventListener("pointerdown", (t) => {
		t.target.closest(".campus-map__controls") || !t.isPrimary || t.pointerType === "mouse" && t.button !== 0 || (o = t.pointerId, s = {
			x: t.clientX,
			y: t.clientY
		}, l = { ...a }, u = !1, e.setPointerCapture(o), e.classList.add("is-dragging"));
	}), e.addEventListener("pointermove", (e) => {
		if (o === null || e.pointerId !== o) return;
		let t = e.clientX - s.x, n = e.clientY - s.y;
		!u && Math.hypot(t, n) > 4 && (u = !0, i()), u && (e.preventDefault(), h({
			x: l.x + t,
			y: l.y + n
		}));
	}), e.addEventListener("pointerup", v), e.addEventListener("pointercancel", v), e.addEventListener("keydown", (e) => {
		let t = e.shiftKey ? 120 : 48, n = {
			ArrowLeft: "left",
			ArrowRight: "right",
			ArrowUp: "up",
			ArrowDown: "down"
		}[e.key];
		n && (e.preventDefault(), g(n, t));
	});
	let b = new ResizeObserver(_);
	b.observe(e), b.observe(t), n.every((e) => e.complete) ? requestAnimationFrame(_) : n.forEach((e) => {
		e.complete || e.addEventListener("load", _, { once: !0 });
	});
}
function u() {
	let e = document.querySelector(t);
	if (!e) return;
	let n = e.closest(".map-block") || e.parentElement;
	if (n.querySelector("[data-bemke-campus-map-ready=\"1\"]")) return;
	let c = Array.from(n.querySelectorAll(t));
	if (!c.length) return;
	n.classList.add("map-block");
	let u = document.createElement("div");
	u.className = "campus-map", u.dataset.bemkeCampusMapReady = "1", e.parentNode.insertBefore(u, e), c.forEach((e) => {
		u.append(e);
	});
	let d = a("svg", {
		class: "campus-map__areas",
		viewBox: "0 0 4096 4092",
		preserveAspectRatio: "xMidYMid meet",
		"aria-label": r("Interaktywna mapa Campus Bemke", "Interactive Campus Bemke map")
	}), f = document.createElement("div");
	f.className = "campus-map__tooltip", f.id = "bemke-campus-map-status", f.setAttribute("role", "status"), f.setAttribute("aria-live", "polite");
	let p = null, m = () => {
		f.removeAttribute("data-visible"), p?.classList.remove("is-active"), p = null;
	}, h = (e, t) => {
		f.textContent = t, f.dataset.visible = "true", s(u, f, e);
	};
	i.forEach(({ label: e, labelEn: t, points: n }) => {
		let i = r(e, t), s = a("polygon", {
			class: "campus-map__area",
			points: n,
			role: "button",
			tabindex: "0",
			"aria-label": i,
			"aria-describedby": f.id
		}), c = a("title");
		c.textContent = i, s.append(c), s.addEventListener("pointerenter", (e) => {
			e.pointerType !== "touch" && (f.textContent = i, f.dataset.visible = "true", o(u, f, e.clientX, e.clientY));
		}), s.addEventListener("pointermove", (e) => {
			e.pointerType !== "touch" && o(u, f, e.clientX, e.clientY);
		}), s.addEventListener("pointerleave", (e) => {
			e.pointerType !== "touch" && document.activeElement !== s && m();
		}), s.addEventListener("focus", () => {
			h(s, i);
		}), s.addEventListener("blur", m), s.addEventListener("click", (e) => {
			if (u.dataset.dragged === "1") {
				e.preventDefault();
				return;
			}
			if (window.matchMedia("(hover: none)").matches) {
				if (e.preventDefault(), p === s) {
					m();
					return;
				}
				m(), p = s, s.classList.add("is-active"), h(s, i), p = s;
			}
		}), s.addEventListener("keydown", (e) => {
			if (!(e.key !== "Enter" && e.key !== " ")) {
				if (e.preventDefault(), p === s && f.dataset.visible === "true") {
					m();
					return;
				}
				m(), p = s, s.classList.add("is-active"), h(s, i), p = s;
			}
		}), d.append(s);
	}), u.append(d, f), l(n, u, c, m), document.addEventListener("pointerdown", (e) => {
		p && !u.contains(e.target) && m();
	});
}
//#endregion
export { u as initCampusMap };
