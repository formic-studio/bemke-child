import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-CjUXhbIO.js";
import { t as r } from "./ScrollTrigger-DW7wmIBN.js";
//#region src/js/modules/number-counter.js
var i = ".number-counter", a = "top 98%", o = 1.8, s = "power2.out";
function c(e) {
	let t = e.replace(/\s/g, ""), n = t.lastIndexOf(","), r = t.lastIndexOf("."), i = Math.max(n, r), a = i >= 0 ? t.length - i - 1 : 0, o = i >= 0 && a > 0 && (n >= 0 && r >= 0 || a <= 2) ? t[i] : null, s = o ? a : 0, c = o ? `${t.slice(0, i).replace(/[.,]/g, "")}.${t.slice(i + 1).replace(/[.,]/g, "")}` : t.replace(/[.,]/g, ""), l = Number.parseFloat(c);
	return Number.isFinite(l) ? {
		decimalPlaces: s,
		decimalSeparator: o,
		target: l
	} : null;
}
function l(e, t, n) {
	return t ? e.toFixed(t).replace(".", n) : String(Math.round(e));
}
function u(e) {
	let t = e.textContent.trim(), n = t.match(/-?\d(?:[\s.,]*\d)*/);
	if (!n) return null;
	let r = c(n[0]);
	if (!r) return null;
	let i = n.index ?? 0;
	return {
		...r,
		finalText: t,
		prefix: t.slice(0, i),
		suffix: t.slice(i + n[0].length)
	};
}
function d(e, t) {
	let n = document.createElement("span"), r = document.createElement("span");
	return n.className = "bemke-sr-only", n.textContent = t, r.className = "bemke-number-counter__visual", r.setAttribute("aria-hidden", "true"), r.textContent = t, e.removeAttribute("aria-label"), e.replaceChildren(n, r), r;
}
function f() {
	let c = n.utils.toArray(i), f = [];
	c.length && (n.registerPlugin(r), c.forEach((t) => {
		let i = u(t);
		if (!i) return;
		let { decimalPlaces: c, decimalSeparator: p, finalText: m, prefix: h, suffix: g, target: _ } = i, v = d(t, m), y = {
			counter: t,
			finalText: m,
			tweenTarget: null,
			visualCounter: v
		};
		if (f.push(y), e() || _ === 0) return;
		let b = { value: 0 };
		y.tweenTarget = b, v.textContent = `${h}${l(0, c, p)}${g}`, r.create({
			trigger: t,
			start: a,
			once: !0,
			onEnter: () => {
				if (e()) {
					v.textContent = m;
					return;
				}
				n.to(b, {
					value: _,
					duration: o,
					ease: s,
					snap: { value: 1 / 10 ** c },
					overwrite: !0,
					onUpdate: () => {
						v.textContent = `${h}${l(b.value, c, p)}${g}`;
					},
					onComplete: () => {
						v.textContent = m;
					}
				});
			}
		});
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && f.forEach(({ finalText: e, tweenTarget: t, visualCounter: r }) => {
			t && n.killTweensOf(t), r.textContent = e;
		});
	}));
}
//#endregion
export { f as initNumberCounters };
