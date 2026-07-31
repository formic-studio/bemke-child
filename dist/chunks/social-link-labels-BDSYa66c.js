//#region src/js/modules/social-link-labels.js
var e = "data-bemke-social-link-ready", t = "__bemkeSocialLinkLabelsBooted", n = [
	{
		hostPattern: /(^|\.)instagram\.com$/,
		label: "Profil Bemke na Instagramie"
	},
	{
		hostPattern: /(^|\.)facebook\.com$/,
		label: "Profil Bemke na Facebooku"
	},
	{
		hostPattern: /(^|\.)linkedin\.com$/,
		label: "Profil Bemke na LinkedInie"
	}
];
function r() {
	i(), !window[t] && (window[t] = !0, window.addEventListener("load", () => i()), document.addEventListener("bricks/ajax/end", () => i()), !(!window.MutationObserver || !document.body) && new MutationObserver((e) => {
		e.some((e) => e.addedNodes.length > 0) && i();
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	}));
}
function i(t = document) {
	(typeof t?.querySelectorAll == "function" ? t : document).querySelectorAll("a[href]").forEach((t) => {
		if (t.getAttribute(e) === "1") return;
		let n = s(t.getAttribute("href"));
		n && (t.setAttribute(e, "1"), a(t, n), o(t));
	});
}
function a(e, t) {
	!c(e.getAttribute("aria-label")) && !c(e.textContent) && e.setAttribute("aria-label", t);
}
function o(e) {
	e.querySelectorAll("svg").forEach((e) => {
		e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
	}), e.querySelectorAll("img").forEach((e) => {
		c(e.getAttribute("alt")) || e.setAttribute("alt", "");
	});
}
function s(e) {
	if (!e) return null;
	try {
		let t = new URL(e, window.location.href).hostname.toLowerCase();
		return n.find(({ hostPattern: e }) => e.test(t))?.label ?? null;
	} catch {
		return null;
	}
}
function c(e) {
	return (e || "").replace(/\s+/g, " ").trim();
}
//#endregion
export { r as initSocialLinkLabels };
