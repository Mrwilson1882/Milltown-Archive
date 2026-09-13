import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/whatsapp/auth";
import { getConversation, getDraft, getMessages, markConversationRead } from "@/lib/whatsapp/store";
import { windowRemainingMs } from "@/lib/whatsapp/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** One conversation in full. Opening it marks it read. */
export async function GET(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  const waId = new URL(request.url).searchParams.get("waId");
  if (!waId) return NextResponse.json({ error: "missing_wa_id" }, { status: 400 });

  const conversation = await getConversation(waId);
  if (!conversation) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const [messages, draft] = await Promise.all([getMessages(waId), getDraft(waId)]);
  await markConversationRead(waId);

  return NextResponse.json({
    conversation: {
      ...conversation,
      unread: false,
      windowRemainingMs: windowRemainingMs(conversation.lastInboundAt),
    },
    messages,
    draft,
  });
}
