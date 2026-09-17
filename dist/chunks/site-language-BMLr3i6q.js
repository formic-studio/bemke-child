//#region src/js/modules/site-language.js
function e() {
	return document.documentElement.lang.toLowerCase().startsWith("en");
}
function t(t, n) {
	return e() ? n : t;
}
//#endregion
export { t as n, e as t };
