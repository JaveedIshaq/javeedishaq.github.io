"use client";

import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

import { WHATSAPP_GREETING, whatsappLink } from "@/lib/whatsapp";

/** Floating click-to-chat button, bottom-right on every page except /contact. */
export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/contact")) return null;

  return (
    <a
      href={whatsappLink(WHATSAPP_GREETING)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Javeed on WhatsApp"
      title="Chat on WhatsApp"
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex h-14 items-center gap-2 rounded-full border border-[#1F3B38] bg-[#0E1A1A] pl-4 pr-4 text-[#A7F3E4] shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground sm:right-6"
    >
      <FaWhatsapp className="h-6 w-6" aria-hidden="true" />
      <span className="hidden text-sm font-semibold sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
