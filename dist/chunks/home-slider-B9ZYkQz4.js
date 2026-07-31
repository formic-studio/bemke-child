import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-0BK4_Us1.js";
import { n as r, r as i } from "./slider-controls-CEzz34oU.js";
//#region src/js/modules/home-slider.js
var a = ".slider:not(.slider-thinktank)", o = ".slider-wrapper", s = ".slide", c = ".slider-paggination", l = "data-bemke-slider-ready", u = "slide-active", d = "__bemkeHomeSliderBooted", f = "is-resetting", p = "is-dragging", m = "is-ghost", h = .9, g = .45, _ = 3500, v = 46, y = .96, b = .008, x = "power1.inOut", S = "power3.out", C = 0, w = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new WeakSet();
function E() {
	D(), O();
}
function D(e = document) {
	e.querySelectorAll(a).forEach((e) => {
		if (e.getAttribute(l) === "1") {
			e.__bemkeHomeSliderRefresh?.();
			return;
		}
		k(e);
	});
}
function O() {
	if (window[d]) return;
	window[d] = !0;
	let e = $(() => {
		D();
	}, 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) for (let t of n.addedNodes) if (t instanceof Element && (t.matches(a) || t.querySelector(a))) {
			e();
			return;
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function k(r) {
	let i = r.querySelector(o), a = i ? Array.from(i.querySelectorAll(`:scope > ${s}`)) : [];
	if (!i || a.length < 2) return;
	let c = P(r), u = I(a), d = 0, f = !1, m = 0, h = !1, g = null, y = null, x = null;
	r.setAttribute(l, "1"), H(a, u), A(r, i, a), j(c, i, {
		onPause: () => D(),
		onPlay: () => E(!0),
		onPrev: () => S(-1, !0),
		onNext: () => S(1, !0)
	}), r.addEventListener("keydown", (e) => {
		if (!re(e.target)) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), N(c.prev), S(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), N(c.next), S(1, !0));
		}
	}), i.addEventListener("pointerdown", (e) => {
		if (!(f || e.pointerType === "mouse" && e.button !== 0)) {
			n.killTweensOf(i), x = {
				id: e.pointerId,
				startX: e.clientX,
				startY: e.clientY,
				offset: Z(i, d),
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
		!x.lockedAxis && (r > 8 || a > 8) && (x.lockedAxis = r > a ? "x" : "y"), x.lockedAxis === "x" && (x.dragged = !0, i.classList.add(p), Y(i, x.offset + t * .36));
	}), i.addEventListener("pointerup", (e) => {
		if (!x || x.id !== e.pointerId) return;
		let t = e.clientX - x.startX, n = e.clientY - x.startY, r = x.dragged && Math.abs(t) > v && Math.abs(t) > Math.abs(n);
		if (x = null, i.classList.remove(p), r) {
			S(t < 0 ? 1 : -1, !0);
			return;
		}
		X(i, d);
	}), i.addEventListener("pointercancel", () => {
		x = null, i.classList.remove(p), X(i, d);
	}), window.addEventListener("resize", $(() => {
		w(), L(i, a, u), R(a, u), z(a, u, !1), d = K(r, i, a[u], d);
	}, 120)), r.__bemkeHomeSliderRefresh = () => {
		w(), L(i, a, u), R(a, u), z(a, u, !1), d = K(r, i, a[u], d);
	}, L(i, a, u), R(a, u), z(a, u, !1), d = K(r, i, a[u], d), F(c, h), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			k();
			return;
		}
		O();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (w(), u = I(a), L(i, a, u), R(a, u), z(a, u, !1), d = K(r, i, a[u], d));
	});
	function S(e, t = !1) {
		let n = e < 0 ? -1 : 1;
		if (t && h && O(), f) {
			m = n;
			return;
		}
		C(n);
	}
	function C(t) {
		let n = Q(u + t, a.length), o = a[u], s = a[n], c = J(s) - J(o), l = e();
		if (W(a, n), R(a, n), z(a, n, !l && c !== 0), l || c === 0) {
			u = n, L(i, a, u), d = K(r, i, a[u], d), T();
			return;
		}
		f = !0;
		let p = Z(i, d);
		d -= c, y = te(i, s, p, d, b, () => {
			y = null, f = !1, u = n, L(i, a, u), d = K(r, i, a[u], d), T();
		});
	}
	function w() {
		y?.kill(), y = null, n.killTweensOf(i), n.set(a, {
			x: 0,
			force3D: !0
		}), f = !1, m = 0;
	}
	function T() {
		if (!m) return;
		let e = m;
		m = 0, C(e);
	}
	function E(e = !1) {
		h = !0, e && S(1), O(), F(c, h);
	}
	function D() {
		h = !1, k(), F(c, h);
	}
	function O() {
		h && (k(), g = window.setInterval(() => {
			S(1);
		}, _));
	}
	function k() {
		g &&= (window.clearInterval(g), null);
	}
}
function A(e, t, n) {
	C += 1, t.id ||= `bemke-home-slider-track-${C}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.hasAttribute("aria-roledescription") || e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", ne(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), n.forEach((e, t) => {
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `Slajd ${t + 1} z ${n.length}`);
	});
}
function j(e, t, n) {
	M(e.pause, "Pauza autoplay", t.id, n.onPause), M(e.play, "Start autoplay", t.id, n.onPlay), M(e.prev, "Poprzedni slajd", t.id, n.onPrev), M(e.next, "Następny slajd", t.id, n.onNext);
}
function M(e, t, n, i) {
	r(e, {
		label: t,
		controlsId: n,
		handler: i
	});
}
function N(e) {
	!e || document.activeElement === e || e.focus({ preventScroll: !0 });
}
function P(e) {
	return i(e, c);
}
function F(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function I(e) {
	let t = e.findIndex((e) => e.getAttribute(u) === "1");
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
		e.setAttribute(u, r ? "1" : "0"), e.setAttribute("aria-hidden", r ? "false" : "true"), e.setAttribute("aria-current", r ? "true" : "false");
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
		duration: h,
		ease: x,
		overwrite: "auto"
	}), n.to(i, {
		scale: 1,
		duration: h,
		delay: b,
		ease: x,
		overwrite: "auto"
	});
}
function B(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(m), t.setAttribute(u, "0"), t.setAttribute("aria-hidden", "true"), t.removeAttribute("aria-current"), t.removeAttribute("id"), t.setAttribute("tabindex", "-1"), t.style.zIndex = "1", n.set(t, { scale: y }), "inert" in t && (t.inert = !0), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((e) => {
		e.setAttribute("tabindex", "-1");
	}), U(t), t;
}
function V(e) {
	e.querySelectorAll(`:scope > ${s}.${m}`).forEach((e) => {
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
	e.classList.add(f);
	let i = r + q(e) - J(n);
	return Y(t, i), t.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove(f);
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
function ee(e, t, r, i, a) {
	return n.to(e, {
		x: t,
		duration: r,
		ease: i,
		force3D: !0,
		overwrite: "auto",
		onComplete: a
	});
}
function te(e, t, r, i, a, o) {
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
		duration: h,
		ease: x
	}, 0), l.to(s, {
		incomingProgress: 1,
		duration: h,
		ease: x
	}, a), l;
}
function X(t, n) {
	if (e()) {
		Y(t, n);
		return;
	}
	ee(t, n, g, S);
}
function Z(e, t) {
	let r = Number(n.getProperty(e, "x"));
	return Number.isFinite(r) ? r : t;
}
function ne(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider zdjęć";
}
function re(e) {
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
