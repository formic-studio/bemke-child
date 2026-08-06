//#region src/js/modules/mega-menu.js
var e = "#brx-header", t = "#brxe-spklen", n = "#brxe-vhhhdt > .bricks-nav-menu-wrapper > .bricks-nav-menu", r = "(min-width: 992px)", i = "data-bemke-mega-menu-ready", a = "is-mega-menu-open", o = "bemke-mega-item", s = "is-mega-menu-item-active", c = "bemke-mega-submenu", l = "is-mega-submenu-open", u = "data-bemke-original-tabindex", d = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]";
function f() {
	document.querySelectorAll(e).forEach((e) => {
		if (e.getAttribute(i) === "1") {
			e.__bemkeMegaMenuRefresh?.();
			return;
		}
		p(e);
	});
}
function p(e) {
	let o = e.querySelector(t), s = e.querySelector(n), c = window.matchMedia(r);
	if (!o || !s) return;
	let l = w(s), u = l.map((e) => O(e)).filter(Boolean), d = l.map((e, t) => {
		let n = E(e), r = O(e), i = k(e), a = D(e);
		return !n || !r || !a ? null : {
			button: i,
			index: t,
			item: e,
			link: r,
			submenu: a,
			toggle: n
		};
	}).filter(Boolean);
	if (!d.length) return;
	let f = null, p = null;
	e.setAttribute(i, "1"), o.setAttribute("data-bemke-mega-menu-host", "1"), m(d), _(), v(o, d, c.matches), d.forEach((e) => {
		e.toggle.addEventListener("pointerenter", () => g(e)), e.submenu.addEventListener("pointerenter", () => g(e)), e.toggle.addEventListener("pointerleave", y), e.submenu.addEventListener("pointerleave", y), e.link.addEventListener("focus", () => g(e)), e.button?.addEventListener("focus", () => g(e)), e.button?.addEventListener("click", (t) => {
			if (c.matches) {
				if (t.preventDefault(), t.stopImmediatePropagation(), f === e) {
					_();
					return;
				}
				g(e);
			}
		}, !0);
	}), s.addEventListener("pointerenter", (e) => {
		!C(d, e.target) && c.matches && y();
	}), e.addEventListener("focusout", () => {
		window.setTimeout(() => {
			e.contains(document.activeElement) || _();
		}, 0);
	}), e.addEventListener("keydown", (e) => {
		let t = C(d, e.target);
		if (e.key === "Escape" && f) {
			e.preventDefault();
			let t = f.link;
			_(), t.focus({ preventScroll: !0 });
			return;
		}
		if (!(!t || !c.matches)) {
			if (e.key === "ArrowDown" && (t.toggle.contains(e.target) || t.link === e.target)) {
				e.preventDefault(), g(t), x(t.submenu);
				return;
			}
			(e.key === "ArrowLeft" || e.key === "ArrowRight") && (t.toggle.contains(e.target) || t.link === e.target) && (e.preventDefault(), S(u, t.link, e.key === "ArrowRight" ? 1 : -1));
		}
	}), document.addEventListener("pointerdown", (t) => {
		e.contains(t.target) || _();
	}), window.addEventListener("resize", j(() => {
		v(o, d, c.matches), c.matches || _();
	}, 90)), document.fonts?.ready && document.fonts.ready.then(() => {
		v(o, d, c.matches);
	}), e.__bemkeMegaMenuRefresh = () => {
		v(o, d, c.matches);
	};
	function g(t) {
		c.matches && (window.clearTimeout(p), p = null, f = t, e.classList.add(a), v(o, d, !0), d.forEach((e) => {
			h(e, e === t);
		}));
	}
	function _() {
		window.clearTimeout(p), p = null, f = null, e.classList.remove(a), d.forEach((e) => {
			h(e, !1);
		});
	}
	function y() {
		window.clearTimeout(p), p = window.setTimeout(() => {
			let e = document.activeElement;
			f && e && (f.toggle.contains(e) || f.submenu.contains(e)) || _();
		}, 140);
	}
}
function m(e) {
	e.forEach((e) => {
		e.item.classList.add(o), e.submenu.classList.add(c), e.submenu.id ||= `bemke-submenu-${e.index + 1}`, e.submenu.setAttribute("aria-labelledby", A(e.link, `bemke-menu-link-${e.index + 1}`)), e.link.setAttribute("aria-haspopup", "true"), e.link.setAttribute("aria-expanded", "false"), e.link.setAttribute("aria-controls", e.submenu.id), e.button && (e.button.setAttribute("aria-controls", e.submenu.id), e.button.setAttribute("aria-expanded", "false"), g(e, !1), e.button.setAttribute("aria-hidden", "true"), e.button.setAttribute("tabindex", "-1")), e.submenu.querySelectorAll(d).forEach((e) => {
			e.hasAttribute(u) || e.setAttribute(u, e.getAttribute("tabindex") ?? "");
		});
	});
}
function h(e, t) {
	e.item.classList.toggle(s, t), e.submenu.classList.toggle(l, t), e.submenu.setAttribute("aria-hidden", t ? "false" : "true"), e.submenu.toggleAttribute("inert", !t), e.link.setAttribute("aria-expanded", t ? "true" : "false"), e.button?.setAttribute("aria-expanded", t ? "true" : "false"), g(e, t), _(e.submenu, t);
}
function g(e, t) {
	if (!e.button) return;
	let n = e.link.textContent.replace(/\s+/g, " ").trim();
	n && e.button.setAttribute("aria-label", `${t ? "Zamknij" : "Otwórz"} podmenu: ${n}`);
}
function _(e, t) {
	e.querySelectorAll(d).forEach((e) => {
		if (t) {
			let t = e.getAttribute(u);
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
function v(e, t, n) {
	if (!n) {
		t.forEach((e) => {
			e.submenu.style.removeProperty("--bemke-mega-left"), e.submenu.style.removeProperty("--bemke-mega-screen-left"), e.submenu.style.removeProperty("--bemke-mega-width"), e.submenu.style.removeProperty("--bemke-mega-max-width");
		});
		return;
	}
	let r = e.getBoundingClientRect(), i = document.documentElement.clientWidth || window.innerWidth;
	t.forEach((e) => {
		let t = e.item.getBoundingClientRect(), n = T(e.item)?.getBoundingClientRect(), a = Math.max(0, t.left - r.left), o = n?.left ?? t.right, s = Math.max(1, o - t.left), c = Math.max(s, i - t.left);
		e.submenu.style.setProperty("--bemke-mega-left", `${Math.round(a)}px`), e.submenu.style.setProperty("--bemke-mega-screen-left", `${Math.round(t.left)}px`), e.submenu.style.setProperty("--bemke-mega-max-width", `${Math.round(c)}px`), e.submenu.style.setProperty("--bemke-mega-width", `${Math.round(s)}px`);
		let l = y(e.submenu), u = Math.min(c, Math.max(s, l));
		e.submenu.style.setProperty("--bemke-mega-width", `${Math.round(u)}px`);
	});
}
function y(e) {
	let t = e.getBoundingClientRect(), n = b(window.getComputedStyle(e).paddingRight), r = e.scrollWidth;
	return e.querySelectorAll("a[href]").forEach((e) => {
		let i = e.getBoundingClientRect(), a = Math.max(e.scrollWidth, i.width);
		r = Math.max(r, i.left - t.left + a + n);
	}), Math.ceil(r);
}
function b(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function x(e) {
	let t = e.querySelector("a[href]");
	t && t.focus({ preventScroll: !0 });
}
function S(e, t, n) {
	let r = e.indexOf(t);
	r < 0 || !e.length || e[(r + n + e.length) % e.length].focus({ preventScroll: !0 });
}
function C(e, t) {
	return e.find((e) => e.toggle.contains(t) || e.submenu.contains(t)) ?? null;
}
function w(e) {
	return Array.from(e.children).filter((e) => e.matches("li"));
}
function T(e) {
	let t = e.nextElementSibling;
	for (; t && !t.matches("li");) t = t.nextElementSibling;
	return t;
}
function E(e) {
	return Array.from(e.children).find((e) => e.matches(".brx-submenu-toggle"));
}
function D(e) {
	return Array.from(e.children).find((e) => e.matches("ul.sub-menu"));
}
function O(e) {
	return E(e)?.querySelector(":scope > a") ?? null;
}
function k(e) {
	return E(e)?.querySelector(":scope > button") ?? null;
}
function A(e, t) {
	return e.id ||= t, e.id;
}
function j(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { f as initMegaMenu };
