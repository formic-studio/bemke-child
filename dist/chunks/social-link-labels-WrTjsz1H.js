import { t as e } from "./site-language-DKWFoMcM.js";
//#region src/js/modules/social-link-labels.js
var t = "data-bemke-social-link-ready", n = "__bemkeSocialLinkLabelsBooted", r = [
	{
		hostPattern: /(^|\.)instagram\.com$/,
		label: "Profil Bemke na Instagramie",
		enLabel: "Bemke on Instagram"
	},
	{
		hostPattern: /(^|\.)facebook\.com$/,
		label: "Profil Bemke na Facebooku",
		enLabel: "Bemke on Facebook"
	},
	{
		hostPattern: /(^|\.)linkedin\.com$/,
		label: "Profil Bemke na LinkedInie",
		enLabel: "Bemke on LinkedIn"
	}
];
function i() {
	a(), !window[n] && (window[n] = !0, window.addEventListener("load", () => a()), document.addEventListener("bricks/ajax/end", () => a()), !(!window.MutationObserver || !document.body) && new MutationObserver((e) => {
		e.some((e) => e.addedNodes.length > 0) && a();
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	}));
}
function a(e = document) {
	let n = typeof e?.querySelectorAll == "function" ? e : document;
	o(n), n.querySelectorAll("a[href]").forEach((e) => {
		if (e.getAttribute(t) === "1") return;
		let n = l(e.getAttribute("href"));
		n && (e.setAttribute(t, "1"), s(e, n), c(e));
	});
}
function o(e) {
	e.querySelectorAll("#brx-footer a.social-link[href]").forEach((e) => {
		u(e.textContent) || e.querySelector("img, svg, picture, video") || e.remove();
	});
}
function s(e, t) {
	!u(e.getAttribute("aria-label")) && !u(e.textContent) && e.setAttribute("aria-label", t);
}
function c(e) {
	e.querySelectorAll("svg").forEach((e) => {
		e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
	}), e.querySelectorAll("img").forEach((e) => {
		u(e.getAttribute("alt")) || e.setAttribute("alt", "");
	}), e.target === "_blank" && (e.rel = "noopener noreferrer");
}
function l(t) {
	if (!t) return null;
	try {
		let n = new URL(t, window.location.href).hostname.toLowerCase(), i = r.find(({ hostPattern: e }) => e.test(n));
		return i ? e() ? i.enLabel : i.label : null;
	} catch {
		return null;
	}
}
function u(e) {
	return (e || "").replace(/\s+/g, " ").trim();
}
//#endregion
export { i as initSocialLinkLabels };
