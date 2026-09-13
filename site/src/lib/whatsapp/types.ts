/**
 * Types for the WhatsApp Business Cloud API webhook payload, and for the
 * conversation records we keep from it.
 *
 * The webhook types describe only what we actually read. Meta sends more than
 * this, and adds fields over time, so everything is optional and nothing is
 * assumed to be present — a payload shape we do not recognise is skipped, not
 * guessed at.
 */

// --------------------------------------------------------------- Meta payload

export type WebhookTextMessage = {
  from: string;
  /**
   * Only on a Coexistence echo of a message the owner sent from their phone:
   * `from` is then the business number and `to` is the customer.
   */
  to?: string;
  id: string;
  /** Unix seconds, as a string. Meta sends it as a string, not a number. */
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type?: string; caption?: string };
  video?: { id: string; mime_type?: string; caption?: string };
  audio?: { id: string; mime_type?: string; voice?: boolean };
  document?: { id: string; mime_type?: string; filename?: string; caption?: string };
  sticker?: { id: string; mime_type?: string };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
  button?: { text?: string; payload?: string };
  interactive?: {
    type?: string;
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description?: string };
  };
  /** Present when the customer replies to a specific message. */
  context?: { from?: string; id?: string };
  errors?: { code?: number; title?: string; message?: string }[];
};

export type WebhookContact = {
  wa_id: string;
  profile?: { name?: string };
};

export type WebhookStatus = {
  id: string;
  status: "sent" | "delivered" | "read" | "failed" | string;
  timestamp: string;
  recipient_id: string;
  errors?: { code?: number; title?: string; message?: string }[];
};

export type WebhookValue = {
  messaging_product?: string;
  metadata?: { display_phone_number?: string; phone_number_id?: string };
  contacts?: WebhookContact[];
  messages?: WebhookTextMessage[];
  statuses?: WebhookStatus[];
  /**
   * Coexistence only: an echo of a message the owner sent from the WhatsApp
   * Business app on their phone. Same shape as `messages`, but outbound.
   */
  message_echoes?: WebhookTextMessage[];
};

export type WebhookChange = {
  field?: string;
  value?: WebhookValue;
};

export type WebhookEntry = {
  id?: string;
  changes?: WebhookChange[];
};

export type WebhookPayload = {
  object?: string;
  entry?: WebhookEntry[];
};

// ------------------------------------------------------------- Our own record

export type MessageDirection = "in" | "out";

export type StoredMessage = {
  /** Meta's wamid, or a generated id for something we sent. */
  id: string;
  direction: MessageDirection;
  /** Plain text of the message, or a description of a non-text message. */
  text: string;
  /** Meta's message type: text, image, audio, interactive, … */
  type: string;
  /** Milliseconds since epoch. */
  at: number;
  /** Who pressed send: the owner in the inbox, the phone app, or automation. */
  sentBy?: "inbox" | "business-app" | "auto";
  /** Delivery state for outbound messages, as Meta reports it. */
  status?: string;
  /** Set when the send failed, so the inbox can show why. */
  error?: string;
};

export type Conversation = {
  /** The customer's WhatsApp ID — their number in full international form. */
  waId: string;
  /** Their WhatsApp profile name, when Meta gives us one. */
  name?: string;
  /** When they last messaged us. The 24-hour window counts from here. */
  lastInboundAt: number;
  /** When anything last happened on this thread, either direction. */
  lastMessageAt: number;
  /** True until the owner opens the thread in the inbox. */
  unread: boolean;
};

/** What Claude produces. Never sent anywhere without the owner pressing Send. */
export type Draft = {
  waId: string;
  /** The suggested reply, ready to edit. */
  text: string;
  /**
   * Things the draft could not answer from the catalogue and the owner must
   * supply — an unset price, a stock level, a delivery date. Shown prominently
   * in the inbox, because these are exactly the points where a plausible
   * invention would be worst.
   */
  needsOwnerInput: string[];
  /** Claude's own read on whether this is safe to send nearly as-is. */
  confidence: "high" | "medium" | "low";
  /** Products the draft is about, for the owner to sanity-check at a glance. */
  products: string[];
  /** The inbound message id this was drafted against, for staleness checks. */
  inReplyTo: string;
  createdAt: number;
  /** Set when drafting failed, so the inbox explains itself rather than hanging. */
  error?: string;
};
