import { n as e } from "./site-language-BMLr3i6q.js";
//#region src/js/modules/pdf-link-labels.js
var t = "data-bemke-pdf-link-ready", n = "bemke-pdf-link-format", r = "__bemkePdfLinkLabelsBooted";
function i() {
	a(), !window[r] && (window[r] = !0, window.addEventListener("load", () => a()), document.addEventListener("bricks/ajax/end", () => a()), !(!window.MutationObserver || !document.body) && new MutationObserver((e) => {
		e.some((e) => e.addedNodes.length > 0) && a();
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	}));
}
function a(e = document) {
	(typeof e?.querySelectorAll == "function" ? e : document).querySelectorAll("a[href]").forEach((e) => {
		e.getAttribute(t) === "1" || !s(e.getAttribute("href")) || (e.setAttribute(t, "1"), e.setAttribute("type", "application/pdf"), o(e));
	});
}
function o(t) {
	let r = e("plik PDF", "PDF, document in Polish"), i = e(" (PDF)", " (PDF, in Polish)"), a = l(t.getAttribute("aria-label"));
	if (a && !c(a) && t.setAttribute("aria-label", `${a}, ${r}`), c(t.textContent)) return;
	let o = document.createElement("span");
	o.className = n, o.textContent = i, t.appendChild(o);
}
function s(e) {
	if (!e) return !1;
	try {
		return new URL(e, window.location.href).pathname.toLowerCase().endsWith(".pdf");
	} catch {
		return /\.pdf(?:$|[?#])/i.test(e);
	}
}
function c(e) {
	return /\bpdf\b/i.test(l(e));
}
function l(e) {
	return (e || "").replace(/\s+/g, " ").trim();
}
//#endregion
export { i as initPdfLinkLabels };
