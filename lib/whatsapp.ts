import { siteConfig } from "@/config/site";

/** Click-to-chat link that opens WhatsApp with `text` pre-filled (the visitor still taps Send). */
export function whatsappLink(text: string): string {
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_GREETING =
  "Hi Javeed, I found you via javeedishaq.com and would like to talk about ";
