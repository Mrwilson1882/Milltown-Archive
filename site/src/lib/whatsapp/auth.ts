import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Who may open the inbox.
 *
 * The inbox shows customer conversations and can send messages as the
 * business, so it is not something to leave open on a public URL. One shared
 * password, set in INBOX_PASSWORD, held in a signed httpOnly cookie.
 *
 * That is the right weight for a one-person business. If staff are ever added,
 * replace this with real accounts rather than sharing the password around.
 */

export const COOKIE_NAME = "aw_inbox";
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

const password = () => process.env.INBOX_PASSWORD?.trim() ?? "";

/** With no password set the inbox refuses to open at all — it never defaults open. */
export const inboxConfigured = () => password().length > 0;

function sign(expiry: number): string {
  return crypto.createHmac("sha256", password()).update(String(expiry)).digest("hex");
}

export function issueToken(): { value: string; maxAge: number } {
  const expiry = Date.now() + SESSION_MS;
  return { value: `${expiry}.${sign(expiry)}`, maxAge: Math.floor(SESSION_MS / 1000) };
}

function tokenIsValid(token: string | undefined): boolean {
  if (!token || !inboxConfigured()) return false;

  const [rawExpiry, signature] = token.split(".");
  const expiry = Number(rawExpiry);
  if (!Number.isFinite(expiry) || !signature) return false;
  if (expiry < Date.now()) return false;

  const expected = Buffer.from(sign(expiry), "hex");
  const given = Buffer.from(signature, "hex");
  if (expected.length !== given.length) return false;

  return crypto.timingSafeEqual(expected, given);
}

/** Constant-time password check, so the form cannot be probed character by character. */
export function passwordMatches(attempt: string): boolean {
  if (!inboxConfigured()) return false;

  const expected = Buffer.from(password(), "utf8");
  const given = Buffer.from(attempt, "utf8");
  if (expected.length !== given.length) return false;

  return crypto.timingSafeEqual(expected, given);
}

export async function isSignedIn(): Promise<boolean> {
  const store = await cookies();
  return tokenIsValid(store.get(COOKIE_NAME)?.value);
}
