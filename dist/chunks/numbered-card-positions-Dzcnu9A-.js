//#region src/js/modules/numbered-card-positions.js
var e = ".card", t = "data-bemke-card-position-ready", n = "data-bemke-card-position-label";
function r(e) {
	return Array.from(e.querySelectorAll("*")).find((e) => e.children.length > 0 ? !1 : /^0\d+$/u.test(e.textContent?.trim() ?? ""));
}
function i(e) {
	let i = e.map((e) => ({
		card: e,
		number: r(e)
	})).filter(({ number: e }) => e);
	i.length < 2 || i.forEach(({ card: e, number: r }, a) => {
		r.setAttribute("aria-hidden", "true"), r.parentElement?.querySelectorAll(":scope > svg").forEach((e) => {
			e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
		});
		let o = e.querySelector(`[${n}]`);
		o || (o = document.createElement("span"), o.className = "bemke-sr-only", o.setAttribute(n, ""), r.after(o)), o.textContent = `Karta ${a + 1} z ${i.length}.`, e.setAttribute(t, "1");
	});
}
function a(t = document) {
	let n = /* @__PURE__ */ new Map();
	t.querySelectorAll(e).forEach((e) => {
		let t = e.parentElement;
		if (!t) return;
		let r = n.get(t) ?? [];
		r.push(e), n.set(t, r);
	}), n.forEach(i);
}
function o() {
	a(), document.addEventListener("bricks/ajax/end", () => {
		a();
	});
}
//#endregion
export { o as initNumberedCardPositions };
