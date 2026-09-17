import { r as e, t } from "./motion-preference-Bn10ge8D.js";
//#region src/js/modules/text-loop-slider.js
var n = ".slider.slider-text-wrapper", r = ":scope > .slider-text", i = ":scope > .slide-item", a = "data-bemke-text-slider-ready", o = "is-text-slider-active", s = "is-text-slider-exiting", c = "__bemkeTextLoopSliderBooted", l = 1200, u = 1200, d = 800, f = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
function p() {
	m(), h();
}
function m(e = document) {
	e.querySelectorAll(n).forEach((e) => {
		if (!e.closest(".slider-thinktank")) {
			if (e.getAttribute(a) === "1") {
				e.__bemkeTextLoopSliderRefresh?.();
				return;
			}
			g(e);
		}
	});
}
function h() {
	if (window[c]) return;
	window[c] = !0;
	let e = w(() => {
		m();
	}, 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let r of t) for (let t of r.addedNodes) if (t instanceof Element && (t.matches(n) || t.querySelector(n))) {
			e();
			return;
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function g(n) {
	let o = n.querySelector(r), s = o ? Array.from(o.querySelectorAll(i)) : [];
	if (!o || s.length < 2) return;
	let c = 0, l = !1, d = !1, f = !1, p = null, m = null, h = 0;
	n.setAttribute(a, "1"), o.setAttribute("aria-live", "polite"), o.setAttribute("aria-atomic", "true"), s.forEach((e) => {
		e.classList.remove("bricks-lazy-hidden"), b(e);
	}), n.__bemkeTextLoopSliderRefresh = () => {
		l || g();
	}, document.addEventListener(t, (e) => {
		if (e.detail?.reduced) {
			E();
			return;
		}
		g();
	}), g();
	function g() {
		if (m?.disconnect(), e()) {
			E();
			return;
		}
		if (!window.IntersectionObserver) {
			x();
			return;
		}
		m = new IntersectionObserver((e) => {
			e.forEach((e) => {
				if (d = e.isIntersecting, e.isIntersecting) {
					x();
					return;
				}
				w();
			});
		}, {
			rootMargin: "0px 0px -16% 0px",
			threshold: .24
		}), m.observe(n);
	}
	function x() {
		if (!(!d && window.IntersectionObserver)) {
			if (!l) {
				l = !0, f = !0;
				let t = ++h;
				_(s[c]).then(() => {
					t !== h || e() || (f = !1, S());
				});
				return;
			}
			f || S();
		}
	}
	function S() {
		w(), !(!d && window.IntersectionObserver) && (p = window.setTimeout(() => {
			T();
		}, u));
	}
	function w() {
		window.clearTimeout(p), p = null;
	}
	function T() {
		if (f) {
			S();
			return;
		}
		let t = s[c], n = C(c + 1, s.length), r = s[n], i = ++h;
		f = !0, v(t).then(() => i !== h || e() ? null : (c = n, _(r))).then(() => {
			i !== h || e() || (f = !1, S());
		});
	}
	function E() {
		h += 1, m?.disconnect(), m = null, w(), f = !1, l = !0, s.forEach((e, t) => {
			e.getAnimations?.().forEach((e) => e.cancel()), t === c ? y(e) : b(e);
		});
	}
}
function _(e) {
	return e.classList.add(o), e.classList.remove(s), e.setAttribute("aria-hidden", "false"), e.style.visibility = "visible", x(e, [{
		opacity: "0",
		transform: "translate3d(0, 0, 0) scale(0.95)",
		filter: "blur(8px)"
	}, {
		opacity: "1",
		transform: "translate3d(0, 0, 0) scale(1)",
		filter: "blur(0px)"
	}], l);
}
function v(e) {
	return e.classList.remove(o), e.classList.add(s), e.setAttribute("aria-hidden", "true"), x(e, [{
		opacity: "1",
		transform: "translate3d(0, 0, 0) scale(1)",
		filter: "blur(0px)"
	}, {
		opacity: "0",
		transform: "translate3d(0, 0, 0) scale(0.95)",
		filter: "blur(8px)"
	}], d).then(() => {
		b(e);
	});
}
function y(e) {
	e.classList.add(o), e.classList.remove(s), e.setAttribute("aria-hidden", "false"), e.style.opacity = "1", e.style.transform = "translate3d(0, 0, 0) scale(1)", e.style.filter = "blur(0px)", e.style.visibility = "visible";
}
function b(e) {
	e.classList.remove(o, s), e.setAttribute("aria-hidden", "true"), e.style.opacity = "0", e.style.transform = "translate3d(0, 0, 0) scale(0.95)", e.style.filter = "blur(8px)", e.style.visibility = "hidden";
}
function x(t, n, r) {
	if (e() || typeof t.animate != "function") return S(t, n[n.length - 1]), Promise.resolve();
	let i = t.animate(n, {
		duration: r,
		easing: f,
		fill: "forwards"
	});
	return i.finished.catch(() => {}).then(() => {
		S(t, n[n.length - 1]), i.cancel();
	});
}
function S(e, t) {
	Object.entries(t).forEach(([t, n]) => {
		e.style[t] = n;
	});
}
function C(e, t) {
	return (e + t) % t;
}
function w(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { p as initTextLoopSlider };
