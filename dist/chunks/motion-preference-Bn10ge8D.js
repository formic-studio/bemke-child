//#region src/js/modules/motion-preference.js
var e = "bemke:motion-change", t = "bemke_a11y_reduce_motion", n = "data-bemke-reduced-motion", r = "(prefers-reduced-motion: reduce)", i = !1, a = null, o = s();
function s() {
	try {
		return window.localStorage.getItem(t) === "true";
	} catch {
		return !1;
	}
}
function c(e) {
	try {
		window.localStorage.setItem(t, e ? "true" : "false");
	} catch {}
}
function l() {
	return a?.matches ?? window.matchMedia?.(r).matches ?? !1;
}
function u() {
	return o || l();
}
function d(t = !0) {
	let r = document.documentElement.getAttribute(n) === "true", i = u();
	return i ? document.documentElement.setAttribute(n, "true") : document.documentElement.removeAttribute(n), t && r !== i && document.dispatchEvent(new CustomEvent(e, { detail: {
		reduced: i,
		system: l(),
		user: o
	} })), i;
}
function f(e) {
	return o = !!e, c(o), d(!0);
}
function p() {
	if (i) {
		d(!1);
		return;
	}
	i = !0, a = window.matchMedia?.(r) ?? null;
	let e = () => d(!0);
	typeof a?.addEventListener == "function" ? a.addEventListener("change", e) : typeof a?.addListener == "function" && a.addListener(e), d(!1);
}
//#endregion
export { f as a, l as i, p as n, u as r, e as t };
