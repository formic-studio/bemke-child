import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-BlCrb88B.js";
import { a as r, i, r as a, t as o } from "./touch-swipe-fallback-Rxhk1pK8.js";
//#region src/js/modules/home-slider.js
var s = ".slider:not(.slider-thinktank)", c = ".slider-wrapper", l = ".slide", u = ".slider-paggination", d = "data-bemke-slider-ready", f = "slide-active", p = "__bemkeHomeSliderBooted", m = "is-resetting", h = "is-dragging", g = "is-ghost", _ = .9, v = .45, y = 3500, b = 46, x = .96, S = .008, C = "power1.inOut", w = "power3.out", T = 0, E = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new WeakSet();
function O() {
	k(), A();
}
function k(e = document) {
	e.querySelectorAll(s).forEach((e) => {
		if (e.getAttribute(d) === "1") {
			e.__bemkeHomeSliderRefresh?.();
			return;
		}
		j(e);
	});
}
function A() {
	if (window[p]) return;
	window[p] = !0;
	let e = $(() => {
		k();
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
function j(i) {
	let a = i.querySelector(c), s = a ? Array.from(a.querySelectorAll(`:scope > ${l}`)) : [];
	if (!a || s.length < 2) return;
	let u = I(i), f = R(s), p = 0, m = !1, g = 0, _ = !1, v = null, x = null, C = null;
	i.setAttribute(d, "1"), W(s, f), M(i, a, s), N(u, a, {
		onPause: () => A(),
		onPlay: () => k(!0),
		onPrev: () => T(-1, !0),
		onNext: () => T(1, !0)
	});
	let w = o(a, {
		canStart: () => !m,
		onStart: () => (n.killTweensOf(a), { offset: Z(a, p) }),
		onMove: ({ context: e, dx: t }) => {
			a.classList.add(h), Y(a, (e?.offset ?? p) + t * .36);
		},
		onSwipe: ({ direction: e }) => {
			a.classList.remove(h), T(e, !0);
		},
		onCancel: () => {
			a.classList.remove(h), X(a, p);
		},
		threshold: b
	});
	i.addEventListener("keydown", (e) => {
		if (!(r(e) || ae(e.target))) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), F(u.prev), T(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), F(u.next), T(1, !0));
		}
	}), a.addEventListener("pointerdown", (e) => {
		if (!(m || e.pointerType === "mouse" && e.button !== 0)) {
			n.killTweensOf(a), C = {
				id: e.pointerId,
				startX: e.clientX,
				startY: e.clientY,
				offset: Z(a, p),
				lockedAxis: null,
				dragged: !1
			};
			try {
				a.setPointerCapture(e.pointerId);
			} catch {}
		}
	}), a.addEventListener("pointermove", (e) => {
		if (!C || C.id !== e.pointerId) return;
		let t = e.clientX - C.startX, n = e.clientY - C.startY, r = Math.abs(t), i = Math.abs(n);
		!C.lockedAxis && (r > 8 || i > 8) && (C.lockedAxis = r > i ? "x" : "y"), C.lockedAxis === "x" && (C.dragged = !0, a.classList.add(h), Y(a, C.offset + t * .36));
	}), a.addEventListener("pointerup", (e) => {
		if (!C || C.id !== e.pointerId) return;
		let t = e.clientX - C.startX, n = e.clientY - C.startY, r = C.dragged && Math.abs(t) > b && Math.abs(t) > Math.abs(n), i = C.dragged;
		if (C = null, a.classList.remove(h), i && w.markPointerHandled(), r) {
			T(t < 0 ? 1 : -1, !0);
			return;
		}
		X(a, p);
	}), a.addEventListener("pointercancel", () => {
		C = null, a.classList.remove(h), X(a, p);
	}), window.addEventListener("resize", $(() => {
		D(), z(a, s, f), B(s, f), V(s, f, !1), p = q(i, a, s[f], p);
	}, 120)), i.__bemkeHomeSliderRefresh = () => {
		D(), z(a, s, f), B(s, f), V(s, f, !1), p = q(i, a, s[f], p);
	}, z(a, s, f), B(s, f), V(s, f, !1), p = q(i, a, s[f], p), L(u, _), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			P();
			return;
		}
		j();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (D(), f = R(s), z(a, s, f), B(s, f), V(s, f, !1), p = q(i, a, s[f], p));
	});
	function T(e, t = !1) {
		let n = e < 0 ? -1 : 1;
		if (t && _ && j(), m) {
			g = n;
			return;
		}
		E(n);
	}
	function E(t) {
		let n = Q(f + t, s.length), r = s[f], o = s[n], c = J(o) - J(r), l = e();
		if (K(s, n), B(s, n), V(s, n, !l && c !== 0), l || c === 0) {
			f = n, z(a, s, f), p = q(i, a, s[f], p), O();
			return;
		}
		m = !0;
		let u = Z(a, p);
		p -= c, x = re(a, o, u, p, S, () => {
			x = null, m = !1, f = n, z(a, s, f), p = q(i, a, s[f], p), O();
		});
	}
	function D() {
		x?.kill(), x = null, n.killTweensOf(a), n.set(s, {
			x: 0,
			force3D: !0
		}), m = !1, g = 0;
	}
	function O() {
		if (!g) return;
		let e = g;
		g = 0, E(e);
	}
	function k(e = !1) {
		_ = !0, e && T(1), j(), L(u, _);
	}
	function A() {
		_ = !1, P(), L(u, _);
	}
	function j() {
		_ && (P(), v = window.setInterval(() => {
			T(1);
		}, y));
	}
	function P() {
		v &&= (window.clearInterval(v), null);
	}
}
function M(e, t, n) {
	T += 1, t.id ||= `bemke-home-slider-track-${T}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.hasAttribute("aria-roledescription") || e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", ie(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), n.forEach((e, t) => {
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `Slajd ${t + 1} z ${n.length}`);
	});
}
function N(e, t, n) {
	P(e.pause, "Pauza autoplay", t.id, n.onPause), P(e.play, "Start autoplay", t.id, n.onPlay), P(e.prev, "Poprzedni slajd", t.id, n.onPrev), P(e.next, "Następny slajd", t.id, n.onNext);
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
function I(e) {
	return i(e, u);
}
function L(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function R(e) {
	let t = e.findIndex((e) => e.getAttribute(f) === "1");
	return t >= 0 ? t : 0;
}
function z(e, t, n) {
	U(e);
	let r = [];
	for (let e = -1; e < t.length - 1; e += 1) r.push(t[Q(n + e, t.length)]);
	e.appendChild(H(t[Q(n - 2, t.length)])), r.forEach((t) => {
		e.appendChild(t);
	}), e.appendChild(H(t[Q(n - 1, t.length)]));
}
function B(e, t) {
	e.forEach((e, n) => {
		let r = n === t;
		e.setAttribute(f, r ? "1" : "0"), e.setAttribute("aria-hidden", r ? "false" : "true"), e.setAttribute("aria-current", r ? "true" : "false");
	});
}
function V(e, t, r) {
	let i = e[t], a = e.filter((e, n) => n !== t);
	if (n.killTweensOf(e, "scale"), e.forEach((e, n) => {
		e.style.zIndex = n === t ? "2" : "1";
	}), !r) {
		n.set(a, { scale: x }), n.set(i, { scale: 1 });
		return;
	}
	n.to(a, {
		scale: x,
		duration: _,
		ease: C,
		overwrite: "auto"
	}), n.to(i, {
		scale: 1,
		duration: _,
		delay: S,
		ease: C,
		overwrite: "auto"
	});
}
function H(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(g), t.setAttribute(f, "0"), t.setAttribute("aria-hidden", "true"), t.removeAttribute("aria-current"), t.removeAttribute("id"), t.setAttribute("tabindex", "-1"), t.style.zIndex = "1", n.set(t, { scale: x }), "inert" in t && (t.inert = !0), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((e) => {
		e.setAttribute("tabindex", "-1");
	}), G(t), t;
}
function U(e) {
	e.querySelectorAll(`:scope > ${l}.${g}`).forEach((e) => {
		e.remove();
	});
}
function W(e, t) {
	e.forEach((e) => {
		G(e);
	}), K(e, t);
}
function G(e, t = !1, n = !1) {
	e.querySelectorAll("img").forEach((e) => {
		e.setAttribute("draggable", "false"), e.setAttribute("loading", t ? "eager" : "lazy"), e.setAttribute("decoding", "async"), e.setAttribute("fetchpriority", n ? "auto" : "low"), e.draggable = !1, t && ee(e, n ? "auto" : "low");
	});
}
function K(e, t) {
	[
		-1,
		0,
		1
	].forEach((n) => {
		let r = e[Q(t + n, e.length)];
		r && G(r, !0, n === 0);
	});
}
function ee(e, t = "low") {
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
function q(e, t, n, r) {
	if (!n) return r;
	e.classList.add(m);
	let i = r + te(e) - J(n);
	return Y(t, i), t.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove(m);
	}), i;
}
function te(e) {
	let t = e.getBoundingClientRect();
	return t.left + t.width / 2;
}
function J(e) {
	let t = e.getBoundingClientRect();
	return t.left + t.width / 2;
}
function Y(e, t) {
	n.set(e, {
		x: t,
		force3D: !0
	});
}
function ne(e, t, r, i, a) {
	return n.to(e, {
		x: t,
		duration: r,
		ease: i,
		force3D: !0,
		overwrite: "auto",
		onComplete: a
	});
}
function re(e, t, r, i, a, o) {
	let s = {
		trackProgress: 0,
		incomingProgress: 0
	}, c = i - r;
	n.killTweensOf(e), n.killTweensOf(t, "x"), n.set(t, {
		x: 0,
		force3D: !0
	});
	let l = n.timeline({
		onUpdate: () => {
			Y(e, r + c * s.trackProgress), n.set(t, {
				x: c * (s.incomingProgress - s.trackProgress),
				force3D: !0
			});
		},
		onComplete: () => {
			Y(e, i), n.set(t, {
				x: 0,
				force3D: !0
			}), o?.();
		},
		onInterrupt: () => {
			n.set(t, {
				x: 0,
				force3D: !0
			});
		}
	});
	return l.to(s, {
		trackProgress: 1,
		duration: _,
		ease: C
	}, 0), l.to(s, {
		incomingProgress: 1,
		duration: _,
		ease: C
	}, a), l;
}
function X(t, n) {
	if (e()) {
		Y(t, n);
		return;
	}
	ne(t, n, v, w);
}
function Z(e, t) {
	let r = Number(n.getProperty(e, "x"));
	return Number.isFinite(r) ? r : t;
}
function ie(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider zdjęć";
}
function ae(e) {
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
export { O as initHomeSlider };
