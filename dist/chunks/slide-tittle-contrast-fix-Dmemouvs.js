//#region src/js/modules/slide-tittle-contrast-fix.js
var e = ".slide-tittle";
function t() {
	let t = window.location.pathname.replace(/\/+$/, "");
	if ((t === "" ? "/" : t) !== "/o-nas") return;
	let n = () => {
		let t = document.documentElement.matches("html[data-contrast]:not([data-contrast=\"default\"])") ? "var(--a11y-text)" : "#fff";
		document.querySelectorAll(e).forEach((e) => {
			e.style.setProperty("color", t, "important"), e.style.setProperty("-webkit-text-fill-color", t, "important");
		});
	};
	n(), (() => {
		if (!window.MutationObserver) return;
		let e = 0, t = () => {
			e && cancelAnimationFrame(e), e = requestAnimationFrame(() => {
				e = 0, n();
			});
		};
		new MutationObserver(() => {
			t();
		}).observe(document.documentElement, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: ["style", "class"]
		});
	})(), window.addEventListener("load", n);
}
//#endregion
export { t as initSlideTittleContrastFix };
