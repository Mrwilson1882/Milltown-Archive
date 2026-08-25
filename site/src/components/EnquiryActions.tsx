import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";

/**
 * The WhatsApp / email pair shown wherever there is no price to check out
 * against. WhatsApp is hidden until a number is configured.
 */
export function EnquiryActions({
  subject,
  message,
  compact = false,
}: {
  subject: string;
  /** Pre-filled text. Always name the product, so the message that lands says what it is about. */
  message: string;
  compact?: boolean;
}) {
  const padding = compact ? "px-5 py-3" : "px-6 py-3.5";

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
            className={`inline-flex items-center gap-2 bg-forest ${padding} text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark`}
          >
            <WhatsAppIcon className="h-5 w-5" />
            Via WhatsApp
          </a>
        )}
        <a
          href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
          className={`inline-flex items-center border-2 border-ink ${padding} text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest`}
        >
          Via email
        </a>
      </div>
    </div>
  );
}
