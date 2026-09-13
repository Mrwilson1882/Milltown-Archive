import type { Metadata } from "next";
import { inboxConfigured, isSignedIn } from "@/lib/whatsapp/auth";
import { canReceive, canSend, draftingEnabled } from "@/lib/whatsapp/config";
import { storeIsDurable } from "@/lib/whatsapp/store";
import { loadConversationSummaries } from "@/lib/whatsapp/inbox";
import { InboxLogin } from "@/components/inbox/InboxLogin";
import { Inbox } from "@/components/inbox/Inbox";

export const metadata: Metadata = {
  title: "WhatsApp Inbox",
  robots: { index: false, follow: false },
};

/** Staff screen — always rendered fresh, never cached or prerendered. */
export const dynamic = "force-dynamic";

export default async function InboxPage() {
  if (!inboxConfigured()) {
    return (
      <Setup title="The inbox is not switched on">
        Set <code>INBOX_PASSWORD</code> in the environment to open it. Until then this page stays
        shut rather than defaulting to open.
      </Setup>
    );
  }

  if (!(await isSignedIn())) return <InboxLogin />;

  if (!canSend || !canReceive) {
    return (
      <Setup title="WhatsApp is not connected yet">
        {!canReceive && (
          <>
            Messages cannot be received: set <code>WHATSAPP_APP_SECRET</code> and{" "}
            <code>WHATSAPP_VERIFY_TOKEN</code>.{" "}
          </>
        )}
        {!canSend && (
          <>
            Replies cannot be sent: set <code>WHATSAPP_PHONE_NUMBER_ID</code> and{" "}
            <code>WHATSAPP_ACCESS_TOKEN</code>.{" "}
          </>
        )}
        The full walkthrough is in <code>docs/whatsapp-connector.md</code>.
      </Setup>
    );
  }

  return (
    <>
      {!draftingEnabled && (
        <p className="mx-auto max-w-6xl px-4 pt-6">
          <span className="block border-2 border-ash bg-smoke p-4 text-sm text-slate">
            <code>ANTHROPIC_API_KEY</code> is not set, so replies are not being drafted. The inbox
            works — you are just writing every reply yourself.
          </span>
        </p>
      )}
      <Inbox initialConversations={await loadConversationSummaries()} storeIsDurable={storeIsDurable} />
    </>
  );
}

function Setup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <p className="eyebrow text-slate">Archive Wholesale</p>
      <h1 className="display mt-2 text-3xl">{title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate">{children}</p>
    </div>
  );
}
