import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./site-language-DKWFoMcM.js";
import { t as r } from "./gsap-CjUXhbIO.js";
//#region src/js/modules/mobile-menu.js
var i = "#brx-header", a = "#brxe-vhhhdt", o = "#brxe-spklen", s = ".bricks-mobile-menu-wrapper", c = ".bricks-mobile-menu", l = ".bricks-mobile-menu-toggle", u = ".section_wcag", d = "(max-width: 991px)", f = "data-bemke-mobile-menu-ready";
function p() {
	document.querySelectorAll(i).forEach((e) => {
		if (e.getAttribute(f) === "1") {
			e.__bemkeMobileMenuRefresh?.();
			return;
		}
		m(e);
	});
}
function m(e) {
	let t = e.querySelector(a), n = e.querySelector(o), r = t?.querySelector(s), i = r?.querySelector(c), p = t?.querySelector(l), m = e.querySelector(u);
	if (!t || !n || !r || !i || !p || !m) return;
	let b = m.parentNode, x = m.nextSibling, w = window.matchMedia(d), T = h(r, i), E = y(m);
	S(i), C(t, p, r), _(t, i, w), g(t, T, w), e.setAttribute(f, "1");
	let D = () => {
		if (v(e, n), w.matches) {
			m.parentNode !== T && T.appendChild(m), m.classList.add("bemke-mobile-wcag"), E.mount();
			return;
		}
		if (E.unmount(), m.classList.remove("bemke-mobile-wcag"), m.parentNode !== b) {
			if (x?.parentNode === b) {
				b.insertBefore(m, x);
				return;
			}
			b.appendChild(m);
		}
	};
	w.addEventListener("change", D), "ResizeObserver" in window ? new ResizeObserver(() => {
		v(e, n);
	}).observe(n) : window.addEventListener("resize", () => v(e, n)), D(), e.__bemkeMobileMenuRefresh = D;
}
function h(e, t) {
	let n = e.querySelector(":scope > .bemke-mobile-menu__content");
	if (n) return n;
	let r = document.createElement("div");
	return r.className = "bemke-mobile-menu__content", e.insertBefore(r, t), r.appendChild(t), r;
}
function g(n, i, a) {
	let o = (t = !0) => {
		let o = n.classList.contains("show-mobile-menu"), s = o ? 0 : -100;
		if (r.killTweensOf(i), !t || !a.matches || e()) {
			r.set(i, {
				y: 0,
				yPercent: s
			});
			return;
		}
		r.to(i, {
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
function _(n, i, a) {
	let o = Array.from(i.children).filter((e) => e.matches("li")).map((e) => ({
		item: e,
		link: e.querySelector(":scope > .brx-submenu-toggle > a"),
		button: e.querySelector(":scope > .brx-submenu-toggle > button"),
		submenu: e.querySelector(":scope > .sub-menu")
	})).filter(({ link: e, submenu: t }) => e && t);
	if (!o.length) return;
	n.classList.add("bemke-mobile-menu--gsap-submenus"), i.addEventListener("click", (e) => {
		let t = e.target.closest(".brx-submenu-toggle > a"), n = t?.closest("li");
		!t || n?.parentElement !== i || e.stopPropagation();
	}, !0);
	let s = ({ item: t, button: n, submenu: o }, s = !0) => {
		let c = t.classList.contains("open");
		if (o.id ||= `bemke-mobile-submenu-${Array.from(i.children).indexOf(t) + 1}`, o.setAttribute("aria-hidden", c ? "false" : "true"), o.toggleAttribute("inert", !c), "inert" in o && (o.inert = !c), n && (n.setAttribute("aria-controls", o.id), n.setAttribute("aria-expanded", c ? "true" : "false")), r.killTweensOf(o), !s || !a.matches || e()) {
			r.set(o, {
				autoAlpha: +!!c,
				height: c ? "auto" : 0,
				overflow: c ? "visible" : "hidden"
			});
			return;
		}
		if (c) {
			r.set(o, {
				overflow: "hidden",
				visibility: "visible"
			}), r.to(o, {
				autoAlpha: 1,
				duration: .44,
				ease: "power2.out",
				height: "auto",
				onComplete: () => r.set(o, { overflow: "visible" }),
				overwrite: !0
			});
			return;
		}
		r.set(o, {
			overflow: "hidden",
			visibility: "visible"
		}), r.to(o, {
			autoAlpha: 0,
			duration: .34,
			ease: "power2.inOut",
			height: 0,
			overwrite: !0
		});
	}, c = () => {
		i.classList.toggle("bemke-mobile-menu--has-open-submenu", o.some(({ item: e }) => e.classList.contains("open")));
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
function v(e, t) {
	let n = t.getBoundingClientRect().height;
	n > 0 && e.style.setProperty("--bemke-mobile-header-height", `${Math.round(n)}px`);
}
function y(e) {
	let t = e.querySelector(".brxe-container > .brxe-block"), n = null, r = null;
	return {
		mount: () => {
			if (!t || n) return;
			let o = e.querySelector("#brxe-kecesp"), s = e.querySelector("#brxe-qcwgax"), c = Array.from(e.querySelectorAll(".lang-switcher-block")), l = c.find((e) => e.querySelector(".animation-switcher")), u = c.find((e) => e.querySelector(".lang-switcher:not(.animation-switcher)"));
			if (!o || !s || !u) return;
			n = Array.from(t.childNodes);
			let d = document.createElement("div"), f = document.createElement("h2"), p = document.createElement("div"), m = "bemke-mobile-wcag-panel", h = (e.closest(i)?.querySelector(`${a} .bricks-mobile-menu > li > .brx-submenu-toggle > button`))?.cloneNode(!0) ?? document.createElement("button");
			if (d.className = "bemke-mobile-wcag__heading", f.className = "bemke-mobile-wcag__title", f.textContent = "Dostępność", h.classList.add("bemke-mobile-wcag__toggle"), h.hidden = !1, h.removeAttribute("id"), h.type = "button", h.setAttribute("aria-controls", m), h.setAttribute("aria-expanded", "true"), h.setAttribute("aria-label", "Zwiń dostępność"), p.className = "bemke-mobile-wcag__panel", p.id = m, h.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id")), h.querySelectorAll("svg").forEach((e) => {
				e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
			}), !h.firstElementChild) {
				h.replaceChildren();
				let e = document.createElement("span");
				e.className = "bemke-mobile-wcag__toggle-arrow", e.setAttribute("aria-hidden", "true"), h.appendChild(e);
			}
			d.append(f, h), t.insertBefore(d, t.firstChild), [
				{
					control: o,
					key: "font-size",
					label: "Wielkość treści"
				},
				{
					control: s,
					key: "contrast",
					label: "Kontrast"
				},
				{
					control: u,
					key: "language",
					label: "Język"
				},
				l ? {
					control: l,
					key: "motion",
					label: "Ogranicz animacje",
					showLabel: !1
				} : null
			].filter(Boolean).forEach(({ control: e, label: t, key: n, showLabel: r = !0 }) => {
				p.appendChild(x(e, t, n, r));
			}), d.insertAdjacentElement("afterend", p), r = b(e);
		},
		unmount: () => {
			!t || !n || (r?.(), r = null, t.replaceChildren(...n), n = null);
		}
	};
}
function b(n) {
	let i = n.querySelector(".bemke-mobile-wcag__toggle"), a = n.querySelector(".bemke-mobile-wcag__panel");
	if (!i || !a) return null;
	let o = (t, n = !0) => {
		if (i.setAttribute("aria-expanded", t ? "true" : "false"), i.setAttribute("aria-label", t ? "Zwiń dostępność" : "Rozwiń dostępność"), a.setAttribute("aria-hidden", t ? "false" : "true"), r.killTweensOf(a), !n || e()) {
			r.set(a, {
				autoAlpha: +!!t,
				height: t ? "auto" : 0,
				overflow: t ? "visible" : "hidden"
			});
			return;
		}
		if (t) {
			r.set(a, {
				overflow: "hidden",
				visibility: "visible"
			}), r.to(a, {
				autoAlpha: 1,
				duration: .44,
				ease: "power2.out",
				height: "auto",
				onComplete: () => r.set(a, { overflow: "visible" }),
				overwrite: !0
			});
			return;
		}
		r.set(a, {
			overflow: "hidden",
			visibility: "visible"
		}), r.to(a, {
			autoAlpha: 0,
			duration: .34,
			ease: "power2.inOut",
			height: 0,
			overwrite: !0
		});
	}, s = () => {
		o(i.getAttribute("aria-expanded") !== "true", !0);
	}, c = () => {
		o(i.getAttribute("aria-expanded") === "true", !1);
	};
	return i.addEventListener("click", s), c(), document.addEventListener(t, c), () => {
		i.removeEventListener("click", s), document.removeEventListener(t, c), r.killTweensOf(a), r.set(a, { clearProps: "height,opacity,overflow,visibility" });
	};
}
function x(e, t, n, r = !0) {
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
function S(e) {
	e.querySelectorAll(":scope > li > .sub-menu > li").forEach((e) => {
		let t = Array.from(e.children).find((e) => e.matches(".brx-submenu-toggle")), n = Array.from(e.children).find((e) => e.matches(".sub-menu")), r = t?.querySelector(":scope > button");
		!t || !n || (e.classList.add("bemke-mobile-menu__nested-branch", "open"), n.setAttribute("aria-hidden", "false"), r && (r.hidden = !0, r.tabIndex = -1, r.setAttribute("aria-expanded", "true"), r.setAttribute("aria-hidden", "true")));
	});
}
function C(e, t, r) {
	let i = n() ? {
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
	}), r.querySelectorAll(".brx-submenu-toggle > button").forEach((e) => {
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
export { p as initMobileMenu };
