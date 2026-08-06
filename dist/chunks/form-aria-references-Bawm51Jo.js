//#region src/js/modules/form-aria-references.js
var e = ".brxe-form", t = ["aria-labelledby", "aria-describedby"], n = "bemke-sr-only", r = "bemke-field-label", i = "bemke-field-error", a = "bemke-form-status", o = "data-bemke-accessible-form-ready", s = "__bemkeFormAriaReferencesBooted", c = /* @__PURE__ */ new WeakMap(), l = 0;
function u() {
	P(), f(), !window[s] && (window[s] = !0, window.addEventListener("load", d), document.addEventListener("bricks/ajax/end", d), document.addEventListener("bricks/form/success", (e) => T(e, "success")), document.addEventListener("bricks/form/error", (e) => T(e, "error")), !(!window.MutationObserver || !document.body) && new MutationObserver((e) => {
		e.some((e) => e.addedNodes.length > 0) && d();
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	}));
}
function d() {
	P(), f();
}
function f(t = document) {
	(typeof t?.querySelectorAll == "function" ? t : document).querySelectorAll(e).forEach((e) => {
		p(e), v(e), e.getAttribute(o) !== "1" && (e.setAttribute(o, "1"), e.addEventListener("invalid", (t) => {
			t.preventDefault(), y(e, t.target);
		}, !0), e.addEventListener("input", (e) => C(e.target)), e.addEventListener("change", (e) => C(e.target)), e.addEventListener("submit", () => j(e), !0));
	});
}
function p(e) {
	e.querySelectorAll(".form-group").forEach((e) => {
		let t = Array.from(e.querySelectorAll("input, select, textarea")).filter((e) => e.type !== "hidden");
		t.length === 1 && (e.removeAttribute("role"), e.removeAttribute("aria-label"), e.removeAttribute("aria-labelledby")), t.forEach((t) => {
			if (_(t), !m(t)) return;
			let n = h(t);
			if (Array.from(e.querySelectorAll("label[for]")).find((e) => e.htmlFor === n)) {
				t.removeAttribute("aria-label");
				return;
			}
			let i = g(t);
			if (!i) return;
			let a = document.createElement("label");
			a.className = r, a.htmlFor = n, a.textContent = i, e.insertBefore(a, t), t.removeAttribute("aria-label");
		});
	});
}
function m(e) {
	return e.matches("select, textarea") ? !0 : e.matches("input") && ![
		"button",
		"checkbox",
		"file",
		"hidden",
		"image",
		"radio",
		"reset",
		"submit"
	].includes(e.type);
}
function h(e) {
	return e.id ? e.id : (l += 1, e.id = `bemke-form-field-${l}`, e.id);
}
function g(e) {
	let t = (e.getAttribute("aria-label") || e.getAttribute("placeholder") || (e.matches("select") ? e.options[0]?.textContent : "") || "").replace(/\s+/g, " ").replace(/^\*\s*/, "").trim(), n = t.toLocaleLowerCase("pl");
	return e.type === "email" || /\be-?mail\b/i.test(n) ? "E-mail" : n.includes("imię") && n.includes("nazwisko") ? "Imię i nazwisko" : n.includes("temat") ? "Temat" : t;
}
function _(e) {
	let t = `${e.name || ""} ${e.getAttribute("aria-label") || ""} ${e.getAttribute("placeholder") || ""}`.toLocaleLowerCase("pl");
	if (e.type === "email" || /\be-?mail\b/i.test(t)) {
		e.setAttribute("autocomplete", "email");
		return;
	}
	t.includes("imię") && t.includes("nazwisko") && e.setAttribute("autocomplete", "name");
}
function v(e) {
	let t = e.querySelector(`:scope > .${a}`);
	return t || (t = document.createElement("div"), t.className = `${a} ${n}`, t.setAttribute("aria-atomic", "true"), t.setAttribute("aria-live", "polite"), t.setAttribute("role", "status"), e.append(t), t);
}
function y(e, t) {
	(t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement) && (S(t, b(t)), w(e));
}
function b(e) {
	let t = x(e) || "To pole";
	return e.validity.valueMissing ? e.type === "checkbox" || e.type === "radio" ? "Zaznacz wymaganą zgodę." : e.matches("select") ? `Wybierz wartość w polu „${t}”.` : `Uzupełnij pole „${t}”.` : e.validity.typeMismatch && e.type === "email" ? "Wpisz poprawny adres e-mail, np. nazwa@domena.pl." : e.validity.tooShort ? `Wpisz co najmniej ${e.minLength} znaków.` : e.validity.tooLong ? `Wpisz nie więcej niż ${e.maxLength} znaków.` : e.validity.patternMismatch ? `Sprawdź format wartości w polu „${t}”.` : `Sprawdź wartość w polu „${t}”.`;
}
function x(e) {
	return e.id && Array.from(e.form?.querySelectorAll("label[for]") || []).find((t) => t.htmlFor === e.id)?.textContent?.replace(/^\*\s*/, "").replace(/\s+/g, " ").trim() || g(e);
}
function S(e, t) {
	let n = `${h(e)}-bemke-error`, r = document.getElementById(n);
	r || (r = document.createElement("span"), r.id = n, r.className = i, (e.closest(".form-group") || e.parentElement)?.append(r)), r.textContent = t, e.setAttribute("aria-invalid", "true"), M(e, "aria-describedby", n);
}
function C(e) {
	if (!(e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement) || !e.validity.valid) return;
	let t = e.id ? `${e.id}-bemke-error` : "";
	t && (document.getElementById(t)?.remove(), N(e, "aria-describedby", t)), e.removeAttribute("aria-invalid");
}
function w(e) {
	let t = c.get(e);
	t && window.cancelAnimationFrame(t);
	let n = window.requestAnimationFrame(() => {
		e.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus(), c.delete(e);
	});
	c.set(e, n);
}
function T(e, t) {
	let n = E(e.detail);
	if (!n) return;
	let r = t === "success" ? "Dziękujemy. Formularz został wysłany." : "Nie udało się wysłać formularza. Sprawdź dane i spróbuj ponownie.";
	k(n, D(e.detail?.res) || r, t), window.setTimeout(() => A(n, t), 0);
}
function E(t) {
	let n = String(t?.elementId || "").replace(/^brxe-/, "");
	return n ? document.getElementById(`brxe-${n}`) || document.querySelector(`${e}[data-element-id="${n}"]`) : null;
}
function D(e) {
	let t = e?.data?.message;
	return typeof t == "string" ? O(t) : t?.errors && typeof t.errors == "object" ? Object.values(t.errors).flat().map((e) => O(String(e))).filter(Boolean).join(" ") : "";
}
function O(e) {
	let t = document.createElement("div");
	return t.innerHTML = e, t.textContent?.replace(/\s+/g, " ").trim() || "";
}
function k(e, t, n) {
	let r = v(e);
	r.setAttribute("aria-live", n === "error" ? "assertive" : "polite"), r.setAttribute("role", n === "error" ? "alert" : "status"), r.textContent = "", window.requestAnimationFrame(() => {
		r.textContent = t;
	});
}
function A(e, t) {
	let n = e.querySelector(".message");
	if (!n || (n.setAttribute("aria-atomic", "true"), n.setAttribute("aria-live", t === "error" ? "assertive" : "polite"), n.setAttribute("role", t === "error" ? "alert" : "status"), t !== "error")) return;
	let r = e.querySelector("input:invalid, select:invalid, textarea:invalid");
	if (r) {
		r.focus();
		return;
	}
	n.setAttribute("tabindex", "-1"), n.focus();
}
function j(e) {
	let t = v(e);
	t.textContent = "", e.querySelectorAll(`.${i}`).forEach((t) => {
		let n = e.querySelector(`[aria-describedby~="${t.id}"]`);
		n?.validity?.valid && C(n);
	});
}
function M(e, t, n) {
	let r = R(e.getAttribute(t));
	e.setAttribute(t, z([...r, n]).join(" "));
}
function N(e, t, n) {
	let r = R(e.getAttribute(t)).filter((e) => e !== n);
	if (r.length) {
		e.setAttribute(t, r.join(" "));
		return;
	}
	e.removeAttribute(t);
}
function P(n = document) {
	(typeof n?.querySelectorAll == "function" ? n : document).querySelectorAll(e).forEach((e) => {
		t.forEach((t) => {
			e.querySelectorAll(`[${t}]`).forEach((e) => {
				F(e, t);
			});
		});
	});
}
function F(e, t) {
	let n = R(e.getAttribute(t));
	if (!n.length) {
		e.removeAttribute(t);
		return;
	}
	let r = n.map((n) => I(e, n, t)).filter(Boolean);
	if (r.length) {
		e.setAttribute(t, z(r).join(" "));
		return;
	}
	e.removeAttribute(t);
}
function I(e, t, r) {
	if (document.getElementById(t)) return t;
	if (r !== "aria-labelledby") return null;
	let i = L(e);
	if (!i) return null;
	let a = document.createElement("span");
	return a.id = t, a.className = n, a.textContent = i, e.insertBefore(a, e.firstChild), t;
}
function L(e) {
	return (e.querySelector("label")?.textContent || e.textContent)?.replace(/\s+/g, " ").trim() || "";
}
function R(e) {
	return (e || "").split(/\s+/).filter(Boolean);
}
function z(e) {
	return Array.from(new Set(e));
}
//#endregion
export { u as initFormAriaReferences };
