import Link from "next/link";
import { site } from "@/lib/site";
import s from "./home.module.css";

/* Last section: sized with the footer to fill one screen (.fit-footer).
   Photo: client-supplied — a Tamil family at home behind baskets of grains and pulses. */
export default function Closing() {
  return (
    <section className={`${s.closing} fit-footer`} aria-labelledby="closing-title">
      <div className={`wrap ${s.closingGrid} fit-grow`}>
        <div className={s.closingText} data-reveal>
          <h2 id="closing-title">We are preserving a way of life.</h2>
          <p>
            Every traditional grain has a story. Every native rice variety carries generations of knowledge. Every
            farmer plays a part in keeping that heritage alive.
          </p>
          <ul className={s.values}>
            {site.values.map((v) => (
              <li key={v.tr}>
                <span className="ta" lang="ta">{v.ta}</span>
                <span>{v.en}</span>
              </li>
            ))}
          </ul>
          <p className={`${s.closingTa} ta`} lang="ta">{site.closingTa}</p>
          <p className={s.closingEn}>{site.closingEn}</p>
          <div className="btn-row">
            <Link prefetch={false} href="/shop" className="btn btn--lime">Shop the marketplace</Link>
            <Link prefetch={false} href="/sellers#sell" className="btn btn--ghost-light">Sell on Naadu Nalam</Link>
          </div>
        </div>
        <figure className={s.closingMedia} data-reveal>
          <span className={s.closingBlob} aria-hidden="true" />
          <span className={s.closingFrame}>
            <img
              src="/images/home/family-home.webp"
              alt="Three generations of a Tamil family outside their tiled village home, with baskets of rice, millets and pulses in front of them"
              width="770"
              height="528"
              loading="lazy"
              data-parallax="6"
            />
          </span>
        </figure>
      </div>
    </section>
  );
}
