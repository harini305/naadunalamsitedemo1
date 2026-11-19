/** @type {import('next').NextConfig} */
const legacy = [
  // original WordPress routes → new routes (audit 02 §F)
  ["/about-us", "/about"],
  ["/services", "/about#ordering"],
  ["/testimonials", "/about#reviews"],
  ["/store-listing", "/sellers"],
  ["/vendor-login", "/sellers#sell"],
  ["/my-account", "/account"],
  ["/my-orders", "/account"],
  ["/dashboard", "/sellers#sell"],
  ["/compare", "/shop"],
  ["/newsletter", "/blog"],
  ["/brand/naadu-nalam", "/shop"],
  ["/product-category/spices", "/shop"],
  ["/product-category/fresh-fruits", "/shop"],
  ["/product-category/fresh-vegetables", "/shop"],
  ["/product-category/grocery-frozen", "/shop"],
  ["/product-category/uncategorized", "/shop"],
  ["/research-articles", "/blog"],
  ["/events", "/about"],
  ["/calendar", "/about"],
  ["/collaborators", "/about"],
  ["/collaborators/:slug", "/about"],
  ["/store/superadmin", "/sellers"],
  ["/cold-pressed-vs-refined-oils", "/blog/cold-pressed-vs-refined-oils"],
  ["/many-sellers-one-basket", "/blog/many-sellers-one-basket"],
  ["/choosing-your-honey", "/blog/choosing-your-honey"],
];

const nextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  agentRules: false,
  // static images and fonts are versioned by filename — cache them for a year
  async headers() {
    const longCache = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/images/:path*", headers: longCache },
      { source: "/fonts/:path*", headers: longCache },
    ];
  },
  async redirects() {
    return legacy.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
