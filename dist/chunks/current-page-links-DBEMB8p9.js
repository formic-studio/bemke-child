//#region src/js/modules/current-page-links.js
var e = "a[href*=\"#\"]", t = "a[href][aria-current=\"page\"]", n = "#brx-header, #brx-footer, footer", r = "__bemkeCurrentPageLinksBooted";
function i() {
	window[r] || (window[r] = !0, document.addEventListener("click", a, !0), document.addEventListener("click", o));
}
function a(t) {
	if (!d(t)) return;
	let n = l(t, e), r = u(n);
	!n || !r || !c(n, r) || (t.preventDefault(), t.stopImmediatePropagation(), window.location.assign(r.href));
}
function o(e) {
	let n = l(e, t);
	n && (s(n) || (e.preventDefault(), e.stopPropagation()));
}
function s(e) {
	let t = u(e);
	return t ? !!t.hash && t.origin === window.location.origin && f(t.pathname) === f(window.location.pathname) && t.search === window.location.search : !1;
}
function c(e, t) {
	if (!t.hash || t.origin !== window.location.origin || e.hasAttribute("download")) return !1;
	let n = e.getAttribute("target");
	return n && n.toLowerCase() !== "_self" ? !1 : f(t.pathname) !== f(window.location.pathname) || t.search !== window.location.search;
}
function l(e, t) {
	let r = (e.target instanceof Element ? e.target : null)?.closest(t);
	return r?.closest(n) ? r : null;
}
function u(e) {
	let t = e?.getAttribute("href");
	if (!t) return null;
	try {
		return new URL(t, window.location.href);
	} catch {
		return null;
	}
}
function d(e) {
	return !e.defaultPrevented && e.button === 0 && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
}
function f(e) {
	return e.replace(/\/+$/, "") || "/";
}
//#endregion
export { i as initCurrentPageLinks };
