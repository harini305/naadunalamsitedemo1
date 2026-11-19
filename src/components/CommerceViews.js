"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import ProductCard from "./ProductCard";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon } from "./Icons";
import { getProduct, inr, DELIVERY_FEE } from "@/lib/catalog";
import { site } from "@/lib/site";
import s from "@/app/pages.module.css";

const SUGGEST = ["karudan-samba-arisi", "cold-pressed-sesame-oil", "samai-arisi", "urundai-vellam"];

export function PreviewNotice({ children }) {
  return (
    <div className="notice" role="note">
      <span aria-hidden="true">ⓘ</span>
      <span>
        <strong>Preview store.</strong> {children}
      </span>
    </div>
  );
}

function Suggestions({ title = "You may also like", exclude = [] }) {
  const list = [...SUGGEST, "kudavaazhai-arisi", "groundnut-oil"].filter((x) => !exclude.includes(x)).slice(0, 4);
  return (
    <div className={s.suggest}>
      <h2>{title}</h2>
      <div className="pgrid pgrid--4">
        {list.map((slug) => <ProductCard key={slug} p={getProduct(slug)} />)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ cart */
export function CartView() {
  const { items, ready, subtotal, delivery, total, setQty, remove, count } = useCart();
  if (!ready) return <div className={s.loading} aria-busy="true" />;

  if (!items.length) {
    return (
      <div className={s.emptyCart}>
        <div className={s.emptyBox}>
          <h1>Your cart is empty</h1>
          <p className="lead muted">From our farms to your home — start with a staple.</p>
          <Link prefetch={false} href="/shop" className="btn btn--forest">Start shopping</Link>
        </div>
        <Suggestions />
      </div>
    );
  }

  // group lines by seller — the marketplace has independent storefronts
  const bySeller = items.reduce((m, i) => {
    const v = getProduct(i.slug).vendor;
    (m[v] ||= []).push(i);
    return m;
  }, {});

  return (
    <div className={s.cartGrid}>
      <div className={s.cartMain}>
        <h1 className={s.cartTitle}>Your cart <span className="muted">({count} {count === 1 ? "item" : "items"})</span></h1>
        {Object.entries(bySeller).map(([vendor, lines]) => (
          <div key={vendor} className={s.cartGroup}>
            <p className={s.cartSeller}>Sold by {vendor}</p>
            <ul className={s.lines}>
              {lines.map((i) => {
                const p = getProduct(i.slug);
                const img = p.images[0];
                return (
                  <li key={i.key} className={s.line}>
                    <Link prefetch={false} href={`/product/${p.slug}`} className={`${s.lineImg} ${img?.label ? s.lineLabel : ""}`}>
                      {img && <img src={img.src} alt="" width="160" height="160" loading="lazy" />}
                    </Link>
                    <div className={s.lineInfo}>
                      <Link prefetch={false} href={`/product/${p.slug}`} className={s.lineName}>{p.name}</Link>
                      <span className="ta muted" lang="ta">{p.nameTa}</span>
                      <span className="small muted">{i.pack} · {inr(i.price)} each</span>
                    </div>
                    <div className="qty" role="group" aria-label={`Quantity of ${p.name}`}>
                      <button type="button" onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease quantity"><MinusIcon /></button>
                      <output>{i.qty}</output>
                      <button type="button" onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase quantity"><PlusIcon /></button>
                    </div>
                    <span className={s.lineTotal}>{inr(i.qty * i.price)}</span>
                    <button type="button" className={s.lineRemove} onClick={() => remove(i.key)} aria-label={`Remove ${p.name}`}><CloseIcon /></button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <Suggestions title="Add to your basket" exclude={items.map((i) => i.slug)} />
      </div>
      <aside className={s.summary}>
        <h2>Order summary</h2>
        <dl>
          <div><dt>Subtotal</dt><dd>{inr(subtotal)}</dd></div>
          <div><dt>Delivery (flat)</dt><dd>{inr(delivery)}</dd></div>
          <div className={s.sumTotal}><dt>Total</dt><dd>{inr(total)}</dd></div>
        </dl>
        <p className="small muted">Payment: Cash on delivery — pay when your order arrives.</p>
        <Link prefetch={false} href="/checkout" className="btn">Proceed to checkout</Link>
        <Link prefetch={false} href="/shop" className="text-link">Continue shopping</Link>
        <PreviewNotice>
          Your cart is saved in this browser only. The shipping policy states a flat {inr(DELIVERY_FEE)} per order;
          whether a basket from two sellers pays it once or per seller is still being confirmed.
        </PreviewNotice>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ checkout */
const FIELDS = [
  ["email", "Email address", "email", "email", true, ""],
  ["phone", "Phone", "tel", "tel", true, ""],
  ["first", "First name", "text", "given-name", true, ""],
  ["last", "Last name", "text", "family-name", true, ""],
  ["street", "Street address", "text", "address-line1", true, "twoThirds"],
  ["apt", "Apartment, suite, unit (optional)", "text", "address-line2", false, "third"],
  ["city", "Town / City", "text", "address-level2", true, "third"],
  ["state", "State", "text", "address-level1", true, "third"],
  ["pin", "PIN code", "text", "postal-code", true, "third"],
];

export function CheckoutView() {
  const { items, ready, subtotal, delivery, total } = useCart();
  const [v, setV] = useState({ state: "Tamil Nadu", country: "India" });
  const [err, setErr] = useState({});
  const [reviewed, setReviewed] = useState(false);

  if (!ready) return <div className={s.loading} aria-busy="true" />;
  if (!items.length) {
    return (
      <div className={s.emptyCart}>
        <div className={s.emptyBox}>
          <h1>Checkout</h1>
          <p className="lead muted">Your cart is empty, so there is nothing to check out yet.</p>
          <Link prefetch={false} href="/shop" className="btn btn--forest">Start shopping</Link>
        </div>
      </div>
    );
  }

  const validate = (e) => {
    e.preventDefault();
    const n = {};
    FIELDS.forEach(([k, , , , req]) => { if (req && !String(v[k] || "").trim()) n[k] = "Required"; });
    if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) n.email = "Enter a valid email address";
    if (v.pin && !/^\d{6}$/.test(v.pin.trim())) n.pin = "Enter a 6-digit PIN code";
    if (v.phone && !/^(\+?91)?[6-9]\d{9}$/.test(v.phone.replace(/[\s-]/g, ""))) n.phone = "Enter a 10-digit mobile number";
    setErr(n);
    setReviewed(!Object.keys(n).length);
  };

  return (
    <form className={s.cartGrid} onSubmit={validate} noValidate>
      <div className={s.checkoutMain}>
        <h1 className={s.cartTitle}>Checkout <span className="muted">billing &amp; delivery, India</span></h1>
        <fieldset className={s.fields}>
          <legend className="visually-hidden">Billing and delivery details (India)</legend>
          {FIELDS.map(([k, label, type, ac, req, span]) => (
            <div className={`field ${span ? s[span] : ""}`} key={k}>
              <label htmlFor={`co-${k}`}>{label}{req ? " *" : ""}</label>
              <input
                id={`co-${k}`} type={type} autoComplete={ac} value={v[k] || ""}
                onChange={(e) => { setV((x) => ({ ...x, [k]: e.target.value })); setReviewed(false); }}
                aria-invalid={!!err[k]} aria-describedby={err[k] ? `co-${k}-e` : undefined}
              />
              {err[k] && <span id={`co-${k}-e`} className="err">{err[k]}</span>}
            </div>
          ))}
          <div className={`field ${s.wide}`}>
            <label htmlFor="co-notes">Order notes (optional)</label>
            <textarea id="co-notes" value={v.notes || ""} onChange={(e) => setV((x) => ({ ...x, notes: e.target.value }))} />
          </div>
        </fieldset>
      </div>
      <aside className={s.summary}>
        <PreviewNotice>
          Not connected to the live store yet: no real order can be placed and nothing you enter is sent. To order
          today, call <a href={site.phoneHref}>{site.phoneDisplay}</a>.
        </PreviewNotice>
        <h2>Your order</h2>
        <ul className={s.miniLines}>
          {items.map((i) => {
            const p = getProduct(i.slug);
            return (
              <li key={i.key}>
                <span>{p.name} <span className="muted">× {i.qty}</span><br /><span className={`small muted ${s.lineSub}`}>{i.pack} · {p.vendor}</span></span>
                <span>{inr(i.qty * i.price)}</span>
              </li>
            );
          })}
        </ul>
        <dl>
          <div><dt>Subtotal</dt><dd>{inr(subtotal)}</dd></div>
          <div><dt>Delivery (flat)</dt><dd>{inr(delivery)}</dd></div>
          <div className={s.sumTotal}><dt>Total</dt><dd>{inr(total)}</dd></div>
        </dl>
        <div className={s.payBox}>
          <p><strong>Cash on delivery</strong></p>
          <p className="small">Pay with cash upon delivery. No card details needed.</p>
        </div>
        <button type="submit" className="btn btn--forest">Check my details</button>
        {reviewed && (
          <div className="notice" role="status">
            <span aria-hidden="true">✓</span>
            <span>
              <strong>Your details look complete.</strong> This preview stops here: no order has been placed and
              nothing was sent. Real ordering needs the approved connection to the live store.
            </span>
          </div>
        )}
      </aside>
    </form>
  );
}

/* ------------------------------------------------------------------ wishlist */
export function WishlistView() {
  const { wish, ready, add, toggleWish } = useCart();
  if (!ready) return <div className={s.loading} aria-busy="true" />;
  const list = wish.map(getProduct).filter(Boolean);
  const priceOf = (p) => (p.variants.length ? p.variants[0].price : p.price);
  const packOf = (p) => (p.variants.length ? p.variants[0].pack : p.pack[0]);
  const total = list.reduce((n, p) => n + priceOf(p), 0);
  const moveAll = () => list.forEach((p) => add(p.slug, packOf(p), 1));

  if (!list.length) {
    return (
      <div className={s.wlEmpty}>
        <div className={s.wlHero}>
          <div className={s.wlHeroText}>
            <h1>My wishlist</h1>
            <p className="lead">Your favourite products, all in one place.</p>
            <div className={s.wlEmptyNote}>
              <h2>Your wishlist is empty</h2>
              <p>Save the products you love and come back to them any time — they will be waiting right here.</p>
            </div>
            <div className="btn-row">
              <Link prefetch={false} href="/shop" className="btn btn--lime">Browse products</Link>
              <Link prefetch={false} href="/product-category/rice-grains" className="btn btn--ghost-light">Traditional rice</Link>
            </div>
          </div>
          <div className={s.wlHeroImg}>
            <img src="/images/home/family-home.webp" alt="" width="770" height="528" loading="lazy" />
          </div>
        </div>
        <Suggestions title="Start with a few favourites" />
      </div>
    );
  }

  return (
    <div className={s.wl}>
      <div className={s.wlMain}>
        <div className={s.wlHead}>
          <h1 className={s.cartTitle}>My wishlist <span className="muted">({list.length} saved)</span></h1>
          <p className="lead muted">Your favourite products, all in one place.</p>
        </div>
        <ul className={s.wlList}>
          {list.map((p) => {
            const img = p.images[0];
            return (
              <li key={p.slug} className={s.wlRow}>
                <Link prefetch={false} href={`/product/${p.slug}`} className={`${s.wlImg} ${img?.label ? s.lineLabel : ""} zoom`}>
                  {img && <img src={img.src} alt={img.alt} width="240" height="240" loading="lazy" />}
                </Link>
                <div className={s.wlInfo}>
                  <Link prefetch={false} href={`/product/${p.slug}`} className={s.wlName}>{p.name}</Link>
                  <span className={`${s.wlTa} ta`} lang="ta">{p.nameTa}</span>
                  <span className={s.wlMeta}>{p.pack.join(" / ")} · Sold by {p.vendor}</span>
                </div>
                <div className={s.wlPriceBox}>
                  <span className={s.wlPrice}>{p.variants.length ? `from ${inr(priceOf(p))}` : inr(p.price)}</span>
                  <span className={s.wlPack}>{packOf(p)}</span>
                </div>
                <div className={s.wlActions}>
                  <button type="button" className={`btn btn--forest ${s.wlMove}`} onClick={() => { add(p.slug, packOf(p), 1); toggleWish(p.slug); }}>
                    <BagIcon /> Move to cart
                  </button>
                  <button type="button" className={s.wlRemove} onClick={() => toggleWish(p.slug)} aria-label={`Remove ${p.name} from wishlist`}>
                    <CloseIcon />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <Suggestions title="You may also like" exclude={list.map((p) => p.slug)} />
      </div>
      <aside className={s.wlSide}>
        <h2>Saved for later</h2>
        <dl>
          <div><dt>Items</dt><dd>{list.length}</dd></div>
          <div className={s.sumTotal}><dt>Total value</dt><dd>{inr(total)}</dd></div>
        </dl>
        <button type="button" className="btn btn--lime" onClick={moveAll}>Add all to cart</button>
        <Link prefetch={false} href="/shop" className="text-link">Continue shopping</Link>
        <p className={s.wlSideNote}>Saved in this browser only.</p>
        <div className={s.wlSideImg}>
          <img src="/images/home/family-home-elders.webp" alt="" width="314" height="314" loading="lazy" />
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ account */
export function AccountView() {
  const [tab, setTab] = useState("login");
  const [note, setNote] = useState(false);
  const fake = (e) => { e.preventDefault(); setNote(true); };
  return (
    <div className={s.account}>
      <div className={s.accountPanel}>
        <h1>My account</h1>
        <p className="lead">Sign in to see your orders, or create an account.</p>
        <PreviewNotice>
          Accounts live on the current Naadu Nalam store. This preview does not sign you in or create accounts, and
          nothing you type here is sent anywhere.
        </PreviewNotice>
        <div className={s.accountImg}>
          <img src="/images/categories/cat-oil-vinegers.webp" alt="" width="900" height="900" loading="lazy" />
        </div>
      </div>
      <div className={s.formCard}>
        <div className={s.accTabs} role="tablist">
          <button type="button" role="tab" aria-selected={tab === "login"} onClick={() => { setTab("login"); setNote(false); }}>Sign in</button>
          <button type="button" role="tab" aria-selected={tab === "register"} onClick={() => { setTab("register"); setNote(false); }}>Register</button>
        </div>
        {tab === "login" ? (
          <form onSubmit={fake} className={s.accForm}>
            <div className="field"><label htmlFor="ac-user">Username or email address</label><input id="ac-user" autoComplete="username" /></div>
            <div className="field"><label htmlFor="ac-pass">Password</label><input id="ac-pass" type="password" autoComplete="current-password" /></div>
            <button type="submit" className="btn btn--forest">Sign in</button>
          </form>
        ) : (
          <form onSubmit={fake} className={s.accForm}>
            <div className="field"><label htmlFor="ac-email">Email address</label><input id="ac-email" type="email" autoComplete="email" /></div>
            <p className="small muted">Sellers who want to open a shop can <Link prefetch={false} href="/sellers#sell" className="text-link">read about selling</Link>.</p>
            <button type="submit" className="btn btn--forest">Register</button>
          </form>
        )}
        {note && (
          <p className="notice" role="status">
            Sign-in and registration are not connected in this preview. Nothing was sent.
          </p>
        )}
      </div>
    </div>
  );
}

