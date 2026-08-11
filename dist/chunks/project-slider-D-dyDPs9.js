import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./font-size-controls-DUBBhJnJ.js";
import { t as r } from "./gsap-BlCrb88B.js";
import { a as i, i as a, r as o, t as s } from "./touch-swipe-fallback-Rxhk1pK8.js";
//#region src/js/modules/project-slider.js
var c = ".slider-block", l = ".slide-wrapper", u = ".slide-project", d = ".slider-paggination", f = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]", p = "data-bemke-project-slider-ready", m = "slide-active", h = "__bemkeProjectSliderBooted", g = "is-resetting", _ = "is-dragging", v = "is-ghost", y = "data-bemke-original-tabindex", b = "--bemke-project-slide-height", x = .9, S = .45, ee = 3500, C = 46, te = "power3.inOut", w = "power3.out", T = 0, E = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new WeakSet();
function O() {
	k(), A();
}
function k(e = document) {
	e.querySelectorAll(c).forEach((e) => {
		if (e.getAttribute(p) === "1") {
			e.__bemkeProjectSliderRefresh?.();
			return;
		}
		j(e);
	});
}
function A() {
	if (window[h]) return;
	window[h] = !0;
	let e = $(() => {
		k();
	}, 90);
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
function j(a) {
	let o = a.querySelector(l), c = o ? Array.from(o.querySelectorAll(`:scope > ${u}:not(.${v})`)) : [];
	if (!o || c.length < 2) return;
	let d = P(a), f = I(c), m = 0, h = !1, g = 0, y = !1, b = null, S = null, w = null, T = !1, E = null, D = () => {
		window.cancelAnimationFrame(E), E = window.requestAnimationFrame(() => {
			E = null, ne(a, c);
		});
	};
	a.setAttribute(p, "1"), V(c, f), ie(a, o, c), ae(d, o, {
		onPause: () => B(),
		onPlay: () => z(!0),
		onPrev: () => k(-1, !0),
		onNext: () => k(1, !0)
	});
	let O = s(o, {
		canStart: () => !h,
		onStart: () => (r.killTweensOf(o), { offset: Z(o, m) }),
		onMove: ({ context: e, dx: t }) => {
			o.classList.add(_), J(o, (e?.offset ?? m) + t * .36);
		},
		onSwipe: ({ direction: e }) => {
			o.classList.remove(_), T = !0, k(e, !0);
		},
		onCancel: () => {
			o.classList.remove(_), X(o, m);
		},
		threshold: C
	});
	a.addEventListener("keydown", (e) => {
		if (!(i(e) || le(e.target))) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), N(d.prev), k(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), N(d.next), k(1, !0));
		}
	}), o.addEventListener("pointerdown", (e) => {
		h || e.pointerType === "mouse" && e.button !== 0 || (r.killTweensOf(o), w = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			offset: Z(o, m),
			lockedAxis: null,
			dragged: !1
		});
	}), o.addEventListener("pointermove", (e) => {
		if (!w || w.id !== e.pointerId) return;
		let t = e.clientX - w.startX, n = e.clientY - w.startY, r = Math.abs(t), i = Math.abs(n);
		if (!w.lockedAxis && (r > 8 || i > 8) && (w.lockedAxis = r > i ? "x" : "y"), w.lockedAxis === "x") {
			if (e.preventDefault(), !o.hasPointerCapture(e.pointerId)) try {
				o.setPointerCapture(e.pointerId);
			} catch {}
			w.dragged = !0, o.classList.add(_), J(o, w.offset + t * .36);
		}
	}), o.addEventListener("pointerup", (e) => {
		if (!w || w.id !== e.pointerId) return;
		let t = e.clientX - w.startX, n = e.clientY - w.startY, r = w.dragged && Math.abs(t) > C && Math.abs(t) > Math.abs(n), i = w.dragged;
		if (w = null, o.classList.remove(_), i && O.markPointerHandled(), r) {
			T = !0, k(t < 0 ? 1 : -1, !0);
			return;
		}
		X(o, m);
	}), o.addEventListener("pointercancel", () => {
		w = null, o.classList.remove(_), X(o, m);
	}), o.addEventListener("click", (e) => {
		T && (T = !1, e.preventDefault(), e.stopPropagation());
	}, !0), window.addEventListener("resize", $(() => {
		j(), L(o, c, f), R(c, f), m = K(a, o, c[f], m), D();
	}, 120)), a.__bemkeProjectSliderRefresh = () => {
		j(), L(o, c, f), R(c, f), m = K(a, o, c[f], m), D();
	}, L(o, c, f), R(c, f), m = K(a, o, c[f], m), F(d, y), D(), a.__bemkeProjectSliderHeightObserver = re(c, D), document.fonts?.ready.then(D).catch(() => {}), document.addEventListener(n, D), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			U();
			return;
		}
		H();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (j(), f = I(c), L(o, c, f), R(c, f), m = K(a, o, c[f], m));
	});
	function k(e, t = !1) {
		let n = e < 0 ? -1 : 1;
		if (t && y && H(), h) {
			g = n;
			return;
		}
		A(n);
	}
	function A(t) {
		let n = Q(f + t, c.length), r = c[f], i = c[n], s = q(i) - q(r), l = e();
		if (G(c, n), R(c, n), l || s === 0) {
			f = n, L(o, c, f), m = K(a, o, c[f], m), M();
			return;
		}
		h = !0, m -= s, S = Y(o, m, x, te, () => {
			S = null, h = !1, f = n, L(o, c, f), m = K(a, o, c[f], m), M();
		});
	}
	function j() {
		S?.kill(), S = null, r.killTweensOf(o), h = !1, g = 0;
	}
	function M() {
		if (!g) return;
		let e = g;
		g = 0, A(e);
	}
	function z(e = !1) {
		y = !0, e && k(1), H(), F(d, y);
	}
	function B() {
		y = !1, U(), F(d, y);
	}
	function H() {
		y && (U(), b = window.setInterval(() => {
			k(1);
		}, ee));
	}
	function U() {
		b &&= (window.clearInterval(b), null);
	}
}
function ne(e, t) {
	e.style.setProperty(b, "0px");
	let n = t.reduce((e, t) => Math.max(e, t.getBoundingClientRect().height), 0);
	if (n > 0) {
		e.style.setProperty(b, `${Math.ceil(n)}px`);
		return;
	}
	e.style.removeProperty(b);
}
function re(e, t) {
	if (!window.ResizeObserver) return null;
	let n = new ResizeObserver(t);
	return e.forEach((e) => {
		Array.from(e.children).forEach((e) => n.observe(e));
	}), n;
}
function ie(e, t, n) {
	T += 1, t.id ||= `bemke-project-slider-track-${T}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.hasAttribute("aria-roledescription") || e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", ce(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), n.forEach((e, t) => {
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `Slajd ${t + 1} z ${n.length}`);
	});
}
function ae(e, t, n) {
	M(e.pause, "Pauza autoplay", t.id, n.onPause), M(e.play, "Start autoplay", t.id, n.onPlay), M(e.prev, "Poprzedni projekt", t.id, n.onPrev), M(e.next, "Następny projekt", t.id, n.onNext);
}
function M(e, t, n, r) {
	o(e, {
		label: t,
		controlsId: n,
		handler: r
	});
}
function N(e) {
	!e || document.activeElement === e || e.focus({ preventScroll: !0 });
}
function P(e) {
	return a(e, d);
}
function F(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function I(e) {
	let t = e.findIndex((e) => e.getAttribute(m) === "1");
	return t >= 0 ? t : 0;
}
function L(e, t, n) {
	B(e);
	let r = [];
	for (let e = -1; e < t.length - 1; e += 1) r.push(t[Q(n + e, t.length)]);
	e.appendChild(z(t[Q(n - 2, t.length)])), r.forEach((t) => {
		e.appendChild(t);
	}), e.appendChild(z(t[Q(n - 1, t.length)]));
}
function R(e, t) {
	e.forEach((e, n) => {
		let r = n === t;
		e.setAttribute(m, r ? "1" : "0"), e.setAttribute("aria-hidden", r ? "false" : "true"), e.setAttribute("aria-current", r ? "true" : "false"), U(e, r);
	});
}
function z(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(v), t.setAttribute(m, "0"), t.setAttribute("aria-hidden", "true"), t.removeAttribute("aria-current"), t.removeAttribute("id"), t.setAttribute("tabindex", "-1"), "inert" in t && (t.inert = !0), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t.querySelectorAll(f).forEach((e) => {
		e.setAttribute("tabindex", "-1");
	}), W(t), t;
}
function B(e) {
	e.querySelectorAll(`:scope > ${u}.${v}`).forEach((e) => {
		e.remove();
	});
}
function V(e, t) {
	e.forEach((e) => {
		H(e), W(e);
	}), G(e, t);
}
function H(e) {
	e.querySelectorAll(f).forEach((e) => {
		e.hasAttribute(y) || e.setAttribute(y, e.getAttribute("tabindex") ?? "");
	});
}
function U(e, t) {
	"inert" in e && (e.inert = !t), e.querySelectorAll(f).forEach((e) => {
		if (!t) {
			e.setAttribute("tabindex", "-1");
			return;
		}
		let n = e.getAttribute(y);
		if (n) {
			e.setAttribute("tabindex", n);
			return;
		}
		e.removeAttribute("tabindex");
	});
}
function W(e, t = !1, n = !1) {
	e.querySelectorAll("img").forEach((e) => {
		e.setAttribute("draggable", "false"), e.setAttribute("loading", t ? "eager" : "lazy"), e.setAttribute("decoding", "async"), e.setAttribute("fetchpriority", n ? "auto" : "low"), e.draggable = !1, t && oe(e, n ? "auto" : "low");
	});
}
function G(e, t) {
	[
		-1,
		0,
		1
	].forEach((n) => {
		let r = e[Q(t + n, e.length)];
		r && W(r, !0, n === 0);
	});
}
function oe(e, t = "low") {
	let n = e.currentSrc || e.getAttribute("src") || e.src;
	if (!n || D.has(e) || e.complete && e.naturalWidth > 0) return;
	let r = new Image(), i = e.getAttribute("srcset"), a = e.getAttribute("sizes");
	i && (r.srcset = i), a && (r.sizes = a), r.decoding = "async", r.fetchPriority = t;
	let o = () => {
		E.delete(r), D.delete(e);
	};
	r.onload = () => {
		o(), e.decode?.().catch(() => {});
	}, r.onerror = o, D.add(e), E.add(r), r.src = n;
}
function K(e, t, n, r) {
	if (!n) return r;
	e.classList.add(g);
	let i = r + se(e) - q(n);
	return J(t, i), t.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove(g);
	}), i;
}
function se(e) {
	let t = e.getBoundingClientRect();
	return t.left + t.width / 2;
}
function q(e) {
	let t = e.getBoundingClientRect();
	return t.left + t.width / 2;
}
function J(e, t) {
	r.set(e, {
		x: t,
		force3D: !0
	});
}
function Y(e, t, n, i, a) {
	return r.to(e, {
		x: t,
		duration: n,
		ease: i,
		force3D: !0,
		overwrite: "auto",
		onComplete: a
	});
}
function X(t, n) {
	if (e()) {
		J(t, n);
		return;
	}
	Y(t, n, S, w);
}
function Z(e, t) {
	let n = Number(r.getProperty(e, "x"));
	return Number.isFinite(n) ? n : t;
}
function ce(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider projektów";
}
function le(e) {
	return !!e?.closest?.("input, textarea, select, button, [contenteditable=\"true\"]");
}
function Q(e, t) {
	return (e + t) % t;
}
function $(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { O as initProjectSlider };
