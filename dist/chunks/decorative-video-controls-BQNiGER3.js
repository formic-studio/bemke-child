import { r as e, t } from "./motion-preference-Bn10ge8D.js";
//#region src/js/modules/decorative-video-controls.js
var n = ".video", r = "video", i = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new Set(), o = 150, s = 800, c = "high", l = "(max-width: 767px)", u = [
	"pointerdown",
	"touchstart",
	"keydown"
], d = window.matchMedia(l), f = null, p = null, m = !1;
function h(e) {
	if (i.has(e)) return i.get(e);
	let t = {
		autoplay: e.dataset.bemkeAutoplay === "true" || e.autoplay || e.hasAttribute("autoplay"),
		loop: e.loop || e.hasAttribute("loop"),
		wasPlaying: !1
	};
	return i.set(e, t), t;
}
function g(e, t) {
	let n = h(e);
	if (t) {
		n.wasPlaying = n.wasPlaying || !e.paused, e.pause(), e.autoplay = !1, e.loop = !1, e.removeAttribute("autoplay"), e.removeAttribute("loop");
		return;
	}
	if (e.autoplay = n.autoplay, e.loop = n.loop, n.autoplay && e.setAttribute("autoplay", ""), n.loop && e.setAttribute("loop", ""), n.wasPlaying || n.autoplay) {
		if (e.dataset.bemkeSrc) return;
		e.play()?.catch?.(() => {});
	}
	n.wasPlaying = !1;
}
function _(t) {
	let n = t.dataset.bemkeSrc;
	if (!n || e()) return !1;
	let r = h(t);
	return t.preload = t.dataset.bemkePriority === c ? "auto" : "metadata", t.src = n, delete t.dataset.bemkeSrc, t.loop = r.loop, t.autoplay = r.autoplay, t.load(), r.autoplay && t.play()?.catch?.(() => {}), !0;
}
function v() {
	e() || a.forEach((e) => {
		e.dataset.bemkePriority === c && _(e);
	});
}
function y() {
	e() || a.forEach((e) => {
		_(e);
	});
}
function b() {
	f !== null || p !== null || e() || !Array.from(a).some((e) => e.dataset.bemkeSrc) || (f = window.setTimeout(() => {
		if (f = null, !e()) {
			if (typeof window.requestIdleCallback == "function") {
				p = window.requestIdleCallback(() => {
					p = null, y();
				}, { timeout: s });
				return;
			}
			y();
		}
	}, o));
}
function x() {
	f !== null && (window.clearTimeout(f), f = null), p !== null && typeof window.cancelIdleCallback == "function" && (window.cancelIdleCallback(p), p = null);
}
function S() {
	let e = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
	return e?.saveData || e?.effectiveType === "slow-2g" || e?.effectiveType === "2g";
}
function C() {
	m && (m = !1, u.forEach((e) => {
		window.removeEventListener(e, w);
	}));
}
function w() {
	C(), !(!d.matches || e() || S()) && (v(), b());
}
function T() {
	m || e() || S() || !Array.from(a).some((e) => e.dataset.bemkeSrc) || (m = !0, u.forEach((e) => {
		window.addEventListener(e, w, {
			once: !0,
			passive: !0
		});
	}));
}
function E() {
	if (d.matches) {
		x(), T();
		return;
	}
	C(), v(), b();
}
function D() {
	return Array.from(document.querySelectorAll(n));
}
function O(t) {
	let n = Array.from(t.querySelectorAll(r));
	n.length && (t.setAttribute("aria-hidden", "true"), n.forEach((t) => {
		a.add(t), h(t), t.removeAttribute("onclick"), t.onclick = null, t.removeAttribute("controls"), t.controls = !1, t.setAttribute("aria-hidden", "true"), t.setAttribute("tabindex", "-1"), t.setAttribute("focusable", "false"), t.style.pointerEvents = "none", e() && g(t, !0);
	}));
}
function k() {
	D().forEach(O), E(), document.addEventListener(t, (e) => {
		let t = !!e.detail?.reduced;
		if (a.forEach((e) => {
			g(e, t);
		}), t) {
			x(), C();
			return;
		}
		E();
	}), d.addEventListener("change", () => {
		E();
	});
}
//#endregion
export { k as initDecorativeVideoControls };
