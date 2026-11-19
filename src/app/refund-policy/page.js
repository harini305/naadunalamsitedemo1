import PolicyPage, { policyMeta } from "@/components/PolicyPage";

export const metadata = policyMeta("refund-policy", "Naadu Nalam's return and refund policy: eligibility, damaged or incorrect items, refunds and cancellations.");

export default function Page() {
  return <PolicyPage slug="refund-policy" />;
}
