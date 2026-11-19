import { WishlistView } from "@/components/CommerceViews";

export const metadata = { title: "My Wishlist", description: "Products you have saved on Naadu Nalam.", robots: { index: false } };

export default function Page() {
  return (
    <div className="page">
      <section className="commerce fit-footer">
        <div className="wrap fit-grow">
          <WishlistView />
        </div>
      </section>
    </div>
  );
}
