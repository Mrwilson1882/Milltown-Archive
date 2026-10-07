import "server-only";

/**
 * A trade enquiry off the contact form, as it reaches the owner.
 *
 * Plain and short. It is read on a phone, and the only thing that matters is
 * who wrote, what they want and how to answer — so the reply-to is set to
 * their address and hitting reply goes straight back to them rather than to
 * the website.
 */
export type Enquiry = {
  name: string;
  email: string;
  business: string;
  message: string;
};

const FONT = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif";

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function enquirySubject(enquiry: Enquiry): string {
  const who = enquiry.business ? `${enquiry.name}, ${enquiry.business}` : enquiry.name;
  return `Enquiry — ${who}`;
}

export function enquiryHtml(enquiry: Enquiry): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${esc(enquirySubject(enquiry))}</title></head>
<body style="margin:0;background:#fff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:20px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%">

  <tr><td style="font:800 22px/1.1 ${FONT};text-transform:uppercase;letter-spacing:-0.02em">
    Enquiry from the website
  </td></tr>

  <tr><td style="padding-top:16px">
    <div style="font:700 10px/1.2 ${FONT};letter-spacing:0.16em;text-transform:uppercase;color:#5B5B57;padding-bottom:5px">From</div>
    <div style="font:400 15px/1.6 ${FONT}">
      <strong>${esc(enquiry.name)}</strong>${enquiry.business ? `<br>${esc(enquiry.business)}` : ""}
      <br><a href="mailto:${esc(enquiry.email)}" style="color:#0F4A2E">${esc(enquiry.email)}</a>
    </div>
  </td></tr>

  <tr><td style="padding-top:18px">
    <div style="font:700 10px/1.2 ${FONT};letter-spacing:0.16em;text-transform:uppercase;color:#5B5B57;padding-bottom:5px">What they said</div>
    <div style="font:400 15px/1.65 ${FONT};background:#F4F4F2;border-left:3px solid #0F4A2E;padding:14px 16px;white-space:pre-wrap">${esc(enquiry.message)}</div>
  </td></tr>

  <tr><td style="padding-top:22px;border-top:1px solid #E4E4E0;margin-top:20px;font:400 12px/1.6 ${FONT};color:#5B5B57">
    Hit reply and it goes straight back to them. Sent from the contact form on
    archivewholesale.co.uk.
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

export function enquiryText(enquiry: Enquiry): string {
  return [
    "ENQUIRY FROM THE WEBSITE",
    "",
    "FROM",
    `  ${enquiry.name}`,
    ...(enquiry.business ? [`  ${enquiry.business}`] : []),
    `  ${enquiry.email}`,
    "",
    "WHAT THEY SAID",
    ...enquiry.message.split("\n").map((l) => `  ${l}`),
    "",
    "Hit reply and it goes straight back to them.",
  ].join("\n");
}
