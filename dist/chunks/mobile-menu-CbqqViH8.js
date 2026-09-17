import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { n, t as r } from "./site-language-BMLr3i6q.js";
import { t as i } from "./gsap-CjUXhbIO.js";
//#region src/js/modules/mobile-menu.js
var a = "#brx-header", o = "#brxe-vhhhdt", s = "#brxe-spklen", c = ".bricks-mobile-menu-wrapper", l = ".bricks-mobile-menu", u = ".bricks-mobile-menu-toggle", d = ".section_wcag", f = "(max-width: 991px)", p = "data-bemke-mobile-menu-ready";
function m() {
	document.querySelectorAll(a).forEach((e) => {
		if (e.getAttribute(p) === "1") {
			e.__bemkeMobileMenuRefresh?.();
			return;
		}
		h(e);
	});
}
function h(e) {
	let t = e.querySelector(o), n = e.querySelector(s), r = t?.querySelector(c), i = r?.querySelector(l), a = t?.querySelector(u), m = e.querySelector(d);
	if (!t || !n || !r || !i || !a || !m) return;
	let h = m.parentNode, x = m.nextSibling, S = window.matchMedia(f), T = g(r, i), E = b(m);
	C(i), w(t, a, r), v(t, i, S), _(t, T, S), e.setAttribute(p, "1");
	let D = () => {
		if (y(e, n), S.matches) {
			m.parentNode !== T && T.appendChild(m), m.classList.add("bemke-mobile-wcag"), E.mount();
			return;
		}
		if (E.unmount(), m.classList.remove("bemke-mobile-wcag"), m.parentNode !== h) {
			if (x?.parentNode === h) {
				h.insertBefore(m, x);
				return;
			}
			h.appendChild(m);
		}
	};
	S.addEventListener("change", D), "ResizeObserver" in window ? new ResizeObserver(() => {
		y(e, n);
	}).observe(n) : window.addEventListener("resize", () => y(e, n)), D(), e.__bemkeMobileMenuRefresh = D;
}
function g(e, t) {
	let n = e.querySelector(":scope > .bemke-mobile-menu__content");
	if (n) return n;
	let r = document.createElement("div");
	return r.className = "bemke-mobile-menu__content", e.insertBefore(r, t), r.appendChild(t), r;
}
function _(n, r, a) {
	let o = (t = !0) => {
		let o = n.classList.contains("show-mobile-menu"), s = o ? 0 : -100;
		if (i.killTweensOf(r), !t || !a.matches || e()) {
			i.set(r, {
				y: 0,
				yPercent: s
			});
			return;
		}
		i.to(r, {
			duration: o ? .58 : .46,
			ease: o ? "power3.out" : "power2.inOut",
			force3D: !0,
			overwrite: !0,
			y: 0,
			yPercent: s
		});
	};
	o(!1), new MutationObserver(() => {
		o(!0);
	}).observe(n, {
		attributeFilter: ["class"],
		attributes: !0
	}), a.addEventListener("change", () => o(!1)), document.addEventListener(t, () => o(!1));
}
function v(n, r, a) {
	let o = Array.from(r.children).filter((e) => e.matches("li")).map((e) => ({
		item: e,
		link: e.querySelector(":scope > .brx-submenu-toggle > a"),
		button: e.querySelector(":scope > .brx-submenu-toggle > button"),
		submenu: e.querySelector(":scope > .sub-menu")
	})).filter(({ link: e, submenu: t }) => e && t);
	if (!o.length) return;
	n.classList.add("bemke-mobile-menu--gsap-submenus"), r.addEventListener("click", (e) => {
		let t = e.target.closest(".brx-submenu-toggle > a"), n = t?.closest("li");
		!t || n?.parentElement !== r || e.stopPropagation();
	}, !0);
	let s = ({ item: t, button: n, submenu: o }, s = !0) => {
		let c = t.classList.contains("open");
		if (o.id ||= `bemke-mobile-submenu-${Array.from(r.children).indexOf(t) + 1}`, o.setAttribute("aria-hidden", c ? "false" : "true"), o.toggleAttribute("inert", !c), "inert" in o && (o.inert = !c), n && (n.setAttribute("aria-controls", o.id), n.setAttribute("aria-expanded", c ? "true" : "false")), i.killTweensOf(o), !s || !a.matches || e()) {
			i.set(o, {
				autoAlpha: +!!c,
				height: c ? "auto" : 0,
				overflow: c ? "visible" : "hidden"
			});
			return;
		}
		if (c) {
			i.set(o, {
				overflow: "hidden",
				visibility: "visible"
			}), i.to(o, {
				autoAlpha: 1,
				duration: .44,
				ease: "power2.out",
				height: "auto",
				onComplete: () => i.set(o, { overflow: "visible" }),
				overwrite: !0
			});
			return;
		}
		i.set(o, {
			overflow: "hidden",
			visibility: "visible"
		}), i.to(o, {
			autoAlpha: 0,
			duration: .34,
			ease: "power2.inOut",
			height: 0,
			overwrite: !0
		});
	}, c = () => {
		r.classList.toggle("bemke-mobile-menu--has-open-submenu", o.some(({ item: e }) => e.classList.contains("open")));
	};
	o.forEach((e) => {
		s(e, !1), new MutationObserver(() => {
			s(e, !0), c();
		}).observe(e.item, {
			attributeFilter: ["class"],
			attributes: !0
		});
	});
	let l = () => {
		o.forEach((e) => s(e, !1)), c();
	};
	c(), a.addEventListener("change", l), document.addEventListener(t, l);
}
function y(e, t) {
	let n = t.getBoundingClientRect().height;
	n > 0 && e.style.setProperty("--bemke-mobile-header-height", `${Math.round(n)}px`);
}
function b(e) {
	let t = e.querySelector(".brxe-container > .brxe-block"), r = null, i = null;
	return {
		mount: () => {
			if (!t || r) return;
			let s = e.querySelector("#brxe-kecesp"), c = e.querySelector("#brxe-qcwgax"), l = Array.from(e.querySelectorAll(".lang-switcher-block")), u = l.find((e) => e.querySelector(".animation-switcher")), d = l.find((e) => e.querySelector(".lang-switcher:not(.animation-switcher)"));
			if (!s || !c || !d) return;
			r = Array.from(t.childNodes);
			let f = document.createElement("div"), p = document.createElement("h2"), m = document.createElement("div"), h = "bemke-mobile-wcag-panel", g = (e.closest(a)?.querySelector(`${o} .bricks-mobile-menu > li > .brx-submenu-toggle > button`))?.cloneNode(!0) ?? document.createElement("button");
			if (f.className = "bemke-mobile-wcag__heading", p.className = "bemke-mobile-wcag__title", p.textContent = n("Dostępność", "Accessibility"), g.classList.add("bemke-mobile-wcag__toggle"), g.hidden = !1, g.removeAttribute("id"), g.type = "button", g.setAttribute("aria-controls", h), g.setAttribute("aria-expanded", "true"), g.setAttribute("aria-label", n("Zwiń dostępność", "Collapse accessibility controls")), m.className = "bemke-mobile-wcag__panel", m.id = h, g.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id")), g.querySelectorAll("svg").forEach((e) => {
				e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
			}), !g.firstElementChild) {
				g.replaceChildren();
				let e = document.createElement("span");
				e.className = "bemke-mobile-wcag__toggle-arrow", e.setAttribute("aria-hidden", "true"), g.appendChild(e);
			}
			f.append(p, g), t.insertBefore(f, t.firstChild), [
				{
					control: s,
					key: "font-size",
					label: n("Wielkość treści", "Text size")
				},
				{
					control: c,
					key: "contrast",
					label: n("Kontrast", "Contrast")
				},
				{
					control: d,
					key: "language",
					label: n("Język", "Language")
				},
				u ? {
					control: u,
					key: "motion",
					label: n("Ogranicz animacje", "Reduce motion"),
					showLabel: !1
				} : null
			].filter(Boolean).forEach(({ control: e, label: t, key: n, showLabel: r = !0 }) => {
				m.appendChild(S(e, t, n, r));
			}), f.insertAdjacentElement("afterend", m), i = x(e);
		},
		unmount: () => {
			!t || !r || (i?.(), i = null, t.replaceChildren(...r), r = null);
		}
	};
}
function x(r) {
	let a = r.querySelector(".bemke-mobile-wcag__toggle"), o = r.querySelector(".bemke-mobile-wcag__panel");
	if (!a || !o) return null;
	let s = (t, r = !0) => {
		if (a.setAttribute("aria-expanded", t ? "true" : "false"), a.setAttribute("aria-label", t ? n("Zwiń dostępność", "Collapse accessibility controls") : n("Rozwiń dostępność", "Expand accessibility controls")), o.setAttribute("aria-hidden", t ? "false" : "true"), i.killTweensOf(o), !r || e()) {
			i.set(o, {
				autoAlpha: +!!t,
				height: t ? "auto" : 0,
				overflow: t ? "visible" : "hidden"
			});
			return;
		}
		if (t) {
			i.set(o, {
				overflow: "hidden",
				visibility: "visible"
			}), i.to(o, {
				autoAlpha: 1,
				duration: .44,
				ease: "power2.out",
				height: "auto",
				onComplete: () => i.set(o, { overflow: "visible" }),
				overwrite: !0
			});
			return;
		}
		i.set(o, {
			overflow: "hidden",
			visibility: "visible"
		}), i.to(o, {
			autoAlpha: 0,
			duration: .34,
			ease: "power2.inOut",
			height: 0,
			overwrite: !0
		});
	}, c = () => {
		s(a.getAttribute("aria-expanded") !== "true", !0);
	}, l = () => {
		s(a.getAttribute("aria-expanded") === "true", !1);
	};
	return a.addEventListener("click", c), l(), document.addEventListener(t, l), () => {
		a.removeEventListener("click", c), document.removeEventListener(t, l), i.killTweensOf(o), i.set(o, { clearProps: "height,opacity,overflow,visibility" });
	};
}
function S(e, t, n, r = !0) {
	let i = document.createElement("div"), a = `bemke-mobile-wcag-label-${n}`;
	if (i.className = `bemke-mobile-wcag__row bemke-mobile-wcag__row--${n}`, i.setAttribute("role", "group"), e.parentNode.insertBefore(i, e), r) {
		let e = document.createElement("span");
		e.className = "bemke-mobile-wcag__label", e.id = a, e.textContent = t, i.setAttribute("aria-labelledby", a), i.append(e);
	} else {
		let n = e.querySelector(".brxe-text-basic");
		n?.id ? i.setAttribute("aria-labelledby", n.id) : i.setAttribute("aria-label", t);
	}
	return i.append(e), i;
}
function C(e) {
	e.querySelectorAll(":scope > li > .sub-menu > li").forEach((e) => {
		let t = Array.from(e.children).find((e) => e.matches(".brx-submenu-toggle")), n = Array.from(e.children).find((e) => e.matches(".sub-menu")), r = t?.querySelector(":scope > button");
		!t || !n || (e.classList.add("bemke-mobile-menu__nested-branch", "open"), n.setAttribute("aria-hidden", "false"), r && (r.hidden = !0, r.tabIndex = -1, r.setAttribute("aria-expanded", "true"), r.setAttribute("aria-hidden", "true")));
	});
}
function w(e, t, n) {
	let i = r() ? {
		open: "Open main menu",
		close: "Close main menu",
		openSub: "Open submenu: ",
		closeSub: "Close submenu: "
	} : {
		open: "Otwórz menu główne",
		close: "Zamknij menu główne",
		openSub: "Otwórz podmenu: ",
		closeSub: "Zamknij podmenu: "
	};
	window.bricksData?.i18n && (window.bricksData.i18n.openMobileMenu = i.open, window.bricksData.i18n.closeMobileMenu = i.close);
	let a = () => {
		let e = t.getAttribute("aria-expanded") === "true";
		t.setAttribute("aria-label", e ? i.close : i.open);
	};
	a(), new MutationObserver(a).observe(t, {
		attributeFilter: ["aria-expanded"],
		attributes: !0
	}), n.querySelectorAll(".brx-submenu-toggle > button").forEach((e) => {
		let t = () => {
			let t = e.parentElement?.querySelector(":scope > a")?.textContent.trim(), n = e.getAttribute("aria-expanded") === "true";
			t && e.setAttribute("aria-label", `${n ? i.closeSub : i.openSub}${t}`);
		};
		t(), new MutationObserver(t).observe(e, {
			attributeFilter: ["aria-expanded"],
			attributes: !0
		});
	}), e.setAttribute("data-bemke-mobile-navigation", "1");
}
//#endregion
export { m as initMobileMenu };
