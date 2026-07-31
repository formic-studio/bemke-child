//#region src/js/modules/bemke-explore-card-scroll.js
var e = "bemke-explore", t = ".card", n = "data-bemke-explore-card-scroll";
function r() {
	return window.location.pathname.split("/").filter(Boolean).includes(e);
}
function i() {
	if (!r()) return;
	let e = window.matchMedia("(max-width: 767px)").matches, i = /* @__PURE__ */ new Map();
	document.querySelectorAll(t).forEach((e) => {
		let t = e.parentElement;
		if (!t) return;
		let n = i.get(t) ?? [];
		n.push(e), i.set(t, n);
	}), i.forEach((t, r) => {
		t.length < 2 || (r.setAttribute(n, "1"), e && (r.setAttribute("role", "region"), r.setAttribute("aria-label", "Przewijana lista kart"), r.hasAttribute("tabindex") || (r.tabIndex = 0)));
	});
}
//#endregion
export { i as initBemkeExploreCardScroll };
