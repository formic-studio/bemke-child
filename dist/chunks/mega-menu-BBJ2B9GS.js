import { n as e } from "./site-language-BMLr3i6q.js";
//#region src/js/modules/mega-menu.js
var t = "#brx-header", n = "#brxe-spklen", r = "#brxe-vhhhdt > .bricks-nav-menu-wrapper > .bricks-nav-menu", i = "(min-width: 992px)", a = "data-bemke-mega-menu-ready", o = "is-mega-menu-open", s = "bemke-mega-item", c = "is-mega-menu-item-active", l = "bemke-mega-submenu", u = "is-mega-submenu-open", d = "data-bemke-original-tabindex", f = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]";
function p() {
	document.querySelectorAll(t).forEach((e) => {
		if (e.getAttribute(a) === "1") {
			e.__bemkeMegaMenuRefresh?.();
			return;
		}
		m(e);
	});
}
function m(e) {
	let t = e.querySelector(n), s = e.querySelector(r), c = window.matchMedia(i);
	if (!t || !s) return;
	let l = T(s), u = l.map((e) => k(e)).filter(Boolean), d = l.map((e, t) => {
		let n = D(e), r = k(e), i = A(e), a = O(e);
		return !n || !r || !a ? null : {
			button: i,
			index: t,
			item: e,
			link: r,
			submenu: a,
			toggle: n
		};
	}).filter(Boolean), f = u.filter((e) => !d.some((t) => t.link === e));
	if (!d.length) return;
	let p = null, m = null;
	e.setAttribute(a, "1"), t.setAttribute("data-bemke-mega-menu-host", "1"), h(d), v(), y(t, d, c.matches), d.forEach((e) => {
		e.toggle.addEventListener("pointerenter", () => _(e)), e.submenu.addEventListener("pointerenter", () => _(e)), e.toggle.addEventListener("pointerleave", b), e.submenu.addEventListener("pointerleave", b), e.link.addEventListener("focus", () => _(e)), e.button?.addEventListener("focus", () => _(e)), e.button?.addEventListener("click", (t) => {
			if (c.matches) {
				if (t.preventDefault(), t.stopImmediatePropagation(), p === e) {
					v();
					return;
				}
				_(e);
			}
		}, !0);
	}), f.forEach((e) => {
		e.addEventListener("pointerenter", v), e.addEventListener("focus", v);
	}), s.addEventListener("pointerenter", (e) => {
		!w(d, e.target) && c.matches && b();
	}), e.addEventListener("focusout", () => {
		window.setTimeout(() => {
			e.contains(document.activeElement) || v();
		}, 0);
	}), e.addEventListener("keydown", (e) => {
		let t = w(d, e.target), n = u.find((t) => t === e.target);
		if (e.key === "Escape" && p) {
			e.preventDefault();
			let t = p.link;
			v(), t.focus({ preventScroll: !0 });
			return;
		}
		if (c.matches) {
			if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && n) {
				e.preventDefault(), C(u, n, e.key === "ArrowRight" ? 1 : -1);
				return;
			}
			if (t && e.key === "ArrowDown" && (t.toggle.contains(e.target) || t.link === e.target)) {
				e.preventDefault(), _(t), S(t.submenu);
				return;
			}
		}
	}), document.addEventListener("pointerdown", (t) => {
		e.contains(t.target) || v();
	}), window.addEventListener("resize", M(() => {
		y(t, d, c.matches), c.matches || v();
	}, 90)), document.fonts?.ready && document.fonts.ready.then(() => {
		y(t, d, c.matches);
	}), e.__bemkeMegaMenuRefresh = () => {
		y(t, d, c.matches);
	};
	function _(n) {
		c.matches && (window.clearTimeout(m), m = null, p = n, e.classList.add(o), y(t, d, !0), d.forEach((e) => {
			g(e, e === n);
		}));
	}
	function v() {
		window.clearTimeout(m), m = null, p = null, e.classList.remove(o), d.forEach((e) => {
			g(e, !1);
		});
	}
	function b() {
		window.clearTimeout(m), m = window.setTimeout(() => {
			let e = document.activeElement;
			p && e && (p.toggle.contains(e) || p.submenu.contains(e)) || v();
		}, 140);
	}
}
function h(e) {
	e.forEach((e) => {
		e.item.classList.add(s), e.submenu.classList.add(l), e.submenu.id ||= `bemke-submenu-${e.index + 1}`, e.submenu.setAttribute("aria-labelledby", j(e.link, `bemke-menu-link-${e.index + 1}`)), e.link.setAttribute("aria-haspopup", "true"), e.link.setAttribute("aria-expanded", "false"), e.link.setAttribute("aria-controls", e.submenu.id), e.button && (e.button.setAttribute("aria-controls", e.submenu.id), e.button.setAttribute("aria-expanded", "false"), _(e, !1), e.button.setAttribute("aria-hidden", "true"), e.button.setAttribute("tabindex", "-1")), e.submenu.querySelectorAll(f).forEach((e) => {
			e.hasAttribute(d) || e.setAttribute(d, e.getAttribute("tabindex") ?? "");
		});
	});
}
function g(e, t) {
	e.item.classList.toggle(c, t), e.submenu.classList.toggle(u, t), e.submenu.setAttribute("aria-hidden", t ? "false" : "true"), e.submenu.toggleAttribute("inert", !t), e.link.setAttribute("aria-expanded", t ? "true" : "false"), e.button?.setAttribute("aria-expanded", t ? "true" : "false"), _(e, t), v(e.submenu, t);
}
function _(t, n) {
	if (!t.button) return;
	let r = t.link.textContent.replace(/\s+/g, " ").trim();
	r && t.button.setAttribute("aria-label", `${n ? e("Zamknij", "Close") : e("Otwórz", "Open")} ${e("podmenu", "submenu")}: ${r}`);
}
function v(e, t) {
	e.querySelectorAll(f).forEach((e) => {
		if (t) {
			let t = e.getAttribute(d);
			if (t) {
				e.setAttribute("tabindex", t);
				return;
			}
			e.removeAttribute("tabindex");
			return;
		}
		e.setAttribute("tabindex", "-1");
	});
}
function y(e, t, n) {
	if (!n) {
		t.forEach((e) => {
			e.submenu.style.removeProperty("--bemke-mega-left"), e.submenu.style.removeProperty("--bemke-mega-screen-left"), e.submenu.style.removeProperty("--bemke-mega-width"), e.submenu.style.removeProperty("--bemke-mega-max-width");
		});
		return;
	}
	let r = e.getBoundingClientRect(), i = document.documentElement.clientWidth || window.innerWidth;
	t.forEach((e) => {
		let t = e.item.getBoundingClientRect(), n = E(e.item)?.getBoundingClientRect(), a = Math.max(0, t.left - r.left), o = n?.left ?? t.right, s = Math.max(1, o - t.left), c = Math.max(s, i - t.left);
		e.submenu.style.setProperty("--bemke-mega-left", `${Math.round(a)}px`), e.submenu.style.setProperty("--bemke-mega-screen-left", `${Math.round(t.left)}px`), e.submenu.style.setProperty("--bemke-mega-max-width", `${Math.round(c)}px`), e.submenu.style.setProperty("--bemke-mega-width", `${Math.round(s)}px`);
		let l = b(e.submenu), u = Math.min(c, Math.max(s, l));
		e.submenu.style.setProperty("--bemke-mega-width", `${Math.round(u)}px`);
	});
}
function b(e) {
	let t = e.getBoundingClientRect(), n = x(window.getComputedStyle(e).paddingRight), r = e.scrollWidth;
	return e.querySelectorAll("a[href]").forEach((e) => {
		let i = e.getBoundingClientRect(), a = Math.max(e.scrollWidth, i.width);
		r = Math.max(r, i.left - t.left + a + n);
	}), Math.ceil(r);
}
function x(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function S(e) {
	let t = e.querySelector("a[href]");
	t && t.focus({ preventScroll: !0 });
}
function C(e, t, n) {
	let r = e.indexOf(t);
	r < 0 || !e.length || e[(r + n + e.length) % e.length].focus({ preventScroll: !0 });
}
function w(e, t) {
	return e.find((e) => e.toggle.contains(t) || e.submenu.contains(t)) ?? null;
}
function T(e) {
	return Array.from(e.children).filter((e) => e.matches("li"));
}
function E(e) {
	let t = e.nextElementSibling;
	for (; t && !t.matches("li");) t = t.nextElementSibling;
	return t;
}
function D(e) {
	return Array.from(e.children).find((e) => e.matches(".brx-submenu-toggle"));
}
function O(e) {
	return Array.from(e.children).find((e) => e.matches("ul.sub-menu"));
}
function k(e) {
	return D(e)?.querySelector(":scope > a") ?? Array.from(e.children).find((e) => e.matches("a[href]")) ?? null;
}
function A(e) {
	return D(e)?.querySelector(":scope > button") ?? null;
}
function j(e, t) {
	return e.id ||= t, e.id;
}
function M(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { p as initMegaMenu };
