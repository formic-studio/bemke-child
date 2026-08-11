//#region src/js/modules/offer-block-hover.js
var e = ".offer-block, .linkedin-block, .donors-block, #brxe-ejpmtj .brxe-aepfcc", t = ".link-block", n = [".offer-link", ".donors-block .brxe-text-link"], r = [t, ...n].join(", "), i = n.join(", "), a = "bg-eggShell", o = "is-darkcream-hover", s = "__bemkeOfferBlockHoverBooted", c = ".offer-block a.offer-link[href]";
function l(e) {
	return String(e ?? "").replace(/\s+/g, " ").trim();
}
function u(e = document) {
	e.querySelectorAll(c).forEach((e) => {
		if (!/^poznaj\s+szczegóły$/iu.test(l(e.textContent))) return;
		let t = l(e.closest(".offer-block")?.querySelector(".font-size-caption-big")?.textContent);
		t && e.setAttribute("aria-label", `Poznaj szczegóły oferty: ${t}`);
	});
}
function d(n) {
	return n?.closest?.(e) || ((n?.closest?.(t))?.querySelector?.(e) ?? null);
}
function f(e) {
	return e?.closest?.(t) ?? e?.closest?.(i) ?? null;
}
function p(e) {
	let t = f(document.activeElement);
	return !!(t && d(t) === e);
}
function m(e, t) {
	if (!e) return;
	let n = e.matches(".donors-block") ? o : a;
	e.classList.toggle(n, t);
}
function h(e) {
	let t = f(e.target);
	m(d(t), !!t);
}
function g(e) {
	let t = f(e.target), n = d(t);
	!n || t.contains(e.relatedTarget) || p(n) || m(n, !1);
}
function _(e) {
	let t = f(e.target);
	m(d(t), !!t);
}
function v(e) {
	let t = d(e.target);
	window.requestAnimationFrame(() => {
		m(t, p(t));
	});
}
function y() {
	u(), !(window[s] || !document.querySelector(r)) && (window[s] = !0, document.addEventListener("pointerover", h), document.addEventListener("pointerout", g), document.addEventListener("focusin", _), document.addEventListener("focusout", v), document.addEventListener("bricks/ajax/end", () => {
		u();
	}));
}
//#endregion
export { y as initOfferBlockHover };
