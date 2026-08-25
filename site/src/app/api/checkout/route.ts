import { NextResponse } from "next/server";
import { getStripe, stripeEnabled } from "@/lib/stripe";
import { resolveLines, type CartLine } from "@/lib/cart";
import { toPence } from "@/lib/format";
import { siteConfig, vatRate } from "@/config/site";

export const runtime = "nodejs";

type CheckoutRequest = { items?: unknown };

function parseItems(body: CheckoutRequest): CartLine[] {
  if (!Array.isArray(body.items)) return [];
  return body.items.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const { slug, pieces, qty } = entry as Record<string, unknown>;
    if (typeof slug !== "string") return [];
    if (typeof pieces !== "number" || !Number.isFinite(pieces)) return [];
    const parsedQty = typeof qty === "number" && Number.isFinite(qty) ? Math.floor(qty) : 1;
    return [{ slug, pieces: Math.floor(pieces), qty: Math.max(1, Math.min(99, parsedQty)) }];
  });
}

export async function POST(request: Request) {
  if (!stripeEnabled) {
    // Not an error state — the shop simply isn't taking cards yet.
    return NextResponse.json(
      {
        error: "checkout_not_configured",
        message:
          "Card checkout is not connected yet. Send your basket over on WhatsApp or by email and we will invoice you directly.",
      },
      { status: 503 },
    );
  }

  let body: CheckoutRequest;
  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const resolved = resolveLines(parseItems(body));

  // Prices come from the catalogue on the server, never from the browser.
  const payable = resolved.filter((line) => line.variant.priceGBP !== null);

  if (payable.length === 0) {
    return NextResponse.json(
      {
        error: "nothing_payable",
        message:
          "Nothing in your basket has an online price yet. Send us an enquiry and we will price it for you.",
      },
      { status: 400 },
    );
  }

  // VAT is calculated server-side from the catalogue, never from the browser.
  const vatNetPence = payable.reduce(
    (sum, line) => sum + toPence(line.variant.priceGBP as number) * line.qty,
    0,
  );

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "gbp",
      line_items: [
        ...payable.map((line) => ({
          quantity: line.qty,
          price_data: {
            currency: "gbp" as const,
            unit_amount: toPence(line.variant.priceGBP as number),
            product_data: {
              name: `${line.product.name} — ${line.variant.pieces} ${line.product.unit}`,
              description: line.product.summary,
            },
          },
        })),
        // Catalogue prices are ex-VAT, so VAT is charged as its own visible line
        // rather than being quietly folded into the unit price.
        ...(vatRate > 0 && vatNetPence > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "gbp" as const,
                  unit_amount: Math.round(vatNetPence * vatRate),
                  product_data: {
                    name: `VAT at ${siteConfig.vat.ratePercent}%`,
                  },
                },
              },
            ]
          : []),
      ],
      // Wholesale buyers are businesses; capture what is needed to invoice and ship.
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["GB", "IE", "FR", "DE", "NL", "BE", "ES", "IT", "PL"],
      },
      phone_number_collection: { enabled: true },
      custom_text: {
        submit: {
          message: "Delivery is quoted separately once we have your address and total weight.",
        },
      },
      success_url: `${siteConfig.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteConfig.url}/cart`,
      metadata: {
        lots: payable
          .map((line) => `${line.product.slug}/${line.variant.pieces}×${line.qty}`)
          .join(", ")
          .slice(0, 500),
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "no_session_url" }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Stripe session creation failed", error);
    return NextResponse.json(
      {
        error: "stripe_error",
        message: "We could not start checkout just then. Try again, or send us an enquiry.",
      },
      { status: 502 },
    );
  }
}
