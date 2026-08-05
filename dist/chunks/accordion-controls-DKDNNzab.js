import { r as e } from "./motion-preference-Bn10ge8D.js";
//#region src/js/modules/accordion-controls.js
var t = ".accordin-block", n = ".accordin-item", r = ".accordin-heading", i = ".accordin-text", a = ".accordin-btn", o = ".accordin-tittle", s = ".accordin-number", c = ".dot", l = "is-open", u = "accordin-text-open", d = "accordin-btn-oppen", f = "__bemkeAccordionBooted";
function p() {
	return Array.from(document.querySelectorAll(t));
}
function m(e) {
	return Array.from(e.querySelectorAll(`:scope > ${n}`));
}
function h(e) {
	return e.querySelector(r);
}
function g(e) {
	return e.querySelector(i);
}
function _(e) {
	return e.querySelector(a);
}
function v(e) {
	return e.querySelector(o);
}
function y(e) {
	let t = e.dataset.accordionDisplay;
	if (t) return t;
	let n = window.getComputedStyle(e).display, r = n === "none" ? e.classList.contains("brxe-block") ? "flex" : "block" : n;
	return e.dataset.accordionDisplay = r, r;
}
function b(e, t) {
	let n = h(e), r = g(e), i = _(e);
	e.classList.toggle(l, t), r && (r.classList.toggle(u, t), r.setAttribute("aria-hidden", t ? "false" : "true")), i && (i.classList.toggle(d, t), i.setAttribute("aria-hidden", "true")), n && (n.setAttribute("aria-expanded", t ? "true" : "false"), n.setAttribute("aria-disabled", "false"));
}
function x(e) {
	e.dataset.accordionAnimating = "false", e.removeEventListener("transitionend", e.__bemkeAccordionOnTransitionEnd), delete e.__bemkeAccordionOnTransitionEnd;
}
function S(t, n = !1) {
	let r = g(t);
	if (!r) return;
	let i = y(r);
	if (r.style.display = i, r.style.overflow = "hidden", r.style.visibility = "visible", b(t, !0), n || e()) {
		x(r), r.style.opacity = "1", r.style.height = "auto";
		return;
	}
	x(r);
	let a = r.scrollHeight;
	r.style.height = "0px", r.style.opacity = "0", r.offsetHeight, r.style.height = `${a}px`, r.style.opacity = "1", r.dataset.accordionAnimating = "true";
	let o = (e) => {
		e.propertyName === "height" && (x(r), t.classList.contains(l) && (r.style.height = "auto"));
	};
	r.__bemkeAccordionOnTransitionEnd = o, r.addEventListener("transitionend", o);
}
function C(t, n = !1) {
	let r = g(t);
	if (!r) return;
	let i = y(r);
	if (r.style.display = i, r.style.overflow = "hidden", b(t, !1), n || e()) {
		x(r), r.style.height = "0px", r.style.opacity = "0", r.style.visibility = "hidden";
		return;
	}
	x(r);
	let a = r.scrollHeight;
	r.style.height = `${a}px`, r.style.opacity = "1", r.style.visibility = "visible", r.offsetHeight, r.style.height = "0px", r.style.opacity = "0", r.dataset.accordionAnimating = "true";
	let o = (e) => {
		e.propertyName === "height" && (x(r), !t.classList.contains(l) && (r.style.visibility = "hidden"));
	};
	r.__bemkeAccordionOnTransitionEnd = o, r.addEventListener("transitionend", o);
}
function w(e) {
	let t = g(e);
	return e.classList.contains(l) || t?.classList.contains(u);
}
function T(e, t) {
	let n = h(e), r = g(e), i = v(e);
	if (!n || !r) return;
	n.id ||= `bemke-accordion-trigger-${t + 1}`, r.id ||= `bemke-accordion-panel-${t + 1}`, n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-controls", r.id), n.setAttribute("aria-disabled", "false"), r.setAttribute("role", "region"), r.setAttribute("aria-labelledby", n.id);
	let a = i?.textContent?.trim();
	a && n.setAttribute("aria-label", a);
}
function E(e) {
	e.querySelectorAll(`${s}, ${s} *, ${c}`).forEach((e) => {
		e.setAttribute("aria-hidden", "true");
	}), e.querySelectorAll(`${a}, ${a} *`).forEach((e) => {
		e.setAttribute("aria-hidden", "true");
	}), e.querySelectorAll(`${a} svg`).forEach((e) => {
		e.setAttribute("focusable", "false");
	});
}
function D(e) {
	if (e) {
		if (e.classList.contains(l)) {
			C(e);
			return;
		}
		S(e);
	}
}
function O(e, t) {
	let i = t.closest(n);
	return !i || !e.contains(i) ? null : t.closest(r) || t.closest(a) || t.closest(".accordin-tittle") || t.closest(".accordin-number") ? i : null;
}
function k(e) {
	let n = e.target.closest(t);
	if (!n) return;
	let r = O(n, e.target);
	r && (e.preventDefault(), D(r));
}
function A(e) {
	if (e.key !== "Enter" && e.key !== " ") return;
	let i = e.target.closest(`${t} ${r}`);
	if (!i) return;
	let a = i.closest(t), o = i.closest(n);
	!a || !o || (e.preventDefault(), D(o));
}
function j(e) {
	let t = m(e);
	if (!t.length) return;
	t.forEach((e, t) => {
		T(e, t), E(e);
	});
	let n = t.filter(w), r = new Set(n);
	t.forEach((e) => {
		if (r.has(e)) {
			S(e, !0);
			return;
		}
		C(e, !0);
	});
}
function M() {
	let e = p();
	e.length && (e.forEach(j), !window[f] && (window[f] = !0, document.addEventListener("click", k), document.addEventListener("keydown", A)));
}
//#endregion
export { M as initAccordionControls };
