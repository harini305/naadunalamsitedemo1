import { CartView } from "@/components/CommerceViews";

export const metadata = { title: "Cart", description: "Your Naadu Nalam cart.", robots: { index: false } };

export default function Page() {
  return (
    <div className="page">
      <section className="commerce fit-footer">
        <div className="wrap fit-grow">
          <CartView />
        </div>
      </section>
    </div>
  );
}
