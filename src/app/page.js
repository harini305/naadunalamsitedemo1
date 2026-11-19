import Hero from "@/components/home/Hero";
import Generations from "@/components/home/Generations";
import Elements from "@/components/home/Elements";
import Categories from "@/components/home/Categories";
import TopPicks from "@/components/home/TopPicks";
import Sellers from "@/components/home/Sellers";
import Closing from "@/components/home/Closing";
import { getCategory, productsIn } from "@/lib/catalog";

export const metadata = {
  title: { absolute: "Naadu Nalam (நாடு நலம்) — Seven Generations of Tamil Food Heritage" },
  description:
    "Traditional Tamil Nadu foods from independent sellers: native rice, aval, millets, pulses, cold-pressed oils, ghee, masala powders and natural sweeteners. Cash on delivery, flat ₹50 delivery.",
  alternates: { canonical: "/" },
};

/* Top-picks tabs: categories with photographed products; health-claim mixes are
   not featured on the homepage until the owner confirms the claims (audit 08 §2). */
const PICKS = [
  ["rice-grains", ["karudan-samba-arisi", "kudavaazhai-arisi", "moongil-arisi", "kallundai-samba-rice"]],
  ["aval-flakes", ["bamboo-aval", "kattu-yanam-aval", "poongar-aval", "karunguruvai-aval"]],
  ["siruthaniyam", ["samai-arisi", "foxtail-millet-thinai", "kodo-millet-varagu", "kezhvaragu"]],
  ["oil-vinegers", ["cold-pressed-sesame-oil", "groundnut-oil", "cold-pressed-coconut-oil", "nallamaattu-nei"]],
  ["natural-sweeteners", ["urundai-vellam", "tulsi-infused-honey", "palm-jaggery-karupatti", "country-sugar-nattu-sakkarai"]],
];

export default function Home() {
  const tabs = PICKS.map(([slug, picks]) => {
    const c = getCategory(slug);
    const list = productsIn(slug);
    return {
      slug, name: c.name, nameTa: c.nameTa,
      products: picks.map((p) => list.find((x) => x.slug === p)).filter(Boolean),
    };
  });

  return (
    <>
      <Hero />
      <Generations />
      <Elements />
      <Categories />
      <TopPicks tabs={tabs} />
      <Sellers />
      <Closing />
    </>
  );
}
