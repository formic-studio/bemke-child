import { t as e } from "./site-language-BMLr3i6q.js";
import { t } from "./semantic-button-jC5kvGhR.js";
//#region src/js/modules/font-size-controls.js
var n = "bemke_a11y_font_scale", r = "brxe-kecesp", i = "__bemkeFontSizeControlsBooted", a = "bemke-font-size-control-description", o = "bemke:font-scale-change", s = [
	{
		id: "brxe-qmbqwm",
		label: "normalny rozmiar tekstu",
		scale: 1
	},
	{
		id: "brxe-cqxcbv",
		label: "duży rozmiar tekstu",
		scale: 1.125
	},
	{
		id: "brxe-toalqu",
		label: "bardzo duży rozmiar tekstu",
		scale: 1.25
	}
], c = [
	"normal text size",
	"large text size",
	"very large text size"
];
function l() {
	return document.getElementById(r);
}
function u() {
	let e = l();
	return e ? Array.from(e.querySelectorAll("a, button")) : [];
}
function d(e) {
	let t = document.documentElement, n = Number.parseFloat(t.style.getPropertyValue("--a11y-font-scale"));
	t.style.setProperty("--a11y-font-scale", String(e)), (!Number.isFinite(n) || n !== e) && document.dispatchEvent(new CustomEvent(o, { detail: { scale: e } }));
}
function f() {
	let e = window.localStorage.getItem(n);
	if (!e) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function p(e) {
	let t = s[0], n = Math.abs(e - t.scale);
	return s.forEach((r) => {
		let i = Math.abs(e - r.scale);
		i < n && (t = r, n = i);
	}), t;
}
function m() {
	u().forEach((n, r) => {
		let i = s[r];
		if (!i) return;
		let o = t(n), l = e() ? c[r] : i.label, u = `a — ${l}`, d = o.querySelector(`.${a}`);
		d || (d = document.createElement("span"), d.className = `${a} bemke-sr-only`, o.appendChild(d)), d.textContent = ` — ${l}`, o.removeAttribute("aria-label"), o.setAttribute("title", u), o.setAttribute("data-a11y-scale", String(i.scale));
	});
}
function h(e) {
	u().forEach((t) => {
		let n = Number(t.getAttribute("data-a11y-scale"));
		t.setAttribute("aria-pressed", Number.isFinite(n) && n === e ? "true" : "false");
	});
}
function g(e) {
	if (!e) return null;
	let t = e.getAttribute("aria-label"), n = s.find((e) => e.label === t);
	if (n) return n;
	let r = s.find((t) => t.id === e.id);
	if (r) return r;
	let i = u().indexOf(e);
	return i >= 0 ? s[i] ?? null : null;
}
function _(e) {
	e && (d(e.scale), window.localStorage.setItem(n, String(e.scale)), h(e.scale));
}
function v(e) {
	let t = e.target.closest(`#${r} a, #${r} button`);
	if (!t) return;
	let n = g(t);
	n && (e.preventDefault(), _(n));
}
function y(e) {
	if (e.key !== " " && e.key !== "Enter") return;
	let t = e.target.closest(`#${r} a, #${r} button`);
	if (!t) return;
	let n = g(t);
	n && (e.preventDefault(), _(n));
}
function b() {
	if (l()) {
		if (window[i]) {
			m();
			return;
		}
		window[i] = !0, m(), _(p(f() ?? s[0].scale)), document.addEventListener("click", v), document.addEventListener("keydown", y);
	}
}
//#endregion
export { b as n, o as t };
