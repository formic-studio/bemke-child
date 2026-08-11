import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./font-size-controls-DUBBhJnJ.js";
import { a as r, i, n as a, r as o, t as s } from "./touch-swipe-fallback-Rxhk1pK8.js";
//#region src/js/modules/thinktank-slider.js
var c = {
	root: ".slider-thinktank",
	track: ".slider-wrapper",
	slide: ".slide-thinktank",
	title: ".slide-tittle",
	textWrap: ".slider-text-wrapper",
	textSlide: ".slide-text",
	controlsWrap: ".slider-paggination",
	control: a
}, l = "data-thinktank-ready", u = "__bemkeThinktankBooted", d = 2200, f = 3, p = "(max-width: 767px)", m = "(min-width: 768px)", h = {
	rootMargin: "0px 0px -18% 0px",
	threshold: .18
}, g = !1, _ = null, v = {
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
}, y = {
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
}, b = 720, x = "slider-text-track", S = "is-text-ghost";
function C() {
	w(), T();
}
function w(e = document) {
	e.querySelectorAll(c.root).forEach((e) => {
		if (e.getAttribute(l) === "1") {
			typeof e.__bemkeThinktankRefresh == "function" && e.__bemkeThinktankRefresh();
			return;
		}
		if (E()) {
			O(e);
			return;
		}
		e.setAttribute(l, "1"), j(e);
	});
}
function T() {
	if (window[u]) return;
	window[u] = !0;
	let e = $(() => {
		w();
	}, 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), document.addEventListener("bricks/popup/open", e), document.addEventListener("bricks/popup/close", e), document.addEventListener(n, e), window.setTimeout(e, 200), window.setTimeout(e, 800), window.setTimeout(e, 1800), window.matchMedia && window.addEventListener("resize", $(() => {
		w();
	}, 120)), window.matchMedia?.(m).matches && window.addEventListener("scroll", $(() => {
		g || (g = !0, A());
	}, 60), { passive: !0 }), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) if (n.type === "childList" && n.addedNodes.length > 0) {
			for (let t of n.addedNodes) if (t instanceof Element && (t.matches(c.root) || t.querySelector(c.root))) {
				e();
				return;
			}
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function E() {
	return !(!window.matchMedia || !window.IntersectionObserver || !window.matchMedia(m).matches);
}
function D(e) {
	let t = e.getBoundingClientRect();
	return t.top < window.innerHeight && t.bottom > 0;
}
function O(e) {
	if (!window.IntersectionObserver) {
		j(e);
		return;
	}
	if (e.__bemkeThinktankObserved) return;
	let t = k();
	if (!t) {
		j(e);
		return;
	}
	e.__bemkeThinktankObserved = !0, t.observe(e);
}
function k() {
	return _ || (_ = new IntersectionObserver((e) => {
		e.forEach((e) => {
			if (!e.isIntersecting) return;
			let t = e.target;
			if (g) {
				if (t.__bemkeThinktankObserved = !1, t.getAttribute(l) === "1") {
					_?.unobserve(t);
					return;
				}
				_?.unobserve(t), t.setAttribute(l, "1"), j(t);
			}
		});
	}, h), _);
}
function A() {
	window.IntersectionObserver && document.querySelectorAll(c.root).forEach((e) => {
		e.__bemkeThinktankObserved && e.getAttribute(l) !== "1" && D(e) && (e.__bemkeThinktankObserved = !1, _?.unobserve(e), e.setAttribute(l, "1"), j(e));
	});
}
function j(n) {
	let i = n.querySelector(c.track), a = Array.from(n.querySelectorAll(c.slide)), o = n.querySelector(c.textWrap), l = o ? Array.from(o.querySelectorAll(c.textSlide)) : [];
	if (!i || a.length < 3) return;
	let u = N(n), f = 0, m = !1, h = null, g = !1, _ = null, v = null, y = 0, b = [];
	n.setAttribute("role", "region"), n.setAttribute("aria-roledescription", "karuzela"), !n.hasAttribute("aria-label") && !n.hasAttribute("aria-labelledby") && n.setAttribute("aria-label", "Aktualności Think Tanku"), a.forEach((e, t) => {
		if (e.classList.remove("bricks-lazy-hidden"), e.querySelector(c.title)?.classList.remove("bricks-lazy-hidden"), !e.querySelector(".slide-overlay")) {
			let t = document.createElement("span");
			t.className = "slide-overlay", t.setAttribute("aria-hidden", "true"), e.appendChild(t);
		}
		let n = e.querySelector(c.title)?.textContent?.replace(/\s+/g, " ").trim();
		e.removeAttribute("tabindex"), e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `${n ? `${n}, ` : ""}slajd ${t + 1} z ${a.length}`);
	}), l.forEach((e) => {
		e.classList.remove("bricks-lazy-hidden");
	});
	let x = R(o, l);
	W(a), U(o, l), document.fonts?.ready && document.fonts.ready.then(() => {
		W(a), U(o, l);
	}), P(u, {
		onPause: () => E(),
		onPlay: () => T(!0),
		onPrev: () => C(-1, 1, !0),
		onNext: () => C(1, 1, !0)
	}), n.hasAttribute("tabindex") || n.setAttribute("tabindex", "0"), n.addEventListener("keydown", (e) => {
		if (!r(e)) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), C(-1, 1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), C(1, 1, !0));
		}
	}), S(i), S(o), k(f, f, 0, !0), I(u, m), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			O();
			return;
		}
		D();
	}), window.addEventListener("resize", $(() => {
		b.length = 0, W(a), U(o, l), k(f, f, 0, !0);
	}, 120)), n.__bemkeThinktankRefresh = () => {
		b.length = 0, W(a), U(o, l), k(f, f, 0, !0);
	}, document.addEventListener(t, (e) => {
		e.detail?.reduced && (window.clearTimeout(_), _ = null, g = !1, b.length = 0, k(f, f, 0, !0));
	});
	function S(e) {
		if (!e) return;
		let t = s(e, {
			onMove: () => {
				e.classList.add("is-dragging");
			},
			onSwipe: ({ direction: t }) => {
				e.classList.remove("is-dragging"), C(t, 1, !0), y = Date.now() + 260;
			},
			onCancel: () => {
				e.classList.remove("is-dragging");
			},
			threshold: 46
		});
		e.addEventListener("pointerdown", (t) => {
			if (!(t.pointerType === "mouse" && t.button !== 0)) {
				v = {
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
			if (!v || v.id !== e.pointerId) return;
			let t = e.clientX - v.startX, n = e.clientY - v.startY, r = Math.abs(t), i = Math.abs(n);
			!v.lockedAxis && (r > 8 || i > 8) && (v.lockedAxis = r > i ? "x" : "y"), v.lockedAxis === "x" && (e.preventDefault(), v.moved = !0, v.surface.classList.add("is-dragging"));
		}), e.addEventListener("pointerup", (e) => {
			if (!v || v.id !== e.pointerId) return;
			let n = e.clientX - v.startX, r = e.clientY - v.startY, i = v.moved && Math.abs(n) > 46 && Math.abs(n) > Math.abs(r), a = v.surface, o = v.moved;
			v = null, a.classList.remove("is-dragging"), o && t.markPointerHandled(), i && (C(n < 0 ? 1 : -1, 1, !0), y = Date.now() + 260);
		}), e.addEventListener("pointercancel", () => {
			v?.surface && v.surface.classList.remove("is-dragging"), v = null;
		}), e.addEventListener("click", (e) => {
			Date.now() >= y || (e.preventDefault(), e.stopPropagation());
		}, !0);
	}
	function C(e, t = 1, n = !1) {
		for (let n = 0; n < t; n += 1) b.push(e);
		n && m && D(), w();
	}
	function w() {
		if (g) return;
		let e = b.shift();
		if (!e) return;
		let t = f;
		f = te(f + e, a.length), k(t, f, e, !1);
	}
	function T(e = !1) {
		m = !0, e && C(1, 1, !1), D(), I(u, m);
	}
	function E() {
		m = !1, O(), I(u, m);
	}
	function D() {
		m && (O(), h = window.setInterval(() => {
			C(1, 1, !1);
		}, d));
	}
	function O() {
		h &&= (window.clearInterval(h), null);
	}
	function k(t, n, r, o) {
		let s = window.matchMedia(p).matches, c = J(a.length, s), u = ee(a[0], s), d = o || e() ? 0 : 1100;
		_ &&= (window.clearTimeout(_), null), g = d > 0, a.forEach((e, o) => {
			let l = Z(o, t, a.length), f = l, p = Z(o, n, a.length), m = r === 1 && l === -c && p === c, h = r === -1 && l === c && p === -c;
			m ? f = c + 1 : h && (f = -c - 1);
			let g = K(f, c, u, s), _ = K(p, c, u, s), v = K(l, c, u, s);
			d > 0 ? (m ? M(i, e, v, K(-c - 1, c, u, s), l, -c - 1, c, d) : h && M(i, e, v, K(c + 1, c, u, s), l, c + 1, c, d), G(e, g, !0), Y(e, f, c), window.requestAnimationFrame(() => {
				Y(e, p, c), G(e, _, !1), e.classList.toggle("is-center", p === 0), e.classList.toggle("is-visible", _.opacity > .01), e.style.pointerEvents = p === 0 ? "auto" : "none";
			})) : (Y(e, p, c), G(e, _, !1), e.classList.toggle("is-center", p === 0), e.classList.toggle("is-visible", _.opacity > .01), e.style.pointerEvents = p === 0 ? "auto" : "none");
			let y = p === 0;
			e.setAttribute("aria-hidden", y ? "false" : "true"), e.toggleAttribute("inert", !y), y ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current");
		}), L(x, l, n, r, d === 0), d > 0 && (_ = window.setTimeout(() => {
			_ = null, g = !1, w();
		}, d + 34)), d === 0 && (g = !1, w());
	}
}
function M(e, t, n, r, i, a, o, s) {
	let c = t.offsetWidth || t.clientWidth || 324, l = t.offsetHeight || t.clientHeight || 470, u = t.cloneNode(!0);
	u.classList.add("is-ghost", "is-immediate"), u.removeAttribute("id"), u.style.pointerEvents = "none", u.style.width = `${c}px`, u.style.height = `${l}px`, u.setAttribute("aria-hidden", "true"), u.removeAttribute("tabindex"), u.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), e.appendChild(u), G(u, n, !0), Y(u, i, o), u.classList.remove("is-center"), u.classList.add("is-visible"), window.requestAnimationFrame(() => {
		u.classList.remove("is-immediate"), Y(u, a, o), G(u, r, !1);
	}), window.setTimeout(() => {
		u.remove();
	}, s + 120);
}
function N(e) {
	return i(e, c.controlsWrap, c.control);
}
function P(e, t) {
	F(e.pause, "Pauza autoplay", t.onPause), F(e.play, "Start autoplay", t.onPlay), F(e.prev, "Poprzedni slajd", t.onPrev), F(e.next, "Następny slajd", t.onNext);
}
function F(e, t, n) {
	o(e, {
		label: t,
		handler: n
	});
}
function I(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function L(t, n, r, i = 1, a = !1) {
	if (!n.length) return;
	let o = r % n.length, s = n.findIndex((e) => e.classList.contains("is-active")), c = e(), l = B(s, o, i, n.length), u = a || c || s < 0 || s === o;
	n.forEach((e, t) => {
		let n = t === o;
		e.hidden = !1, e.classList.toggle("is-active", n), e.setAttribute("aria-hidden", n ? "false" : "true");
	}), H(t, l, u), !(u || !V(s, o, i, n.length)) && window.setTimeout(() => {
		H(t, o + 1, !0);
	}, b + 40);
}
function R(e, t) {
	if (!e || !t.length) return null;
	let n = e.querySelector(`:scope > .${x}`);
	if (n) return n;
	let r = document.createElement("div");
	return r.className = x, r.setAttribute("aria-live", "polite"), r.setAttribute("aria-atomic", "true"), e.insertBefore(r, t[0]), r.appendChild(z(t[t.length - 1])), t.forEach((e) => {
		e.hidden = !1, r.appendChild(e);
	}), r.appendChild(z(t[0])), H(r, 1, !0), r;
}
function z(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(S), t.classList.remove("is-active"), t.hidden = !1, t.setAttribute("aria-hidden", "true"), t.removeAttribute("id"), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t;
}
function B(e, t, n, r) {
	return e === r - 1 && t === 0 && n > 0 ? r + 1 : e === 0 && t === r - 1 && n < 0 ? 0 : t + 1;
}
function V(e, t, n, r) {
	return e === r - 1 && t === 0 && n > 0 || e === 0 && t === r - 1 && n < 0;
}
function H(e, t, n = !1) {
	e && (n ? e.classList.add("is-immediate") : e.classList.remove("is-immediate"), e.style.transform = `translate3d(${-t * 100}%, 0, 0)`, n && (e.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove("is-immediate");
	})));
}
function U(e, t) {
	if (!e || !t.length) return;
	let n = 0;
	t.forEach((e) => {
		let t = e.hidden, r = e.style.position, i = e.style.visibility, a = e.style.display;
		e.hidden = !1, e.style.position = "relative", e.style.visibility = "hidden", e.style.display = "flex", n = Math.max(n, e.scrollHeight, e.getBoundingClientRect().height), e.style.position = r, e.style.visibility = i, e.style.display = a, e.hidden = t;
	}), n > 0 && e.style.setProperty("--tt-text-height", `${Math.ceil(n)}px`);
}
function W(e) {
	e.forEach((e) => {
		let t = e.querySelector(c.title);
		if (!t) return;
		t.style.removeProperty("font-size");
		let n = Number.parseFloat(window.getComputedStyle(t).fontSize), r = e.clientHeight * .78;
		if (!Number.isFinite(n) || r <= 0) return;
		let i = n, a = 0;
		for (; a < 40 && i > 18 && (t.scrollWidth > t.clientWidth + 1 || t.scrollHeight > r);) i = Math.max(18, i - 1), t.style.setProperty("font-size", `${i}px`, "important"), a += 1;
	});
}
function G(e, t, n) {
	n ? e.classList.add("is-immediate") : e.classList.remove("is-immediate"), e.style.setProperty("--tx", `${t.x}px`), e.style.setProperty("--scale", `${t.scale}`), e.style.setProperty("--overlay-opacity", `${t.overlayOpacity}`), e.style.opacity = String(t.opacity), e.style.zIndex = String(t.zIndex);
}
function K(e, t, n, r = !1) {
	let i = Math.abs(e), a = e < 0 ? "left" : "right";
	if (e === 0) return {
		x: 0,
		scale: 1,
		overlayOpacity: 0,
		opacity: 1,
		zIndex: 50
	};
	if (i > t) {
		let e = q(a, t, r);
		return {
			x: (a === "left" ? -1 : 1) * n * (e.xFactor + .84),
			scale: e.scale,
			overlayOpacity: e.overlayOpacity,
			opacity: 0,
			zIndex: 1
		};
	}
	let o = q(a, i, r);
	return {
		x: (a === "left" ? -1 : 1) * n * o.xFactor,
		scale: o.scale,
		overlayOpacity: o.overlayOpacity,
		opacity: 1,
		zIndex: 40 - i
	};
}
function q(e, t, n) {
	let r = n ? y : v, i = v[e];
	return r[e]?.[t] || r[e]?.[1] || i[t] || i[1];
}
function J(e, t) {
	return Math.min(t ? 1 : f, Math.floor((e - 1) / 2));
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
function ee(e, t = !1) {
	let n = e && (e.offsetWidth || e.clientWidth) || 324, r = n > 40 ? n : 324;
	if (t) return Q(r * .42, 76, 124);
	let i = e?.closest?.(c.root), a = X(i, "--tt-step-factor", .41), o = X(i, "--tt-step-min", 50), s = X(i, "--tt-step-max", 110);
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
export { C as initThinktankSlider };
