# Invoicing an order placed on the website

**Still to build.** Owner's request, 2 Oct 2026:
when someone buys on www.archivewholesale.co.uk, Claude should be told and
should raise the invoice from what the site already captured, rather than the
owner retyping it in chat.

## Stripe is live, and the first order came through

**4 Oct 2026: the first website order was paid** — Jez Klawza, a ten-piece Ralph
Lauren polo box, £90.00, invoiced as AW-0004. Stripe is taking card payments,
two days after it was noted here as not integrated. Stripe's own setup guide
still shows "Choose how to accept payments" outstanding, so the account is not
finished even though payments are going through: worth confirming the money is
reaching the right place before relying on it.

So the provider question is settled, and the route already in the repo is the
right one.

**It was raised by hand from a screenshot of the Stripe dashboard.** That is the
thing to remove: everything on that invoice — name, email, phone, both
addresses, the lot, the amount — was already in the Stripe session, and
`handlePaidOrder` could have handed it over without anyone retyping it.

The shape to build: *Stripe says paid → order details land somewhere Claude can
read → job file → invoice.*

---

## It is a sales invoice, not a pro forma

Worth being clear about before anything is built, because it is the one thing
that differs from every document raised so far.

A pro forma asks for payment on an order that is not confirmed. **A Stripe
order is already paid** — the money is taken before the webhook fires. So an
online order produces:

- an **`AW-` sales invoice**, not a `PF-`
- with an **order number**, which a pro forma does not carry
- with **payment terms "Paid"**, not "Due on receipt" — a new value; everything
  so far has been payable on receipt
- and a **customer address**, which Stripe collects as mandatory, so the
  address check passes on its own

The money has moved. Sending that customer a pro forma asking them to pay would
be wrong.

---

## The hook already exists

`site/src/app/api/stripe/webhook/route.ts` → `handlePaidOrder()`. It is wired,
signature-verified, and currently logs the order and nothing else. The comment
in it already says this is where orders should be made to land.

**What Stripe hands it**, on `checkout.session.completed`:

| From the session | Goes to |
|---|---|
| `customer_details.name` | `customer.business` or `customer.contact` |
| `customer_details.email` | `customer.email` |
| `customer_details.phone` | `customer.phone` |
| `customer_details.address` | `customer.lines` + `customer.postcode` |
| `collected_information.shipping_details` | `deliverTo`, when it differs |
| `metadata.lots` | the line items — see below |
| `amount_total` | a figure to check the generated total against |

`metadata.lots` is written by `src/app/api/checkout/route.ts` as
`"<slug>/<pieces>×<qty>, …"` — for example
`lacoste-ralph-lauren-polos/25×2, t-shirt-mix/50×1`. That is **exactly** a job
file's `lines` array in another shape: the slug and lot size are the catalogue's
own, so no name matching is needed and no price comes off the website.

A parser for it belongs next to the WhatsApp one, which does the harder job of
reading prose.

---

## The gap: the site cannot reach this chat

A Next.js route on Vercel has no way to start a Claude session. Three ways round
it, cheapest first:

**1. Relay it and paste.** Point the webhook at the same forwarding URL the
contact form uses (`CONTACT_FORWARD_WEBHOOK`), so a paid order arrives by email
or Slack. The owner pastes it here and the invoice is raised in one turn. Works
today with no build, and is the one to do first.

**2. Write the job file from the webhook.** `handlePaidOrder` commits a
`invoicing/jobs/AW-xxxx-<customer>.json` to this repo through the GitHub API.
The next session runs the generator over anything new. Automatic up to the
point where a human looks at it — which is the right place to stop, because an
invoice goes to a customer.

**3. A scheduled check-in.** A Routine wakes a session on a schedule, reads
paid orders since the last run, and raises the invoices. Nothing to paste, but
it only works once there is somewhere to read orders *from* — so it needs (2)
or a small order store first.

---

## Before any of it

- `STRIPE_WEBHOOK_SECRET` still needs setting and the endpoint registering in
  the Stripe dashboard. Payments are being taken, but until the webhook is
  wired nothing tells the site an order has been paid — AW-0004 was only known
  about because the owner happened to look at the dashboard.
- Finish Stripe's own setup guide, which still shows an outstanding step.
- Delivery was not charged on AW-0004. The checkout's own wording says carriage
  is quoted separately, so either the site should charge it or the invoice
  should say it follows — the first paid order says "Delivery — Free", which is
  true but may not be what was meant.
- The company changed to Archivio Group Ltd (17461677) on 30 Sep 2026. The site
  still says MANCH LTD in `site/src/config/site.ts` and `public/llms.txt`,
  including the old company number. **That wants fixing regardless of any of
  this** — it is wrong on a live public site today.
