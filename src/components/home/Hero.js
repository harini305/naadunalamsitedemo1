"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowIcon } from "@/components/Icons";
import s from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

/* Hero — owner's second reference: the family photograph fills the screen; a large
   cream circle on the left carries the message; foliage frames the edges; the header
   sits over it as glass. The photo (client-supplied, 1600×1408) is placed from the
   circle's edge so the eldest grandfather's face is never covered. */
const ic = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
const FEATURES = [
  ["Traditional", "Foods", <svg key="a" viewBox="0 0 32 32" {...ic}><path d="M6 26C6 14 14 6 27 5c0 13-8 21-21 21Z" /><path d="M6 26 19 13" /></svg>],
  ["Natural", "Products", <svg key="b" viewBox="0 0 32 32" {...ic}><path d="M4 15h24c0 6.6-5.4 11-12 11S4 21.6 4 15Z" /><path d="M9 15c1-3 3.5-5 7-5s6 2 7 5" /><path d="M13 9c0-2 1-3 3-4M18 8c1-1.5 2.5-2 4-2" /></svg>],
  ["Local", "Sellers", <svg key="c" viewBox="0 0 32 32" {...ic}><path d="M16 27V15" /><path d="M16 15c0-5 3.5-8.5 9-8.5 0 5.5-3.5 8.5-9 8.5Z" /><path d="M16 18c0-4-3-7-7.5-7 0 4.5 3 7 7.5 7Z" /><path d="M10 27h12" /></svg>],
  ["Sustainable", "Tomorrow", <svg key="d" viewBox="0 0 32 32" {...ic}><path d="M4 22c3 0 5-2 8-2h5a2 2 0 0 1 0 4h-5" /><path d="M14 24h6l6-4a2 2 0 0 1 2 3l-7 5H10l-6-2" /><path d="M18 15V9" /><path d="M18 11c0-3 2-5 5-5 0 3-2 5-5 5ZM18 12c0-2.5-1.6-4-4-4 0 2.5 1.6 4 4 4Z" /></svg>],
];

/* a leafy branch: leaves placed along a quadratic curve, alternating sides */
const TONES = ["#3b6b45", "#4f7a3a", "#6e9b55", "#2f5d3c"];
function Branch({ className, p0, c, p1, n = 8, size = 1, flip = 1 }) {
  const pt = (u) => [
    (1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * c[0] + u * u * p1[0],
    (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * c[1] + u * u * p1[1],
  ];
  const leaves = Array.from({ length: n }, (_, i) => {
    const u = 0.12 + (i / (n - 1)) * 0.86;
    const [x, y] = pt(u);
    const [x2, y2] = pt(Math.min(1, u + 0.02));
    const tangent = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    const side = i % 2 ? 1 : -1;
    const r = tangent + side * flip * (48 + (i % 3) * 10);
    const sc = size * (1.05 - (i / n) * 0.45);
    return { x, y, r, sc, tone: TONES[i % TONES.length] };
  });
  return (
    <svg className={className} viewBox="0 0 300 300" aria-hidden="true">
      <path d={`M${p0[0]} ${p0[1]} Q ${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`} fill="none" stroke="#3b5a35" strokeWidth="2.4" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.r.toFixed(1)}) scale(${l.sc.toFixed(2)})`}>
          <path d="M0 0 C 14 -20, 50 -22, 70 0 C 50 22, 14 20, 0 0 Z" fill={l.tone} />
          <path d="M0 0 C 14 -20, 50 -22, 70 0 Z" fill="#ffffff" opacity="0.1" />
          <path d="M3 0 L 66 0 M20 0 l 8 -7 M34 0 l 8 -8 M48 0 l 7 -6 M20 0 l 8 7 M34 0 l 8 8 M48 0 l 7 6" stroke="#e4eecb" strokeWidth="1" opacity="0.5" fill="none" />
        </g>
      ))}
    </svg>
  );
}

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(`.${s.photoInner}`, { scale: 1.08, duration: 2.2, ease: "power2.out" }, 0)
          .fromTo(`.${s.photo}`, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" }, 0)
          .from(`.${s.edge}`, { opacity: 0, duration: 1 }, 1.1)
          .from(`.${s.leaf}`, { opacity: 0, rotate: (i) => (i % 2 ? 14 : -14), y: -16, duration: 1.4, stagger: 0.12, transformOrigin: "0% 0%" }, 0.3)
          .from(`.${s.line}`, { yPercent: 105, duration: 1, stagger: 0.09 }, 0.45)
          .from([`.${s.ta}`, `.${s.lead}`, `.${s.btns}`], { y: 22, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.85)
          .from(`.${s.divider}`, { scaleX: 0, transformOrigin: "0% 50%", duration: 0.8 }, 1.0)
          .from(`.${s.feature}`, { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, 1.2);

        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(`.${s.content}`, { y: -40, ease: "none", scrollTrigger: st });
        gsap.to(`.${s.leaf}`, { y: (i) => -30 - i * 12, ease: "none", scrollTrigger: st });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.hero} aria-labelledby="hero-title">
      <figure className={s.photo}>
        <div className={s.photoInner}>
          <img
            src="/images/home/hero-family.webp"
            alt="Three generations of a Tamil family — grandparents, parents and children — sitting together beside green paddy fields"
            width="1600"
            height="1408"
            fetchPriority="high"
          />
        </div>
      </figure>

      {/* thin leaf-green line following the photo's curved edge (desktop) */}
      <svg className={s.edge} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M13.2 -1 C 4.2 12, -1.8 26, -1.8 42 C -1.8 60, 4.2 82, 15.2 101" />
      </svg>

      <Branch className={`${s.leaf} ${s.leafLeft}`} p0={[-10, -10]} c={[80, 140]} p1={[20, 300]} n={8} size={0.95} flip={-1} />
      <Branch className={`${s.leaf} ${s.leafTop}`} p0={[0, -10]} c={[110, 70]} p1={[260, 30]} n={8} size={0.85} />

      <div className={s.content}>
        <h1 id="hero-title" className={s.title}>
          <span className={s.mask}><span className={s.line}>Seven</span></span>
          <span className={s.mask}><span className={s.line}>generations.</span></span>
          <span className={s.mask}><span className={`${s.line} ${s.accent}`}>One living</span></span>
          <span className={s.mask}><span className={`${s.line} ${s.accent}`}>tradition.</span></span>
        </h1>
        <p className={`${s.ta} ta`} lang="ta">ஏழு தலைமுறை — பரம்பரை</p>
        <span className={s.divider} aria-hidden="true" />
        <p className={s.lead}>
          Naadu Nalam brings the goodness of traditional Tamil Nadu foods and natural products closer to your home.
        </p>
        <div className={`btn-row ${s.btns}`}>
          <Link prefetch={false} href="/shop" className="btn btn--forest">
            Shop the marketplace <ArrowIcon />
          </Link>
          <Link prefetch={false} href="/about" className="btn btn--ghost">Our story</Link>
        </div>
        <ul className={s.features}>
          {FEATURES.map(([a, b, icon]) => (
            <li key={a} className={s.feature}>
              <span className={s.fIcon} aria-hidden="true">{icon}</span>
              <span>{a}<br />{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
