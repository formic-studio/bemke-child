import { t as e } from "./semantic-button-VnITRaDl.js";
//#region src/js/modules/font-size-controls.js
var t = "bemke_a11y_font_scale", n = "brxe-kecesp", r = "__bemkeFontSizeControlsBooted", i = "bemke:font-scale-change", a = [
	{
		id: "brxe-qmbqwm",
		label: "Normalny rozmiar tekstu",
		scale: 1
	},
	{
		id: "brxe-cqxcbv",
		label: "Duży rozmiar tekstu",
		scale: 1.125
	},
	{
		id: "brxe-toalqu",
		label: "Bardzo duży rozmiar tekstu",
		scale: 1.25
	}
];
function o() {
	return document.getElementById(n);
}
function s() {
	let e = o();
	return e ? Array.from(e.querySelectorAll("a, button")) : [];
}
function c(e) {
	let t = document.documentElement, n = Number.parseFloat(t.style.getPropertyValue("--a11y-font-scale"));
	t.style.setProperty("--a11y-font-scale", String(e)), (!Number.isFinite(n) || n !== e) && document.dispatchEvent(new CustomEvent(i, { detail: { scale: e } }));
}
function l() {
	let e = window.localStorage.getItem(t);
	if (!e) return null;
	let n = Number(e);
	return Number.isFinite(n) ? n : null;
}
function u(e) {
	let t = a[0], n = Math.abs(e - t.scale);
	return a.forEach((r) => {
		let i = Math.abs(e - r.scale);
		i < n && (t = r, n = i);
	}), t;
}
function d() {
	s().forEach((t, n) => {
		let r = a[n];
		if (!r) return;
		let i = e(t);
		i.setAttribute("aria-label", r.label), i.setAttribute("title", r.label), i.setAttribute("data-a11y-scale", String(r.scale));
	});
}
function f(e) {
	s().forEach((t) => {
		let n = Number(t.getAttribute("data-a11y-scale"));
		t.setAttribute("aria-pressed", Number.isFinite(n) && n === e ? "true" : "false");
	});
}
function p(e) {
	if (!e) return null;
	let t = e.getAttribute("aria-label"), n = a.find((e) => e.label === t);
	if (n) return n;
	let r = a.find((t) => t.id === e.id);
	if (r) return r;
	let i = s().indexOf(e);
	return i >= 0 ? a[i] ?? null : null;
}
function m(e) {
	e && (c(e.scale), window.localStorage.setItem(t, String(e.scale)), f(e.scale));
}
function h(e) {
	let t = e.target.closest(`#${n} a, #${n} button`);
	if (!t) return;
	let r = p(t);
	r && (e.preventDefault(), m(r));
}
function g(e) {
	if (e.key !== " " && e.key !== "Enter") return;
	let t = e.target.closest(`#${n} a, #${n} button`);
	if (!t) return;
	let r = p(t);
	r && (e.preventDefault(), m(r));
}
function _() {
	if (o()) {
		if (window[r]) {
			d();
			return;
		}
		window[r] = !0, d(), m(u(l() ?? a[0].scale)), document.addEventListener("click", h), document.addEventListener("keydown", g);
	}
}
//#endregion
export { _ as n, i as t };
