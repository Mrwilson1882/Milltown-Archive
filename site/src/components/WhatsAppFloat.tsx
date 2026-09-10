"use client";

import { usePathname } from "next/navigation";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { getProduct } from "@/data/catalogue";
import { brands, collections, productTypes } from "@/data/taxonomy";
import { trackEvent } from "@/lib/analytics";

/**
 * Pages where the floating button is suppressed. The basket and checkout already
 * carry their own WhatsApp and email buttons, and a button pinned to the bottom
 * corner lands squarely on top of them — on a phone it covers "Secure
 * checkout", which is the one control that must never be blocked.
 */
const HIDE_ON = ["/cart", "/checkout"];

/**
 * A natural-language name for the page someone is on, so the pre-filled
 * message says "I'm looking at your Lacoste page" rather than a generic line.
 * That reads better to the customer, and it tells the owner where the
 * enquiry came from even with analytics switched off.
 */
function describePage(pathname: string): string | null {
  const [, section, slug] = pathname.split("/");
  const find = (list: { slug: string; name: string }[]) => list.find((c) => c.slug === slug)?.name;
  switch (section) {
    case "products":
      return slug ? (getProduct(slug)?.name ?? null) : "all products";
    case "brands":
      return slug ? (find(brands) ?? null) : "brands";
    case "types":
      return slug ? (find(productTypes) ?? null) : "product types";
    case "collections":
      return slug ? (find(collections) ?? null) : "collections";
    case "by-kilo":
      return "bulk — bags, bales and pallets";
    case "grading-guide":
      return "grading guide";
    default:
      return null;
  }
}

/**
 * Site-wide click-to-chat button. Renders nothing until a WhatsApp business
 * number is configured — a button that opens an empty chat is worse than none.
 * Set NEXT_PUBLIC_WHATSAPP_NUMBER to switch it on everywhere at once.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();

  if (!hasWhatsApp) return null;
  if (HIDE_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return null;

  const page = describePage(pathname);
  // Ends on an open cue. Three of the first ten enquiries opened with the
  // generic line and nothing else, and the owner had to ask what they wanted.
  const message = page
    ? `Hi Archive Wholesale, I'm looking at your ${page} page. I'm interested in: `
    : siteConfig.whatsappMessage;

  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("enquiry_click", { channel: "whatsapp", source: "float", page: pathname })}
      className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full bg-forest py-3 pr-5 pl-4 font-bold text-paper shadow-lg transition-transform hover:scale-105 hover:bg-forest-dark sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="text-sm tracking-wide uppercase">Enquire</span>
    </a>
  );
}
