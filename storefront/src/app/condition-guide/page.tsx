import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Condition & grading",
  description:
    "What each condition grade means on a Milltown Archive listing — from new with tags through to poor — and how faults are recorded.",
  alternates: { canonical: "/condition-guide" },
};

/** The Crosslist condition scale, in the words a buyer needs. */
const GRADES = [
  {
    name: "New with tags",
    body: "Unworn, with the original tags still attached. Deadstock or close to it.",
  },
  {
    name: "New without tags",
    body: "Unworn, but the tags have gone. No wear to the fabric, print or trims.",
  },
  {
    name: "Very good",
    body: "Worn, but you would not know without being told. No faults found, or one so slight it takes looking for. The bulk of the archive sits here.",
  },
  {
    name: "Good",
    body: "Honest wear. A mark, a fade, a small pull or a softened print — always written on the listing and photographed. Wearable as it is.",
  },
  {
    name: "Fair",
    body: "Clear wear or a fault that affects how the piece looks. Priced for it, and described in full.",
  },
  {
    name: "Poor",
    body: "Damaged. Listed for the fabric, the print or the repair job rather than to be worn as found.",
  },
];

export default function ConditionGuidePage() {
  return (
    <>
      <PageHeader
        eyebrow="Guide"
        title="Condition & grading"
        blurb="Every piece is graded against the same six-point scale by the person who sorted it."
        crumbs={[{ href: "/", label: "Home" }]}
      />

      <div className="mx-auto max-w-[70ch] px-4 py-10 sm:px-6 lg:px-10">
        <dl className="border-t rule">
          {GRADES.map((grade) => (
            <div key={grade.name} className="border-b rule py-5">
              <dt className="display text-xl text-brick">{grade.name}</dt>
              <dd className="mt-1.5 text-sm text-ink-2">{grade.body}</dd>
            </div>
          ))}
        </dl>

        <h2 className="display pt-10 text-2xl">How faults are recorded</h2>
        <div className="mt-3 space-y-4 text-base text-ink-2">
          <p>
            Faults have their own line on every listing, kept apart from the
            description so they cannot get lost in it. Where a fault is visible,
            it is photographed as well as written down.
          </p>
          <p>
            Where the faults line reads <strong>&ldquo;no faults found&rdquo;</strong>, the
            piece was checked and nothing was found. Where it says{" "}
            <strong>&ldquo;not stated&rdquo;</strong>, the check has not been written up
            yet — ask, and the piece will be gone over before you order.
          </p>
          <p>
            This is vintage. Everything here has been worn by somebody before you,
            and the grade describes how much that shows.
          </p>
        </div>
      </div>
    </>
  );
}
