"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";

/**
 * By-the-kilo ordering is quoted, not checked out — rate per kilo depends on
 * the category and the volume. This builds the enquiry for the customer so the
 * message that lands already says what they want.
 *
 * The quick-select weights are common order sizes; the field takes any figure
 * up to 1000kg.
 */
const QUICK_WEIGHTS = [25, 50, 100, 250, 500, 1000];

export function KiloEnquiry({ categories }: { categories: { slug: string; name: string }[] }) {
  const [weight, setWeight] = useState(100);
  const [category, setCategory] = useState("Mixed — your recommendation");

  const message =
    `Hi Archive Wholesale, I'd like a price for buying by the kilo.\n\n` +
    `Category: ${category}\n` +
    `Weight: ${weight}kg`;

  return (
    <div className="border-2 border-ink p-6 sm:p-8">
      <h2 className="display text-2xl">Build your enquiry</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate">
        Pick a category and a weight and we will come back with a rate per kilo, what is in the
        current sort, and a delivery cost.
      </p>

      <fieldset className="mt-7">
        <legend className="eyebrow text-slate">Category</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Mixed — your recommendation", ...categories.map((c) => c.name)].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              aria-pressed={category === name}
              className={`border-2 px-4 py-2 text-xs font-bold tracking-wide uppercase transition-colors ${
                category === name
                  ? "border-forest bg-forest text-paper"
                  : "border-ash text-ink hover:border-ink"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="eyebrow text-slate">Weight</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_WEIGHTS.map((kg) => (
            <button
              key={kg}
              type="button"
              onClick={() => setWeight(kg)}
              aria-pressed={weight === kg}
              className={`min-w-20 border-2 px-4 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors ${
                weight === kg
                  ? "border-forest bg-forest text-paper"
                  : "border-ash text-ink hover:border-ink"
              }`}
            >
              {kg}kg
            </button>
          ))}
        </div>

        <label className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="font-bold">Or enter a weight</span>
          <span className="flex items-center border-2 border-ink">
            <input
              type="number"
              min={1}
              max={1000}
              step={1}
              value={weight}
              onChange={(e) =>
                setWeight(Math.max(1, Math.min(1000, Math.round(Number(e.target.value) || 1))))
              }
              className="w-24 py-2.5 text-center font-bold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="border-l-2 border-ink px-3 py-2.5 font-bold">kg</span>
          </span>
          <span className="text-xs text-slate">Up to 1,000kg</span>
        </label>
      </fieldset>

      <div className="mt-8 border-t border-ash pt-6">
        <p className="text-sm">
          <span className="font-bold">Your enquiry:</span>{" "}
          <span className="text-slate">
            {weight}kg of {category.toLowerCase()}
          </span>
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {hasWhatsApp && (
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-forest px-6 py-3.5 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Send on WhatsApp
            </a>
          )}
          <a
            href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`By the kilo — ${weight}kg`)}&body=${encodeURIComponent(message)}`}
            className="inline-flex items-center border-2 border-ink px-6 py-3.5 text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest"
          >
            Email this enquiry
          </a>
        </div>
      </div>
    </div>
  );
}
