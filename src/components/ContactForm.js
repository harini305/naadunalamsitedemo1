"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

/* Frontend-only: nothing is submitted to a server. On a valid form the visitor's
   own email app opens with the message addressed to the shop (mailto). */
export default function ContactForm() {
  const [v, setV] = useState({ name: "", email: "", message: "", consent: false });
  const [err, setErr] = useState({});
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("topic") === "sell") {
      setV((x) => ({ ...x, message: x.message || "I would like to open a shop on Naadu Nalam. " }));
    }
  }, []);

  const set = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const n = {};
    if (!v.name.trim()) n.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(v.email)) n.email = "Please enter a valid email address.";
    if (v.message.trim().length < 5) n.message = "Please write a short message.";
    if (!v.consent) n.consent = "Please tick the consent box.";
    setErr(n);
    if (Object.keys(n).length) return;
    const body = `${v.message}\n\n${v.name}\n${v.email}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Enquiry from " + v.name)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="field half">
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" autoComplete="name" value={v.name} onChange={set("name")} aria-invalid={!!err.name} aria-describedby={err.name ? "cf-name-e" : undefined} />
        {err.name && <span id="cf-name-e" className="err">{err.name}</span>}
      </div>
      <div className="field half">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" type="email" autoComplete="email" value={v.email} onChange={set("email")} aria-invalid={!!err.email} aria-describedby={err.email ? "cf-email-e" : undefined} />
        {err.email && <span id="cf-email-e" className="err">{err.email}</span>}
      </div>
      <div className="field">
        <label htmlFor="cf-msg">Message</label>
        <textarea id="cf-msg" value={v.message} onChange={set("message")} aria-invalid={!!err.message} aria-describedby={err.message ? "cf-msg-e" : undefined} />
        {err.message && <span id="cf-msg-e" className="err">{err.message}</span>}
      </div>
      <label className="consent">
        <input type="checkbox" checked={v.consent} onChange={set("consent")} aria-invalid={!!err.consent} />
        <span>
          I agree that Naadu Nalam may use these details to respond to my enquiry, as set out in the{" "}
          <Link prefetch={false} href="/privacy-policy" className="text-link">Privacy Policy</Link>.
        </span>
      </label>
      {err.consent && <span className="err" style={{ color: "#a3361a", fontSize: 14 }}>{err.consent}</span>}
      <button type="submit" className="btn btn--forest">Write the email</button>
      <p className="small muted">
        This preview does not send messages itself. The button opens your own email app with the message addressed
        to {site.email}.
      </p>
      {opened && (
        <p className="notice" role="status">
          Your email app should now be open with the message ready. If nothing opened, write to {site.email} or call{" "}
          {site.phoneDisplay}.
        </p>
      )}
    </form>
  );
}
