import "server-only";
import { windowRemainingMs } from "./config";
import { getDraft, listConversations } from "./store";
import type { Conversation, Draft } from "./types";

/**
 * The conversation list as the inbox needs it: each thread with its pending
 * draft and how long is left to reply.
 *
 * Shared by the page (which renders the first list server-side, so the inbox
 * opens with messages already on screen) and by the polling endpoint.
 */

export type ConversationSummary = Conversation & {
  windowRemainingMs: number;
  draft: Draft | null;
};

export async function loadConversationSummaries(limit = 50): Promise<ConversationSummary[]> {
  const conversations = await listConversations(limit);

  return Promise.all(
    conversations.map(async (conversation) => ({
      ...conversation,
      windowRemainingMs: windowRemainingMs(conversation.lastInboundAt),
      draft: await getDraft(conversation.waId),
    })),
  );
}
