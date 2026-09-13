import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/whatsapp/auth";
import { draftingEnabled } from "@/lib/whatsapp/config";
import { draftReply } from "@/lib/whatsapp/draft";
import { getConversation, getMessages, saveDraft } from "@/lib/whatsapp/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Drafting runs a model call; give it room. */
export const maxDuration = 60;

/**
 * Draft, or re-draft, a reply to a conversation.
 *
 * The webhook normally does this the moment a message arrives. This route is
 * the manual handle: for when drafting failed, when the owner wants another go,
 * or when they have just changed a price in the catalogue and want the draft
 * rebuilt against it.
 */
export async function POST(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  if (!draftingEnabled) {
    return NextResponse.json(
      { ok: false, message: "ANTHROPIC_API_KEY is not set, so replies cannot be drafted." },
      { status: 503 },
    );
  }

  let waId: unknown;
  try {
    waId = ((await request.json()) as { waId?: unknown }).waId;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (typeof waId !== "string") {
    return NextResponse.json({ ok: false, message: "Missing conversation." }, { status: 400 });
  }

  const conversation = await getConversation(waId);
  if (!conversation) {
    return NextResponse.json({ ok: false, message: "No such conversation." }, { status: 404 });
  }

  const messages = await getMessages(waId);
  const lastInbound = [...messages].reverse().find((message) => message.direction === "in");

  if (!lastInbound) {
    return NextResponse.json(
      { ok: false, message: "There is nothing from the customer to reply to." },
      { status: 400 },
    );
  }

  const draft = await draftReply({
    waId,
    customerName: conversation.name,
    messages,
    inReplyTo: lastInbound.id,
  });

  await saveDraft(draft);
  return NextResponse.json({ ok: true, draft });
}
