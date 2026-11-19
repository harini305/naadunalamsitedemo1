/* Absolute site URL for metadata, sitemap and robots: SITE_URL when set (the final domain),
   otherwise the Vercel production URL, otherwise localhost. */
export const SITE_URL =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3520");

/* Verified business facts (docs/source-audit/03 §1, data/site-content.json).
   Unresolved items are deliberately left out — see content-review.md. */
export const site = {
  name: "Naadu Nalam",
  nameTa: "நாடு நலம்",
  phoneDisplay: "+91 90921 14630",
  phoneHref: "tel:+919092114630",
  email: "hello@naadunalam.in",
  // Three conflicting addresses exist (08 #1). Only the city is shown until the owner confirms.
  location: "Chennai, Tamil Nadu",
  hours: ["Monday to Saturday: 9:00 AM – 6:00 PM", "Sunday: Closed"],
  footerTagline: "Good Food, Brighter Tomorrow",
  copyright: "© 2026 Naadu Nalam. All rights reserved.",
  tamilLine: "நம்ம மண்ணின் சுவை. நம்ம மக்களின் நலம்.",
  closingTa: "நம் மண்ணிலிருந்து, உங்கள் வீட்டிற்கு",
  closingEn: "Goodness from our land. Goodness for your home.",
  values: [
    { ta: "நம்பிக்கை", tr: "Nambikkai", en: "Trust" },
    { ta: "நலம்", tr: "Nalam", en: "Well-being" },
    { ta: "மரபு", tr: "Marabu", en: "Tradition" },
  ],
};

/* Client-supplied seven generations — exact terms, exact order. Do not edit. */
export const generations = [
  "தாய் தந்தை",
  "தாத்தா பாட்டி",
  "பாட்டன் பாட்டி",
  "பூட்டன் பூட்டி",
  "ஓட்டன் ஓட்டி",
  "சேயோன் சேயோள்",
  "பரன் பரை",
];

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/sellers", label: "Sellers" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export const policyLinks = [
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/refund-policy", label: "Returns & Refund" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

export const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
