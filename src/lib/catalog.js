import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";

export const products = productsData;
export const categories = categoriesData;

/* Personal Care holds the same 2 products as Herbal & Wellness, and Honey is a
   single product also listed under Natural Sweeteners (audit 08 #12–13).
   They keep their routes but are not shown as separate tiles. */
export const DUPLICATE_CATEGORIES = ["personal-care", "honey"];

export const primaryCategories = categories.filter((c) => !DUPLICATE_CATEGORIES.includes(c.slug));

/* Display order — follows the original homepage "Popular Categories" order */
const ORDER = [
  "rice-grains", "aval-flakes", "siruthaniyam", "paruppu-pulses", "oil-vinegers",
  "natural-sweeteners", "health-mixes", "masala-podi", "other-rice", "herbal-wellness",
  "personal-care", "honey",
];
export const orderedCategories = [...categories].sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));
export const orderedPrimary = orderedCategories.filter((c) => !DUPLICATE_CATEGORIES.includes(c.slug));

export const sellers = [
  { slug: "naadunalam", name: "Naadu Nalam" },
  { slug: "thaayanbu", name: "Thaayanbu" },
].map((s) => {
  const list = products.filter((p) => p.vendor === s.name);
  const catSlugs = [...new Set(list.flatMap((p) => p.categories))].filter((c) => !DUPLICATE_CATEGORIES.includes(c));
  return { ...s, count: list.length, categories: orderedCategories.filter((c) => catSlugs.includes(c.slug)) };
});

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}
export function getCategory(slug) {
  return categories.find((c) => c.slug === slug);
}
export function getSeller(slug) {
  return sellers.find((s) => s.slug === slug);
}
export function productsIn(slug) {
  return products.filter((p) => p.categories.includes(slug));
}
export function minPrice(list) {
  return Math.min(...list.flatMap((p) => (p.variants.length ? p.variants.map((v) => v.price) : [p.price])));
}
export function categoryFrom(slug) {
  return minPrice(productsIn(slug));
}
export function primaryCategoryOf(p) {
  return getCategory(p.categories.find((c) => !DUPLICATE_CATEGORIES.includes(c)) || p.categories[0]);
}
export function relatedProducts(p, n = 4) {
  const cat = primaryCategoryOf(p)?.slug;
  return products.filter((x) => x.slug !== p.slug && x.categories.includes(cat)).slice(0, n);
}

export const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

/* Delivery: the shipping policy says "a flat delivery fee of ₹50 per order".
   The live checkout lists the ₹50 line per seller — unresolved (content-review.md). */
export const DELIVERY_FEE = 50;
