import Link from "next/link";
import { sellers, products, minPrice, inr } from "@/lib/catalog";
import { ArrowIcon, BagIcon } from "@/components/Icons";
import s from "./sellers.module.css";

export const metadata = {
  title: "Our Sellers",
  description:
    "Naadu Nalam is a multi-vendor marketplace. Browse the Naadu Nalam and Thaayanbu storefronts side by side and check out once — or apply to sell on Naadu Nalam.",
  alternates: { canonical: "/sellers" },
};

/* Only verified facts: seller names, product counts, categories and prices from the catalogue.
   No ownership, history or contact details (content-review.md D3, B11). */
const LINE = {
  naadunalam: "Traditional rice, aval, millets, pulses and everyday rice.",
  thaayanbu: "Oils and ghee, natural sweeteners, health mixes, masalas and herbal care.",
};
const TILE = {
  "rice-grains": "/images/categories/cat-rice-grains.webp",
  "aval-flakes": "/images/categories/cat-aval-flakes.webp",
  siruthaniyam: "/images/categories/cat-siruthaniyam.webp",
  "paruppu-pulses": "/images/categories/cat-paruppu-pulses.webp",
  "other-rice": "/images/categories/cat-other-rice.webp",
  "oil-vinegers": "/images/categories/cat-oil-vinegers.webp",
  "natural-sweeteners": "/images/categories/cat-natural-sweeteners.webp",
  "health-mixes": "/images/categories/cat-health-mixes.webp",
  "masala-podi": "/images/categories/cat-masala-podi.webp",
  "herbal-wellness": "/images/categories/cat-herbal-wellness.webp",
};
/* both stores sell pulses — Thaayanbu's tile uses its own horse gram photo so no photo repeats */
const TILE_FOR = { thaayanbu: { "paruppu-pulses": "/images/products/kollu.webp" } };

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
const StoreIcon = () => (
  <svg viewBox="0 0 24 24" {...ic}><path d="M4 9.5 5.5 4h13L20 9.5" /><path d="M4 9.5h16v1a3 3 0 0 1-5.3 1.9A3 3 0 0 1 12 13.5a3 3 0 0 1-2.7-1.1A3 3 0 0 1 4 10.5Z" /><path d="M5.5 13v7h13v-7M10 20v-4h4v4" /></svg>
);
const SproutIcon = () => (
  <svg viewBox="0 0 24 24" {...ic}><path d="M12 21v-8" /><path d="M12 13c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5Z" /><path d="M12 15c0-3-2.3-5-5.5-5 0 3 2.3 5 5.5 5Z" /></svg>
);

/* verified copy: the original "Many Sellers, One Basket" points */
const POINTS = [
  [StoreIcon, "Independent storefronts", "Every seller manages their own listings, pricing and stock."],
  [BagIcon, "One cart, one checkout", "Add items from different sellers and pay in a single order."],
  [SproutIcon, "Open to new sellers", "Growers and small producers can register and open a store."],
];

/* verified copy (original "Sell on Naadu Nalam" / "Many Sellers, One Basket" points) */
const SELL = [
  ["/images/home/family-fields-hd.webp", "Open to new sellers", "Growers and small producers can register and open a store on Naadu Nalam."],
  ["/images/editorial/store-still-life.webp", "Your own storefront", "Your own storefront page on the marketplace, with your listings, pricing and stock."],
  ["/images/editorial/seeraga-samba.webp", "Vendor dashboard", "Add products, manage stock and track orders from the vendor dashboard."],
  ["/images/home/family-home.webp", "Cash on delivery", "Orders on the marketplace are Cash on Delivery at present."],
];

export default function SellersPage() {
  return (
    <div className="page">
      {/* ---------- heading band: title | store bar · line + intro | points */}
      <header className="pband">
        <div className="wrap pband__grid">
          <h1 className="pband__title">Our sellers</h1>
          <div className="pband__sub">
            <p className="pband__accent">Many sellers. One basket.</p>
            <p className="pband__intro">
              Naadu Nalam is a marketplace, not a single shop. Independent growers, home producers and small brands
              each run their own storefront here — you browse them side by side and check out once.
            </p>
          </div>
          <nav className="segbar pband__bar" aria-label="Storefronts on this page">
            {sellers.map((v) => (
              <a key={v.slug} href={`#${v.slug}`} className="segbar__item">
                {v.name} <span className="segbar__n">{v.count}</span>
              </a>
            ))}
            <a href="#sell" className="segbar__item segbar__item--solid">Sell with us</a>
          </nav>
          <ul className={`pband__extra ${s.points}`}>
            {POINTS.map(([Icon, title, text]) => (
              <li key={title}>
                <span className={s.pointIcon}><Icon /></span>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ---------- the two storefronts */}
      <section className={s.stores} aria-label="Storefronts">
        <div className={`wrap ${s.storesWrap}`}>
          {sellers.map((v, k) => {
            const mine = products.filter((p) => p.vendor === v.name);
            const tiles = v.categories.map((c) => ({
              ...c,
              n: mine.filter((p) => p.categories.includes(c.slug)).length,
              img: TILE_FOR[v.slug]?.[c.slug] || TILE[c.slug],
            }));
            return (
              <article key={v.slug} id={v.slug} className={`${s.store} ${k ? s.storeAlt : ""}`} aria-labelledby={`${v.slug}-name`} data-reveal>
                <div className={s.info}>
                  <div className={s.infoTop}>
                    <h2 id={`${v.slug}-name`} className={s.name}>{v.name}</h2>
                    <p className={s.line}>{LINE[v.slug]}</p>
                  </div>
                  <dl className={s.stats}>
                    <div><dt>Products</dt><dd>{v.count}</dd></div>
                    <div><dt>Categories</dt><dd>{v.categories.length}</dd></div>
                    <div><dt>Prices from</dt><dd>{inr(minPrice(mine))}</dd></div>
                  </dl>
                  <Link prefetch={false} href={`/store/${v.slug}`} className={`btn ${k ? "btn--lime" : "btn--forest"} ${s.visit}`}>
                    Visit the {v.name} store <ArrowIcon />
                  </Link>
                </div>
                <ul className={`${s.tiles} ${tiles.length === 5 ? s.tiles5 : ""}`}>
                  {tiles.map((c) => (
                    <li key={c.slug}>
                      <Link prefetch={false} href={`/store/${v.slug}?category=${c.slug}`} className={`${s.tile} zoom`}>
                        <img src={c.img} alt="" width="900" height="900" loading="lazy" />
                        <span className={s.tileText}>
                          <span className={s.tileName}>{c.name}</span>
                          <span className={`${s.tileTa} ta`} lang="ta">{c.nameTa}</span>
                        </span>
                        <span className={s.tileN}>{c.n} {c.n === 1 ? "product" : "products"}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {/* ---------- sell on Naadu Nalam (+ footer = one screen) */}
      <section id="sell" className={`${s.sell} fit-footer`} aria-labelledby="sell-title">
        <div className={`wrap ${s.sellWrap} fit-grow`}>
          <div className={s.sellHead}>
            <div className={s.sellIntro}>
              <h2 id="sell-title">Sell on Naadu Nalam</h2>
              <p>Naadu Nalam is a multi-vendor marketplace. Open your own store next to Naadu Nalam and Thaayanbu.</p>
            </div>
            <div className={`btn-row ${s.sellBtns}`}>
              <Link prefetch={false} href="/contact?topic=sell" className="btn btn--forest">Ask about selling <ArrowIcon /></Link>
              <Link prefetch={false} href="/shop" className="btn btn--ghost">Browse the marketplace</Link>
            </div>
          </div>
          <ul className={s.sellCards}>
            {SELL.map(([src, title, text]) => (
              <li key={title} className={s.sellCard}>
                <span className={`${s.sellImg} zoom`}><img src={src} alt="" width="900" height="900" loading="lazy" /></span>
                <span className={s.sellBody}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className={s.sellNote}>
            Vendor sign-in and registration are handled by the current Naadu Nalam store and are not part of this preview.
          </p>
        </div>
      </section>
    </div>
  );
}
