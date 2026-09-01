//#region src/js/modules/getresponse-newsletter.js
var e = "brxe-", t = "#brxe-afpmhc", n = /* @__PURE__ */ new WeakMap();
function r() {
	let e = window.bemkeGetResponseConfig;
	return !e || typeof e.endpoint != "string" || typeof e.campaignToken != "string" || !Array.isArray(e.consentFields) || e.consentFields.length === 0 ? null : e;
}
function i(t, n) {
	return String(t.detail?.elementId || "").replace(RegExp(`^${e}`), "") === n.formId ? document.getElementById(`${e}${n.formId}`) : null;
}
function a(e) {
	let r = e.target.closest?.(t);
	if (!r || !r.checkValidity()) return;
	let i = r.elements.namedItem("name")?.value?.trim(), a = r.elements.namedItem("email")?.value?.trim(), o = Array.from(r.querySelectorAll("input[name=\"privacy[]\"]")).some((e) => e.checked);
	!i || !a || !o || n.set(r, {
		name: i,
		email: a
	});
}
function o(e, t, n) {
	let r = document.createElement("input");
	r.type = "hidden", r.name = t, r.value = n, e.append(r);
}
function s(e, t) {
	let n = `bemke-getresponse-${Date.now()}`, r = document.createElement("iframe"), i = document.createElement("form");
	r.name = n, r.hidden = !0, r.setAttribute("aria-hidden", "true"), r.tabIndex = -1, i.method = "post", i.action = t.endpoint, i.target = n, i.acceptCharset = "utf-8", i.hidden = !0, o(i, "email", e.email), o(i, "name", e.name), o(i, "campaign_token", t.campaignToken), o(i, "thankyou_url", ""), o(i, "start_day", "0"), t.consentFields.forEach((e) => {
		o(i, e, "true");
	}), document.body.append(r, i), i.submit(), i.remove(), window.setTimeout(() => r.remove(), 6e4);
}
function c(e) {
	let t = r();
	if (!t) return;
	let a = i(e, t), o = a ? n.get(a) : null;
	!a || !o || (n.delete(a), s(o, t));
}
function l() {
	let e = document.querySelector(t);
	!e || !r() || e.dataset.bemkeGetResponse === "ready" || (e.dataset.bemkeGetResponse = "ready", e.addEventListener("submit", a, !0), document.addEventListener("bricks/form/success", c));
}
//#endregion
export { l as initGetResponseNewsletter };
