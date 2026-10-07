import "server-only";
import { NextResponse } from "next/server";

/**
 * Who may run the scheduled jobs by hand.
 *
 * Vercel's cron sends `Authorization: Bearer $CRON_SECRET`, which is the right
 * way round and needs nothing from anyone. A person cannot send a header from
 * a browser address bar, though, so the same secret is accepted as `?key=`.
 *
 * That puts the secret in browser history and in the request log, which is why
 * it is the second option and not the first: the URL is a password, and anyone
 * holding it can pull every customer address the site has. Rotate CRON_SECRET
 * in Vercel if one gets shared or pasted somewhere it should not be.
 *
 * Returns a response when the caller may not pass, and null when they may.
 */
export function refuse(request: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Shut rather than open. An unset secret must never mean "no check".
    return NextResponse.json({ error: "cron_secret_not_set" }, { status: 503 });
  }

  const header = request.headers.get("authorization");
  const query = new URL(request.url).searchParams.get("key");
  if (header === `Bearer ${secret}` || query === secret) return null;

  return NextResponse.json({ error: "unauthorised" }, { status: 401 });
}
