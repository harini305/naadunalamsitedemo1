import Link from "next/link";
import policies from "@/data/policies.json";
import { policyLinks, site } from "@/lib/site";
import s from "@/app/pages.module.css";

export function policyMeta(slug, description) {
  const p = policies[slug];
  return { title: p.title, description, alternates: { canonical: `/${slug}` } };
}

/* One template for the four legal pages. Text is verbatim from the live site
   (last updated 25/08/2026); outdated references are flagged in content-review.md. */
export default function PolicyPage({ slug }) {
  const p = policies[slug];
  return (
    <div className="page">
      <section className={`${s.policy} fit-footer`}>
        <div className={`wrap pin-split fit-grow ${s.policyGrid}`}>
          <aside className={`pin ${s.policySide}`}>
            <h1>{p.title}</h1>
            <p className="small muted">{p.updated}</p>
            <nav aria-label="Policies" className={s.policyNav}>
              {policyLinks.map((l) => (
                <Link prefetch={false} key={l.href} href={l.href} aria-current={l.href === `/${slug}` ? "page" : undefined}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className={s.policyContact}>
              <p><strong>Questions?</strong></p>
              <p><a href={site.phoneHref}>{site.phoneDisplay}</a></p>
              <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
              <p className="small">{site.hours[0]}</p>
            </div>
          </aside>
          <div className={s.policyBody}>
            <p className="lead">{p.intro}</p>
            <ol className={s.toc} aria-label="On this page">
              {p.sections.map((sec, i) => (
                <li key={i}><a href={`#s${i + 1}`}>{sec.heading}</a></li>
              ))}
            </ol>
            {p.sections.map((sec, i) => (
              <section key={i} id={`s${i + 1}`} className={s.policySec}>
                <h2>{sec.heading}</h2>
                {sec.lines.map((l, k) => <p key={k}>{l}</p>)}
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
