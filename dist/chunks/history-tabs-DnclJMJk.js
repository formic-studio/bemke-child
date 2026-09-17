import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { n } from "./site-language-BMLr3i6q.js";
import { t as r } from "./semantic-button-jC5kvGhR.js";
//#region src/js/modules/history-tabs.js
var i = ".tabs-block", a = ".tab[tab-number], .tab[data-tab-number]", o = ".history-slide[tab-number], .history-slide[data-tab-number]", s = ".history-img[tab-number], .history-img[data-tab-number]", c = ".history-slide-wrapper", l = ".history-img-wrapper", u = "data-bemke-history-tabs-ready", d = "__bemkeHistoryTabsBooted", f = "tab-active", p = "is-active", m = "history-tabs-track", h = "is-immediate", g = "is-dragging", _ = "history-tabs-content", v = "history-tabs-navigation", y = "history-tabs-scrollbar", b = "history-tabs-scrollbar__track", x = "history-tabs-scrollbar__thumb", S = "is-dragging", ee = 980, C = 6, w = 48, T = 0, E = /* @__PURE__ */ new Set();
function D() {
	O(), te();
}
function O(e = document) {
	e.querySelectorAll(i).forEach((e) => {
		let t = R(e);
		if (t) {
			if (t.getAttribute(u) === "1") {
				t.__bemkeHistoryTabsRefresh?.();
				return;
			}
			ne(t, e);
		}
	});
}
function te() {
	if (window[d]) return;
	window[d] = !0;
	let e = $(() => {
		O();
	}, 90);
	window.addEventListener("load", e), document.addEventListener("bricks/ajax/end", e), window.setTimeout(e, 200), window.setTimeout(e, 800), !(!window.MutationObserver || !document.body) && new MutationObserver((t) => {
		for (let n of t) for (let t of n.addedNodes) if (t instanceof Element && (t.matches(i) || t.querySelector(i))) {
			e();
			return;
		}
	}).observe(document.body, {
		childList: !0,
		subtree: !0
	});
}
function ne(n, r) {
	let i = n.querySelector(c), d = n.querySelector(l), f = Array.from(r.querySelectorAll(a)).map(re).filter(Boolean), p = i ? Array.from(i.querySelectorAll(o)) : [], m = d ? Array.from(d.querySelectorAll(s)) : [];
	if (!f.length || !p.length && !m.length) return;
	let h = X(f), g = X(p), _ = X(m), v = f.map(Z).filter((e, t, n) => !e || n.indexOf(e) !== t ? !1 : g.has(e) || _.has(e));
	if (!v.length) return;
	T += 1;
	let y = M(i, p, "slides"), b = M(d, m, "images"), x = q(f, v), S = null;
	G(m), L(p), L(m), z(r, f, h, g, v, T), B(p, m, T);
	let C = k(r);
	H(i, p, d, m), n.setAttribute(u, "1"), E(x, 1, !0), f.forEach((e) => {
		let t = Z(e);
		if (!t || !v.includes(t)) {
			e.setAttribute("aria-disabled", "true");
			return;
		}
		e.addEventListener("click", () => {
			w(t);
		}), e.addEventListener("keydown", (e) => {
			let n = J(e, t, v);
			n && (e.preventDefault(), ie(h.get(n)?.[0]), w(n));
		});
	}), window.addEventListener("resize", $(() => {
		H(i, p, d, m), E(x, 1, !0), C();
	}, 120)), n.__bemkeHistoryTabsRefresh = () => {
		H(i, p, d, m), E(x, 1, !0), C();
	}, document.addEventListener(t, (e) => {
		e.detail?.reduced && E(x, 1, !0);
	});
	function w(e) {
		if (e === x) return;
		let t = x, n = Y(t, e, v);
		x = e, E(e, n, !1, t);
	}
	function E(t, n, i, a = t) {
		window.clearTimeout(S), V(f, t), j(r, h.get(t)?.[0], i || e()), N(y, p, a, t, n, i), N(b, m, a, t, n, i), !(i || e()) && (S = window.setTimeout(() => {
			P(y, p, t, !0), P(b, m, t, !0);
		}, ee + 80));
	}
}
function re(e) {
	let t = r(e);
	return Array.from(t?.children ?? []).forEach((e) => {
		if (e.tagName !== "DIV") return;
		let t = document.createElement("span");
		Array.from(e.attributes).forEach(({ name: e, value: n }) => {
			t.setAttribute(e, n);
		}), t.append(...Array.from(e.childNodes)), e.replaceWith(t);
	}), t;
}
function k(e) {
	let t = null, n = 0, r = () => e.scrollWidth > e.clientWidth + 1, i = A(e, r), a = (r) => {
		if (!t || r.pointerId !== t.id) return;
		let i = t.dragged;
		e.hasPointerCapture?.(r.pointerId) && e.releasePointerCapture(r.pointerId), t = null, e.classList.remove(g), i && (n = Date.now() + 300);
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
			if (n.preventDefault(), t.dragged = !0, e.classList.add(g), !e.hasPointerCapture(n.pointerId)) try {
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
function A(t, r) {
	let i = t.parentElement;
	if (!i) return () => {};
	let a = i.classList.contains(v) ? i : null;
	a || (a = document.createElement("div"), a.className = v, i.insertBefore(a, t), a.appendChild(t));
	let o = document.createElement("div"), s = document.createElement("div"), c = document.createElement("div");
	o.className = y, o.hidden = !0, o.tabIndex = 0, o.setAttribute("role", "scrollbar"), o.setAttribute("aria-label", n("Przewiń daty historii", "Scroll through history dates")), o.setAttribute("aria-controls", t.id), o.setAttribute("aria-orientation", "horizontal"), o.setAttribute("aria-valuemin", "0"), o.setAttribute("aria-valuemax", "100"), o.setAttribute("aria-valuenow", "0"), s.className = b, c.className = x, s.appendChild(c), o.appendChild(s), a.appendChild(o);
	let l = null, u = () => {
		let e = s.getBoundingClientRect(), n = Math.max(0, t.scrollWidth - t.clientWidth), r = Math.min(e.width, Math.max(w, e.width * (t.clientWidth / t.scrollWidth)));
		return {
			maxScrollLeft: n,
			maxThumbOffset: Math.max(0, e.width - r),
			thumbWidth: r,
			trackRect: e
		};
	}, d = (e, n) => {
		let r = u();
		!r.maxScrollLeft || !r.maxThumbOffset || (t.scrollLeft = Math.min(r.maxThumbOffset, Math.max(0, e - r.trackRect.left - n)) / r.maxThumbOffset * r.maxScrollLeft);
	}, f = (e) => {
		!l || e.pointerId !== l.id || (o.hasPointerCapture?.(e.pointerId) && o.releasePointerCapture(e.pointerId), l = null, o.classList.remove(S));
	};
	return o.addEventListener("pointerdown", (e) => {
		if (o.hidden || !e.isPrimary || e.pointerType === "mouse" && e.button !== 0) return;
		let t = u();
		if (!t.maxScrollLeft || !t.trackRect.width) return;
		let n = c.getBoundingClientRect(), r = e.target === c, i = r ? e.clientX - n.left : t.thumbWidth / 2;
		e.preventDefault(), o.focus({ preventScroll: !0 }), o.classList.add(S), l = {
			grabOffset: i,
			id: e.pointerId
		}, r || d(e.clientX, i);
		try {
			o.setPointerCapture(e.pointerId);
		} catch {}
	}), o.addEventListener("pointermove", (e) => {
		!l || e.pointerId !== l.id || (e.preventDefault(), d(e.clientX, l.grabOffset));
	}), o.addEventListener("pointerup", f), o.addEventListener("pointercancel", f), o.addEventListener("keydown", (n) => {
		let r = Math.max(0, t.scrollWidth - t.clientWidth), i = Math.max(48, t.clientWidth * .12), a = null;
		n.key === "ArrowLeft" ? a = t.scrollLeft - i : n.key === "ArrowRight" ? a = t.scrollLeft + i : n.key === "PageUp" ? a = t.scrollLeft - t.clientWidth * .8 : n.key === "PageDown" ? a = t.scrollLeft + t.clientWidth * .8 : n.key === "Home" ? a = 0 : n.key === "End" && (a = r), a !== null && (n.preventDefault(), t.scrollTo({
			behavior: e() ? "auto" : "smooth",
			left: Math.min(r, Math.max(0, a))
		}));
	}), () => {
		let e = r();
		if (o.hidden = !e, t.setAttribute("data-bemke-history-tabs-overflow", e ? "1" : "0"), !e) {
			o.setAttribute("aria-valuenow", "0"), o.removeAttribute("aria-valuetext");
			return;
		}
		let i = u();
		if (!i.trackRect.width || !i.maxScrollLeft) return;
		let a = Math.min(i.maxScrollLeft, Math.max(0, t.scrollLeft)) / i.maxScrollLeft, s = Math.round(a * 100);
		c.style.width = `${i.thumbWidth}px`, c.style.transform = `translate3d(${a * i.maxThumbOffset}px, 0, 0)`, o.setAttribute("aria-valuenow", String(s)), o.setAttribute("aria-valuetext", n(`Przewinięto ${s}%`, `Scrolled ${s}%`));
	};
}
function j(e, t, n) {
	if (!t || e.scrollWidth <= e.clientWidth + 1) return;
	let r = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = 0;
	i.left < r.left ? a = i.left - r.left : i.right > r.right && (a = i.right - r.right), a && e.scrollBy({
		behavior: n ? "auto" : "smooth",
		left: a
	});
}
function M(e, t, n) {
	if (!e || !t.length) return null;
	let r = e.querySelector(`:scope > .${m}`);
	if (r) return t.forEach((e) => r.appendChild(e)), r;
	let i = document.createElement("div");
	return i.className = `${m} ${m}--${n}`, e.insertBefore(i, t[0]), t.forEach((e) => i.appendChild(e)), i;
}
function N(t, n, r, i, a, o) {
	if (!t || !n.length) return;
	let s = n.filter((e) => Z(e) === r), c = n.filter((e) => Z(e) === i), l = e();
	if (o || l || r === i || !s.length || !c.length) {
		P(t, n, i, !0);
		return;
	}
	let u = F(t), d = a > 0, f = ae(d ? [...s, ...c] : [...c, ...s]);
	n.forEach((e) => {
		let t = c.includes(e);
		e.hidden = !f.includes(e), e.classList.toggle(p, t), e.setAttribute("aria-hidden", t ? "false" : "true");
	}), f.forEach((e) => t.appendChild(e)), I(t, +!d, !0), t.offsetHeight, window.requestAnimationFrame(() => {
		t.__bemkeHistoryTransitionId === u && I(t, +!!d, !1);
	});
}
function P(e, t, n, r) {
	if (!e || !t.length) return;
	let i = F(e), a = t.filter((e) => Z(e) === n), o = t.filter((e) => Z(e) !== n);
	[...a, ...o].forEach((t) => e.appendChild(t)), t.forEach((e) => {
		let t = a.includes(e);
		e.hidden = !t, e.classList.toggle(p, t), e.setAttribute("aria-hidden", t ? "false" : "true");
	}), I(e, 0, r), r && (e.offsetHeight, window.requestAnimationFrame(() => {
		e.__bemkeHistoryTransitionId === i && e.classList.remove(h);
	}));
}
function F(e) {
	return e.__bemkeHistoryTransitionId = (e.__bemkeHistoryTransitionId || 0) + 1, e.__bemkeHistoryTransitionId;
}
function I(e, t, n) {
	e.classList.toggle(h, n), e.style.transform = `translate3d(${-100 * t}%, 0, 0)`;
}
function L(e) {
	e.forEach((e) => {
		e.hidden = !1, e.classList.remove("is-entering", "is-leaving", "is-immediate", p), e.style.removeProperty("inset"), e.style.removeProperty("opacity"), e.style.removeProperty("pointer-events"), e.style.removeProperty("position"), e.style.removeProperty("transform"), e.style.removeProperty("transition"), e.style.removeProperty("width"), e.style.removeProperty("--history-enter-x"), e.style.removeProperty("--history-exit-x");
	});
}
function R(e) {
	return e.closest(".brx-grid") || e.closest(".brxe-block")?.parentElement || e.parentElement;
}
function z(e, t, n, r, i, a) {
	e.id ||= `bemke-history-tablist-${a}`, e.setAttribute("role", "tablist"), e.setAttribute("aria-orientation", "horizontal"), e.parentElement?.classList.add(_), t.forEach((e) => {
		let t = Z(e);
		if (!(t && i.includes(t))) return;
		let o = r.get(t)?.[0], s = e.id || `bemke-history-tab-${a}-${t}`;
		e.id = s, e.setAttribute("role", "tab"), e.setAttribute("tabindex", "-1"), e.setAttribute("aria-selected", "false"), o && (o.id ||= `bemke-history-panel-${a}-${t}`, e.setAttribute("aria-controls", o.id), o.setAttribute("aria-labelledby", s)), n.get(t)?.forEach((t) => {
			t !== e && t.setAttribute("aria-hidden", "true");
		});
	});
}
function B(e, t, n) {
	e.forEach((e) => {
		let t = Z(e);
		e.id ||= `bemke-history-panel-${n}-${t}`, e.setAttribute("role", "tabpanel"), e.setAttribute("aria-hidden", "true");
	}), t.forEach((e) => {
		e.setAttribute("aria-hidden", "true"), e.setAttribute("draggable", "false"), e.draggable = !1;
	});
}
function V(e, t) {
	e.forEach((e) => {
		let n = Z(e) === t;
		e.classList.toggle(f, n), e.setAttribute("aria-selected", n ? "true" : "false"), e.setAttribute("tabindex", n ? "0" : "-1");
	});
}
function H(e, t, n, r) {
	U(e, t, "--history-slide-height"), U(n, r, "--history-img-height");
}
function U(e, t, n) {
	if (!e || !t.length) return;
	let r = 0;
	t.forEach((t) => {
		let n = t.hidden, i = t.style.position, a = t.style.visibility, o = t.style.opacity, s = t.style.transform, c = t.style.width;
		t.hidden = !1, t.style.position = "relative", t.style.visibility = "hidden", t.style.opacity = "1", t.style.transform = "none", t.style.width = `${e.getBoundingClientRect().width}px`;
		let l = t.getBoundingClientRect();
		r = Math.max(r, l.height, t.scrollHeight, W(t, e)), t.hidden = n, t.style.position = i, t.style.visibility = a, t.style.opacity = o, t.style.transform = s, t.style.width = c;
	}), r > 0 && e.style.setProperty(n, `${Math.ceil(r)}px`);
}
function W(e, t) {
	if (!(e instanceof HTMLImageElement)) return 0;
	let n = Number(e.getAttribute("width")), r = Number(e.getAttribute("height")), i = t.getBoundingClientRect().width;
	return !n || !r || !i ? 0 : i * r / n;
}
function G(e) {
	e.forEach((e) => {
		e.setAttribute("loading", "eager"), e.setAttribute("decoding", "async"), e.setAttribute("draggable", "false"), e.draggable = !1, K(e);
	});
}
function K(e) {
	let t = e.currentSrc || e.getAttribute("src") || e.src;
	if (!t || e.complete && e.naturalWidth > 0) return;
	typeof e.decode == "function" && e.decode().catch(() => {});
	let n = new Image(), r = e.getAttribute("srcset"), i = e.getAttribute("sizes");
	r && (n.srcset = r), i && (n.sizes = i), n.decoding = "async", n.onload = () => E.delete(n), n.onerror = () => E.delete(n), E.add(n), n.src = t;
}
function q(e, t) {
	let n = Z(e.find((e) => e.classList.contains(f)));
	return n && t.includes(n) ? n : t[0];
}
function J(e, t, n) {
	let r = n.indexOf(t);
	return r < 0 ? null : e.key === "ArrowLeft" ? n[Q(r - 1, n.length)] : e.key === "ArrowRight" ? n[Q(r + 1, n.length)] : e.key === "Home" ? n[0] : e.key === "End" ? n[n.length - 1] : null;
}
function Y(e, t, n) {
	let r = n.indexOf(e), i = n.indexOf(t);
	return r < 0 || i < 0 || r === i || i > r ? 1 : -1;
}
function ie(e) {
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
function ae(e) {
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
