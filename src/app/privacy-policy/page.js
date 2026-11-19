import PolicyPage, { policyMeta } from "@/components/PolicyPage";

export const metadata = policyMeta("privacy-policy", "How Naadu Nalam collects, uses and protects your personal information.");

export default function Page() {
  return <PolicyPage slug="privacy-policy" />;
}
