import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { n } from "./site-language-BMLr3i6q.js";
import { t as r } from "./font-size-controls-CJ-nO-IF.js";
import { a as i, i as a, n as o, r as s, t as c } from "./touch-swipe-fallback-CD-fh-eJ.js";
//#region src/js/modules/thinktank-slider.js
var l = {
	root: ".slider-thinktank",
	track: ".slider-wrapper",
	slide: ".slide-thinktank",
	title: ".slide-tittle",
	textWrap: ".slider-text-wrapper",
	textSlide: ".slide-text",
	controlsWrap: ".slider-paggination",
	control: o
}, u = "data-thinktank-ready", d = "__bemkeThinktankBooted", f = 2200, p = 3, m = "(max-width: 767px)", h = "(min-width: 768px)", g = {
	rootMargin: "0px 0px -18% 0px",
	threshold: .18
}, _ = !1, v = null, y = {
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
}, b = {
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
}, x = 720, S = "slider-text-track", C = "is-text-ghost";
function w() {
	T(), E();
}
function T(e = document) {
	e.querySelectorAll(l.root).forEach((e) => {
		if (e.getAttribute(u) === "1") {
			typeof e.__bemkeThinktankRefresh == "function" && e.__bemkeThinktankRefresh();
			return;
		}
		if (D()) {
			k(e);
			return;
		}
		e.setAttribute(u, "1"), M(e);
	});
}
function E() {
	if (window[d]) return;
	window[d] = !0;
	let e = $(() => {
		T();
	}, 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), document.addEventListener("bricks/popup/open", e), document.addEventListener("bricks/popup/close", e), document.addEventListener(r, e), window.setTimeout(e, 200), window.setTimeout(e, 800), window.setTimeout(e, 1800), window.matchMedia && window.addEventListener("resize", $(() => {
		T();
	}, 120)), window.matchMedia?.(h).matches && window.addEventListener("scroll", $(() => {
		_ || (_ = !0, j());
	}, 60), { passive: !0 }), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) if (n.type === "childList" && n.addedNodes.length > 0) {
			for (let t of n.addedNodes) if (t instanceof Element && (t.matches(l.root) || t.querySelector(l.root))) {
				e();
				return;
			}
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function D() {
	return !(!window.matchMedia || !window.IntersectionObserver || !window.matchMedia(h).matches);
}
function O(e) {
	let t = e.getBoundingClientRect();
	return t.top < window.innerHeight && t.bottom > 0;
}
function k(e) {
	if (!window.IntersectionObserver) {
		M(e);
		return;
	}
	if (e.__bemkeThinktankObserved) return;
	let t = A();
	if (!t) {
		M(e);
		return;
	}
	e.__bemkeThinktankObserved = !0, t.observe(e);
}
function A() {
	return v || (v = new IntersectionObserver((e) => {
		e.forEach((e) => {
			if (!e.isIntersecting) return;
			let t = e.target;
			if (_) {
				if (t.__bemkeThinktankObserved = !1, t.getAttribute(u) === "1") {
					v?.unobserve(t);
					return;
				}
				v?.unobserve(t), t.setAttribute(u, "1"), M(t);
			}
		});
	}, g), v);
}
function j() {
	window.IntersectionObserver && document.querySelectorAll(l.root).forEach((e) => {
		e.__bemkeThinktankObserved && e.getAttribute(u) !== "1" && O(e) && (e.__bemkeThinktankObserved = !1, v?.unobserve(e), e.setAttribute(u, "1"), M(e));
	});
}
function M(r) {
	let a = r.querySelector(l.track), o = Array.from(r.querySelectorAll(l.slide)), s = r.querySelector(l.textWrap), u = s ? Array.from(s.querySelectorAll(l.textSlide)) : [];
	if (!a || o.length < 3) return;
	let d = P(r), p = 0, h = !1, g = null, _ = !1, v = null, y = null, b = 0, x = [];
	r.setAttribute("role", "region"), r.setAttribute("aria-roledescription", n("karuzela", "carousel")), !r.hasAttribute("aria-label") && !r.hasAttribute("aria-labelledby") && r.setAttribute("aria-label", n("Aktualności Think Tanku", "Think Tank news")), o.forEach((e, t) => {
		if (e.classList.remove("bricks-lazy-hidden"), e.querySelector(l.title)?.classList.remove("bricks-lazy-hidden"), !e.querySelector(".slide-overlay")) {
			let t = document.createElement("span");
			t.className = "slide-overlay", t.setAttribute("aria-hidden", "true"), e.appendChild(t);
		}
		let r = e.querySelector(l.title)?.textContent?.replace(/\s+/g, " ").trim();
		e.removeAttribute("tabindex"), e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", n("slajd", "slide")), e.setAttribute("aria-label", `${r ? `${r}, ` : ""}${n(`slajd ${t + 1} z ${o.length}`, `slide ${t + 1} of ${o.length}`)}`);
	}), u.forEach((e) => {
		e.classList.remove("bricks-lazy-hidden");
	});
	let S = z(s, u);
	G(o), W(s, u), document.fonts?.ready && document.fonts.ready.then(() => {
		G(o), W(s, u);
	}), F(d, {
		onPause: () => D(),
		onPlay: () => E(!0),
		onPrev: () => w(-1, 1, !0),
		onNext: () => w(1, 1, !0)
	}), r.hasAttribute("tabindex") || r.setAttribute("tabindex", "0"), r.addEventListener("keydown", (e) => {
		if (!i(e)) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), w(-1, 1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), w(1, 1, !0));
		}
	}), C(a), C(s), A(p, p, 0, !0), L(d, h), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			k();
			return;
		}
		O();
	}), window.addEventListener("resize", $(() => {
		x.length = 0, G(o), W(s, u), A(p, p, 0, !0);
	}, 120)), r.__bemkeThinktankRefresh = () => {
		x.length = 0, G(o), W(s, u), A(p, p, 0, !0);
	}, document.addEventListener(t, (e) => {
		e.detail?.reduced && (window.clearTimeout(v), v = null, _ = !1, x.length = 0, A(p, p, 0, !0));
	});
	function C(e) {
		if (!e) return;
		let t = c(e, {
			onMove: () => {
				e.classList.add("is-dragging");
			},
			onSwipe: ({ direction: t }) => {
				e.classList.remove("is-dragging"), w(t, 1, !0), b = Date.now() + 260;
			},
			onCancel: () => {
				e.classList.remove("is-dragging");
			},
			threshold: 46
		});
		e.addEventListener("pointerdown", (t) => {
			if (!(t.pointerType === "mouse" && t.button !== 0)) {
				y = {
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
			if (!y || y.id !== e.pointerId) return;
			let t = e.clientX - y.startX, n = e.clientY - y.startY, r = Math.abs(t), i = Math.abs(n);
			!y.lockedAxis && (r > 8 || i > 8) && (y.lockedAxis = r > i ? "x" : "y"), y.lockedAxis === "x" && (e.preventDefault(), y.moved = !0, y.surface.classList.add("is-dragging"));
		}), e.addEventListener("pointerup", (e) => {
			if (!y || y.id !== e.pointerId) return;
			let n = e.clientX - y.startX, r = e.clientY - y.startY, i = y.moved && Math.abs(n) > 46 && Math.abs(n) > Math.abs(r), a = y.surface, o = y.moved;
			y = null, a.classList.remove("is-dragging"), o && t.markPointerHandled(), i && (w(n < 0 ? 1 : -1, 1, !0), b = Date.now() + 260);
		}), e.addEventListener("pointercancel", () => {
			y?.surface && y.surface.classList.remove("is-dragging"), y = null;
		}), e.addEventListener("click", (e) => {
			Date.now() >= b || (e.preventDefault(), e.stopPropagation());
		}, !0);
	}
	function w(e, t = 1, n = !1) {
		for (let n = 0; n < t; n += 1) x.push(e);
		n && h && O(), T();
	}
	function T() {
		if (_) return;
		let e = x.shift();
		if (!e) return;
		let t = p;
		p = ne(p + e, o.length), A(t, p, e, !1);
	}
	function E(e = !1) {
		h = !0, e && w(1, 1, !1), O(), L(d, h);
	}
	function D() {
		h = !1, k(), L(d, h);
	}
	function O() {
		h && (k(), g = window.setInterval(() => {
			w(1, 1, !1);
		}, f));
	}
	function k() {
		g &&= (window.clearInterval(g), null);
	}
	function A(t, n, r, i) {
		let s = window.matchMedia(m).matches, c = ee(o.length, s), l = te(o[0], s), d = i || e() ? 0 : 1100;
		v &&= (window.clearTimeout(v), null), _ = d > 0, o.forEach((e, i) => {
			let u = Z(i, t, o.length), f = u, p = Z(i, n, o.length), m = r === 1 && u === -c && p === c, h = r === -1 && u === c && p === -c;
			m ? f = c + 1 : h && (f = -c - 1);
			let g = q(f, c, l, s), _ = q(p, c, l, s), v = q(u, c, l, s);
			d > 0 ? (m ? N(a, e, v, q(-c - 1, c, l, s), u, -c - 1, c, d) : h && N(a, e, v, q(c + 1, c, l, s), u, c + 1, c, d), K(e, g, !0), Y(e, f, c), window.requestAnimationFrame(() => {
				Y(e, p, c), K(e, _, !1), e.classList.toggle("is-center", p === 0), e.classList.toggle("is-visible", _.opacity > .01), e.style.pointerEvents = p === 0 ? "auto" : "none";
			})) : (Y(e, p, c), K(e, _, !1), e.classList.toggle("is-center", p === 0), e.classList.toggle("is-visible", _.opacity > .01), e.style.pointerEvents = p === 0 ? "auto" : "none");
			let y = p === 0;
			e.setAttribute("aria-hidden", y ? "false" : "true"), e.toggleAttribute("inert", !y), y ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current");
		}), R(S, u, n, r, d === 0), d > 0 && (v = window.setTimeout(() => {
			v = null, _ = !1, T();
		}, d + 34)), d === 0 && (_ = !1, T());
	}
}
function N(e, t, n, r, i, a, o, s) {
	let c = t.offsetWidth || t.clientWidth || 324, l = t.offsetHeight || t.clientHeight || 470, u = t.cloneNode(!0);
	u.classList.add("is-ghost", "is-immediate"), u.removeAttribute("id"), u.style.pointerEvents = "none", u.style.width = `${c}px`, u.style.height = `${l}px`, u.setAttribute("aria-hidden", "true"), u.removeAttribute("tabindex"), u.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), e.appendChild(u), K(u, n, !0), Y(u, i, o), u.classList.remove("is-center"), u.classList.add("is-visible"), window.requestAnimationFrame(() => {
		u.classList.remove("is-immediate"), Y(u, a, o), K(u, r, !1);
	}), window.setTimeout(() => {
		u.remove();
	}, s + 120);
}
function P(e) {
	return a(e, l.controlsWrap, l.control);
}
function F(e, t) {
	I(e.pause, n("Pauza autoplay", "Pause autoplay"), t.onPause), I(e.play, n("Start autoplay", "Start autoplay"), t.onPlay), I(e.prev, n("Poprzedni slajd", "Previous slide"), t.onPrev), I(e.next, n("Następny slajd", "Next slide"), t.onNext);
}
function I(e, t, n) {
	s(e, {
		label: t,
		handler: n
	});
}
function L(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function R(t, n, r, i = 1, a = !1) {
	if (!n.length) return;
	let o = r % n.length, s = n.findIndex((e) => e.classList.contains("is-active")), c = e(), l = V(s, o, i, n.length), u = a || c || s < 0 || s === o;
	n.forEach((e, t) => {
		let n = t === o;
		e.hidden = !1, e.classList.toggle("is-active", n), e.setAttribute("aria-hidden", n ? "false" : "true");
	}), U(t, l, u), !(u || !H(s, o, i, n.length)) && window.setTimeout(() => {
		U(t, o + 1, !0);
	}, x + 40);
}
function z(e, t) {
	if (!e || !t.length) return null;
	let n = e.querySelector(`:scope > .${S}`);
	if (n) return n;
	let r = document.createElement("div");
	return r.className = S, r.setAttribute("aria-live", "polite"), r.setAttribute("aria-atomic", "true"), e.insertBefore(r, t[0]), r.appendChild(B(t[t.length - 1])), t.forEach((e) => {
		e.hidden = !1, r.appendChild(e);
	}), r.appendChild(B(t[0])), U(r, 1, !0), r;
}
function B(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(C), t.classList.remove("is-active"), t.hidden = !1, t.setAttribute("aria-hidden", "true"), t.removeAttribute("id"), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t;
}
function V(e, t, n, r) {
	return e === r - 1 && t === 0 && n > 0 ? r + 1 : e === 0 && t === r - 1 && n < 0 ? 0 : t + 1;
}
function H(e, t, n, r) {
	return e === r - 1 && t === 0 && n > 0 || e === 0 && t === r - 1 && n < 0;
}
function U(e, t, n = !1) {
	e && (n ? e.classList.add("is-immediate") : e.classList.remove("is-immediate"), e.style.transform = `translate3d(${-t * 100}%, 0, 0)`, n && (e.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove("is-immediate");
	})));
}
function W(e, t) {
	if (!e || !t.length) return;
	let n = 0;
	t.forEach((e) => {
		let t = e.hidden, r = e.style.position, i = e.style.visibility, a = e.style.display;
		e.hidden = !1, e.style.position = "relative", e.style.visibility = "hidden", e.style.display = "flex", n = Math.max(n, e.scrollHeight, e.getBoundingClientRect().height), e.style.position = r, e.style.visibility = i, e.style.display = a, e.hidden = t;
	}), n > 0 && e.style.setProperty("--tt-text-height", `${Math.ceil(n)}px`);
}
function G(e) {
	e.forEach((e) => {
		let t = e.querySelector(l.title);
		if (!t) return;
		t.style.removeProperty("font-size");
		let n = Number.parseFloat(window.getComputedStyle(t).fontSize), r = e.clientHeight * .78;
		if (!Number.isFinite(n) || r <= 0) return;
		let i = n, a = 0;
		for (; a < 40 && i > 18 && (t.scrollWidth > t.clientWidth + 1 || t.scrollHeight > r);) i = Math.max(18, i - 1), t.style.setProperty("font-size", `${i}px`, "important"), a += 1;
	});
}
function K(e, t, n) {
	n ? e.classList.add("is-immediate") : e.classList.remove("is-immediate"), e.style.setProperty("--tx", `${t.x}px`), e.style.setProperty("--scale", `${t.scale}`), e.style.setProperty("--overlay-opacity", `${t.overlayOpacity}`), e.style.opacity = String(t.opacity), e.style.zIndex = String(t.zIndex);
}
function q(e, t, n, r = !1) {
	let i = Math.abs(e), a = e < 0 ? "left" : "right";
	if (e === 0) return {
		x: 0,
		scale: 1,
		overlayOpacity: 0,
		opacity: 1,
		zIndex: 50
	};
	if (i > t) {
		let e = J(a, t, r);
		return {
			x: (a === "left" ? -1 : 1) * n * (e.xFactor + .84),
			scale: e.scale,
			overlayOpacity: e.overlayOpacity,
			opacity: 0,
			zIndex: 1
		};
	}
	let o = J(a, i, r);
	return {
		x: (a === "left" ? -1 : 1) * n * o.xFactor,
		scale: o.scale,
		overlayOpacity: o.overlayOpacity,
		opacity: 1,
		zIndex: 40 - i
	};
}
function J(e, t, n) {
	let r = n ? b : y, i = y[e];
	return r[e]?.[t] || r[e]?.[1] || i[t] || i[1];
}
function ee(e, t) {
	return Math.min(t ? 1 : p, Math.floor((e - 1) / 2));
}
function Y(e, t, n) {
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
function te(e, t = !1) {
	let n = e && (e.offsetWidth || e.clientWidth) || 324, r = n > 40 ? n : 324;
	if (t) return Q(r * .42, 76, 124);
	let i = e?.closest?.(l.root), a = X(i, "--tt-step-factor", .41), o = X(i, "--tt-step-min", 50), s = X(i, "--tt-step-max", 110);
	return Q(r * a, o, s);
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
function ne(e, t) {
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
export { w as initThinktankSlider };
