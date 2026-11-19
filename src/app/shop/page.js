import ShopView from "@/components/ShopView";

export const metadata = {
  title: "Shop All Products",
  description:
    "Browse all 82 traditional Tamil Nadu foods on Naadu Nalam — native rice, aval, millets, pulses, health mixes, cold-pressed oils, ghee, masala powders and natural sweeteners.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <div className="page">
      <ShopView
        syncUrl
        title="Shop the marketplace"
        titleTa="நம் மண்ணிலிருந்து, உங்கள் வீட்டிற்கு"
        intro="82 traditional products from 2 independent sellers, delivered for a flat ₹50 with cash on delivery."
      />
    </div>
  );
}
