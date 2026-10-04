import type { ReactNode } from "react";

/**
 * One line of the product trust panel.
 *
 * These rows are the last thing a trade buyer reads before spending a few
 * hundred pounds on stock they cannot handle first — what they get, how it is
 * graded, whether it is genuine, what delivery costs. As a plain grey list they
 * read as small print. Given an icon, a hard border and a confident weight,
 * they read as terms.
 *
 * Icons are inline SVG rather than a library: there are seven of them, they
 * never change, and a font or a package for seven paths is weight for nothing.
 */
export type SpecIcon = "lots" | "box" | "grade" | "lock" | "van" | "rule" | "stock" | "note";

const paths: Record<SpecIcon, ReactNode> = {
  // Stacked lots
  lots: (
    <>
      <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
      <path d="m3 12 9 4.5L21 12" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </>
  ),
  // Carton
  box: (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M12 13v8" />
    </>
  ),
  // Ticked tag
  grade: (
    <>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V4.8A2 2 0 0 1 4.8 2.8H12a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.3" />
    </>
  ),
  // Padlock — authenticity
  lock: (
    <>
      <rect x="4" y="10.5" width="16" height="10.5" rx="1.6" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      <circle cx="12" cy="15.5" r="1.2" />
      <path d="M12 16.7v1.6" />
    </>
  ),
  // Delivery van
  van: (
    <>
      <path d="M2 7.5h11v9H2v-9Z" />
      <path d="M13 11h4.2l2.8 3v2.5h-7V11Z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </>
  ),
  // Ruler
  rule: (
    <>
      <path d="m3.5 14.5 7-7 6 6-7 7-6-6Z" />
      <path d="m7 11 1.6 1.6M9.5 8.5l1.6 1.6M12 6l1.6 1.6" />
      <path d="M14.5 3.5 20.5 9.5" />
    </>
  ),
  // Availability
  stock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.3 2.4 2.4 4.6-5" />
    </>
  ),
  note: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <path d="M12 7.8v.6" />
    </>
  ),
};

export function SpecRow({
  icon,
  label,
  value,
  highlight = false,
  tone = "plain",
}: {
  icon: SpecIcon;
  label: string;
  value: ReactNode;
  /** The one row worth lifting off the panel. Used for authenticity. */
  highlight?: boolean;
  tone?: "plain" | "good";
}) {
  return (
    <div
      className={`flex gap-4 border-b border-ash px-4 py-4 last:border-b-0 sm:gap-5 sm:px-5 ${
        highlight ? "bg-smoke" : ""
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 shrink-0 text-forest"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[icon]}
      </svg>
      <div className="min-w-0">
        <dt className="text-xs font-bold tracking-wide text-slate uppercase">{label}</dt>
        <dd
          className={`mt-1 text-sm leading-relaxed font-bold ${
            tone === "good" ? "text-forest" : "text-ink"
          }`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}
