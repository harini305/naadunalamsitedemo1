import "./globals.css";
import "./shared.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import { CartProvider } from "@/components/CartProvider";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  // Final domain not confirmed yet (content-review.md) — the Vercel URL is used until SITE_URL is set.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Naadu Nalam (நாடு நலம்) — Traditional Tamil Nadu Foods Marketplace",
    template: "%s — Naadu Nalam",
  },
  description:
    "Naadu Nalam brings the goodness of traditional Tamil Nadu foods and natural products closer to your home — native rice, aval, millets, pulses, cold-pressed oils, ghee, masala powders and natural sweeteners from independent sellers.",
  openGraph: { siteName: "Naadu Nalam", locale: "en_IN", type: "website" },
};

export const viewport = { themeColor: "#224b37" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/fraunces-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/hind-madurai-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/hind-madurai-tamil-600-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Motion />
        </CartProvider>
      </body>
    </html>
  );
}
