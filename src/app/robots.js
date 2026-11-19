import { SITE_URL as BASE } from "@/lib/site";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/account", "/wishlist"] },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
