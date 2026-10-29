//#region src/js/modules/linked-cards.js
var e = ".steam-block, .card, .area-block", t = "a.btn[href]", n = "a[href], button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])", r = "bemke-linked-card", i = "bemke-linked-card__visual-cta", a = "data-bemke-linked-card-ready";
function o(e) {
	let t = document.createElement("span");
	return t.className = `${e.className} ${i}`.trim(), t.setAttribute("aria-hidden", "true"), e.id && (t.id = e.id, e.removeAttribute("id")), e.hasAttribute("style") && t.setAttribute("style", e.getAttribute("style")), t.append(...Array.from(e.childNodes, (e) => e.cloneNode(!0))), t;
}
function s(e) {
	if (e.hasAttribute(a)) return;
	let i = Array.from(e.querySelectorAll(t)), s = Array.from(e.querySelectorAll(n));
	if (i.length !== 1 || s.length !== 1 || s[0] !== i[0]) return;
	let c = i[0], l = o(c), u = document.createElement("a");
	Array.from(e.attributes).forEach(({ name: e, value: t }) => {
		u.setAttribute(e, t);
	}), [
		"href",
		"target",
		"rel",
		"download",
		"hreflang",
		"referrerpolicy"
	].forEach((e) => {
		c.hasAttribute(e) && u.setAttribute(e, c.getAttribute(e));
	}), c.replaceWith(l), u.replaceChildren(...e.childNodes), u.classList.add(r), u.setAttribute(a, "1"), e.replaceWith(u);
}
function c(t = document) {
	t.querySelectorAll(e).forEach(s);
}
function l() {
	c(), document.addEventListener("bricks/ajax/end", () => {
		c();
	});
}
//#endregion
export { l as initLinkedCards };
