//#region src/js/modules/team-popup.js
var e = ".popup-team[data-number]", t = "[data-number]:not(.popup-team)", n = ".team-link", r = ".exit-button", i = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(", "), a = "data-bemke-team-popup-ready", o = "__bemkeTeamPopupBooted", s = "bemke-team-popup-overlay", c = "is-visible", l = "bemke-team-popup", u = "bemke-team-popup-portal", d = "is-visible", f = "bemke-team-popup__content", p = "bemke-team-popup__description", m = "is-scrollable", h = "is-at-scroll-end", g = "data-bemke-scroll-indicator-ready", _ = n.slice(1), v = /* @__PURE__ */ new Map(), y = null, b = null, x = null, S = null;
function C() {
	w(), k();
}
function w(t = document) {
	v = /* @__PURE__ */ new Map();
	let n = Array.from(t.querySelectorAll(e));
	if (!n.length) {
		P();
		return;
	}
	F(), I(), R(n), z(n), L(n), n.forEach((e) => {
		let t = H(e.dataset.number);
		t && (e.classList.add(l), e.setAttribute(a, "1"), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("tabindex", "-1"), E(e), T(e, t), e === y && e.classList.contains(d) ? (e.hidden = !1, e.setAttribute("aria-hidden", "false")) : (e.classList.remove(d), e.setAttribute("aria-hidden", "true"), e.setAttribute("hidden", "")), V(t, e));
	}), O(t);
}
function T(e, t) {
	if (e.hasAttribute("aria-label") || e.hasAttribute("aria-labelledby")) return;
	let n = e.querySelector("h1, h2, h3, h4, h5, h6");
	if (n?.textContent?.trim()) {
		n.id ||= `bemke-team-popup-title-${t}`, e.setAttribute("aria-labelledby", n.id);
		return;
	}
	e.setAttribute("aria-label", `Zespół: ${t}`);
}
function E(e) {
	let t = e.querySelector(".font-size-body-xs");
	t && (t.classList.add(p), t.setAttribute("role", "region"), t.parentElement?.classList.add(f), !t.hasAttribute(g) && (t.setAttribute(g, "1"), t.addEventListener("scroll", () => D(t), { passive: !0 })));
}
function D(e) {
	if (!e) return;
	let t = e.closest(`.${f}`);
	if (!t) return;
	let n = e.scrollHeight > e.clientHeight + 2, r = !n || e.scrollTop + e.clientHeight >= e.scrollHeight - 2;
	if (t.classList.toggle(m, n), t.classList.toggle(h, r), n) {
		e.setAttribute("tabindex", "0"), e.setAttribute("aria-label", "Opis członka zespołu, treść przewijana");
		return;
	}
	e.removeAttribute("tabindex"), e.setAttribute("aria-label", "Opis członka zespołu");
}
function O(r) {
	r.querySelectorAll(t).forEach((t) => {
		t.closest(e) || W(H(t.dataset.number)) && (t.closest(n) ?? t.parentElement)?.classList.add(_);
	});
}
function k() {
	if (window[o]) return;
	window[o] = !0;
	let t = G(() => {
		w();
	}, 90), n = G(() => {
		let e = y?.querySelector(`.${p}`);
		D(e);
	}, 90);
	t(), window.addEventListener("load", t), window.addEventListener("resize", n), window.visualViewport?.addEventListener("resize", n), document.addEventListener("bricks/ajax/end", t), document.addEventListener("click", A), document.addEventListener("keydown", j), window.setTimeout(t, 200), window.setTimeout(t, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((n) => {
		if (n.some((e) => e.addedNodes.length > 0)) {
			for (let r of n) if (r.target !== S) {
				for (let n of r.addedNodes) if (n instanceof Element && n !== S && n !== x && (n.matches(e) || n.querySelector?.(e))) {
					t();
					return;
				}
			}
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function A(e) {
	let i = e.target.closest(n), a = e.target.closest(t), o = i ?? a;
	if (e.target.closest(r)) {
		P();
		return;
	}
	if (x && e.target === x) {
		P();
		return;
	}
	if (!o) return;
	let s = W(H((o.matches(t) ? o : o.querySelector(t))?.dataset.number));
	if (s && !o.closest("." + l)) {
		if (e.preventDefault(), e.stopPropagation(), y === s && s.classList.contains(d)) {
			P();
			return;
		}
		N(s, o);
	}
}
function j(e) {
	if (y) {
		if (e.key === "Escape") {
			e.preventDefault(), P();
			return;
		}
		e.key === "Tab" && M(e, y);
	}
}
function M(e, t) {
	let n = Array.from(t.querySelectorAll(i)).filter((e) => e.getClientRects().length > 0);
	if (!n.length) {
		e.preventDefault(), t.focus({ preventScroll: !0 });
		return;
	}
	let r = n[0], a = n[n.length - 1], o = !t.contains(document.activeElement);
	if (e.shiftKey && (document.activeElement === r || o)) {
		e.preventDefault(), a.focus({ preventScroll: !0 });
		return;
	}
	!e.shiftKey && (document.activeElement === a || o) && (e.preventDefault(), r.focus({ preventScroll: !0 }));
}
function N(e, t) {
	if (!e || !x) return;
	P({ restoreFocus: !1 }), y = e, b = t, b && b.setAttribute("aria-expanded", "true"), e.hidden = !1, e.setAttribute("aria-hidden", "false"), e.classList.add(d), x.classList.add(c), document.documentElement.classList.add("is-team-popup-open"), document.body.classList.add("is-team-popup-open");
	let n = e.querySelector(`.${p}`);
	n && (n.scrollTop = 0, window.requestAnimationFrame(() => {
		D(n);
	})), e.focus({ preventScroll: !0 });
}
function P({ restoreFocus: e = !0 } = {}) {
	if (!y && x) {
		x.classList.remove(c), document.documentElement.classList.remove("is-team-popup-open"), document.body.classList.remove("is-team-popup-open");
		return;
	}
	if (!y) return;
	x.classList.remove(c), y.classList.remove(d), y.setAttribute("aria-hidden", "true"), y.setAttribute("hidden", ""), document.documentElement.classList.remove("is-team-popup-open"), document.body.classList.remove("is-team-popup-open");
	let t = b;
	t && t.setAttribute("aria-expanded", "false"), b = null, y = null, e && t?.isConnected && t.focus({ preventScroll: !0 });
}
function F() {
	x?.isConnected || (x = document.querySelector(`.${s}`) ?? document.createElement("div"), x.classList.add(s), x.setAttribute("aria-hidden", "true"), x.tabIndex = -1, x.style.zIndex = "2147483000", x.isConnected || document.body.appendChild(x));
}
function I() {
	S?.isConnected || (S = document.querySelector(`.${u}`) ?? document.createElement("div"), S.classList.add(u), S.isConnected || document.body.appendChild(S));
}
function L(e) {
	S && e.forEach((e) => {
		e.parentElement !== S && S.appendChild(e);
	});
}
function R(t) {
	let n = new Set(t);
	t.filter((t) => !t.parentElement?.closest(e)).forEach((t) => {
		let i = t.parentElement;
		if (!i) return;
		let a = t.nextSibling;
		[t, ...t.querySelectorAll(e)].forEach((t) => {
			let o = Array.from(t.children), s = B(t, Array.from(t.querySelectorAll(r)).find((n) => n.closest(e) === t));
			if (!s) return;
			let c = o.indexOf(s);
			o.slice(c + 1).filter((e) => !n.has(e)).forEach((e) => {
				i.insertBefore(e, a);
			});
		});
	});
}
function z(t) {
	t.forEach((t) => {
		let n = Array.from(t.querySelectorAll(r)).find((n) => n.closest(e) === t);
		!n || n.parentElement === t || t.appendChild(n);
	});
}
function B(e, t) {
	let n = t;
	for (; n?.parentElement && n.parentElement !== e;) n = n.parentElement;
	return n?.parentElement === e ? n : null;
}
function V(e, t) {
	U(e).forEach((e) => {
		v.set(e, t);
	});
}
function H(e) {
	return e?.trim?.() ?? "";
}
function U(e) {
	let t = H(e);
	if (!t) return [];
	let n = t.replace(/^0+(?=\d)/, "");
	return n === t ? [t] : [t, n];
}
function W(e) {
	if (!e) return null;
	let t = U(e);
	return v.get(t[0]) ?? v.get(t[1]) ?? null;
}
function G(e, t) {
	let n;
	return (...r) => {
		n && window.clearTimeout(n), n = window.setTimeout(() => {
			n = void 0, e(...r);
		}, t);
	};
}
//#endregion
export { C as initTeamPopups };
