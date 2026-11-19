import Link from "next/link";
import { notFound } from "next/navigation";
import posts from "@/data/posts.json";
import { BackIcon } from "@/components/Icons";
import { fmtDate } from "@/lib/site";
import s from "../../pages.module.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", images: p.image ? [p.image.src] : [] },
  };
}

/* Body paragraphs are verbatim. Short lines without a full stop were sub-headings in the original. */
const isHeading = (t) => t.length < 60 && !/[.?!:]$/.test(t);

export default async function PostPage({ params }) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const others = posts.filter((x) => x.slug !== slug);

  return (
    <div className="page">
      <article className={s.article}>
        <div className={s.articleHead}>
          <Link prefetch={false} href="/blog" className={s.backLink}><BackIcon /> Journal</Link>
          <p className={s.postMeta}>{p.categories.join(", ")} — {fmtDate(p.date)}</p>
          <h1>{p.title}</h1>
        </div>
        {p.image && (
          <div className={s.articleImg}>
            <img src={p.image.src} alt="" width={p.image.w} height={p.image.h} fetchPriority="high" />
          </div>
        )}
        <div className={s.articleBody}>
          {p.body.map((t, i) => (isHeading(t) ? <h2 key={i}>{t}</h2> : <p key={i}>{t}</p>))}
        </div>
      </article>
      <section className={`${s.moreReads} fit-footer`} aria-labelledby="more-reads">
        <div className="wrap fit-grow">
          <h2 id="more-reads">More from the journal</h2>
          <div className={s.moreGrid}>
            {others.map((o) => (
              <Link prefetch={false} key={o.slug} href={`/blog/${o.slug}`} className={s.postRow}>
                <span className={`${s.postThumb} zoom`}>
                  <img src={o.image.src} alt="" width={o.image.w} height={o.image.h} loading="lazy" />
                </span>
                <span className={s.postBody}>
                  <span className={s.postMeta}>{fmtDate(o.date)}</span>
                  <h3 className={s.postRowTitle}>{o.title}</h3>
                  <span className={s.postEx}>{o.excerpt}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
