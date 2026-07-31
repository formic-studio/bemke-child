//#region src/js/modules/team-popup.js
var e = ".popup-team[data-number]", t = "[data-number]:not(.popup-team)", n = ".team-link", r = ".exit-button", i = "data-bemke-team-popup-ready", a = "__bemkeTeamPopupBooted", o = "bemke-team-popup-overlay", s = "is-visible", c = "bemke-team-popup", l = "bemke-team-popup-portal", u = "is-visible", d = "bemke-team-popup__content", f = "bemke-team-popup__description", p = "is-scrollable", m = "is-at-scroll-end", h = "data-bemke-scroll-indicator-ready", g = n.slice(1), _ = /* @__PURE__ */ new Map(), v = null, y = null, b = null, x = null;
function S() {
	C(), D();
}
function C(t = document) {
	_ = /* @__PURE__ */ new Map();
	let n = Array.from(t.querySelectorAll(e));
	if (!n.length) {
		j();
		return;
	}
	M(), N(), F(n), I(n), P(n), n.forEach((e) => {
		let t = z(e.dataset.number);
		t && (e.classList.add(c), e.setAttribute(i, "1"), e.setAttribute("role", "dialog"), e.setAttribute("tabindex", "-1"), w(e), e.getAttribute("aria-label") === null && e.setAttribute("aria-label", `Zespół: ${t}`), e === v && e.classList.contains(u) ? (e.hidden = !1, e.setAttribute("aria-hidden", "false")) : (e.classList.remove(u), e.setAttribute("aria-hidden", "true"), e.setAttribute("hidden", "")), R(t, e));
	}), E(t);
}
function w(e) {
	let t = e.querySelector(".font-size-body-xs");
	t && (t.classList.add(f), t.setAttribute("role", "region"), t.parentElement?.classList.add(d), !t.hasAttribute(h) && (t.setAttribute(h, "1"), t.addEventListener("scroll", () => T(t), { passive: !0 })));
}
function T(e) {
	if (!e) return;
	let t = e.closest(`.${d}`);
	if (!t) return;
	let n = e.scrollHeight > e.clientHeight + 2, r = !n || e.scrollTop + e.clientHeight >= e.scrollHeight - 2;
	if (t.classList.toggle(p, n), t.classList.toggle(m, r), n) {
		e.setAttribute("tabindex", "0"), e.setAttribute("aria-label", "Opis członka zespołu, treść przewijana");
		return;
	}
	e.removeAttribute("tabindex"), e.setAttribute("aria-label", "Opis członka zespołu");
}
function E(r) {
	r.querySelectorAll(t).forEach((t) => {
		t.closest(e) || V(z(t.dataset.number)) && (t.closest(n) ?? t.parentElement)?.classList.add(g);
	});
}
function D() {
	if (window[a]) return;
	window[a] = !0;
	let t = H(() => {
		C();
	}, 90), n = H(() => {
		let e = v?.querySelector(`.${f}`);
		T(e);
	}, 90);
	t(), window.addEventListener("load", t), window.addEventListener("resize", n), window.visualViewport?.addEventListener("resize", n), document.addEventListener("bricks/ajax/end", t), document.addEventListener("click", O), document.addEventListener("keydown", k), window.setTimeout(t, 200), window.setTimeout(t, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((n) => {
		if (n.some((e) => e.addedNodes.length > 0)) {
			for (let r of n) if (r.target !== x) {
				for (let n of r.addedNodes) if (n instanceof Element && n !== x && n !== b && (n.matches(e) || n.querySelector?.(e))) {
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
function O(e) {
	let i = e.target.closest(n), a = e.target.closest(t), o = i ?? a;
	if (e.target.closest(r)) {
		j();
		return;
	}
	if (b && e.target === b) {
		j();
		return;
	}
	if (!o) return;
	let s = V(z((o.matches(t) ? o : o.querySelector(t))?.dataset.number));
	if (s && !o.closest("." + c)) {
		if (e.preventDefault(), e.stopPropagation(), v === s && s.classList.contains(u)) {
			j();
			return;
		}
		A(s, o);
	}
}
function k(e) {
	e.key !== "Escape" || !v || j();
}
function A(e, t) {
	if (!e || !b) return;
	j(), v = e, y = t, y && y.setAttribute("aria-expanded", "true"), e.hidden = !1, e.setAttribute("aria-hidden", "false"), e.classList.add(u), b.classList.add(s), document.documentElement.classList.add("is-team-popup-open"), document.body.classList.add("is-team-popup-open");
	let n = e.querySelector(`.${f}`);
	n && (n.scrollTop = 0, window.requestAnimationFrame(() => {
		T(n);
	})), e.focus({ preventScroll: !0 });
}
function j() {
	if (!v && b) {
		b.classList.remove(s), document.documentElement.classList.remove("is-team-popup-open"), document.body.classList.remove("is-team-popup-open");
		return;
	}
	v &&= (b.classList.remove(s), v.classList.remove(u), v.setAttribute("aria-hidden", "true"), v.setAttribute("hidden", ""), document.documentElement.classList.remove("is-team-popup-open"), document.body.classList.remove("is-team-popup-open"), y &&= (y.setAttribute("aria-expanded", "false"), null), null);
}
function M() {
	b?.isConnected || (b = document.querySelector(`.${o}`) ?? document.createElement("div"), b.classList.add(o), b.setAttribute("aria-hidden", "true"), b.tabIndex = -1, b.style.zIndex = "2147483000", b.isConnected || document.body.appendChild(b));
}
function N() {
	x?.isConnected || (x = document.querySelector(`.${l}`) ?? document.createElement("div"), x.classList.add(l), x.isConnected || document.body.appendChild(x));
}
function P(e) {
	x && e.forEach((e) => {
		e.parentElement !== x && x.appendChild(e);
	});
}
function F(t) {
	let n = new Set(t);
	t.filter((t) => !t.parentElement?.closest(e)).forEach((t) => {
		let i = t.parentElement;
		if (!i) return;
		let a = t.nextSibling;
		[t, ...t.querySelectorAll(e)].forEach((t) => {
			let o = Array.from(t.children), s = L(t, Array.from(t.querySelectorAll(r)).find((n) => n.closest(e) === t));
			if (!s) return;
			let c = o.indexOf(s);
			o.slice(c + 1).filter((e) => !n.has(e)).forEach((e) => {
				i.insertBefore(e, a);
			});
		});
	});
}
function I(t) {
	t.forEach((t) => {
		let n = Array.from(t.querySelectorAll(r)).find((n) => n.closest(e) === t);
		!n || n.parentElement === t || t.appendChild(n);
	});
}
function L(e, t) {
	let n = t;
	for (; n?.parentElement && n.parentElement !== e;) n = n.parentElement;
	return n?.parentElement === e ? n : null;
}
function R(e, t) {
	B(e).forEach((e) => {
		_.set(e, t);
	});
}
function z(e) {
	return e?.trim?.() ?? "";
}
function B(e) {
	let t = z(e);
	if (!t) return [];
	let n = t.replace(/^0+(?=\d)/, "");
	return n === t ? [t] : [t, n];
}
function V(e) {
	if (!e) return null;
	let t = B(e);
	return _.get(t[0]) ?? _.get(t[1]) ?? null;
}
function H(e, t) {
	let n;
	return (...r) => {
		n && window.clearTimeout(n), n = window.setTimeout(() => {
			n = void 0, e(...r);
		}, t);
	};
}
//#endregion
export { S as initTeamPopups };
