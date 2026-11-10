import { CalendarDays, Linkedin, Mail } from "lucide-react";
import { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";

import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/site/section-heading";
import { pagesConfig } from "@/config/pages";
import { siteConfig } from "@/config/site";
import { WHATSAPP_GREETING, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: pagesConfig.contact.metadata.title,
  description: pagesConfig.contact.metadata.description,
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: siteConfig.whatsapp.display,
    href: whatsappLink(WHATSAPP_GREETING),
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: CalendarDays,
    label: "Book a call",
    value: "15-minute intro on Calendly",
    href: siteConfig.links.calendly,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/javeed-ishaq",
    href: siteConfig.links.linkedin,
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="flex flex-col gap-4 pb-8 pt-16">
        <SectionHeading as="h1" eyebrow="Contact" title="Let's build something together." />
        <p className="max-w-[640px] text-lg text-[#AEB7C4]">
          Hiring for a remote role, need a mobile or web product built end-to-end, or want an AI
          feature that actually works? Send a message — I usually reply within a day (UTC+5).
        </p>
      </section>

      <div className="flex flex-wrap gap-8 pb-8">
        <div className="min-w-0 flex-[999_1_520px] rounded-[20px] border border-border bg-card p-6 sm:p-8">
          <ContactForm />
        </div>

        <aside aria-label="Other ways to reach me" className="flex min-w-0 flex-[1_1_300px] flex-col gap-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[#3A4454]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1F3B38] bg-[#0E1A1A] text-primary">
                <c.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-semibold">{c.label}</span>
                <span className="truncate text-sm text-muted-foreground">{c.value}</span>
              </span>
            </a>
          ))}
          <p className="px-1 pt-2 text-sm text-muted-foreground">
            WhatsApp is the business line for {siteConfig.company.name}, my Flutter + AI studio.
          </p>
        </aside>
      </div>
    </>
  );
}
