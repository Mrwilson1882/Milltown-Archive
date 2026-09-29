import type { Conversation, Draft, StoredMessage } from "./types";

/**
 * Where conversations live.
 *
 * The site is deployed to a serverless host, so the filesystem is not a place
 * anything can be kept — each request may land on a different machine and the
 * disk is wiped between deploys. This module therefore talks to a Redis over
 * its REST API (Upstash, which is what Vercel KV is underneath), using plain
 * `fetch` so it adds no dependency.
 *
 * With no Redis configured it falls back to an in-process map so the connector
 * can be run and clicked through locally. That fallback is NOT durable: it is
 * lost on restart and is not shared between serverless instances. `storeKind`
 * says which one is in play and the inbox says so on screen, because a queue of
 * customer messages silently evaporating would be much worse than a warning.
 */

const url =
  process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim() || "";
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim() || "";

export const storeKind: "redis" | "memory" = url && token ? "redis" : "memory";
export const storeIsDurable = storeKind === "redis";

/** Newest 200 messages per thread. Plenty for context; keeps payloads small. */
const MAX_THREAD_MESSAGES = 200;

// ---------------------------------------------------------------- Redis (REST)

type Command = (string | number)[];

async function redis<T>(command: Command): Promise<T | null> {
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis ${command[0]} failed: ${response.status}`);
  }

  const payload = (await response.json()) as { result?: T; error?: string };
  if (payload.error) throw new Error(`Redis ${command[0]} failed: ${payload.error}`);

  return payload.result ?? null;
}

// --------------------------------------------------------------- Memory (dev)

type MemoryStore = {
  values: Map<string, string>;
  lists: Map<string, string[]>;
  index: Map<string, number>;
};

/** Held on globalThis so Next's dev-mode hot reload does not wipe it. */
const memory: MemoryStore = ((globalThis as Record<string, unknown>).__waStore as MemoryStore) ?? {
  values: new Map(),
  lists: new Map(),
  index: new Map(),
};
(globalThis as Record<string, unknown>).__waStore = memory;

// -------------------------------------------------------------- Key/value ops

async function setValue(key: string, value: string): Promise<void> {
  if (storeIsDurable) {
    await redis(["SET", key, value]);
    return;
  }
  memory.values.set(key, value);
}

async function getValue(key: string): Promise<string | null> {
  if (storeIsDurable) return redis<string>(["GET", key]);
  return memory.values.get(key) ?? null;
}

async function deleteValue(key: string): Promise<void> {
  if (storeIsDurable) {
    await redis(["DEL", key]);
    return;
  }
  memory.values.delete(key);
}

async function pushMessage(key: string, value: string): Promise<void> {
  if (storeIsDurable) {
    await redis(["LPUSH", key, value]);
    await redis(["LTRIM", key, 0, MAX_THREAD_MESSAGES - 1]);
    return;
  }
  const list = memory.lists.get(key) ?? [];
  list.unshift(value);
  memory.lists.set(key, list.slice(0, MAX_THREAD_MESSAGES));
}

async function readList(key: string, limit: number): Promise<string[]> {
  if (storeIsDurable) return (await redis<string[]>(["LRANGE", key, 0, limit - 1])) ?? [];
  return (memory.lists.get(key) ?? []).slice(0, limit);
}

async function replaceInList(key: string, index: number, value: string): Promise<void> {
  if (storeIsDurable) {
    await redis(["LSET", key, index, value]);
    return;
  }
  const list = memory.lists.get(key);
  if (list && index < list.length) list[index] = value;
}

// ------------------------------------------------------------------- The keys

const convKey = (waId: string) => `wa:conv:${waId}`;
const threadKey = (waId: string) => `wa:thread:${waId}`;
const draftKey = (waId: string) => `wa:draft:${waId}`;
const seenKey = (messageId: string) => `wa:seen:${messageId}`;
const INDEX_KEY = "wa:conversations";

// --------------------------------------------------------------- Conversations

export async function getConversation(waId: string): Promise<Conversation | null> {
  const raw = await getValue(convKey(waId));
  return raw ? (JSON.parse(raw) as Conversation) : null;
}

export async function saveConversation(conversation: Conversation): Promise<void> {
  await setValue(convKey(conversation.waId), JSON.stringify(conversation));

  if (storeIsDurable) {
    await redis(["ZADD", INDEX_KEY, conversation.lastMessageAt, conversation.waId]);
  } else {
    memory.index.set(conversation.waId, conversation.lastMessageAt);
  }
}

/** Most recently active first — the order the owner wants to work through. */
export async function listConversations(limit = 50): Promise<Conversation[]> {
  let ids: string[];

  if (storeIsDurable) {
    ids = (await redis<string[]>(["ZRANGE", INDEX_KEY, 0, limit - 1, "REV"])) ?? [];
  } else {
    ids = [...memory.index.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
  }

  const conversations = await Promise.all(ids.map((id) => getConversation(id)));
  return conversations.filter((c): c is Conversation => c !== null);
}

export async function markConversationRead(waId: string): Promise<void> {
  const conversation = await getConversation(waId);
  if (!conversation || !conversation.unread) return;
  await saveConversation({ ...conversation, unread: false });
}

// -------------------------------------------------------------------- Messages

export async function appendMessage(waId: string, message: StoredMessage): Promise<void> {
  await pushMessage(threadKey(waId), JSON.stringify(message));
}

/** Oldest first, which is how a conversation reads. */
export async function getMessages(waId: string, limit = MAX_THREAD_MESSAGES): Promise<StoredMessage[]> {
  const raw = await readList(threadKey(waId), limit);
  return raw
    .map((entry) => JSON.parse(entry) as StoredMessage)
    .sort((a, b) => a.at - b.at);
}

/**
 * Record what Meta says happened to a message we sent — delivered, read, or
 * failed. Stored newest-first, so we find it by scanning from the top.
 */
export async function updateMessageStatus(
  waId: string,
  messageId: string,
  status: string,
  error?: string,
): Promise<void> {
  const raw = await readList(threadKey(waId), MAX_THREAD_MESSAGES);

  for (let index = 0; index < raw.length; index += 1) {
    const message = JSON.parse(raw[index]) as StoredMessage;
    if (message.id !== messageId) continue;

    await replaceInList(
      threadKey(waId),
      index,
      JSON.stringify({ ...message, status, ...(error ? { error } : {}) }),
    );
    return;
  }
}

// ---------------------------------------------------------------------- Drafts

export async function saveDraft(draft: Draft): Promise<void> {
  await setValue(draftKey(draft.waId), JSON.stringify(draft));
}

export async function getDraft(waId: string): Promise<Draft | null> {
  const raw = await getValue(draftKey(waId));
  return raw ? (JSON.parse(raw) as Draft) : null;
}

export async function deleteDraft(waId: string): Promise<void> {
  await deleteValue(draftKey(waId));
}

// --------------------------------------------------------------------- Dedupe

/**
 * Meta retries a webhook until it gets a 200, and will happily deliver the same
 * message twice. Claim the id before acting on it: the first caller gets true,
 * every repeat gets false. Without this a retry means a second draft, or worse,
 * a second reply.
 */
export async function claimMessage(messageId: string): Promise<boolean> {
  const key = seenKey(messageId);

  if (storeIsDurable) {
    // NX = only if absent, EX = forget after a day. Returns null when the key
    // already existed, which is exactly the repeat case.
    const claimed = await redis<string>(["SET", key, "1", "NX", "EX", 86_400]);
    return claimed !== null;
  }

  if (memory.values.has(key)) return false;
  memory.values.set(key, "1");
  return true;
}
