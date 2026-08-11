import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./font-size-controls-DUBBhJnJ.js";
import { t as r } from "./gsap-BlCrb88B.js";
import { t as i } from "./ScrollTrigger-BDm4Kmox.js";
//#region src/js/modules/sticky-images.js
var a = ".sticky-wrapper", o = ".sticky", s = ".brxe-section", c = "(min-width: 992px)";
function l() {
	let l = r.utils.toArray(a);
	if (!l.length) return;
	r.registerPlugin(i);
	let u = window.matchMedia(c), d = [], f = null, p = () => {
		d.forEach((e) => e.kill()), d = [];
	}, m = () => {
		d.length || !u.matches || e() || (d = l.flatMap((e) => {
			let t = e.querySelector(`:scope > ${o}`), n = e.closest(s)?.nextElementSibling;
			return !t || !n?.matches(s) ? [] : [i.create({
				trigger: e,
				start: "top top",
				endTrigger: n,
				end: "top top",
				pin: t,
				pinSpacing: !1,
				pinType: "fixed",
				anticipatePin: 1,
				invalidateOnRefresh: !0
			})];
		}), d.length && i.refresh());
	}, h = () => {
		if (e() || !u.matches) {
			p();
			return;
		}
		m();
	};
	h(), document.readyState !== "complete" && window.addEventListener("load", () => {
		d.length && i.refresh();
	}, { once: !0 }), document.addEventListener(t, h);
	let g = () => {
		p(), h();
	};
	document.addEventListener(n, () => {
		f !== null && window.cancelAnimationFrame(f), f = window.requestAnimationFrame(() => {
			f = window.requestAnimationFrame(() => {
				f = null, d.length ? i.refresh() : h();
			});
		});
	}), typeof u.addEventListener == "function" ? u.addEventListener("change", g) : typeof u.addListener == "function" && u.addListener(g);
}
//#endregion
export { l as initStickyImages };
