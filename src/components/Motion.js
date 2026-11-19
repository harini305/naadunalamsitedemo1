"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Site-wide scroll reveals for [data-reveal] blocks.
   - Content is visible without JS (the hiding class is added only here).
   - Blocks already on screen at load are shown immediately.
   - Failsafe: everything is forced visible after 2s. */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    root.classList.add("reveal-ready");

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray("[data-reveal]");
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.98) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: Math.min(0.3, r.top / vh * 0.3) });
        }
      });
      // gentle parallax: [data-parallax="6"] drifts ±6% inside its (overflow-hidden) frame
      gsap.utils.toArray("[data-parallax]").forEach((img) => {
        const amt = Number(img.dataset.parallax) || 6;
        gsap.fromTo(img, { yPercent: -amt }, {
          yPercent: amt, ease: "none",
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      ScrollTrigger.batch(els.filter((el) => el.getBoundingClientRect().top >= vh * 0.98), {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.08, overwrite: true }),
      });
    });

    // Failsafe: anything inside the viewport that is still hidden gets shown.
    const sweep = () => {
      const h = window.innerHeight;
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < h && r.bottom > 0 && parseFloat(getComputedStyle(el).opacity) < 0.05 && !gsap.isTweening(el)) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.5, overwrite: "auto" });
        }
      });
    };
    let t;
    const onScroll = () => { clearTimeout(t); t = setTimeout(sweep, 700); };
    window.addEventListener("scroll", onScroll, { passive: true });
    const failsafe = setTimeout(sweep, 2000);
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      clearTimeout(failsafe);
      clearTimeout(refresh);
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
