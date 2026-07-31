//#region src/js/modules/form-aria-references.js
var e = ".brxe-form", t = ["aria-labelledby", "aria-describedby"], n = "bemke-sr-only", r = "__bemkeFormAriaReferencesBooted";
function i() {
	a(), !window[r] && (window[r] = !0, window.addEventListener("load", () => a()), document.addEventListener("bricks/ajax/end", () => a()), !(!window.MutationObserver || !document.body) && new MutationObserver((e) => {
		e.some((e) => e.addedNodes.length > 0) && a();
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	}));
}
function a(n = document) {
	(typeof n?.querySelectorAll == "function" ? n : document).querySelectorAll(e).forEach((e) => {
		t.forEach((t) => {
			e.querySelectorAll(`[${t}]`).forEach((e) => {
				o(e, t);
			});
		});
	});
}
function o(e, t) {
	let n = l(e.getAttribute(t));
	if (!n.length) {
		e.removeAttribute(t);
		return;
	}
	let r = n.map((n) => s(e, n, t)).filter(Boolean);
	if (r.length) {
		e.setAttribute(t, u(r).join(" "));
		return;
	}
	e.removeAttribute(t);
}
function s(e, t, r) {
	if (document.getElementById(t)) return t;
	if (r !== "aria-labelledby") return null;
	let i = c(e);
	if (!i) return null;
	let a = document.createElement("span");
	return a.id = t, a.className = n, a.textContent = i, e.insertBefore(a, e.firstChild), t;
}
function c(e) {
	return (e.querySelector("label")?.textContent || e.textContent)?.replace(/\s+/g, " ").trim() || "";
}
function l(e) {
	return (e || "").split(/\s+/).filter(Boolean);
}
function u(e) {
	return Array.from(new Set(e));
}
//#endregion
export { i as initFormAriaReferences };
