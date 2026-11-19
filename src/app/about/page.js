import Link from "next/link";
import { generations, site } from "@/lib/site";
import s from "./about.module.css";

export const metadata = {
  title: "About Naadu Nalam",
  description:
    "Naadu Nalam brings the goodness of traditional Tamil Nadu foods and natural products closer to your home — traditional rice, siruthaniyam, pulses, cold-pressed oils, natural sweeteners and everyday podis.",
  alternates: { canonical: "/about" },
};

const WHY = [
  ["Naturally Sourced", "We focus on products that stay close to their natural form and traditional roots."],
  ["Traditional Varieties", "Discover traditional rice varieties, siruthaniyam, pulses and other ingredients deeply connected to Tamil food culture."],
  ["Supporting Farmers", "We believe in creating a stronger connection between the people who grow our food and the people who consume it."],
  ["From Farm to Family", "Our goal is to make traditional products accessible for everyday households."],
];

/* "Our Product Philosophy" — verbatim variety lists. Seeraga Samba is omitted from
   Traditional Rice because it is not in the current catalogue (owner question 13/09). */
const PHILOSOPHY = [
  ["Traditional Rice", "rice-grains", "/images/categories/cat-rice-grains.webp", ["Kichili Samba", "Karudan Samba", "Kudavaazhai", "Moongil Arisi"]],
  ["Siruthaniyam", "siruthaniyam", "/images/categories/cat-siruthaniyam.webp", ["Samai", "Thinai", "Kuthiraivali", "Varagu", "Kambu", "Cholam", "Kezhvaragu"]],
  ["Paruppu & Pulses", "paruppu-pulses", "/images/categories/cat-paruppu-pulses.webp", ["Kadalai Paruppu", "Thuvaram Paruppu", "Pachai Payaru", "Ulundhu", "Kondakadalai"]],
  ["Natural Sweeteners", "natural-sweeteners", "/images/categories/cat-natural-sweeteners.webp", ["Naattu Sarkkarai", "Karuppatti", "Vellam", "Panangkarkandu", "Then"]],
  ["Masala & Powders", "masala-podi", "/images/categories/cat-masala-podi.webp", ["Sambar Podi", "Kuzhambu Podi", "Rasam Podi", "Milagai Podi"]],
  ["Traditional Oils & Ghee", "oil-vinegers", "/images/categories/cat-oil-vinegers.webp", ["Nallennai", "Kadalai Ennai", "Thengai Ennai", "Mallamaattu Nei"]],
];

const STEPS = [
  ["Explore", "Browse traditional and natural products across our collection."],
  ["Choose", "Select the products that suit your home and everyday needs."],
  ["Order", "Add your products to the cart and complete your order."],
  ["Receive", "Get your order delivered and enjoy the goodness at home."],
];

const REVIEWS = [
  ["No paid reviews", "We do not write, buy or incentivise reviews."],
  ["Nothing hidden", "We do not delete a review because it is negative."],
  ["Removed only for abuse", "We remove reviews only if they contain abuse, personal information, or spam."],
  ["Your chosen name", "Reviews are attributed to the name the reviewer chooses to display."],
];

export default function AboutPage() {
  return (
    <div className="page">
      <header className="phead">
        <h1>About Naadu Nalam</h1>
        <span className="phead__ta ta" lang="ta">{site.tamilLine}</span>
        <p>Naadu Nalam brings the goodness of traditional Tamil Nadu foods and natural products closer to your home.</p>
      </header>

      {/* soil → home, with the seven generations */}
      <section className={s.soil} aria-labelledby="soil-title">
        <div className={`wrap ${s.soilGrid}`}>
          <div className={s.soilText} data-reveal>
            <h2 id="soil-title">From our soil to your home</h2>
            <p className="lead">Good food begins with good soil.</p>
            <p>
              Tamil Nadu has a rich agricultural heritage filled with traditional grains, rice varieties, native
              ingredients and time-tested food practices. At Naadu Nalam, we bring these products together in one
              place so you can discover and enjoy the foods that have been part of our culture for generations.
            </p>
            <ol className={s.gens} aria-label="Seven generations — ஏழு தலைமுறை">
              {generations.map((g, i) => (
                <li key={g} style={{ "--i": i }}>
                  <span className="ta" lang="ta">{g}</span>
                </li>
              ))}
            </ol>
            <p className={`${s.gensNote} small muted`}>
              <span className="ta" lang="ta">ஏழு தலைமுறை</span> — the seven generations of a Tamil family, from parents
              to the earliest ancestors.
            </p>
          </div>
          <ul className={s.why} data-reveal>
            {WHY.map(([t, d]) => (
              <li key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* product philosophy */}
      <section className={s.philo} aria-labelledby="philo-title">
        <div className="wrap">
          <div className={s.philoHead} data-reveal>
            <h2 id="philo-title">Our product philosophy</h2>
            <p>
              Explore traditional rice varieties, siruthaniyam, pulses, cold-pressed oils, natural sweeteners and
              everyday podis — brought together in one place for your kitchen.
            </p>
          </div>
          <ul className={s.philoGrid}>
            {PHILOSOPHY.map(([t, slug, img, items]) => (
              <li key={t} data-reveal>
                <Link prefetch={false} href={`/product-category/${slug}`} className={s.philoCard}>
                  <span className={`${s.philoImg} zoom`}>
                    <img src={img} alt="" width="900" height="900" loading="lazy" />
                  </span>
                  <span className={s.philoBody}>
                    <h3>{t}</h3>
                    <span className={s.varieties}>
                      {items.map((v) => <span key={v}>{v}</span>)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* more than a store + promise */}
      <section className={s.more} aria-labelledby="more-title">
        <div className={`wrap ${s.moreGrid}`}>
          <div data-reveal>
            <h2 id="more-title" className={s.quote}>We are preserving a way of life.</h2>
            <p className="lead">
              In a world where food is becoming increasingly processed and disconnected from its origins, Naadu Nalam
              wants to bring people closer to the foods and traditions that shaped Tamil households.
            </p>
            <ul className={s.storyLines}>
              <li>Every traditional grain has a story.</li>
              <li>Every native rice variety carries generations of knowledge.</li>
              <li>Every farmer plays a part in keeping that heritage alive.</li>
            </ul>
            <p>Naadu Nalam is our small step towards keeping that connection alive.</p>
          </div>
          <div className={s.promise} data-reveal>
            <h3>Our promise</h3>
            <ul>
              {site.values.map((v) => (
                <li key={v.tr}>
                  <span className={`${s.pTa} ta`} lang="ta">{v.ta}</span>
                  <span className={s.pEn}>{v.tr}, {v.en.toLowerCase()}</span>
                </li>
              ))}
            </ul>
            <p>
              Because when we choose better food, we don’t just nourish ourselves—we support our farmers, our soil and
              our heritage.
            </p>
          </div>
        </div>
      </section>

      {/* ordering + reviews */}
      <section className={s.order} aria-label="How ordering works and our review policy">
        <div className={`wrap ${s.orderGrid}`}>
          <div id="ordering" className={s.orderMain} data-reveal>
            <h2>How ordering works</h2>
            <ol className={s.steps}>
              {STEPS.map(([t, d]) => (
                <li key={t}>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </li>
              ))}
            </ol>
            <div className={s.facts}>
              <p><strong>Doorstep delivery</strong> Flat ₹50 per order.</p>
              <p><strong>Cash on delivery</strong> Pay when your order arrives.</p>
              <p><strong>Packing</strong> Orders are packed within 24–48 hours on business days (Monday–Saturday).</p>
            </div>
          </div>
          <div id="reviews" className={s.reviews} data-reveal>
            <h2>Our review policy</h2>
            <p className={s.reviewQuote}>We would rather show you nothing than show you reviews we wrote ourselves.</p>
            <ul>
              {REVIEWS.map(([t, d]) => (
                <li key={t}>
                  <strong>{t}</strong>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* closing */}
      <section className={`${s.closing} fit-footer`} aria-labelledby="about-closing">
        <div className={`${s.closingGrid} fit-grow`}>
          <div className={s.closingText} data-reveal>
            <h2 id="about-closing" className="ta" lang="ta">{site.closingTa}</h2>
            <p className="lead">{site.closingEn}</p>
            <div className="btn-row">
              <Link prefetch={false} href="/shop" className="btn btn--lime">Explore our products</Link>
              <Link prefetch={false} href="/contact" className="btn btn--ghost-light">Contact us</Link>
            </div>
          </div>
          <div className={s.closingImgs}>
            {[
              "/images/products/kudavaazhai-arisi.webp",
              "/images/products/nallennai.webp",
              "/images/categories/cat-natural-sweeteners.webp",
              "/images/products/samai-arisi.webp",
            ].map((src) => (
              <span key={src} className="zoom">
                <img src={src} alt="" width="1024" height="1024" loading="lazy" />
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
