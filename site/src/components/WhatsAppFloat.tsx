"use client";

import { usePathname } from "next/navigation";
import { hasWhatsApp, whatsappUrl } from "@/config/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

/**
 * Pages where the floating button is suppressed. The cart and checkout already
 * carry their own WhatsApp and email buttons, and a button pinned to the bottom
 * corner lands squarely on top of them — on a phone it covers "Secure
 * checkout", which is the one control that must never be blocked.
 */
const HIDE_ON = ["/cart", "/checkout"];

/**
 * Site-wide click-to-chat button. Renders nothing until a WhatsApp business
 * number is configured — a button that opens an empty chat is worse than none.
 * Set NEXT_PUBLIC_WHATSAPP_NUMBER to switch it on everywhere at once.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();

  if (!hasWhatsApp) return null;
  if (HIDE_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return null;

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full bg-forest py-3 pr-5 pl-4 font-bold text-paper shadow-lg transition-transform hover:scale-105 hover:bg-forest-dark sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="text-sm tracking-wide uppercase">Enquire</span>
    </a>
  );
}
