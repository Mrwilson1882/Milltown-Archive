import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/whatsapp/auth";
import { loadConversationSummaries } from "@/lib/whatsapp/inbox";
import { storeIsDurable } from "@/lib/whatsapp/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Polled by the inbox so new messages appear without a refresh. */
export async function GET() {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  return NextResponse.json({
    conversations: await loadConversationSummaries(),
    storeIsDurable,
  });
}
