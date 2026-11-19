import Link from "next/link";
import s from "./pages.module.css";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="page">
      <section className={`${s.notFound} fit-footer`}>
        <div className={`wrap fit-grow ${s.nfGrid}`}>
          <div className={s.nfText}>
            <h1>This page can’t be found.</h1>
            <p className="lead">It may have moved when the shop was redesigned. Everything we sell is still in the marketplace.</p>
            <div className="btn-row">
              <Link prefetch={false} href="/shop" className="btn btn--forest">Go to the shop</Link>
              <Link prefetch={false} href="/" className="btn btn--ghost">Back to home</Link>
            </div>
          </div>
          <div className={s.nfImg}>
            <img src="/images/categories/cat-rice-grains.webp" alt="" width="900" height="900" />
          </div>
        </div>
      </section>
    </div>
  );
}
