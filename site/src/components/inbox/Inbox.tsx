"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

/**
 * The review inbox.
 *
 * Nothing on this screen sends itself. Every reply is a draft in an editable
 * box with a Send button under it, and the text that goes is whatever is in the
 * box when Send is pressed.
 */

type Draft = {
  text: string;
  needsOwnerInput: string[];
  confidence: "high" | "medium" | "low";
  products: string[];
  createdAt: number;
  error?: string;
};

type Conversation = {
  waId: string;
  name?: string;
  lastInboundAt: number;
  lastMessageAt: number;
  unread: boolean;
  windowRemainingMs: number;
  draft: Draft | null;
};

type Message = {
  id: string;
  direction: "in" | "out";
  text: string;
  type: string;
  at: number;
  sentBy?: "inbox" | "business-app" | "auto";
  status?: string;
  error?: string;
};

type Thread = {
  conversation: Conversation;
  messages: Message[];
  draft: Draft | null;
  /**
   * This number ran the camper business until this moment. Anything older is
   * shown so the thread reads properly, but it is greyed out and is never sent
   * to the drafter.
   */
  historyCutoff: number;
};

const confidenceLabel: Record<Draft["confidence"], { text: string; className: string }> = {
  high: { text: "Reads complete", className: "bg-forest text-paper" },
  medium: { text: "Worth a look", className: "bg-ash text-ink" },
  low: { text: "Needs you", className: "bg-red-700 text-paper" },
};

function formatWindow(ms: number): string {
  if (ms <= 0) return "Reply window closed";
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return hours > 0 ? `${hours}h ${minutes}m left to reply` : `${minutes}m left to reply`;
}

function formatTime(at: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(at));
}

/** 447897740194 → +44 7897 740194, which is how the owner reads a number. */
function formatNumber(waId: string): string {
  return waId.startsWith("44") ? `+44 ${waId.slice(2, 6)} ${waId.slice(6)}` : `+${waId}`;
}

export function Inbox({
  initialConversations,
  storeIsDurable: initialDurable,
}: {
  initialConversations: Conversation[];
  storeIsDurable: boolean;
}) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [storeIsDurable, setStoreIsDurable] = useState(initialDurable);
  const [selected, setSelected] = useState<string | null>(null);
  const [thread, setThread] = useState<Thread | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState<"sending" | "drafting" | null>(null);
  const [notice, setNotice] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  const loadConversations = useCallback(async () => {
    const response = await fetch("/api/inbox/conversations", { cache: "no-store" });
    if (!response.ok) return;
    const data: { conversations: Conversation[]; storeIsDurable: boolean } = await response.json();
    setConversations(data.conversations);
    setStoreIsDurable(data.storeIsDurable);
  }, []);

  const loadThread = useCallback(async (waId: string) => {
    const response = await fetch(`/api/inbox/thread?waId=${encodeURIComponent(waId)}`, {
      cache: "no-store",
    });
    if (!response.ok) return;
    const data: Thread = await response.json();
    setThread(data);
    setReply(data.draft?.text ?? "");
  }, []);

  useEffect(() => {
    // New messages arrive by webhook, not to this tab, so poll for them. The
    // first list was rendered on the server, so there is nothing to fetch here
    // on mount.
    const timer = setInterval(() => void loadConversations(), 15_000);
    return () => clearInterval(timer);
  }, [loadConversations]);

  async function openConversation(waId: string) {
    setSelected(waId);
    await loadThread(waId);
    // Opening a thread marks it read; refresh the list so the dot clears.
    void loadConversations();
  }

  const unreadCount = useMemo(
    () => conversations.filter((conversation) => conversation.unread).length,
    [conversations],
  );

  async function handleSend() {
    if (!selected || !reply.trim()) return;
    setBusy("sending");
    setNotice(null);

    try {
      const response = await fetch("/api/inbox/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waId: selected, text: reply }),
      });
      const result: { ok?: boolean; message?: string } = await response.json();

      if (response.ok && result.ok) {
        setNotice({ kind: "ok", text: "Sent." });
        setReply("");
        await Promise.all([loadThread(selected), loadConversations()]);
      } else {
        setNotice({ kind: "error", text: result.message ?? "Could not send." });
      }
    } catch {
      setNotice({ kind: "error", text: "Could not reach the server." });
    } finally {
      setBusy(null);
    }
  }

  async function handleDraft() {
    if (!selected) return;
    setBusy("drafting");
    setNotice(null);

    try {
      const response = await fetch("/api/inbox/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waId: selected }),
      });
      const result: { ok?: boolean; message?: string; draft?: Draft } = await response.json();

      if (response.ok && result.ok && result.draft) {
        setThread((current) => (current ? { ...current, draft: result.draft! } : current));
        setReply(result.draft.text);
        if (result.draft.error) setNotice({ kind: "error", text: result.draft.error });
      } else {
        setNotice({ kind: "error", text: result.message ?? "Could not draft a reply." });
      }
    } catch {
      setNotice({ kind: "error", text: "Could not reach the server." });
    } finally {
      setBusy(null);
    }
  }

  const windowOpen = (thread?.conversation.windowRemainingMs ?? 0) > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-4">
        <div>
          <p className="eyebrow text-slate">Archive Wholesale</p>
          <h1 className="display text-2xl">
            WhatsApp Inbox
            {unreadCount > 0 && <span className="ml-3 text-forest">{unreadCount} new</span>}
          </h1>
        </div>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/inbox/session", { method: "DELETE" });
            window.location.reload();
          }}
          className="text-xs font-bold tracking-wide text-slate uppercase underline underline-offset-4"
        >
          Sign out
        </button>
      </header>

      {!storeIsDurable && (
        <p className="mt-4 border-2 border-red-700 bg-red-50 p-4 text-sm text-red-900">
          <strong>Conversations are being held in memory only.</strong> They will be lost when the
          server restarts, and a second instance will not see them. Set{" "}
          <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code> before
          taking real customer messages.
        </p>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-[19rem_1fr]">
        {/* ------------------------------------------------ Conversation list */}
        <aside className={selected ? "hidden md:block" : "block"}>
          {conversations.length === 0 ? (
            <p className="border-2 border-ash p-4 text-sm text-slate">
              Nothing yet. Messages appear here as soon as the webhook is live.
            </p>
          ) : (
            <ul className="divide-y-2 divide-ash border-2 border-ash">
              {conversations.map((conversation) => (
                <li key={conversation.waId}>
                  <button
                    type="button"
                    onClick={() => void openConversation(conversation.waId)}
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-smoke ${
                      selected === conversation.waId ? "bg-smoke" : ""
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold">
                        {conversation.name ?? formatNumber(conversation.waId)}
                      </span>
                      {conversation.unread && (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-forest"
                          aria-label="Unread"
                        />
                      )}
                    </span>
                    <span className="mt-1 block text-xs text-slate">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                    {conversation.draft && (
                      <span className="mt-2 inline-block bg-ash px-2 py-0.5 text-[0.625rem] font-bold tracking-wide uppercase">
                        Draft ready
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* -------------------------------------------------------- The thread */}
        <section>
          {!thread ? (
            <p className="border-2 border-ash p-6 text-sm text-slate">
              Pick a conversation to read it and check the draft.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ash pb-3">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(null);
                      setThread(null);
                    }}
                    className="mb-1 text-xs font-bold tracking-wide text-slate uppercase md:hidden"
                  >
                    ← All conversations
                  </button>
                  <h2 className="display text-xl">
                    {thread.conversation.name ?? formatNumber(thread.conversation.waId)}
                  </h2>
                  <p className="text-xs text-slate">{formatNumber(thread.conversation.waId)}</p>
                </div>
                <p className={`text-xs font-bold ${windowOpen ? "text-slate" : "text-red-700"}`}>
                  {formatWindow(thread.conversation.windowRemainingMs)}
                </p>
              </div>

              <ol className="mt-4 max-h-[24rem] space-y-3 overflow-y-auto pr-1">
                {thread.messages.map((message, index) => {
                  const fromCamperDays = message.at < thread.historyCutoff;
                  const isFirstAfter =
                    !fromCamperDays &&
                    index > 0 &&
                    thread.messages[index - 1].at < thread.historyCutoff;

                  return (
                    <Fragment key={message.id}>
                      {isFirstAfter && (
                        <li className="flex items-center gap-3 py-1" aria-hidden>
                          <span className="h-px flex-1 bg-ash" />
                          <span className="text-[0.625rem] font-bold tracking-wide text-slate uppercase">
                            Archive Wholesale from here
                          </span>
                          <span className="h-px flex-1 bg-ash" />
                        </li>
                      )}
                      <li className={message.direction === "in" ? "text-left" : "text-right"}>
                        <div
                          className={`inline-block max-w-[85%] px-3 py-2 text-sm whitespace-pre-wrap ${
                            message.direction === "in"
                              ? "bg-smoke text-ink"
                              : "bg-forest text-paper"
                          } ${fromCamperDays ? "opacity-50" : ""}`}
                        >
                          {message.text}
                        </div>
                        <p className="mt-1 text-[0.625rem] text-slate">
                          {formatTime(message.at)}
                          {fromCamperDays && " · camper business — not used for drafts"}
                          {message.sentBy === "business-app" && " · sent from your phone"}
                          {message.status && ` · ${message.status}`}
                          {message.error && ` · ${message.error}`}
                        </p>
                      </li>
                    </Fragment>
                  );
                })}
              </ol>

              {/* ------------------------------------------- The draft and Send */}
              <div className="mt-6 border-2 border-ink p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="eyebrow text-slate">Your reply</p>
                  {thread.draft && !thread.draft.error && (
                    <span
                      className={`px-2 py-0.5 text-[0.625rem] font-bold tracking-wide uppercase ${
                        confidenceLabel[thread.draft.confidence].className
                      }`}
                    >
                      {confidenceLabel[thread.draft.confidence].text}
                    </span>
                  )}
                </div>

                {thread.draft?.error && (
                  <p className="mt-3 border-l-4 border-red-700 bg-red-50 p-3 text-sm text-red-900">
                    {thread.draft.error}
                  </p>
                )}

                {thread.draft && thread.draft.needsOwnerInput.length > 0 && (
                  <div className="mt-3 border-l-4 border-forest bg-smoke p-3">
                    <p className="text-xs font-bold tracking-wide uppercase">Needs you</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-ink">
                      {thread.draft.needsOwnerInput.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  rows={6}
                  placeholder={
                    thread.draft
                      ? "Edit the draft, then send."
                      : "No draft yet — write a reply, or press Draft a reply."
                  }
                  className="mt-3 w-full border-2 border-ash bg-paper px-3 py-2 text-sm transition-colors focus:border-forest focus:outline-none"
                />

                <p className="mt-1 text-right text-[0.625rem] text-slate">
                  {reply.length} / 4096
                </p>

                {notice && (
                  <p
                    className={`mt-2 text-sm ${
                      notice.kind === "ok" ? "text-forest" : "text-red-700"
                    }`}
                  >
                    {notice.text}
                  </p>
                )}

                {!windowOpen && (
                  <p className="mt-2 text-sm text-red-700">
                    More than 24 hours have passed since they last messaged. WhatsApp will only
                    accept an approved template now — reply from your phone instead.
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={busy !== null || !reply.trim() || !windowOpen}
                    className="bg-forest px-6 py-3 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark disabled:opacity-40"
                  >
                    {busy === "sending" ? "Sending…" : "Send"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDraft}
                    disabled={busy !== null}
                    className="border-2 border-ink px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors hover:bg-smoke disabled:opacity-40"
                  >
                    {busy === "drafting" ? "Drafting…" : thread.draft ? "Draft again" : "Draft a reply"}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
