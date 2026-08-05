import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-BlCrb88B.js";
import { t as r } from "./ScrollTrigger-BDm4Kmox.js";
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
function d() {
	let c = n.utils.toArray(i), d = [];
	c.length && (n.registerPlugin(r), c.forEach((t) => {
		let i = u(t);
		if (!i) return;
		let { decimalPlaces: c, decimalSeparator: f, finalText: p, prefix: m, suffix: h, target: g } = i;
		t.setAttribute("aria-label", p);
		let _ = {
			counter: t,
			finalText: p,
			tweenTarget: null
		};
		if (d.push(_), e() || g === 0) return;
		let v = { value: 0 };
		_.tweenTarget = v, t.textContent = `${m}${l(0, c, f)}${h}`, r.create({
			trigger: t,
			start: a,
			once: !0,
			onEnter: () => {
				if (e()) {
					t.textContent = p;
					return;
				}
				n.to(v, {
					value: g,
					duration: o,
					ease: s,
					snap: { value: 1 / 10 ** c },
					overwrite: !0,
					onUpdate: () => {
						t.textContent = `${m}${l(v.value, c, f)}${h}`;
					},
					onComplete: () => {
						t.textContent = p;
					}
				});
			}
		});
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && d.forEach(({ counter: e, finalText: t, tweenTarget: r }) => {
			r && n.killTweensOf(r), e.textContent = t;
		});
	}));
}
//#endregion
export { d as initNumberCounters };
