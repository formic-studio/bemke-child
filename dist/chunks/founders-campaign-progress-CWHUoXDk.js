import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-0BK4_Us1.js";
import { t as r } from "./ScrollTrigger-BeYzJT_T.js";
//#region src/js/modules/founders-campaign-progress.js
var i = ".section_book-money .loading-wrapper", a = ".section_book-money", o = ".book-money-animation video, .video-book video, video.video-book", s = ".loading-progress", c = ".progress-bar", l = ".progress-dot", u = ".loading-progress + .brxe-block > .font-size-h4:first-child", d = ".loading-progress + .brxe-block > .font-size-h4:last-child", f = "--bemke-campaign-progress", p = "top 90%", m = 2.2, h = "power2.out";
function g(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function _() {
	let e = Number(window.bemkeFoundersCampaign?.currentAmount), t = Number(window.bemkeFoundersCampaign?.goalAmount);
	return !Number.isFinite(e) || !Number.isFinite(t) || t <= 0 ? null : {
		currentAmount: Math.max(e, 0),
		goalAmount: t
	};
}
function v(e) {
	return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(e);
}
function y(e, t = e >= 1e6) {
	return e === 0 ? "0 PLN" : t ? `${new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(e / 1e6)} mln PLN` : `${v(e)} PLN`;
}
function b(e, t) {
	e.style.setProperty(f, `${g(t, 0, 100)}%`);
}
function x(e) {
	try {
		e.currentTime = 0;
	} catch {}
}
function S(e) {
	e && (e.autoplay = !1, e.removeAttribute("autoplay"), e.pause(), x(e));
}
function C(t) {
	!t || e() || (x(t), t.play()?.catch?.(() => {}));
}
function w() {
	let f = _();
	if (!f) return;
	let { currentAmount: x, goalAmount: w } = f, T = g(x / w * 100, 0, 100), E = [];
	document.querySelectorAll(i).forEach((e) => {
		let t = e.querySelector(s), n = t?.querySelector(c), r = t?.querySelector(l), i = e.querySelector(u), f = e.querySelector(d), p = e.closest(a)?.querySelector(o);
		if (!t || !n || !r) return;
		S(p);
		let m = Math.round(T * 10) / 10, h = {
			currentLabel: i,
			progressElement: t,
			state: {
				amount: 0,
				percent: 0
			},
			tween: null,
			video: p
		}, g = () => {
			b(h.progressElement, h.state.percent), h.currentLabel && (h.currentLabel.textContent = y(h.state.amount, x >= 1e6));
		};
		h.renderState = g, h.showFinalState = () => {
			h.state.amount = x, h.state.percent = T, g();
		}, t.dataset.bemkeCampaignProgress = "ready", t.setAttribute("role", "progressbar"), t.setAttribute("aria-label", "Postęp Kampanii Założycielskiej"), t.setAttribute("aria-valuemin", "0"), t.setAttribute("aria-valuemax", String(w)), t.setAttribute("aria-valuenow", String(Math.min(x, w))), t.setAttribute("aria-valuetext", `Zebrano ${v(x)} PLN z ${v(w)} PLN (${m}%)`), f && (f.textContent = y(w)), i && i.setAttribute("aria-label", `Zebrano ${v(x)} PLN`), h.renderState(), E.push(h);
	}), E.length && (n.registerPlugin(r), E.forEach((t) => {
		r.create({
			trigger: t.progressElement,
			start: p,
			once: !0,
			onEnter: () => {
				if (e() || T === 0) {
					t.showFinalState();
					return;
				}
				C(t.video), t.tween = n.to(t.state, {
					amount: x,
					percent: T,
					duration: m,
					ease: h,
					overwrite: !0,
					onUpdate: () => {
						t.renderState();
					},
					onComplete: () => {
						t.tween = null, t.showFinalState();
					}
				});
			}
		});
	}), document.addEventListener(t, (e) => {
		e.detail?.reduced && E.forEach((e) => {
			e.tween?.kill(), e.tween = null, e.video?.pause(), e.showFinalState();
		});
	}));
}
//#endregion
export { w as initFoundersCampaignProgress };
