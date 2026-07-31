//#region src/js/modules/linked-cards.js
var e = ".steam-block, .card, .area-block", t = "a.btn[href]", n = "a[href], button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])", r = "bemke-linked-card", i = "bemke-linked-card__visual-cta", a = "bemke-linked-card__link", o = "data-bemke-linked-card-ready";
function s(e) {
	return e?.replace?.(/\s+/g, " ").trim() ?? "";
}
function c(e, t) {
	let n = s(t.getAttribute("aria-label"));
	if (n) return n;
	let r = s(t.textContent), i = s(e.querySelector("h1, h2, h3, h4, h5, h6")?.textContent);
	return !i || r.toLowerCase().includes(i.toLowerCase()) ? r : `${r}: ${i}`;
}
function l(e) {
	let t = document.createElement("span");
	return t.className = `${e.className} ${i}`.trim(), t.setAttribute("aria-hidden", "true"), e.id && (t.id = e.id, e.removeAttribute("id")), e.hasAttribute("style") && t.setAttribute("style", e.getAttribute("style")), t.append(...Array.from(e.childNodes, (e) => e.cloneNode(!0))), t;
}
function u(e) {
	if (e.hasAttribute(o)) return;
	let i = Array.from(e.querySelectorAll(t)), s = Array.from(e.querySelectorAll(n));
	if (i.length !== 1 || s.length !== 1 || s[0] !== i[0]) return;
	let u = i[0], d = c(e, u), f = l(u);
	u.before(f), u.className = a, u.removeAttribute("style"), u.replaceChildren(), d && u.setAttribute("aria-label", d), e.appendChild(u), e.classList.add(r), e.setAttribute(o, "1");
}
function d(t = document) {
	t.querySelectorAll(e).forEach(u);
}
function f() {
	d(), document.addEventListener("bricks/ajax/end", () => {
		d();
	});
}
//#endregion
export { f as initLinkedCards };
