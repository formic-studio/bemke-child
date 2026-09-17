import { t as e } from "./semantic-button-VnITRaDl.js";
//#region src/js/modules/slider-controls.js
var t = ".arrow, .yellow-arrow, .play-btn, .arrow-right";
function n(e) {
	return !!(e?.altKey || e?.ctrlKey || e?.metaKey || e?.shiftKey);
}
function r(n, r, i = t) {
	let l = n.querySelector(r), u = l ? Array.from(l.querySelectorAll(i)).map(e).filter(Boolean) : [];
	if (!(u.length >= 4 || u.some(o) || u.some(a))) return {
		pause: null,
		play: null,
		prev: u.find(s) ?? u[0] ?? null,
		next: u.find(c) ?? u[1] ?? null
	};
	let d = u.find(a), f = u.find(o), p = d ?? (u.length >= 4 ? u.find((e, t) => t === 0 && e !== f) ?? null : null), m = f ?? (u.length >= 4 ? u.find((e, t) => t === 1 && e !== p) ?? null : null), h = u.find((e) => e !== p && e !== m && c(e)) ?? u[3] ?? null;
	return {
		pause: p,
		play: m,
		prev: u.find((e) => e !== p && e !== m && e !== h && s(e)) ?? u.find((e, t) => t >= 2 && e !== p && e !== m && e !== h) ?? null,
		next: h
	};
}
function i(e, { label: t, controlsId: n, handler: r }) {
	!e || typeof r != "function" || (e.classList.remove("bricks-lazy-hidden"), e.setAttribute("aria-label", t), n && e.setAttribute("aria-controls", n), e.querySelectorAll("svg").forEach((e) => {
		e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
	}), e.addEventListener("click", (t) => {
		t.preventDefault(), e.getAttribute("aria-disabled") !== "true" && r();
	}));
}
function a(e) {
	return e.classList.contains("pause-btn") || e.classList.contains("stop-btn") || l(e, [
		"pause",
		"pauza",
		"stop",
		"zatrzymaj"
	]);
}
function o(e) {
	return e.classList.contains("play-btn") || l(e, [
		"play",
		"start",
		"uruchom",
		"wznów",
		"wznow"
	]);
}
function s(e) {
	return e.classList.contains("arrow-left") || l(e, [
		"prev",
		"previous",
		"poprzedni",
		"lewo",
		"left"
	]);
}
function c(e) {
	return e.classList.contains("arrow-right") || l(e, [
		"next",
		"nastepny",
		"następny",
		"prawo",
		"right"
	]);
}
function l(e, t) {
	let n = u(e);
	return t.some((e) => n.includes(e));
}
function u(e) {
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
var d = 8, f = 500;
function p(e, { canStart: t, onCancel: n, onMove: r, onStart: i, onSwipe: a, threshold: o = 46 } = {}) {
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
		let t = m(e.touches, c.identifier);
		if (!t) return;
		c.lastX = t.clientX, c.lastY = t.clientY;
		let n = t.clientX - c.startX, i = t.clientY - c.startY, a = Math.abs(n), o = Math.abs(i);
		!c.lockedAxis && (a > d || o > d) && (c.lockedAxis = a > o ? "x" : "y"), c.lockedAxis === "x" && (e.cancelable && e.preventDefault(), c.moved = !0, r?.({
			context: c.context,
			dx: n,
			dy: i,
			event: e
		}));
	}, { passive: !1 }), e.addEventListener("touchend", (e) => {
		if (!c) return;
		let t = m(e.changedTouches, c.identifier) ?? {
			clientX: c.lastX,
			clientY: c.lastY
		}, r = c, i = t.clientX - r.startX, l = t.clientY - r.startY, u = performance.now() - s < f;
		if (c = null, !u) {
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
		c = null, performance.now() - s >= f && n?.({
			context: t.context,
			dx: 0,
			dy: 0,
			event: e
		});
	}, { passive: !0 }), { markPointerHandled: () => {
		s = performance.now();
	} };
}
function m(e, t) {
	return Array.from(e ?? []).find((e) => e.identifier === t);
}
//#endregion
export { n as a, r as i, t as n, i as r, p as t };
