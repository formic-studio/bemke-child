import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./semantic-button-VnITRaDl.js";
//#region src/js/modules/history-tabs.js
var r = ".tabs-block", i = ".tab[tab-number], .tab[data-tab-number]", a = ".history-slide[tab-number], .history-slide[data-tab-number]", o = ".history-img[tab-number], .history-img[data-tab-number]", s = ".history-slide-wrapper", c = ".history-img-wrapper", l = "data-bemke-history-tabs-ready", u = "__bemkeHistoryTabsBooted", d = "tab-active", f = "is-active", p = "history-tabs-track", m = "is-immediate", h = "is-dragging", g = "history-tabs-content", _ = "history-tabs-navigation", v = "history-tabs-scrollbar", y = "history-tabs-scrollbar__track", b = "history-tabs-scrollbar__thumb", x = "is-dragging", S = 980, C = 6, w = 48, T = 0, E = /* @__PURE__ */ new Set();
function D() {
	O(), k();
}
function O(e = document) {
	e.querySelectorAll(r).forEach((e) => {
		let t = z(e);
		if (t) {
			if (t.getAttribute(l) === "1") {
				t.__bemkeHistoryTabsRefresh?.();
				return;
			}
			A(t, e);
		}
	});
}
function k() {
	if (window[u]) return;
	window[u] = !0;
	let e = $(() => {
		O();
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
function A(n, r) {
	let u = n.querySelector(s), d = n.querySelector(c), f = Array.from(r.querySelectorAll(i)).map(ee).filter(Boolean), p = u ? Array.from(u.querySelectorAll(a)) : [], m = d ? Array.from(d.querySelectorAll(o)) : [];
	if (!f.length || !p.length && !m.length) return;
	let h = X(f), g = X(p), _ = X(m), v = f.map(Z).filter((e, t, n) => !e || n.indexOf(e) !== t ? !1 : g.has(e) || _.has(e));
	if (!v.length) return;
	T += 1;
	let y = N(u, p, "slides"), b = N(d, m, "images"), x = J(f, v), C = null;
	K(m), R(p), R(m), B(r, f, h, g, v, T), V(p, m, T);
	let w = te(r);
	U(u, p, d, m), n.setAttribute(l, "1"), D(x, 1, !0), f.forEach((e) => {
		let t = Z(e);
		if (!t || !v.includes(t)) {
			e.setAttribute("aria-disabled", "true");
			return;
		}
		e.addEventListener("click", () => {
			E(t);
		}), e.addEventListener("keydown", (e) => {
			let n = Y(e, t, v);
			n && (e.preventDefault(), re(h.get(n)?.[0]), E(n));
		});
	}), window.addEventListener("resize", $(() => {
		U(u, p, d, m), D(x, 1, !0), w();
	}, 120)), n.__bemkeHistoryTabsRefresh = () => {
		U(u, p, d, m), D(x, 1, !0), w();
	}, document.addEventListener(t, (e) => {
		e.detail?.reduced && D(x, 1, !0);
	});
	function E(e) {
		if (e === x) return;
		let t = x, n = ne(t, e, v);
		x = e, D(e, n, !1, t);
	}
	function D(t, n, i, a = t) {
		window.clearTimeout(C), H(f, t), M(r, h.get(t)?.[0], i || e()), P(y, p, a, t, n, i), P(b, m, a, t, n, i), !(i || e()) && (C = window.setTimeout(() => {
			F(y, p, t, !0), F(b, m, t, !0);
		}, S + 80));
	}
}
function ee(e) {
	let t = n(e);
	return Array.from(t?.children ?? []).forEach((e) => {
		if (e.tagName !== "DIV") return;
		let t = document.createElement("span");
		Array.from(e.attributes).forEach(({ name: e, value: n }) => {
			t.setAttribute(e, n);
		}), t.append(...Array.from(e.childNodes)), e.replaceWith(t);
	}), t;
}
function te(e) {
	let t = null, n = 0, r = () => e.scrollWidth > e.clientWidth + 1, i = j(e, r), a = (r) => {
		if (!t || r.pointerId !== t.id) return;
		let i = t.dragged;
		e.hasPointerCapture?.(r.pointerId) && e.releasePointerCapture(r.pointerId), t = null, e.classList.remove(h), i && (n = Date.now() + 300);
	};
	if (e.addEventListener("pointerdown", (n) => {
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
		if (!t.lockedAxis && (a > C || o > C) && (t.lockedAxis = a > o ? "x" : "y"), t.lockedAxis === "x") {
			if (n.preventDefault(), t.dragged = !0, e.classList.add(h), !e.hasPointerCapture(n.pointerId)) try {
				e.setPointerCapture(n.pointerId);
			} catch {}
			e.scrollLeft = t.scrollLeft - r;
		}
	}), e.addEventListener("pointerup", a), e.addEventListener("pointercancel", a), e.addEventListener("click", (e) => {
		Date.now() >= n || (e.preventDefault(), e.stopPropagation());
	}, !0), e.addEventListener("wheel", (t) => {
		if (!r()) return;
		let n = Math.abs(t.deltaX), i = (n > Math.abs(t.deltaY) ? t.deltaX : n < .5 ? t.deltaY : 0) * (t.deltaMode === WheelEvent.DOM_DELTA_LINE ? 32 : t.deltaMode === WheelEvent.DOM_DELTA_PAGE ? e.clientWidth : 1);
		if (!i) return;
		let a = e.scrollWidth - e.clientWidth, o = Math.min(a, Math.max(0, e.scrollLeft + i));
		Math.abs(o - e.scrollLeft) < 1 || (t.preventDefault(), e.scrollLeft = o);
	}, { passive: !1 }), e.addEventListener("scroll", i, { passive: !0 }), window.ResizeObserver) {
		let t = new ResizeObserver(i);
		t.observe(e), Array.from(e.children).forEach((e) => t.observe(e)), e.__bemkeHistoryScrollbarResizeObserver = t;
	}
	return window.requestAnimationFrame(i), i;
}
function j(t, n) {
	let r = t.parentElement;
	if (!r) return () => {};
	let i = r.classList.contains(_) ? r : null;
	i || (i = document.createElement("div"), i.className = _, r.insertBefore(i, t), i.appendChild(t));
	let a = document.createElement("div"), o = document.createElement("div"), s = document.createElement("div");
	a.className = v, a.hidden = !0, a.tabIndex = 0, a.setAttribute("role", "scrollbar"), a.setAttribute("aria-label", "Przewiń daty historii"), a.setAttribute("aria-controls", t.id), a.setAttribute("aria-orientation", "horizontal"), a.setAttribute("aria-valuemin", "0"), a.setAttribute("aria-valuemax", "100"), a.setAttribute("aria-valuenow", "0"), o.className = y, s.className = b, o.appendChild(s), a.appendChild(o), i.appendChild(a);
	let c = null, l = () => {
		let e = o.getBoundingClientRect(), n = Math.max(0, t.scrollWidth - t.clientWidth), r = Math.min(e.width, Math.max(w, e.width * (t.clientWidth / t.scrollWidth)));
		return {
			maxScrollLeft: n,
			maxThumbOffset: Math.max(0, e.width - r),
			thumbWidth: r,
			trackRect: e
		};
	}, u = (e, n) => {
		let r = l();
		!r.maxScrollLeft || !r.maxThumbOffset || (t.scrollLeft = Math.min(r.maxThumbOffset, Math.max(0, e - r.trackRect.left - n)) / r.maxThumbOffset * r.maxScrollLeft);
	}, d = (e) => {
		!c || e.pointerId !== c.id || (a.hasPointerCapture?.(e.pointerId) && a.releasePointerCapture(e.pointerId), c = null, a.classList.remove(x));
	};
	return a.addEventListener("pointerdown", (e) => {
		if (a.hidden || !e.isPrimary || e.pointerType === "mouse" && e.button !== 0) return;
		let t = l();
		if (!t.maxScrollLeft || !t.trackRect.width) return;
		let n = s.getBoundingClientRect(), r = e.target === s, i = r ? e.clientX - n.left : t.thumbWidth / 2;
		e.preventDefault(), a.focus({ preventScroll: !0 }), a.classList.add(x), c = {
			grabOffset: i,
			id: e.pointerId
		}, r || u(e.clientX, i);
		try {
			a.setPointerCapture(e.pointerId);
		} catch {}
	}), a.addEventListener("pointermove", (e) => {
		!c || e.pointerId !== c.id || (e.preventDefault(), u(e.clientX, c.grabOffset));
	}), a.addEventListener("pointerup", d), a.addEventListener("pointercancel", d), a.addEventListener("keydown", (n) => {
		let r = Math.max(0, t.scrollWidth - t.clientWidth), i = Math.max(48, t.clientWidth * .12), a = null;
		n.key === "ArrowLeft" ? a = t.scrollLeft - i : n.key === "ArrowRight" ? a = t.scrollLeft + i : n.key === "PageUp" ? a = t.scrollLeft - t.clientWidth * .8 : n.key === "PageDown" ? a = t.scrollLeft + t.clientWidth * .8 : n.key === "Home" ? a = 0 : n.key === "End" && (a = r), a !== null && (n.preventDefault(), t.scrollTo({
			behavior: e() ? "auto" : "smooth",
			left: Math.min(r, Math.max(0, a))
		}));
	}), () => {
		let e = n();
		if (a.hidden = !e, t.setAttribute("data-bemke-history-tabs-overflow", e ? "1" : "0"), !e) {
			a.setAttribute("aria-valuenow", "0"), a.removeAttribute("aria-valuetext");
			return;
		}
		let r = l();
		if (!r.trackRect.width || !r.maxScrollLeft) return;
		let i = Math.min(r.maxScrollLeft, Math.max(0, t.scrollLeft)) / r.maxScrollLeft, o = Math.round(i * 100);
		s.style.width = `${r.thumbWidth}px`, s.style.transform = `translate3d(${i * r.maxThumbOffset}px, 0, 0)`, a.setAttribute("aria-valuenow", String(o)), a.setAttribute("aria-valuetext", `Przewinięto ${o}%`);
	};
}
function M(e, t, n) {
	if (!t || e.scrollWidth <= e.clientWidth + 1) return;
	let r = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = 0;
	i.left < r.left ? a = i.left - r.left : i.right > r.right && (a = i.right - r.right), a && e.scrollBy({
		behavior: n ? "auto" : "smooth",
		left: a
	});
}
function N(e, t, n) {
	if (!e || !t.length) return null;
	let r = e.querySelector(`:scope > .${p}`);
	if (r) return t.forEach((e) => r.appendChild(e)), r;
	let i = document.createElement("div");
	return i.className = `${p} ${p}--${n}`, e.insertBefore(i, t[0]), t.forEach((e) => i.appendChild(e)), i;
}
function P(t, n, r, i, a, o) {
	if (!t || !n.length) return;
	let s = n.filter((e) => Z(e) === r), c = n.filter((e) => Z(e) === i), l = e();
	if (o || l || r === i || !s.length || !c.length) {
		F(t, n, i, !0);
		return;
	}
	let u = I(t), d = a > 0, p = ie(d ? [...s, ...c] : [...c, ...s]);
	n.forEach((e) => {
		let t = c.includes(e);
		e.hidden = !p.includes(e), e.classList.toggle(f, t), e.setAttribute("aria-hidden", t ? "false" : "true");
	}), p.forEach((e) => t.appendChild(e)), L(t, +!d, !0), t.offsetHeight, window.requestAnimationFrame(() => {
		t.__bemkeHistoryTransitionId === u && L(t, +!!d, !1);
	});
}
function F(e, t, n, r) {
	if (!e || !t.length) return;
	let i = I(e), a = t.filter((e) => Z(e) === n), o = t.filter((e) => Z(e) !== n);
	[...a, ...o].forEach((t) => e.appendChild(t)), t.forEach((e) => {
		let t = a.includes(e);
		e.hidden = !t, e.classList.toggle(f, t), e.setAttribute("aria-hidden", t ? "false" : "true");
	}), L(e, 0, r), r && (e.offsetHeight, window.requestAnimationFrame(() => {
		e.__bemkeHistoryTransitionId === i && e.classList.remove(m);
	}));
}
function I(e) {
	return e.__bemkeHistoryTransitionId = (e.__bemkeHistoryTransitionId || 0) + 1, e.__bemkeHistoryTransitionId;
}
function L(e, t, n) {
	e.classList.toggle(m, n), e.style.transform = `translate3d(${-100 * t}%, 0, 0)`;
}
function R(e) {
	e.forEach((e) => {
		e.hidden = !1, e.classList.remove("is-entering", "is-leaving", "is-immediate", f), e.style.removeProperty("inset"), e.style.removeProperty("opacity"), e.style.removeProperty("pointer-events"), e.style.removeProperty("position"), e.style.removeProperty("transform"), e.style.removeProperty("transition"), e.style.removeProperty("width"), e.style.removeProperty("--history-enter-x"), e.style.removeProperty("--history-exit-x");
	});
}
function z(e) {
	return e.closest(".brx-grid") || e.closest(".brxe-block")?.parentElement || e.parentElement;
}
function B(e, t, n, r, i, a) {
	e.id ||= `bemke-history-tablist-${a}`, e.setAttribute("role", "tablist"), e.setAttribute("aria-orientation", "horizontal"), e.parentElement?.classList.add(g), t.forEach((e) => {
		let t = Z(e);
		if (!(t && i.includes(t))) return;
		let o = r.get(t)?.[0], s = e.id || `bemke-history-tab-${a}-${t}`;
		e.id = s, e.setAttribute("role", "tab"), e.setAttribute("tabindex", "-1"), e.setAttribute("aria-selected", "false"), o && (o.id ||= `bemke-history-panel-${a}-${t}`, e.setAttribute("aria-controls", o.id), o.setAttribute("aria-labelledby", s)), n.get(t)?.forEach((t) => {
			t !== e && t.setAttribute("aria-hidden", "true");
		});
	});
}
function V(e, t, n) {
	e.forEach((e) => {
		let t = Z(e);
		e.id ||= `bemke-history-panel-${n}-${t}`, e.setAttribute("role", "tabpanel"), e.setAttribute("aria-hidden", "true");
	}), t.forEach((e) => {
		e.setAttribute("aria-hidden", "true"), e.setAttribute("draggable", "false"), e.draggable = !1;
	});
}
function H(e, t) {
	e.forEach((e) => {
		let n = Z(e) === t;
		e.classList.toggle(d, n), e.setAttribute("aria-selected", n ? "true" : "false"), e.setAttribute("tabindex", n ? "0" : "-1");
	});
}
function U(e, t, n, r) {
	W(e, t, "--history-slide-height"), W(n, r, "--history-img-height");
}
function W(e, t, n) {
	if (!e || !t.length) return;
	let r = 0;
	t.forEach((t) => {
		let n = t.hidden, i = t.style.position, a = t.style.visibility, o = t.style.opacity, s = t.style.transform, c = t.style.width;
		t.hidden = !1, t.style.position = "relative", t.style.visibility = "hidden", t.style.opacity = "1", t.style.transform = "none", t.style.width = `${e.getBoundingClientRect().width}px`;
		let l = t.getBoundingClientRect();
		r = Math.max(r, l.height, t.scrollHeight, G(t, e)), t.hidden = n, t.style.position = i, t.style.visibility = a, t.style.opacity = o, t.style.transform = s, t.style.width = c;
	}), r > 0 && e.style.setProperty(n, `${Math.ceil(r)}px`);
}
function G(e, t) {
	if (!(e instanceof HTMLImageElement)) return 0;
	let n = Number(e.getAttribute("width")), r = Number(e.getAttribute("height")), i = t.getBoundingClientRect().width;
	return !n || !r || !i ? 0 : i * r / n;
}
function K(e) {
	e.forEach((e) => {
		e.setAttribute("loading", "eager"), e.setAttribute("decoding", "async"), e.setAttribute("draggable", "false"), e.draggable = !1, q(e);
	});
}
function q(e) {
	let t = e.currentSrc || e.getAttribute("src") || e.src;
	if (!t || e.complete && e.naturalWidth > 0) return;
	typeof e.decode == "function" && e.decode().catch(() => {});
	let n = new Image(), r = e.getAttribute("srcset"), i = e.getAttribute("sizes");
	r && (n.srcset = r), i && (n.sizes = i), n.decoding = "async", n.onload = () => E.delete(n), n.onerror = () => E.delete(n), E.add(n), n.src = t;
}
function J(e, t) {
	let n = Z(e.find((e) => e.classList.contains(d)));
	return n && t.includes(n) ? n : t[0];
}
function Y(e, t, n) {
	let r = n.indexOf(t);
	return r < 0 ? null : e.key === "ArrowLeft" ? n[Q(r - 1, n.length)] : e.key === "ArrowRight" ? n[Q(r + 1, n.length)] : e.key === "Home" ? n[0] : e.key === "End" ? n[n.length - 1] : null;
}
function ne(e, t, n) {
	let r = n.indexOf(e), i = n.indexOf(t);
	return r < 0 || i < 0 || r === i || i > r ? 1 : -1;
}
function re(e) {
	!e || document.activeElement === e || e.focus({ preventScroll: !0 });
}
function X(e) {
	return e.reduce((e, t) => {
		let n = Z(t);
		if (!n) return e;
		let r = e.get(n) || [];
		return r.push(t), e.set(n, r), e;
	}, /* @__PURE__ */ new Map());
}
function ie(e) {
	return e.filter((e, t, n) => n.indexOf(e) === t);
}
function Z(e) {
	return e?.getAttribute("tab-number") || e?.getAttribute("data-tab-number") || "";
}
function Q(e, t) {
	return (e + t) % t;
}
function $(e, t) {
	let n;
	return (...r) => {
		window.clearTimeout(n), n = window.setTimeout(() => e(...r), t);
	};
}
//#endregion
export { D as initHistoryTabs };
