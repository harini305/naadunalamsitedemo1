import ContactForm from "@/components/ContactForm";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";
import { site } from "@/lib/site";
import s from "../pages.module.css";

export const metadata = {
  title: "Contact Us",
  description:
    "Questions about orders, products, or partnerships? Call +91 90921 14630 or email hello@naadunalam.in. Monday to Saturday, 9:00 AM – 6:00 PM.",
  alternates: { canonical: "/contact" },
};

/* No heading band on contact (house rule): the pinned panel carries the H1. */
export default function ContactPage() {
  return (
    <div className="page">
      <section className={`${s.contact} fit-footer`}>
        <div className={`wrap pin-split fit-grow ${s.contactGrid}`}>
          <div className={`pin ${s.contactPanel}`}>
            <h1>Contact us</h1>
            <p className="lead">
              Questions about orders, products, or partnerships? Reach the Naadu Nalam team and we will get back to you
              soon.
            </p>
            <ul className={s.contactList}>
              <li><PhoneIcon /><a href={site.phoneHref}>{site.phoneDisplay}</a></li>
              <li><MailIcon /><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><PinIcon /><span>{site.location}</span></li>
              <li><ClockIcon /><span>{site.hours[0]}<br />{site.hours[1]}</span></li>
            </ul>
            <div className={s.contactImg}>
              <img src="/images/editorial/oils-grains-field.webp" alt="Cold-pressed oils and grain bowls beside green fields" width="840" height="1024" loading="lazy" />
            </div>
          </div>
          <div className={s.formCard}>
            <h2>Send a message</h2>
            <p className="muted">Tell us how we can help and we will respond by email.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
