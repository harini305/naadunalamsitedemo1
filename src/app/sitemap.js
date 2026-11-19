import { products, categories, sellers } from "@/lib/catalog";
import posts from "@/data/posts.json";

/* Lists every page (including all 82 products, which the shop now shows 12 at a time). */
import { SITE_URL as BASE } from "@/lib/site";

export default function sitemap() {
  const pages = ["", "/shop", "/about", "/sellers", "/contact", "/blog", "/shipping-policy", "/refund-policy", "/terms", "/privacy-policy"];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: `${BASE}/product-category/${c.slug}`, changeFrequency: "weekly", priority: 0.7 })),
    ...products.map((p) => ({ url: `${BASE}/product/${p.slug}`, changeFrequency: "weekly", priority: 0.6 })),
    ...sellers.map((v) => ({ url: `${BASE}/store/${v.slug}`, changeFrequency: "weekly", priority: 0.5 })),
    ...posts.map((p) => ({ url: `${BASE}/blog/${p.slug}`, changeFrequency: "monthly", priority: 0.4 })),
  ];
}
