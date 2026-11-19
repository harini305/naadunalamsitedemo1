import { CheckoutView } from "@/components/CommerceViews";

export const metadata = { title: "Checkout", description: "Checkout — cash on delivery, flat ₹50 delivery.", robots: { index: false } };

export default function Page() {
  return (
    <div className="page">
      <section className="commerce fit-footer">
        <div className="wrap fit-grow">
          <CheckoutView />
        </div>
      </section>
    </div>
  );
}
