import PolicyPage, { policyMeta } from "@/components/PolicyPage";

export const metadata = policyMeta("shipping-policy", "How Naadu Nalam processes, dispatches and delivers orders: packing times, delivery timelines and the flat ₹50 delivery fee.");

export default function Page() {
  return <PolicyPage slug="shipping-policy" />;
}
