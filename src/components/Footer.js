import Link from "next/link";
import { nav, policyLinks, site } from "@/lib/site";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="site-footer" className={s.footer}>
      <div className={s.top}>
        <Link prefetch={false} href="/" className={s.brand} aria-label="Naadu Nalam — home">
          <img src="/images/brand/emblem.webp" alt="" width="384" height="372" className={s.emblem} loading="lazy" />
          <span>
            <span className={s.name}>Naadu Nalam</span>
            <span className={s.tag}>{site.footerTagline}</span>
          </span>
        </Link>
        <nav className={s.links} aria-label="Footer">
          {nav.map((n) => (
            <Link prefetch={false} key={n.href} href={n.href}>{n.label}</Link>
          ))}
          <Link prefetch={false} href="/account">My account</Link>
        </nav>
        <div className={s.contact}>
          <a href={site.phoneHref}>{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
      <div className={s.base}>
        <span>{site.copyright}</span>
        <nav className={s.policies} aria-label="Policies">
          {policyLinks.map((p) => (
            <Link prefetch={false} key={p.href} href={p.href}>{p.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
