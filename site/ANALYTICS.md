# Reading the numbers

What the site records, where it lands, and how to decide where the ad budget
goes. Written for the owner, not for a developer.

## The one rule for ad links

**Never point an ad at a bare URL.** A link with no tags is a sale you cannot
trace. Instagram's in-app browser regularly strips the referrer, so an untagged
visit from a paid ad arrives looking identical to somebody who typed the address
in — the spend and the sale never meet.

Tag every ad link like this:

```
https://www.archivewholesale.co.uk/products/starter-box-10?utm_source=instagram&utm_medium=paid&utm_campaign=sept-starter&utm_content=carousel-a
```

- `utm_source` — where it ran: `instagram`, `facebook`, `tiktok`
- `utm_medium` — `paid` for ads, `bio` for the profile link, `story` for stories
- `utm_campaign` — the campaign, named so you will recognise it in three months
- `utm_content` — which creative, so two images in one campaign can be compared

Change `utm_content` for every variant you test. It is the difference between
"Instagram works" and "the flat-lay works and the model shot does not".

## What gets recorded, and where it lands

| Where | What you see there |
|---|---|
| **Instagram Ads Manager** | Spend, impressions, clicks. What it cost. |
| **Vercel → Analytics** | Page views, referrers, and which pages the ad traffic lands on. |
| **Vercel → Analytics → Events** | `add_to_basket`, `checkout_start`, `checkout_complete`, `enquiry_click`, `bulk_quote` — tagged with the source. |
| **Stripe → Payments → a payment → Metadata** | The order, *and* the campaign that produced it. The authoritative record of what an ad actually earned. |
| **WhatsApp inbox** | Every enquiry opens with `Ref: IG-7K2Q`. The prefix names the source. |

The site remembers two touches per visitor:

- **first** — the ad that introduced them
- **last** — the ad that brought them back the day they bought

Wholesale buyers rarely buy on the first visit. Judging an ad on last touch
alone will consistently undervalue whatever is filling the top of the funnel,
which is usually the very thing you are paying for.

## The reference code

Every visitor is given a short code — `IG-7K2Q` — stamped into the WhatsApp and
email enquiries they send, and onto their Stripe order. `IG` is Instagram, `FB`
Facebook, `TT` TikTok, `GG` Google, `DI` direct.

This is what closes the loop on conversation-led sales. When a deal closes in
WhatsApp a fortnight after the ad ran, the code is still sitting at the top of
the chat. Note it against the invoice and the campaign gets credit for revenue
that would otherwise look like it came from nowhere.

## The three numbers that decide where spend goes

Per campaign, and per product:

1. **Views → basket** (`add_to_basket` ÷ page views).
   Low means the page is not convincing: price, photography, or not enough said
   about what is in the box.
2. **Basket → checkout started** (`checkout_start` ÷ `add_to_basket`).
   Low means something at the basket stage is causing hesitation — most often
   delivery cost being quoted separately.
3. **Checkout started → paid** (`checkout_complete` ÷ `checkout_start`).
   Low means the checkout itself is losing people. This one should be high; if
   it is not, it is the most urgent thing on the list, because you have already
   paid for those customers twice over.

Then the one that decides the budget: **cost per order** — campaign spend from
Ads Manager ÷ orders carrying that campaign in Stripe metadata. Compare it to
the margin on what they actually bought, not to the order value.

## How to read it honestly

A product with heavy traffic and no baskets is not a bad product; it is usually
a bad page. A product with few views and a high basket rate is being hidden —
that is a merchandising fix, and it is cheaper than buying more traffic.

Do not act on a fortnight of thin data. Twenty sessions will happily show a 50%
conversion rate that means nothing at all. Wait for a few hundred sessions per
campaign before moving money on the strength of a difference, and be especially
wary of declaring a winner between two creatives that are close together.

## Before the first ad runs

- [ ] Vercel Web Analytics switched on for the project
- [ ] Custom events confirmed working (these need the Vercel **Pro** plan — on
      Hobby the page views still arrive but the events above stay silent)
- [ ] `STRIPE_SECRET_KEY` set, so card orders and their metadata exist at all
- [ ] `STRIPE_WEBHOOK_SECRET` set and the webhook pointed at `/api/stripe/webhook`
- [ ] Every ad link carries its UTM tags

Attribution cannot be backfilled. A sale that arrives before this is in place
is a sale whose source is gone for good.
