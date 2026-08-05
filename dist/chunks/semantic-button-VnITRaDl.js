//#region src/js/modules/semantic-button.js
function e(e) {
	if (!e) return null;
	if (e.tagName === "BUTTON") return e.type = "button", e.removeAttribute("href"), e.removeAttribute("role"), e;
	let t = document.createElement("button");
	return Array.from(e.attributes).forEach(({ name: e, value: n }) => {
		[
			"href",
			"target",
			"rel",
			"role",
			"tabindex",
			"type"
		].includes(e) || t.setAttribute(e, n);
	}), t.type = "button", t.append(...Array.from(e.childNodes)), e.replaceWith(t), t;
}
//#endregion
export { e as t };
