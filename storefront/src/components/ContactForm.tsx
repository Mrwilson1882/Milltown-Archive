"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

type State = "idle" | "sending" | "sent" | "failed";

/**
 * The contact form.
 *
 * It posts to /api/contact, which forwards to whatever inbox relay is
 * configured. With no relay set up the route says so plainly and the form
 * falls back to the email address rather than silently swallowing a message.
 */
export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setState("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload: { error?: string } = await response.json().catch(() => ({}));
        setError(payload.error ?? "That did not send.");
        setState("failed");
        return;
      }

      form.reset();
      setState("sent");
    } catch {
      setError("That did not send — check your connection.");
      setState("failed");
    }
  };

  if (state === "sent") {
    return (
      <div className="border rule bg-brick-tint px-5 py-6">
        <p className="display text-2xl">Message received.</p>
        <p className="mt-2 text-sm text-ink-2">
          We will come back to you at the address you gave, usually the same day.
        </p>
      </div>
    );
  }

  const field = "w-full border rule bg-paper px-4 py-3 text-base outline-none focus:border-brick";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">Your name</span>
          <input name="name" required autoComplete="name" className={`mt-2 ${field}`} />
        </label>
        <label className="block">
          <span className="eyebrow">Email</span>
          <input type="email" name="email" required autoComplete="email" className={`mt-2 ${field}`} />
        </label>
      </div>

      <label className="block">
        <span className="eyebrow">What are you after?</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="A label, a size, an era — or a question about a piece you have seen."
          className={`mt-2 ${field}`}
        />
      </label>

      {/* Bots fill everything in; people never see this one. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      {error && (
        <p className="border-l-2 border-brick bg-brick-tint px-3 py-2 text-sm text-ink-2">
          {error} You can always email{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">
            {siteConfig.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="bg-ink px-7 py-3.5 text-sm text-paper transition-colors hover:bg-brick disabled:bg-ink-3"
      >
        {state === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
