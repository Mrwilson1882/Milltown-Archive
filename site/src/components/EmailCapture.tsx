"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

const SEEN_KEY = "aw-newsletter-seen";
const DELAY_MS = 20_000;

/** Never interrupt someone who is in the middle of buying. */
const HIDE_ON = ["/cart", "/checkout", "/inbox"];

/**
 * The email capture: one pop-up, shown once, offering the newsletter discount.
 *
 * Rules it follows, because a pop-up that ignores them costs more trade than
 * it wins: it waits until someone has been reading for a while, it never
 * appears on the basket or checkout, it is dismissible by button, backdrop or
 * Escape, and once dismissed or signed up it does not come back on that
 * browser.
 *
 * Controlled by siteConfig.newsletter.popup. That stays false until card
 * checkout is live, because the discount is redeemed at the Stripe checkout
 * and offering it earlier would promise something the site cannot deliver.
 */
export function EmailCapture() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  const enabled =
    siteConfig.newsletter.popup && !HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (!enabled) return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Private browsing or blocked storage: show it, just do not remember.
    }
    if (seen) return;
    const timer = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  const close = (reason: "dismissed" | "signed_up") => {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* nothing to remember it with — fine */
    }
    if (reason === "dismissed") trackEvent("newsletter_dismiss", { page: pathname });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close("dismissed");
    };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector<HTMLInputElement>("input[type=email]")?.focus();
    return () => window.removeEventListener("keydown", onKey);
    // close is stable enough for this one-shot dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!enabled || !open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: "" }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (res.ok && data.ok) {
        setState("done");
        trackEvent("newsletter_signup", { page: pathname });
      } else {
        setState("error");
        setMessage(data.message ?? "Could not sign you up just now.");
      }
    } catch {
      setState("error");
      setMessage("Could not sign you up just now.");
    }
  };

  const { discountPercent, code } = siteConfig.newsletter;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4"
      onClick={() => close("dismissed")}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-heading"
        onClick={(e) => e.stopPropagation()}
        className="relative grid w-full max-w-3xl overflow-hidden border-2 border-ink bg-paper shadow-2xl sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={() => close("dismissed")}
          aria-label="Close"
          className="absolute top-2 right-2 z-10 grid h-9 w-9 place-items-center bg-paper/90 text-xl leading-none text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          ×
        </button>

        <div className="order-2 flex flex-col justify-center p-6 sm:order-1 sm:p-8">
          {state === "done" ? (
            <>
              <h2 id="newsletter-heading" className="display text-2xl sm:text-3xl">
                You&apos;re on the list
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate">
                Use this code at checkout for {discountPercent}% off your first order.
              </p>
              <p className="display mt-4 border-2 border-forest px-4 py-3 text-center text-2xl text-forest">
                {code}
              </p>
              <button
                type="button"
                onClick={() => close("signed_up")}
                className="mt-6 inline-flex items-center justify-center bg-ink px-6 py-3 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest"
              >
                Start shopping
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow text-forest">Trade list</p>
              <h2 id="newsletter-heading" className="display mt-3 text-2xl leading-none sm:text-3xl">
                {discountPercent}% off your
                <br />
                first order
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate">
                Join the trade list and we will send new intake, restocks and bulk deals before they
                go up on the site. One email at a time, no noise.
              </p>
              <form onSubmit={submit} className="mt-5">
                <label htmlFor="newsletter-email" className="sr-only">
                  Your email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourshop.co.uk"
                  className="w-full border-2 border-ink bg-paper px-4 py-3 text-base outline-none focus:border-forest"
                />
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="mt-3 w-full bg-forest px-6 py-3.5 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark disabled:opacity-60"
                >
                  {state === "sending" ? "Signing you up…" : `Get ${discountPercent}% off`}
                </button>
                {state === "error" && (
                  <p className="mt-3 text-xs text-slate" role="alert">
                    {message}
                  </p>
                )}
              </form>
              <p className="mt-3 text-xs leading-relaxed text-slate">
                Wholesale only. Unsubscribe whenever you like.
              </p>
            </>
          )}
        </div>

        <div className="relative order-1 aspect-[4/3] bg-smoke sm:order-2 sm:aspect-auto sm:min-h-[22rem]">
          <Image
            src="/images/products/carhartt-dickies-t-shirts/01.jpg"
            alt="Branded workwear t-shirts from an Archive Wholesale lot"
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
