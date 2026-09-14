import { NextResponse } from "next/server";

/**
 * Forward a contact form message to whatever inbox relay is configured.
 *
 * CONTACT_FORWARD_WEBHOOK can be anything that accepts a JSON POST — Zapier,
 * Make, Formspree, an Apps Script, a self-hosted relay. With it unset the route
 * says so, and the form shows the email address instead of pretending to send.
 */
export async function POST(request: Request) {
  const endpoint = process.env.CONTACT_FORWARD_WEBHOOK?.trim();

  if (!endpoint) {
    return NextResponse.json(
      { error: "The contact form is not connected to an inbox yet." },
      { status: 501 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read that message." }, { status: 400 });
  }

  // The honeypot field is invisible to people and irresistible to bots. A
  // filled one is answered with a cheerful 200 and dropped on the floor.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are all needed." }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "That message is too long to send." }, { status: 400 });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "milltownarchive.co.uk",
        receivedAt: new Date().toISOString(),
        name,
        email,
        message,
      }),
    });

    if (!response.ok) {
      console.error("Contact relay rejected the message", response.status);
      return NextResponse.json({ error: "That did not send. Try email instead." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact relay unreachable", error);
    return NextResponse.json({ error: "That did not send. Try email instead." }, { status: 502 });
  }
}
