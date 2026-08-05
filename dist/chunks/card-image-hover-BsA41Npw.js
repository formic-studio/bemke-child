//#region src/js/modules/card-image-hover.js
var e = ".card, .steam-block, .area-block", t = "card-image-clip";
function n(e) {
	if (e.parentElement?.classList.contains(t)) return;
	let n = e.matches("img") ? e : e.querySelector("img"), r = document.createElement("div");
	if (r.className = t, n) {
		let e = window.getComputedStyle(n);
		r.style.borderTopLeftRadius = e.borderTopLeftRadius, r.style.borderTopRightRadius = e.borderTopRightRadius, r.style.borderBottomRightRadius = e.borderBottomRightRadius, r.style.borderBottomLeftRadius = e.borderBottomLeftRadius;
	}
	e.before(r), r.append(e);
}
function r() {
	document.querySelectorAll(e).forEach((e) => {
		new Set(Array.from(e.querySelectorAll("img"), (e) => e.closest("picture") ?? e)).forEach(n);
	});
}
//#endregion
export { r as initCardImageHover };
