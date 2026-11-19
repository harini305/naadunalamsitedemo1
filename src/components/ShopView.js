"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { products, orderedPrimary, sellers, DUPLICATE_CATEGORIES } from "@/lib/catalog";
import { SearchIcon, TruckIcon, CashIcon, CloseIcon, ArrowIcon, BagIcon } from "./Icons";
import s from "./ShopView.module.css";

const PAGE = 12;
const SORTS = [
  ["featured", "Featured"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["name", "Name: A to Z"],
];
const QUICK = [
  "rice-grains", "aval-flakes", "siruthaniyam", "paruppu-pulses",
  "oil-vinegers", "masala-podi", "natural-sweeteners", "health-mixes",
];
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

/* Catalogue browser for /shop, /product-category/[slug] and /store/[slug].
   Header band (title + big search + quick categories) · filter card · 12 per page. */
export default function ShopView({
  title, titleTa, intro,
  category = "all", vendor = "all", lockVendor = false, syncUrl = false, showQuick = true,
}) {
  const [cat, setCat] = useState(category);
  const [seller, setSeller] = useState(vendor);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false); // mobile filter panel
  const top = useRef(null);

  useEffect(() => {
    if (!syncUrl) return;
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get("category");
    if (c && (orderedPrimary.some((x) => x.slug === c) || DUPLICATE_CATEGORIES.includes(c))) setCat(c);
    const query = sp.get("q");
    if (query) setQ(query);
  }, [syncUrl]);

  useEffect(() => setPage(1), [cat, seller, q, sort]);

  const choose = (slug) => {
    setCat(slug);
    setOpen(false);
    if (syncUrl) {
      const path = window.location.pathname;
      window.history.replaceState(null, "", slug === "all" ? path : `${path}?category=${slug}`);
    }
  };

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let r = products.filter(
      (p) =>
        (cat === "all" || p.categories.includes(cat)) &&
        (seller === "all" || p.vendor === seller) &&
        (!term || `${p.name} ${p.nameTa} ${p.short} ${p.sku}`.toLowerCase().includes(term))
    );
    const price = (p) => (p.variants.length ? p.variants[0].price : p.price);
    if (sort === "price-asc") r = [...r].sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") r = [...r].sort((a, b) => price(b) - price(a));
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [cat, seller, q, sort]);

  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const shown = list.slice((page - 1) * PAGE, page * PAGE);
  const goTo = (n) => {
    setPage(n);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const countFor = (slug) =>
    products.filter((p) => (slug === "all" || p.categories.includes(slug)) && (seller === "all" || p.vendor === seller)).length;
  const activeCat = orderedPrimary.find((c) => c.slug === cat);
  const filtersOn = cat !== category || (!lockVendor && seller !== "all") || q;
  const reset = () => { setQ(""); choose(category); if (!lockVendor) setSeller("all"); };
  const submit = (e) => { e.preventDefault(); top.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <>
      {/* ---------- header band: a 2 × 2 grid — title | search, Tamil + intro | category chips */}
      <header className={s.band}>
        <div className={`wrap ${s.bandGrid}`}>
          <h1 className={s.title}>{title}</h1>
          <div className={s.sub}>
            {titleTa && <p className={`${s.titleTa} ta`} lang="ta">{titleTa}</p>}
            {intro && <p className={s.intro}>{intro}</p>}
          </div>
          <form className={s.searchForm} role="search" onSubmit={submit}>
            <label className={s.search}>
              <SearchIcon />
              <span className="visually-hidden">Search products</span>
              <input type="search" placeholder="Search rice, millets, oils, podi…" value={q} onChange={(e) => setQ(e.target.value)} />
              {q && (
                <button type="button" className={s.clear} onClick={() => setQ("")} aria-label="Clear search"><CloseIcon /></button>
              )}
            </label>
            <button type="submit" className={`btn btn--forest ${s.searchBtn}`}>Search <ArrowIcon /></button>
          </form>
          {showQuick ? (
            <div className={s.quick} aria-label="Browse categories">
              <span className={s.quickLabel}>Browse:</span>
              {QUICK.map((slug) => {
                const c = orderedPrimary.find((x) => x.slug === slug);
                return (
                  <button key={slug} type="button" className={s.quickChip} aria-pressed={cat === slug} onClick={() => choose(slug)}>
                    {c.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <ul className={s.facts}>
              <li><TruckIcon /> Flat ₹50 delivery</li>
              <li><CashIcon /> Cash on delivery</li>
              <li><BagIcon /> One basket for every seller</li>
            </ul>
          )}
        </div>
      </header>

      <div className={`${s.shop} fit-footer`}>
        <div className={`wrap ${s.grid} fit-grow`}>
          {/* ---------- filter card */}
          <aside id="shop-filters" className={`${s.side} ${open ? s.sideOpen : ""}`} aria-label="Filters">
            <div className={s.sideHead}>
              <p className={s.sideTitle}><FilterIcon /> Filters</p>
              {filtersOn ? <button type="button" className={s.reset} onClick={reset}>Reset</button> : null}
            </div>

            <div className={s.block}>
              <p className={s.blockTitle}>Categories</p>
              <ul className={s.catList}>
                <li>
                  <button type="button" aria-pressed={cat === "all"} className={s.catRow} onClick={() => choose("all")}>
                    <span className={s.catName}>All products</span>
                    <span className={s.n}>{countFor("all")}</span>
                  </button>
                </li>
                {orderedPrimary.map((c) => {
                  const n = countFor(c.slug);
                  if (!n) return null;
                  return (
                    <li key={c.slug}>
                      <button type="button" aria-pressed={cat === c.slug} className={s.catRow} onClick={() => choose(c.slug)}>
                        <span className={s.catName}>
                          {c.name}
                          <span className={`${s.catTa} ta`} lang="ta">{c.nameTa}</span>
                        </span>
                        <span className={s.n}>{n}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {!lockVendor && (
              <div className={s.block}>
                <p className={s.blockTitle}>Seller</p>
                <div className={s.segment} role="group" aria-label="Seller">
                  {[{ name: "all", label: "All" }, ...sellers.map((v) => ({ name: v.name, label: v.name }))].map((v) => (
                    <button key={v.name} type="button" aria-pressed={seller === v.name} onClick={() => setSeller(v.name)}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={s.note}>
              <p><TruckIcon /> <span><strong>Flat ₹50 delivery</strong> on every order</span></p>
              <p><CashIcon /> <span>Cash on delivery — pay when your order arrives</span></p>
              <Link prefetch={false} href="/about#ordering" className={s.noteLink}>How ordering works</Link>
            </div>
          </aside>

          {/* ---------- results */}
          <div className={s.main}>
            <div ref={top} id="shop-top" className={s.bar}>
              <div className={s.barLeft}>
                <button type="button" className={s.toggle} aria-expanded={open} aria-controls="shop-filters" onClick={() => setOpen((o) => !o)}>
                  <FilterIcon /> {open ? "Hide filters" : "Filters"}
                </button>
                <p className={s.count} aria-live="polite">
                  {list.length ? `Showing ${(page - 1) * PAGE + 1}–${Math.min(page * PAGE, list.length)} of ${list.length}` : "0 products"}
                </p>
                {activeCat && cat !== category && (
                  <button type="button" className={s.activeChip} onClick={() => choose(category)} aria-label={`Remove ${activeCat.name} filter`}>
                    {activeCat.name} <CloseIcon />
                  </button>
                )}
              </div>
              <label className={s.sort}>
                <span>Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORTS.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </label>
            </div>

            {shown.length ? (
              <div className="pgrid pgrid--shop">
                {shown.map((p, i) => (
                  <ProductCard key={p.slug} p={p} eager={i < 4} />
                ))}
              </div>
            ) : (
              <div className={s.empty}>
                <p>No products match “{q}”.</p>
                <button type="button" className="btn btn--forest" onClick={reset}>Show all products</button>
              </div>
            )}

            {pages > 1 && (
              <nav className={s.pager} aria-label="Pages">
                <button type="button" className={s.pgStep} disabled={page === 1} onClick={() => goTo(page - 1)}>Previous</button>
                <div className={s.pgNums}>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <button key={n} type="button" aria-current={n === page ? "page" : undefined} className={s.pgNum} onClick={() => goTo(n)}>
                      {n}
                    </button>
                  ))}
                </div>
                <button type="button" className={s.pgStep} disabled={page === pages} onClick={() => goTo(page + 1)}>Next</button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
