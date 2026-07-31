//#region src/js/modules/font-size-controls.js
var e = "bemke_a11y_font_scale", t = "brxe-kecesp", n = "__bemkeFontSizeControlsBooted", r = "bemke:font-scale-change", i = [
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
function a() {
	return document.getElementById(t);
}
function o() {
	let e = a();
	return e ? Array.from(e.querySelectorAll("a, button")) : [];
}
function s(e) {
	let t = document.documentElement, n = Number.parseFloat(t.style.getPropertyValue("--a11y-font-scale"));
	t.style.setProperty("--a11y-font-scale", String(e)), (!Number.isFinite(n) || n !== e) && document.dispatchEvent(new CustomEvent(r, { detail: { scale: e } }));
}
function c() {
	let t = window.localStorage.getItem(e);
	if (!t) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function l(e) {
	let t = i[0], n = Math.abs(e - t.scale);
	return i.forEach((r) => {
		let i = Math.abs(e - r.scale);
		i < n && (t = r, n = i);
	}), t;
}
function u() {
	o().forEach((e, t) => {
		let n = i[t];
		n && (e.tagName === "A" && !e.getAttribute("href") && e.setAttribute("href", "#"), e.setAttribute("role", "button"), e.setAttribute("aria-label", n.label), e.setAttribute("data-a11y-scale", String(n.scale)), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0"));
	});
}
function d(e) {
	o().forEach((t) => {
		let n = Number(t.getAttribute("data-a11y-scale"));
		t.setAttribute("aria-pressed", Number.isFinite(n) && n === e ? "true" : "false");
	});
}
function f(e) {
	if (!e) return null;
	let t = e.getAttribute("aria-label"), n = i.find((e) => e.label === t);
	if (n) return n;
	let r = i.find((t) => t.id === e.id);
	if (r) return r;
	let a = o().indexOf(e);
	return a >= 0 ? i[a] ?? null : null;
}
function p(t) {
	t && (s(t.scale), window.localStorage.setItem(e, String(t.scale)), d(t.scale));
}
function m(e) {
	let n = e.target.closest(`#${t} a, #${t} button`);
	if (!n) return;
	let r = f(n);
	r && (e.preventDefault(), p(r));
}
function h(e) {
	if (e.key !== " " && e.key !== "Enter") return;
	let n = e.target.closest(`#${t} a, #${t} button`);
	if (!n) return;
	let r = f(n);
	r && (e.preventDefault(), p(r));
}
function g() {
	if (a()) {
		if (window[n]) {
			u();
			return;
		}
		window[n] = !0, u(), p(l(c() ?? i[0].scale)), document.addEventListener("click", m), document.addEventListener("keydown", h);
	}
}
//#endregion
export { g as n, r as t };
