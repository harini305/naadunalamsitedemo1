"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { generations } from "@/lib/site";
import s from "./Generations.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ஏழு தலைமுறை — pinned scroll story (desktop).
   Seven rings radiate from today's family at the centre; as the visitor scrolls,
   each ring draws and its generation lights up, from தாய் தந்தை out to பரன் பரை. */
const C = 400, R0 = 128, STEP = 38;
const radii = generations.map((_, i) => R0 + 28 + i * STEP);

export default function Generations() {
  const root = useRef(null);
  const [active, setActive] = useState(6);

  useGSAP(
    () => {
      const rings = gsap.utils.toArray(`.${s.ring}`);
      const labels = gsap.utils.toArray(`.${s.label}`);
      const mm = gsap.matchMedia();

      // desktop: pin and scrub through the seven generations
      mm.add("(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)", () => {
        rings.forEach((el) => {
          const len = 2 * Math.PI * Number(el.getAttribute("r"));
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set(labels, { opacity: 0.5 });
        setActive(-1);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + Math.round(window.innerHeight * 1.5),
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => setActive(Math.min(6, Math.floor(self.progress * 7.2) - 0)),
          },
        });
        tl.from(`.${s.core}`, { scale: 0.9, duration: 0.6 }, 0);
        rings.forEach((r, i) => {
          tl.to(r, { strokeDashoffset: 0, duration: 1 }, i * 0.9 + 0.2);
          tl.to(labels[i], { opacity: 1, duration: 0.4 }, i * 0.9 + 0.6);
        });
        tl.to({}, { duration: 0.6 }); // short hold at the end
        return () => setActive(6);
      });

      // tablet / phone: draw once when it comes into view
      mm.add("(max-width: 1023px), (max-height: 639px)", () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        rings.forEach((el) => {
          const len = 2 * Math.PI * Number(el.getAttribute("r"));
          gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, {
            strokeDashoffset: 0, duration: 1.1, ease: "power2.out",
            delay: rings.indexOf(el) * 0.1,
            scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.gens} aria-labelledby="gens-title">
      <div className={`wrap ${s.grid}`}>
        <div className={s.text}>
          <h2 id="gens-title" className={s.title}>
            <span className="ta" lang="ta">ஏழு தலைமுறை</span>
            <span>Seven generations, one family line</span>
          </h2>
          <p className={s.lead}>
            In Tamil, a family counts its lineage across seven generations, from parents back to the earliest
            ancestors. The way a family eats travels down the same line.
          </p>
          <ol className={s.ladder} aria-label="The seven generations">
            {generations.map((g, i) => (
              <li key={g} className={i <= active ? s.on : ""}>
                <svg viewBox="0 0 40 40" aria-hidden="true">
                  {Array.from({ length: i + 1 }).map((_, k) => (
                    <circle key={k} cx="20" cy="20" r={4 + k * 2.3} />
                  ))}
                </svg>
                <span className="ta" lang="ta">{g}</span>
              </li>
            ))}
          </ol>
          <p className={s.small}>
            Good food begins with good soil — and with what one generation teaches the next.{" "}
            <Link prefetch={false} href="/about" className="text-link">Our story</Link>
          </p>
        </div>

        <div className={s.visual}>
          <div className={s.box}>
            <svg className={s.svg} viewBox="0 0 800 800" aria-hidden="true">
              <defs>
                <clipPath id="gens-core"><circle cx={C} cy={C} r={R0} /></clipPath>
                <radialGradient id="gens-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={C} cy={C} r="396" fill="url(#gens-glow)" />
              {radii.map((r) => (
                <circle key={"g" + r} className={s.ghost} cx={C} cy={C} r={r} />
              ))}
              {radii.map((r, i) => (
                <circle key={r} className={s.ring} cx={C} cy={C} r={r} style={{ opacity: 1 - i * 0.08 }} transform={`rotate(-90 ${C} ${C})`} />
              ))}
              <g className={s.core}>
                <image href="/images/home/family-home.webp" x={C - R0 - 60} y={C - R0} width={(R0 + 60) * 2} height={R0 * 2} clipPath="url(#gens-core)" preserveAspectRatio="xMidYMid slice" />
                <circle cx={C} cy={C} r={R0} className={s.coreRing} />
              </g>
            </svg>
            <ol className={s.labels} aria-hidden="true">
              {generations.map((g, i) => (
                <li key={g} className={`${s.label} ${i === 0 || i === 6 ? s.key : ""} ta`} style={{ top: `${((C - radii[i]) / 800) * 100}%` }}>
                  {g}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
