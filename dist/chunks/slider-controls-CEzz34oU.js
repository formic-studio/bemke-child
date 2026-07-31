//#region src/js/modules/slider-controls.js
var e = ".arrow, .yellow-arrow, .play-btn, .arrow-right";
function t(t, n, s = e) {
	let c = t.querySelector(n), l = c ? Array.from(c.querySelectorAll(s)) : [];
	if (!(l.length >= 4 || l.some(i) || l.some(r))) return {
		pause: null,
		play: null,
		prev: l.find(a) ?? l[0] ?? null,
		next: l.find(o) ?? l[1] ?? null
	};
	let u = l.find(r), d = l.find(i), f = u ?? (l.length >= 4 ? l.find((e, t) => t === 0 && e !== d) ?? null : null), p = d ?? (l.length >= 4 ? l.find((e, t) => t === 1 && e !== f) ?? null : null), m = l.find((e) => e !== f && e !== p && o(e)) ?? l[3] ?? null;
	return {
		pause: f,
		play: p,
		prev: l.find((e) => e !== f && e !== p && e !== m && a(e)) ?? l.find((e, t) => t >= 2 && e !== f && e !== p && e !== m) ?? null,
		next: m
	};
}
function n(e, { label: t, controlsId: n, handler: r }) {
	!e || typeof r != "function" || (e.classList.remove("bricks-lazy-hidden"), e.setAttribute("role", "button"), e.setAttribute("tabindex", "0"), e.setAttribute("aria-label", t), n && e.setAttribute("aria-controls", n), e.querySelectorAll("svg").forEach((e) => {
		e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
	}), e.addEventListener("click", (e) => {
		e.preventDefault(), r();
	}), e.addEventListener("keydown", (e) => {
		e.key !== "Enter" && e.key !== " " || (e.preventDefault(), r());
	}));
}
function r(e) {
	return e.classList.contains("pause-btn") || e.classList.contains("stop-btn") || s(e, [
		"pause",
		"pauza",
		"stop",
		"zatrzymaj"
	]);
}
function i(e) {
	return e.classList.contains("play-btn") || s(e, [
		"play",
		"start",
		"uruchom",
		"wznów",
		"wznow"
	]);
}
function a(e) {
	return e.classList.contains("arrow-left") || s(e, [
		"prev",
		"previous",
		"poprzedni",
		"lewo",
		"left"
	]);
}
function o(e) {
	return e.classList.contains("arrow-right") || s(e, [
		"next",
		"nastepny",
		"następny",
		"prawo",
		"right"
	]);
}
function s(e, t) {
	let n = c(e);
	return t.some((e) => n.includes(e));
}
function c(e) {
	return [
		typeof e.className == "string" ? e.className : "",
		e.getAttribute("aria-label"),
		e.getAttribute("title"),
		e.getAttribute("data-bemke-control"),
		e.textContent
	].filter(Boolean).join(" ").toLowerCase();
}
//#endregion
export { n, t as r, e as t };
