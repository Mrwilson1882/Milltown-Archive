import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Newsletter sign-ups from the email capture.
 *
 * Mirrors the contact form: addresses are forwarded to whatever endpoint is
 * set in NEWSLETTER_FORWARD_WEBHOOK (Zapier, Make, Mailchimp's hook, a Google
 * Apps Script, an inbox relay). With nothing configured the route says so
 * plainly rather than pretending an address was stored — a sign-up that
 * silently goes nowhere is worse than none, because a discount code is
 * promised against it.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { email, website } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: a real person never fills a hidden field.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const address = typeof email === "string" ? email.trim().slice(0, 200) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email", message: "That email address does not look right." },
      { status: 400 },
    );
  }

  const forwardUrl = process.env.NEWSLETTER_FORWARD_WEBHOOK;
  if (!forwardUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "not_configured",
        message: "Sign-up is not connected yet. Email us and we will add you to the list.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(forwardUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: address,
        source: "archivewholesale.co.uk",
        list: "newsletter",
        receivedAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) throw new Error(`forward failed: ${response.status}`);
  } catch (error) {
    console.error("[subscribe] forward failed", error);
    return NextResponse.json(
      { ok: false, error: "forward_failed", message: "Could not save that just now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
