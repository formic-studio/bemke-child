import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-BlCrb88B.js";
import { i as r, r as i, t as a } from "./touch-swipe-fallback-D2n6TRec.js";
//#region src/js/modules/team-slider.js
var o = ".slider-block", s = ":scope > .slider-wrapper", c = ":scope > .slider-paggination", l = "[data-number]:not(.popup-team)", u = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]", d = "data-bemke-team-slider-ready", f = "slide-active", p = "data-bemke-team-slide-visible", m = "data-bemke-team-original-tabindex", h = "bemke-team-slider-status", g = "__bemkeTeamSliderBooted", _ = "is-dragging", v = .8, y = .35, b = 3500, x = 46, S = "power3.inOut", C = "power3.out", w = 0;
function T() {
	E(), D();
}
function E(e = document) {
	e.querySelectorAll(o).forEach((e) => {
		let t = e.querySelector(s);
		if (!(!t || k(t).length < 2)) {
			if (e.getAttribute(d) === "1") {
				e.__bemkeTeamSliderRefresh?.();
				return;
			}
			O(e, t);
		}
	});
}
function D() {
	if (window[g]) return;
	window[g] = !0;
	let e = Z(() => E(), 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) for (let t of n.addedNodes) if (t instanceof Element && (t.matches(o) || t.querySelector(o))) {
			e();
			return;
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function O(i, o) {
	let s = k(o), l = r(i, c), u = !1, f = 0, m = !1, h = null, g = null, v = null, y = !1, S = 0;
	s.forEach((e) => e.classList.add("team-link")), i.setAttribute(d, "1"), A(i, o, s), j(s), I(l, o, {
		onPause: () => R(),
		onPlay: () => F(!0),
		onPrev: () => T(-1, !0),
		onNext: () => T(1, !0)
	});
	let C = a(o, {
		canStart: () => !u,
		onStart: () => {
			g?.kill(), n.killTweensOf(o);
		},
		onMove: ({ dx: e }) => {
			let t = H(o), n = X(e * .5, -t * .8, t * .8);
			o.classList.add(_), U(o, V(o, S) + n);
		},
		onSwipe: ({ direction: e }) => {
			let t = K(o);
			o.classList.remove(_), y = !0, T(e, !0, t);
		},
		onCancel: () => {
			o.classList.remove(_), G(o, S);
		},
		threshold: x
	});
	i.addEventListener("keydown", (e) => {
		if (!Y(e.target)) {
			if (e.key === "ArrowLeft") {
				if (S <= 0) return;
				e.preventDefault(), J(l.prev), T(-1, !0);
				return;
			}
			if (e.key === "ArrowRight") {
				if (S >= B(i, o)) return;
				e.preventDefault(), J(l.next), T(1, !0);
			}
		}
	}), i.addEventListener("focusin", (e) => {
		let t = e.target.closest?.(".team-link");
		if (!t || t.parentElement !== o || t.getAttribute(p) !== "false") return;
		let n = s.indexOf(t), r = z(i, o);
		E(n < S ? n : n - r + 1, !0);
	}), o.addEventListener("pointerdown", (e) => {
		u || e.pointerType === "mouse" && e.button !== 0 || (g?.kill(), n.killTweensOf(o), v = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			startOffset: V(o, S),
			lockedAxis: null,
			dragged: !1
		});
	}), o.addEventListener("pointermove", (e) => {
		if (!v || v.id !== e.pointerId) return;
		let t = e.clientX - v.startX, n = e.clientY - v.startY, r = Math.abs(t), i = Math.abs(n);
		if (!v.lockedAxis && (r > 8 || i > 8) && (v.lockedAxis = r > i ? "x" : "y"), v.lockedAxis !== "x") return;
		if (e.preventDefault(), !o.hasPointerCapture(e.pointerId)) try {
			o.setPointerCapture(e.pointerId);
		} catch {}
		let a = H(o), s = X(t * .5, -a * .8, a * .8);
		v.dragged = !0, o.classList.add(_), U(o, v.startOffset + s);
	}), o.addEventListener("pointerup", (e) => {
		if (!v || v.id !== e.pointerId) return;
		let t = e.clientX - v.startX, n = e.clientY - v.startY, r = v.dragged && Math.abs(t) > x && Math.abs(t) > Math.abs(n), i = K(o), a = v.dragged;
		if (v = null, o.classList.remove(_), a && C.markPointerHandled(), r) {
			y = !0, T(t < 0 ? 1 : -1, !0, i);
			return;
		}
		G(o, S);
	}), o.addEventListener("pointercancel", () => {
		v = null, o.classList.remove(_), G(o, S);
	}), o.addEventListener("click", (e) => {
		y && (y = !1, e.preventDefault(), e.stopPropagation());
	}, !0);
	let w = Z(() => {
		N(), S = X(S, 0, B(i, o)), U(o, V(o, S)), M(i, o, S), L(l, m, S, B(i, o));
	}, 120);
	window.addEventListener("resize", w), i.__bemkeTeamSliderRefresh = w, U(o, 0), L(l, m, S, B(i, o)), window.requestAnimationFrame(() => {
		M(i, o, S), L(l, m, S, B(i, o));
	}), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			Q();
			return;
		}
		q();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (N(), S = X(S, 0, B(i, o)), U(o, V(o, S)), M(i, o, S), L(l, m, S, B(i, o)));
	});
	function T(e, t = !1, n = null) {
		let r = e < 0 ? -1 : 1;
		if (u) {
			f = r;
			return;
		}
		E(S + r, t, n);
	}
	function E(t, n = !1, r = null) {
		let a = B(i, o), s = X(t, 0, a), c = H(o);
		if (n && m && q(), s === S || c <= 0) {
			G(o, S), m && S >= a ? R() : L(l, m, S, a);
			return;
		}
		S = s;
		let d = V(o, S);
		if (Number.isFinite(r) && U(o, r), e()) {
			U(o, d), M(i, o, S), O(), P();
			return;
		}
		u = !0, L(l, m, S, a), g = W(o, d, D);
	}
	function D() {
		g = null, u = !1, U(o, V(o, S)), M(i, o, S), O(), P();
	}
	function O() {
		let e = B(i, o);
		if (m && S >= e) {
			R();
			return;
		}
		L(l, m, S, e);
	}
	function N() {
		g?.kill(), g = null, n.killTweensOf(o), u = !1, f = 0;
	}
	function P() {
		if (!f) return;
		let e = f;
		f = 0, T(e);
	}
	function F(e = !1) {
		if (S >= B(i, o)) {
			L(l, !1, S, B(i, o));
			return;
		}
		m = !0, e && T(1), q(), L(l, m, S, B(i, o));
	}
	function R() {
		m = !1, Q(), L(l, m, S, B(i, o));
	}
	function q() {
		m && (Q(), h = window.setInterval(() => T(1), b));
	}
	function Q() {
		h &&= (window.clearInterval(h), null);
	}
}
function k(e) {
	return Array.from(e?.children ?? []).filter((e) => e.querySelector(l));
}
function A(e, t, n) {
	w += 1, t.id ||= `bemke-team-slider-track-${w}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", q(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "off"), t.setAttribute("aria-atomic", "false"), N(e), n.forEach((e, t) => {
		let r = e.querySelector(".font-size-h4")?.textContent?.replace(/\s+/g, " ").trim();
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `${r ? `${r}, ` : ""}osoba ${t + 1} z ${n.length}`);
	});
}
function j(e) {
	e.forEach((e) => {
		e.querySelectorAll(u).forEach((e) => {
			e.hasAttribute(m) || e.setAttribute(m, e.getAttribute("tabindex") ?? "");
		}), e.querySelectorAll("img").forEach((e) => {
			e.setAttribute("draggable", "false"), e.setAttribute("decoding", "async"), e.draggable = !1;
		});
	});
}
function M(e, t, n = 0) {
	let r = e.getBoundingClientRect(), i = k(t);
	i.forEach((e, t) => {
		let i = e.getBoundingClientRect(), a = Math.max(0, Math.min(i.right, r.right) - Math.max(i.left, r.left)), o = i.width > 0 && a >= Math.min(i.width * .5, 80), s = t === n;
		e.setAttribute(f, s ? "1" : "0"), e.setAttribute(p, o ? "true" : "false"), e.removeAttribute("aria-hidden"), s ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current"), F(e);
	}), P(e, n, i.length, t);
}
function N(e) {
	let t = e.querySelector(`:scope > .${h}`);
	if (t) return t;
	let n = document.createElement("p");
	return n.className = `${h} bemke-sr-only`, n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), n.setAttribute("aria-atomic", "true"), e.appendChild(n), n;
}
function P(e, t, n, r) {
	let i = N(e), a = z(e, r), o = Math.min(n, t + 1), s = Math.min(n, t + a), c = o === s ? `Wyświetlana osoba ${o} z ${n}.` : `Wyświetlane osoby ${o}–${s} z ${n}.`;
	i.textContent !== c && (i.textContent = c);
}
function F(e) {
	"inert" in e && (e.inert = !1), e.removeAttribute("inert"), e.querySelectorAll(u).forEach((e) => {
		let t = e.getAttribute(m);
		if (t) {
			e.setAttribute("tabindex", t);
			return;
		}
		e.removeAttribute("tabindex");
	});
}
function I(e, t, n) {
	i(e.pause, {
		label: "Pauza autoplay",
		controlsId: t.id,
		handler: n.onPause
	}), i(e.play, {
		label: "Start autoplay",
		controlsId: t.id,
		handler: n.onPlay
	}), i(e.prev, {
		label: "Poprzednia osoba",
		controlsId: t.id,
		handler: n.onPrev
	}), i(e.next, {
		label: "Następna osoba",
		controlsId: t.id,
		handler: n.onNext
	});
}
function L(e, t, n, r) {
	R(e.prev, n <= 0), R(e.next, n >= r), R(e.play, t || n >= r), R(e.pause, !t);
}
function R(e, t) {
	e && (e.classList.toggle("is-disabled", t), e.setAttribute("aria-disabled", t ? "true" : "false"));
}
function z(e, t) {
	let n = k(t), r = n[0]?.getBoundingClientRect(), i = H(t), a = e.getBoundingClientRect().width;
	if (!r?.width || i <= 0 || a <= 0) return 1;
	let o = Math.max(0, i - r.width);
	return X(Math.floor((a + o + 1) / i), 1, n.length);
}
function B(e, t) {
	return Math.max(0, k(t).length - z(e, t));
}
function V(e, t) {
	return -X(t, 0, k(e).length - 1) * H(e);
}
function H(e) {
	let t = k(e), n = t[0]?.getBoundingClientRect(), r = t[1]?.getBoundingClientRect();
	if (n && r) {
		let e = r.left - n.left;
		if (e > 0) return e;
	}
	let i = Number.parseFloat(window.getComputedStyle(e).columnGap) || 0;
	return (n?.width ?? 0) + i;
}
function U(e, t) {
	n.set(e, {
		x: t,
		force3D: !0
	});
}
function W(e, t, r) {
	return n.to(e, {
		x: t,
		duration: v,
		ease: S,
		force3D: !0,
		overwrite: "auto",
		onComplete: r
	});
}
function G(t, r) {
	let i = V(t, r);
	if (e()) {
		U(t, i);
		return;
	}
	n.to(t, {
		x: i,
		duration: y,
		ease: C,
		force3D: !0,
		overwrite: "auto"
	});
}
function K(e) {
	let t = Number(n.getProperty(e, "x"));
	return Number.isFinite(t) ? t : 0;
}
function q(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider zespołu";
}
function J(e) {
	e && document.activeElement !== e && e.focus({ preventScroll: !0 });
}
function Y(e) {
	return !!e?.closest?.("input, textarea, select, button, [contenteditable=\"true\"]");
}
function X(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function Z(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { T as initTeamSlider };
