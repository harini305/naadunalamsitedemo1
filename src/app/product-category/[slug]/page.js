import { notFound } from "next/navigation";
import ShopView from "@/components/ShopView";
import { categories, getCategory, categoryFrom, inr } from "@/lib/catalog";

export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return {
    title: `${c.name} (${c.nameTa})`,
    description: `${c.description || `${c.name} on Naadu Nalam.`} ${c.count} products from ${inr(categoryFrom(c.slug))}. Cash on delivery, flat ₹50 delivery.`,
    alternates: { canonical: `/product-category/${c.slug}` },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  return (
    <div className="page">
      <ShopView category={c.slug} title={c.name} titleTa={c.nameTa} intro={c.description || `${c.count} products on the marketplace.`} showQuick={false} />
    </div>
  );
}
