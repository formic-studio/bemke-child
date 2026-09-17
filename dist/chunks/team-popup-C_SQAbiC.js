import { n as e } from "./site-language-BMLr3i6q.js";
import { t } from "./semantic-button-jC5kvGhR.js";
//#region src/js/modules/team-popup.js
var n = ".popup-team[data-number]", r = "[data-number]:not(.popup-team)", i = ".team-link", a = ".exit-button", o = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(", "), s = "data-bemke-team-popup-ready", c = "__bemkeTeamPopupBooted", l = "bemke-team-popup-overlay", u = "is-visible", d = "bemke-team-popup", f = "bemke-team-popup-portal", p = "is-visible", m = "bemke-team-popup__content", h = "bemke-team-popup__description", g = "is-scrollable", _ = "is-at-scroll-end", v = "data-bemke-scroll-indicator-ready", y = i.slice(1), b = new Map([
	["01", "Więcej o Przemysławie Powalaczu"],
	["02", "Więcej o Katarzynie Przybył-Tamowicz"],
	["03", "Więcej o Darii Rybińskiej"],
	["04", "Więcej o Urszuli Szudarek"]
]), x = new Map([
	["01", "More about Przemysław Powalacz"],
	["02", "More about Katarzyna Przybył-Tamowicz"],
	["03", "More about Daria Rybińska"],
	["04", "More about Urszula Szudarek"]
]), S = /* @__PURE__ */ new Map(), C = null, w = null, T = null, E = null;
function D() {
	O(), P();
}
function O(e = document) {
	S = /* @__PURE__ */ new Map();
	let t = Array.from(e.querySelectorAll(n));
	if (!t.length) {
		z();
		return;
	}
	B(), V(), U(t), W(t), H(t), t.forEach((e) => {
		let t = q(e.dataset.number);
		t && (e.classList.add(d), e.id ||= `bemke-team-popup-${t}`, e.setAttribute(s, "1"), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("tabindex", "-1"), A(e), k(e, t), e === C && e.classList.contains(p) ? (e.hidden = !1, e.setAttribute("aria-hidden", "false")) : (e.classList.remove(p), e.setAttribute("aria-hidden", "true"), e.setAttribute("hidden", "")), K(t, e));
	}), M(e);
}
function k(t, n) {
	if (t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby")) return;
	let r = t.querySelector("h1, h2, h3, h4, h5, h6");
	if (r?.textContent?.trim()) {
		r.id ||= `bemke-team-popup-title-${n}`, t.setAttribute("aria-labelledby", r.id);
		return;
	}
	t.setAttribute("aria-label", e(`Zespół: ${n}`, `Team member: ${n}`));
}
function A(e) {
	let t = e.querySelector(".font-size-body-xs");
	t && (t.classList.add(h), t.setAttribute("role", "region"), t.parentElement?.classList.add(m), !t.hasAttribute(v) && (t.setAttribute(v, "1"), t.addEventListener("scroll", () => j(t), { passive: !0 })));
}
function j(t) {
	if (!t) return;
	let n = t.closest(`.${m}`);
	if (!n) return;
	let r = t.scrollHeight > t.clientHeight + 2, i = !r || t.scrollTop + t.clientHeight >= t.scrollHeight - 2;
	if (n.classList.toggle(g, r), n.classList.toggle(_, i), r) {
		t.setAttribute("tabindex", "0"), t.setAttribute("aria-label", e("Opis członka zespołu, treść przewijana", "Team member biography, scrollable content"));
		return;
	}
	t.removeAttribute("tabindex"), t.setAttribute("aria-label", e("Opis członka zespołu", "Team member biography"));
}
function M(a) {
	a.querySelectorAll(r).forEach((r) => {
		if (r.closest(n)) return;
		let a = q(r.dataset.number), o = Y(a);
		if (!o) return;
		let s = r.closest(i) ?? r.parentElement, c = t(r), l = N(s?.querySelector(".font-size-caption-big")?.textContent);
		c && (c.setAttribute("aria-label", e(b.get(a), x.get(a)) || (l ? e(`Więcej o osobie: ${l}`, `More about ${l}`) : e("Więcej o członku zespołu", "More about this team member"))), c.setAttribute("aria-haspopup", "dialog"), c.setAttribute("aria-expanded", C === o ? "true" : "false"), c.setAttribute("aria-controls", o.id), s?.classList.add(y));
	});
}
function N(e) {
	return String(e ?? "").replace(/\s+/g, " ").trim();
}
function P() {
	if (window[c]) return;
	window[c] = !0;
	let e = X(() => {
		O();
	}, 90), t = X(() => {
		let e = C?.querySelector(`.${h}`);
		j(e);
	}, 90);
	e(), window.addEventListener("load", e), window.addEventListener("resize", t), window.visualViewport?.addEventListener("resize", t), document.addEventListener("bricks/ajax/end", e), document.addEventListener("click", F), document.addEventListener("keydown", I), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		if (t.some((e) => e.addedNodes.length > 0)) {
			for (let r of t) if (r.target !== E) {
				for (let t of r.addedNodes) if (t instanceof Element && t !== E && t !== T && (t.matches(n) || t.querySelector?.(n))) {
					e();
					return;
				}
			}
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function F(e) {
	let t = e.target.closest(i), n = e.target.closest(r) ?? t?.querySelector(r) ?? t;
	if (e.target.closest(a)) {
		z();
		return;
	}
	if (T && e.target === T) {
		z();
		return;
	}
	if (!n) return;
	let o = Y(q((n.matches(r) ? n : n.querySelector(r))?.dataset.number));
	if (o && !n.closest("." + d)) {
		if (e.preventDefault(), e.stopPropagation(), C === o && o.classList.contains(p)) {
			z();
			return;
		}
		R(o, n);
	}
}
function I(e) {
	if (C) {
		if (e.key === "Escape") {
			e.preventDefault(), z();
			return;
		}
		e.key === "Tab" && L(e, C);
	}
}
function L(e, t) {
	let n = Array.from(t.querySelectorAll(o)).filter((e) => e.getClientRects().length > 0);
	if (!n.length) {
		e.preventDefault(), t.focus({ preventScroll: !0 });
		return;
	}
	let r = n[0], i = n[n.length - 1], a = !t.contains(document.activeElement);
	if (e.shiftKey && (document.activeElement === r || a)) {
		e.preventDefault(), i.focus({ preventScroll: !0 });
		return;
	}
	!e.shiftKey && (document.activeElement === i || a) && (e.preventDefault(), r.focus({ preventScroll: !0 }));
}
function R(e, t) {
	if (!e || !T) return;
	z({ restoreFocus: !1 }), C = e, w = t, w && w.setAttribute("aria-expanded", "true"), e.hidden = !1, e.setAttribute("aria-hidden", "false"), e.classList.add(p), T.classList.add(u), document.documentElement.classList.add("is-team-popup-open"), document.body.classList.add("is-team-popup-open");
	let n = e.querySelector(`.${h}`);
	n && (n.scrollTop = 0, window.requestAnimationFrame(() => {
		j(n);
	})), e.focus({ preventScroll: !0 });
}
function z({ restoreFocus: e = !0 } = {}) {
	if (!C && T) {
		T.classList.remove(u), document.documentElement.classList.remove("is-team-popup-open"), document.body.classList.remove("is-team-popup-open");
		return;
	}
	if (!C) return;
	T.classList.remove(u), C.classList.remove(p), C.setAttribute("aria-hidden", "true"), C.setAttribute("hidden", ""), document.documentElement.classList.remove("is-team-popup-open"), document.body.classList.remove("is-team-popup-open");
	let t = w;
	t && t.setAttribute("aria-expanded", "false"), w = null, C = null, e && t?.isConnected && t.focus({ preventScroll: !0 });
}
function B() {
	T?.isConnected || (T = document.querySelector(`.${l}`) ?? document.createElement("div"), T.classList.add(l), T.setAttribute("aria-hidden", "true"), T.tabIndex = -1, T.style.zIndex = "2147483000", T.isConnected || document.body.appendChild(T));
}
function V() {
	E?.isConnected || (E = document.querySelector(`.${f}`) ?? document.createElement("div"), E.classList.add(f), E.isConnected || document.body.appendChild(E));
}
function H(e) {
	E && e.forEach((e) => {
		e.parentElement !== E && E.appendChild(e);
	});
}
function U(e) {
	let t = new Set(e);
	e.filter((e) => !e.parentElement?.closest(n)).forEach((e) => {
		let r = e.parentElement;
		if (!r) return;
		let i = e.nextSibling;
		[e, ...e.querySelectorAll(n)].forEach((e) => {
			let o = Array.from(e.children), s = G(e, Array.from(e.querySelectorAll(a)).find((t) => t.closest(n) === e));
			if (!s) return;
			let c = o.indexOf(s);
			o.slice(c + 1).filter((e) => !t.has(e)).forEach((e) => {
				r.insertBefore(e, i);
			});
		});
	});
}
function W(e) {
	e.forEach((e) => {
		let t = Array.from(e.querySelectorAll(a)).find((t) => t.closest(n) === e);
		!t || t.parentElement === e || e.appendChild(t);
	});
}
function G(e, t) {
	let n = t;
	for (; n?.parentElement && n.parentElement !== e;) n = n.parentElement;
	return n?.parentElement === e ? n : null;
}
function K(e, t) {
	J(e).forEach((e) => {
		S.set(e, t);
	});
}
function q(e) {
	return e?.trim?.() ?? "";
}
function J(e) {
	let t = q(e);
	if (!t) return [];
	let n = t.replace(/^0+(?=\d)/, "");
	return n === t ? [t] : [t, n];
}
function Y(e) {
	if (!e) return null;
	let t = J(e);
	return S.get(t[0]) ?? S.get(t[1]) ?? null;
}
function X(e, t) {
	let n;
	return (...r) => {
		n && window.clearTimeout(n), n = window.setTimeout(() => {
			n = void 0, e(...r);
		}, t);
	};
}
//#endregion
export { D as initTeamPopups };
