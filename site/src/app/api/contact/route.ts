import { NextResponse } from "next/server";
import { enquiryHtml, enquirySubject, enquiryText } from "@/lib/email/enquiryNote";
import { ORDER_BCC, emailEnabled, sendEmail } from "@/lib/email/send";

export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  email: string;
  business: string;
  message: string;
};

function parse(body: unknown): ContactPayload | null {
  if (typeof body !== "object" || body === null) return null;
  const { name, email, business, message, website } = body as Record<string, unknown>;

  // Honeypot: real people never fill in a hidden field.
  if (typeof website === "string" && website.trim() !== "") return null;

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return null;
  }

  const trimmed = {
    name: name.trim().slice(0, 120),
    email: email.trim().slice(0, 200),
    business: typeof business === "string" ? business.trim().slice(0, 160) : "",
    message: message.trim().slice(0, 4000),
  };

  if (!trimmed.name || !trimmed.message) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed.email)) return null;

  return trimmed;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const payload = parse(body);
  if (!payload) {
    return NextResponse.json(
      { ok: false, error: "invalid_input", message: "Please check your name, email and message." },
      { status: 400 },
    );
  }

  // Email first, because that is where the owner actually reads things. The
  // forwarding webhook stays as a fallback for anyone wiring this into a
  // spreadsheet or a CRM later.
  if (emailEnabled && ORDER_BCC) {
    const result = await sendEmail({
      to: ORDER_BCC,
      // Reply goes to the person who wrote, not to the website.
      replyTo: payload.email,
      subject: enquirySubject(payload),
      html: enquiryHtml(payload),
      text: enquiryText(payload),
    });
    if (result.ok) return NextResponse.json({ ok: true });
    console.error("[contact] could not email enquiry", result.reason);
  }

  const forwardUrl = process.env.CONTACT_FORWARD_WEBHOOK;
  if (!forwardUrl) {
    // Nowhere to send it. Say so rather than pretending it arrived — an
    // enquiry that vanishes silently is worse than a form that admits it is
    // not working, because the customer thinks they have been ignored.
    return NextResponse.json(
      {
        ok: false,
        error: "not_configured",
        message: "Our form isn't wired to an inbox yet — please email or WhatsApp us instead.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(forwardUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        source: "archivewholesale.co.uk",
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error(`Forwarder responded ${response.status}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] failed to forward enquiry", error);
    return NextResponse.json(
      {
        ok: false,
        error: "forward_failed",
        message: "We could not send that just now. Please email or WhatsApp us instead.",
      },
      { status: 502 },
    );
  }
}
