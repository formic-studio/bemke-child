//#region src/js/modules/page-info-hover.js
var e = ".page-info", t = "data-bemke-page-info-hover-ready", n = "--bemke-page-info-active-color", r = "__bemkePageInfoHoverBooted";
function i() {
	if (a(), window[r] || (window[r] = !0, window.addEventListener("load", a), document.addEventListener("bricks/ajax/end", a), !window.MutationObserver || !document.documentElement)) return;
	let e = 0;
	new MutationObserver((t) => {
		t.some((e) => e.addedNodes.length > 0 || e.type === "attributes" && e.attributeName === "data-contrast") && (window.cancelAnimationFrame(e), e = window.requestAnimationFrame(a));
	}).observe(document.documentElement, {
		attributeFilter: ["data-contrast"],
		attributes: !0,
		childList: !0,
		subtree: !0
	});
}
function a() {
	document.querySelectorAll(e).forEach((e) => {
		let r = e.lastElementChild, i = e.querySelectorAll(":scope > a[href]");
		if (!r || i.length === 0) return;
		let a = window.getComputedStyle(r).color;
		!a || a === "rgba(0, 0, 0, 0)" || (e.style.setProperty(n, a), e.setAttribute(t, "1"));
	});
}
//#endregion
export { i as initPageInfoHover };
