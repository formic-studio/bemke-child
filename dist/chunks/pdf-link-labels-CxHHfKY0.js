//#region src/js/modules/pdf-link-labels.js
var e = "data-bemke-pdf-link-ready", t = "bemke-sr-only", n = "__bemkePdfLinkLabelsBooted", r = "plik PDF";
function i() {
	a(), !window[n] && (window[n] = !0, window.addEventListener("load", () => a()), document.addEventListener("bricks/ajax/end", () => a()), !(!window.MutationObserver || !document.body) && new MutationObserver((e) => {
		e.some((e) => e.addedNodes.length > 0) && a();
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	}));
}
function a(t = document) {
	(typeof t?.querySelectorAll == "function" ? t : document).querySelectorAll("a[href]").forEach((t) => {
		t.getAttribute(e) === "1" || !s(t.getAttribute("href")) || (t.setAttribute(e, "1"), t.setAttribute("type", "application/pdf"), o(t));
	});
}
function o(e) {
	let n = l(e.getAttribute("aria-label"));
	if (n) {
		c(n) || e.setAttribute("aria-label", `${n}, ${r}`);
		return;
	}
	if (c(e.textContent)) return;
	let i = document.createElement("span");
	i.className = t, i.textContent = ` (${r})`, e.appendChild(i);
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
