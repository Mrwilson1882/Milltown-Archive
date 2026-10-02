# Invoicing an order placed on the website

**A note for later — nothing here is built yet.** Owner's request, 2 Oct 2026:
when someone buys on www.archivewholesale.co.uk, Claude should be told and
should raise the invoice from what the site already captured, rather than the
owner retyping it in chat.

## Nobody can buy online yet

Confirmed by the owner, 2 Oct 2026: **Stripe is not integrated.** The site is
built for it — checkout route, webhook, the lot of it — but no keys are set, so
the checkout button tells the customer card payment is not switched on and
points them at WhatsApp instead. Until that changes there are no online orders
to invoice, and the rest of this note has nothing to act on.

The payment links going out with the pro formas today are therefore **not
Stripe**. Whatever provider they come from is the thing that actually knows when
a customer has paid, and most of them will send a webhook of some kind. So the
first question is not "how do we automate this" but **which provider is sending
those links** — the answer decides whether the plumbing below is the Stripe
route already in the repo, or the same shape pointed somewhere else.

The shape does not change either way: *provider says paid → order details land
somewhere Claude can read → job file → invoice.* Only the first arrow is
provider-specific.

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

## If it ends up being Stripe, the hook already exists

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

- **Settle the payment provider first.** Stripe is not integrated and the live
  payment links come from somewhere else. Everything below the first arrow is
  the same whoever it is; everything above it is not.
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are unset, so the webhook
  returns 503 and nothing downstream can be tested — relevant only if Stripe is
  the one chosen.
- The company changed to Archivio Group Ltd (17461677) on 30 Sep 2026. The site
  still says MANCH LTD in `site/src/config/site.ts` and `public/llms.txt`,
  including the old company number. **That wants fixing regardless of any of
  this** — it is wrong on a live public site today.
