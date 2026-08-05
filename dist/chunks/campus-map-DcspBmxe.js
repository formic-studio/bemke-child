//#region src/js/modules/campus-map.js
var e = "http://www.w3.org/2000/svg", t = ".map-desktop, .map-mobile", n = [
	{
		label: "Wioska Edukacyjna",
		points: "3228,1673 3340,1694 3398,1727 3499,1767 3607,1799 3654,1828 3636,1908 3579,2002 3463,2139 3387,2099 3340,2078 3286,2052 3242,2042 3195,2020 3098,1984 3036,1958 3112,1837 3148,1787"
	},
	{
		label: "Przedszkole",
		points: "3101,2065 3047,2105 2996,2148 2986,2188 3000,2213 3072,2249 3123,2217 3174,2159 3195,2108"
	},
	{
		label: "Collegium Marianum",
		points: "2049,1262 2234,1306 2346,1327 2360,1363 2328,1483 2273,1544 2219,1649 2158,1714 2071,1751 1973,1743 1894,1711 1847,1649 1908,1476 1973,1384"
	},
	{
		label: "FarmLab",
		points: "2422,2334 2364,2446 2331,2511 2375,2551 2494,2606 2566,2645 2664,2595 2841,2396 2852,2356 2772,2291 2667,2251 2606,2240 2476,2215"
	},
	{
		label: "Hala sportowa",
		points: "2982,1601 2899,1717 2921,1749 2996,1778 3072,1807 3105,1782 3152,1731 3166,1680 3170,1655 3130,1619 3069,1604"
	},
	{
		label: "Parking",
		points: "2595,1459 2552,1556 2671,1589 2754,1625 2805,1647 2895,1672 2978,1567"
	},
	{
		label: "Park",
		points: "2089,1807 2259,1706 2339,1648 2469,1677 2584,1739 2642,1786 2696,1865 2754,1902 2830,1952 2899,2035 2863,2162 2783,2195 2602,2216 2433,2187 2263,2173 2165,2122 2057,2072 2035,1902"
	},
	{
		label: "Gospodarstwo",
		points: "2107,1236 2169,1250 2288,1279 2451,1312 2512,1225 2577,1116 2592,1087 2490,1051 2523,939 2259,881 2179,1008 2151,1059 2129,1116"
	}
];
function r(t, n = {}) {
	let r = document.createElementNS(e, t);
	return Object.entries(n).forEach(([e, t]) => {
		r.setAttribute(e, t);
	}), r;
}
function i(e, t, n, r) {
	let i = e.getBoundingClientRect(), a = e.closest(".map-block")?.getBoundingClientRect() || i, o = r - i.top, s = t.offsetWidth, c = t.offsetHeight, l = a.left + s / 2 + 8, u = a.right - s / 2 - 8, d = (l > u ? a.left + a.width / 2 : Math.min(Math.max(n, l), u)) - i.left, f = r < a.top + c + 12 + 8;
	t.style.left = `${d}px`, t.style.top = `${o}px`, t.dataset.placement = f ? "below" : "above";
}
function a(e, t, n) {
	let r = n.getBoundingClientRect();
	i(e, t, r.left + r.width / 2, r.top + r.height / 2);
}
function o() {
	let e = document.createElement("div");
	return e.className = "campus-map__controls", e.setAttribute("role", "group"), e.setAttribute("aria-label", "Sterowanie mapą"), [
		{
			direction: "up",
			label: "Przesuń widok mapy w górę"
		},
		{
			direction: "left",
			label: "Przesuń widok mapy w lewo"
		},
		{
			direction: "right",
			label: "Przesuń widok mapy w prawo"
		},
		{
			direction: "down",
			label: "Przesuń widok mapy w dół"
		}
	].forEach(({ direction: t, label: n }) => {
		let i = document.createElement("button");
		i.className = "campus-map__control", i.type = "button", i.dataset.direction = t, i.setAttribute("aria-label", n);
		let a = r("svg", {
			width: "22",
			height: "22",
			viewBox: "0 0 22 22",
			fill: "none",
			"aria-hidden": "true",
			focusable: "false"
		}), o = r("rect", {
			x: "0.340427",
			y: "0.340427",
			width: "21.1065",
			height: "21.1065",
			rx: "3.7447",
			fill: "#F6BA62",
			"fill-opacity": "0.7"
		}), s = r("rect", {
			x: "0.340427",
			y: "0.340427",
			width: "21.1065",
			height: "21.1065",
			rx: "3.7447",
			stroke: "#E0A545",
			"stroke-width": "0.680855"
		}), c = r("path", {
			d: "M6.88976 12.5554L10.8941 8.55108L14.8984 12.5554",
			stroke: "#1B0508",
			"stroke-width": "1.36171",
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		});
		a.append(o, s, c), i.append(a), e.append(i);
	}), e;
}
function s(e, t, n, r) {
	let i = {
		x: 0,
		y: 0
	}, a = null, s = {
		x: 0,
		y: 0
	}, c = {
		x: 0,
		y: 0
	}, l = !1, u = !0, d = () => ({
		minX: Math.min(0, e.clientWidth - t.offsetWidth),
		minY: Math.min(0, e.clientHeight - t.offsetHeight)
	}), f = (e) => {
		let { minX: t, minY: n } = d();
		return {
			x: Math.min(0, Math.max(t, e.x)),
			y: Math.min(0, Math.max(n, e.y))
		};
	}, p = () => {
		t.style.transform = `translate3d(${i.x}px, ${i.y}px, 0)`;
	}, m = (e) => {
		i = f(e), p();
	}, h = (e, t = 48) => {
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
		n && (r(), m({
			x: i.x + n.x,
			y: i.y + n.y
		}));
	}, g = () => {
		u ? (i = f({
			x: e.clientWidth / 2 - t.offsetWidth * .64,
			y: e.clientHeight / 2 - t.offsetHeight * .44
		}), u = !1) : i = f(i), p();
	}, _ = (n) => {
		a === null || n.pointerId !== a || (e.hasPointerCapture(a) && e.releasePointerCapture(a), l && (t.dataset.dragged = "1", window.setTimeout(() => {
			delete t.dataset.dragged;
		}, 100)), a = null, e.classList.remove("is-dragging"));
	};
	n.forEach((e) => {
		e.draggable = !1;
	}), e.dataset.bemkeCampusMapPan = "1", e.hasAttribute("tabindex") || (e.tabIndex = 0), e.setAttribute("role", "region"), e.setAttribute("aria-label", "Interaktywna mapa Campus Bemke. Przeciągnij mapę lub użyj klawiszy strzałek.");
	let v = o();
	e.append(v), v.addEventListener("click", (e) => {
		let t = e.target.closest(".campus-map__control");
		t && (e.preventDefault(), h(t.dataset.direction));
	}), e.addEventListener("pointerdown", (t) => {
		t.target.closest(".campus-map__controls") || !t.isPrimary || t.pointerType === "mouse" && t.button !== 0 || (a = t.pointerId, s = {
			x: t.clientX,
			y: t.clientY
		}, c = { ...i }, l = !1, e.setPointerCapture(a), e.classList.add("is-dragging"));
	}), e.addEventListener("pointermove", (e) => {
		if (a === null || e.pointerId !== a) return;
		let t = e.clientX - s.x, n = e.clientY - s.y;
		!l && Math.hypot(t, n) > 4 && (l = !0, r()), l && (e.preventDefault(), m({
			x: c.x + t,
			y: c.y + n
		}));
	}), e.addEventListener("pointerup", _), e.addEventListener("pointercancel", _), e.addEventListener("keydown", (e) => {
		let t = e.shiftKey ? 120 : 48, n = {
			ArrowLeft: "left",
			ArrowRight: "right",
			ArrowUp: "up",
			ArrowDown: "down"
		}[e.key];
		n && (e.preventDefault(), h(n, t));
	});
	let y = new ResizeObserver(g);
	y.observe(e), y.observe(t), n.every((e) => e.complete) ? requestAnimationFrame(g) : n.forEach((e) => {
		e.complete || e.addEventListener("load", g, { once: !0 });
	});
}
function c() {
	let e = document.querySelector(t);
	if (!e) return;
	let o = e.closest(".map-block") || e.parentElement;
	if (o.querySelector("[data-bemke-campus-map-ready=\"1\"]")) return;
	let c = Array.from(o.querySelectorAll(t));
	if (!c.length) return;
	o.classList.add("map-block");
	let l = document.createElement("div");
	l.className = "campus-map", l.dataset.bemkeCampusMapReady = "1", e.parentNode.insertBefore(l, e), c.forEach((e) => {
		l.append(e);
	});
	let u = r("svg", {
		class: "campus-map__areas",
		viewBox: "0 0 4096 4092",
		preserveAspectRatio: "xMidYMid meet",
		"aria-label": "Interaktywna mapa Campus Bemke"
	}), d = document.createElement("div");
	d.className = "campus-map__tooltip", d.id = "bemke-campus-map-status", d.setAttribute("role", "status"), d.setAttribute("aria-live", "polite");
	let f = null, p = () => {
		d.removeAttribute("data-visible"), f?.classList.remove("is-active"), f = null;
	}, m = (e, t) => {
		d.textContent = t, d.dataset.visible = "true", a(l, d, e);
	};
	n.forEach(({ label: e, points: t }) => {
		let n = r("polygon", {
			class: "campus-map__area",
			points: t,
			role: "button",
			tabindex: "0",
			"aria-label": e,
			"aria-describedby": d.id
		}), a = r("title");
		a.textContent = e, n.append(a), n.addEventListener("pointerenter", (t) => {
			t.pointerType !== "touch" && (d.textContent = e, d.dataset.visible = "true", i(l, d, t.clientX, t.clientY));
		}), n.addEventListener("pointermove", (e) => {
			e.pointerType !== "touch" && i(l, d, e.clientX, e.clientY);
		}), n.addEventListener("pointerleave", (e) => {
			e.pointerType !== "touch" && document.activeElement !== n && p();
		}), n.addEventListener("focus", () => {
			m(n, e);
		}), n.addEventListener("blur", p), n.addEventListener("click", (t) => {
			if (l.dataset.dragged === "1") {
				t.preventDefault();
				return;
			}
			if (window.matchMedia("(hover: none)").matches) {
				if (t.preventDefault(), f === n) {
					p();
					return;
				}
				p(), f = n, n.classList.add("is-active"), m(n, e), f = n;
			}
		}), n.addEventListener("keydown", (t) => {
			if (!(t.key !== "Enter" && t.key !== " ")) {
				if (t.preventDefault(), f === n && d.dataset.visible === "true") {
					p();
					return;
				}
				p(), f = n, n.classList.add("is-active"), m(n, e), f = n;
			}
		}), u.append(n);
	}), l.append(u, d), s(o, l, c, p), document.addEventListener("pointerdown", (e) => {
		f && !l.contains(e.target) && p();
	});
}
//#endregion
export { c as initCampusMap };
