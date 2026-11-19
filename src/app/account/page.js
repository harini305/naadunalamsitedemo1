import { AccountView } from "@/components/CommerceViews";

export const metadata = { title: "My Account", description: "Sign in or register for a Naadu Nalam account.", robots: { index: false } };

export default function Page() {
  return (
    <div className="page">
      <section className="commerce fit-footer">
        <div className="wrap fit-grow">
          <AccountView />
        </div>
      </section>
    </div>
  );
}
