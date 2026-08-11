import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-BlCrb88B.js";
import { a as r, i, r as a, t as o } from "./touch-swipe-fallback-Rxhk1pK8.js";
//#region src/js/modules/team-slider.js
var s = ".slider-block", c = ":scope > .slider-wrapper", l = ":scope > .slider-paggination", u = "[data-number]:not(.popup-team)", d = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]", f = "data-bemke-team-slider-ready", p = "slide-active", m = "data-bemke-team-slide-visible", h = "data-bemke-team-original-tabindex", g = "bemke-team-slider-status", _ = "__bemkeTeamSliderBooted", v = "is-dragging", y = .8, b = .35, x = 3500, S = 46, C = "power3.inOut", w = "power3.out", T = 0;
function E() {
	D(), O();
}
function D(e = document) {
	e.querySelectorAll(s).forEach((e) => {
		let t = e.querySelector(c);
		if (!(!t || A(t).length < 2)) {
			if (e.getAttribute(f) === "1") {
				e.__bemkeTeamSliderRefresh?.();
				return;
			}
			k(e, t);
		}
	});
}
function O() {
	if (window[_]) return;
	window[_] = !0;
	let e = $(() => D(), 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) for (let t of n.addedNodes) if (t instanceof Element && (t.matches(s) || t.querySelector(s))) {
			e();
			return;
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function k(a, s) {
	let c = A(s), u = i(a, l), d = !1, p = 0, h = !1, g = null, _ = null, y = null, b = !1, C = 0;
	c.forEach((e) => e.classList.add("team-link")), a.setAttribute(f, "1"), ee(a, s, c), M(c), L(u, s, {
		onPause: () => I(),
		onPlay: () => F(!0),
		onPrev: () => E(-1, !0),
		onNext: () => E(1, !0)
	}), a.addEventListener("scroll", () => U(a), { passive: !0 });
	let w = o(s, {
		canStart: () => !d,
		onStart: () => {
			_?.kill(), n.killTweensOf(s);
		},
		onMove: ({ dx: e }) => {
			let t = W(s), n = Q(e * .5, -t * .8, t * .8);
			s.classList.add(v), G(s, H(s, C) + n);
		},
		onSwipe: ({ direction: e }) => {
			let t = J(s);
			s.classList.remove(v), b = !0, E(e, !0, t);
		},
		onCancel: () => {
			s.classList.remove(v), q(s, C);
		},
		threshold: S
	});
	a.addEventListener("keydown", (e) => {
		if (!(r(e) || Z(e.target))) {
			if (e.key === "ArrowLeft") {
				if (C <= 0) return;
				e.preventDefault(), X(u.prev), E(-1, !0);
				return;
			}
			if (e.key === "ArrowRight") {
				if (C >= V(a, s)) return;
				e.preventDefault(), X(u.next), E(1, !0);
			}
		}
	}), a.addEventListener("focusin", (e) => {
		U(a), window.requestAnimationFrame(() => U(a));
		let t = e.target.closest?.(".team-link");
		if (!t || t.parentElement !== s || t.getAttribute(m) !== "false") return;
		let n = c.indexOf(t), r = B(a, s);
		D(n < C ? n : n - r + 1, !0);
	}), s.addEventListener("pointerdown", (e) => {
		d || e.pointerType === "mouse" && e.button !== 0 || (_?.kill(), n.killTweensOf(s), y = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			startOffset: H(s, C),
			lockedAxis: null,
			dragged: !1
		});
	}), s.addEventListener("pointermove", (e) => {
		if (!y || y.id !== e.pointerId) return;
		let t = e.clientX - y.startX, n = e.clientY - y.startY, r = Math.abs(t), i = Math.abs(n);
		if (!y.lockedAxis && (r > 8 || i > 8) && (y.lockedAxis = r > i ? "x" : "y"), y.lockedAxis !== "x") return;
		if (e.preventDefault(), !s.hasPointerCapture(e.pointerId)) try {
			s.setPointerCapture(e.pointerId);
		} catch {}
		let a = W(s), o = Q(t * .5, -a * .8, a * .8);
		y.dragged = !0, s.classList.add(v), G(s, y.startOffset + o);
	}), s.addEventListener("pointerup", (e) => {
		if (!y || y.id !== e.pointerId) return;
		let t = e.clientX - y.startX, n = e.clientY - y.startY, r = y.dragged && Math.abs(t) > S && Math.abs(t) > Math.abs(n), i = J(s), a = y.dragged;
		if (y = null, s.classList.remove(v), a && w.markPointerHandled(), r) {
			b = !0, E(t < 0 ? 1 : -1, !0, i);
			return;
		}
		q(s, C);
	}), s.addEventListener("pointercancel", () => {
		y = null, s.classList.remove(v), q(s, C);
	}), s.addEventListener("click", (e) => {
		b && (b = !1, e.preventDefault(), e.stopPropagation());
	}, !0);
	let T = $(() => {
		j(), C = Q(C, 0, V(a, s)), G(s, H(s, C)), N(a, s, C), R(u, h, C, V(a, s));
	}, 120);
	window.addEventListener("resize", T), a.__bemkeTeamSliderRefresh = T, G(s, 0), R(u, h, C, V(a, s)), window.requestAnimationFrame(() => {
		N(a, s, C), R(u, h, C, V(a, s));
	}), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			Y();
			return;
		}
		z();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (j(), C = Q(C, 0, V(a, s)), G(s, H(s, C)), N(a, s, C), R(u, h, C, V(a, s)));
	});
	function E(e, t = !1, n = null) {
		let r = e < 0 ? -1 : 1;
		if (d) {
			p = r;
			return;
		}
		D(C + r, t, n);
	}
	function D(t, n = !1, r = null) {
		let i = V(a, s), o = Q(t, 0, i), c = W(s);
		if (n && h && z(), o === C || c <= 0) {
			q(s, C), h && C >= i ? I() : R(u, h, C, i);
			return;
		}
		C = o;
		let l = H(s, C);
		if (U(a), Number.isFinite(r) && G(s, r), e()) {
			G(s, l), N(a, s, C), k(), P();
			return;
		}
		d = !0, R(u, h, C, i), _ = K(s, l, O);
	}
	function O() {
		_ = null, d = !1, G(s, H(s, C)), U(a), N(a, s, C), k(), P();
	}
	function k() {
		let e = V(a, s);
		if (h && C >= e) {
			I();
			return;
		}
		R(u, h, C, e);
	}
	function j() {
		_?.kill(), _ = null, n.killTweensOf(s), d = !1, p = 0;
	}
	function P() {
		if (!p) return;
		let e = p;
		p = 0, E(e);
	}
	function F(e = !1) {
		if (C >= V(a, s)) {
			R(u, !1, C, V(a, s));
			return;
		}
		h = !0, e && E(1), z(), R(u, h, C, V(a, s));
	}
	function I() {
		h = !1, Y(), R(u, h, C, V(a, s));
	}
	function z() {
		h && (Y(), g = window.setInterval(() => E(1), x));
	}
	function Y() {
		g &&= (window.clearInterval(g), null);
	}
}
function A(e) {
	return Array.from(e?.children ?? []).filter((e) => e.querySelector(u));
}
function ee(e, t, n) {
	T += 1, t.id ||= `bemke-team-slider-track-${T}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", Y(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "off"), t.setAttribute("aria-atomic", "false"), P(e), n.forEach((e, t) => {
		let r = e.querySelector(".font-size-h4")?.textContent?.replace(/\s+/g, " ").trim();
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `${r ? `${r}, ` : ""}osoba ${t + 1} z ${n.length}`), j(e);
	});
}
function j(e) {
	Array.from(e.children).find((e) => /^0*\d+$/u.test(e.textContent?.trim() ?? ""))?.setAttribute("aria-hidden", "true");
}
function M(e) {
	e.forEach((e) => {
		e.querySelectorAll(d).forEach((e) => {
			e.hasAttribute(h) || e.setAttribute(h, e.getAttribute("tabindex") ?? "");
		}), e.querySelectorAll("img").forEach((e) => {
			e.setAttribute("draggable", "false"), e.setAttribute("decoding", "async"), e.draggable = !1;
		});
	});
}
function N(e, t, n = 0) {
	let r = e.getBoundingClientRect(), i = A(t);
	i.forEach((e, t) => {
		let i = e.getBoundingClientRect(), a = Math.max(0, Math.min(i.right, r.right) - Math.max(i.left, r.left)), o = i.width > 0 && a >= Math.min(i.width * .5, 80), s = t === n;
		e.setAttribute(p, s ? "1" : "0"), e.setAttribute(m, o ? "true" : "false"), e.removeAttribute("aria-hidden"), s ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current"), I(e);
	}), F(e, n, i.length, t);
}
function P(e) {
	let t = e.querySelector(`:scope > .${g}`);
	if (t) return t;
	let n = document.createElement("p");
	return n.className = `${g} bemke-sr-only`, n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), n.setAttribute("aria-atomic", "true"), e.appendChild(n), n;
}
function F(e, t, n, r) {
	let i = P(e), a = B(e, r), o = Math.min(n, t + 1), s = Math.min(n, t + a), c = o === s ? `Wyświetlana osoba ${o} z ${n}.` : `Wyświetlane osoby ${o}–${s} z ${n}.`;
	i.textContent !== c && (i.textContent = c);
}
function I(e) {
	"inert" in e && (e.inert = !1), e.removeAttribute("inert"), e.querySelectorAll(d).forEach((e) => {
		let t = e.getAttribute(h);
		if (t) {
			e.setAttribute("tabindex", t);
			return;
		}
		e.removeAttribute("tabindex");
	});
}
function L(e, t, n) {
	a(e.pause, {
		label: "Pauza autoplay",
		controlsId: t.id,
		handler: n.onPause
	}), a(e.play, {
		label: "Start autoplay",
		controlsId: t.id,
		handler: n.onPlay
	}), a(e.prev, {
		label: "Poprzednia osoba",
		controlsId: t.id,
		handler: n.onPrev
	}), a(e.next, {
		label: "Następna osoba",
		controlsId: t.id,
		handler: n.onNext
	});
}
function R(e, t, n, r) {
	z(e.prev, n <= 0), z(e.next, n >= r), z(e.play, t || n >= r), z(e.pause, !t);
}
function z(e, t) {
	e && (e.classList.toggle("is-disabled", t), e.setAttribute("aria-disabled", t ? "true" : "false"));
}
function B(e, t) {
	let n = A(t), r = n[0]?.getBoundingClientRect(), i = W(t), a = e.getBoundingClientRect().width;
	if (!r?.width || i <= 0 || a <= 0) return 1;
	let o = Math.max(0, i - r.width);
	return Q(Math.floor((a + o + 1) / i), 1, n.length);
}
function V(e, t) {
	return Math.max(0, A(t).length - B(e, t));
}
function H(e, t) {
	return -Q(t, 0, A(e).length - 1) * W(e);
}
function U(e) {
	e.scrollLeft !== 0 && (e.scrollLeft = 0);
}
function W(e) {
	let t = A(e), n = t[0]?.getBoundingClientRect(), r = t[1]?.getBoundingClientRect();
	if (n && r) {
		let e = r.left - n.left;
		if (e > 0) return e;
	}
	let i = Number.parseFloat(window.getComputedStyle(e).columnGap) || 0;
	return (n?.width ?? 0) + i;
}
function G(e, t) {
	n.set(e, {
		x: t,
		force3D: !0
	});
}
function K(e, t, r) {
	return n.to(e, {
		x: t,
		duration: y,
		ease: C,
		force3D: !0,
		overwrite: "auto",
		onComplete: r
	});
}
function q(t, r) {
	let i = H(t, r);
	if (e()) {
		G(t, i);
		return;
	}
	n.to(t, {
		x: i,
		duration: b,
		ease: w,
		force3D: !0,
		overwrite: "auto"
	});
}
function J(e) {
	let t = Number(n.getProperty(e, "x"));
	return Number.isFinite(t) ? t : 0;
}
function Y(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider zespołu";
}
function X(e) {
	e && document.activeElement !== e && e.focus({ preventScroll: !0 });
}
function Z(e) {
	return !!e?.closest?.("input, textarea, select, button, [contenteditable=\"true\"]");
}
function Q(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function $(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { E as initTeamSlider };
