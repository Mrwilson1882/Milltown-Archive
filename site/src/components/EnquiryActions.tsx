"use client";

import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";
import { trackEvent, type EnquirySource } from "@/lib/analytics";

/**
 * The WhatsApp / email pair shown wherever there is no price to check out
 * against. WhatsApp is hidden until a number is configured.
 *
 * Every tap is recorded as an `enquiry_click` with where it came from, so the
 * owner can see which door people use — the product page, the grading guide,
 * the bulk builder — rather than just that a message arrived.
 */
export function EnquiryActions({
  subject,
  message,
  source,
  product,
  pieces,
  compact = false,
}: {
  subject: string;
  /** Pre-filled text. Always name the product, so the message that lands says what it is about. */
  message: string;
  /** Where on the site this pair lives. */
  source: EnquirySource;
  /** Product slug, where the enquiry is about one. */
  product?: string;
  /** Lot size, where one was selected. */
  pieces?: number;
  compact?: boolean;
}) {
  const padding = compact ? "px-5 py-3" : "px-6 py-3.5";
  const record = (channel: "whatsapp" | "email") =>
    trackEvent("enquiry_click", { channel, source, product, pieces });

  return (
    <div>
      <p className="eyebrow mb-3 text-slate">
        {hasWhatsApp ? "Enquire via WhatsApp or email" : "Enquire by email"}
      </p>
      <div className="flex flex-wrap gap-3">
        {hasWhatsApp && (
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => record("whatsapp")}
            className={`inline-flex items-center gap-2 bg-forest ${padding} text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark`}
          >
            <WhatsAppIcon className="h-5 w-5" />
            Via WhatsApp
          </a>
        )}
        <a
          href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
          onClick={() => record("email")}
          className={`inline-flex items-center border-2 border-ink ${padding} text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest`}
        >
          Via email
        </a>
      </div>
    </div>
  );
}
