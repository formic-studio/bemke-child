import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-0BK4_Us1.js";
import { t as r } from "./ScrollTrigger-BeYzJT_T.js";
//#region src/js/modules/image-up-reveal.js
var i = "[img-up]", a = "top 95%", o = 1.6, s = "power2.out";
function c() {
	let c = n.utils.toArray(i);
	if (!c.length) return;
	n.registerPlugin(r);
	let l = [], u = () => {
		l.forEach((e) => {
			e.scrollTrigger?.kill(), e.kill();
		}), l = [];
	}, d = () => {
		n.set(c, { clearProps: "opacity,transform,willChange" });
	}, f = () => {
		u(), d(), !e() && (l = c.map((e) => n.fromTo(e, {
			opacity: 0,
			willChange: "transform, opacity",
			y: 50
		}, {
			duration: o,
			ease: s,
			opacity: 1,
			overwrite: "auto",
			scrollTrigger: {
				trigger: e,
				start: a,
				once: !0
			},
			y: 0,
			onComplete: () => {
				n.set(e, { clearProps: "opacity,transform,willChange" });
			}
		})));
	};
	f(), document.addEventListener(t, f), document.readyState !== "complete" && window.addEventListener("load", () => {
		r.refresh();
	}, { once: !0 });
}
//#endregion
export { c as initImageUpReveal };
