"use client";

import { useState } from "react";

const fieldClass =
  "mt-2 w-full border-2 border-ash bg-paper px-4 py-3 text-sm transition-colors focus:border-forest focus:outline-none";

export function InboxLogin() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/inbox/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result: { ok?: boolean; message?: string } = await response.json();

      if (response.ok && result.ok) {
        window.location.reload();
        return;
      }
      setError(result.message ?? "Could not sign in.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <p className="eyebrow text-slate">Archive Wholesale</p>
      <h1 className="display mt-2 text-3xl">WhatsApp Inbox</h1>
      <form onSubmit={handleSubmit} className="mt-8">
        <label htmlFor="password" className="eyebrow text-slate">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className={fieldClass}
        />
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full bg-forest px-6 py-3 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark disabled:opacity-50"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
