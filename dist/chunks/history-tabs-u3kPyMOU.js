import { r as e, t } from "./motion-preference-Bn10ge8D.js";
//#region src/js/modules/history-tabs.js
var n = ".tabs-block", r = ".tab[tab-number], .tab[data-tab-number]", i = ".history-slide[tab-number], .history-slide[data-tab-number]", a = ".history-img[tab-number], .history-img[data-tab-number]", o = ".history-slide-wrapper", s = ".history-img-wrapper", c = "data-bemke-history-tabs-ready", l = "__bemkeHistoryTabsBooted", u = "tab-active", d = "is-active", f = "history-tabs-track", p = "is-immediate", m = "is-dragging", h = "history-tabs-content", g = 980, _ = 6, v = 0, y = /* @__PURE__ */ new Set();
function b() {
	x(), S();
}
function x(e = document) {
	e.querySelectorAll(n).forEach((e) => {
		let t = M(e);
		if (t) {
			if (t.getAttribute(c) === "1") {
				t.__bemkeHistoryTabsRefresh?.();
				return;
			}
			C(t, e);
		}
	});
}
function S() {
	if (window[l]) return;
	window[l] = !0;
	let e = Y(() => {
		x();
	}, 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let r of t) for (let t of r.addedNodes) if (t instanceof Element && (t.matches(n) || t.querySelector(n))) {
			e();
			return;
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function C(n, l) {
	let u = n.querySelector(o), d = n.querySelector(s), f = Array.from(l.querySelectorAll(r)), p = u ? Array.from(u.querySelectorAll(i)) : [], m = d ? Array.from(d.querySelectorAll(a)) : [];
	if (!f.length || !p.length && !m.length) return;
	let h = G(f), _ = G(p), y = G(m), b = f.map(q).filter((e, t, n) => !e || n.indexOf(e) !== t ? !1 : _.has(e) || y.has(e));
	if (!b.length) return;
	v += 1;
	let x = E(u, p, "slides"), S = E(d, m, "images"), C = V(f, b), k = null;
	z(m), j(p), j(m), N(l, f, h, _, b, v), P(p, m, v), w(l), I(u, p, d, m), n.setAttribute(c, "1"), M(C, 1, !0), f.forEach((e) => {
		let t = q(e);
		if (!t || !b.includes(t)) {
			e.setAttribute("aria-disabled", "true");
			return;
		}
		e.addEventListener("click", () => {
			A(t);
		}), e.addEventListener("keydown", (e) => {
			let n = H(e, t, b);
			n && (e.preventDefault(), W(h.get(n)?.[0]), A(n));
		});
	}), window.addEventListener("resize", Y(() => {
		I(u, p, d, m), M(C, 1, !0);
	}, 120)), n.__bemkeHistoryTabsRefresh = () => {
		I(u, p, d, m), M(C, 1, !0);
	}, document.addEventListener(t, (e) => {
		e.detail?.reduced && M(C, 1, !0);
	});
	function A(e) {
		if (e === C) return;
		let t = C, n = U(t, e, b);
		C = e, M(e, n, !1, t);
	}
	function M(t, n, r, i = t) {
		window.clearTimeout(k), F(f, t), T(l, h.get(t)?.[0], r || e()), D(x, p, i, t, n, r), D(S, m, i, t, n, r), !(r || e()) && (k = window.setTimeout(() => {
			O(x, p, t, !0), O(S, m, t, !0);
		}, g + 80));
	}
}
function w(e) {
	let t = null, n = 0, r = () => e.scrollWidth > e.clientWidth + 1, i = (r) => {
		if (!t || r.pointerId !== t.id) return;
		let i = t.dragged;
		e.hasPointerCapture?.(r.pointerId) && e.releasePointerCapture(r.pointerId), t = null, e.classList.remove(m), i && (n = Date.now() + 300);
	};
	e.addEventListener("pointerdown", (n) => {
		n.pointerType !== "mouse" || n.button !== 0 || !n.isPrimary || !r() || (t = {
			dragged: !1,
			id: n.pointerId,
			lockedAxis: null,
			scrollLeft: e.scrollLeft,
			startX: n.clientX,
			startY: n.clientY
		});
	}), e.addEventListener("pointermove", (n) => {
		if (!t || n.pointerId !== t.id) return;
		let r = n.clientX - t.startX, i = n.clientY - t.startY, a = Math.abs(r), o = Math.abs(i);
		if (!t.lockedAxis && (a > _ || o > _) && (t.lockedAxis = a > o ? "x" : "y"), t.lockedAxis === "x") {
			if (n.preventDefault(), t.dragged = !0, e.classList.add(m), !e.hasPointerCapture(n.pointerId)) try {
				e.setPointerCapture(n.pointerId);
			} catch {}
			e.scrollLeft = t.scrollLeft - r;
		}
	}), e.addEventListener("pointerup", i), e.addEventListener("pointercancel", i), e.addEventListener("click", (e) => {
		Date.now() >= n || (e.preventDefault(), e.stopPropagation());
	}, !0), e.addEventListener("wheel", (t) => {
		if (!r()) return;
		let n = Math.abs(t.deltaX), i = (n > Math.abs(t.deltaY) ? t.deltaX : n < .5 ? t.deltaY : 0) * (t.deltaMode === WheelEvent.DOM_DELTA_LINE ? 32 : t.deltaMode === WheelEvent.DOM_DELTA_PAGE ? e.clientWidth : 1);
		if (!i) return;
		let a = e.scrollWidth - e.clientWidth, o = Math.min(a, Math.max(0, e.scrollLeft + i));
		Math.abs(o - e.scrollLeft) < 1 || (t.preventDefault(), e.scrollLeft = o);
	}, { passive: !1 });
}
function T(e, t, n) {
	if (!t || e.scrollWidth <= e.clientWidth + 1) return;
	let r = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = 0;
	i.left < r.left ? a = i.left - r.left : i.right > r.right && (a = i.right - r.right), a && e.scrollBy({
		behavior: n ? "auto" : "smooth",
		left: a
	});
}
function E(e, t, n) {
	if (!e || !t.length) return null;
	let r = e.querySelector(`:scope > .${f}`);
	if (r) return t.forEach((e) => r.appendChild(e)), r;
	let i = document.createElement("div");
	return i.className = `${f} ${f}--${n}`, e.insertBefore(i, t[0]), t.forEach((e) => i.appendChild(e)), i;
}
function D(t, n, r, i, a, o) {
	if (!t || !n.length) return;
	let s = n.filter((e) => q(e) === r), c = n.filter((e) => q(e) === i), l = e();
	if (o || l || r === i || !s.length || !c.length) {
		O(t, n, i, !0);
		return;
	}
	let u = k(t), f = a > 0, p = K(f ? [...s, ...c] : [...c, ...s]);
	n.forEach((e) => {
		let t = c.includes(e);
		e.hidden = !p.includes(e), e.classList.toggle(d, t), e.setAttribute("aria-hidden", t ? "false" : "true");
	}), p.forEach((e) => t.appendChild(e)), A(t, +!f, !0), t.offsetHeight, window.requestAnimationFrame(() => {
		t.__bemkeHistoryTransitionId === u && A(t, +!!f, !1);
	});
}
function O(e, t, n, r) {
	if (!e || !t.length) return;
	let i = k(e), a = t.filter((e) => q(e) === n), o = t.filter((e) => q(e) !== n);
	[...a, ...o].forEach((t) => e.appendChild(t)), t.forEach((e) => {
		let t = a.includes(e);
		e.hidden = !t, e.classList.toggle(d, t), e.setAttribute("aria-hidden", t ? "false" : "true");
	}), A(e, 0, r), r && (e.offsetHeight, window.requestAnimationFrame(() => {
		e.__bemkeHistoryTransitionId === i && e.classList.remove(p);
	}));
}
function k(e) {
	return e.__bemkeHistoryTransitionId = (e.__bemkeHistoryTransitionId || 0) + 1, e.__bemkeHistoryTransitionId;
}
function A(e, t, n) {
	e.classList.toggle(p, n), e.style.transform = `translate3d(${-100 * t}%, 0, 0)`;
}
function j(e) {
	e.forEach((e) => {
		e.hidden = !1, e.classList.remove("is-entering", "is-leaving", "is-immediate", d), e.style.removeProperty("inset"), e.style.removeProperty("opacity"), e.style.removeProperty("pointer-events"), e.style.removeProperty("position"), e.style.removeProperty("transform"), e.style.removeProperty("transition"), e.style.removeProperty("width"), e.style.removeProperty("--history-enter-x"), e.style.removeProperty("--history-exit-x");
	});
}
function M(e) {
	return e.closest(".brx-grid") || e.closest(".brxe-block")?.parentElement || e.parentElement;
}
function N(e, t, n, r, i, a) {
	e.setAttribute("role", "tablist"), e.setAttribute("aria-orientation", "horizontal"), e.parentElement?.classList.add(h), t.forEach((e) => {
		let t = q(e);
		if (!(t && i.includes(t))) return;
		let o = r.get(t)?.[0], s = e.id || `bemke-history-tab-${a}-${t}`;
		e.id = s, e.setAttribute("role", "tab"), e.setAttribute("tabindex", "-1"), e.setAttribute("aria-selected", "false"), o && (o.id ||= `bemke-history-panel-${a}-${t}`, e.setAttribute("aria-controls", o.id), o.setAttribute("aria-labelledby", s)), n.get(t)?.forEach((t) => {
			t !== e && t.setAttribute("aria-hidden", "true");
		});
	});
}
function P(e, t, n) {
	e.forEach((e) => {
		let t = q(e);
		e.id ||= `bemke-history-panel-${n}-${t}`, e.setAttribute("role", "tabpanel"), e.setAttribute("aria-hidden", "true");
	}), t.forEach((e) => {
		e.setAttribute("aria-hidden", "true"), e.setAttribute("draggable", "false"), e.draggable = !1;
	});
}
function F(e, t) {
	e.forEach((e) => {
		let n = q(e) === t;
		e.classList.toggle(u, n), e.setAttribute("aria-selected", n ? "true" : "false"), e.setAttribute("tabindex", n ? "0" : "-1");
	});
}
function I(e, t, n, r) {
	L(e, t, "--history-slide-height"), L(n, r, "--history-img-height");
}
function L(e, t, n) {
	if (!e || !t.length) return;
	let r = 0;
	t.forEach((t) => {
		let n = t.hidden, i = t.style.position, a = t.style.visibility, o = t.style.opacity, s = t.style.transform, c = t.style.width;
		t.hidden = !1, t.style.position = "relative", t.style.visibility = "hidden", t.style.opacity = "1", t.style.transform = "none", t.style.width = `${e.getBoundingClientRect().width}px`;
		let l = t.getBoundingClientRect();
		r = Math.max(r, l.height, t.scrollHeight, R(t, e)), t.hidden = n, t.style.position = i, t.style.visibility = a, t.style.opacity = o, t.style.transform = s, t.style.width = c;
	}), r > 0 && e.style.setProperty(n, `${Math.ceil(r)}px`);
}
function R(e, t) {
	if (!(e instanceof HTMLImageElement)) return 0;
	let n = Number(e.getAttribute("width")), r = Number(e.getAttribute("height")), i = t.getBoundingClientRect().width;
	return !n || !r || !i ? 0 : i * r / n;
}
function z(e) {
	e.forEach((e) => {
		e.setAttribute("loading", "eager"), e.setAttribute("decoding", "async"), e.setAttribute("draggable", "false"), e.draggable = !1, B(e);
	});
}
function B(e) {
	let t = e.currentSrc || e.getAttribute("src") || e.src;
	if (!t || e.complete && e.naturalWidth > 0) return;
	typeof e.decode == "function" && e.decode().catch(() => {});
	let n = new Image(), r = e.getAttribute("srcset"), i = e.getAttribute("sizes");
	r && (n.srcset = r), i && (n.sizes = i), n.decoding = "async", n.onload = () => y.delete(n), n.onerror = () => y.delete(n), y.add(n), n.src = t;
}
function V(e, t) {
	let n = q(e.find((e) => e.classList.contains(u)));
	return n && t.includes(n) ? n : t[0];
}
function H(e, t, n) {
	let r = n.indexOf(t);
	return r < 0 ? null : e.key === "ArrowLeft" ? n[J(r - 1, n.length)] : e.key === "ArrowRight" ? n[J(r + 1, n.length)] : e.key === "Home" ? n[0] : e.key === "End" ? n[n.length - 1] : null;
}
function U(e, t, n) {
	let r = n.indexOf(e), i = n.indexOf(t);
	return r < 0 || i < 0 || r === i || i > r ? 1 : -1;
}
function W(e) {
	!e || document.activeElement === e || e.focus({ preventScroll: !0 });
}
function G(e) {
	return e.reduce((e, t) => {
		let n = q(t);
		if (!n) return e;
		let r = e.get(n) || [];
		return r.push(t), e.set(n, r), e;
	}, /* @__PURE__ */ new Map());
}
function K(e) {
	return e.filter((e, t, n) => n.indexOf(e) === t);
}
function q(e) {
	return e?.getAttribute("tab-number") || e?.getAttribute("data-tab-number") || "";
}
function J(e, t) {
	return (e + t) % t;
}
function Y(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { b as initHistoryTabs };
