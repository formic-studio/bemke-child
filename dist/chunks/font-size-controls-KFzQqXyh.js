import { t as e } from "./semantic-button-VnITRaDl.js";
import { t } from "./site-language-DKWFoMcM.js";
//#region src/js/modules/font-size-controls.js
var n = "bemke_a11y_font_scale", r = "brxe-kecesp", i = "__bemkeFontSizeControlsBooted", a = "bemke:font-scale-change", o = [
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
], s = [
	"Normal text size",
	"Large text size",
	"Very large text size"
];
function c() {
	return document.getElementById(r);
}
function l() {
	let e = c();
	return e ? Array.from(e.querySelectorAll("a, button")) : [];
}
function u(e) {
	let t = document.documentElement, n = Number.parseFloat(t.style.getPropertyValue("--a11y-font-scale"));
	t.style.setProperty("--a11y-font-scale", String(e)), (!Number.isFinite(n) || n !== e) && document.dispatchEvent(new CustomEvent(a, { detail: { scale: e } }));
}
function d() {
	let e = window.localStorage.getItem(n);
	if (!e) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function f(e) {
	let t = o[0], n = Math.abs(e - t.scale);
	return o.forEach((r) => {
		let i = Math.abs(e - r.scale);
		i < n && (t = r, n = i);
	}), t;
}
function p() {
	l().forEach((n, r) => {
		let i = o[r];
		if (!i) return;
		let a = e(n), c = t() ? s[r] : i.label;
		a.setAttribute("aria-label", c), a.setAttribute("title", c), a.setAttribute("data-a11y-scale", String(i.scale));
	});
}
function m(e) {
	l().forEach((t) => {
		let n = Number(t.getAttribute("data-a11y-scale"));
		t.setAttribute("aria-pressed", Number.isFinite(n) && n === e ? "true" : "false");
	});
}
function h(e) {
	if (!e) return null;
	let t = e.getAttribute("aria-label"), n = o.find((e) => e.label === t);
	if (n) return n;
	let r = o.find((t) => t.id === e.id);
	if (r) return r;
	let i = l().indexOf(e);
	return i >= 0 ? o[i] ?? null : null;
}
function g(e) {
	e && (u(e.scale), window.localStorage.setItem(n, String(e.scale)), m(e.scale));
}
function _(e) {
	let t = e.target.closest(`#${r} a, #${r} button`);
	if (!t) return;
	let n = h(t);
	n && (e.preventDefault(), g(n));
}
function v(e) {
	if (e.key !== " " && e.key !== "Enter") return;
	let t = e.target.closest(`#${r} a, #${r} button`);
	if (!t) return;
	let n = h(t);
	n && (e.preventDefault(), g(n));
}
function y() {
	if (c()) {
		if (window[i]) {
			p();
			return;
		}
		window[i] = !0, p(), g(f(d() ?? o[0].scale)), document.addEventListener("click", _), document.addEventListener("keydown", v);
	}
}
//#endregion
export { y as n, a as t };
