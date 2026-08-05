import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-BlCrb88B.js";
import { i as r, r as i, t as a } from "./touch-swipe-fallback-D2n6TRec.js";
//#region src/js/modules/home-slider.js
var o = ".slider:not(.slider-thinktank)", s = ".slider-wrapper", c = ".slide", l = ".slider-paggination", u = "data-bemke-slider-ready", d = "slide-active", f = "__bemkeHomeSliderBooted", p = "is-resetting", m = "is-dragging", h = "is-ghost", g = .9, _ = .45, ee = 3500, v = 46, y = .96, b = .008, x = "power1.inOut", S = "power3.out", C = 0, w = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new WeakSet();
function E() {
	D(), O();
}
function D(e = document) {
	e.querySelectorAll(o).forEach((e) => {
		if (e.getAttribute(u) === "1") {
			e.__bemkeHomeSliderRefresh?.();
			return;
		}
		k(e);
	});
}
function O() {
	if (window[f]) return;
	window[f] = !0;
	let e = $(() => {
		D();
	}, 90);
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
function k(r) {
	let i = r.querySelector(s), o = i ? Array.from(i.querySelectorAll(`:scope > ${c}`)) : [];
	if (!i || o.length < 2) return;
	let l = P(r), d = I(o), f = 0, p = !1, h = 0, g = !1, _ = null, y = null, x = null;
	r.setAttribute(u, "1"), H(o, d), A(r, i, o), j(l, i, {
		onPause: () => O(),
		onPlay: () => D(!0),
		onPrev: () => C(-1, !0),
		onNext: () => C(1, !0)
	});
	let S = a(i, {
		canStart: () => !p,
		onStart: () => (n.killTweensOf(i), { offset: Z(i, f) }),
		onMove: ({ context: e, dx: t }) => {
			i.classList.add(m), Y(i, (e?.offset ?? f) + t * .36);
		},
		onSwipe: ({ direction: e }) => {
			i.classList.remove(m), C(e, !0);
		},
		onCancel: () => {
			i.classList.remove(m), X(i, f);
		},
		threshold: v
	});
	r.addEventListener("keydown", (e) => {
		if (!ie(e.target)) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), N(l.prev), C(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), N(l.next), C(1, !0));
		}
	}), i.addEventListener("pointerdown", (e) => {
		if (!(p || e.pointerType === "mouse" && e.button !== 0)) {
			n.killTweensOf(i), x = {
				id: e.pointerId,
				startX: e.clientX,
				startY: e.clientY,
				offset: Z(i, f),
				lockedAxis: null,
				dragged: !1
			};
			try {
				i.setPointerCapture(e.pointerId);
			} catch {}
		}
	}), i.addEventListener("pointermove", (e) => {
		if (!x || x.id !== e.pointerId) return;
		let t = e.clientX - x.startX, n = e.clientY - x.startY, r = Math.abs(t), a = Math.abs(n);
		!x.lockedAxis && (r > 8 || a > 8) && (x.lockedAxis = r > a ? "x" : "y"), x.lockedAxis === "x" && (x.dragged = !0, i.classList.add(m), Y(i, x.offset + t * .36));
	}), i.addEventListener("pointerup", (e) => {
		if (!x || x.id !== e.pointerId) return;
		let t = e.clientX - x.startX, n = e.clientY - x.startY, r = x.dragged && Math.abs(t) > v && Math.abs(t) > Math.abs(n), a = x.dragged;
		if (x = null, i.classList.remove(m), a && S.markPointerHandled(), r) {
			C(t < 0 ? 1 : -1, !0);
			return;
		}
		X(i, f);
	}), i.addEventListener("pointercancel", () => {
		x = null, i.classList.remove(m), X(i, f);
	}), window.addEventListener("resize", $(() => {
		T(), L(i, o, d), R(o, d), z(o, d, !1), f = K(r, i, o[d], f);
	}, 120)), r.__bemkeHomeSliderRefresh = () => {
		T(), L(i, o, d), R(o, d), z(o, d, !1), f = K(r, i, o[d], f);
	}, L(i, o, d), R(o, d), z(o, d, !1), f = K(r, i, o[d], f), F(l, g), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			M();
			return;
		}
		k();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (T(), d = I(o), L(i, o, d), R(o, d), z(o, d, !1), f = K(r, i, o[d], f));
	});
	function C(e, t = !1) {
		let n = e < 0 ? -1 : 1;
		if (t && g && k(), p) {
			h = n;
			return;
		}
		w(n);
	}
	function w(t) {
		let n = Q(d + t, o.length), a = o[d], s = o[n], c = J(s) - J(a), l = e();
		if (W(o, n), R(o, n), z(o, n, !l && c !== 0), l || c === 0) {
			d = n, L(i, o, d), f = K(r, i, o[d], f), E();
			return;
		}
		p = !0;
		let u = Z(i, f);
		f -= c, y = ne(i, s, u, f, b, () => {
			y = null, p = !1, d = n, L(i, o, d), f = K(r, i, o[d], f), E();
		});
	}
	function T() {
		y?.kill(), y = null, n.killTweensOf(i), n.set(o, {
			x: 0,
			force3D: !0
		}), p = !1, h = 0;
	}
	function E() {
		if (!h) return;
		let e = h;
		h = 0, w(e);
	}
	function D(e = !1) {
		g = !0, e && C(1), k(), F(l, g);
	}
	function O() {
		g = !1, M(), F(l, g);
	}
	function k() {
		g && (M(), _ = window.setInterval(() => {
			C(1);
		}, ee));
	}
	function M() {
		_ &&= (window.clearInterval(_), null);
	}
}
function A(e, t, n) {
	C += 1, t.id ||= `bemke-home-slider-track-${C}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.hasAttribute("aria-roledescription") || e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", re(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), n.forEach((e, t) => {
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `Slajd ${t + 1} z ${n.length}`);
	});
}
function j(e, t, n) {
	M(e.pause, "Pauza autoplay", t.id, n.onPause), M(e.play, "Start autoplay", t.id, n.onPlay), M(e.prev, "Poprzedni slajd", t.id, n.onPrev), M(e.next, "Następny slajd", t.id, n.onNext);
}
function M(e, t, n, r) {
	i(e, {
		label: t,
		controlsId: n,
		handler: r
	});
}
function N(e) {
	!e || document.activeElement === e || e.focus({ preventScroll: !0 });
}
function P(e) {
	return r(e, l);
}
function F(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function I(e) {
	let t = e.findIndex((e) => e.getAttribute(d) === "1");
	return t >= 0 ? t : 0;
}
function L(e, t, n) {
	V(e);
	let r = [];
	for (let e = -1; e < t.length - 1; e += 1) r.push(t[Q(n + e, t.length)]);
	e.appendChild(B(t[Q(n - 2, t.length)])), r.forEach((t) => {
		e.appendChild(t);
	}), e.appendChild(B(t[Q(n - 1, t.length)]));
}
function R(e, t) {
	e.forEach((e, n) => {
		let r = n === t;
		e.setAttribute(d, r ? "1" : "0"), e.setAttribute("aria-hidden", r ? "false" : "true"), e.setAttribute("aria-current", r ? "true" : "false");
	});
}
function z(e, t, r) {
	let i = e[t], a = e.filter((e, n) => n !== t);
	if (n.killTweensOf(e, "scale"), e.forEach((e, n) => {
		e.style.zIndex = n === t ? "2" : "1";
	}), !r) {
		n.set(a, { scale: y }), n.set(i, { scale: 1 });
		return;
	}
	n.to(a, {
		scale: y,
		duration: g,
		ease: x,
		overwrite: "auto"
	}), n.to(i, {
		scale: 1,
		duration: g,
		delay: b,
		ease: x,
		overwrite: "auto"
	});
}
function B(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(h), t.setAttribute(d, "0"), t.setAttribute("aria-hidden", "true"), t.removeAttribute("aria-current"), t.removeAttribute("id"), t.setAttribute("tabindex", "-1"), t.style.zIndex = "1", n.set(t, { scale: y }), "inert" in t && (t.inert = !0), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((e) => {
		e.setAttribute("tabindex", "-1");
	}), U(t), t;
}
function V(e) {
	e.querySelectorAll(`:scope > ${c}.${h}`).forEach((e) => {
		e.remove();
	});
}
function H(e, t) {
	e.forEach((e) => {
		U(e);
	}), W(e, t);
}
function U(e, t = !1, n = !1) {
	e.querySelectorAll("img").forEach((e) => {
		e.setAttribute("draggable", "false"), e.setAttribute("loading", t ? "eager" : "lazy"), e.setAttribute("decoding", "async"), e.setAttribute("fetchpriority", n ? "auto" : "low"), e.draggable = !1, t && G(e, n ? "auto" : "low");
	});
}
function W(e, t) {
	[
		-1,
		0,
		1
	].forEach((n) => {
		let r = e[Q(t + n, e.length)];
		r && U(r, !0, n === 0);
	});
}
function G(e, t = "low") {
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
	e.classList.add(p);
	let i = r + q(e) - J(n);
	return Y(t, i), t.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove(p);
	}), i;
}
function q(e) {
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
function te(e, t, r, i, a) {
	return n.to(e, {
		x: t,
		duration: r,
		ease: i,
		force3D: !0,
		overwrite: "auto",
		onComplete: a
	});
}
function ne(e, t, r, i, a, o) {
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
		duration: g,
		ease: x
	}, 0), l.to(s, {
		incomingProgress: 1,
		duration: g,
		ease: x
	}, a), l;
}
function X(t, n) {
	if (e()) {
		Y(t, n);
		return;
	}
	te(t, n, _, S);
}
function Z(e, t) {
	let r = Number(n.getProperty(e, "x"));
	return Number.isFinite(r) ? r : t;
}
function re(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider zdjęć";
}
function ie(e) {
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
export { E as initHomeSlider };
