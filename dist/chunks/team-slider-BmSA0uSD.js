import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-BlCrb88B.js";
import { i as r, r as i, t as a } from "./touch-swipe-fallback-D2n6TRec.js";
//#region src/js/modules/team-slider.js
var o = ".slider-block", s = ":scope > .slider-wrapper", c = ":scope > .slider-paggination", l = "[data-number]:not(.popup-team)", u = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]", d = "data-bemke-team-slider-ready", f = "slide-active", p = "data-bemke-team-slide-visible", m = "data-bemke-team-original-tabindex", h = "__bemkeTeamSliderBooted", g = "is-dragging", _ = "is-resetting", v = .8, y = .35, b = 3500, x = 46, S = "power3.inOut", C = "power3.out", w = 0;
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
	if (window[h]) return;
	window[h] = !0;
	let e = K(() => E(), 90);
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
	let s = k(o), l = r(i, c), u = !1, f = 0, m = !1, h = null, v = null, y = null, S = !1;
	s.forEach((e) => e.classList.add("team-link")), i.setAttribute(d, "1"), j(i, o, s), M(s), F(l, o, {
		onPause: () => q(),
		onPlay: () => H(!0),
		onPrev: () => T(-1, !0),
		onNext: () => T(1, !0)
	});
	let C = a(o, {
		canStart: () => !u,
		onStart: () => {
			v?.kill(), n.killTweensOf(o);
		},
		onMove: ({ dx: e }) => {
			let t = L(o), n = G(e * .5, -t * .8, t * .8);
			o.classList.add(g), R(o, n);
		},
		onSwipe: ({ direction: e }) => {
			let t = V(o);
			o.classList.remove(g), S = !0, T(e, !0, t);
		},
		onCancel: () => {
			o.classList.remove(g), B(o);
		},
		threshold: x
	});
	i.addEventListener("keydown", (e) => {
		if (!W(e.target)) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), U(l.prev), T(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), U(l.next), T(1, !0));
		}
	}), i.addEventListener("focusin", (e) => {
		let t = e.target.closest?.(".team-link");
		!t || t.parentElement !== o || t.getAttribute(p) !== "false" || T(1, !0);
	}), o.addEventListener("pointerdown", (e) => {
		u || e.pointerType === "mouse" && e.button !== 0 || (v?.kill(), n.killTweensOf(o), y = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			lockedAxis: null,
			dragged: !1
		});
	}), o.addEventListener("pointermove", (e) => {
		if (!y || y.id !== e.pointerId) return;
		let t = e.clientX - y.startX, n = e.clientY - y.startY, r = Math.abs(t), i = Math.abs(n);
		if (!y.lockedAxis && (r > 8 || i > 8) && (y.lockedAxis = r > i ? "x" : "y"), y.lockedAxis !== "x") return;
		if (e.preventDefault(), !o.hasPointerCapture(e.pointerId)) try {
			o.setPointerCapture(e.pointerId);
		} catch {}
		let a = L(o), s = G(t * .5, -a * .8, a * .8);
		y.dragged = !0, o.classList.add(g), R(o, s);
	}), o.addEventListener("pointerup", (e) => {
		if (!y || y.id !== e.pointerId) return;
		let t = e.clientX - y.startX, n = e.clientY - y.startY, r = y.dragged && Math.abs(t) > x && Math.abs(t) > Math.abs(n), i = V(o), a = y.dragged;
		if (y = null, o.classList.remove(g), a && C.markPointerHandled(), r) {
			S = !0, T(t < 0 ? 1 : -1, !0, i);
			return;
		}
		B(o);
	}), o.addEventListener("pointercancel", () => {
		y = null, o.classList.remove(g), B(o);
	}), o.addEventListener("click", (e) => {
		S && (S = !1, e.preventDefault(), e.stopPropagation());
	}, !0);
	let w = K(() => {
		O(), R(o, 0), N(i, o);
	}, 120);
	window.addEventListener("resize", w), i.__bemkeTeamSliderRefresh = w, R(o, 0), I(l, m), window.requestAnimationFrame(() => N(i, o)), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			Y();
			return;
		}
		J();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (O(), R(o, 0), N(i, o));
	});
	function T(e, t = !1, n = null) {
		let r = e < 0 ? -1 : 1;
		if (t && m && J(), u) {
			f = r;
			return;
		}
		E(r, n);
	}
	function E(t, n = null) {
		let r = k(o), a = L(o);
		if (r.length < 2 || a <= 0) {
			R(o, 0);
			return;
		}
		if (e()) {
			A(o, r, t), R(o, 0), N(i, o), P();
			return;
		}
		if (u = !0, t > 0) {
			Number.isFinite(n) && R(o, n), v = z(o, -a, () => {
				A(o, r, t), D();
			});
			return;
		}
		let s = Number.isFinite(n) ? n : 0;
		A(o, r, t), R(o, s - a), o.offsetHeight, v = z(o, 0, D);
	}
	function D() {
		v = null, i.classList.add(_), R(o, 0), o.offsetHeight, i.classList.remove(_), u = !1, N(i, o), P();
	}
	function O() {
		v?.kill(), v = null, n.killTweensOf(o), u = !1, f = 0;
	}
	function P() {
		if (!f) return;
		let e = f;
		f = 0, E(e);
	}
	function H(e = !1) {
		m = !0, e && T(1), J(), I(l, m);
	}
	function q() {
		m = !1, Y(), I(l, m);
	}
	function J() {
		m && (Y(), h = window.setInterval(() => T(1), b));
	}
	function Y() {
		h &&= (window.clearInterval(h), null);
	}
}
function k(e) {
	return Array.from(e?.children ?? []).filter((e) => e.querySelector(l));
}
function A(e, t, n) {
	if (n > 0) {
		e.appendChild(t[0]);
		return;
	}
	e.prepend(t[t.length - 1]);
}
function j(e, t, n) {
	w += 1, t.id ||= `bemke-team-slider-track-${w}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", H(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), n.forEach((e, t) => {
		let r = e.querySelector(".font-size-h4")?.textContent?.replace(/\s+/g, " ").trim();
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `${r ? `${r}, ` : ""}osoba ${t + 1} z ${n.length}`);
	});
}
function M(e) {
	e.forEach((e) => {
		e.querySelectorAll(u).forEach((e) => {
			e.hasAttribute(m) || e.setAttribute(m, e.getAttribute("tabindex") ?? "");
		}), e.querySelectorAll("img").forEach((e) => {
			e.setAttribute("draggable", "false"), e.setAttribute("decoding", "async"), e.draggable = !1;
		});
	});
}
function N(e, t) {
	let n = e.getBoundingClientRect();
	k(t).forEach((e, t) => {
		let r = e.getBoundingClientRect(), i = Math.max(0, Math.min(r.right, n.right) - Math.max(r.left, n.left)), a = r.width > 0 && i >= Math.min(r.width * .5, 80), o = t === 0;
		e.setAttribute(f, o ? "1" : "0"), e.setAttribute(p, a ? "true" : "false"), e.removeAttribute("aria-hidden"), o ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current"), P(e);
	});
}
function P(e) {
	"inert" in e && (e.inert = !1), e.removeAttribute("inert"), e.querySelectorAll(u).forEach((e) => {
		let t = e.getAttribute(m);
		if (t) {
			e.setAttribute("tabindex", t);
			return;
		}
		e.removeAttribute("tabindex");
	});
}
function F(e, t, n) {
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
function I(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function L(e) {
	let t = k(e), n = t[0]?.getBoundingClientRect(), r = t[1]?.getBoundingClientRect();
	if (n && r) {
		let e = r.left - n.left;
		if (e > 0) return e;
	}
	let i = Number.parseFloat(window.getComputedStyle(e).columnGap) || 0;
	return (n?.width ?? 0) + i;
}
function R(e, t) {
	n.set(e, {
		x: t,
		force3D: !0
	});
}
function z(e, t, r) {
	return n.to(e, {
		x: t,
		duration: v,
		ease: S,
		force3D: !0,
		overwrite: "auto",
		onComplete: r
	});
}
function B(t) {
	if (e()) {
		R(t, 0);
		return;
	}
	n.to(t, {
		x: 0,
		duration: y,
		ease: C,
		force3D: !0,
		overwrite: "auto"
	});
}
function V(e) {
	let t = Number(n.getProperty(e, "x"));
	return Number.isFinite(t) ? t : 0;
}
function H(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider zespołu";
}
function U(e) {
	e && document.activeElement !== e && e.focus({ preventScroll: !0 });
}
function W(e) {
	return !!e?.closest?.("input, textarea, select, button, [contenteditable=\"true\"]");
}
function G(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function K(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { T as initTeamSlider };
