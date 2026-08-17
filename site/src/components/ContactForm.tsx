"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string };

const fieldClass =
  "mt-2 w-full border-2 border-ash bg-paper px-4 py-3 text-sm transition-colors focus:border-forest focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: { ok?: boolean; message?: string } = await response.json();

      if (response.ok && result.ok) {
        setStatus({ kind: "sent" });
        form.reset();
        return;
      }
      setStatus({
        kind: "error",
        message: result.message ?? "Something went wrong. Please email us instead.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "We could not reach the server. Please email or WhatsApp us instead.",
      });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="border-2 border-forest p-8">
        <p className="display text-xl text-forest">Message sent</p>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          Thanks — we have your enquiry and will come back to you, usually the same working day.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-6 text-sm font-bold tracking-wide text-forest uppercase underline underline-offset-4"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow text-slate">
            Your name *
          </label>
          <input id="name" name="name" required autoComplete="name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className="eyebrow text-slate">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="business" className="eyebrow text-slate">
          Business or shop name
        </label>
        <input id="business" name="business" autoComplete="organization" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="message" className="eyebrow text-slate">
          What are you looking for? *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Brands, garment types, sizes, volumes, delivery destination — the more detail the faster we can quote."
          className={`${fieldClass} resize-y`}
        />
      </div>

      {/* Spam trap — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="w-full bg-forest px-8 py-4 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status.kind === "sending" ? "Sending…" : "Send enquiry"}
      </button>

      {status.kind === "error" && (
        <p role="alert" className="border-l-2 border-forest bg-smoke p-4 text-sm leading-relaxed">
          {status.message}{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-bold text-forest underline underline-offset-4"
          >
            {siteConfig.email}
          </a>
        </p>
      )}
    </form>
  );
}
