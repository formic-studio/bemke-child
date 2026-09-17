import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { n } from "./site-language-BMLr3i6q.js";
import { t as r } from "./gsap-CjUXhbIO.js";
import { a as i, i as a, r as o, t as s } from "./touch-swipe-fallback-CD-fh-eJ.js";
//#region src/js/modules/home-slider.js
var c = ".slider:not(.slider-thinktank)", l = ".slider-wrapper", u = ".slide", d = ".slider-paggination", f = "data-bemke-slider-ready", p = "slide-active", m = "__bemkeHomeSliderBooted", h = "is-resetting", g = "is-dragging", _ = "is-ghost", v = .9, y = .45, b = 3500, x = 46, S = .96, C = .008, w = "power1.inOut", T = "power3.out", E = 0, D = /* @__PURE__ */ new Set(), O = /* @__PURE__ */ new WeakSet();
function k() {
	A(), j();
}
function A(e = document) {
	e.querySelectorAll(c).forEach((e) => {
		if (e.getAttribute(f) === "1") {
			e.__bemkeHomeSliderRefresh?.();
			return;
		}
		M(e);
	});
}
function j() {
	if (window[m]) return;
	window[m] = !0;
	let e = $(() => {
		A();
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
function M(n) {
	let a = n.querySelector(l), o = a ? Array.from(a.querySelectorAll(`:scope > ${u}`)) : [];
	if (!a || o.length < 2) return;
	let c = I(n), d = R(o), p = 0, m = !1, h = 0, _ = !1, v = null, y = null, S = null;
	n.setAttribute(f, "1"), W(o, d), ee(n, a, o), N(c, a, {
		onPause: () => A(),
		onPlay: () => k(!0),
		onPrev: () => T(-1, !0),
		onNext: () => T(1, !0)
	});
	let w = s(a, {
		canStart: () => !m,
		onStart: () => (r.killTweensOf(a), { offset: Z(a, p) }),
		onMove: ({ context: e, dx: t }) => {
			a.classList.add(g), Y(a, (e?.offset ?? p) + t * .36);
		},
		onSwipe: ({ direction: e }) => {
			a.classList.remove(g), T(e, !0);
		},
		onCancel: () => {
			a.classList.remove(g), X(a, p);
		},
		threshold: x
	});
	n.addEventListener("keydown", (e) => {
		if (!(i(e) || oe(e.target))) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), F(c.prev), T(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), F(c.next), T(1, !0));
		}
	}), a.addEventListener("pointerdown", (e) => {
		if (!(m || e.pointerType === "mouse" && e.button !== 0)) {
			r.killTweensOf(a), S = {
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
		if (!S || S.id !== e.pointerId) return;
		let t = e.clientX - S.startX, n = e.clientY - S.startY, r = Math.abs(t), i = Math.abs(n);
		!S.lockedAxis && (r > 8 || i > 8) && (S.lockedAxis = r > i ? "x" : "y"), S.lockedAxis === "x" && (S.dragged = !0, a.classList.add(g), Y(a, S.offset + t * .36));
	}), a.addEventListener("pointerup", (e) => {
		if (!S || S.id !== e.pointerId) return;
		let t = e.clientX - S.startX, n = e.clientY - S.startY, r = S.dragged && Math.abs(t) > x && Math.abs(t) > Math.abs(n), i = S.dragged;
		if (S = null, a.classList.remove(g), i && w.markPointerHandled(), r) {
			T(t < 0 ? 1 : -1, !0);
			return;
		}
		X(a, p);
	}), a.addEventListener("pointercancel", () => {
		S = null, a.classList.remove(g), X(a, p);
	}), window.addEventListener("resize", $(() => {
		D(), z(a, o, d), B(o, d), V(o, d, !1), p = q(n, a, o[d], p);
	}, 120)), n.__bemkeHomeSliderRefresh = () => {
		D(), z(a, o, d), B(o, d), V(o, d, !1), p = q(n, a, o[d], p);
	}, z(a, o, d), B(o, d), V(o, d, !1), p = q(n, a, o[d], p), L(c, _), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			M();
			return;
		}
		j();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (D(), d = R(o), z(a, o, d), B(o, d), V(o, d, !1), p = q(n, a, o[d], p));
	});
	function T(e, t = !1) {
		let n = e < 0 ? -1 : 1;
		if (t && _ && j(), m) {
			h = n;
			return;
		}
		E(n);
	}
	function E(t) {
		let r = Q(d + t, o.length), i = o[d], s = o[r], c = J(s) - J(i), l = e();
		if (K(o, r), B(o, r), V(o, r, !l && c !== 0), l || c === 0) {
			d = r, z(a, o, d), p = q(n, a, o[d], p), O();
			return;
		}
		m = !0;
		let u = Z(a, p);
		p -= c, y = ie(a, s, u, p, C, () => {
			y = null, m = !1, d = r, z(a, o, d), p = q(n, a, o[d], p), O();
		});
	}
	function D() {
		y?.kill(), y = null, r.killTweensOf(a), r.set(o, {
			x: 0,
			force3D: !0
		}), m = !1, h = 0;
	}
	function O() {
		if (!h) return;
		let e = h;
		h = 0, E(e);
	}
	function k(e = !1) {
		_ = !0, e && T(1), j(), L(c, _);
	}
	function A() {
		_ = !1, M(), L(c, _);
	}
	function j() {
		_ && (M(), v = window.setInterval(() => {
			T(1);
		}, b));
	}
	function M() {
		v &&= (window.clearInterval(v), null);
	}
}
function ee(e, t, r) {
	E += 1, t.id ||= `bemke-home-slider-track-${E}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.hasAttribute("aria-roledescription") || e.setAttribute("aria-roledescription", n("karuzela", "carousel")), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", ae(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), r.forEach((e, t) => {
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", n("slajd", "slide")), e.setAttribute("aria-label", n(`Slajd ${t + 1} z ${r.length}`, `Slide ${t + 1} of ${r.length}`));
	});
}
function N(e, t, r) {
	P(e.pause, n("Pauza autoplay", "Pause autoplay"), t.id, r.onPause), P(e.play, n("Start autoplay", "Start autoplay"), t.id, r.onPlay), P(e.prev, n("Poprzedni slajd", "Previous slide"), t.id, r.onPrev), P(e.next, n("Następny slajd", "Next slide"), t.id, r.onNext);
}
function P(e, t, n, r) {
	o(e, {
		label: t,
		controlsId: n,
		handler: r
	});
}
function F(e) {
	!e || document.activeElement === e || e.focus({ preventScroll: !0 });
}
function I(e) {
	return a(e, d);
}
function L(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function R(e) {
	let t = e.findIndex((e) => e.getAttribute(p) === "1");
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
		e.setAttribute(p, r ? "1" : "0"), e.setAttribute("aria-hidden", r ? "false" : "true"), e.setAttribute("aria-current", r ? "true" : "false");
	});
}
function V(e, t, n) {
	let i = e[t], a = e.filter((e, n) => n !== t);
	if (r.killTweensOf(e, "scale"), e.forEach((e, n) => {
		e.style.zIndex = n === t ? "2" : "1";
	}), !n) {
		r.set(a, { scale: S }), r.set(i, { scale: 1 });
		return;
	}
	r.to(a, {
		scale: S,
		duration: v,
		ease: w,
		overwrite: "auto"
	}), r.to(i, {
		scale: 1,
		duration: v,
		delay: C,
		ease: w,
		overwrite: "auto"
	});
}
function H(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(_), t.setAttribute(p, "0"), t.setAttribute("aria-hidden", "true"), t.removeAttribute("aria-current"), t.removeAttribute("id"), t.setAttribute("tabindex", "-1"), t.style.zIndex = "1", r.set(t, { scale: S }), "inert" in t && (t.inert = !0), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((e) => {
		e.setAttribute("tabindex", "-1");
	}), G(t), t;
}
function U(e) {
	e.querySelectorAll(`:scope > ${u}.${_}`).forEach((e) => {
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
		e.setAttribute("draggable", "false"), e.setAttribute("loading", t ? "eager" : "lazy"), e.setAttribute("decoding", "async"), e.setAttribute("fetchpriority", n ? "auto" : "low"), e.draggable = !1, t && te(e, n ? "auto" : "low");
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
function te(e, t = "low") {
	let n = e.currentSrc || e.getAttribute("src") || e.src;
	if (!n || O.has(e) || e.complete && e.naturalWidth > 0) return;
	let r = new Image(), i = e.getAttribute("srcset"), a = e.getAttribute("sizes");
	i && (r.srcset = i), a && (r.sizes = a), r.decoding = "async", r.fetchPriority = t;
	let o = () => {
		D.delete(r), O.delete(e);
	};
	r.onload = () => {
		o(), e.decode?.().catch(() => {});
	}, r.onerror = o, O.add(e), D.add(r), r.src = n;
}
function q(e, t, n, r) {
	if (!n) return r;
	e.classList.add(h);
	let i = r + ne(e) - J(n);
	return Y(t, i), t.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove(h);
	}), i;
}
function ne(e) {
	let t = e.getBoundingClientRect();
	return t.left + t.width / 2;
}
function J(e) {
	let t = e.getBoundingClientRect();
	return t.left + t.width / 2;
}
function Y(e, t) {
	r.set(e, {
		x: t,
		force3D: !0
	});
}
function re(e, t, n, i, a) {
	return r.to(e, {
		x: t,
		duration: n,
		ease: i,
		force3D: !0,
		overwrite: "auto",
		onComplete: a
	});
}
function ie(e, t, n, i, a, o) {
	let s = {
		trackProgress: 0,
		incomingProgress: 0
	}, c = i - n;
	r.killTweensOf(e), r.killTweensOf(t, "x"), r.set(t, {
		x: 0,
		force3D: !0
	});
	let l = r.timeline({
		onUpdate: () => {
			Y(e, n + c * s.trackProgress), r.set(t, {
				x: c * (s.incomingProgress - s.trackProgress),
				force3D: !0
			});
		},
		onComplete: () => {
			Y(e, i), r.set(t, {
				x: 0,
				force3D: !0
			}), o?.();
		},
		onInterrupt: () => {
			r.set(t, {
				x: 0,
				force3D: !0
			});
		}
	});
	return l.to(s, {
		trackProgress: 1,
		duration: v,
		ease: w
	}, 0), l.to(s, {
		incomingProgress: 1,
		duration: v,
		ease: w
	}, a), l;
}
function X(t, n) {
	if (e()) {
		Y(t, n);
		return;
	}
	re(t, n, y, T);
}
function Z(e, t) {
	let n = Number(r.getProperty(e, "x"));
	return Number.isFinite(n) ? n : t;
}
function ae(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : n("Slider zdjęć", "Image carousel");
}
function oe(e) {
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
export { k as initHomeSlider };
