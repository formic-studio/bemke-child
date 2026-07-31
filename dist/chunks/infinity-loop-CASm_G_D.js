import { r as e, t } from "./motion-preference-Bn10ge8D.js";
//#region src/js/modules/infinity-loop.js
var n = ".infinity-loop-block", r = ".img-wrapper", i = "bemke-infinity-loop-track", a = "data-bemke-infinity-loop-ready", o = "data-bemke-loop-clone", s = "__bemkeInfinityLoopBooted", c = 50, l = 18, u = 72, d = null;
function f(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function p(e, t = 120) {
	window.clearTimeout(d), d = window.setTimeout(e, t);
}
function m(e) {
	e.removeAttribute("id"), e.querySelectorAll("[id]").forEach((e) => {
		e.removeAttribute("id");
	});
}
function h(e) {
	let t = e.querySelector(`:scope > .${i}`);
	if (t) return t;
	let n = Array.from(e.children).filter((e) => e.matches(r));
	return n.length ? (t = document.createElement("div"), t.className = i, e.insertBefore(t, n[0]), n.forEach((e) => {
		t.appendChild(e);
	}), t) : null;
}
function g(e, t) {
	Array.from(e.children).filter((e) => e !== t && e.matches(r)).forEach((e) => {
		t.appendChild(e);
	});
}
function _(e) {
	return Array.from(e.children).filter((e) => e.matches(r) && e.getAttribute(o) !== "1");
}
function v(e) {
	e.querySelectorAll(`[${o}="1"]`).forEach((e) => {
		e.remove();
	});
}
function y(e) {
	let t = e.cloneNode(!0);
	return t.setAttribute(o, "1"), t.setAttribute("aria-hidden", "true"), m(t), t.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach((e) => {
		e.setAttribute("tabindex", "-1");
	}), t;
}
function b(e) {
	if (!e.length) return 0;
	let t = e[0].getBoundingClientRect(), n = e[e.length - 1].getBoundingClientRect();
	return Math.ceil(n.right - t.left);
}
function x(e, t) {
	if (!e || !t) return 0;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	return Math.ceil(r.left - n.left);
}
function S(t) {
	let n = h(t);
	if (!n) return;
	g(t, n), v(n);
	let r = _(n);
	if (!r.length) return;
	if (t.setAttribute(a, "1"), r.forEach((e) => {
		e.removeAttribute("aria-hidden");
	}), r.length < 2) {
		n.style.animation = "none";
		return;
	}
	if (e()) {
		n.style.animation = "none", n.style.transform = "none";
		return;
	}
	n.style.animation = "none", n.style.transform = "", n.offsetHeight;
	let i = b(r), o = t.getBoundingClientRect().width;
	if (!i || !o) return;
	let s = null;
	r.forEach((e, t) => {
		let r = y(e);
		t === 0 && (s = r), n.appendChild(r);
	});
	let d = x(r[0], s);
	if (!d) return;
	let p = Math.max(0, Math.ceil((o + d) / d) - 1);
	for (let e = 0; e < p; e += 1) r.forEach((e) => {
		n.appendChild(y(e));
	});
	let m = f(d / c, l, u);
	t.style.setProperty("--bemke-loop-distance", `${d}px`), t.style.setProperty("--bemke-loop-duration", `${m}s`), n.offsetHeight, n.style.animation = "";
}
function C() {
	document.querySelectorAll(n).forEach((e) => {
		S(e);
	});
}
function w(e) {
	e.querySelectorAll("img").forEach((t) => {
		t.complete || t.addEventListener("load", () => {
			S(e);
		}, { once: !0 });
	});
}
function T(e) {
	S(e), w(e);
}
function E(e) {
	let t = !1;
	for (let r of e) {
		for (let e of r.addedNodes) if (e instanceof Element && !(e.getAttribute(o) === "1" || e.closest(`[${o}="1"]`)) && (e.matches(n) || e.querySelector(n) || e.closest(n))) {
			t = !0;
			break;
		}
		if (t) break;
	}
	t && p(C);
}
function D() {
	document.querySelectorAll(n).forEach(T), !window[s] && (window[s] = !0, window.addEventListener("load", () => {
		p(C, 60);
	}), window.addEventListener("resize", () => {
		p(C, 160);
	}), document.addEventListener("bricks/ajax/end", () => {
		p(C, 80);
	}), document.addEventListener(t, () => {
		p(C, 0);
	}), window.MutationObserver && document.body && new MutationObserver(E).observe(document.body, {
		childList: !0,
		subtree: !0
	}));
}
//#endregion
export { D as initInfinityLoop };
