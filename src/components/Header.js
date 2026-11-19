"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";
import { useCart } from "./CartProvider";
import { BagIcon, HeartIcon, SearchIcon } from "./Icons";
import s from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { count, wish, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // hide the header once the footer is on screen
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    let inView = false;
    const update = () => setHidden(inView && window.scrollY > 40);
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; update(); }, { threshold: 0.02 });
    io.observe(footer);
    window.addEventListener("scroll", update, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", update); };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/") ||
    (href === "/shop" && (pathname.startsWith("/product") || pathname.startsWith("/product-category")));

  return (
    <header
      className={`${s.header} ${overHero && !scrolled && !open ? `${s.clear} ${s.onLight}` : s.solid} ${hidden && !open ? s.hidden : ""}`}
    >
      <div className={s.inner}>
        <Link prefetch={false} href="/" className={s.brand} aria-label="Naadu Nalam — home">
          <img src="/images/brand/emblem.webp" alt="" width="384" height="372" className={s.emblem} />
          <span className={s.word}>
            <span className={s.name}>Naadu Nalam</span>
            <span className={`${s.nameTa} ta`}>நாடு நலம்</span>
          </span>
        </Link>

        <div className={s.navGroup}>
        <nav className={s.nav} aria-label="Main">
          {nav.map((n) => (
            <Link prefetch={false} key={n.href} href={n.href} className={`${s.link} ${isActive(n.href) ? s.active : ""}`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className={s.tools}>
          <Link prefetch={false} href="/shop" className={`${s.icon} ${s.searchIcon}`} aria-label="Search products">
            <SearchIcon />
          </Link>
          <Link prefetch={false} href="/wishlist" className={s.icon} aria-label={`Wishlist${ready && wish.length ? `, ${wish.length} saved` : ""}`}>
            <HeartIcon />
            {ready && wish.length > 0 && <span className={s.dot} aria-hidden="true" />}
          </Link>
          <Link prefetch={false} href="/cart" className={s.cart} aria-label={`Cart, ${ready ? count : 0} items`}>
            <BagIcon />
            <span className={s.cartLabel}>Cart</span>
            <span className={s.count}>{ready ? count : 0}</span>
          </Link>
          <button
            type="button"
            className={s.burger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
        </div>
      </div>

      <div id="mobile-menu" className={`${s.menu} ${open ? s.menuOpen : ""}`} hidden={!open}>
        <nav aria-label="Mobile">
          {nav.map((n) => (
            <Link prefetch={false} key={n.href} href={n.href} className={s.menuLink} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <Link prefetch={false} href="/wishlist" className={s.menuLink} onClick={() => setOpen(false)}>Wishlist</Link>
          <Link prefetch={false} href="/account" className={s.menuLink} onClick={() => setOpen(false)}>My account</Link>
        </nav>
      </div>
    </header>
  );
}
