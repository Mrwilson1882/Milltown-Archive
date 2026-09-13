/**
 * Where a visitor came from, carried all the way to the money.
 *
 * Vercel Web Analytics tells us a session arrived from Instagram. It cannot
 * tell us that session paid £200, because the moment the browser leaves for
 * checkout.stripe.com the analytics script stops watching, and the WhatsApp
 * enquiries close somewhere Vercel never sees at all.
 *
 * So we keep the source ourselves: read it off the landing URL, hold it in
 * localStorage, and attach it to the two places a sale actually lands — the
 * Stripe session's metadata, and the pre-filled WhatsApp message. An order in
 * the Stripe dashboard then says which ad paid for it, and a chat in the
 * WhatsApp inbox opens with a reference that says the same.
 *
 * Two touches are kept, because they answer different questions:
 *   first — the ad that introduced them. What the ad budget actually bought.
 *   last  — the ad that brought them back the day they bought.
 * Wholesale buyers rarely buy on the first visit, so judging an ad on last
 * touch alone consistently undervalues whatever fills the top of the funnel.
 *
 * Everything here is browser-side and therefore untrusted. It is a label on an
 * order, never an input to a price.
 */

const FIRST_KEY = "aw.attr.first";
const LAST_KEY = "aw.attr.last";
const REF_KEY = "aw.attr.ref";

/** Click IDs the ad platforms append. Their presence alone marks a paid click. */
const CLICK_IDS = ["fbclid", "igshid", "gclid", "ttclid", "msclkid"] as const;

export type Touch = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  /** The click ID the platform stamped on the link, if any. */
  clickId: string;
  /** Path they landed on, so we can see which ad creative points where. */
  landing: string;
  /** Referring host, where the browser gave us one. */
  referrer: string;
  /** ISO date, day precision — enough to judge a campaign, not enough to track a person. */
  seen: string;
};

/** Short codes for the sources worth typing into a WhatsApp reply. */
const SOURCE_CODES: Record<string, string> = {
  instagram: "IG",
  facebook: "FB",
  tiktok: "TT",
  google: "GG",
  youtube: "YT",
  email: "EM",
  depop: "DP",
  vinted: "VN",
  ebay: "EB",
};

function read(key: string): Touch | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as Touch;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing, a full quota, or storage switched off. Attribution is
    // worth having but never worth breaking a page over.
  }
}

/** Host only — the full referring URL is more than we need and more than we want. */
function referrerHost(): string {
  try {
    if (!document.referrer) return "";
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    // A referrer from our own site is just internal navigation.
    if (host === window.location.hostname.replace(/^www\./, "")) return "";
    return host;
  } catch {
    return "";
  }
}

/**
 * Instagram's in-app browser frequently drops the referrer, so a visit from the
 * app can arrive looking like direct traffic. UTM tags on the ad link are the
 * only signal that survives it reliably — which is why the ad URL must carry
 * them, and why we treat a bare referrer as a weak fallback rather than truth.
 */
function tidySource(raw: string, referrer: string, clickId: string): string {
  const value = raw.trim().toLowerCase();
  if (value) return value;
  if (clickId === "igshid") return "instagram";
  if (clickId === "fbclid") return "facebook";
  if (clickId === "gclid") return "google";
  if (referrer.includes("instagram")) return "instagram";
  if (referrer.includes("facebook")) return "facebook";
  if (referrer.includes("google")) return "google";
  if (referrer) return referrer;
  return "direct";
}

function makeRef(source: string): string {
  const prefix = SOURCE_CODES[source] ?? (source.slice(0, 2).toUpperCase() || "DR");
  // Four characters from an unambiguous alphabet — no O/0, no I/1 — because
  // this gets read off a phone screen and typed into a spreadsheet by hand.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) tail += alphabet[byte % alphabet.length];
  return `${prefix}-${tail}`;
}

/**
 * Read the landing URL and record the touch. Safe to call on every mount —
 * the first touch is written once and never overwritten.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const clickId = CLICK_IDS.find((id) => params.has(id)) ?? "";
  const referrer = referrerHost();
  const utm = (name: string) => (params.get(`utm_${name}`) ?? "").trim().slice(0, 80);

  const campaigned = Boolean(clickId) || params.has("utm_source");
  // Nothing to learn from an internal click-through, so leave the record alone.
  if (!campaigned && !referrer && read(FIRST_KEY)) return;

  const touch: Touch = {
    source: tidySource(utm("source"), referrer, clickId),
    medium: utm("medium"),
    campaign: utm("campaign"),
    content: utm("content"),
    term: utm("term"),
    clickId,
    landing: window.location.pathname.slice(0, 120),
    referrer,
    seen: new Date().toISOString().slice(0, 10),
  };

  if (!read(FIRST_KEY)) write(FIRST_KEY, touch);
  // Last touch moves only for a visit that carries a source of its own.
  if (campaigned || referrer) write(LAST_KEY, touch);

  try {
    if (!window.localStorage.getItem(REF_KEY)) {
      write(REF_KEY, makeRef((read(FIRST_KEY) ?? touch).source));
    }
  } catch {
    // As above — never break a page for a label.
  }
  publishRef();
}

/**
 * The reference code is read through a subscribable snapshot rather than an
 * effect, the same way the basket is, so that components re-render when
 * `captureAttribution` mints the code a moment after the first paint.
 */
const refListeners = new Set<() => void>();
let refSnapshot = "";

function loadRef(): string {
  try {
    const raw = window.localStorage.getItem(REF_KEY);
    return typeof raw === "string" ? (JSON.parse(raw) as string) : "";
  } catch {
    return "";
  }
}

function publishRef(): void {
  if (typeof window === "undefined") return;
  const next = loadRef();
  if (next === refSnapshot) return;
  refSnapshot = next;
  for (const listener of refListeners) listener();
}

if (typeof window !== "undefined") refSnapshot = loadRef();

export function subscribeRef(onStoreChange: () => void): () => void {
  refListeners.add(onStoreChange);
  return () => {
    refListeners.delete(onStoreChange);
  };
}

/**
 * The cached code, e.g. `IG-7K2Q`. Returns the same string between changes —
 * useSyncExternalStore requires a stable snapshot.
 */
export function getRefSnapshot(): string {
  return refSnapshot;
}

/** Empty on the server, so server and client markup agree on the first pass. */
export function getServerRefSnapshot(): string {
  return "";
}

export function getRef(): string {
  if (typeof window === "undefined") return "";
  return loadRef();
}

/** Flat, string-only shape — what Stripe metadata and Vercel events both want. */
export type AttributionPayload = Record<string, string>;

/**
 * The only keys that ever cross to the server. Defined here, beside the code
 * that writes them, so the producer and the server-side whitelist cannot drift
 * apart and quietly start dropping a field.
 */
export const ATTRIBUTION_KEYS = [
  "ref",
  "first_source",
  "first_campaign",
  "first_content",
  "first_landing",
  "first_seen",
  "last_source",
  "last_medium",
  "last_campaign",
  "last_content",
  "last_referrer",
] as const;

/**
 * Clean an attribution object that arrived from a browser.
 *
 * This is the one place untrusted page data enters an order, so it is
 * whitelisted by key, forced to strings, trimmed and truncated. Stripe allows
 * 50 metadata keys of 500 characters each; eleven short strings leave plenty of
 * room for the `lots` line alongside them. Nothing here is ever read back as a
 * price, a quantity or a permission — it is a label on an order and no more.
 */
export function sanitiseAttribution(value: unknown): AttributionPayload {
  if (typeof value !== "object" || value === null) return {};
  const source = value as Record<string, unknown>;
  const clean: AttributionPayload = {};
  for (const key of ATTRIBUTION_KEYS) {
    const entry = source[key];
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim().slice(0, 200);
    if (trimmed) clean[key] = trimmed;
  }
  return clean;
}

export function getAttribution(): AttributionPayload {
  if (typeof window === "undefined") return {};
  const first = read(FIRST_KEY);
  const last = read(LAST_KEY);
  const ref = getRef();

  const payload: AttributionPayload = {};
  const put = (key: string, value: string | undefined) => {
    if (value) payload[key] = value.slice(0, 200);
  };

  put("ref", ref);
  put("first_source", first?.source);
  put("first_campaign", first?.campaign);
  put("first_content", first?.content);
  put("first_landing", first?.landing);
  put("first_seen", first?.seen);
  put("last_source", last?.source);
  put("last_medium", last?.medium);
  put("last_campaign", last?.campaign);
  put("last_content", last?.content);
  put("last_referrer", last?.referrer);
  return payload;
}
