//#region src/js/modules/consent-embeds.js
var e = "script#Cookiebot, script[src*=\"consent.cookiebot.com/uc.js\"]", t = ".brxe-map[data-bricks-map-options]", n = "script[data-bemke-consent-service=\"google-maps\"]", r = ".video-yt", i = "[data-bemke-cookieblock-iframe-src*=\"youtube-nocookie.com/embed/\"], [data-iframe-src*=\"youtube.com/embed/\"], [data-iframe-src*=\"youtube-nocookie.com/embed/\"]", a = [
	"CookiebotOnConsentReady",
	"CookiebotOnAccept",
	"CookiebotOnDecline",
	"CookiebotOnLoad"
], o = /* @__PURE__ */ new WeakSet(), s = /* @__PURE__ */ new WeakSet(), c = 0, l = !1, u = null;
function d() {
	return !!(window.Cookiebot || document.querySelector(e));
}
function f() {
	return !!window.Cookiebot?.consent?.marketing;
}
function p(e) {
	if (typeof window.Cookiebot?.renew == "function") {
		window.Cookiebot.renew();
		return;
	}
	e && (e.textContent = "Ustawienia prywatności jeszcze się ładują. Spróbuj ponownie za chwilę.");
}
function m(e) {
	c += 1;
	let t = document.createElement("div"), n = document.createElement("p"), r = document.createElement("div"), i = document.createElement("button"), a = document.createElement("span"), o = `bemke-consent-copy-${c}`;
	if (t.className = `bemke-consent-panel bemke-consent-panel--${e}`, t.dataset.bemkeConsentPanel = e, n.className = "bemke-consent-panel__copy", n.id = o, n.textContent = e === "google-maps" ? "Interaktywna mapa Google wymaga zgody na treści marketingowe." : "Odtwarzacz YouTube wymaga zgody na treści marketingowe.", r.className = "bemke-consent-panel__actions", i.className = "bemke-consent-panel__button", i.type = "button", i.textContent = "Ustawienia prywatności", i.setAttribute("aria-describedby", o), a.className = "bemke-consent-panel__status bemke-sr-only", a.setAttribute("aria-live", "polite"), i.addEventListener("click", () => {
		p(a);
	}), r.append(i), e === "google-maps") {
		let e = document.createElement("a");
		e.className = "bemke-consent-panel__link", e.href = "https://maps.app.goo.gl/ejUvGMftTiDrTMt26", e.target = "_blank", e.rel = "noopener noreferrer", e.textContent = "Otwórz trasę w Google Maps", r.append(e);
	}
	return t.append(n, r, a), {
		panel: t,
		status: a
	};
}
function h(e, t) {
	let n = d() && !f();
	e.classList.toggle("bemke-consent-required", n), t.hidden = !n;
}
function g(e) {
	if (o.has(e) || !document.querySelector(n)) return;
	o.add(e), e.classList.add("bemke-consent-embed", "bemke-consent-embed--map");
	let { panel: t } = m("google-maps");
	e.append(t);
	let r = () => {
		t.isConnected || e.append(t), h(e, t);
	};
	a.forEach((e) => {
		window.addEventListener(e, r);
	}), r();
}
function _(e) {
	let t = e.dataset.bemkeCookieblockIframeSrc || e.dataset.iframeSrc;
	if (!t) return "";
	let n = t.replace("https://www.youtube.com/embed/", "https://www.youtube-nocookie.com/embed/").replace("https://youtube.com/embed/", "https://www.youtube-nocookie.com/embed/");
	return e.dataset.bemkeCookieblockIframeSrc = n, n;
}
function v(e) {
	if (s.has(e)) return;
	let t = e.querySelector(i);
	if (!t) return;
	s.add(e);
	let n = _(t);
	if (!n) return;
	e.classList.add("bemke-consent-embed", "bemke-consent-embed--youtube");
	let { panel: r, status: o } = m("youtube");
	e.append(r);
	let c = (e) => {
		!d() || f() || e.type === "keydown" && e.key !== "Enter" && e.key !== " " || (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), p(o));
	};
	e.addEventListener("click", c, !0), e.addEventListener("keydown", c, !0);
	let l = () => {
		d() && !f() ? delete t.dataset.iframeSrc : t.dataset.iframeSrc = n, h(e, r);
	};
	a.forEach((e) => {
		window.addEventListener(e, l);
	}), l();
}
function y() {
	document.querySelectorAll(t).forEach(g), document.querySelectorAll(r).forEach(v);
}
function b() {
	if (!d()) return;
	let e = f();
	if (u === !0 && e === !1) {
		window.location.reload();
		return;
	}
	u = e;
}
function x() {
	l || (l = !0, a.forEach((e) => {
		window.addEventListener(e, () => {
			window.setTimeout(b, 0);
		});
	}), b());
}
function S() {
	x(), y(), document.addEventListener("bricks/ajax/end", y);
}
//#endregion
export { S as initPrivacyConsentEmbeds };
