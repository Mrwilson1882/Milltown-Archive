import { NextResponse, after } from "next/server";
import { canReceive, draftingEnabled, whatsappConfig } from "@/lib/whatsapp/config";
import { verifySignature } from "@/lib/whatsapp/signature";
import { markAsRead } from "@/lib/whatsapp/client";
import { draftReply } from "@/lib/whatsapp/draft";
import {
  appendMessage,
  claimMessage,
  deleteDraft,
  getConversation,
  getMessages,
  saveConversation,
  saveDraft,
  updateMessageStatus,
} from "@/lib/whatsapp/store";
import { describeMessage } from "@/lib/whatsapp/describe";
import type { WebhookPayload, WebhookTextMessage, WebhookValue } from "@/lib/whatsapp/types";

export const runtime = "nodejs";
/** Meta signs the raw body — this route must never be cached or pre-rendered. */
export const dynamic = "force-dynamic";

/**
 * The WhatsApp Business Cloud API webhook.
 *
 * GET  — Meta's one-time subscription handshake.
 * POST — every inbound message, delivery receipt, and (under Coexistence) an
 *        echo of anything the owner sends from the WhatsApp Business app.
 *
 * Point Meta at https://www.archivewholesale.co.uk/api/whatsapp/webhook and
 * subscribe to the `messages` field. See docs/whatsapp-connector.md.
 */

// ------------------------------------------------------------ The handshake

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (!canReceive) {
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  if (mode === "subscribe" && token === whatsappConfig.verifyToken && challenge) {
    // Meta wants the challenge back as bare text, not JSON.
    return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  }

  return NextResponse.json({ error: "verification_failed" }, { status: 403 });
}

// --------------------------------------------------------------- The events

export async function POST(request: Request) {
  if (!canReceive) {
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, signature, whatsappConfig.appSecret)) {
    console.error("[whatsapp] signature verification failed");
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Record everything before replying, so nothing is lost if the function is
  // torn down. Drafting is slow, so it runs after the response — Meta retries
  // anything it does not get a prompt 200 for, and a retry means a second draft.
  const newlyReceived: { waId: string; messageId: string; name?: string }[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (!change.value) continue;
      newlyReceived.push(...(await handleChange(change.value)));
    }
  }

  if (draftingEnabled && newlyReceived.length > 0) {
    after(async () => {
      for (const received of newlyReceived) {
        await produceDraft(received);
      }
    });
  }

  return NextResponse.json({ received: true });
}

// ------------------------------------------------------------------ Handlers

async function handleChange(value: WebhookValue) {
  const received: { waId: string; messageId: string; name?: string }[] = [];

  const nameFor = (waId: string): string | undefined =>
    value.contacts?.find((contact) => contact.wa_id === waId)?.profile?.name;

  for (const message of value.messages ?? []) {
    const handled = await handleInbound(message, nameFor(message.from));
    if (handled) received.push({ waId: message.from, messageId: message.id, name: nameFor(message.from) });
  }

  // Coexistence: the owner answered from their phone. Record it so the thread
  // stays complete and drop any draft — the customer has their answer.
  for (const echo of value.message_echoes ?? []) {
    await handleEcho(echo);
  }

  for (const status of value.statuses ?? []) {
    await updateMessageStatus(
      status.recipient_id,
      status.id,
      status.status,
      status.errors?.[0]?.message,
    );
  }

  return received;
}

async function handleInbound(
  message: WebhookTextMessage,
  name: string | undefined,
): Promise<boolean> {
  // Meta retries until it gets a 200 and will resend the same message. Claim
  // the id first: a repeat must not produce a second draft.
  if (!(await claimMessage(message.id))) return false;

  const at = Number(message.timestamp) * 1000 || Date.now();
  const waId = message.from;

  await appendMessage(waId, {
    id: message.id,
    direction: "in",
    text: describeMessage(message),
    type: message.type,
    at,
  });

  const existing = await getConversation(waId);
  await saveConversation({
    waId,
    name: name ?? existing?.name,
    lastInboundAt: at,
    lastMessageAt: at,
    unread: true,
  });

  await markAsRead(message.id);
  return true;
}

async function handleEcho(echo: WebhookTextMessage): Promise<void> {
  if (!(await claimMessage(echo.id))) return;

  // On an echo, `from` is the business number and `to` is the customer. Without
  // a `to` there is no way to know which thread it belongs to, and filing it
  // against the business number would corrupt one — so skip it and say so.
  if (!echo.to) {
    console.warn("[whatsapp] message echo had no recipient; skipped", echo.id);
    return;
  }
  const waId = echo.to;
  const at = Number(echo.timestamp) * 1000 || Date.now();

  await appendMessage(waId, {
    id: echo.id,
    direction: "out",
    text: describeMessage(echo),
    type: echo.type,
    at,
    sentBy: "business-app",
  });

  const existing = await getConversation(waId);
  await saveConversation({
    waId,
    name: existing?.name,
    lastInboundAt: existing?.lastInboundAt ?? at,
    lastMessageAt: at,
    unread: false,
  });

  await deleteDraft(waId);
}

async function produceDraft({
  waId,
  messageId,
  name,
}: {
  waId: string;
  messageId: string;
  name?: string;
}): Promise<void> {
  try {
    const messages = await getMessages(waId);
    const draft = await draftReply({ waId, customerName: name, messages, inReplyTo: messageId });
    await saveDraft(draft);
  } catch (error) {
    // A failed draft is not a failed message. The conversation is already
    // saved; the inbox shows it with a Draft reply button.
    console.error("[whatsapp] could not draft a reply", error);
  }
}
