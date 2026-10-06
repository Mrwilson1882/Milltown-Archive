import "server-only";

/**
 * Outbound email, through Resend.
 *
 * Talked to over plain HTTP rather than through their SDK: it is one POST,
 * and a package for one POST is a dependency to keep patched for nothing.
 *
 * Nothing here throws. An order confirmation failing to send must never fail
 * the Stripe webhook — Stripe retries a non-2xx, so a broken mailbox would
 * turn into a loop of duplicate sends the moment it came back. The caller
 * gets a result it can log and move on from.
 *
 * Needs RESEND_API_KEY set in the environment. Without it, sending is off and
 * says so, which is also what happens on a local build and in preview.
 */
const ENDPOINT = "https://api.resend.com/emails";

/** Who the customer sees it from. Overridable, but this is the live value. */
export const ORDER_FROM =
  process.env.ORDER_EMAIL_FROM || "Archive Wholesale <info@archivewholesale.co.uk>";

/** Set to send the owner a copy of every confirmation. */
export const ORDER_BCC = process.env.ORDER_EMAIL_BCC || "";

export const emailEnabled = Boolean(process.env.RESEND_API_KEY);

export type SendResult = { ok: true; id: string } | { ok: false; reason: string };

export type Attachment = {
  filename: string;
  /**
   * The file's bytes. Text is handed over as a string, anything binary — a
   * spreadsheet, a PDF — as a Buffer. Both are base64'd on the way out,
   * which is the only form Resend takes.
   */
  content: string | Buffer;
};

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  bcc?: string;
  replyTo?: string;
  attachments?: Attachment[];
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, reason: "no_api_key" };
  if (!options.to) return { ok: false, reason: "no_recipient" };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: ORDER_FROM,
        to: [options.to],
        ...(options.bcc ? { bcc: [options.bcc] } : {}),
        reply_to: options.replyTo || "info@archivewholesale.co.uk",
        subject: options.subject,
        html: options.html,
        text: options.text,
        ...(options.attachments?.length
          ? {
              attachments: options.attachments.map((a) => ({
                filename: a.filename,
                content: Buffer.isBuffer(a.content)
                  ? a.content.toString("base64")
                  : Buffer.from(a.content, "utf8").toString("base64"),
              })),
            }
          : {}),
      }),
    });

    if (!response.ok) {
      // Resend puts the reason in the body; the status alone does not say
      // whether it is a bad key or an unverified sending domain.
      const detail = await response.text().catch(() => "");
      return { ok: false, reason: `http_${response.status} ${detail}`.trim() };
    }

    const body = (await response.json()) as { id?: string };
    return { ok: true, id: body.id ?? "" };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "unknown" };
  }
}
