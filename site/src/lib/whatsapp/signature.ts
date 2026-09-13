import crypto from "node:crypto";

/**
 * Meta signs every webhook POST with `X-Hub-Signature-256: sha256=<hex>` —
 * an HMAC-SHA256 of the *raw* body, keyed with the app secret.
 *
 * The raw body matters. Parsing the JSON and re-serialising it changes the
 * bytes and the signature will never match, which is why the route reads
 * `request.text()` and hands the string straight to this function.
 *
 * An unverified payload is not from Meta. Same rule as the Stripe webhook:
 * never act on it.
 */
export function verifySignature(rawBody: string, header: string | null, appSecret: string): boolean {
  if (!header || !appSecret) return false;

  const [algorithm, signature] = header.split("=");
  if (algorithm !== "sha256" || !signature) return false;

  const expected = crypto.createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");

  // Both buffers must be the same length before timingSafeEqual will compare
  // them — it throws otherwise, which would itself leak the length.
  const given = Buffer.from(signature, "hex");
  const mine = Buffer.from(expected, "hex");
  if (given.length !== mine.length) return false;

  return crypto.timingSafeEqual(given, mine);
}
