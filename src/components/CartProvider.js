"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getProduct, DELIVERY_FEE } from "@/lib/catalog";

/* Client-side cart + wishlist for the frontend preview.
   Stored in this browser only (localStorage). Nothing is sent to the live store. */
const CartCtx = createContext(null);
const CART_KEY = "nn-cart-v1";
const WISH_KEY = "nn-wish-v1";

function read(key) {
  try {
    const v = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function write(key, v) {
  try {
    window.localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wish, setWish] = useState([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    // keep only items that still exist in the catalogue
    setItems(read(CART_KEY).filter((i) => getProduct(i.slug)));
    setWish(read(WISH_KEY).filter((s) => getProduct(s)));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) write(CART_KEY, items); }, [items, ready]);
  useEffect(() => { if (ready) write(WISH_KEY, wish); }, [wish, ready]);

  const add = useCallback((slug, pack, qty = 1) => {
    const p = getProduct(slug);
    if (!p) return;
    const variant = p.variants.find((v) => v.pack === pack);
    const price = variant ? variant.price : p.price;
    const usePack = pack || p.pack[0];
    const key = `${slug}|${usePack}`;
    setItems((cur) => {
      const found = cur.find((i) => i.key === key);
      if (found) return cur.map((i) => (i.key === key ? { ...i, qty: Math.min(99, i.qty + qty) } : i));
      return [...cur, { key, slug, pack: usePack, price, qty }];
    });
    clearTimeout(timer.current);
    setToast({ name: p.name, nameTa: p.nameTa, qty });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const setQty = useCallback((key, qty) => {
    setItems((cur) => (qty <= 0 ? cur.filter((i) => i.key !== key) : cur.map((i) => (i.key === key ? { ...i, qty: Math.min(99, qty) } : i))));
  }, []);
  const remove = useCallback((key) => setItems((cur) => cur.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);
  const toggleWish = useCallback((slug) => setWish((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug])), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    const delivery = items.length ? DELIVERY_FEE : 0;
    return { items, wish, ready, count, subtotal, delivery, total: subtotal + delivery, add, setQty, remove, clear, toggleWish };
  }, [items, wish, ready, add, setQty, remove, clear, toggleWish]);

  return (
    <CartCtx.Provider value={value}>
      {children}
      <div className={`cart-toast${toast ? " is-on" : ""}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span>
              Added to cart: <strong>{toast.name}</strong>
            </span>
            <Link prefetch={false} href="/cart" className="cart-toast__link">View cart</Link>
          </>
        )}
      </div>
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
