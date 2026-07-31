import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./font-size-controls-hQ8NHYJR.js";
import { n as r, r as i, t as a } from "./slider-controls-CEzz34oU.js";
//#region src/js/modules/thinktank-slider.js
var o = {
	root: ".slider-thinktank",
	track: ".slider-wrapper",
	slide: ".slide-thinktank",
	title: ".slide-tittle",
	textWrap: ".slider-text-wrapper",
	textSlide: ".slide-text",
	controlsWrap: ".slider-paggination",
	control: a
}, s = "data-thinktank-ready", c = "__bemkeThinktankBooted", l = 2200, u = 3, d = "(max-width: 767px)", f = "(min-width: 768px)", p = {
	rootMargin: "0px 0px -18% 0px",
	threshold: .18
}, m = !1, h = null, g = {
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
}, _ = {
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
}, v = 720, y = "slider-text-track", b = "is-text-ghost";
function x() {
	S(), C();
}
function S(e = document) {
	e.querySelectorAll(o.root).forEach((e) => {
		if (e.getAttribute(s) === "1") {
			typeof e.__bemkeThinktankRefresh == "function" && e.__bemkeThinktankRefresh();
			return;
		}
		if (w()) {
			E(e);
			return;
		}
		e.setAttribute(s, "1"), k(e);
	});
}
function C() {
	if (window[c]) return;
	window[c] = !0;
	let e = $(() => {
		S();
	}, 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), document.addEventListener("bricks/popup/open", e), document.addEventListener("bricks/popup/close", e), document.addEventListener(n, e), window.setTimeout(e, 200), window.setTimeout(e, 800), window.setTimeout(e, 1800), window.matchMedia && window.addEventListener("resize", $(() => {
		S();
	}, 120)), window.matchMedia?.(f).matches && window.addEventListener("scroll", $(() => {
		m || (m = !0, O());
	}, 60), { passive: !0 }), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) if (n.type === "childList" && n.addedNodes.length > 0) {
			for (let t of n.addedNodes) if (t instanceof Element && (t.matches(o.root) || t.querySelector(o.root))) {
				e();
				return;
			}
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function w() {
	return !(!window.matchMedia || !window.IntersectionObserver || !window.matchMedia(f).matches);
}
function T(e) {
	let t = e.getBoundingClientRect();
	return t.top < window.innerHeight && t.bottom > 0;
}
function E(e) {
	if (!window.IntersectionObserver) {
		k(e);
		return;
	}
	if (e.__bemkeThinktankObserved) return;
	let t = D();
	if (!t) {
		k(e);
		return;
	}
	e.__bemkeThinktankObserved = !0, t.observe(e);
}
function D() {
	return h || (h = new IntersectionObserver((e) => {
		e.forEach((e) => {
			if (!e.isIntersecting) return;
			let t = e.target;
			if (m) {
				if (t.__bemkeThinktankObserved = !1, t.getAttribute(s) === "1") {
					h?.unobserve(t);
					return;
				}
				h?.unobserve(t), t.setAttribute(s, "1"), k(t);
			}
		});
	}, p), h);
}
function O() {
	window.IntersectionObserver && document.querySelectorAll(o.root).forEach((e) => {
		e.__bemkeThinktankObserved && e.getAttribute(s) !== "1" && T(e) && (e.__bemkeThinktankObserved = !1, h?.unobserve(e), e.setAttribute(s, "1"), k(e));
	});
}
function k(n) {
	let r = n.querySelector(o.track), i = Array.from(n.querySelectorAll(o.slide)), a = n.querySelector(o.textWrap), s = a ? Array.from(a.querySelectorAll(o.textSlide)) : [];
	if (!r || i.length < 3) return;
	let c = j(n), u = 0, f = !1, p = null, m = !1, h = null, g = null, _ = 0, v = [];
	i.forEach((e, t) => {
		if (e.classList.remove("bricks-lazy-hidden"), e.querySelector(o.title)?.classList.remove("bricks-lazy-hidden"), !e.querySelector(".slide-overlay")) {
			let t = document.createElement("span");
			t.className = "slide-overlay", t.setAttribute("aria-hidden", "true"), e.appendChild(t);
		}
		e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), e.addEventListener("click", () => {
			if (Date.now() < _) return;
			let e = Z(u, t, i.length);
			e !== 0 && x(e > 0 ? 1 : -1, Math.abs(e), !0);
		});
	}), s.forEach((e) => {
		e.classList.remove("bricks-lazy-hidden");
	});
	let y = I(a, s);
	H(i), V(a, s), document.fonts?.ready && document.fonts.ready.then(() => {
		H(i), V(a, s);
	}), M(c, {
		onPause: () => w(),
		onPlay: () => C(!0),
		onPrev: () => x(-1, 1, !0),
		onNext: () => x(1, 1, !0)
	}), n.hasAttribute("tabindex") || n.setAttribute("tabindex", "0"), n.addEventListener("keydown", (e) => {
		if (e.key === "ArrowLeft") {
			e.preventDefault(), x(-1, 1, !0);
			return;
		}
		e.key === "ArrowRight" && (e.preventDefault(), x(1, 1, !0));
	}), b(r), b(a), D(u, u, 0, !0), P(c, f), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			E();
			return;
		}
		T();
	}), window.addEventListener("resize", $(() => {
		v.length = 0, H(i), V(a, s), D(u, u, 0, !0);
	}, 120)), n.__bemkeThinktankRefresh = () => {
		v.length = 0, H(i), V(a, s), D(u, u, 0, !0);
	}, document.addEventListener(t, (e) => {
		e.detail?.reduced && (window.clearTimeout(h), h = null, m = !1, v.length = 0, D(u, u, 0, !0));
	});
	function b(e) {
		e && (e.addEventListener("pointerdown", (t) => {
			if (!(t.pointerType === "mouse" && t.button !== 0)) {
				g = {
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
			if (!g || g.id !== e.pointerId) return;
			let t = e.clientX - g.startX, n = e.clientY - g.startY, r = Math.abs(t), i = Math.abs(n);
			!g.lockedAxis && (r > 8 || i > 8) && (g.lockedAxis = r > i ? "x" : "y"), g.lockedAxis === "x" && (e.preventDefault(), g.moved = !0, g.surface.classList.add("is-dragging"));
		}), e.addEventListener("pointerup", (e) => {
			if (!g || g.id !== e.pointerId) return;
			let t = e.clientX - g.startX, n = e.clientY - g.startY, r = g.moved && Math.abs(t) > 46 && Math.abs(t) > Math.abs(n), i = g.surface;
			g = null, i.classList.remove("is-dragging"), r && (x(t < 0 ? 1 : -1, 1, !0), _ = Date.now() + 260);
		}), e.addEventListener("pointercancel", () => {
			g?.surface && g.surface.classList.remove("is-dragging"), g = null;
		}), e.addEventListener("click", (e) => {
			Date.now() >= _ || (e.preventDefault(), e.stopPropagation());
		}, !0));
	}
	function x(e, t = 1, n = !1) {
		for (let n = 0; n < t; n += 1) v.push(e);
		n && f && T(), S();
	}
	function S() {
		if (m) return;
		let e = v.shift();
		if (!e) return;
		let t = u;
		u = ee(u + e, i.length), D(t, u, e, !1);
	}
	function C(e = !1) {
		f = !0, e && x(1, 1, !1), T(), P(c, f);
	}
	function w() {
		f = !1, E(), P(c, f);
	}
	function T() {
		f && (E(), p = window.setInterval(() => {
			x(1, 1, !1);
		}, l));
	}
	function E() {
		p &&= (window.clearInterval(p), null);
	}
	function D(t, n, a, o) {
		let c = window.matchMedia(d).matches, l = K(i.length, c), u = J(i[0], c), f = o || e() ? 0 : 1100;
		h &&= (window.clearTimeout(h), null), m = f > 0, i.forEach((e, o) => {
			let s = X(o, t, i.length), d = s, p = X(o, n, i.length), m = a === 1 && s === -l && p === l, h = a === -1 && s === l && p === -l;
			m ? d = l + 1 : h && (d = -l - 1);
			let g = W(d, l, u, c), _ = W(p, l, u, c), v = W(s, l, u, c);
			f > 0 ? (m ? A(r, e, v, W(-l - 1, l, u, c), s, -l - 1, l, f) : h && A(r, e, v, W(l + 1, l, u, c), s, l + 1, l, f), U(e, g, !0), q(e, d, l), window.requestAnimationFrame(() => {
				q(e, p, l), U(e, _, !1), e.classList.toggle("is-center", p === 0), e.classList.toggle("is-visible", _.opacity > .01), e.style.pointerEvents = p === 0 ? "auto" : "none";
			})) : (q(e, p, l), U(e, _, !1), e.classList.toggle("is-center", p === 0), e.classList.toggle("is-visible", _.opacity > .01), e.style.pointerEvents = p === 0 ? "auto" : "none");
		}), F(y, s, n, a, f === 0), f > 0 && (h = window.setTimeout(() => {
			h = null, m = !1, S();
		}, f + 34)), f === 0 && (m = !1, S());
	}
}
function A(e, t, n, r, i, a, o, s) {
	let c = t.offsetWidth || t.clientWidth || 324, l = t.offsetHeight || t.clientHeight || 470, u = t.cloneNode(!0);
	u.classList.add("is-ghost", "is-immediate"), u.removeAttribute("id"), u.style.pointerEvents = "none", u.style.width = `${c}px`, u.style.height = `${l}px`, u.setAttribute("aria-hidden", "true"), u.removeAttribute("tabindex"), u.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), e.appendChild(u), U(u, n, !0), q(u, i, o), u.classList.remove("is-center"), u.classList.add("is-visible"), window.requestAnimationFrame(() => {
		u.classList.remove("is-immediate"), q(u, a, o), U(u, r, !1);
	}), window.setTimeout(() => {
		u.remove();
	}, s + 120);
}
function j(e) {
	return i(e, o.controlsWrap, o.control);
}
function M(e, t) {
	N(e.pause, "Pauza autoplay", t.onPause), N(e.play, "Start autoplay", t.onPlay), N(e.prev, "Poprzedni slajd", t.onPrev), N(e.next, "Następny slajd", t.onNext);
}
function N(e, t, n) {
	r(e, {
		label: t,
		handler: n
	});
}
function P(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function F(t, n, r, i = 1, a = !1) {
	if (!n.length) return;
	let o = r % n.length, s = n.findIndex((e) => e.classList.contains("is-active")), c = e(), l = R(s, o, i, n.length), u = a || c || s < 0 || s === o;
	n.forEach((e, t) => {
		let n = t === o;
		e.hidden = !1, e.classList.toggle("is-active", n), e.setAttribute("aria-hidden", n ? "false" : "true");
	}), B(t, l, u), !(u || !z(s, o, i, n.length)) && window.setTimeout(() => {
		B(t, o + 1, !0);
	}, v + 40);
}
function I(e, t) {
	if (!e || !t.length) return null;
	let n = e.querySelector(`:scope > .${y}`);
	if (n) return n;
	let r = document.createElement("div");
	return r.className = y, r.setAttribute("aria-live", "polite"), r.setAttribute("aria-atomic", "true"), e.insertBefore(r, t[0]), r.appendChild(L(t[t.length - 1])), t.forEach((e) => {
		e.hidden = !1, r.appendChild(e);
	}), r.appendChild(L(t[0])), B(r, 1, !0), r;
}
function L(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(b), t.classList.remove("is-active"), t.hidden = !1, t.setAttribute("aria-hidden", "true"), t.removeAttribute("id"), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t;
}
function R(e, t, n, r) {
	return e === r - 1 && t === 0 && n > 0 ? r + 1 : e === 0 && t === r - 1 && n < 0 ? 0 : t + 1;
}
function z(e, t, n, r) {
	return e === r - 1 && t === 0 && n > 0 || e === 0 && t === r - 1 && n < 0;
}
function B(e, t, n = !1) {
	e && (n ? e.classList.add("is-immediate") : e.classList.remove("is-immediate"), e.style.transform = `translate3d(${-t * 100}%, 0, 0)`, n && (e.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove("is-immediate");
	})));
}
function V(e, t) {
	if (!e || !t.length) return;
	let n = 0;
	t.forEach((e) => {
		let t = e.hidden, r = e.style.position, i = e.style.visibility, a = e.style.display;
		e.hidden = !1, e.style.position = "relative", e.style.visibility = "hidden", e.style.display = "flex", n = Math.max(n, e.scrollHeight, e.getBoundingClientRect().height), e.style.position = r, e.style.visibility = i, e.style.display = a, e.hidden = t;
	}), n > 0 && e.style.setProperty("--tt-text-height", `${Math.ceil(n)}px`);
}
function H(e) {
	e.forEach((e) => {
		let t = e.querySelector(o.title);
		if (!t) return;
		t.style.removeProperty("font-size");
		let n = Number.parseFloat(window.getComputedStyle(t).fontSize), r = e.clientHeight * .78;
		if (!Number.isFinite(n) || r <= 0) return;
		let i = n, a = 0;
		for (; a < 40 && i > 18 && (t.scrollWidth > t.clientWidth + 1 || t.scrollHeight > r);) i = Math.max(18, i - 1), t.style.setProperty("font-size", `${i}px`, "important"), a += 1;
	});
}
function U(e, t, n) {
	n ? e.classList.add("is-immediate") : e.classList.remove("is-immediate"), e.style.setProperty("--tx", `${t.x}px`), e.style.setProperty("--scale", `${t.scale}`), e.style.setProperty("--overlay-opacity", `${t.overlayOpacity}`), e.style.opacity = String(t.opacity), e.style.zIndex = String(t.zIndex);
}
function W(e, t, n, r = !1) {
	let i = Math.abs(e), a = e < 0 ? "left" : "right";
	if (e === 0) return {
		x: 0,
		scale: 1,
		overlayOpacity: 0,
		opacity: 1,
		zIndex: 50
	};
	if (i > t) {
		let e = G(a, t, r);
		return {
			x: (a === "left" ? -1 : 1) * n * (e.xFactor + .84),
			scale: e.scale,
			overlayOpacity: e.overlayOpacity,
			opacity: 0,
			zIndex: 1
		};
	}
	let o = G(a, i, r);
	return {
		x: (a === "left" ? -1 : 1) * n * o.xFactor,
		scale: o.scale,
		overlayOpacity: o.overlayOpacity,
		opacity: 1,
		zIndex: 40 - i
	};
}
function G(e, t, n) {
	let r = n ? _ : g, i = g[e];
	return r[e]?.[t] || r[e]?.[1] || i[t] || i[1];
}
function K(e, t) {
	return Math.min(t ? 1 : u, Math.floor((e - 1) / 2));
}
function q(e, t, n) {
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
function J(e, t = !1) {
	let n = e && (e.offsetWidth || e.clientWidth) || 324, r = n > 40 ? n : 324;
	if (t) return Q(r * .42, 76, 124);
	let i = e?.closest?.(o.root), a = Y(i, "--tt-step-factor", .41), s = Y(i, "--tt-step-min", 50), c = Y(i, "--tt-step-max", 110);
	return Q(r * a, s, c);
}
function Y(e, t, n) {
	if (!e) return n;
	let r = Number.parseFloat(window.getComputedStyle(e).getPropertyValue(t));
	return Number.isFinite(r) ? r : n;
}
function X(e, t, n) {
	let r = e - t, i = n / 2;
	return r > i && (r -= n), r < -i && (r += n), r;
}
function Z(e, t, n) {
	let r = t - e, i = n / 2;
	return r > i && (r -= n), r < -i && (r += n), r;
}
function ee(e, t) {
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
export { x as initThinktankSlider };
