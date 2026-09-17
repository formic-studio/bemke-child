//#region src/js/modules/linkedin-post-numbers.js
var e = "#brxe-ejpmtj", t = ".linkdin-number", n = ".brxe-aepfcc";
function r(e) {
	return String(e + 1).padStart(2, "0");
}
function i(e) {
	Array.from(e.querySelectorAll(t)).filter((e) => e.closest(n)).forEach((e, t) => {
		let n = r(t);
		e.textContent.trim() !== n && (e.textContent = n);
	});
}
function a() {
	let t = document.querySelector(e);
	t && (i(t), new MutationObserver(() => {
		i(t);
	}).observe(t, {
		childList: !0,
		subtree: !0
	}));
}
//#endregion
export { a as initLinkedinPostNumbers };
