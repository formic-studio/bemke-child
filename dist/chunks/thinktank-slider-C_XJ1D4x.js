import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./font-size-controls-hQ8NHYJR.js";
import { i as r, n as i, r as a, t as o } from "./touch-swipe-fallback-C_mGjsy9.js";
//#region src/js/modules/thinktank-slider.js
var s = {
	root: ".slider-thinktank",
	track: ".slider-wrapper",
	slide: ".slide-thinktank",
	title: ".slide-tittle",
	textWrap: ".slider-text-wrapper",
	textSlide: ".slide-text",
	controlsWrap: ".slider-paggination",
	control: i
}, c = "data-thinktank-ready", l = "__bemkeThinktankBooted", u = 2200, d = 3, f = "(max-width: 767px)", p = "(min-width: 768px)", m = {
	rootMargin: "0px 0px -18% 0px",
	threshold: .18
}, h = !1, g = null, _ = {
	left: {
		1: {
			xFactor: 2.4,
			clipPath: "polygon(0 0, 74% 16%, 74% 84%, 0 100%)",
			overlayOpacity: .62,
			scale: .93
		},
		2: {
			xFactor: 4.225,
			clipPath: "polygon(0 0, 72% 17%, 72% 83%, 0 100%)",
			overlayOpacity: .66,
			scale: .9
		},
		3: {
			xFactor: 6.2,
			clipPath: "polygon(0 0, 70% 18%, 70% 82%, 0 100%)",
			overlayOpacity: .7,
			scale: .87
		}
	},
	right: {
		1: {
			xFactor: 2.4,
			clipPath: "polygon(26% 16%, 100% 0, 100% 100%, 26% 84%)",
			overlayOpacity: .62,
			scale: .93
		},
		2: {
			xFactor: 4.225,
			clipPath: "polygon(28% 17%, 100% 0, 100% 100%, 28% 83%)",
			overlayOpacity: .66,
			scale: .9
		},
		3: {
			xFactor: 6.2,
			clipPath: "polygon(30% 18%, 100% 0, 100% 100%, 30% 82%)",
			overlayOpacity: .7,
			scale: .87
		}
	}
}, v = {
	left: { 1: {
		xFactor: 3.2,
		overlayOpacity: 0,
		scale: 1
	} },
	right: { 1: {
		xFactor: 3.2,
		overlayOpacity: 0,
		scale: 1
	} }
}, y = 720, b = "slider-text-track", x = "is-text-ghost";
function S() {
	C(), w();
}
function C(e = document) {
	e.querySelectorAll(s.root).forEach((e) => {
		if (e.getAttribute(c) === "1") {
			typeof e.__bemkeThinktankRefresh == "function" && e.__bemkeThinktankRefresh();
			return;
		}
		if (T()) {
			D(e);
			return;
		}
		e.setAttribute(c, "1"), A(e);
	});
}
function w() {
	if (window[l]) return;
	window[l] = !0;
	let e = $(() => {
		C();
	}, 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), document.addEventListener("bricks/popup/open", e), document.addEventListener("bricks/popup/close", e), document.addEventListener(n, e), window.setTimeout(e, 200), window.setTimeout(e, 800), window.setTimeout(e, 1800), window.matchMedia && window.addEventListener("resize", $(() => {
		C();
	}, 120)), window.matchMedia?.(p).matches && window.addEventListener("scroll", $(() => {
		h || (h = !0, k());
	}, 60), { passive: !0 }), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) if (n.type === "childList" && n.addedNodes.length > 0) {
			for (let t of n.addedNodes) if (t instanceof Element && (t.matches(s.root) || t.querySelector(s.root))) {
				e();
				return;
			}
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function T() {
	return !(!window.matchMedia || !window.IntersectionObserver || !window.matchMedia(p).matches);
}
function E(e) {
	let t = e.getBoundingClientRect();
	return t.top < window.innerHeight && t.bottom > 0;
}
function D(e) {
	if (!window.IntersectionObserver) {
		A(e);
		return;
	}
	if (e.__bemkeThinktankObserved) return;
	let t = O();
	if (!t) {
		A(e);
		return;
	}
	e.__bemkeThinktankObserved = !0, t.observe(e);
}
function O() {
	return g || (g = new IntersectionObserver((e) => {
		e.forEach((e) => {
			if (!e.isIntersecting) return;
			let t = e.target;
			if (h) {
				if (t.__bemkeThinktankObserved = !1, t.getAttribute(c) === "1") {
					g?.unobserve(t);
					return;
				}
				g?.unobserve(t), t.setAttribute(c, "1"), A(t);
			}
		});
	}, m), g);
}
function k() {
	window.IntersectionObserver && document.querySelectorAll(s.root).forEach((e) => {
		e.__bemkeThinktankObserved && e.getAttribute(c) !== "1" && E(e) && (e.__bemkeThinktankObserved = !1, g?.unobserve(e), e.setAttribute(c, "1"), A(e));
	});
}
function A(n) {
	let r = n.querySelector(s.track), i = Array.from(n.querySelectorAll(s.slide)), a = n.querySelector(s.textWrap), c = a ? Array.from(a.querySelectorAll(s.textSlide)) : [];
	if (!r || i.length < 3) return;
	let l = M(n), d = 0, p = !1, m = null, h = !1, g = null, _ = null, v = 0, y = [];
	i.forEach((e, t) => {
		if (e.classList.remove("bricks-lazy-hidden"), e.querySelector(s.title)?.classList.remove("bricks-lazy-hidden"), !e.querySelector(".slide-overlay")) {
			let t = document.createElement("span");
			t.className = "slide-overlay", t.setAttribute("aria-hidden", "true"), e.appendChild(t);
		}
		e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), e.addEventListener("click", () => {
			if (Date.now() < v) return;
			let e = ee(d, t, i.length);
			e !== 0 && S(e > 0 ? 1 : -1, Math.abs(e), !0);
		});
	}), c.forEach((e) => {
		e.classList.remove("bricks-lazy-hidden");
	});
	let b = L(a, c);
	U(i), H(a, c), document.fonts?.ready && document.fonts.ready.then(() => {
		U(i), H(a, c);
	}), N(l, {
		onPause: () => T(),
		onPlay: () => w(!0),
		onPrev: () => S(-1, 1, !0),
		onNext: () => S(1, 1, !0)
	}), n.hasAttribute("tabindex") || n.setAttribute("tabindex", "0"), n.addEventListener("keydown", (e) => {
		if (e.key === "ArrowLeft") {
			e.preventDefault(), S(-1, 1, !0);
			return;
		}
		e.key === "ArrowRight" && (e.preventDefault(), S(1, 1, !0));
	}), x(r), x(a), O(d, d, 0, !0), F(l, p), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			D();
			return;
		}
		E();
	}), window.addEventListener("resize", $(() => {
		y.length = 0, U(i), H(a, c), O(d, d, 0, !0);
	}, 120)), n.__bemkeThinktankRefresh = () => {
		y.length = 0, U(i), H(a, c), O(d, d, 0, !0);
	}, document.addEventListener(t, (e) => {
		e.detail?.reduced && (window.clearTimeout(g), g = null, h = !1, y.length = 0, O(d, d, 0, !0));
	});
	function x(e) {
		if (!e) return;
		let t = o(e, {
			onMove: () => {
				e.classList.add("is-dragging");
			},
			onSwipe: ({ direction: t }) => {
				e.classList.remove("is-dragging"), S(t, 1, !0), v = Date.now() + 260;
			},
			onCancel: () => {
				e.classList.remove("is-dragging");
			},
			threshold: 46
		});
		e.addEventListener("pointerdown", (t) => {
			if (!(t.pointerType === "mouse" && t.button !== 0)) {
				_ = {
					id: t.pointerId,
					startX: t.clientX,
					startY: t.clientY,
					moved: !1,
					lockedAxis: null,
					surface: e
				};
				try {
					e.setPointerCapture(t.pointerId);
				} catch {}
			}
		}), e.addEventListener("pointermove", (e) => {
			if (!_ || _.id !== e.pointerId) return;
			let t = e.clientX - _.startX, n = e.clientY - _.startY, r = Math.abs(t), i = Math.abs(n);
			!_.lockedAxis && (r > 8 || i > 8) && (_.lockedAxis = r > i ? "x" : "y"), _.lockedAxis === "x" && (e.preventDefault(), _.moved = !0, _.surface.classList.add("is-dragging"));
		}), e.addEventListener("pointerup", (e) => {
			if (!_ || _.id !== e.pointerId) return;
			let n = e.clientX - _.startX, r = e.clientY - _.startY, i = _.moved && Math.abs(n) > 46 && Math.abs(n) > Math.abs(r), a = _.surface, o = _.moved;
			_ = null, a.classList.remove("is-dragging"), o && t.markPointerHandled(), i && (S(n < 0 ? 1 : -1, 1, !0), v = Date.now() + 260);
		}), e.addEventListener("pointercancel", () => {
			_?.surface && _.surface.classList.remove("is-dragging"), _ = null;
		}), e.addEventListener("click", (e) => {
			Date.now() >= v || (e.preventDefault(), e.stopPropagation());
		}, !0);
	}
	function S(e, t = 1, n = !1) {
		for (let n = 0; n < t; n += 1) y.push(e);
		n && p && E(), C();
	}
	function C() {
		if (h) return;
		let e = y.shift();
		if (!e) return;
		let t = d;
		d = te(d + e, i.length), O(t, d, e, !1);
	}
	function w(e = !1) {
		p = !0, e && S(1, 1, !1), E(), F(l, p);
	}
	function T() {
		p = !1, D(), F(l, p);
	}
	function E() {
		p && (D(), m = window.setInterval(() => {
			S(1, 1, !1);
		}, u));
	}
	function D() {
		m &&= (window.clearInterval(m), null);
	}
	function O(t, n, a, o) {
		let s = window.matchMedia(f).matches, l = q(i.length, s), u = Y(i[0], s), d = o || e() ? 0 : 1100;
		g &&= (window.clearTimeout(g), null), h = d > 0, i.forEach((e, o) => {
			let c = Z(o, t, i.length), f = c, p = Z(o, n, i.length), m = a === 1 && c === -l && p === l, h = a === -1 && c === l && p === -l;
			m ? f = l + 1 : h && (f = -l - 1);
			let g = G(f, l, u, s), _ = G(p, l, u, s), v = G(c, l, u, s);
			d > 0 ? (m ? j(r, e, v, G(-l - 1, l, u, s), c, -l - 1, l, d) : h && j(r, e, v, G(l + 1, l, u, s), c, l + 1, l, d), W(e, g, !0), J(e, f, l), window.requestAnimationFrame(() => {
				J(e, p, l), W(e, _, !1), e.classList.toggle("is-center", p === 0), e.classList.toggle("is-visible", _.opacity > .01), e.style.pointerEvents = p === 0 ? "auto" : "none";
			})) : (J(e, p, l), W(e, _, !1), e.classList.toggle("is-center", p === 0), e.classList.toggle("is-visible", _.opacity > .01), e.style.pointerEvents = p === 0 ? "auto" : "none");
		}), I(b, c, n, a, d === 0), d > 0 && (g = window.setTimeout(() => {
			g = null, h = !1, C();
		}, d + 34)), d === 0 && (h = !1, C());
	}
}
function j(e, t, n, r, i, a, o, s) {
	let c = t.offsetWidth || t.clientWidth || 324, l = t.offsetHeight || t.clientHeight || 470, u = t.cloneNode(!0);
	u.classList.add("is-ghost", "is-immediate"), u.removeAttribute("id"), u.style.pointerEvents = "none", u.style.width = `${c}px`, u.style.height = `${l}px`, u.setAttribute("aria-hidden", "true"), u.removeAttribute("tabindex"), u.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), e.appendChild(u), W(u, n, !0), J(u, i, o), u.classList.remove("is-center"), u.classList.add("is-visible"), window.requestAnimationFrame(() => {
		u.classList.remove("is-immediate"), J(u, a, o), W(u, r, !1);
	}), window.setTimeout(() => {
		u.remove();
	}, s + 120);
}
function M(e) {
	return r(e, s.controlsWrap, s.control);
}
function N(e, t) {
	P(e.pause, "Pauza autoplay", t.onPause), P(e.play, "Start autoplay", t.onPlay), P(e.prev, "Poprzedni slajd", t.onPrev), P(e.next, "Następny slajd", t.onNext);
}
function P(e, t, n) {
	a(e, {
		label: t,
		handler: n
	});
}
function F(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function I(t, n, r, i = 1, a = !1) {
	if (!n.length) return;
	let o = r % n.length, s = n.findIndex((e) => e.classList.contains("is-active")), c = e(), l = z(s, o, i, n.length), u = a || c || s < 0 || s === o;
	n.forEach((e, t) => {
		let n = t === o;
		e.hidden = !1, e.classList.toggle("is-active", n), e.setAttribute("aria-hidden", n ? "false" : "true");
	}), V(t, l, u), !(u || !B(s, o, i, n.length)) && window.setTimeout(() => {
		V(t, o + 1, !0);
	}, y + 40);
}
function L(e, t) {
	if (!e || !t.length) return null;
	let n = e.querySelector(`:scope > .${b}`);
	if (n) return n;
	let r = document.createElement("div");
	return r.className = b, r.setAttribute("aria-live", "polite"), r.setAttribute("aria-atomic", "true"), e.insertBefore(r, t[0]), r.appendChild(R(t[t.length - 1])), t.forEach((e) => {
		e.hidden = !1, r.appendChild(e);
	}), r.appendChild(R(t[0])), V(r, 1, !0), r;
}
function R(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(x), t.classList.remove("is-active"), t.hidden = !1, t.setAttribute("aria-hidden", "true"), t.removeAttribute("id"), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t;
}
function z(e, t, n, r) {
	return e === r - 1 && t === 0 && n > 0 ? r + 1 : e === 0 && t === r - 1 && n < 0 ? 0 : t + 1;
}
function B(e, t, n, r) {
	return e === r - 1 && t === 0 && n > 0 || e === 0 && t === r - 1 && n < 0;
}
function V(e, t, n = !1) {
	e && (n ? e.classList.add("is-immediate") : e.classList.remove("is-immediate"), e.style.transform = `translate3d(${-t * 100}%, 0, 0)`, n && (e.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove("is-immediate");
	})));
}
function H(e, t) {
	if (!e || !t.length) return;
	let n = 0;
	t.forEach((e) => {
		let t = e.hidden, r = e.style.position, i = e.style.visibility, a = e.style.display;
		e.hidden = !1, e.style.position = "relative", e.style.visibility = "hidden", e.style.display = "flex", n = Math.max(n, e.scrollHeight, e.getBoundingClientRect().height), e.style.position = r, e.style.visibility = i, e.style.display = a, e.hidden = t;
	}), n > 0 && e.style.setProperty("--tt-text-height", `${Math.ceil(n)}px`);
}
function U(e) {
	e.forEach((e) => {
		let t = e.querySelector(s.title);
		if (!t) return;
		t.style.removeProperty("font-size");
		let n = Number.parseFloat(window.getComputedStyle(t).fontSize), r = e.clientHeight * .78;
		if (!Number.isFinite(n) || r <= 0) return;
		let i = n, a = 0;
		for (; a < 40 && i > 18 && (t.scrollWidth > t.clientWidth + 1 || t.scrollHeight > r);) i = Math.max(18, i - 1), t.style.setProperty("font-size", `${i}px`, "important"), a += 1;
	});
}
function W(e, t, n) {
	n ? e.classList.add("is-immediate") : e.classList.remove("is-immediate"), e.style.setProperty("--tx", `${t.x}px`), e.style.setProperty("--scale", `${t.scale}`), e.style.setProperty("--overlay-opacity", `${t.overlayOpacity}`), e.style.opacity = String(t.opacity), e.style.zIndex = String(t.zIndex);
}
function G(e, t, n, r = !1) {
	let i = Math.abs(e), a = e < 0 ? "left" : "right";
	if (e === 0) return {
		x: 0,
		scale: 1,
		overlayOpacity: 0,
		opacity: 1,
		zIndex: 50
	};
	if (i > t) {
		let e = K(a, t, r);
		return {
			x: (a === "left" ? -1 : 1) * n * (e.xFactor + .84),
			scale: e.scale,
			overlayOpacity: e.overlayOpacity,
			opacity: 0,
			zIndex: 1
		};
	}
	let o = K(a, i, r);
	return {
		x: (a === "left" ? -1 : 1) * n * o.xFactor,
		scale: o.scale,
		overlayOpacity: o.overlayOpacity,
		opacity: 1,
		zIndex: 40 - i
	};
}
function K(e, t, n) {
	let r = n ? v : _, i = _[e];
	return r[e]?.[t] || r[e]?.[1] || i[t] || i[1];
}
function q(e, t) {
	return Math.min(t ? 1 : d, Math.floor((e - 1) / 2));
}
function J(e, t, n) {
	if (e.classList.remove("is-slot-center", "is-slot-left-1", "is-slot-left-2", "is-slot-left-3", "is-slot-right-1", "is-slot-right-2", "is-slot-right-3", "is-slot-hidden-left", "is-slot-hidden-right"), t === 0) {
		e.classList.add("is-slot-center");
		return;
	}
	let r = Math.abs(t);
	if (r > n) {
		e.classList.add(t < 0 ? "is-slot-hidden-left" : "is-slot-hidden-right");
		return;
	}
	e.classList.add(t < 0 ? `is-slot-left-${r}` : `is-slot-right-${r}`);
}
function Y(e, t = !1) {
	let n = e && (e.offsetWidth || e.clientWidth) || 324, r = n > 40 ? n : 324;
	if (t) return Q(r * .42, 76, 124);
	let i = e?.closest?.(s.root), a = X(i, "--tt-step-factor", .41), o = X(i, "--tt-step-min", 50), c = X(i, "--tt-step-max", 110);
	return Q(r * a, o, c);
}
function X(e, t, n) {
	if (!e) return n;
	let r = Number.parseFloat(window.getComputedStyle(e).getPropertyValue(t));
	return Number.isFinite(r) ? r : n;
}
function Z(e, t, n) {
	let r = e - t, i = n / 2;
	return r > i && (r -= n), r < -i && (r += n), r;
}
function ee(e, t, n) {
	let r = t - e, i = n / 2;
	return r > i && (r -= n), r < -i && (r += n), r;
}
function te(e, t) {
	return (e + t) % t;
}
function Q(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function $(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { S as initThinktankSlider };
