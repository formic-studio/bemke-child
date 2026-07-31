//#region src/js/modules/offer-block-hover.js
var e = ".offer-block, .linkedin-block, .donors-block, #brxe-ejpmtj .brxe-aepfcc", t = ".link-block", n = [".offer-link", ".donors-block .brxe-text-link"], r = [t, ...n].join(", "), i = n.join(", "), a = "bg-eggShell", o = "is-darkcream-hover", s = "__bemkeOfferBlockHoverBooted";
function c(n) {
	return n?.closest?.(e) || ((n?.closest?.(t))?.querySelector?.(e) ?? null);
}
function l(e) {
	return e?.closest?.(t) ?? e?.closest?.(i) ?? null;
}
function u(e) {
	let t = l(document.activeElement);
	return !!(t && c(t) === e);
}
function d(e, t) {
	if (!e) return;
	let n = e.matches(".donors-block") ? o : a;
	e.classList.toggle(n, t);
}
function f(e) {
	let t = l(e.target);
	d(c(t), !!t);
}
function p(e) {
	let t = l(e.target), n = c(t);
	!n || t.contains(e.relatedTarget) || u(n) || d(n, !1);
}
function m(e) {
	let t = l(e.target);
	d(c(t), !!t);
}
function h(e) {
	let t = c(e.target);
	window.requestAnimationFrame(() => {
		d(t, u(t));
	});
}
function g() {
	window[s] || !document.querySelector(r) || (window[s] = !0, document.addEventListener("pointerover", f), document.addEventListener("pointerout", p), document.addEventListener("focusin", m), document.addEventListener("focusout", h));
}
//#endregion
export { g as initOfferBlockHover };
