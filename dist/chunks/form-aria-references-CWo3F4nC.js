//#region src/js/modules/form-aria-references.js
var e = ".brxe-form", t = ["aria-labelledby", "aria-describedby"], n = "bemke-sr-only", r = "bemke-field-error", i = "bemke-form-status", a = "data-bemke-accessible-form-ready", o = "__bemkeFormAriaReferencesBooted", s = /* @__PURE__ */ new WeakMap(), c = 0;
function l() {
	M(), d(), !window[o] && (window[o] = !0, window.addEventListener("load", u), document.addEventListener("bricks/ajax/end", u), document.addEventListener("bricks/form/success", (e) => C(e, "success")), document.addEventListener("bricks/form/error", (e) => C(e, "error")), !(!window.MutationObserver || !document.body) && new MutationObserver((e) => {
		e.some((e) => e.addedNodes.length > 0) && u();
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	}));
}
function u() {
	M(), d();
}
function d(t = document) {
	(typeof t?.querySelectorAll == "function" ? t : document).querySelectorAll(e).forEach((e) => {
		f(e), g(e), e.getAttribute(a) !== "1" && (e.setAttribute(a, "1"), e.addEventListener("invalid", (t) => _(e, t.target), !0), e.addEventListener("input", (e) => x(e.target)), e.addEventListener("change", (e) => x(e.target)), e.addEventListener("submit", () => k(e), !0));
	});
}
function f(e) {
	e.querySelectorAll(".form-group").forEach((e) => {
		let t = Array.from(e.querySelectorAll("input, select, textarea")).filter((e) => e.type !== "hidden");
		t.length === 1 && (e.removeAttribute("role"), e.removeAttribute("aria-label"), e.removeAttribute("aria-labelledby")), t.forEach(h);
	});
}
function p(e) {
	return e.id ? e.id : (c += 1, e.id = `bemke-form-field-${c}`, e.id);
}
function m(e) {
	let t = (e.getAttribute("aria-label") || e.getAttribute("placeholder") || (e.matches("select") ? e.options[0]?.textContent : "") || "").replace(/\s+/g, " ").replace(/^\*\s*/, "").trim(), n = t.toLocaleLowerCase("pl");
	return e.type === "email" || /\be-?mail\b/i.test(n) ? "E-mail" : n.includes("imię") && n.includes("nazwisko") ? "Imię i nazwisko" : n.includes("temat") ? "Temat" : t;
}
function h(e) {
	let t = [
		e.name,
		e.getAttribute("aria-label"),
		e.getAttribute("placeholder"),
		y(e)
	].filter(Boolean).join(" ").toLocaleLowerCase("pl");
	if (e.type === "email" || /\be-?mail\b/i.test(t)) {
		e.setAttribute("autocomplete", "email");
		return;
	}
	t.includes("imię") && t.includes("nazwisko") && e.setAttribute("autocomplete", "name");
}
function g(e) {
	let t = e.querySelector(`:scope > .${i}`);
	return t || (t = document.createElement("div"), t.className = `${i} ${n}`, t.setAttribute("aria-atomic", "true"), t.setAttribute("aria-live", "polite"), t.setAttribute("role", "status"), e.append(t), t);
}
function _(e, t) {
	(t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement) && (b(t, v(t)), S(e));
}
function v(e) {
	let t = y(e) || "To pole";
	return e.validity.valueMissing ? e.type === "checkbox" || e.type === "radio" ? "Zaznacz wymaganą zgodę." : e.matches("select") ? `Wybierz wartość w polu „${t}”.` : `Uzupełnij pole „${t}”.` : e.validity.typeMismatch && e.type === "email" ? "Wpisz poprawny adres e-mail, np. nazwa@domena.pl." : e.validity.tooShort ? `Wpisz co najmniej ${e.minLength} znaków.` : e.validity.tooLong ? `Wpisz nie więcej niż ${e.maxLength} znaków.` : e.validity.patternMismatch ? `Sprawdź format wartości w polu „${t}”.` : `Sprawdź wartość w polu „${t}”.`;
}
function y(e) {
	return e.id && Array.from(e.form?.querySelectorAll("label[for]") || []).find((t) => t.htmlFor === e.id)?.textContent?.replace(/^\*\s*/, "").replace(/\s+/g, " ").trim() || m(e);
}
function b(e, t) {
	let i = `${p(e)}-bemke-error`, a = document.getElementById(i);
	a || (a = document.createElement("span"), a.id = i, a.className = `${r} ${n}`, (e.closest(".form-group") || e.parentElement)?.append(a)), a.textContent = t, e.setAttribute("aria-invalid", "true"), A(e, "aria-describedby", i);
}
function x(e) {
	if (!(e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement) || !e.validity.valid) return;
	let t = e.id ? `${e.id}-bemke-error` : "";
	t && (document.getElementById(t)?.remove(), j(e, "aria-describedby", t)), e.removeAttribute("aria-invalid");
}
function S(e) {
	let t = s.get(e);
	t && window.cancelAnimationFrame(t);
	let n = window.requestAnimationFrame(() => {
		e.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus(), s.delete(e);
	});
	s.set(e, n);
}
function C(e, t) {
	let n = w(e.detail);
	if (!n) return;
	let r = t === "success" ? "Dziękujemy. Formularz został wysłany." : "Nie udało się wysłać formularza. Sprawdź dane i spróbuj ponownie.";
	D(n, T(e.detail?.res) || r, t), window.setTimeout(() => O(n, t), 0);
}
function w(t) {
	let n = String(t?.elementId || "").replace(/^brxe-/, "");
	return n ? document.getElementById(`brxe-${n}`) || document.querySelector(`${e}[data-element-id="${n}"]`) : null;
}
function T(e) {
	let t = e?.data?.message;
	return typeof t == "string" ? E(t) : t?.errors && typeof t.errors == "object" ? Object.values(t.errors).flat().map((e) => E(String(e))).filter(Boolean).join(" ") : "";
}
function E(e) {
	let t = document.createElement("div");
	return t.innerHTML = e, t.textContent?.replace(/\s+/g, " ").trim() || "";
}
function D(e, t, n) {
	let r = g(e);
	r.setAttribute("aria-live", n === "error" ? "assertive" : "polite"), r.setAttribute("role", n === "error" ? "alert" : "status"), r.textContent = "", window.requestAnimationFrame(() => {
		r.textContent = t;
	});
}
function O(e, t) {
	let n = e.querySelector(".message");
	if (!n || (n.setAttribute("aria-atomic", "true"), n.setAttribute("aria-live", t === "error" ? "assertive" : "polite"), n.setAttribute("role", t === "error" ? "alert" : "status"), t !== "error")) return;
	let r = e.querySelector("input:invalid, select:invalid, textarea:invalid");
	if (r) {
		r.focus();
		return;
	}
	n.setAttribute("tabindex", "-1"), n.focus();
}
function k(e) {
	let t = g(e);
	t.textContent = "", e.querySelectorAll(`.${r}`).forEach((t) => {
		let n = e.querySelector(`[aria-describedby~="${t.id}"]`);
		n?.validity?.valid && x(n);
	});
}
function A(e, t, n) {
	let r = I(e.getAttribute(t));
	e.setAttribute(t, L([...r, n]).join(" "));
}
function j(e, t, n) {
	let r = I(e.getAttribute(t)).filter((e) => e !== n);
	if (r.length) {
		e.setAttribute(t, r.join(" "));
		return;
	}
	e.removeAttribute(t);
}
function M(n = document) {
	(typeof n?.querySelectorAll == "function" ? n : document).querySelectorAll(e).forEach((e) => {
		t.forEach((t) => {
			e.querySelectorAll(`[${t}]`).forEach((e) => {
				N(e, t);
			});
		});
	});
}
function N(e, t) {
	let n = I(e.getAttribute(t));
	if (!n.length) {
		e.removeAttribute(t);
		return;
	}
	let r = n.map((n) => P(e, n, t)).filter(Boolean);
	if (r.length) {
		e.setAttribute(t, L(r).join(" "));
		return;
	}
	e.removeAttribute(t);
}
function P(e, t, r) {
	if (document.getElementById(t)) return t;
	if (r !== "aria-labelledby") return null;
	let i = F(e);
	if (!i) return null;
	let a = document.createElement("span");
	return a.id = t, a.className = n, a.textContent = i, e.insertBefore(a, e.firstChild), t;
}
function F(e) {
	return (e.querySelector("label")?.textContent || e.textContent)?.replace(/\s+/g, " ").trim() || "";
}
function I(e) {
	return (e || "").split(/\s+/).filter(Boolean);
}
function L(e) {
	return Array.from(new Set(e));
}
//#endregion
export { l as initFormAriaReferences };
