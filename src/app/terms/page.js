import PolicyPage, { policyMeta } from "@/components/PolicyPage";

export const metadata = policyMeta("terms", "The terms of service for buying on the Naadu Nalam marketplace.");

export default function Page() {
  return <PolicyPage slug="terms" />;
}
