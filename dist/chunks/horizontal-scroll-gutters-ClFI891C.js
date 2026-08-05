//#region src/js/modules/horizontal-scroll-gutters.js
var e = "(max-width: 767px)", t = "data-bemke-horizontal-scroll-gutters", n = [
	"main .brxe-block",
	"main .button-scroll-row",
	"main [data-bemke-explore-card-scroll=\"1\"]"
].join(", "), r = new Set(["auto", "scroll"]), i = new Set(["flex", "inline-flex"]), a = ".padding-global, .brxe-container", o = null;
function s(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function c(e) {
	e.removeAttribute(t), e.style.removeProperty("--bemke-scroll-bleed-start"), e.style.removeProperty("--bemke-scroll-bleed-end"), e.style.removeProperty("--bemke-scroll-content-start"), e.style.removeProperty("--bemke-scroll-content-end"), e.style.removeProperty("--bemke-scroll-gap");
}
function l(e, t) {
	return !e.matches(a) && i.has(t.display) && !t.flexDirection.startsWith("column") && r.has(t.overflowX) && e.scrollWidth > e.clientWidth + 1;
}
function u(e, n) {
	let r = e.getBoundingClientRect(), i = document.documentElement.clientWidth, a = Math.max(0, r.left), o = Math.max(0, i - r.right), c = a + s(n.paddingLeft), l = o + s(n.paddingRight);
	e.style.setProperty("--bemke-scroll-bleed-start", `${a}px`), e.style.setProperty("--bemke-scroll-bleed-end", `${o}px`), e.style.setProperty("--bemke-scroll-content-start", `${c}px`), e.style.setProperty("--bemke-scroll-content-end", `${l}px`), e.style.setProperty("--bemke-scroll-gap", `${s(n.columnGap)}px`), e.setAttribute(t, "1");
}
function d() {
	document.querySelectorAll(`[${t}]`).forEach(c), window.matchMedia(e).matches && document.querySelectorAll(n).forEach((e) => {
		let t = window.getComputedStyle(e);
		l(e, t) && u(e, t);
	});
}
function f() {
	d(), window.addEventListener("load", d, { once: !0 }), window.addEventListener("resize", () => {
		window.clearTimeout(o), o = window.setTimeout(d, 120);
	});
}
//#endregion
export { f as initHorizontalScrollGutters };
