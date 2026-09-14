import { NextResponse } from "next/server";
import { listingBySlug } from "@/data/catalogue";
import { siteConfig } from "@/config/site";
import { stripe, stripeEnabled, ukShippingGBP } from "@/lib/stripe";

/**
 * Turn a bag into a Stripe Checkout session.
 *
 * The request carries slugs and quantities and nothing else that matters:
 * every price is read from the catalogue on this side of the wire. A bag
 * edited in the browser cannot change what anything costs.
 */

type RequestLine = { slug: string; quantity?: number };

export async function POST(request: Request) {
  if (!stripeEnabled) {
    return NextResponse.json(
      { error: "Card checkout is not switched on yet. Send the bag over by message instead." },
      { status: 503 },
    );
  }

  let body: { lines?: RequestLine[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read the bag." }, { status: 400 });
  }

  const requested = Array.isArray(body.lines) ? body.lines : [];
  if (requested.length === 0) {
    return NextResponse.json({ error: "The bag is empty." }, { status: 400 });
  }

  const lineItems = [];
  const problems: string[] = [];

  for (const line of requested) {
    if (typeof line?.slug !== "string") continue;
    const listing = listingBySlug(line.slug);

    if (!listing) {
      problems.push("One of the pieces in your bag is no longer listed.");
      continue;
    }
    if (!listing.inStock) {
      problems.push(`${listing.title} has sold.`);
      continue;
    }
    if (listing.priceGBP === null) {
      problems.push(`${listing.title} has no price yet, so it cannot be checked out.`);
      continue;
    }

    // Stock is one-of-one unless the Quantity column says otherwise, so a
    // quantity is clamped rather than trusted.
    const wanted = Number.isFinite(line.quantity) ? Math.round(line.quantity as number) : 1;
    const quantity = Math.max(1, Math.min(wanted, Math.max(listing.quantity, 1)));

    lineItems.push({
      quantity,
      price_data: {
        currency: "gbp",
        unit_amount: Math.round(listing.priceGBP * 100),
        product_data: {
          name: listing.title,
          description:
            [listing.brand, listing.size, listing.conditionLabel].filter(Boolean).join(" · ") ||
            undefined,
          metadata: { slug: listing.slug, sku: listing.sku ?? "" },
        },
      },
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: problems[0] ?? "Nothing in the bag can be checked out." },
      { status: 400 },
    );
  }

  const shippingGBP = ukShippingGBP();

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${siteConfig.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteConfig.url}/cart`,
      shipping_address_collection: { allowed_countries: ["GB"] },
      ...(shippingGBP !== null
        ? {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount" as const,
                  display_name: "UK delivery, tracked",
                  fixed_amount: { amount: Math.round(shippingGBP * 100), currency: "gbp" },
                },
              },
            ],
          }
        : {}),
      metadata: { source: "milltownarchive.co.uk" },
    });

    return NextResponse.json({ url: session.url, skipped: problems });
  } catch (error) {
    console.error("Stripe checkout failed", error);
    return NextResponse.json(
      { error: "Checkout could not be started. Try again, or send the bag over by message." },
      { status: 502 },
    );
  }
}
