import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-BlCrb88B.js";
//#region src/js/modules/mobile-menu.js
var r = "#brx-header", i = "#brxe-vhhhdt", a = "#brxe-spklen", o = ".bricks-mobile-menu-wrapper", s = ".bricks-mobile-menu", c = ".bricks-mobile-menu-toggle", l = ".section_wcag", u = "(max-width: 991px)", d = "data-bemke-mobile-menu-ready";
function f() {
	document.querySelectorAll(r).forEach((e) => {
		if (e.getAttribute(d) === "1") {
			e.__bemkeMobileMenuRefresh?.();
			return;
		}
		p(e);
	});
}
function p(e) {
	let t = e.querySelector(i), n = e.querySelector(a), r = t?.querySelector(o), f = r?.querySelector(s), p = t?.querySelector(c), y = e.querySelector(l);
	if (!t || !n || !r || !f || !p || !y) return;
	let b = y.parentNode, C = y.nextSibling, w = window.matchMedia(u), T = m(r, f), E = v(y);
	x(f), S(t, p, r), g(t, f, w), h(t, T, w), e.setAttribute(d, "1");
	let D = () => {
		if (_(e, n), w.matches) {
			y.parentNode !== T && T.appendChild(y), y.classList.add("bemke-mobile-wcag"), E.mount();
			return;
		}
		if (E.unmount(), y.classList.remove("bemke-mobile-wcag"), y.parentNode !== b) {
			if (C?.parentNode === b) {
				b.insertBefore(y, C);
				return;
			}
			b.appendChild(y);
		}
	};
	w.addEventListener("change", D), "ResizeObserver" in window ? new ResizeObserver(() => {
		_(e, n);
	}).observe(n) : window.addEventListener("resize", () => _(e, n)), D(), e.__bemkeMobileMenuRefresh = D;
}
function m(e, t) {
	let n = e.querySelector(":scope > .bemke-mobile-menu__content");
	if (n) return n;
	let r = document.createElement("div");
	return r.className = "bemke-mobile-menu__content", e.insertBefore(r, t), r.appendChild(t), r;
}
function h(r, i, a) {
	let o = (t = !0) => {
		let o = r.classList.contains("show-mobile-menu"), s = o ? 0 : -100;
		if (n.killTweensOf(i), !t || !a.matches || e()) {
			n.set(i, {
				y: 0,
				yPercent: s
			});
			return;
		}
		n.to(i, {
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
	}).observe(r, {
		attributeFilter: ["class"],
		attributes: !0
	}), a.addEventListener("change", () => o(!1)), document.addEventListener(t, () => o(!1));
}
function g(r, i, a) {
	let o = Array.from(i.children).filter((e) => e.matches("li")).map((e) => ({
		item: e,
		link: e.querySelector(":scope > .brx-submenu-toggle > a"),
		button: e.querySelector(":scope > .brx-submenu-toggle > button"),
		submenu: e.querySelector(":scope > .sub-menu")
	})).filter(({ link: e, submenu: t }) => e && t);
	if (!o.length) return;
	r.classList.add("bemke-mobile-menu--gsap-submenus"), i.addEventListener("click", (e) => {
		let t = e.target.closest(".brx-submenu-toggle > a"), n = t?.closest("li");
		!t || n?.parentElement !== i || e.stopPropagation();
	}, !0);
	let s = ({ item: t, button: r, submenu: o }, s = !0) => {
		let c = t.classList.contains("open");
		if (o.id ||= `bemke-mobile-submenu-${Array.from(i.children).indexOf(t) + 1}`, o.setAttribute("aria-hidden", c ? "false" : "true"), o.toggleAttribute("inert", !c), "inert" in o && (o.inert = !c), r && (r.setAttribute("aria-controls", o.id), r.setAttribute("aria-expanded", c ? "true" : "false")), n.killTweensOf(o), !s || !a.matches || e()) {
			n.set(o, {
				autoAlpha: +!!c,
				height: c ? "auto" : 0,
				overflow: c ? "visible" : "hidden"
			});
			return;
		}
		if (c) {
			n.set(o, {
				overflow: "hidden",
				visibility: "visible"
			}), n.to(o, {
				autoAlpha: 1,
				duration: .44,
				ease: "power2.out",
				height: "auto",
				onComplete: () => n.set(o, { overflow: "visible" }),
				overwrite: !0
			});
			return;
		}
		n.set(o, {
			overflow: "hidden",
			visibility: "visible"
		}), n.to(o, {
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
function _(e, t) {
	let n = t.getBoundingClientRect().height;
	n > 0 && e.style.setProperty("--bemke-mobile-header-height", `${Math.round(n)}px`);
}
function v(e) {
	let t = e.querySelector(".brxe-container > .brxe-block"), n = null, a = null;
	return {
		mount: () => {
			if (!t || n) return;
			let o = e.querySelector("#brxe-kecesp"), s = e.querySelector("#brxe-qcwgax"), c = Array.from(e.querySelectorAll(".lang-switcher-block")), l = c.find((e) => e.querySelector(".animation-switcher")), u = c.find((e) => e.querySelector(".lang-switcher:not(.animation-switcher)"));
			if (!o || !s || !u) return;
			n = Array.from(t.childNodes);
			let d = document.createElement("div"), f = document.createElement("h2"), p = document.createElement("div"), m = "bemke-mobile-wcag-panel", h = (e.closest(r)?.querySelector(`${i} .bricks-mobile-menu > li > .brx-submenu-toggle > button`))?.cloneNode(!0) ?? document.createElement("button");
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
				p.appendChild(b(e, t, n, r));
			}), d.insertAdjacentElement("afterend", p), a = y(e);
		},
		unmount: () => {
			!t || !n || (a?.(), a = null, t.replaceChildren(...n), n = null);
		}
	};
}
function y(r) {
	let i = r.querySelector(".bemke-mobile-wcag__toggle"), a = r.querySelector(".bemke-mobile-wcag__panel");
	if (!i || !a) return null;
	let o = (t, r = !0) => {
		if (i.setAttribute("aria-expanded", t ? "true" : "false"), i.setAttribute("aria-label", t ? "Zwiń dostępność" : "Rozwiń dostępność"), a.setAttribute("aria-hidden", t ? "false" : "true"), n.killTweensOf(a), !r || e()) {
			n.set(a, {
				autoAlpha: +!!t,
				height: t ? "auto" : 0,
				overflow: t ? "visible" : "hidden"
			});
			return;
		}
		if (t) {
			n.set(a, {
				overflow: "hidden",
				visibility: "visible"
			}), n.to(a, {
				autoAlpha: 1,
				duration: .44,
				ease: "power2.out",
				height: "auto",
				onComplete: () => n.set(a, { overflow: "visible" }),
				overwrite: !0
			});
			return;
		}
		n.set(a, {
			overflow: "hidden",
			visibility: "visible"
		}), n.to(a, {
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
		i.removeEventListener("click", s), document.removeEventListener(t, c), n.killTweensOf(a), n.set(a, { clearProps: "height,opacity,overflow,visibility" });
	};
}
function b(e, t, n, r = !0) {
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
function x(e) {
	e.querySelectorAll(":scope > li > .sub-menu > li").forEach((e) => {
		let t = Array.from(e.children).find((e) => e.matches(".brx-submenu-toggle")), n = Array.from(e.children).find((e) => e.matches(".sub-menu")), r = t?.querySelector(":scope > button");
		!t || !n || (e.classList.add("bemke-mobile-menu__nested-branch", "open"), n.setAttribute("aria-hidden", "false"), r && (r.hidden = !0, r.tabIndex = -1, r.setAttribute("aria-expanded", "true"), r.setAttribute("aria-hidden", "true")));
	});
}
function S(e, t, n) {
	window.bricksData?.i18n && (window.bricksData.i18n.openMobileMenu = "Otwórz menu", window.bricksData.i18n.closeMobileMenu = "Zamknij menu");
	let r = () => {
		let e = t.getAttribute("aria-expanded") === "true";
		t.setAttribute("aria-label", e ? "Zamknij menu" : "Otwórz menu");
	};
	r(), new MutationObserver(r).observe(t, {
		attributeFilter: ["aria-expanded"],
		attributes: !0
	}), n.querySelectorAll(".brx-submenu-toggle > button").forEach((e) => {
		let t = () => {
			let t = e.parentElement?.querySelector(":scope > a")?.textContent.trim(), n = e.getAttribute("aria-expanded") === "true";
			t && e.setAttribute("aria-label", `${n ? "Zwiń" : "Rozwiń"} podmenu: ${t}`);
		};
		t(), new MutationObserver(t).observe(e, {
			attributeFilter: ["aria-expanded"],
			attributes: !0
		});
	}), e.setAttribute("data-bemke-mobile-navigation", "1");
}
//#endregion
export { f as initMobileMenu };
