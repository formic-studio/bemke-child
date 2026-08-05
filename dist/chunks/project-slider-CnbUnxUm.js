import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./font-size-controls-DUBBhJnJ.js";
import { t as r } from "./gsap-BlCrb88B.js";
import { i, r as a, t as o } from "./touch-swipe-fallback-D2n6TRec.js";
//#region src/js/modules/project-slider.js
var s = ".slider-block", c = ".slide-wrapper", l = ".slide-project", u = ".slider-paggination", d = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]", f = "data-bemke-project-slider-ready", p = "slide-active", m = "__bemkeProjectSliderBooted", h = "is-resetting", g = "is-dragging", _ = "is-ghost", v = "data-bemke-original-tabindex", y = "--bemke-project-slide-height", ee = .9, b = .45, te = 3500, x = 46, ne = "power3.inOut", S = "power3.out", C = 0, w = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new WeakSet();
function E() {
	D(), O();
}
function D(e = document) {
	e.querySelectorAll(s).forEach((e) => {
		if (e.getAttribute(f) === "1") {
			e.__bemkeProjectSliderRefresh?.();
			return;
		}
		k(e);
	});
}
function O() {
	if (window[m]) return;
	window[m] = !0;
	let e = $(() => {
		D();
	}, 90);
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
function k(i) {
	let a = i.querySelector(c), s = a ? Array.from(a.querySelectorAll(`:scope > ${l}:not(.${_})`)) : [];
	if (!a || s.length < 2) return;
	let u = re(i), d = L(s), p = 0, m = !1, h = 0, v = !1, y = null, b = null, S = null, C = !1, w = null, T = () => {
		window.cancelAnimationFrame(w), w = window.requestAnimationFrame(() => {
			w = null, A(i, s);
		});
	};
	i.setAttribute(f, "1"), ie(s, d), M(i, a, s), N(u, a, {
		onPause: () => V(),
		onPlay: () => B(!0),
		onPrev: () => D(-1, !0),
		onNext: () => D(1, !0)
	});
	let E = o(a, {
		canStart: () => !m,
		onStart: () => (r.killTweensOf(a), { offset: Z(a, p) }),
		onMove: ({ context: e, dx: t }) => {
			a.classList.add(g), J(a, (e?.offset ?? p) + t * .36);
		},
		onSwipe: ({ direction: e }) => {
			a.classList.remove(g), C = !0, D(e, !0);
		},
		onCancel: () => {
			a.classList.remove(g), X(a, p);
		},
		threshold: x
	});
	i.addEventListener("keydown", (e) => {
		if (!ce(e.target)) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), F(u.prev), D(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), F(u.next), D(1, !0));
		}
	}), a.addEventListener("pointerdown", (e) => {
		m || e.pointerType === "mouse" && e.button !== 0 || (r.killTweensOf(a), S = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			offset: Z(a, p),
			lockedAxis: null,
			dragged: !1
		});
	}), a.addEventListener("pointermove", (e) => {
		if (!S || S.id !== e.pointerId) return;
		let t = e.clientX - S.startX, n = e.clientY - S.startY, r = Math.abs(t), i = Math.abs(n);
		if (!S.lockedAxis && (r > 8 || i > 8) && (S.lockedAxis = r > i ? "x" : "y"), S.lockedAxis === "x") {
			if (e.preventDefault(), !a.hasPointerCapture(e.pointerId)) try {
				a.setPointerCapture(e.pointerId);
			} catch {}
			S.dragged = !0, a.classList.add(g), J(a, S.offset + t * .36);
		}
	}), a.addEventListener("pointerup", (e) => {
		if (!S || S.id !== e.pointerId) return;
		let t = e.clientX - S.startX, n = e.clientY - S.startY, r = S.dragged && Math.abs(t) > x && Math.abs(t) > Math.abs(n), i = S.dragged;
		if (S = null, a.classList.remove(g), i && E.markPointerHandled(), r) {
			C = !0, D(t < 0 ? 1 : -1, !0);
			return;
		}
		X(a, p);
	}), a.addEventListener("pointercancel", () => {
		S = null, a.classList.remove(g), X(a, p);
	}), a.addEventListener("click", (e) => {
		C && (C = !1, e.preventDefault(), e.stopPropagation());
	}, !0), window.addEventListener("resize", $(() => {
		k(), R(a, s, d), z(s, d), p = K(i, a, s[d], p), T();
	}, 120)), i.__bemkeProjectSliderRefresh = () => {
		k(), R(a, s, d), z(s, d), p = K(i, a, s[d], p), T();
	}, R(a, s, d), z(s, d), p = K(i, a, s[d], p), I(u, v), T(), i.__bemkeProjectSliderHeightObserver = j(s, T), document.fonts?.ready.then(T).catch(() => {}), document.addEventListener(n, T), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			U();
			return;
		}
		H();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (k(), d = L(s), R(a, s, d), z(s, d), p = K(i, a, s[d], p));
	});
	function D(e, t = !1) {
		let n = e < 0 ? -1 : 1;
		if (t && v && H(), m) {
			h = n;
			return;
		}
		O(n);
	}
	function O(t) {
		let n = Q(d + t, s.length), r = s[d], o = s[n], c = q(o) - q(r), l = e();
		if (G(s, n), z(s, n), l || c === 0) {
			d = n, R(a, s, d), p = K(i, a, s[d], p), P();
			return;
		}
		m = !0, p -= c, b = Y(a, p, ee, ne, () => {
			b = null, m = !1, d = n, R(a, s, d), p = K(i, a, s[d], p), P();
		});
	}
	function k() {
		b?.kill(), b = null, r.killTweensOf(a), m = !1, h = 0;
	}
	function P() {
		if (!h) return;
		let e = h;
		h = 0, O(e);
	}
	function B(e = !1) {
		v = !0, e && D(1), H(), I(u, v);
	}
	function V() {
		v = !1, U(), I(u, v);
	}
	function H() {
		v && (U(), y = window.setInterval(() => {
			D(1);
		}, te));
	}
	function U() {
		y &&= (window.clearInterval(y), null);
	}
}
function A(e, t) {
	e.style.setProperty(y, "0px");
	let n = t.reduce((e, t) => Math.max(e, t.getBoundingClientRect().height), 0);
	if (n > 0) {
		e.style.setProperty(y, `${Math.ceil(n)}px`);
		return;
	}
	e.style.removeProperty(y);
}
function j(e, t) {
	if (!window.ResizeObserver) return null;
	let n = new ResizeObserver(t);
	return e.forEach((e) => {
		Array.from(e.children).forEach((e) => n.observe(e));
	}), n;
}
function M(e, t, n) {
	C += 1, t.id ||= `bemke-project-slider-track-${C}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.hasAttribute("aria-roledescription") || e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", se(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), n.forEach((e, t) => {
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `Slajd ${t + 1} z ${n.length}`);
	});
}
function N(e, t, n) {
	P(e.pause, "Pauza autoplay", t.id, n.onPause), P(e.play, "Start autoplay", t.id, n.onPlay), P(e.prev, "Poprzedni projekt", t.id, n.onPrev), P(e.next, "Następny projekt", t.id, n.onNext);
}
function P(e, t, n, r) {
	a(e, {
		label: t,
		controlsId: n,
		handler: r
	});
}
function F(e) {
	!e || document.activeElement === e || e.focus({ preventScroll: !0 });
}
function re(e) {
	return i(e, u);
}
function I(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function L(e) {
	let t = e.findIndex((e) => e.getAttribute(p) === "1");
	return t >= 0 ? t : 0;
}
function R(e, t, n) {
	V(e);
	let r = [];
	for (let e = -1; e < t.length - 1; e += 1) r.push(t[Q(n + e, t.length)]);
	e.appendChild(B(t[Q(n - 2, t.length)])), r.forEach((t) => {
		e.appendChild(t);
	}), e.appendChild(B(t[Q(n - 1, t.length)]));
}
function z(e, t) {
	e.forEach((e, n) => {
		let r = n === t;
		e.setAttribute(p, r ? "1" : "0"), e.setAttribute("aria-hidden", r ? "false" : "true"), e.setAttribute("aria-current", r ? "true" : "false"), U(e, r);
	});
}
function B(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(_), t.setAttribute(p, "0"), t.setAttribute("aria-hidden", "true"), t.removeAttribute("aria-current"), t.removeAttribute("id"), t.setAttribute("tabindex", "-1"), "inert" in t && (t.inert = !0), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t.querySelectorAll(d).forEach((e) => {
		e.setAttribute("tabindex", "-1");
	}), W(t), t;
}
function V(e) {
	e.querySelectorAll(`:scope > ${l}.${_}`).forEach((e) => {
		e.remove();
	});
}
function ie(e, t) {
	e.forEach((e) => {
		H(e), W(e);
	}), G(e, t);
}
function H(e) {
	e.querySelectorAll(d).forEach((e) => {
		e.hasAttribute(v) || e.setAttribute(v, e.getAttribute("tabindex") ?? "");
	});
}
function U(e, t) {
	"inert" in e && (e.inert = !t), e.querySelectorAll(d).forEach((e) => {
		if (!t) {
			e.setAttribute("tabindex", "-1");
			return;
		}
		let n = e.getAttribute(v);
		if (n) {
			e.setAttribute("tabindex", n);
			return;
		}
		e.removeAttribute("tabindex");
	});
}
function W(e, t = !1, n = !1) {
	e.querySelectorAll("img").forEach((e) => {
		e.setAttribute("draggable", "false"), e.setAttribute("loading", t ? "eager" : "lazy"), e.setAttribute("decoding", "async"), e.setAttribute("fetchpriority", n ? "auto" : "low"), e.draggable = !1, t && ae(e, n ? "auto" : "low");
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
function ae(e, t = "low") {
	let n = e.currentSrc || e.getAttribute("src") || e.src;
	if (!n || T.has(e) || e.complete && e.naturalWidth > 0) return;
	let r = new Image(), i = e.getAttribute("srcset"), a = e.getAttribute("sizes");
	i && (r.srcset = i), a && (r.sizes = a), r.decoding = "async", r.fetchPriority = t;
	let o = () => {
		w.delete(r), T.delete(e);
	};
	r.onload = () => {
		o(), e.decode?.().catch(() => {});
	}, r.onerror = o, T.add(e), w.add(r), r.src = n;
}
function K(e, t, n, r) {
	if (!n) return r;
	e.classList.add(h);
	let i = r + oe(e) - q(n);
	return J(t, i), t.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove(h);
	}), i;
}
function oe(e) {
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
	Y(t, n, b, S);
}
function Z(e, t) {
	let n = Number(r.getProperty(e, "x"));
	return Number.isFinite(n) ? n : t;
}
function se(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider projektów";
}
function ce(e) {
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
export { E as initProjectSlider };
