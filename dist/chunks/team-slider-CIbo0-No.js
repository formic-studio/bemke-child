import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-0BK4_Us1.js";
import { n as r, r as i } from "./slider-controls-CEzz34oU.js";
//#region src/js/modules/team-slider.js
var a = ".slider-block", o = ":scope > .slider-wrapper", s = ":scope > .slider-paggination", c = "[data-number]:not(.popup-team)", l = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]", u = "data-bemke-team-slider-ready", d = "slide-active", f = "data-bemke-team-original-tabindex", p = "__bemkeTeamSliderBooted", m = "is-dragging", h = "is-resetting", g = .8, _ = .35, v = 3500, y = 46, b = "power3.inOut", x = "power3.out", S = 0;
function C() {
	w(), T();
}
function w(e = document) {
	e.querySelectorAll(a).forEach((e) => {
		let t = e.querySelector(o);
		if (!(!t || D(t).length < 2)) {
			if (e.getAttribute(u) === "1") {
				e.__bemkeTeamSliderRefresh?.();
				return;
			}
			E(e, t);
		}
	});
}
function T() {
	if (window[p]) return;
	window[p] = !0;
	let e = W(() => w(), 90);
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
function E(r, a) {
	let o = D(a), c = i(r, s), l = !1, d = 0, f = !1, p = null, g = null, _ = null, b = !1;
	o.forEach((e) => e.classList.add("team-link")), r.setAttribute(u, "1"), k(r, a, o), A(o), N(c, a, {
		onPause: () => B(),
		onPlay: () => M(!0),
		onPrev: () => S(-1, !0),
		onNext: () => S(1, !0)
	}), r.addEventListener("keydown", (e) => {
		if (!H(e.target)) {
			if (e.key === "ArrowLeft") {
				e.preventDefault(), V(c.prev), S(-1, !0);
				return;
			}
			e.key === "ArrowRight" && (e.preventDefault(), V(c.next), S(1, !0));
		}
	}), a.addEventListener("pointerdown", (e) => {
		l || e.pointerType === "mouse" && e.button !== 0 || (g?.kill(), n.killTweensOf(a), _ = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			lockedAxis: null,
			dragged: !1
		});
	}), a.addEventListener("pointermove", (e) => {
		if (!_ || _.id !== e.pointerId) return;
		let t = e.clientX - _.startX, n = e.clientY - _.startY, r = Math.abs(t), i = Math.abs(n);
		if (!_.lockedAxis && (r > 8 || i > 8) && (_.lockedAxis = r > i ? "x" : "y"), _.lockedAxis !== "x") return;
		if (e.preventDefault(), !a.hasPointerCapture(e.pointerId)) try {
			a.setPointerCapture(e.pointerId);
		} catch {}
		let o = F(a), s = U(t * .5, -o * .8, o * .8);
		_.dragged = !0, a.classList.add(m), I(a, s);
	}), a.addEventListener("pointerup", (e) => {
		if (!_ || _.id !== e.pointerId) return;
		let t = e.clientX - _.startX, n = e.clientY - _.startY, r = _.dragged && Math.abs(t) > y && Math.abs(t) > Math.abs(n), i = z(a);
		if (_ = null, a.classList.remove(m), r) {
			b = !0, S(t < 0 ? 1 : -1, !0, i);
			return;
		}
		R(a);
	}), a.addEventListener("pointercancel", () => {
		_ = null, a.classList.remove(m), R(a);
	}), a.addEventListener("click", (e) => {
		b && (b = !1, e.preventDefault(), e.stopPropagation());
	}, !0);
	let x = W(() => {
		T(), I(a, 0), j(r, a);
	}, 120);
	window.addEventListener("resize", x), r.__bemkeTeamSliderRefresh = x, I(a, 0), P(c, f), window.requestAnimationFrame(() => j(r, a)), document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			K();
			return;
		}
		G();
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && (T(), I(a, 0), j(r, a));
	});
	function S(e, t = !1, n = null) {
		let r = e < 0 ? -1 : 1;
		if (t && f && G(), l) {
			d = r;
			return;
		}
		C(r, n);
	}
	function C(t, n = null) {
		let i = D(a), o = F(a);
		if (i.length < 2 || o <= 0) {
			I(a, 0);
			return;
		}
		if (e()) {
			O(a, i, t), I(a, 0), j(r, a), E();
			return;
		}
		if (l = !0, t > 0) {
			Number.isFinite(n) && I(a, n), g = L(a, -o, () => {
				O(a, i, t), w();
			});
			return;
		}
		let s = Number.isFinite(n) ? n : 0;
		O(a, i, t), I(a, s - o), a.offsetHeight, g = L(a, 0, w);
	}
	function w() {
		g = null, r.classList.add(h), I(a, 0), a.offsetHeight, r.classList.remove(h), l = !1, j(r, a), E();
	}
	function T() {
		g?.kill(), g = null, n.killTweensOf(a), l = !1, d = 0;
	}
	function E() {
		if (!d) return;
		let e = d;
		d = 0, C(e);
	}
	function M(e = !1) {
		f = !0, e && S(1), G(), P(c, f);
	}
	function B() {
		f = !1, K(), P(c, f);
	}
	function G() {
		f && (K(), p = window.setInterval(() => S(1), v));
	}
	function K() {
		p &&= (window.clearInterval(p), null);
	}
}
function D(e) {
	return Array.from(e?.children ?? []).filter((e) => e.querySelector(c));
}
function O(e, t, n) {
	if (n > 0) {
		e.appendChild(t[0]);
		return;
	}
	e.prepend(t[t.length - 1]);
}
function k(e, t, n) {
	S += 1, t.id ||= `bemke-team-slider-track-${S}`, e.hasAttribute("role") || e.setAttribute("role", "region"), e.setAttribute("aria-roledescription", "karuzela"), !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby") && e.setAttribute("aria-label", B(e)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "false"), n.forEach((e, t) => {
		let r = e.querySelector(".font-size-h4")?.textContent?.replace(/\s+/g, " ").trim();
		e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slajd"), e.setAttribute("aria-label", `${r ? `${r}, ` : ""}osoba ${t + 1} z ${n.length}`);
	});
}
function A(e) {
	e.forEach((e) => {
		e.querySelectorAll(l).forEach((e) => {
			e.hasAttribute(f) || e.setAttribute(f, e.getAttribute("tabindex") ?? "");
		}), e.querySelectorAll("img").forEach((e) => {
			e.setAttribute("draggable", "false"), e.setAttribute("decoding", "async"), e.draggable = !1;
		});
	});
}
function j(e, t) {
	let n = e.getBoundingClientRect();
	D(t).forEach((e, t) => {
		let r = e.getBoundingClientRect(), i = Math.max(0, Math.min(r.right, n.right) - Math.max(r.left, n.left)), a = r.width > 0 && i >= Math.min(r.width * .5, 80), o = t === 0;
		e.setAttribute(d, o ? "1" : "0"), e.setAttribute("aria-hidden", a ? "false" : "true"), o ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current"), M(e, a);
	});
}
function M(e, t) {
	"inert" in e && (e.inert = !t), e.querySelectorAll(l).forEach((e) => {
		if (!t) {
			e.setAttribute("tabindex", "-1");
			return;
		}
		let n = e.getAttribute(f);
		if (n) {
			e.setAttribute("tabindex", n);
			return;
		}
		e.removeAttribute("tabindex");
	});
}
function N(e, t, n) {
	r(e.pause, {
		label: "Pauza autoplay",
		controlsId: t.id,
		handler: n.onPause
	}), r(e.play, {
		label: "Start autoplay",
		controlsId: t.id,
		handler: n.onPlay
	}), r(e.prev, {
		label: "Poprzednia osoba",
		controlsId: t.id,
		handler: n.onPrev
	}), r(e.next, {
		label: "Następna osoba",
		controlsId: t.id,
		handler: n.onNext
	});
}
function P(e, t) {
	e.play && (e.play.classList.toggle("is-disabled", t), e.play.setAttribute("aria-disabled", t ? "true" : "false")), e.pause && (e.pause.classList.toggle("is-disabled", !t), e.pause.setAttribute("aria-disabled", t ? "false" : "true"));
}
function F(e) {
	let t = D(e), n = t[0]?.getBoundingClientRect(), r = t[1]?.getBoundingClientRect();
	if (n && r) {
		let e = r.left - n.left;
		if (e > 0) return e;
	}
	let i = Number.parseFloat(window.getComputedStyle(e).columnGap) || 0;
	return (n?.width ?? 0) + i;
}
function I(e, t) {
	n.set(e, {
		x: t,
		force3D: !0
	});
}
function L(e, t, r) {
	return n.to(e, {
		x: t,
		duration: g,
		ease: b,
		force3D: !0,
		overwrite: "auto",
		onComplete: r
	});
}
function R(t) {
	if (e()) {
		I(t, 0);
		return;
	}
	n.to(t, {
		x: 0,
		duration: _,
		ease: x,
		force3D: !0,
		overwrite: "auto"
	});
}
function z(e) {
	let t = Number(n.getProperty(e, "x"));
	return Number.isFinite(t) ? t : 0;
}
function B(e) {
	let t = (e.closest("section")?.querySelector("h1, h2, h3"))?.textContent?.replace(/\s+/g, " ").trim();
	return t ? `Slider: ${t}` : "Slider zespołu";
}
function V(e) {
	e && document.activeElement !== e && e.focus({ preventScroll: !0 });
}
function H(e) {
	return !!e?.closest?.("input, textarea, select, button, [contenteditable=\"true\"]");
}
function U(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function W(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { C as initTeamSlider };
