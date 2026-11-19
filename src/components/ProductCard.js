"use client";

import Link from "next/link";
import { inr } from "@/lib/catalog";
import { useCart } from "./CartProvider";
import { HeartIcon, PlusIcon } from "./Icons";

export default function ProductCard({ p, eager = false, fill = false }) {
  const { add, wish, toggleWish } = useCart();
  const img = p.images[0];
  const saved = wish.includes(p.slug);
  const hasVariants = p.variants.length > 0;
  const priceLabel = hasVariants ? `${inr(p.variants[0].price)} – ${inr(p.variants.at(-1).price)}` : inr(p.price);

  return (
    <article className={`pcard${fill ? " pcard--fill" : ""}`}>
      <Link prefetch={false} href={`/product/${p.slug}`} className={`pcard__media zoom${img?.label ? " is-label" : ""}`}>
        {img && (
          <img
            src={img.src}
            alt={img.alt}
            width={img.w}
            height={img.h}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
          />
        )}
      </Link>
      <button
        type="button"
        className={`pcard__wish${saved ? " is-on" : ""}`}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
        onClick={() => toggleWish(p.slug)}
      >
        <HeartIcon filled={saved} />
      </button>
      <div className="pcard__body">
        <Link prefetch={false} href={`/product/${p.slug}`} className="pcard__title">
          <span className="pcard__name" title={p.name}>{p.name}</span>
          <span className="pcard__ta ta" title={p.nameTa}>{p.nameTa}</span>
        </Link>
        <div className="pcard__foot">
        <p className="pcard__meta">{p.pack.join(" / ")} · {p.vendor}</p>
        <div className="pcard__row">
          <span className="pcard__price">{priceLabel}</span>
          {hasVariants ? (
            <Link prefetch={false} href={`/product/${p.slug}`} className="pcard__add pcard__add--text" aria-label={`Choose a pack for ${p.name}`}>
              Choose pack
            </Link>
          ) : (
            <button type="button" className="pcard__add" onClick={() => add(p.slug, p.pack[0], 1)} aria-label={`Add ${p.name} to cart`}>
              <PlusIcon />
            </button>
          )}
        </div>
        </div>
      </div>
    </article>
  );
}
