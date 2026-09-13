import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/whatsapp/auth";
import { canSend, windowIsOpen } from "@/lib/whatsapp/config";
import { sendTextMessage } from "@/lib/whatsapp/client";
import {
  appendMessage,
  deleteDraft,
  getConversation,
  saveConversation,
} from "@/lib/whatsapp/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Approve and send.
 *
 * This is the only route in the connector that puts a message in front of a
 * customer, and it runs only when the owner presses Send. The text that goes is
 * the text in the box — edited or not — never the stored draft, so what the
 * owner read is what the customer gets.
 */
export async function POST(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  if (!canSend) {
    return NextResponse.json(
      { ok: false, message: "WhatsApp sending is not configured on this deployment." },
      { status: 503 },
    );
  }

  let body: { waId?: unknown; text?: unknown };
  try {
    body = (await request.json()) as { waId?: unknown; text?: unknown };
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const { waId, text } = body;
  if (typeof waId !== "string" || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ ok: false, message: "Nothing to send." }, { status: 400 });
  }

  const conversation = await getConversation(waId);
  if (!conversation) {
    return NextResponse.json({ ok: false, message: "No such conversation." }, { status: 404 });
  }

  // Meta only allows a free-form reply within 24 hours of the customer's last
  // message. Say so plainly rather than letting the Graph API reject it.
  if (!windowIsOpen(conversation.lastInboundAt)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The 24-hour reply window has closed. WhatsApp will only accept an approved message template now — message them from your phone, or start a template.",
      },
      { status: 409 },
    );
  }

  const result = await sendTextMessage(waId, text);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.error, retryable: result.retryable },
      { status: result.retryable ? 502 : 400 },
    );
  }

  const at = Date.now();
  await appendMessage(waId, {
    id: result.messageId,
    direction: "out",
    text: text.trim(),
    type: "text",
    at,
    sentBy: "inbox",
    status: "sent",
  });

  await saveConversation({ ...conversation, lastMessageAt: at, unread: false });
  await deleteDraft(waId);

  return NextResponse.json({ ok: true, messageId: result.messageId, at });
}
