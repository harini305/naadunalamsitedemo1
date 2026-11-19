"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { HeartIcon, MinusIcon, PlusIcon } from "./Icons";
import { inr } from "@/lib/catalog";
import s from "@/app/product/[slug]/product.module.css";

export default function AddToCart({ p }) {
  const { add, wish, toggleWish } = useCart();
  const [pack, setPack] = useState(p.variants.length ? p.variants[0].pack : p.pack[0]);
  const [qty, setQty] = useState(1);
  const price = p.variants.length ? p.variants.find((v) => v.pack === pack).price : p.price;
  const saved = wish.includes(p.slug);

  return (
    <div className={s.buy}>
      <div className={s.priceRow}>
        <span className={s.price}>{inr(price)}</span>
        <span className={s.pack}>{pack}</span>
      </div>
      {p.variants.length > 0 && (
        <fieldset className={s.packs}>
          <legend>Pack</legend>
          {p.variants.map((v) => (
            <button key={v.pack} type="button" className="chip" aria-pressed={pack === v.pack} onClick={() => setPack(v.pack)}>
              {v.pack} · {inr(v.price)}
            </button>
          ))}
        </fieldset>
      )}
      <div className={s.buyRow}>
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><MinusIcon /></button>
          <output aria-live="polite">{qty}</output>
          <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity"><PlusIcon /></button>
        </div>
        <button type="button" className={`btn ${s.addBtn}`} onClick={() => add(p.slug, pack, qty)}>
          Add to cart · {inr(price * qty)}
        </button>
        <button
          type="button"
          className={`${s.wishBtn} ${saved ? s.wishOn : ""}`}
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          onClick={() => toggleWish(p.slug)}
        >
          <HeartIcon filled={saved} />
        </button>
      </div>
    </div>
  );
}
