import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-BlCrb88B.js";
import { HERO_INTRO_COMPLETE_EVENT as r, HERO_INTRO_HEADER_REVEAL_EVENT as i } from "./hero-intro-Db9fggFw.js";
//#region src/js/modules/header-intro.js
var a = "#brx-header", o = ".section_hero", s = "home", c = "(max-width: 991px)", l = "data-bemke-hero-intro-complete", u = "data-bemke-header-intro-ready", d = "data-bemke-header-intro-complete", f = .864, p = /* @__PURE__ */ new Map(), m = window.matchMedia(c), h = !1;
function g() {
	if (!document.body.classList.contains(s) || m.matches) {
		document.querySelectorAll(a).forEach(_);
		return;
	}
	v(), document.querySelectorAll(a).forEach((t) => {
		if (p.has(t) || t.getAttribute(d) === "1") return;
		let r = {
			complete: !1,
			header: t,
			revealing: !1,
			sections: Array.from(t.children),
			tween: null
		};
		if (p.set(t, r), !document.querySelector(o) || e()) {
			b(r, !1);
			return;
		}
		let i = Math.max(t.getBoundingClientRect().height, 1);
		n.set(r.sections, {
			transition: "none",
			y: -i
		}), n.set(t, { autoAlpha: 0 }), t.setAttribute(u, "1"), y() && b(r, !0);
	});
}
function _(e) {
	n.killTweensOf(e), n.killTweensOf(e.children), n.set(e, { clearProps: "opacity,visibility" }), n.set(e.children, { clearProps: "transform,transition" }), e.setAttribute(u, "1"), e.setAttribute(d, "1");
}
function v() {
	h || (h = !0, document.addEventListener(i, () => {
		p.forEach((t) => {
			b(t, !e());
		});
	}), document.addEventListener(r, () => {
		y() && p.forEach((t) => {
			b(t, !e());
		});
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && p.forEach((e) => {
			b(e, !1);
		});
	}), m.addEventListener("change", (e) => {
		e.matches && p.forEach((e) => {
			b(e, !1);
		});
	}));
}
function y() {
	let e = Array.from(document.querySelectorAll(o));
	return e.length > 0 && e.every((e) => e.getAttribute(l) === "1");
}
function b(e, t) {
	if (!e.complete && !(e.revealing && t)) {
		if (e.header.setAttribute(u, "1"), e.tween?.kill(), e.tween = null, e.revealing = t, !t) {
			n.set(e.header, { clearProps: "opacity,visibility" }), n.set(e.sections, { clearProps: "transform,transition" }), x(e);
			return;
		}
		n.set(e.header, { autoAlpha: 1 }), e.tween = n.to(e.sections, {
			duration: f,
			ease: "power3.out",
			overwrite: !0,
			y: 0,
			onComplete: () => {
				n.set(e.header, { clearProps: "opacity,visibility" }), n.set(e.sections, { clearProps: "transform,transition" }), x(e);
			}
		});
	}
}
function x(e) {
	e.complete = !0, e.revealing = !1, e.tween = null, e.header.setAttribute(d, "1"), p.delete(e.header);
}
//#endregion
export { g as initHeaderIntro };
