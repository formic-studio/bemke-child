import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { n } from "./site-language-BMLr3i6q.js";
import { t as r } from "./gsap-CjUXhbIO.js";
import { t as i } from "./ScrollTrigger-DW7wmIBN.js";
//#region src/js/modules/founders-campaign-progress.js
var a = ".section_book-money .loading-wrapper", o = ".section_book-money", s = ".book-money-animation video, .video-book video, video.video-book", c = ".loading-progress", l = ".progress-bar", u = ".progress-dot", d = ".loading-progress + .brxe-block > .font-size-h4:first-child", f = ".loading-progress + .brxe-block > .font-size-h4:last-child", p = "--bemke-campaign-progress", m = "top 90%", h = 2.2, g = "power2.out";
function _(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function v() {
	let e = Number(window.bemkeFoundersCampaign?.currentAmount), t = Number(window.bemkeFoundersCampaign?.goalAmount);
	return !Number.isFinite(e) || !Number.isFinite(t) || t <= 0 ? null : {
		currentAmount: Math.max(e, 0),
		goalAmount: t
	};
}
function y(e) {
	return new Intl.NumberFormat(n("pl-PL", "en-GB"), { maximumFractionDigits: 0 }).format(e);
}
function b(e, t = e >= 1e6) {
	return e === 0 ? "0 PLN" : t ? `${new Intl.NumberFormat(n("pl-PL", "en-GB"), { maximumFractionDigits: 0 }).format(e / 1e6)} mPLN` : `${y(e)} PLN`;
}
function x(e, t) {
	e.style.setProperty(p, `${_(t, 0, 100)}%`);
}
function S(e) {
	try {
		e.currentTime = 0;
	} catch {}
}
function C(e) {
	e && (e.autoplay = !1, e.removeAttribute("autoplay"), e.pause(), S(e));
}
function w(t) {
	!t || e() || (S(t), t.play()?.catch?.(() => {}));
}
function T() {
	let p = v();
	if (!p) return;
	let { currentAmount: S, goalAmount: T } = p, E = _(S / T * 100, 0, 100), D = [];
	document.querySelectorAll(a).forEach((e) => {
		let t = e.querySelector(c), r = t?.querySelector(l), i = t?.querySelector(u), a = e.querySelector(d), p = e.querySelector(f), m = e.closest(o)?.querySelector(s);
		if (!t || !r || !i) return;
		C(m);
		let h = Math.round(E * 10) / 10, g = {
			currentLabel: a,
			progressElement: t,
			state: {
				amount: 0,
				percent: 0
			},
			tween: null,
			video: m
		}, _ = () => {
			x(g.progressElement, g.state.percent), g.currentLabel && (g.currentLabel.textContent = b(g.state.amount, S >= 1e6));
		};
		g.renderState = _, g.showFinalState = () => {
			g.state.amount = S, g.state.percent = E, _();
		}, t.dataset.bemkeCampaignProgress = "ready", t.setAttribute("role", "progressbar"), t.setAttribute("aria-label", n("Postęp Kampanii Założycielskiej", "Founding Campaign progress")), t.setAttribute("aria-valuemin", "0"), t.setAttribute("aria-valuemax", String(T)), t.setAttribute("aria-valuenow", String(Math.min(S, T))), t.setAttribute("aria-valuetext", n(`Zebrano ${y(S)} PLN z ${y(T)} PLN (${h}%)`, `Raised PLN ${y(S)} of PLN ${y(T)} (${h}%)`)), p && (p.textContent = b(T)), a && a.setAttribute("aria-label", n(`Zebrano ${y(S)} PLN`, `Raised PLN ${y(S)}`)), g.renderState(), D.push(g);
	}), D.length && (r.registerPlugin(i), D.forEach((t) => {
		i.create({
			trigger: t.progressElement,
			start: m,
			once: !0,
			onEnter: () => {
				if (e() || E === 0) {
					t.showFinalState();
					return;
				}
				w(t.video), t.tween = r.to(t.state, {
					amount: S,
					percent: E,
					duration: h,
					ease: g,
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
		e.detail?.reduced && D.forEach((e) => {
			e.tween?.kill(), e.tween = null, e.video?.pause(), e.showFinalState();
		});
	}));
}
//#endregion
export { T as initFoundersCampaignProgress };
