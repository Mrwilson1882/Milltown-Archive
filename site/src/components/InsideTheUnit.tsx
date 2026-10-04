import Image from "next/image";
import Link from "next/link";

/**
 * Photographs of the unit the stock actually ships from.
 *
 * A first-time trade buyer sending three hundred pounds to a company they have
 * not heard of is asking one question before any other: is there anything
 * behind this website. Product photographs do not answer it — anyone can post
 * a flat lay. A labelled bag of counted stock and a rail in a named unit do.
 *
 * Deliberately not retouched and deliberately not styled. The point is that it
 * looks like a working unit, because it is one.
 */
const shots = [
  {
    src: "/images/unit/labelled-lots.jpg",
    alt: "Counted lots bagged and labelled in the Burnley unit, one marked twenty-five branded hoodies, with a burgundy Carhartt t-shirt and a black adidas jacket on top.",
    caption: "Counted, bagged, labelled",
    body: "Every lot is counted out by hand and labelled with what is in it before it goes anywhere.",
  },
  {
    src: "/images/unit/rails-wide.jpg",
    alt: "A long rail of vintage jackets and coats in the unit, including a fur-trimmed parka and red, yellow and blue outerwear.",
    caption: "Graded on the rail",
    body: "Intake goes up on the rail and is graded piece by piece. Nothing is counted into a lot before it has been looked at.",
  },
  {
    src: "/images/unit/bagged-lots.jpg",
    alt: "Bagged lots stacked against the window of the unit, ready for dispatch.",
    caption: "Our own unit, Burnley",
    body: "Vo-10, Empire Business Park. Not a dropshipper and not a middleman — the stock is here and so are we.",
  },
  {
    src: "/images/unit/rails-close.jpg",
    alt: "Two rails of vintage garments on black hangers, including a coral hooded sweatshirt, a checked shirt and blue and white windbreakers.",
    caption: "What a lot comes off",
    body: "The photographs on a product page are examples from a line like this one. Yours is counted out fresh at dispatch.",
  },
];

export function InsideTheUnit() {
  return (
    <section className="border-y border-ash bg-smoke">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-forest">Inside the unit</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Where your lot comes from</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate">
              Burnley, Lancashire. Every lot on this site is graded, counted and packed here, by
              hand, by us.
            </p>
          </div>
          <Link
            href="/buyer-information"
            className="inline-flex items-center border-2 border-ink px-5 py-3 text-sm font-bold tracking-wide uppercase transition-colors hover:border-forest hover:text-forest"
          >
            How ordering works →
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shots.map((shot, i) => (
            <li key={shot.src} className="border border-ash bg-paper">
              <div className="relative aspect-4/3">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  /* Only the first is likely to be in view on a phone. */
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-bold tracking-wide text-slate uppercase">
                  {shot.caption}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{shot.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
