import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { n } from "./site-language-BMLr3i6q.js";
import { t as r } from "./font-size-controls-CJ-nO-IF.js";
import { t as i } from "./gsap-CjUXhbIO.js";
import { a, i as o, r as s, t as c } from "./touch-swipe-fallback-CD-fh-eJ.js";
//#region src/js/modules/project-slider.js
var l = ".slider-block", ee = ".slide-wrapper", u = ".slide-project", d = ".slider-paggination", f = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]", p = "data-bemke-project-slider-ready", m = "slide-active", h = "__bemkeProjectSliderBooted", g = "is-resetting", _ = "is-dragging", v = "is-ghost", y = "data-bemke-original-tabindex", b = "--bemke-project-slide-height", te = .9, x = .45, ne = 3500, S = 46, re = "power3.inOut", C = "power3.out", w = 0, T = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new WeakSet();
function D() {
	O(), k();
}
function O(e = document) {
	e.querySelectorAll(l).forEach((e) => {
		if (e.getAttribute(p) === "1") {
			e.__bemkeProjectSliderRefresh?.();
			return;
		}
		A(e);
	});
}
function k() {
	if (window[h]) return;
	window[h] = !0;
	let e = $(() => {
		O();
	}, 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) for (let t of n.addedNodes) if (t instanceof Element && (t.matches(l) || t.querySelector(l))) {
			e();
			return;
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function A(n) {
	let o = n.querySelector(ee), s = o ? Array.from(o.querySelectorAll(`:scope > ${u}:not(.${v})`)) : [];
	if (!o || s.length < 2) return;
	let l = ie(n), d = R(s), f = 0, m = !1, h = 0, g = !1, y = null, b = null, x = null, C = !1, w = null, T = () => {
		window.cancelAnimationFrame(w), w = window.requestAnimationFrame(() => {
			w = null, j(n, s);
		});
	};
	n.setAttribute(p, "1"), ae(s, d), N(n, o, s), P(l, o, {
		onPause: () => V(),
		onPlay: () => F(!0),
		onPrev: () => D(-1, !0),
		onNext: () => D(1, !0)
	});
	let E = c(o, {
		canStart: () => !m,
		onStart: () => (i.killTweensOf(o), { offset: Z(o, f) }),
		onMove: ({ context: e, dx: t }) => {
			o.classList.add(_), J(o, (e?.offset ?? f) + t * .36);
		},
		onSwipe: ({ direction: e }) => {
			o.classList.remove(_), C = !0, D(e, !0);
		},
		onCancel: () => {
			o.classList.remove(_), X(o, f);
		},
		threshold: S
	});
	n.addEventListener("keydown", (e) => {
		if (!(a(e) || ue(e.target))) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), I(l.prev), D(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), I(l.next), D(1, !0));
		}
	}), o.addEventListener("pointerdown", (e) => {
		m || e.pointerType === "mouse" && e.button !== 0 || (i.killTweensOf(o), x = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			offset: Z(o, f),
			lockedAxis: null,
			dragged: !1
		});
	}), o.addEventListener("pointermove", (e) => {
		if (!x || x.id !== e.pointerId) return;
		let t = e.clientX - x.startX, n = e.clientY - x.startY, r = Math.abs(t), i = Math.abs(n);
		if (!x.lockedAxis && (r > 8 || i > 8) && (x.lockedAxis = r > i ? "x" : "y"), x.lockedAxis === "x") {
			if (e.preventDefault(), !o.hasPointerCapture(e.pointerId)) try {
				o.setPointerCapture(e.pointerId);
			} catch {}
			x.dragged = !0, o.classList.add(_), J(o, x.offset + t * .36);
		}
	}), o.addEventListener("pointerup", (e) => {
		if (!x || x.id !== e.pointerId) return;
		let t = e.clientX - x.startX, n = e.clientY - x.startY, r = x.dragged && Math.abs(t) > S && Math.abs(t) > Math.abs(n), i = x.dragged;
		if (x = null, o.classList.remove(_), i && E.markPointerHandled(), r) {
			C = !0, D(t < 0 ? 1 : -1, !0);
			return;
		}
		X(o, f);
	}), o.addEventListener("pointercancel", () => {
		x = null, o.classList.remove(_), X(o, f);
	}), o.addEventListener("click", (e) => {
		C && (C = !1, e.preventDefault(), e.stopPropagation());
	}, !0), window.addEventListener("resize", $(() => {
		k(), z(o, s, d), B(s, d), f = K(n, o, s[d], f), T();
	}, 120)), n.__bemkeProjectSliderRefresh = () => {
		k(), z(o, s, d), B(s, d), f = K(n, o, s[d], f), T();
	}, z(o, s, d), B(s, d), f = K(n, o, s[d], f), L(l, g), T(), n.__bemkeProjectSliderHeightObserver = M(s, T), document.fonts?.ready.then(T).catch(() => {}), document.addEventListener(r, T), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			U();
			return;
		}
		H();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (k(), d = R(s), z(o, s, d), B(s, d), f = K(n, o, s[d], f));
	});
	function D(e, t = !1) {
		let n = e < 0 ? -1 : 1;
		if (t && g && H(), m) {
			h = n;
			return;
		}
		O(n);
	}
	function O(t) {
		let r = Q(d + t, s.length), i = s[d], a = s[r], c = q(a) - q(i), l = e();
		if (G(s, r), B(s, r), l || c === 0) {
			d = r, z(o, s, d), f = K(n, o, s[d], f), A();
			return;
		}
		m = !0, f -= c, b = Y(o, f, te, re, () => {
			b = null, m = !1, d = r, z(o, s, d), f = K(n, o, s[d], f), A();
		});
	}
	function k() {
		b?.kill(), b = null, i.killTweensOf(o), m = !1, h = 0;
	}
	function A() {
		if (!h) return;
		let e = h;
		h = 0, O(e);
	}
	function F(e = !1) {
		g = !0, e && D(1), H(), L(l, g);
	}
	function V() {
		g = !1, U(), L(l, g);
	}
	function H() {
		g && (U(), y = window.setInterval(() => {
			D(1);
		}, ne));
	}
	function U() {
		y &&= (window.clearInterval(y), null);
	}
}
function j(e, t) {
	e.style.setProperty(b, "0px");
	let n = t.reduce((e, t) => Math.max(e, t.getBoundingClientRect().height), 0);
	if (n > 0) {
		e.style.setProperty(b, `${Math.ceil(n)}px`);
		return;
	}
	e.style.removeProperty(b);
}
function M(e, t) {
	if (!window.ResizeObserver) return null;
	let n = new ResizeObserver(t);
	return e.forEach((e) => {
		Array.from(e.children).forEach((e) => n.observe(e));
	}), n;
}
function N(e, t, r) {
	w += 1, t.id ||= `bemke-project-slider-track-${w}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.hasAttribute("aria-roledescription") || e.setAttribute("aria-roledescription", n("karuzela", "carousel")), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", le(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), r.forEach((e, t) => {
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", n("slajd", "slide")), e.setAttribute("aria-label", n(`Slajd ${t + 1} z ${r.length}`, `Slide ${t + 1} of ${r.length}`));
	});
}
function P(e, t, r) {
	F(e.pause, n("Pauza autoplay", "Pause autoplay"), t.id, r.onPause), F(e.play, n("Start autoplay", "Start autoplay"), t.id, r.onPlay), F(e.prev, n("Poprzedni projekt", "Previous project"), t.id, r.onPrev), F(e.next, n("Następny projekt", "Next project"), t.id, r.onNext);
}
function F(e, t, n, r) {
	s(e, {
		label: t,
		controlsId: n,
		handler: r
	});
}
function I(e) {
	!e || document.activeElement === e || e.focus({ preventScroll: !0 });
}
function ie(e) {
	return o(e, d);
}
function L(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function R(e) {
	let t = e.findIndex((e) => e.getAttribute(m) === "1");
	return t >= 0 ? t : 0;
}
function z(e, t, n) {
	H(e);
	let r = [];
	for (let e = -1; e < t.length - 1; e += 1) r.push(t[Q(n + e, t.length)]);
	e.appendChild(V(t[Q(n - 2, t.length)])), r.forEach((t) => {
		e.appendChild(t);
	}), e.appendChild(V(t[Q(n - 1, t.length)]));
}
function B(e, t) {
	e.forEach((e, n) => {
		let r = n === t;
		e.setAttribute(m, r ? "1" : "0"), e.setAttribute("aria-hidden", r ? "false" : "true"), e.setAttribute("aria-current", r ? "true" : "false"), oe(e, r);
	});
}
function V(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(v), t.setAttribute(m, "0"), t.setAttribute("aria-hidden", "true"), t.removeAttribute("aria-current"), t.removeAttribute("id"), t.setAttribute("tabindex", "-1"), "inert" in t && (t.inert = !0), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t.querySelectorAll(f).forEach((e) => {
		e.setAttribute("tabindex", "-1");
	}), W(t), t;
}
function H(e) {
	e.querySelectorAll(`:scope > ${u}.${v}`).forEach((e) => {
		e.remove();
	});
}
function ae(e, t) {
	e.forEach((e) => {
		U(e), W(e);
	}), G(e, t);
}
function U(e) {
	e.querySelectorAll(f).forEach((e) => {
		e.hasAttribute(y) || e.setAttribute(y, e.getAttribute("tabindex") ?? "");
	});
}
function oe(e, t) {
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
		e.setAttribute("draggable", "false"), e.setAttribute("loading", t ? "eager" : "lazy"), e.setAttribute("decoding", "async"), e.setAttribute("fetchpriority", n ? "auto" : "low"), e.draggable = !1, t && se(e, n ? "auto" : "low");
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
function se(e, t = "low") {
	let n = e.currentSrc || e.getAttribute("src") || e.src;
	if (!n || E.has(e) || e.complete && e.naturalWidth > 0) return;
	let r = new Image(), i = e.getAttribute("srcset"), a = e.getAttribute("sizes");
	i && (r.srcset = i), a && (r.sizes = a), r.decoding = "async", r.fetchPriority = t;
	let o = () => {
		T.delete(r), E.delete(e);
	};
	r.onload = () => {
		o(), e.decode?.().catch(() => {});
	}, r.onerror = o, E.add(e), T.add(r), r.src = n;
}
function K(e, t, n, r) {
	if (!n) return r;
	e.classList.add(g);
	let i = r + ce(e) - q(n);
	return J(t, i), t.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove(g);
	}), i;
}
function ce(e) {
	let t = e.getBoundingClientRect();
	return t.left + t.width / 2;
}
function q(e) {
	let t = e.getBoundingClientRect();
	return t.left + t.width / 2;
}
function J(e, t) {
	i.set(e, {
		x: t,
		force3D: !0
	});
}
function Y(e, t, n, r, a) {
	return i.to(e, {
		x: t,
		duration: n,
		ease: r,
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
	Y(t, n, x, C);
}
function Z(e, t) {
	let n = Number(i.getProperty(e, "x"));
	return Number.isFinite(n) ? n : t;
}
function le(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : n("Slider projektów", "Project carousel");
}
function ue(e) {
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
export { D as initProjectSlider };
