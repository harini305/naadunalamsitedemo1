"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { ArrowIcon, CashIcon, TruckIcon } from "./Icons";
import { fmtDate, site } from "@/lib/site";
import { sellers } from "@/lib/catalog";
import s from "./JournalView.module.css";

/* Journal — curated posts (only those matching products sold today) with topic filters,
   a featured article, the products the articles discuss, and a closing band. */
const readTime = (p) => `${Math.max(1, Math.round(p.body.join(" ").split(/\s+/).length / 200))} min read`;

export default function JournalView({ posts, products }) {
  const topics = useMemo(() => {
    const m = new Map();
    posts.forEach((p) => p.categories.forEach((c) => m.set(c, (m.get(c) || 0) + 1)));
    return [...m.entries()];
  }, [posts]);
  const [topic, setTopic] = useState("all");
  const list = topic === "all" ? posts : posts.filter((p) => p.categories.includes(topic));
  const [lead, ...rest] = list;
  const newest = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date))[0], [posts]);

  return (
    <>
      {/* ---------- header band: title | topic bar · Tamil line + intro | newest article */}
      <header className="pband">
        <div className="wrap pband__grid">
          <h1 className="pband__title">Journal</h1>
          <div className="pband__sub">
            <p className="pband__accent ta" lang="ta">{site.tamilLine}</p>
            <p className="pband__intro">
              Kitchen notes from Naadu Nalam — how to choose, cook and store traditional foods, and how buying from
              many sellers in one basket works.
            </p>
          </div>
          <div className="segbar pband__bar" role="group" aria-label="Topics">
            <button type="button" className="segbar__item" aria-pressed={topic === "all"} onClick={() => setTopic("all")}>
              All articles <span className="segbar__n">{posts.length}</span>
            </button>
            {topics.map(([t, n]) => (
              <button key={t} type="button" className="segbar__item" aria-pressed={topic === t} onClick={() => setTopic(t)}>
                {t} <span className="segbar__n">{n}</span>
              </button>
            ))}
          </div>
          <div className={`pband__extra ${s.extra}`}>
            <Link prefetch={false} href={`/blog/${newest.slug}`} className={s.latest}>
              <span className={s.latestTag}>Latest</span>
              <span className={s.latestTitle}>{newest.title}</span>
              <span className={s.latestDate}>{fmtDate(newest.date)}</span>
              <ArrowIcon />
            </Link>
            <a href="#stories" className={s.latest}>
              <span className={`${s.latestTag} ${s.shopTag}`}>Shop</span>
              <span className={s.latestTitle}>The oils and honey these articles talk about</span>
              <ArrowIcon />
            </a>
          </div>
        </div>
      </header>

      {/* ---------- featured + more */}
      <section className={s.articles} aria-label="Articles">
        <div className="wrap">
          {lead && (
            <article className={s.feature} data-reveal key={lead.slug}>
              <Link prefetch={false} href={`/blog/${lead.slug}`} className={`${s.featureImg} zoom`} tabIndex={-1} aria-hidden="true">
                <img src={lead.image.src} alt="" width={lead.image.w} height={lead.image.h} />
              </Link>
              <div className={s.featureBody}>
                <p className={s.meta}>
                  <span className={s.pill}>{lead.categories.join(", ")}</span>
                  <span>{fmtDate(lead.date)}</span>
                  <span className={s.dot} aria-hidden="true" />
                  <span>{readTime(lead)}</span>
                </p>
                <h2 className={s.featureTitle}>
                  <Link prefetch={false} href={`/blog/${lead.slug}`}>{lead.title}</Link>
                </h2>
                <p className={s.excerpt}>{lead.excerpt}</p>
                <p className={s.firstLine}>{lead.body[0]}</p>
                <Link prefetch={false} href={`/blog/${lead.slug}`} className={`btn btn--forest ${s.readBtn}`}>
                  Read the article <ArrowIcon />
                </Link>
              </div>
            </article>
          )}

          {rest.length > 0 && (
            <>
              <h2 className={s.sectionTitle}>More from the journal</h2>
              <div className={s.cards}>
                {rest.map((p) => (
                  <article key={p.slug} className={s.card} data-reveal>
                    <Link prefetch={false} href={`/blog/${p.slug}`} className={`${s.cardImg} zoom`} tabIndex={-1} aria-hidden="true">
                      <img src={p.image.src} alt="" width={p.image.w} height={p.image.h} loading="lazy" />
                    </Link>
                    <div className={s.cardBody}>
                      <p className={s.meta}>
                        <span className={s.pill}>{p.categories.join(", ")}</span>
                        <span>{fmtDate(p.date)}</span>
                        <span className={s.dot} aria-hidden="true" />
                        <span>{readTime(p)}</span>
                      </p>
                      <h3 className={s.cardTitle}>
                        <Link prefetch={false} href={`/blog/${p.slug}`}>{p.title}</Link>
                      </h3>
                      <p className={s.excerpt}>{p.excerpt}</p>
                      <Link prefetch={false} href={`/blog/${p.slug}`} className={`text-link ${s.cardLink}`}>Read the article</Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ---------- products the articles talk about (+ footer = one screen) */}
      <section id="stories" className={`${s.shopStories} fit-footer`} aria-labelledby="stories-title">
        <div className={`wrap ${s.storiesWrap} fit-grow`}>
          <div className={s.storiesHead}>
            <h2 id="stories-title">Shop the stories</h2>
            <p>The oils and honey these articles talk about, from the Naadu Nalam marketplace.</p>
          </div>
          <div className={s.storiesGrid}>
            <div className={s.cta}>
              <h3 className={s.ctaTitle}>Goodness in every meal</h3>
              <p className={`${s.ctaTa} ta`} lang="ta">நம் மண்ணிலிருந்து, உங்கள் வீட்டிற்கு</p>
              <p className={s.ctaText}>
                Everyday South Indian staples, sourced from Tamil Nadu growers and delivered to your door — so you can
                cook the way your family always has.
              </p>
              <ul className={s.facts}>
                <li><TruckIcon /> Flat ₹50 delivery</li>
                <li><CashIcon /> Cash on delivery</li>
              </ul>
              <Link prefetch={false} href="/shop" className={`btn btn--lime ${s.ctaBtn}`}>Shop the marketplace <ArrowIcon /></Link>
            </div>
            {products.map((p) => <ProductCard key={p.slug} p={p} fill />)}
            {/* built on the product-card frame so photo, title and footer line up with the cards beside it */}
            <article className={`pcard pcard--fill ${s.sellerCard}`}>
              <Link prefetch={false} href="/sellers" className="pcard__media zoom" tabIndex={-1} aria-hidden="true">
                <img src="/images/home/family-home-elders.webp" alt="" width="314" height="314" loading="lazy" />
              </Link>
              <div className="pcard__body">
                <div className="pcard__title">
                  <span className="pcard__name">Meet the sellers</span>
                  <span className="pcard__ta">Two storefronts, one basket</span>
                </div>
                <div className="pcard__foot">
                  <p className="pcard__meta">{sellers.map((v) => v.name).join(" · ")}</p>
                  <Link prefetch={false} href="/sellers" className={`pcard__row ${s.sellerRow}`}>
                    <span className={s.sellerCta}>Visit the sellers</span>
                    <span className="pcard__add" aria-hidden="true"><ArrowIcon /></span>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
