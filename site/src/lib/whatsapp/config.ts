/**
 * WhatsApp Business Cloud API — configuration.
 *
 * Every WhatsApp env var is read here and nowhere else, so the rest of the code
 * asks one question — is the connector live? — rather than reading
 * `process.env` in a dozen places. Same shape as `lib/stripe.ts`.
 *
 * Nothing here throws on import. A missing key means the connector reports
 * itself as not configured; it never pretends to be connected.
 */

const env = (key: string): string => process.env[key]?.trim() ?? "";

export const whatsappConfig = {
  /** Phone number ID from Meta — NOT the phone number itself. */
  phoneNumberId: env("WHATSAPP_PHONE_NUMBER_ID"),
  /** System user access token. Permanent, not the 24-hour test token. */
  accessToken: env("WHATSAPP_ACCESS_TOKEN"),
  /** App secret, used to verify that a webhook really came from Meta. */
  appSecret: env("WHATSAPP_APP_SECRET"),
  /** A string you invent; Meta echoes it back when you register the webhook. */
  verifyToken: env("WHATSAPP_VERIFY_TOKEN"),
  /** Graph API version. Bump when Meta deprecates one; v23.0 is current. */
  graphVersion: env("WHATSAPP_GRAPH_VERSION") || "v23.0",
} as const;

/** Can we send? Receiving additionally needs the app secret and verify token. */
export const canSend = Boolean(whatsappConfig.phoneNumberId && whatsappConfig.accessToken);

/** Can we accept webhooks? Unsigned payloads are never acted on. */
export const canReceive = Boolean(whatsappConfig.appSecret && whatsappConfig.verifyToken);

export const whatsappConfigured = canSend && canReceive;

/**
 * Phase two. While this is false — and it is false unless someone deliberately
 * sets it to "true" — nothing is sent to a customer without the owner pressing
 * Send in the inbox. Turning it on is a business decision, not a deploy detail.
 */
export const autoSendEnabled = env("WHATSAPP_AUTO_SEND").toLowerCase() === "true";

/**
 * Drafting needs a Claude key. Without one the connector still records
 * conversations and the owner writes replies by hand — it degrades to a plain
 * inbox rather than breaking.
 */
export const draftingEnabled = Boolean(env("ANTHROPIC_API_KEY"));

export function graphUrl(path: string): string {
  return `https://graph.facebook.com/${whatsappConfig.graphVersion}/${path}`;
}

/**
 * This number ran the owner's camper business until the archive took it over.
 * Anything before this moment belongs to that business and must never be fed
 * to the drafter as context — a reply built on a camper conversation would be
 * both wrong and confusing.
 *
 * Defaults to the start of Thursday 10 September 2026, UK time. Override with
 * WHATSAPP_HISTORY_CUTOFF as an ISO date, e.g. "2026-09-10T00:00:00+01:00".
 * Set it to "0" to switch the cutoff off entirely.
 */
const DEFAULT_CUTOFF = "2026-09-10T00:00:00+01:00";

function readCutoff(): number {
  const raw = env("WHATSAPP_HISTORY_CUTOFF") || DEFAULT_CUTOFF;
  if (raw === "0") return 0;

  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) {
    console.warn(`[whatsapp] WHATSAPP_HISTORY_CUTOFF is not a date: "${raw}". Using the default.`);
    return Date.parse(DEFAULT_CUTOFF);
  }
  return parsed;
}

export const historyCutoff = readCutoff();

/** Is this message from the archive business, rather than the camper one? */
export function isAfterCutoff(at: number): boolean {
  return at >= historyCutoff;
}

/**
 * Meta's customer service window: once a customer messages you, you have 24
 * hours to reply in free text. After that only an approved template may be
 * sent. The inbox counts this down so a draft is never left to go stale
 * unnoticed.
 */
export const SERVICE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function windowRemainingMs(lastInboundAt: number, now = Date.now()): number {
  return Math.max(0, lastInboundAt + SERVICE_WINDOW_MS - now);
}

export function windowIsOpen(lastInboundAt: number, now = Date.now()): boolean {
  return windowRemainingMs(lastInboundAt, now) > 0;
}
