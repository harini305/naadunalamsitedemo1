import { notFound } from "next/navigation";
import ShopView from "@/components/ShopView";
import { sellers, getSeller } from "@/lib/catalog";

export const dynamicParams = false;
export function generateStaticParams() {
  return sellers.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const v = getSeller(slug);
  if (!v) return {};
  return {
    title: `${v.name} Store`,
    description: `${v.count} products from the ${v.name} storefront on Naadu Nalam: ${v.categories.map((c) => c.name).join(", ")}.`,
    alternates: { canonical: `/store/${v.slug}` },
  };
}

export default async function StorePage({ params }) {
  const { slug } = await params;
  const v = getSeller(slug);
  if (!v) notFound();
  return (
    <div className="page">
      <ShopView vendor={v.name} lockVendor syncUrl title={v.name} intro={`${v.count} products on the Naadu Nalam marketplace. Add items from any seller and check out once.`} showQuick={false} />
    </div>
  );
}
