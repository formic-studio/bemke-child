import { r as e, t } from "./motion-preference-Bn10ge8D.js";
import { t as n } from "./gsap-BlCrb88B.js";
//#region node_modules/gsap/SplitText.js
var r, i, a = typeof Symbol == "function" ? Symbol() : "_split", o, s = () => o || E.register(window.gsap), c = typeof Intl < "u" && "Segmenter" in Intl ? new Intl.Segmenter() : 0, l = (e) => e ? typeof e == "string" ? l(document.querySelectorAll(e)) : "length" in e ? Array.from(e).reduce((e, t) => (typeof t == "string" ? e.push(...l(t)) : e.push(t), e), []) : [e] : [], u = (e) => l(e).filter((e) => e && e.nodeType === 1), d = [], f = function() {}, p = { add: (e) => e() }, m = /\s+/g, h = /* @__PURE__ */ RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.", "gu"), g = {
	left: 0,
	top: 0,
	width: 0,
	height: 0
}, _ = (e, t) => {
	for (; ++t < e.length && e[t] === g;);
	return e[t] || g;
}, v = ({ element: e, html: t, ariaL: n, ariaH: r }) => {
	e.innerHTML = t, n ? e.setAttribute("aria-label", n) : e.removeAttribute("aria-label"), r ? e.setAttribute("aria-hidden", r) : e.removeAttribute("aria-hidden");
}, y = (e, t) => {
	if (t) {
		let n = new Set(e.join("").match(t) || d), r = e.length, i, a, o, s;
		if (n.size) for (; --r > -1;) {
			a = e[r];
			for (o of n) if (o.startsWith(a) && o.length > a.length) {
				for (i = 0, s = a; o.startsWith(s += e[r + ++i]) && s.length < o.length;);
				if (i && s.length === o.length) {
					e[r] = o, e.splice(r + 1, i);
					break;
				}
			}
		}
	}
	return e;
}, b = (e) => window.getComputedStyle(e).display === "inline" && (e.style.display = "inline-block"), x = (e, t, n) => t.insertBefore(typeof e == "string" ? document.createTextNode(e) : e, n), S = (e, t, n) => {
	let r = t[e + "sClass"] || "", { tag: i = "div", aria: a = "auto", propIndex: o = !1 } = t, s = e === "line" ? "block" : "inline-block", c = r.indexOf("++") > -1, l = (t) => {
		let l = document.createElement(i), u = n.length + 1;
		return r && (l.className = r + (c ? " " + r + u : "")), o && l.style.setProperty("--" + e, u + ""), a !== "none" && l.setAttribute("aria-hidden", "true"), i !== "span" && (l.style.position = "relative", l.style.display = s), l.textContent = t, n.push(l), l;
	};
	return c && (r = r.replace("++", "")), l.collection = n, l;
}, C = (e, t, n, r) => {
	let i = S("line", n, r), a = window.getComputedStyle(e).textAlign || "left";
	return (n, r) => {
		let o = i("");
		for (o.style.textAlign = a, e.insertBefore(o, t[n]); n < r; n++) o.appendChild(t[n]);
		o.normalize();
	};
}, w = (e, t, n, r, i, a, o, s, l, u) => {
	var f;
	let p = Array.from(e.childNodes), h = 0, { wordDelimiter: g, reduceWhiteSpace: _ = !0, prepareText: v } = t, S = e.getBoundingClientRect(), C = S, T = !_ && window.getComputedStyle(e).whiteSpace.substring(0, 3) === "pre", E = 0, D = n.collection, O, k, A, j, M, N, P, F, I, L, R, z, B, V, H, U, W, G;
	for (typeof g == "object" ? (A = g.delimiter || g, k = g.replaceWith || "") : k = g === "" ? "" : g || " ", O = k !== " "; h < p.length; h++) if (j = p[h], j.nodeType === 3) {
		for (H = j.textContent || "", _ ? H = H.replace(m, " ") : T && (H = H.replace(/\n/g, k + "\n")), v && (H = v(H, e)), j.textContent = H, M = k || A ? H.split(A || k) : H.match(s) || d, W = M[M.length - 1], F = O ? W.slice(-1) === " " : !W, W || M.pop(), C = S, P = O ? M[0].charAt(0) === " " : !M[0], P && x(" ", e, j), M[0] || M.shift(), y(M, l), a && u || (j.textContent = ""), I = 1; I <= M.length; I++) if (U = M[I - 1], !_ && T && U.charAt(0) === "\n" && ((f = j.previousSibling) == null || f.remove(), x(document.createElement("br"), e, j), U = U.slice(1)), !_ && U === "") x(k, e, j);
		else if (U === " ") e.insertBefore(document.createTextNode(" "), j);
		else {
			if (O && U.charAt(0) === " " && x(" ", e, j), E && I === 1 && !P && D.indexOf(E.parentNode) > -1 ? (N = D[D.length - 1], N.appendChild(document.createTextNode(r ? "" : U))) : (N = n(r ? "" : U), x(N, e, j), E && I === 1 && !P && N.insertBefore(E, N.firstChild)), r) for (R = c ? y([...c.segment(U)].map((e) => e.segment), l) : U.match(s) || d, G = 0; G < R.length; G++) N.appendChild(R[G] === " " ? document.createTextNode(" ") : r(R[G]));
			if (a && u) {
				if (H = j.textContent = H.substring(U.length + 1, H.length), L = N.getBoundingClientRect(), L.top > C.top && L.left <= C.left) {
					for (z = e.cloneNode(), B = e.childNodes[0]; B && B !== N;) V = B, B = B.nextSibling, z.appendChild(V);
					e.parentNode.insertBefore(z, e), i && b(z);
				}
				C = L;
			}
			(I < M.length || F) && x(I >= M.length ? " " : O && U.slice(-1) === " " ? " " + k : k, e, j);
		}
		e.removeChild(j), E = 0;
	} else j.nodeType === 1 && (o && o.indexOf(j) > -1 ? (D.indexOf(j.previousSibling) > -1 && D[D.length - 1].appendChild(j), E = j) : (w(j, t, n, r, i, a, o, s, l, !0), E = 0), i && b(j));
}, T = class e {
	constructor(e, t) {
		this.isSplit = !1, s(), this.elements = u(e), this.chars = [], this.words = [], this.lines = [], this.masks = [], this.vars = t, this.elements.forEach((e) => {
			var n;
			t.overwrite !== !1 && ((n = e[a]) == null || n._data.orig.filter(({ element: t }) => t === e).forEach(v)), e[a] = this;
		}), this._split = () => this.isSplit && this.split(this.vars);
		let n = [], r, i = () => {
			let e = n.length, t;
			for (; e--;) {
				t = n[e];
				let r = t.element.offsetWidth;
				if (r !== t.width) {
					t.width = r, this._split();
					return;
				}
			}
		};
		this._data = {
			orig: n,
			obs: typeof ResizeObserver < "u" && new ResizeObserver(() => {
				clearTimeout(r), r = setTimeout(i, 200);
			})
		}, f(this), this.split(t);
	}
	split(e) {
		return (this._ctx || p).add(() => {
			this.isSplit && this.revert(), this.vars = e = e || this.vars || {};
			let { type: t = "chars,words,lines", aria: n = "auto", deepSlice: r = !0, smartWrap: a, onSplit: o, autoSplit: s = !1, specialChars: c, mask: d } = this.vars, f = t.indexOf("lines") > -1, p = t.indexOf("chars") > -1, m = t.indexOf("words") > -1, v = p && !m && !f, y = c && ("push" in c ? RegExp("(?:" + c.join("|") + ")", "gu") : c), b = y ? RegExp(y.source + "|" + h.source, "gu") : h, x = !!e.ignore && u(e.ignore), { orig: T, animTime: E, obs: D } = this._data, O;
			(p || m || f) && (this.elements.forEach((t, i) => {
				T[i] = {
					element: t,
					html: t.innerHTML,
					ariaL: t.getAttribute("aria-label"),
					ariaH: t.getAttribute("aria-hidden")
				}, n === "auto" ? t.setAttribute("aria-label", (t.textContent || "").trim()) : n === "hidden" && t.setAttribute("aria-hidden", "true");
				let o = [], s = [], c = [], u = p ? S("char", e, o) : null, d = S("word", e, s), h, E, D, O;
				if (w(t, e, d, u, v, r && (f || v), x, b, y, !1), f) {
					let n = l(t.childNodes), r = C(t, n, e, c), i, a = [], o = 0, s = n.map((e) => e.nodeType === 1 ? e.getBoundingClientRect() : g), u = g, d;
					for (h = 0; h < n.length; h++) i = n[h], i.nodeType === 1 && (i.nodeName === "BR" ? ((!h || n[h - 1].nodeName !== "BR") && (a.push(i), r(o, h + 1)), o = h + 1, u = _(s, h)) : (d = s[h], h && d.top > u.top && d.left < u.left + u.width - 1 && (r(o, h), o = h), u = d));
					o < h && r(o, h), a.forEach((e) => e.parentNode?.removeChild(e));
				}
				if (!m) {
					for (h = 0; h < s.length; h++) if (E = s[h], p || !E.nextSibling || E.nextSibling.nodeType !== 3) if (a && !f) {
						for (D = document.createElement("span"), D.style.whiteSpace = "nowrap"; E.firstChild;) D.appendChild(E.firstChild);
						E.replaceWith(D);
					} else E.replaceWith(...E.childNodes);
					else O = E.nextSibling, O && O.nodeType === 3 && (O.textContent = (E.textContent || "") + (O.textContent || ""), E.remove());
					s.length = 0, t.normalize();
				}
				this.lines.push(...c), this.words.push(...s), this.chars.push(...o);
			}), d && this[d] && this.masks.push(...this[d].map((e) => {
				let t = e.cloneNode();
				return e.replaceWith(t), t.appendChild(e), e.className && (t.className = e.className.trim().split(" ").map((e) => e + "-mask").join(" ")), t.style.overflow = "clip", t;
			}))), this.isSplit = !0, i && f && s && i.addEventListener("loadingdone", this._split), (O = o && o(this)) && O.totalTime && (this._data.anim = E ? O.totalTime(E) : O), f && s && this.elements.forEach((e, t) => {
				T[t].width = e.offsetWidth, D && D.observe(e);
			});
		}), this;
	}
	kill() {
		let { obs: e } = this._data;
		e && e.disconnect(), i?.removeEventListener("loadingdone", this._split);
	}
	revert() {
		var e, t;
		if (this.isSplit) {
			let { orig: n, anim: r } = this._data;
			this.kill(), n.forEach(v), this.chars.length = this.words.length = this.lines.length = n.length = this.masks.length = 0, this.isSplit = !1, r && (this._data.animTime = r.totalTime(), r.revert()), (t = (e = this.vars).onRevert) == null || t.call(e, this);
		}
		return this;
	}
	static create(t, n) {
		return new e(t, n);
	}
	static register(e) {
		r = r || e || window.gsap, r && (l = r.utils.toArray, f = r.core.context || f), !o && window.innerWidth > 0 && (i = document.fonts, o = !0);
	}
};
T.version = "3.15.0";
var E = T, D = ".section_hero", O = "h1", k = ".brxe-text-basic, .brxe-text, p", A = "data-bemke-hero-intro-ready", j = "data-bemke-hero-intro-complete", M = "bemke:hero-intro-complete", N = "bemke:hero-intro-header-reveal", P = "data-bemke-hero-intro-header-reveal", F = .7, I = "(max-width: 767px)", L = 10, R = 8, z = "inset(100% 0 0 0)", B = "inset(-35% -2% -35% -2%)", V = 1.2, H = 1, U = .32, W = 1e3, G = /* @__PURE__ */ new Set(), K = !1;
n.registerPlugin(E);
function q() {
	J(), document.querySelectorAll(D).forEach((e) => {
		ee(e);
	});
}
function J() {
	K || (K = !0, document.addEventListener(t, (e) => {
		e.detail?.reduced && Array.from(G).forEach(Z);
	}));
}
function ee(t) {
	if (t.getAttribute(A) === "1") return;
	let r = t.querySelector(O);
	if (!r) {
		Q(t);
		return;
	}
	let i = re(r), a = [r, i].filter(Boolean), o = window.matchMedia(I).matches;
	if (o) {
		Q(t);
		return;
	}
	let s = {
		elements: a,
		finished: !1,
		heading: r,
		hero: t,
		originalStyles: new Map(a.map((e) => [e, e.getAttribute("style")])),
		splits: [],
		supplementary: i,
		timeline: null
	};
	if (G.add(s), e()) {
		Z(s);
		return;
	}
	let c = {
		clipPath: z,
		y: L
	};
	o || (c.filter = `blur(${R}px)`), n.set(a, c), t.setAttribute(A, "1"), te(s, o);
}
async function te(t, r) {
	try {
		if (await ne(), t.finished) return;
		if (e()) {
			Z(t);
			return;
		}
		let i = X(t, t.heading), a = t.supplementary ? X(t, t.supplementary) : [], o = [...i, ...a];
		if (!i.length) {
			Z(t);
			return;
		}
		let s = {
			clipPath: B,
			y: 0
		}, c = {
			clipPath: z,
			willChange: "clip-path, transform",
			y: L
		};
		r || (s.filter = "none", c.filter = `blur(${R}px)`, c.willChange = "clip-path, transform, filter"), n.set(t.elements, s), n.set(o, c);
		let l = {
			clipPath: B,
			duration: r ? .66 : V,
			stagger: U,
			y: 0
		}, u = {
			clipPath: B,
			duration: r ? .54 : H,
			stagger: U,
			y: 0
		};
		r || (l.filter = "blur(0px)", u.filter = "blur(0px)");
		let d = n.timeline({
			defaults: { ease: "power2.out" },
			onComplete: () => Z(t)
		});
		t.timeline = d, a.length ? document.body.classList.contains("home") ? Y(d, i, l, a, u) : Y(d, a, u, i, l) : d.to(i, l), d.add(() => $(t.hero), d.duration() * F);
	} catch {
		Z(t);
	}
}
function Y(e, t, n, r, i) {
	e.to(t, n);
	let a = e.duration() - n.duration;
	e.to(r, i, a + U);
}
function X(e, t) {
	let n = E.create(t, {
		aria: "auto",
		linesClass: "bemke-hero-intro-line",
		type: "lines"
	}), r = n.lines.filter((e) => e.textContent.trim());
	return e.splits.push(n), r;
}
async function ne() {
	document.fonts?.ready && await Promise.race([document.fonts.ready, new Promise((e) => {
		window.setTimeout(e, W);
	})]);
}
function re(e) {
	let t = e.parentElement;
	return t ? Array.from(t.children).find((t) => {
		if (t === e || !t.matches(k) || !t.textContent.trim()) return !1;
		let n = window.getComputedStyle(t);
		return n.display !== "none" && n.visibility !== "hidden";
	}) ?? null : null;
}
function Z(e) {
	if (e.finished) return;
	e.finished = !0;
	let t = e.timeline;
	e.timeline = null, t?.kill(), [...e.splits].reverse().forEach((e) => {
		e.revert();
	}), e.splits.length = 0, e.elements.forEach((t) => {
		ie(t, e.originalStyles.get(t));
	}), Q(e.hero), G.delete(e);
}
function ie(e, t) {
	if (t === null) {
		e.removeAttribute("style");
		return;
	}
	e.setAttribute("style", t);
}
function Q(e) {
	$(e), e.setAttribute(A, "1"), e.setAttribute(j, "1"), document.dispatchEvent(new CustomEvent(M, { detail: { hero: e } }));
}
function $(e) {
	e.getAttribute(P) !== "1" && (e.setAttribute(P, "1"), document.dispatchEvent(new CustomEvent(N, { detail: { hero: e } })));
}
//#endregion
export { M as HERO_INTRO_COMPLETE_EVENT, N as HERO_INTRO_HEADER_REVEAL_EVENT, q as initHeroIntro };
