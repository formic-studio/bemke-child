import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./semantic-button-VnITRaDl.js";
//#region src/js/modules/history-tabs.js
var r = ".tabs-block", i = ".tab[tab-number], .tab[data-tab-number]", a = ".history-slide[tab-number], .history-slide[data-tab-number]", o = ".history-img[tab-number], .history-img[data-tab-number]", s = ".history-slide-wrapper", c = ".history-img-wrapper", l = "data-bemke-history-tabs-ready", u = "__bemkeHistoryTabsBooted", d = "tab-active", f = "is-active", p = "history-tabs-track", m = "is-immediate", h = "is-dragging", g = "history-tabs-content", _ = 980, v = 6, y = 0, b = /* @__PURE__ */ new Set();
function x() {
	S(), C();
}
function S(e = document) {
	e.querySelectorAll(r).forEach((e) => {
		let t = P(e);
		if (t) {
			if (t.getAttribute(l) === "1") {
				t.__bemkeHistoryTabsRefresh?.();
				return;
			}
			w(t, e);
		}
	});
}
function C() {
	if (window[u]) return;
	window[u] = !0;
	let e = Z(() => {
		S();
	}, 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) for (let t of n.addedNodes) if (t instanceof Element && (t.matches(r) || t.querySelector(r))) {
			e();
			return;
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function w(n, r) {
	let u = n.querySelector(s), d = n.querySelector(c), f = Array.from(r.querySelectorAll(i)).map(T).filter(Boolean), p = u ? Array.from(u.querySelectorAll(a)) : [], m = d ? Array.from(d.querySelectorAll(o)) : [];
	if (!f.length || !p.length && !m.length) return;
	let h = q(f), g = q(p), v = q(m), b = f.map(Y).filter((e, t, n) => !e || n.indexOf(e) !== t ? !1 : g.has(e) || v.has(e));
	if (!b.length) return;
	y += 1;
	let x = O(u, p, "slides"), S = O(d, m, "images"), C = U(f, b), w = null;
	V(m), N(p), N(m), F(r, f, h, g, b, y), I(p, m, y), E(r), R(u, p, d, m), n.setAttribute(l, "1"), M(C, 1, !0), f.forEach((e) => {
		let t = Y(e);
		if (!t || !b.includes(t)) {
			e.setAttribute("aria-disabled", "true");
			return;
		}
		e.addEventListener("click", () => {
			j(t);
		}), e.addEventListener("keydown", (e) => {
			let n = W(e, t, b);
			n && (e.preventDefault(), K(h.get(n)?.[0]), j(n));
		});
	}), window.addEventListener("resize", Z(() => {
		R(u, p, d, m), M(C, 1, !0);
	}, 120)), n.__bemkeHistoryTabsRefresh = () => {
		R(u, p, d, m), M(C, 1, !0);
	}, document.addEventListener(t, (e) => {
		e.detail?.reduced && M(C, 1, !0);
	});
	function j(e) {
		if (e === C) return;
		let t = C, n = G(t, e, b);
		C = e, M(e, n, !1, t);
	}
	function M(t, n, i, a = t) {
		window.clearTimeout(w), L(f, t), D(r, h.get(t)?.[0], i || e()), k(x, p, a, t, n, i), k(S, m, a, t, n, i), !(i || e()) && (w = window.setTimeout(() => {
			A(x, p, t, !0), A(S, m, t, !0);
		}, _ + 80));
	}
}
function T(e) {
	let t = n(e);
	return Array.from(t?.children ?? []).forEach((e) => {
		if (e.tagName !== "DIV") return;
		let t = document.createElement("span");
		Array.from(e.attributes).forEach(({ name: e, value: n }) => {
			t.setAttribute(e, n);
		}), t.append(...Array.from(e.childNodes)), e.replaceWith(t);
	}), t;
}
function E(e) {
	let t = null, n = 0, r = () => e.scrollWidth > e.clientWidth + 1, i = (r) => {
		if (!t || r.pointerId !== t.id) return;
		let i = t.dragged;
		e.hasPointerCapture?.(r.pointerId) && e.releasePointerCapture(r.pointerId), t = null, e.classList.remove(h), i && (n = Date.now() + 300);
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
		if (!t.lockedAxis && (a > v || o > v) && (t.lockedAxis = a > o ? "x" : "y"), t.lockedAxis === "x") {
			if (n.preventDefault(), t.dragged = !0, e.classList.add(h), !e.hasPointerCapture(n.pointerId)) try {
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
function D(e, t, n) {
	if (!t || e.scrollWidth <= e.clientWidth + 1) return;
	let r = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = 0;
	i.left < r.left ? a = i.left - r.left : i.right > r.right && (a = i.right - r.right), a && e.scrollBy({
		behavior: n ? "auto" : "smooth",
		left: a
	});
}
function O(e, t, n) {
	if (!e || !t.length) return null;
	let r = e.querySelector(`:scope > .${p}`);
	if (r) return t.forEach((e) => r.appendChild(e)), r;
	let i = document.createElement("div");
	return i.className = `${p} ${p}--${n}`, e.insertBefore(i, t[0]), t.forEach((e) => i.appendChild(e)), i;
}
function k(t, n, r, i, a, o) {
	if (!t || !n.length) return;
	let s = n.filter((e) => Y(e) === r), c = n.filter((e) => Y(e) === i), l = e();
	if (o || l || r === i || !s.length || !c.length) {
		A(t, n, i, !0);
		return;
	}
	let u = j(t), d = a > 0, p = J(d ? [...s, ...c] : [...c, ...s]);
	n.forEach((e) => {
		let t = c.includes(e);
		e.hidden = !p.includes(e), e.classList.toggle(f, t), e.setAttribute("aria-hidden", t ? "false" : "true");
	}), p.forEach((e) => t.appendChild(e)), M(t, +!d, !0), t.offsetHeight, window.requestAnimationFrame(() => {
		t.__bemkeHistoryTransitionId === u && M(t, +!!d, !1);
	});
}
function A(e, t, n, r) {
	if (!e || !t.length) return;
	let i = j(e), a = t.filter((e) => Y(e) === n), o = t.filter((e) => Y(e) !== n);
	[...a, ...o].forEach((t) => e.appendChild(t)), t.forEach((e) => {
		let t = a.includes(e);
		e.hidden = !t, e.classList.toggle(f, t), e.setAttribute("aria-hidden", t ? "false" : "true");
	}), M(e, 0, r), r && (e.offsetHeight, window.requestAnimationFrame(() => {
		e.__bemkeHistoryTransitionId === i && e.classList.remove(m);
	}));
}
function j(e) {
	return e.__bemkeHistoryTransitionId = (e.__bemkeHistoryTransitionId || 0) + 1, e.__bemkeHistoryTransitionId;
}
function M(e, t, n) {
	e.classList.toggle(m, n), e.style.transform = `translate3d(${-100 * t}%, 0, 0)`;
}
function N(e) {
	e.forEach((e) => {
		e.hidden = !1, e.classList.remove("is-entering", "is-leaving", "is-immediate", f), e.style.removeProperty("inset"), e.style.removeProperty("opacity"), e.style.removeProperty("pointer-events"), e.style.removeProperty("position"), e.style.removeProperty("transform"), e.style.removeProperty("transition"), e.style.removeProperty("width"), e.style.removeProperty("--history-enter-x"), e.style.removeProperty("--history-exit-x");
	});
}
function P(e) {
	return e.closest(".brx-grid") || e.closest(".brxe-block")?.parentElement || e.parentElement;
}
function F(e, t, n, r, i, a) {
	e.setAttribute("role", "tablist"), e.setAttribute("aria-orientation", "horizontal"), e.parentElement?.classList.add(g), t.forEach((e) => {
		let t = Y(e);
		if (!(t && i.includes(t))) return;
		let o = r.get(t)?.[0], s = e.id || `bemke-history-tab-${a}-${t}`;
		e.id = s, e.setAttribute("role", "tab"), e.setAttribute("tabindex", "-1"), e.setAttribute("aria-selected", "false"), o && (o.id ||= `bemke-history-panel-${a}-${t}`, e.setAttribute("aria-controls", o.id), o.setAttribute("aria-labelledby", s)), n.get(t)?.forEach((t) => {
			t !== e && t.setAttribute("aria-hidden", "true");
		});
	});
}
function I(e, t, n) {
	e.forEach((e) => {
		let t = Y(e);
		e.id ||= `bemke-history-panel-${n}-${t}`, e.setAttribute("role", "tabpanel"), e.setAttribute("aria-hidden", "true");
	}), t.forEach((e) => {
		e.setAttribute("aria-hidden", "true"), e.setAttribute("draggable", "false"), e.draggable = !1;
	});
}
function L(e, t) {
	e.forEach((e) => {
		let n = Y(e) === t;
		e.classList.toggle(d, n), e.setAttribute("aria-selected", n ? "true" : "false"), e.setAttribute("tabindex", n ? "0" : "-1");
	});
}
function R(e, t, n, r) {
	z(e, t, "--history-slide-height"), z(n, r, "--history-img-height");
}
function z(e, t, n) {
	if (!e || !t.length) return;
	let r = 0;
	t.forEach((t) => {
		let n = t.hidden, i = t.style.position, a = t.style.visibility, o = t.style.opacity, s = t.style.transform, c = t.style.width;
		t.hidden = !1, t.style.position = "relative", t.style.visibility = "hidden", t.style.opacity = "1", t.style.transform = "none", t.style.width = `${e.getBoundingClientRect().width}px`;
		let l = t.getBoundingClientRect();
		r = Math.max(r, l.height, t.scrollHeight, B(t, e)), t.hidden = n, t.style.position = i, t.style.visibility = a, t.style.opacity = o, t.style.transform = s, t.style.width = c;
	}), r > 0 && e.style.setProperty(n, `${Math.ceil(r)}px`);
}
function B(e, t) {
	if (!(e instanceof HTMLImageElement)) return 0;
	let n = Number(e.getAttribute("width")), r = Number(e.getAttribute("height")), i = t.getBoundingClientRect().width;
	return !n || !r || !i ? 0 : i * r / n;
}
function V(e) {
	e.forEach((e) => {
		e.setAttribute("loading", "eager"), e.setAttribute("decoding", "async"), e.setAttribute("draggable", "false"), e.draggable = !1, H(e);
	});
}
function H(e) {
	let t = e.currentSrc || e.getAttribute("src") || e.src;
	if (!t || e.complete && e.naturalWidth > 0) return;
	typeof e.decode == "function" && e.decode().catch(() => {});
	let n = new Image(), r = e.getAttribute("srcset"), i = e.getAttribute("sizes");
	r && (n.srcset = r), i && (n.sizes = i), n.decoding = "async", n.onload = () => b.delete(n), n.onerror = () => b.delete(n), b.add(n), n.src = t;
}
function U(e, t) {
	let n = Y(e.find((e) => e.classList.contains(d)));
	return n && t.includes(n) ? n : t[0];
}
function W(e, t, n) {
	let r = n.indexOf(t);
	return r < 0 ? null : e.key === "ArrowLeft" ? n[X(r - 1, n.length)] : e.key === "ArrowRight" ? n[X(r + 1, n.length)] : e.key === "Home" ? n[0] : e.key === "End" ? n[n.length - 1] : null;
}
function G(e, t, n) {
	let r = n.indexOf(e), i = n.indexOf(t);
	return r < 0 || i < 0 || r === i || i > r ? 1 : -1;
}
function K(e) {
	!e || document.activeElement === e || e.focus({ preventScroll: !0 });
}
function q(e) {
	return e.reduce((e, t) => {
		let n = Y(t);
		if (!n) return e;
		let r = e.get(n) || [];
		return r.push(t), e.set(n, r), e;
	}, /* @__PURE__ */ new Map());
}
function J(e) {
	return e.filter((e, t, n) => n.indexOf(e) === t);
}
function Y(e) {
	return e?.getAttribute("tab-number") || e?.getAttribute("data-tab-number") || "";
}
function X(e, t) {
	return (e + t) % t;
}
function Z(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { x as initHistoryTabs };
