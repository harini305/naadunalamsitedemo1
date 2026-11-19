import posts from "@/data/posts.json";
import JournalView from "@/components/JournalView";
import { getProduct } from "@/lib/catalog";

export const metadata = {
  title: "Journal",
  description: "Kitchen notes from Naadu Nalam: cold-pressed oils, choosing honey and how buying from many sellers in one basket works.",
  alternates: { canonical: "/blog" },
};

/* Curated: only the posts that match products currently sold (audit 03 §6).
   "Shop the stories" lists the products those posts discuss. */
const STORY_PRODUCTS = ["cold-pressed-sesame-oil", "groundnut-oil", "tulsi-infused-honey"];

export default function BlogPage() {
  return (
    <div className="page">
      <JournalView posts={posts} products={STORY_PRODUCTS.map(getProduct).filter(Boolean)} />
    </div>
  );
}
