"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./Elements.module.css";

gsap.registerPlugin(ScrollTrigger);

/* Iyarkai Panchabhootham — five elements held in balance around the Naadu Nalam emblem.
   Photographs: client-supplied (public/images/home/element-*.webp). Order as in the brief. */
const ELEMENTS = [
  { key: "earth", ta: "நிலம்", en: "Earth", line: "Soil that holds the seed. Paddy, millets and pulses all begin here." },
  { key: "water", ta: "நீர்", en: "Water", line: "Rain, rivers and village tanks that carry water to the fields." },
  { key: "fire", ta: "நெருப்பு", en: "Fire", line: "The sun that ripens the crop, and the hearth where grain becomes food." },
  { key: "air", ta: "காற்று", en: "Air", line: "Wind moving across the paddy, drying the harvest in the open yard." },
  { key: "space", ta: "ஆகாயம்", en: "Space", line: "Open sky and the turning seasons that set the farming calendar." },
];
// pentagon positions (percent of the mandala box), starting at the top
const POS = ELEMENTS.map((_, i) => {
  const a = (-90 + i * 72) * (Math.PI / 180);
  return { x: 50 + Math.cos(a) * 37, y: 50 + Math.sin(a) * 37 };
});

export default function Elements() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const el = ELEMENTS[active];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const nodes = gsap.utils.toArray(`.${s.node}`);
        const tl = gsap.timeline({ scrollTrigger: { trigger: `.${s.mandala}`, start: "top 78%", once: true } });
        tl.from(`.${s.center}`, { scale: 0.4, opacity: 0, duration: 0.8, ease: "back.out(1.5)" })
          .from(`.${s.spoke}`, { strokeDashoffset: 100, duration: 0.8, stagger: 0.08, ease: "power2.out" }, 0.3)
          .from(nodes, {
            // start at the centre of the mandala (transform only)
            x: (i) => ((50 - POS[i].x) / 100) * root.current.querySelector(`.${s.mandala}`).offsetWidth,
            y: (i) => ((50 - POS[i].y) / 100) * root.current.querySelector(`.${s.mandala}`).offsetWidth,
            scale: 0.3, opacity: 0, duration: 1.1, stagger: 0.1, ease: "power3.out",
          }, 0.3);
        gsap.to(`.${s.orbit}`, {
          rotate: 60, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(`.${s.row}`, {
          x: -24, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: `.${s.list}`, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.elements} aria-labelledby="elements-title">
      <svg className={s.waveTop} viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 L1440 0 L1440 22 C 1260 46 1080 52 900 34 C 720 16 540 10 360 28 C 200 44 90 40 0 30 Z" />
      </svg>
      <div className={`wrap ${s.grid}`}>
        <div className={s.text}>
          <h2 id="elements-title" className={s.title}>
            <span className="ta" lang="ta">இயற்கை பஞ்சபூதம்</span>
            <span>Five elements, held in balance</span>
          </h2>
          <p className={s.intro}>
            Look closely at the Naadu Nalam emblem: a leaf canopy, red-brown soil, blue water, an orange sun and birds in
            an open sky. Every harvest depends on these five elements staying in balance — and so does every
            traditional meal made from it.
          </p>
          <div className={s.detail} aria-live="polite">
            <span className={`${s.dTa} ta`} lang="ta">{el.ta}</span>
            <span className={s.dEn}>{el.en}</span>
            <p>{el.line}</p>
          </div>
        </div>

        {/* desktop mandala */}
        <div className={s.mandala}>
          <svg className={s.lines} viewBox="0 0 100 100" aria-hidden="true">
            <circle className={s.orbit} cx="50" cy="50" r="37" />
            {POS.map((p, i) => (
              <line key={i} className={s.spoke} x1="50" y1="50" x2={p.x} y2={p.y} pathLength="100" />
            ))}
          </svg>
          <div className={s.center}>
            <img src="/images/brand/emblem.webp" alt="The Naadu Nalam emblem" width="384" height="372" />
          </div>
          {ELEMENTS.map((e, i) => (
            <button
              key={e.key}
              type="button"
              className={`${s.node} ${i === active ? s.nodeOn : ""}`}
              style={{ left: `${POS[i].x}%`, top: `${POS[i].y}%` }}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className={s.photo}>
                <img src={`/images/home/element-${e.key}.webp`} alt="" width="226" height="226" loading="lazy" />
              </span>
              <span className={`${s.nTa} ta`} lang="ta">{e.ta}</span>
              <span className={s.nEn}>{e.en}</span>
            </button>
          ))}
        </div>

        {/* tablet / phone list */}
        <ul className={s.list}>
          {ELEMENTS.map((e) => (
            <li key={e.key} className={s.row}>
              <span className={s.rowPhoto}>
                <img src={`/images/home/element-${e.key}.webp`} alt="" width="226" height="226" loading="lazy" />
              </span>
              <span className={s.rowText}>
                <span className={`${s.nTa} ta`} lang="ta">{e.ta}</span>
                <span className={s.nEn}>{e.en}</span>
                <span className={s.rowLine}>{e.line}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <svg className={s.waveBottom} viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60 L1440 60 L1440 30 C 1300 14 1150 10 980 26 C 800 44 640 50 460 36 C 280 22 140 22 0 34 Z" />
      </svg>
    </section>
  );
}
