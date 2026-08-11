import { t as e } from "./semantic-button-VnITRaDl.js";
//#region src/js/modules/team-popup.js
var t = ".popup-team[data-number]", n = "[data-number]:not(.popup-team)", r = ".team-link", i = ".exit-button", a = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(", "), o = "data-bemke-team-popup-ready", s = "__bemkeTeamPopupBooted", c = "bemke-team-popup-overlay", l = "is-visible", u = "bemke-team-popup", d = "bemke-team-popup-portal", f = "is-visible", p = "bemke-team-popup__content", m = "bemke-team-popup__description", h = "is-scrollable", g = "is-at-scroll-end", _ = "data-bemke-scroll-indicator-ready", v = r.slice(1), y = new Map([
	["01", "Więcej o Przemysławie Powalaczu"],
	["02", "Więcej o Katarzynie Przybył-Tamowicz"],
	["03", "Więcej o Darii Rybińskiej"],
	["04", "Więcej o Urszuli Szudarek"]
]), b = /* @__PURE__ */ new Map(), x = null, S = null, C = null, w = null;
function T() {
	E(), M();
}
function E(e = document) {
	b = /* @__PURE__ */ new Map();
	let n = Array.from(e.querySelectorAll(t));
	if (!n.length) {
		L();
		return;
	}
	R(), z(), V(n), H(n), B(n), n.forEach((e) => {
		let t = G(e.dataset.number);
		t && (e.classList.add(u), e.id ||= `bemke-team-popup-${t}`, e.setAttribute(o, "1"), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("tabindex", "-1"), O(e), D(e, t), e === x && e.classList.contains(f) ? (e.hidden = !1, e.setAttribute("aria-hidden", "false")) : (e.classList.remove(f), e.setAttribute("aria-hidden", "true"), e.setAttribute("hidden", "")), W(t, e));
	}), A(e);
}
function D(e, t) {
	if (e.hasAttribute("aria-label") || e.hasAttribute("aria-labelledby")) return;
	let n = e.querySelector("h1, h2, h3, h4, h5, h6");
	if (n?.textContent?.trim()) {
		n.id ||= `bemke-team-popup-title-${t}`, e.setAttribute("aria-labelledby", n.id);
		return;
	}
	e.setAttribute("aria-label", `Zespół: ${t}`);
}
function O(e) {
	let t = e.querySelector(".font-size-body-xs");
	t && (t.classList.add(m), t.setAttribute("role", "region"), t.parentElement?.classList.add(p), !t.hasAttribute(_) && (t.setAttribute(_, "1"), t.addEventListener("scroll", () => k(t), { passive: !0 })));
}
function k(e) {
	if (!e) return;
	let t = e.closest(`.${p}`);
	if (!t) return;
	let n = e.scrollHeight > e.clientHeight + 2, r = !n || e.scrollTop + e.clientHeight >= e.scrollHeight - 2;
	if (t.classList.toggle(h, n), t.classList.toggle(g, r), n) {
		e.setAttribute("tabindex", "0"), e.setAttribute("aria-label", "Opis członka zespołu, treść przewijana");
		return;
	}
	e.removeAttribute("tabindex"), e.setAttribute("aria-label", "Opis członka zespołu");
}
function A(i) {
	i.querySelectorAll(n).forEach((n) => {
		if (n.closest(t)) return;
		let i = G(n.dataset.number), a = q(i);
		if (!a) return;
		let o = n.closest(r) ?? n.parentElement, s = e(n), c = j(o?.querySelector(".font-size-caption-big")?.textContent);
		s && (s.setAttribute("aria-label", y.get(i) || (c ? `Więcej o osobie: ${c}` : "Więcej o członku zespołu")), s.setAttribute("aria-haspopup", "dialog"), s.setAttribute("aria-expanded", x === a ? "true" : "false"), s.setAttribute("aria-controls", a.id), o?.classList.add(v));
	});
}
function j(e) {
	return String(e ?? "").replace(/\s+/g, " ").trim();
}
function M() {
	if (window[s]) return;
	window[s] = !0;
	let e = J(() => {
		E();
	}, 90), n = J(() => {
		let e = x?.querySelector(`.${m}`);
		k(e);
	}, 90);
	e(), window.addEventListener("load", e), window.addEventListener("resize", n), window.visualViewport?.addEventListener("resize", n), document.addEventListener("bricks/ajax/end", e), document.addEventListener("click", N), document.addEventListener("keydown", P), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((n) => {
		if (n.some((e) => e.addedNodes.length > 0)) {
			for (let r of n) if (r.target !== w) {
				for (let n of r.addedNodes) if (n instanceof Element && n !== w && n !== C && (n.matches(t) || n.querySelector?.(t))) {
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
function N(e) {
	let t = e.target.closest(r), a = e.target.closest(n) ?? t?.querySelector(n) ?? t;
	if (e.target.closest(i)) {
		L();
		return;
	}
	if (C && e.target === C) {
		L();
		return;
	}
	if (!a) return;
	let o = q(G((a.matches(n) ? a : a.querySelector(n))?.dataset.number));
	if (o && !a.closest("." + u)) {
		if (e.preventDefault(), e.stopPropagation(), x === o && o.classList.contains(f)) {
			L();
			return;
		}
		I(o, a);
	}
}
function P(e) {
	if (x) {
		if (e.key === "Escape") {
			e.preventDefault(), L();
			return;
		}
		e.key === "Tab" && F(e, x);
	}
}
function F(e, t) {
	let n = Array.from(t.querySelectorAll(a)).filter((e) => e.getClientRects().length > 0);
	if (!n.length) {
		e.preventDefault(), t.focus({ preventScroll: !0 });
		return;
	}
	let r = n[0], i = n[n.length - 1], o = !t.contains(document.activeElement);
	if (e.shiftKey && (document.activeElement === r || o)) {
		e.preventDefault(), i.focus({ preventScroll: !0 });
		return;
	}
	!e.shiftKey && (document.activeElement === i || o) && (e.preventDefault(), r.focus({ preventScroll: !0 }));
}
function I(e, t) {
	if (!e || !C) return;
	L({ restoreFocus: !1 }), x = e, S = t, S && S.setAttribute("aria-expanded", "true"), e.hidden = !1, e.setAttribute("aria-hidden", "false"), e.classList.add(f), C.classList.add(l), document.documentElement.classList.add("is-team-popup-open"), document.body.classList.add("is-team-popup-open");
	let n = e.querySelector(`.${m}`);
	n && (n.scrollTop = 0, window.requestAnimationFrame(() => {
		k(n);
	})), e.focus({ preventScroll: !0 });
}
function L({ restoreFocus: e = !0 } = {}) {
	if (!x && C) {
		C.classList.remove(l), document.documentElement.classList.remove("is-team-popup-open"), document.body.classList.remove("is-team-popup-open");
		return;
	}
	if (!x) return;
	C.classList.remove(l), x.classList.remove(f), x.setAttribute("aria-hidden", "true"), x.setAttribute("hidden", ""), document.documentElement.classList.remove("is-team-popup-open"), document.body.classList.remove("is-team-popup-open");
	let t = S;
	t && t.setAttribute("aria-expanded", "false"), S = null, x = null, e && t?.isConnected && t.focus({ preventScroll: !0 });
}
function R() {
	C?.isConnected || (C = document.querySelector(`.${c}`) ?? document.createElement("div"), C.classList.add(c), C.setAttribute("aria-hidden", "true"), C.tabIndex = -1, C.style.zIndex = "2147483000", C.isConnected || document.body.appendChild(C));
}
function z() {
	w?.isConnected || (w = document.querySelector(`.${d}`) ?? document.createElement("div"), w.classList.add(d), w.isConnected || document.body.appendChild(w));
}
function B(e) {
	w && e.forEach((e) => {
		e.parentElement !== w && w.appendChild(e);
	});
}
function V(e) {
	let n = new Set(e);
	e.filter((e) => !e.parentElement?.closest(t)).forEach((e) => {
		let r = e.parentElement;
		if (!r) return;
		let a = e.nextSibling;
		[e, ...e.querySelectorAll(t)].forEach((e) => {
			let o = Array.from(e.children), s = U(e, Array.from(e.querySelectorAll(i)).find((n) => n.closest(t) === e));
			if (!s) return;
			let c = o.indexOf(s);
			o.slice(c + 1).filter((e) => !n.has(e)).forEach((e) => {
				r.insertBefore(e, a);
			});
		});
	});
}
function H(e) {
	e.forEach((e) => {
		let n = Array.from(e.querySelectorAll(i)).find((n) => n.closest(t) === e);
		!n || n.parentElement === e || e.appendChild(n);
	});
}
function U(e, t) {
	let n = t;
	for (; n?.parentElement && n.parentElement !== e;) n = n.parentElement;
	return n?.parentElement === e ? n : null;
}
function W(e, t) {
	K(e).forEach((e) => {
		b.set(e, t);
	});
}
function G(e) {
	return e?.trim?.() ?? "";
}
function K(e) {
	let t = G(e);
	if (!t) return [];
	let n = t.replace(/^0+(?=\d)/, "");
	return n === t ? [t] : [t, n];
}
function q(e) {
	if (!e) return null;
	let t = K(e);
	return b.get(t[0]) ?? b.get(t[1]) ?? null;
}
function J(e, t) {
	let n;
	return (...r) => {
		n && window.clearTimeout(n), n = window.setTimeout(() => {
			n = void 0, e(...r);
		}, t);
	};
}
//#endregion
export { T as initTeamPopups };
