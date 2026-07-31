import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./font-size-controls-hQ8NHYJR.js";
import { t as r } from "./gsap-0BK4_Us1.js";
import { n as i, r as a } from "./slider-controls-CEzz34oU.js";
//#region src/js/modules/project-slider.js
var o = ".slider-block", s = ".slide-wrapper", c = ".slide-project", l = ".slider-paggination", u = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]", d = "data-bemke-project-slider-ready", f = "slide-active", p = "__bemkeProjectSliderBooted", m = "is-resetting", h = "is-dragging", g = "is-ghost", _ = "data-bemke-original-tabindex", v = "--bemke-project-slide-height", y = .9, b = .45, ee = 3500, x = 46, S = "power3.inOut", C = "power3.out", w = 0, T = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new WeakSet();
function D() {
	O(), k();
}
function O(e = document) {
	e.querySelectorAll(o).forEach((e) => {
		if (e.getAttribute(d) === "1") {
			e.__bemkeProjectSliderRefresh?.();
			return;
		}
		A(e);
	});
}
function k() {
	if (window[p]) return;
	window[p] = !0;
	let e = $(() => {
		O();
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
function A(i) {
	let a = i.querySelector(s), o = a ? Array.from(a.querySelectorAll(`:scope > ${c}:not(.${g})`)) : [];
	if (!a || o.length < 2) return;
	let l = re(i), u = I(o), f = 0, p = !1, m = 0, _ = !1, v = null, b = null, C = null, w = !1, T = null, E = () => {
		window.cancelAnimationFrame(T), T = window.requestAnimationFrame(() => {
			T = null, j(i, o);
		});
	};
	i.setAttribute(d, "1"), V(o, u), te(i, a, o), ne(l, a, {
		onPause: () => z(),
		onPlay: () => N(!0),
		onPrev: () => D(-1, !0),
		onNext: () => D(1, !0)
	}), i.addEventListener("keydown", (e) => {
		if (!se(e.target)) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), P(l.prev), D(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), P(l.next), D(1, !0));
		}
	}), a.addEventListener("pointerdown", (e) => {
		p || e.pointerType === "mouse" && e.button !== 0 || (r.killTweensOf(a), C = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			offset: ae(a, f),
			lockedAxis: null,
			dragged: !1
		});
	}), a.addEventListener("pointermove", (e) => {
		if (!C || C.id !== e.pointerId) return;
		let t = e.clientX - C.startX, n = e.clientY - C.startY, r = Math.abs(t), i = Math.abs(n);
		if (!C.lockedAxis && (r > 8 || i > 8) && (C.lockedAxis = r > i ? "x" : "y"), C.lockedAxis === "x") {
			if (e.preventDefault(), !a.hasPointerCapture(e.pointerId)) try {
				a.setPointerCapture(e.pointerId);
			} catch {}
			C.dragged = !0, a.classList.add(h), Y(a, C.offset + t * .36);
		}
	}), a.addEventListener("pointerup", (e) => {
		if (!C || C.id !== e.pointerId) return;
		let t = e.clientX - C.startX, n = e.clientY - C.startY, r = C.dragged && Math.abs(t) > x && Math.abs(t) > Math.abs(n);
		if (C = null, a.classList.remove(h), r) {
			w = !0, D(t < 0 ? 1 : -1, !0);
			return;
		}
		Z(a, f);
	}), a.addEventListener("pointercancel", () => {
		C = null, a.classList.remove(h), Z(a, f);
	}), a.addEventListener("click", (e) => {
		w && (w = !1, e.preventDefault(), e.stopPropagation());
	}, !0), window.addEventListener("resize", $(() => {
		k(), L(a, o, u), R(o, u), f = q(i, a, o[u], f), E();
	}, 120)), i.__bemkeProjectSliderRefresh = () => {
		k(), L(a, o, u), R(o, u), f = q(i, a, o[u], f), E();
	}, L(a, o, u), R(o, u), f = q(i, a, o[u], f), F(l, _), E(), i.__bemkeProjectSliderHeightObserver = M(o, E), document.fonts?.ready.then(E).catch(() => {}), document.addEventListener(n, E), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			H();
			return;
		}
		B();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (k(), u = I(o), L(a, o, u), R(o, u), f = q(i, a, o[u], f));
	});
	function D(e, t = !1) {
		let n = e < 0 ? -1 : 1;
		if (t && _ && B(), p) {
			m = n;
			return;
		}
		O(n);
	}
	function O(t) {
		let n = Q(u + t, o.length), r = o[u], s = o[n], c = J(s) - J(r), l = e();
		if (G(o, n), R(o, n), l || c === 0) {
			u = n, L(a, o, u), f = q(i, a, o[u], f), A();
			return;
		}
		p = !0, f -= c, b = X(a, f, y, S, () => {
			b = null, p = !1, u = n, L(a, o, u), f = q(i, a, o[u], f), A();
		});
	}
	function k() {
		b?.kill(), b = null, r.killTweensOf(a), p = !1, m = 0;
	}
	function A() {
		if (!m) return;
		let e = m;
		m = 0, O(e);
	}
	function N(e = !1) {
		_ = !0, e && D(1), B(), F(l, _);
	}
	function z() {
		_ = !1, H(), F(l, _);
	}
	function B() {
		_ && (H(), v = window.setInterval(() => {
			D(1);
		}, ee));
	}
	function H() {
		v &&= (window.clearInterval(v), null);
	}
}
function j(e, t) {
	e.style.setProperty(v, "0px");
	let n = t.reduce((e, t) => Math.max(e, t.getBoundingClientRect().height), 0);
	if (n > 0) {
		e.style.setProperty(v, `${Math.ceil(n)}px`);
		return;
	}
	e.style.removeProperty(v);
}
function M(e, t) {
	if (!window.ResizeObserver) return null;
	let n = new ResizeObserver(t);
	return e.forEach((e) => {
		Array.from(e.children).forEach((e) => n.observe(e));
	}), n;
}
function te(e, t, n) {
	w += 1, t.id ||= `bemke-project-slider-track-${w}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.hasAttribute("aria-roledescription") || e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", oe(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), n.forEach((e, t) => {
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `Slajd ${t + 1} z ${n.length}`);
	});
}
function ne(e, t, n) {
	N(e.pause, "Pauza autoplay", t.id, n.onPause), N(e.play, "Start autoplay", t.id, n.onPlay), N(e.prev, "Poprzedni projekt", t.id, n.onPrev), N(e.next, "Następny projekt", t.id, n.onNext);
}
function N(e, t, n, r) {
	i(e, {
		label: t,
		controlsId: n,
		handler: r
	});
}
function P(e) {
	!e || document.activeElement === e || e.focus({ preventScroll: !0 });
}
function re(e) {
	return a(e, l);
}
function F(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function I(e) {
	let t = e.findIndex((e) => e.getAttribute(f) === "1");
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
		e.setAttribute(f, r ? "1" : "0"), e.setAttribute("aria-hidden", r ? "false" : "true"), e.setAttribute("aria-current", r ? "true" : "false"), U(e, r);
	});
}
function z(e) {
	let t = e.cloneNode(!0);
	return t.classList.add(g), t.setAttribute(f, "0"), t.setAttribute("aria-hidden", "true"), t.removeAttribute("aria-current"), t.removeAttribute("id"), t.setAttribute("tabindex", "-1"), "inert" in t && (t.inert = !0), t.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	}), t.querySelectorAll(u).forEach((e) => {
		e.setAttribute("tabindex", "-1");
	}), W(t), t;
}
function B(e) {
	e.querySelectorAll(`:scope > ${c}.${g}`).forEach((e) => {
		e.remove();
	});
}
function V(e, t) {
	e.forEach((e) => {
		H(e), W(e);
	}), G(e, t);
}
function H(e) {
	e.querySelectorAll(u).forEach((e) => {
		e.hasAttribute(_) || e.setAttribute(_, e.getAttribute("tabindex") ?? "");
	});
}
function U(e, t) {
	"inert" in e && (e.inert = !t), e.querySelectorAll(u).forEach((e) => {
		if (!t) {
			e.setAttribute("tabindex", "-1");
			return;
		}
		let n = e.getAttribute(_);
		if (n) {
			e.setAttribute("tabindex", n);
			return;
		}
		e.removeAttribute("tabindex");
	});
}
function W(e, t = !1, n = !1) {
	e.querySelectorAll("img").forEach((e) => {
		e.setAttribute("draggable", "false"), e.setAttribute("loading", t ? "eager" : "lazy"), e.setAttribute("decoding", "async"), e.setAttribute("fetchpriority", n ? "auto" : "low"), e.draggable = !1, t && K(e, n ? "auto" : "low");
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
function K(e, t = "low") {
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
function q(e, t, n, r) {
	if (!n) return r;
	e.classList.add(m);
	let i = r + ie(e) - J(n);
	return Y(t, i), t.offsetHeight, window.requestAnimationFrame(() => {
		e.classList.remove(m);
	}), i;
}
function ie(e) {
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
function X(e, t, n, i, a) {
	return r.to(e, {
		x: t,
		duration: n,
		ease: i,
		force3D: !0,
		overwrite: "auto",
		onComplete: a
	});
}
function Z(t, n) {
	if (e()) {
		Y(t, n);
		return;
	}
	X(t, n, b, C);
}
function ae(e, t) {
	let n = Number(r.getProperty(e, "x"));
	return Number.isFinite(n) ? n : t;
}
function oe(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider projektów";
}
function se(e) {
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
