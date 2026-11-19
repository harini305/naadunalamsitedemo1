import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import { BackIcon, CashIcon, PhoneIcon, TruckIcon } from "@/components/Icons";
import { products, getProduct, getCategory, primaryCategoryOf, relatedProducts, inr, DUPLICATE_CATEGORIES } from "@/lib/catalog";
import { site } from "@/lib/site";
import s from "./product.module.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const price = p.variants.length ? `${inr(p.variants[0].price)}–${inr(p.variants.at(-1).price)}` : inr(p.price);
  return {
    title: `${p.name} (${p.nameTa})`,
    description: `${p.short} ${p.pack.join(" / ")}, ${price}. Sold by ${p.vendor} on Naadu Nalam.`.trim(),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { images: p.images[0] ? [p.images[0].src] : [] },
  };
}

/* The long description is Tamil-only: intro, "சிறப்பம்சங்கள்" (highlights), then how to use/cook. */
function TamilDescription({ text }) {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const out = [];
  let bullets = null;
  lines.forEach((l, k) => {
    if (l === "சிறப்பம்சங்கள்") {
      out.push(<h3 key={k} className={s.descHead}>{l}</h3>);
      bullets = [];
      out.push(<ul key={k + "u"} className={s.descList}>{bullets}</ul>);
      return;
    }
    const m = l.match(/^([^:]{3,40}):\s*(.+)$/);
    if (m) {
      bullets = null;
      out.push(<p key={k}><strong>{m[1]}:</strong> {m[2]}</p>);
      return;
    }
    if (bullets) bullets.push(<li key={k}>{l}</li>);
    else out.push(<p key={k}>{l}</p>);
  });
  return <div className={`${s.desc} ta`} lang="ta">{out}</div>;
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = primaryCategoryOf(p);
  const related = relatedProducts(p, 4);
  const sellerSlug = p.vendor === "Thaayanbu" ? "thaayanbu" : "naadunalam";
  const cats = p.categories.filter((c) => !DUPLICATE_CATEGORIES.includes(c) || p.categories.length === 1).map(getCategory);

  return (
    <div className="page">
      <section className={s.product}>
        <div className="wrap">
          <Link prefetch={false} href={`/product-category/${cat.slug}`} className={s.back}>
            <BackIcon /> {cat.name}
          </Link>
          <div className={s.grid}>
            <div className={s.mediaCol}>
              <ProductGallery images={p.images} name={p.name} />
            </div>
            <div className={s.info}>
              <h1 className={s.title}>{p.name}</h1>
              <p className={`${s.ta} ta`} lang="ta">{p.nameTa}</p>
              {p.short && <p className={s.short}>{p.short}</p>}
              <AddToCart p={p} />
              <p className={s.seller}>
                Sold by <strong>{p.vendor}</strong>
                <Link prefetch={false} href={`/store/${sellerSlug}`} className="text-link">Visit store</Link>
              </p>
              <ul className={s.support}>
                <li><TruckIcon /> Flat ₹50 delivery</li>
                <li><CashIcon /> Cash on delivery — pay when your order arrives</li>
                <li><TruckIcon /> Packed and dispatched from Tamil Nadu</li>
                <li><PhoneIcon /> Questions? Call <a href={site.phoneHref}>{site.phoneDisplay}</a></li>
              </ul>
              {p.descTa && (
                <div className={s.descBox}>
                  <h2 className={s.descTitle}>Description</h2>
                  <TamilDescription text={p.descTa} />
                </div>
              )}
              <dl className={s.meta}>
                <div><dt>SKU</dt><dd>{p.sku}</dd></div>
                <div><dt>Pack</dt><dd>{p.pack.join(", ")}</dd></div>
                <div>
                  <dt>Category</dt>
                  <dd>
                    {cats.map((c, k) => (
                      <span key={c.slug}>
                        {k > 0 && ", "}
                        <Link prefetch={false} href={`/product-category/${c.slug}`} className={s.metaLink}>{c.name}</Link>
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt>Reviews</dt>
                  <dd>No reviews yet. <Link prefetch={false} href="/about#reviews" className={s.metaLink}>Our review policy</Link></dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`${s.related} fit-footer`} aria-labelledby="related-title">
          <div className="wrap fit-grow fit-col">
            <div className={s.relatedHead}>
              <h2 id="related-title">More from {cat.name}</h2>
              <Link prefetch={false} href={`/product-category/${cat.slug}`} className="btn btn--forest">View all {cat.count}</Link>
            </div>
            <div className="pgrid pgrid--4">
              {related.map((r) => <ProductCard key={r.slug} p={r} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
