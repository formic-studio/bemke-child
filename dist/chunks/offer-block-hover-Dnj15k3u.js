import { n as e } from "./site-language-BMLr3i6q.js";
//#region src/js/modules/offer-block-hover.js
var t = ".offer-block, .linkedin-block, .donors-block, #brxe-ejpmtj .brxe-aepfcc", n = ".link-block", r = [".offer-link", ".donors-block .brxe-text-link"], i = [n, ...r].join(", "), a = r.join(", "), o = "bg-eggShell", s = "is-darkcream-hover", c = "__bemkeOfferBlockHoverBooted", l = ".offer-block a.offer-link[href]";
function u(e) {
	return String(e ?? "").replace(/\s+/g, " ").trim();
}
function d(t = document) {
	t.querySelectorAll(l).forEach((t) => {
		if (!/^(poznaj\s+szczegóły|learn\s+more)$/iu.test(u(t.textContent))) return;
		let n = u(t.closest(".offer-block")?.querySelector(".font-size-caption-big")?.textContent);
		n && t.setAttribute("aria-label", e(`Poznaj szczegóły oferty: ${n}`, `Learn more about the offer: ${n}`));
	});
}
function f(e) {
	return e?.closest?.(t) || ((e?.closest?.(n))?.querySelector?.(t) ?? null);
}
function p(e) {
	return e?.closest?.(n) ?? e?.closest?.(a) ?? null;
}
function m(e) {
	let t = p(document.activeElement);
	return !!(t && f(t) === e);
}
function h(e, t) {
	if (!e) return;
	let n = e.matches(".donors-block") ? s : o;
	e.classList.toggle(n, t);
}
function g(e) {
	let t = p(e.target);
	h(f(t), !!t);
}
function _(e) {
	let t = p(e.target), n = f(t);
	!n || t.contains(e.relatedTarget) || m(n) || h(n, !1);
}
function v(e) {
	let t = p(e.target);
	h(f(t), !!t);
}
function y(e) {
	let t = f(e.target);
	window.requestAnimationFrame(() => {
		h(t, m(t));
	});
}
function b() {
	d(), !(window[c] || !document.querySelector(i)) && (window[c] = !0, document.addEventListener("pointerover", g), document.addEventListener("pointerout", _), document.addEventListener("focusin", v), document.addEventListener("focusout", y), document.addEventListener("bricks/ajax/end", () => {
		d();
	}));
}
//#endregion
export { b as initOfferBlockHover };
