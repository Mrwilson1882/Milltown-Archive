"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { hasWhatsApp, siteConfig, whatsappUrl } from "@/config/site";

/**
 * Bulk is quoted, never checked out — the rate per kilo moves with the format,
 * the category and the volume. This builds the enquiry for the customer so the
 * message that lands already says what they want.
 *
 * The three formats and their weight bands mirror how bulk vintage is traded,
 * so a buyer comparing suppliers is comparing like with like.
 */

export type BulkFormat = {
  slug: string;
  name: string;
  range: string;
  min: number;
  max: number;
  quick: number[];
  who: string;
};

export function BulkEnquiry({
  formats,
  categories,
  initialFormat,
}: {
  formats: BulkFormat[];
  categories: { slug: string; name: string }[];
  initialFormat?: string;
}) {
  const [formatSlug, setFormatSlug] = useState(initialFormat ?? formats[0].slug);
  const format = formats.find((f) => f.slug === formatSlug) ?? formats[0];
  const [weight, setWeight] = useState(format.quick[1] ?? format.min);
  const [category, setCategory] = useState("Mixed — your recommendation");

  function pickFormat(next: BulkFormat) {
    setFormatSlug(next.slug);
    // Keep the weight inside the new format's band.
    setWeight((w) => Math.min(next.max, Math.max(next.min, w)));
  }

  const message =
    `Hi Archive Wholesale, I'd like a bulk quote.\n\n` +
    `Format: ${format.name}\n` +
    `Weight: ${weight}kg\n` +
    `Category: ${category}`;

  return (
    <div className="border-2 border-ink p-6 sm:p-8">
      <h2 className="display text-2xl">Request a quote</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate">
        Pick a format, a weight and a category. We come back with a rate per kilo, what is in the
        current sort and a delivered price.
      </p>

      <fieldset className="mt-7">
        <legend className="eyebrow text-slate">Format</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {formats.map((f) => {
            const selected = f.slug === format.slug;
            return (
              <button
                key={f.slug}
                type="button"
                onClick={() => pickFormat(f)}
                aria-pressed={selected}
                className={`border-2 p-3 text-left transition-colors ${
                  selected ? "border-forest bg-forest text-paper" : "border-ash hover:border-ink"
                }`}
              >
                <span className="block text-sm font-bold tracking-wide uppercase">{f.name}</span>
                <span
                  className={`mt-0.5 block text-xs ${selected ? "text-paper/80" : "text-slate"}`}
                >
                  {f.range}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="eyebrow text-slate">Weight</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {format.quick.map((kg) => (
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
              min={format.min}
              max={format.max}
              step={1}
              value={weight}
              onChange={(e) =>
                setWeight(
                  Math.max(
                    format.min,
                    Math.min(format.max, Math.round(Number(e.target.value) || format.min)),
                  ),
                )
              }
              className="w-24 py-2.5 text-center font-bold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="border-l-2 border-ink px-3 py-2.5 font-bold">kg</span>
          </span>
          <span className="text-xs text-slate">{format.range}</span>
        </label>
      </fieldset>

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

      <div className="mt-8 border-t border-ash pt-6">
        <p className="text-sm">
          <span className="font-bold">Your enquiry:</span>{" "}
          <span className="text-slate">
            {weight}kg · {format.name.toLowerCase()} · {category.toLowerCase()}
          </span>
        </p>

        <p className="eyebrow mt-4 text-slate">
          {hasWhatsApp ? "Send via WhatsApp or email" : "Send by email"}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {hasWhatsApp && (
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-forest px-6 py-3.5 text-sm font-bold tracking-wide text-paper uppercase transition-colors hover:bg-forest-dark"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Via WhatsApp
            </a>
          )}
          <a
            href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Bulk quote — ${weight}kg ${format.name.toLowerCase()}`)}&body=${encodeURIComponent(message)}`}
            className="inline-flex items-center border-2 border-ink px-6 py-3.5 text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest"
          >
            Via email
          </a>
        </div>
      </div>
    </div>
  );
}
