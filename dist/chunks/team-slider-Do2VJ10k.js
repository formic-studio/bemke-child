import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-0BK4_Us1.js";
import { i as r, r as i, t as a } from "./touch-swipe-fallback-C_mGjsy9.js";
//#region src/js/modules/team-slider.js
var o = ".slider-block", s = ":scope > .slider-wrapper", c = ":scope > .slider-paggination", l = "[data-number]:not(.popup-team)", u = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]", d = "data-bemke-team-slider-ready", f = "slide-active", p = "data-bemke-team-original-tabindex", m = "__bemkeTeamSliderBooted", h = "is-dragging", g = "is-resetting", _ = .8, v = .35, y = 3500, b = 46, x = "power3.inOut", S = "power3.out", C = 0;
function w() {
	T(), E();
}
function T(e = document) {
	e.querySelectorAll(o).forEach((e) => {
		let t = e.querySelector(s);
		if (!(!t || O(t).length < 2)) {
			if (e.getAttribute(d) === "1") {
				e.__bemkeTeamSliderRefresh?.();
				return;
			}
			D(e, t);
		}
	});
}
function E() {
	if (window[m]) return;
	window[m] = !0;
	let e = G(() => T(), 90);
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
function D(i, o) {
	let s = O(o), l = r(i, c), u = !1, f = 0, p = !1, m = null, _ = null, v = null, x = !1;
	s.forEach((e) => e.classList.add("team-link")), i.setAttribute(d, "1"), A(i, o, s), j(s), P(l, o, {
		onPause: () => K(),
		onPlay: () => V(!0),
		onPrev: () => w(-1, !0),
		onNext: () => w(1, !0)
	});
	let S = a(o, {
		canStart: () => !u,
		onStart: () => {
			_?.kill(), n.killTweensOf(o);
		},
		onMove: ({ dx: e }) => {
			let t = I(o), n = W(e * .5, -t * .8, t * .8);
			o.classList.add(h), L(o, n);
		},
		onSwipe: ({ direction: e }) => {
			let t = B(o);
			o.classList.remove(h), x = !0, w(e, !0, t);
		},
		onCancel: () => {
			o.classList.remove(h), z(o);
		},
		threshold: b
	});
	i.addEventListener("keydown", (e) => {
		if (!U(e.target)) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), H(l.prev), w(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), H(l.next), w(1, !0));
		}
	}), o.addEventListener("pointerdown", (e) => {
		u || e.pointerType === "mouse" && e.button !== 0 || (_?.kill(), n.killTweensOf(o), v = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
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
		let a = I(o), s = W(t * .5, -a * .8, a * .8);
		v.dragged = !0, o.classList.add(h), L(o, s);
	}), o.addEventListener("pointerup", (e) => {
		if (!v || v.id !== e.pointerId) return;
		let t = e.clientX - v.startX, n = e.clientY - v.startY, r = v.dragged && Math.abs(t) > b && Math.abs(t) > Math.abs(n), i = B(o), a = v.dragged;
		if (v = null, o.classList.remove(h), a && S.markPointerHandled(), r) {
			x = !0, w(t < 0 ? 1 : -1, !0, i);
			return;
		}
		z(o);
	}), o.addEventListener("pointercancel", () => {
		v = null, o.classList.remove(h), z(o);
	}), o.addEventListener("click", (e) => {
		x && (x = !1, e.preventDefault(), e.stopPropagation());
	}, !0);
	let C = G(() => {
		D(), L(o, 0), M(i, o);
	}, 120);
	window.addEventListener("resize", C), i.__bemkeTeamSliderRefresh = C, L(o, 0), F(l, p), window.requestAnimationFrame(() => M(i, o)), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			J();
			return;
		}
		q();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (D(), L(o, 0), M(i, o));
	});
	function w(e, t = !1, n = null) {
		let r = e < 0 ? -1 : 1;
		if (t && p && q(), u) {
			f = r;
			return;
		}
		T(r, n);
	}
	function T(t, n = null) {
		let r = O(o), a = I(o);
		if (r.length < 2 || a <= 0) {
			L(o, 0);
			return;
		}
		if (e()) {
			k(o, r, t), L(o, 0), M(i, o), N();
			return;
		}
		if (u = !0, t > 0) {
			Number.isFinite(n) && L(o, n), _ = R(o, -a, () => {
				k(o, r, t), E();
			});
			return;
		}
		let s = Number.isFinite(n) ? n : 0;
		k(o, r, t), L(o, s - a), o.offsetHeight, _ = R(o, 0, E);
	}
	function E() {
		_ = null, i.classList.add(g), L(o, 0), o.offsetHeight, i.classList.remove(g), u = !1, M(i, o), N();
	}
	function D() {
		_?.kill(), _ = null, n.killTweensOf(o), u = !1, f = 0;
	}
	function N() {
		if (!f) return;
		let e = f;
		f = 0, T(e);
	}
	function V(e = !1) {
		p = !0, e && w(1), q(), F(l, p);
	}
	function K() {
		p = !1, J(), F(l, p);
	}
	function q() {
		p && (J(), m = window.setInterval(() => w(1), y));
	}
	function J() {
		m &&= (window.clearInterval(m), null);
	}
}
function O(e) {
	return Array.from(e?.children ?? []).filter((e) => e.querySelector(l));
}
function k(e, t, n) {
	if (n > 0) {
		e.appendChild(t[0]);
		return;
	}
	e.prepend(t[t.length - 1]);
}
function A(e, t, n) {
	C += 1, t.id ||= `bemke-team-slider-track-${C}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", V(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), n.forEach((e, t) => {
		let r = e.querySelector(".font-size-h4")?.textContent?.replace(/\s+/g, " ").trim();
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `${r ? `${r}, ` : ""}osoba ${t + 1} z ${n.length}`);
	});
}
function j(e) {
	e.forEach((e) => {
		e.querySelectorAll(u).forEach((e) => {
			e.hasAttribute(p) || e.setAttribute(p, e.getAttribute("tabindex") ?? "");
		}), e.querySelectorAll("img").forEach((e) => {
			e.setAttribute("draggable", "false"), e.setAttribute("decoding", "async"), e.draggable = !1;
		});
	});
}
function M(e, t) {
	let n = e.getBoundingClientRect();
	O(t).forEach((e, t) => {
		let r = e.getBoundingClientRect(), i = Math.max(0, Math.min(r.right, n.right) - Math.max(r.left, n.left)), a = r.width > 0 && i >= Math.min(r.width * .5, 80), o = t === 0;
		e.setAttribute(f, o ? "1" : "0"), e.setAttribute("aria-hidden", a ? "false" : "true"), o ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current"), N(e, a);
	});
}
function N(e, t) {
	"inert" in e && (e.inert = !t), e.querySelectorAll(u).forEach((e) => {
		if (!t) {
			e.setAttribute("tabindex", "-1");
			return;
		}
		let n = e.getAttribute(p);
		if (n) {
			e.setAttribute("tabindex", n);
			return;
		}
		e.removeAttribute("tabindex");
	});
}
function P(e, t, n) {
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
function F(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function I(e) {
	let t = O(e), n = t[0]?.getBoundingClientRect(), r = t[1]?.getBoundingClientRect();
	if (n && r) {
		let e = r.left - n.left;
		if (e > 0) return e;
	}
	let i = Number.parseFloat(window.getComputedStyle(e).columnGap) || 0;
	return (n?.width ?? 0) + i;
}
function L(e, t) {
	n.set(e, {
		x: t,
		force3D: !0
	});
}
function R(e, t, r) {
	return n.to(e, {
		x: t,
		duration: _,
		ease: x,
		force3D: !0,
		overwrite: "auto",
		onComplete: r
	});
}
function z(t) {
	if (e()) {
		L(t, 0);
		return;
	}
	n.to(t, {
		x: 0,
		duration: v,
		ease: S,
		force3D: !0,
		overwrite: "auto"
	});
}
function B(e) {
	let t = Number(n.getProperty(e, "x"));
	return Number.isFinite(t) ? t : 0;
}
function V(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider zespołu";
}
function H(e) {
	e && document.activeElement !== e && e.focus({ preventScroll: !0 });
}
function U(e) {
	return !!e?.closest?.("input, textarea, select, button, [contenteditable=\"true\"]");
}
function W(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function G(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { w as initTeamSlider };
