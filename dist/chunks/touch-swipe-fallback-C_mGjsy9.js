//#region src/js/modules/slider-controls.js
var e = ".arrow, .yellow-arrow, .play-btn, .arrow-right";
function t(t, n, s = e) {
	let c = t.querySelector(n), l = c ? Array.from(c.querySelectorAll(s)) : [];
	if (!(l.length >= 4 || l.some(i) || l.some(r))) return {
		pause: null,
		play: null,
		prev: l.find(a) ?? l[0] ?? null,
		next: l.find(o) ?? l[1] ?? null
	};
	let u = l.find(r), d = l.find(i), f = u ?? (l.length >= 4 ? l.find((e, t) => t === 0 && e !== d) ?? null : null), p = d ?? (l.length >= 4 ? l.find((e, t) => t === 1 && e !== f) ?? null : null), m = l.find((e) => e !== f && e !== p && o(e)) ?? l[3] ?? null;
	return {
		pause: f,
		play: p,
		prev: l.find((e) => e !== f && e !== p && e !== m && a(e)) ?? l.find((e, t) => t >= 2 && e !== f && e !== p && e !== m) ?? null,
		next: m
	};
}
function n(e, { label: t, controlsId: n, handler: r }) {
	!e || typeof r != "function" || (e.classList.remove("bricks-lazy-hidden"), e.setAttribute("role", "button"), e.setAttribute("tabindex", "0"), e.setAttribute("aria-label", t), n && e.setAttribute("aria-controls", n), e.querySelectorAll("svg").forEach((e) => {
		e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
	}), e.addEventListener("click", (e) => {
		e.preventDefault(), r();
	}), e.addEventListener("keydown", (e) => {
		e.key !== "Enter" && e.key !== " " || (e.preventDefault(), r());
	}));
}
function r(e) {
	return e.classList.contains("pause-btn") || e.classList.contains("stop-btn") || s(e, [
		"pause",
		"pauza",
		"stop",
		"zatrzymaj"
	]);
}
function i(e) {
	return e.classList.contains("play-btn") || s(e, [
		"play",
		"start",
		"uruchom",
		"wznów",
		"wznow"
	]);
}
function a(e) {
	return e.classList.contains("arrow-left") || s(e, [
		"prev",
		"previous",
		"poprzedni",
		"lewo",
		"left"
	]);
}
function o(e) {
	return e.classList.contains("arrow-right") || s(e, [
		"next",
		"nastepny",
		"następny",
		"prawo",
		"right"
	]);
}
function s(e, t) {
	let n = c(e);
	return t.some((e) => n.includes(e));
}
function c(e) {
	return [
		typeof e.className == "string" ? e.className : "",
		e.getAttribute("aria-label"),
		e.getAttribute("title"),
		e.getAttribute("data-bemke-control"),
		e.textContent
	].filter(Boolean).join(" ").toLowerCase();
}
//#endregion
//#region src/js/modules/touch-swipe-fallback.js
var l = 8, u = 500;
function d(e, { canStart: t, onCancel: n, onMove: r, onStart: i, onSwipe: a, threshold: o = 46 } = {}) {
	if (!e) return { markPointerHandled() {} };
	let s = -Infinity, c = null;
	return e.addEventListener("touchstart", (e) => {
		if (c || e.touches.length !== 1 || t?.() === !1) return;
		let n = e.touches[0];
		c = {
			context: i?.(e) ?? null,
			identifier: n.identifier,
			lastX: n.clientX,
			lastY: n.clientY,
			lockedAxis: null,
			moved: !1,
			startX: n.clientX,
			startY: n.clientY
		};
	}, { passive: !0 }), e.addEventListener("touchmove", (e) => {
		if (!c) return;
		let t = f(e.touches, c.identifier);
		if (!t) return;
		c.lastX = t.clientX, c.lastY = t.clientY;
		let n = t.clientX - c.startX, i = t.clientY - c.startY, a = Math.abs(n), o = Math.abs(i);
		!c.lockedAxis && (a > l || o > l) && (c.lockedAxis = a > o ? "x" : "y"), c.lockedAxis === "x" && (e.cancelable && e.preventDefault(), c.moved = !0, r?.({
			context: c.context,
			dx: n,
			dy: i,
			event: e
		}));
	}, { passive: !1 }), e.addEventListener("touchend", (e) => {
		if (!c) return;
		let t = f(e.changedTouches, c.identifier) ?? {
			clientX: c.lastX,
			clientY: c.lastY
		}, r = c, i = t.clientX - r.startX, l = t.clientY - r.startY, d = performance.now() - s < u;
		if (c = null, !d) {
			if (r.moved && Math.abs(i) > o && Math.abs(i) > Math.abs(l)) {
				a?.({
					context: r.context,
					direction: i < 0 ? 1 : -1,
					dx: i,
					dy: l,
					event: e
				});
				return;
			}
			n?.({
				context: r.context,
				dx: i,
				dy: l,
				event: e
			});
		}
	}, { passive: !0 }), e.addEventListener("touchcancel", (e) => {
		if (!c) return;
		let t = c;
		c = null, performance.now() - s >= u && n?.({
			context: t.context,
			dx: 0,
			dy: 0,
			event: e
		});
	}, { passive: !0 }), { markPointerHandled: () => {
		s = performance.now();
	} };
}
function f(e, t) {
	return Array.from(e ?? []).find((e) => e.identifier === t);
}
//#endregion
export { t as i, e as n, n as r, d as t };
