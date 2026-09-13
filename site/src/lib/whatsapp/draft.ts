import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { buildCatalogueFacts, UNKNOWNS } from "./knowledge";
import type { Draft, StoredMessage } from "./types";
import { siteConfig } from "@/config/site";

/**
 * Drafting a reply.
 *
 * The draft is a suggestion and nothing more — it is written to the store and
 * shown in the inbox, and only goes to the customer when the owner presses
 * Send. Nothing in this file talks to WhatsApp.
 */

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

const DraftSchema = z.object({
  /** The reply itself, ready for the owner to edit. */
  reply: z.string(),
  /**
   * high  — answered entirely from the catalogue, safe to send as it stands.
   * medium— mostly answered, one detail worth a look.
   * low   — the customer asked something we genuinely do not know.
   */
  confidence: z.enum(["high", "medium", "low"]),
  /** Every point the owner must fill in or confirm before this can go. */
  needs_owner_input: z.array(z.string()),
  /** Products the reply is about, so the owner can check at a glance. */
  products: z.array(z.string()),
});

/**
 * The stable half of the prompt. Identical on every call, which is what lets
 * prompt caching work — the catalogue is a few thousand tokens and re-reading
 * it at full price on every inbound message would be wasteful.
 */
function systemPrompt(): string {
  return `You are drafting WhatsApp replies for ${siteConfig.name}, a UK vintage
clothing wholesaler. You write as the owner, in the first person, to trade
customers — resellers, market traders and vintage shops.

Your drafts are reviewed by the owner before anything is sent. Write the reply
you believe should go, and be honest in \`needs_owner_input\` about what you
could not answer.

# THE RULE THAT OVERRIDES EVERYTHING: never invent a price

Prices are set by the owner and by nobody else. This business has an explicit,
standing instruction on it, because earlier price suggestions were wrong often
enough to be a liability.

- State a price ONLY if it appears in the catalogue facts below.
- Where the facts say NO PRICE SET, there is no price. Do not estimate it, do
  not infer it from a similar lot, do not give a range, do not say "around" or
  "typically", and do not work one out per piece from a different lot.
- There is NO published rate per kilo. Every kilo enquiry is quoted by the
  owner personally.
- When a price is asked for and you do not have it, say the owner will confirm
  it, and put the exact question in \`needs_owner_input\`.

The same applies to everything else you do not know. Never invent stock levels,
delivery costs, lead times, delivery dates, minimums, discounts, payment terms
or returns policy. Do not guess whether a particular brand or size can be
picked out of a lot.

Not knowing is a perfectly good draft. Making something up is not.

# What you do not know

${UNKNOWNS}

# Voice

- British English. Plain, warm and brief — trade to trade, not a call centre.
- WhatsApp, not email: no "Dear", no sign-off, no subject line.
- Usually two to five short lines. Answer the question, then one clear next step.
- Prices with the £ symbol, exactly as written in the catalogue.
- The customer's name only if you actually know it.
- No emoji unless the customer used them first, and then sparingly.
- Never say "as an AI", never mention that this is drafted, never apologise for
  being a machine. You are writing as the business.

# Useful moves

- Point at a product page on ${siteConfig.url} when it genuinely helps.
- If the enquiry is vague, ask the one question that unlocks it — what they
  sell, what sizes move for them, roughly what volume.
- If a lot is out of stock, say so and offer the nearest thing that is not.
- If the enquiry needs the owner (a quote, an existing order, a complaint),
  write a short holding reply that promises a proper answer, and say so in
  \`needs_owner_input\`.

# Catalogue facts — the only product information you have

${buildCatalogueFacts()}`;
}

/** The recent thread, oldest first, as a readable transcript. */
function transcript(messages: StoredMessage[]): string {
  return messages
    .slice(-20)
    .map((message) => `${message.direction === "in" ? "Customer" : "You"}: ${message.text}`)
    .join("\n");
}

export async function draftReply({
  waId,
  customerName,
  messages,
  inReplyTo,
}: {
  waId: string;
  customerName?: string;
  messages: StoredMessage[];
  inReplyTo: string;
}): Promise<Draft> {
  const base: Omit<Draft, "text" | "needsOwnerInput" | "confidence" | "products"> = {
    waId,
    inReplyTo,
    createdAt: Date.now(),
  };

  try {
    const response = await getClient().messages.parse({
      model: "claude-opus-5",
      max_tokens: 4000,
      // Medium effort: this is short-form writing against a fixed rulebook, run
      // on every inbound message. High earns nothing here and costs on volume.
      output_config: {
        effort: "medium",
        format: zodOutputFormat(DraftSchema),
      },
      system: [
        {
          type: "text",
          text: systemPrompt(),
          // The catalogue is the bulk of the prompt and does not change between
          // messages — cache it rather than paying for it every time.
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Conversation with ${customerName ? customerName : "a customer"} (${waId}).

${transcript(messages)}

Draft the reply to their latest message.`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return {
        ...base,
        text: "",
        needsOwnerInput: ["This message needs a reply written by hand."],
        confidence: "low",
        products: [],
        error: "The drafter declined to answer this one. Write the reply yourself.",
      };
    }

    const parsed = response.parsed_output;
    if (!parsed) {
      return {
        ...base,
        text: "",
        needsOwnerInput: [],
        confidence: "low",
        products: [],
        error: "No draft came back. Write the reply yourself, or try again.",
      };
    }

    return {
      ...base,
      text: parsed.reply.trim(),
      needsOwnerInput: parsed.needs_owner_input,
      confidence: parsed.confidence,
      products: parsed.products,
    };
  } catch (error) {
    console.error("[whatsapp] drafting failed", error);
    return {
      ...base,
      text: "",
      needsOwnerInput: [],
      confidence: "low",
      products: [],
      error:
        error instanceof Anthropic.APIError
          ? `Drafting failed (${error.status}). The message is saved — write the reply yourself.`
          : "Drafting failed. The message is saved — write the reply yourself.",
    };
  }
}
