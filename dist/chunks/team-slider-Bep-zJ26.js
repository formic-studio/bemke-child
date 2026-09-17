import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { n } from "./site-language-BMLr3i6q.js";
import { t as r } from "./gsap-CjUXhbIO.js";
import { a as i, i as a, r as o, t as s } from "./touch-swipe-fallback-CD-fh-eJ.js";
//#region src/js/modules/team-slider.js
var c = ".slider-block", l = ":scope > .slider-wrapper", u = ":scope > .slider-paggination", d = "[data-number]:not(.popup-team)", f = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]", p = "data-bemke-team-slider-ready", m = "slide-active", h = "data-bemke-team-slide-visible", g = "data-bemke-team-original-tabindex", _ = "bemke-team-slider-status", v = "__bemkeTeamSliderBooted", y = "is-dragging", b = .8, x = .35, S = 3500, C = 46, w = "power3.inOut", T = "power3.out", E = 0;
function D() {
	O(), k();
}
function O(e = document) {
	e.querySelectorAll(c).forEach((e) => {
		let t = e.querySelector(l);
		if (!(!t || j(t).length < 2)) {
			if (e.getAttribute(p) === "1") {
				e.__bemkeTeamSliderRefresh?.();
				return;
			}
			A(e, t);
		}
	});
}
function k() {
	if (window[v]) return;
	window[v] = !0;
	let e = $(() => O(), 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) for (let t of n.addedNodes) if (t instanceof Element && (t.matches(c) || t.querySelector(c))) {
			e();
			return;
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function A(n, o) {
	let c = j(o), l = a(n, u), d = !1, f = 0, m = !1, g = null, _ = null, v = null, b = !1, x = 0;
	c.forEach((e) => e.classList.add("team-link")), n.setAttribute(p, "1"), M(n, o, c), P(c), z(l, o, {
		onPause: () => L(),
		onPlay: () => I(!0),
		onPrev: () => E(-1, !0),
		onNext: () => E(1, !0)
	}), n.addEventListener("scroll", () => G(n), { passive: !0 });
	let w = s(o, {
		canStart: () => !d,
		onStart: () => {
			_?.kill(), r.killTweensOf(o);
		},
		onMove: ({ dx: e }) => {
			let t = K(o), n = Q(e * .5, -t * .8, t * .8);
			o.classList.add(y), q(o, W(o, x) + n);
		},
		onSwipe: ({ direction: e }) => {
			let t = X(o);
			o.classList.remove(y), b = !0, E(e, !0, t);
		},
		onCancel: () => {
			o.classList.remove(y), Y(o, x);
		},
		threshold: C
	});
	n.addEventListener("keydown", (e) => {
		if (!(i(e) || te(e.target))) {
			if (e.key === "ArrowLeft") {
				if (x <= 0) return;
				e.preventDefault(), Z(l.prev), E(-1, !0);
				return;
			}
			if (e.key === "ArrowRight") {
				if (x >= U(n, o)) return;
				e.preventDefault(), Z(l.next), E(1, !0);
			}
		}
	}), n.addEventListener("focusin", (e) => {
		G(n), window.requestAnimationFrame(() => G(n));
		let t = e.target.closest?.(".team-link");
		if (!t || t.parentElement !== o || t.getAttribute(h) !== "false") return;
		let r = c.indexOf(t), i = H(n, o);
		D(r < x ? r : r - i + 1, !0);
	}), o.addEventListener("pointerdown", (e) => {
		d || e.pointerType === "mouse" && e.button !== 0 || (_?.kill(), r.killTweensOf(o), v = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			startOffset: W(o, x),
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
		let a = K(o), s = Q(t * .5, -a * .8, a * .8);
		v.dragged = !0, o.classList.add(y), q(o, v.startOffset + s);
	}), o.addEventListener("pointerup", (e) => {
		if (!v || v.id !== e.pointerId) return;
		let t = e.clientX - v.startX, n = e.clientY - v.startY, r = v.dragged && Math.abs(t) > C && Math.abs(t) > Math.abs(n), i = X(o), a = v.dragged;
		if (v = null, o.classList.remove(y), a && w.markPointerHandled(), r) {
			b = !0, E(t < 0 ? 1 : -1, !0, i);
			return;
		}
		Y(o, x);
	}), o.addEventListener("pointercancel", () => {
		v = null, o.classList.remove(y), Y(o, x);
	}), o.addEventListener("click", (e) => {
		b && (b = !1, e.preventDefault(), e.stopPropagation());
	}, !0);
	let T = $(() => {
		A(), x = Q(x, 0, U(n, o)), q(o, W(o, x)), F(n, o, x), B(l, m, x, U(n, o));
	}, 120);
	window.addEventListener("resize", T), n.__bemkeTeamSliderRefresh = T, q(o, 0), B(l, m, x, U(n, o)), window.requestAnimationFrame(() => {
		F(n, o, x), B(l, m, x, U(n, o));
	}), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			V();
			return;
		}
		R();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (A(), x = Q(x, 0, U(n, o)), q(o, W(o, x)), F(n, o, x), B(l, m, x, U(n, o)));
	});
	function E(e, t = !1, n = null) {
		let r = e < 0 ? -1 : 1;
		if (d) {
			f = r;
			return;
		}
		D(x + r, t, n);
	}
	function D(t, r = !1, i = null) {
		let a = U(n, o), s = Q(t, 0, a), c = K(o);
		if (r && m && R(), s === x || c <= 0) {
			Y(o, x), m && x >= a ? L() : B(l, m, x, a);
			return;
		}
		x = s;
		let u = W(o, x);
		if (G(n), Number.isFinite(i) && q(o, i), e()) {
			q(o, u), F(n, o, x), k(), N();
			return;
		}
		d = !0, B(l, m, x, a), _ = J(o, u, O);
	}
	function O() {
		_ = null, d = !1, q(o, W(o, x)), G(n), F(n, o, x), k(), N();
	}
	function k() {
		let e = U(n, o);
		if (m && x >= e) {
			L();
			return;
		}
		B(l, m, x, e);
	}
	function A() {
		_?.kill(), _ = null, r.killTweensOf(o), d = !1, f = 0;
	}
	function N() {
		if (!f) return;
		let e = f;
		f = 0, E(e);
	}
	function I(e = !1) {
		if (x >= U(n, o)) {
			B(l, !1, x, U(n, o));
			return;
		}
		m = !0, e && E(1), R(), B(l, m, x, U(n, o));
	}
	function L() {
		m = !1, V(), B(l, m, x, U(n, o));
	}
	function R() {
		m && (V(), g = window.setInterval(() => E(1), S));
	}
	function V() {
		g &&= (window.clearInterval(g), null);
	}
}
function j(e) {
	return Array.from(e?.children ?? []).filter((e) => e.querySelector(d));
}
function M(e, t, r) {
	E += 1, t.id ||= `bemke-team-slider-track-${E}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.setAttribute("aria-roledescription", n("karuzela", "carousel")), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", ee(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "off"), t.setAttribute("aria-atomic", "false"), I(e), r.forEach((e, t) => {
		let i = e.querySelector(".font-size-h4")?.textContent?.replace(/\s+/g, " ").trim();
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", n("slajd", "slide")), e.setAttribute("aria-label", `${i ? `${i}, ` : ""}${n(`osoba ${t + 1} z ${r.length}`, `person ${t + 1} of ${r.length}`)}`), N(e);
	});
}
function N(e) {
	Array.from(e.children).find((e) => /^0*\d+$/u.test(e.textContent?.trim() ?? ""))?.setAttribute("aria-hidden", "true");
}
function P(e) {
	e.forEach((e) => {
		e.querySelectorAll(f).forEach((e) => {
			e.hasAttribute(g) || e.setAttribute(g, e.getAttribute("tabindex") ?? "");
		}), e.querySelectorAll("img").forEach((e) => {
			e.setAttribute("draggable", "false"), e.setAttribute("decoding", "async"), e.draggable = !1;
		});
	});
}
function F(e, t, n = 0) {
	let r = e.getBoundingClientRect(), i = j(t);
	i.forEach((e, t) => {
		let i = e.getBoundingClientRect(), a = Math.max(0, Math.min(i.right, r.right) - Math.max(i.left, r.left)), o = i.width > 0 && a >= Math.min(i.width * .5, 80), s = t === n;
		e.setAttribute(m, s ? "1" : "0"), e.setAttribute(h, o ? "true" : "false"), e.removeAttribute("aria-hidden"), s ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current"), R(e);
	}), L(e, n, i.length, t);
}
function I(e) {
	let t = e.querySelector(`:scope > .${_}`);
	if (t) return t;
	let n = document.createElement("p");
	return n.className = `${_} bemke-sr-only`, n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), n.setAttribute("aria-atomic", "true"), e.appendChild(n), n;
}
function L(e, t, r, i) {
	let a = I(e), o = H(e, i), s = Math.min(r, t + 1), c = Math.min(r, t + o), l = s === c ? n(`Wyświetlana osoba ${s} z ${r}.`, `Showing person ${s} of ${r}.`) : n(`Wyświetlane osoby ${s}–${c} z ${r}.`, `Showing people ${s}–${c} of ${r}.`);
	a.textContent !== l && (a.textContent = l);
}
function R(e) {
	"inert" in e && (e.inert = !1), e.removeAttribute("inert"), e.querySelectorAll(f).forEach((e) => {
		let t = e.getAttribute(g);
		if (t) {
			e.setAttribute("tabindex", t);
			return;
		}
		e.removeAttribute("tabindex");
	});
}
function z(e, t, r) {
	o(e.pause, {
		label: n("Pauza autoplay", "Pause autoplay"),
		controlsId: t.id,
		handler: r.onPause
	}), o(e.play, {
		label: n("Start autoplay", "Start autoplay"),
		controlsId: t.id,
		handler: r.onPlay
	}), o(e.prev, {
		label: n("Poprzednia osoba", "Previous person"),
		controlsId: t.id,
		handler: r.onPrev
	}), o(e.next, {
		label: n("Następna osoba", "Next person"),
		controlsId: t.id,
		handler: r.onNext
	});
}
function B(e, t, n, r) {
	V(e.prev, n <= 0), V(e.next, n >= r), V(e.play, t || n >= r), V(e.pause, !t);
}
function V(e, t) {
	e && (e.classList.toggle("is-disabled", t), e.setAttribute("aria-disabled", t ? "true" : "false"));
}
function H(e, t) {
	let n = j(t), r = n[0]?.getBoundingClientRect(), i = K(t), a = e.getBoundingClientRect().width;
	if (!r?.width || i <= 0 || a <= 0) return 1;
	let o = Math.max(0, i - r.width);
	return Q(Math.floor((a + o + 1) / i), 1, n.length);
}
function U(e, t) {
	return Math.max(0, j(t).length - H(e, t));
}
function W(e, t) {
	return -Q(t, 0, j(e).length - 1) * K(e);
}
function G(e) {
	e.scrollLeft !== 0 && (e.scrollLeft = 0);
}
function K(e) {
	let t = j(e), n = t[0]?.getBoundingClientRect(), r = t[1]?.getBoundingClientRect();
	if (n && r) {
		let e = r.left - n.left;
		if (e > 0) return e;
	}
	let i = Number.parseFloat(window.getComputedStyle(e).columnGap) || 0;
	return (n?.width ?? 0) + i;
}
function q(e, t) {
	r.set(e, {
		x: t,
		force3D: !0
	});
}
function J(e, t, n) {
	return r.to(e, {
		x: t,
		duration: b,
		ease: w,
		force3D: !0,
		overwrite: "auto",
		onComplete: n
	});
}
function Y(t, n) {
	let i = W(t, n);
	if (e()) {
		q(t, i);
		return;
	}
	r.to(t, {
		x: i,
		duration: x,
		ease: T,
		force3D: !0,
		overwrite: "auto"
	});
}
function X(e) {
	let t = Number(r.getProperty(e, "x"));
	return Number.isFinite(t) ? t : 0;
}
function ee(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : n("Slider zespołu", "Team carousel");
}
function Z(e) {
	e && document.activeElement !== e && e.focus({ preventScroll: !0 });
}
function te(e) {
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
export { D as initTeamSlider };
