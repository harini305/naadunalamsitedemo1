import Link from "next/link";
import { sellers } from "@/lib/catalog";
import s from "./home.module.css";

/* "Many Sellers. One Basket." — the two live storefronts, Naadu Nalam and Thaayanbu.
   Only verified facts: names, product counts, categories. No invented history. */
const IMAGES = {
  naadunalam: [
    ["/images/products/kudavaazhai-arisi.webp", "Kudavaazhai rice (குடவாழை அரிசி)"],
    ["/images/products/kuthiraivali-arisi.webp", "Barnyard millet (குதிரைவாலி)"],
    ["/images/products/thuvaram-paruppu.webp", "Pigeon pea dal (துவரம் பருப்பு)"],
  ],
  thaayanbu: [
    ["/images/products/nallennai.webp", "Gingelly oil (நல்லெண்ணெய்)"],
    ["/images/products/sambar-podi.webp", "Sambar powder (சாம்பார் தூள்)"],
    ["/images/products/urundai-vellam.webp", "Round jaggery (உருண்டை வெல்லம்)"],
  ],
};

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
/* verified copy: homepage "Many Sellers. One Basket." points */
const POINTS = [
  ["Independent Storefronts", "Every seller manages their own listings, pricing and stock.",
    <svg key="a" viewBox="0 0 24 24" {...ic}><path d="M4 9.5 5.5 4h13L20 9.5" /><path d="M4 9.5h16v1a3 3 0 0 1-5.3 1.9A3 3 0 0 1 12 13.5a3 3 0 0 1-2.7-1.1A3 3 0 0 1 4 10.5Z" /><path d="M5.5 13v7h13v-7M10 20v-4h4v4" /></svg>],
  ["One Cart, One Checkout", "Add items from different sellers and pay in a single order.",
    <svg key="b" viewBox="0 0 24 24" {...ic}><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>],
  ["Open to New Sellers", "Growers and small producers can register and open a store on Naadu Nalam.",
    <svg key="c" viewBox="0 0 24 24" {...ic}><path d="M12 21v-8" /><path d="M12 13c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5Z" /><path d="M12 15c0-3-2.3-5-5.5-5 0 3 2.3 5 5.5 5Z" /></svg>],
];

export default function Sellers() {
  return (
    <section className={s.sellers} aria-labelledby="sellers-title">
      <div className="wrap">
        <div className={s.sellersHead} data-reveal>
          <div className={s.sellersIntro}>
            <h2 id="sellers-title">Many sellers. One basket.</h2>
            <p className="lead">
              Naadu Nalam is a marketplace, not a single shop. Independent growers, home producers and small brands
              each run their own storefront here — you browse them side by side and check out once.
            </p>
          </div>
          <ul className={s.points}>
            {POINTS.map(([title, text, icon]) => (
              <li key={title}>
                <span className={s.pointIcon} aria-hidden="true">{icon}</span>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={s.sellerPair}>
          {sellers.map((v, k) => (
            <article key={v.slug} className={`${s.seller} ${k ? s.sellerAlt : ""}`} data-reveal>
              <div className={s.sellerTop}>
                <h3>{v.name}</h3>
                <span className={s.sellerCount}>{v.count} products</span>
              </div>
              <div className={s.sellerImgs}>
                {IMAGES[v.slug].map(([src, alt]) => (
                  <span key={src} className="zoom">
                    <img src={src} alt={alt} width="1024" height="1024" loading="lazy" />
                  </span>
                ))}
              </div>
              <ul className={s.sellerCats}>
                {v.categories.map((c) => (
                  <li key={c.slug}>
                    <Link prefetch={false} href={`/product-category/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
              <Link prefetch={false} href={`/store/${v.slug}`} className={`btn ${k ? "btn--lime" : "btn--forest"}`}>
                Visit the {v.name} store
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
