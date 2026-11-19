import Link from "next/link";
import { orderedPrimary, categoryFrom, inr } from "@/lib/catalog";
import s from "./home.module.css";

export default function Categories() {
  return (
    <section className={s.cats} aria-labelledby="cats-title">
      <div className="wrap">
        <div className={s.catsHead} data-reveal>
          <h2 id="cats-title">The Tamil pantry, aisle by aisle</h2>
          <p className="lead muted">Everything on Naadu Nalam, grouped the way an Indian kitchen actually shops.</p>
          <Link prefetch={false} href="/shop" className="btn btn--forest">View all products</Link>
        </div>
        <ul className={s.catGrid}>
          {orderedPrimary.map((c) => (
            <li key={c.slug} data-reveal>
              <Link prefetch={false} href={`/product-category/${c.slug}`} className={s.cat}>
                <span className={`${s.catImg} zoom`}>
                  <span className={s.catPlx} data-parallax="5">
                    {c.image && <img src={c.image.src} alt="" width={c.image.w} height={c.image.h} loading="lazy" />}
                  </span>
                </span>
                <span className={s.catName}>{c.name}</span>
                <span className={`${s.catTa} ta`} lang="ta">{c.nameTa}</span>
                <span className={s.catMeta}>
                  {c.count} {c.count === 1 ? "product" : "products"}, from {inr(categoryFrom(c.slug))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
