"use client";

import type { ReactNode } from "react";
import { siteConfig, whatsappUrl } from "@/config/site";
import { trackEvent, type EnquirySource } from "@/lib/analytics";
import { useAttributionRef, withRef } from "@/components/useAttributionRef";

/**
 * A click-to-chat anchor for the places that are otherwise server-rendered —
 * the footer, the home hero, the contact page.
 *
 * Those pages have no way to reach the reference code, which lives in the
 * browser, so the link is signed here instead. It also records the tap, so the
 * standing links are counted alongside the ones on product pages rather than
 * arriving in the inbox from nowhere.
 */
export function WhatsAppLink({
  source,
  message = siteConfig.whatsappMessage,
  className,
  children,
}: {
  source: EnquirySource;
  message?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useAttributionRef();

  return (
    <a
      href={whatsappUrl(withRef(message, ref))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("enquiry_click", { channel: "whatsapp", source })}
      className={className}
    >
      {children}
    </a>
  );
}
