import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing/Page";
import { ContactForm } from "@/components/marketing/ContactForm";

export const metadata: Metadata = { title: "Contact — Lectern" };

export default function ContactPage() {
  return (
    <MarketingPage kicker="Contact" title="Talk to us." lede="Sales, support, security, or just curious — drop a note.">
      <ContactForm />
      <p className="mono" style={{ marginTop: 24, fontSize: 12.5, color: "var(--fg-dim)" }}>
        Or email: shrimpyfry@gmail.com · sales@getlectern.vercel.app · shrimpyfry@gmail.com
      </p>
    </MarketingPage>
  );
}
