import { n as e } from "./site-language-BMLr3i6q.js";
//#region src/js/modules/consent-embeds.js
var t = "script#Cookiebot, script[src*=\"consent.cookiebot.com/uc.js\"]", n = ".brxe-map[data-bricks-map-options]", r = "script[data-bemke-consent-service=\"google-maps\"]", i = ".video-yt", a = "[data-bemke-cookieblock-iframe-src*=\"youtube-nocookie.com/embed/\"], [data-iframe-src*=\"youtube.com/embed/\"], [data-iframe-src*=\"youtube-nocookie.com/embed/\"]", o = [
	"CookiebotOnConsentReady",
	"CookiebotOnAccept",
	"CookiebotOnDecline",
	"CookiebotOnLoad"
], s = /* @__PURE__ */ new WeakSet(), c = /* @__PURE__ */ new WeakSet(), l = 0, u = !1, d = null;
function f() {
	return !!(window.Cookiebot || document.querySelector(t));
}
function p() {
	return !!window.Cookiebot?.consent?.marketing;
}
function m(t) {
	if (typeof window.Cookiebot?.renew == "function") {
		window.Cookiebot.renew();
		return;
	}
	t && (t.textContent = e("Ustawienia prywatności jeszcze się ładują. Spróbuj ponownie za chwilę.", "Privacy settings are still loading. Please try again in a moment."));
}
function h(t) {
	l += 1;
	let n = document.createElement("div"), r = document.createElement("p"), i = document.createElement("div"), a = document.createElement("button"), o = document.createElement("span"), s = `bemke-consent-copy-${l}`;
	if (n.className = `bemke-consent-panel bemke-consent-panel--${t}`, n.dataset.bemkeConsentPanel = t, r.className = "bemke-consent-panel__copy", r.id = s, r.textContent = t === "google-maps" ? e("Interaktywna mapa Google wymaga zgody na treści marketingowe.", "The interactive Google Map requires consent for marketing content.") : e("Odtwarzacz YouTube wymaga zgody na treści marketingowe.", "The YouTube player requires consent for marketing content."), i.className = "bemke-consent-panel__actions", a.className = "bemke-consent-panel__button", a.type = "button", a.textContent = e("Ustawienia prywatności", "Privacy settings"), a.setAttribute("aria-describedby", s), o.className = "bemke-consent-panel__status bemke-sr-only", o.setAttribute("aria-live", "polite"), a.addEventListener("click", () => {
		m(o);
	}), i.append(a), t === "google-maps") {
		let t = document.createElement("a");
		t.className = "bemke-consent-panel__link", t.href = "https://maps.app.goo.gl/ejUvGMftTiDrTMt26", t.target = "_blank", t.rel = "noopener noreferrer", t.textContent = e("Otwórz trasę w Google Maps", "Open directions in Google Maps"), i.append(t);
	}
	return n.append(r, i, o), {
		panel: n,
		status: o
	};
}
function g(e, t) {
	let n = f() && !p();
	e.classList.toggle("bemke-consent-required", n), t.hidden = !n;
}
function _(e) {
	if (s.has(e) || !document.querySelector(r)) return;
	s.add(e), e.classList.add("bemke-consent-embed", "bemke-consent-embed--map");
	let { panel: t } = h("google-maps");
	e.append(t);
	let n = () => {
		t.isConnected || e.append(t), g(e, t);
	};
	o.forEach((e) => {
		window.addEventListener(e, n);
	}), n();
}
function v(e) {
	let t = e.dataset.bemkeCookieblockIframeSrc || e.dataset.iframeSrc;
	if (!t) return "";
	let n = t.replace("https://www.youtube.com/embed/", "https://www.youtube-nocookie.com/embed/").replace("https://youtube.com/embed/", "https://www.youtube-nocookie.com/embed/");
	return e.dataset.bemkeCookieblockIframeSrc = n, n;
}
function y(e) {
	if (c.has(e)) return;
	let t = e.querySelector(a);
	if (!t) return;
	c.add(e);
	let n = v(t);
	if (!n) return;
	e.classList.add("bemke-consent-embed", "bemke-consent-embed--youtube");
	let { panel: r, status: i } = h("youtube");
	e.append(r);
	let s = (e) => {
		!f() || p() || e.type === "keydown" && e.key !== "Enter" && e.key !== " " || (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), m(i));
	};
	e.addEventListener("click", s, !0), e.addEventListener("keydown", s, !0);
	let l = () => {
		f() && !p() ? delete t.dataset.iframeSrc : t.dataset.iframeSrc = n, g(e, r);
	};
	o.forEach((e) => {
		window.addEventListener(e, l);
	}), l();
}
function b() {
	document.querySelectorAll(n).forEach(_), document.querySelectorAll(i).forEach(y);
}
function x() {
	if (!f()) return;
	let e = p();
	if (d === !0 && e === !1) {
		window.location.reload();
		return;
	}
	d = e;
}
function S() {
	u || (u = !0, o.forEach((e) => {
		window.addEventListener(e, () => {
			window.setTimeout(x, 0);
		});
	}), x());
}
function C() {
	S(), b(), document.addEventListener("bricks/ajax/end", b);
}
//#endregion
export { C as initPrivacyConsentEmbeds };
