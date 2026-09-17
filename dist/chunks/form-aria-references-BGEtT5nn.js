import { n as e } from "./site-language-BMLr3i6q.js";
//#region src/js/modules/form-aria-references.js
var t = ".brxe-form", n = ["aria-labelledby", "aria-describedby"], r = "bemke-sr-only", i = "bemke-field-error", a = "bemke-form-status", o = "data-bemke-accessible-form-ready", s = "__bemkeFormAriaReferencesBooted", c = /* @__PURE__ */ new WeakMap(), l = 0;
function u() {
	N(), f(), !window[s] && (window[s] = !0, window.addEventListener("load", d), document.addEventListener("bricks/ajax/end", d), document.addEventListener("bricks/form/success", (e) => w(e, "success")), document.addEventListener("bricks/form/error", (e) => w(e, "error")), !(!window.MutationObserver || !document.body) && new MutationObserver((e) => {
		e.some((e) => e.addedNodes.length > 0) && d();
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	}));
}
function d() {
	N(), f();
}
function f(e = document) {
	(typeof e?.querySelectorAll == "function" ? e : document).querySelectorAll(t).forEach((e) => {
		p(e), _(e), e.getAttribute(o) !== "1" && (e.setAttribute(o, "1"), e.addEventListener("invalid", (t) => v(e, t.target), !0), e.addEventListener("input", (e) => S(e.target)), e.addEventListener("change", (e) => S(e.target)), e.addEventListener("submit", () => A(e), !0));
	});
}
function p(e) {
	e.querySelectorAll(".form-group").forEach((e) => {
		let t = Array.from(e.querySelectorAll("input, select, textarea")).filter((e) => e.type !== "hidden");
		t.length === 1 && (e.removeAttribute("role"), e.removeAttribute("aria-label"), e.removeAttribute("aria-labelledby")), t.forEach(g);
	});
}
function m(e) {
	return e.id ? e.id : (l += 1, e.id = `bemke-form-field-${l}`, e.id);
}
function h(t) {
	let n = (t.getAttribute("aria-label") || t.getAttribute("placeholder") || (t.matches("select") ? t.options[0]?.textContent : "") || "").replace(/\s+/g, " ").replace(/^\*\s*/, "").trim(), r = n.toLocaleLowerCase("pl");
	return t.type === "email" || /\be-?mail\b/i.test(r) ? "E-mail" : r.includes("imię") && r.includes("nazwisko") || /full name|first and last name|name and surname/.test(r) ? e("Imię i nazwisko", "Full name") : r.includes("temat") || r.includes("subject") ? e("Temat", "Subject") : n;
}
function g(e) {
	let t = [
		e.name,
		e.getAttribute("aria-label"),
		e.getAttribute("placeholder"),
		b(e)
	].filter(Boolean).join(" ").toLocaleLowerCase("pl");
	if (e.type === "email" || /\be-?mail\b/i.test(t)) {
		e.setAttribute("autocomplete", "email");
		return;
	}
	(t.includes("imię") && t.includes("nazwisko") || /full name|first and last name|name and surname/.test(t)) && e.setAttribute("autocomplete", "name");
}
function _(e) {
	let t = e.querySelector(`:scope > .${a}`);
	return t || (t = document.createElement("div"), t.className = `${a} ${r}`, t.setAttribute("aria-atomic", "true"), t.setAttribute("aria-live", "polite"), t.setAttribute("role", "status"), e.append(t), t);
}
function v(e, t) {
	(t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement) && (x(t, y(t)), C(e));
}
function y(t) {
	let n = b(t) || e("To pole", "This field");
	return t.validity.valueMissing ? t.type === "checkbox" || t.type === "radio" ? e("Zaznacz wymaganą zgodę.", "Select the required consent checkbox.") : t.matches("select") ? e(`Wybierz wartość w polu „${n}”.`, `Select a value for “${n}”.`) : e(`Uzupełnij pole „${n}”.`, `Complete the “${n}” field.`) : t.validity.typeMismatch && t.type === "email" ? e("Wpisz poprawny adres e-mail, np. nazwa@domena.pl.", "Enter a valid email address, such as name@example.com.") : t.validity.tooShort ? e(`Wpisz co najmniej ${t.minLength} znaków.`, `Enter at least ${t.minLength} characters.`) : t.validity.tooLong ? e(`Wpisz nie więcej niż ${t.maxLength} znaków.`, `Enter no more than ${t.maxLength} characters.`) : t.validity.patternMismatch ? e(`Sprawdź format wartości w polu „${n}”.`, `Check the format of “${n}”.`) : e(`Sprawdź wartość w polu „${n}”.`, `Check the value of “${n}”.`);
}
function b(e) {
	return e.id && Array.from(e.form?.querySelectorAll("label[for]") || []).find((t) => t.htmlFor === e.id)?.textContent?.replace(/^\*\s*/, "").replace(/\s+/g, " ").trim() || h(e);
}
function x(e, t) {
	let n = `${m(e)}-bemke-error`, a = document.getElementById(n);
	a || (a = document.createElement("span"), a.id = n, a.className = `${i} ${r}`, (e.closest(".form-group") || e.parentElement)?.append(a)), a.textContent = t, e.setAttribute("aria-invalid", "true"), j(e, "aria-describedby", n);
}
function S(e) {
	if (!(e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement) || !e.validity.valid) return;
	let t = e.id ? `${e.id}-bemke-error` : "";
	t && (document.getElementById(t)?.remove(), M(e, "aria-describedby", t)), e.removeAttribute("aria-invalid");
}
function C(e) {
	let t = c.get(e);
	t && window.cancelAnimationFrame(t);
	let n = window.requestAnimationFrame(() => {
		e.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus(), c.delete(e);
	});
	c.set(e, n);
}
function w(t, n) {
	let r = T(t.detail);
	if (!r) return;
	let i = n === "success" ? e("Dziękujemy. Formularz został wysłany.", "Thank you. Your form has been sent.") : e("Nie udało się wysłać formularza. Sprawdź dane i spróbuj ponownie.", "The form could not be sent. Check your details and try again.");
	O(r, E(t.detail?.res) || i, n), window.setTimeout(() => k(r, n), 0);
}
function T(e) {
	let n = String(e?.elementId || "").replace(/^brxe-/, "");
	return n ? document.getElementById(`brxe-${n}`) || document.querySelector(`${t}[data-element-id="${n}"]`) : null;
}
function E(e) {
	let t = e?.data?.message;
	return typeof t == "string" ? D(t) : t?.errors && typeof t.errors == "object" ? Object.values(t.errors).flat().map((e) => D(String(e))).filter(Boolean).join(" ") : "";
}
function D(e) {
	let t = document.createElement("div");
	return t.innerHTML = e, t.textContent?.replace(/\s+/g, " ").trim() || "";
}
function O(e, t, n) {
	let r = _(e);
	r.setAttribute("aria-live", n === "error" ? "assertive" : "polite"), r.setAttribute("role", n === "error" ? "alert" : "status"), r.textContent = "", window.requestAnimationFrame(() => {
		r.textContent = t;
	});
}
function k(e, t) {
	let n = e.querySelector(".message");
	if (!n || (n.setAttribute("aria-atomic", "true"), n.setAttribute("aria-live", t === "error" ? "assertive" : "polite"), n.setAttribute("role", t === "error" ? "alert" : "status"), t !== "error")) return;
	let r = e.querySelector("input:invalid, select:invalid, textarea:invalid");
	if (r) {
		r.focus();
		return;
	}
	n.setAttribute("tabindex", "-1"), n.focus();
}
function A(e) {
	let t = _(e);
	t.textContent = "", e.querySelectorAll(`.${i}`).forEach((t) => {
		let n = e.querySelector(`[aria-describedby~="${t.id}"]`);
		n?.validity?.valid && S(n);
	});
}
function j(e, t, n) {
	let r = L(e.getAttribute(t));
	e.setAttribute(t, R([...r, n]).join(" "));
}
function M(e, t, n) {
	let r = L(e.getAttribute(t)).filter((e) => e !== n);
	if (r.length) {
		e.setAttribute(t, r.join(" "));
		return;
	}
	e.removeAttribute(t);
}
function N(e = document) {
	(typeof e?.querySelectorAll == "function" ? e : document).querySelectorAll(t).forEach((e) => {
		n.forEach((t) => {
			e.querySelectorAll(`[${t}]`).forEach((e) => {
				P(e, t);
			});
		});
	});
}
function P(e, t) {
	let n = L(e.getAttribute(t));
	if (!n.length) {
		e.removeAttribute(t);
		return;
	}
	let r = n.map((n) => F(e, n, t)).filter(Boolean);
	if (r.length) {
		e.setAttribute(t, R(r).join(" "));
		return;
	}
	e.removeAttribute(t);
}
function F(e, t, n) {
	if (document.getElementById(t)) return t;
	if (n !== "aria-labelledby") return null;
	let i = I(e);
	if (!i) return null;
	let a = document.createElement("span");
	return a.id = t, a.className = r, a.textContent = i, e.insertBefore(a, e.firstChild), t;
}
function I(e) {
	return (e.querySelector("label")?.textContent || e.textContent)?.replace(/\s+/g, " ").trim() || "";
}
function L(e) {
	return (e || "").split(/\s+/).filter(Boolean);
}
function R(e) {
	return Array.from(new Set(e));
}
//#endregion
export { u as initFormAriaReferences };
