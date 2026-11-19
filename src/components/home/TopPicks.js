"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import s from "./home.module.css";

/* "Top Picks from Our Sellers" — category switcher (the original homepage had one).
   tabs: [{slug, name, nameTa, products: [...]}] prepared on the server. */
export default function TopPicks({ tabs }) {
  const [i, setI] = useState(0);
  const tab = tabs[i];

  return (
    <section className={s.picks} aria-labelledby="picks-title">
      <div className={`wrap ${s.picksGrid}`}>
        <div className={s.picksSide} data-reveal>
          <h2 id="picks-title">Top picks from our sellers</h2>
          <p className="muted">Choose a category to see what our sellers have listed.</p>
          <div className={s.tabs} role="tablist" aria-label="Categories">
            {tabs.map((t, k) => (
              <button
                key={t.slug}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-controls="picks-panel"
                className={`${s.tab} ${k === i ? s.tabOn : ""}`}
                onClick={() => setI(k)}
              >
                <span>{t.name}</span>
                <span className="ta" lang="ta">{t.nameTa}</span>
              </button>
            ))}
          </div>
          <Link prefetch={false} href={`/product-category/${tab.slug}`} className={`text-link ${s.picksAll}`}>
            All {tab.name.toLowerCase()}
          </Link>
        </div>
        <div id="picks-panel" role="tabpanel" className={`pgrid pgrid--4 ${s.picksCards}`} key={tab.slug}>
          {tab.products.map((p) => (
            <ProductCard key={p.slug} p={p} fill />
          ))}
        </div>
      </div>
    </section>
  );
}
