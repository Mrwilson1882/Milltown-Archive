# The WhatsApp Business connector

Incoming WhatsApp Business messages land in a review inbox at `/inbox`. Each one
gets a suggested reply, written against the live catalogue. You read it, edit it
if you want to, and press Send.

**Nothing reaches a customer without that press.** There is no code path that
sends a message on its own. That is the whole design, and phase two below is
what it would take to change it.

---

## Before anything else: the one decision only you can make

Your number — 07897 740194 — is presumably running the **WhatsApp Business app**
on a phone right now. To let software read and reply to it, Meta has to know
about the number through the **Cloud API**, and there are two ways to do that.

### Option A — Coexistence (what you almost certainly want)

The Business app and the Cloud API share the same number. You carry on using the
app on your phone exactly as now; the API sees the same conversations. Messages
you send from the phone are mirrored to this connector, and replies sent from
`/inbox` appear in the app.

- You keep the app, your chat list, your history and your labels.
- You keep replying from your phone whenever you feel like it.
- The app must be opened at least once every 13 days or the link goes stale.

Meta rolled this out in May 2025. It is the option that does not disrupt how you
work today.

### Option B — Migrate the number to the Cloud API

The number moves to the API completely and **the WhatsApp Business app stops
working on it.** Every reply then has to go through software.

Do not pick this by accident. If you are ever offered "migrate this number" in
the Meta setup and you have not decided to give up the phone app, stop.

> Meta moves this part of their onboarding around. When you set the number up,
> look for the Coexistence or "connect your WhatsApp Business app" path, and read
> what the screen says before confirming. If the only route offered is a full
> migration, come back and we will look at it again rather than pressing on.

There is a third way worth knowing about: a Business Solution Provider (Twilio,
360dialog and others) will do the Meta paperwork for you and charge a margin on
each conversation. This connector talks to Meta directly, which is cheaper and
has no middleman, at the cost of you doing the setup once.

---

## What you need from Meta

You will end up with four values. Collect them, then put them in the
environment; nothing works until all four are present.

1. **Meta Business account** — <https://business.facebook.com>. You may already
   have one for the Facebook or Instagram page.
2. **A Meta app** — <https://developers.facebook.com/apps> → Create app →
   **Business** → add the **WhatsApp** product.
3. From **WhatsApp → API Setup**, take the **Phone number ID** for your business
   number. It is a long number and it is *not* the phone number.
4. From **App settings → Basic**, take the **App Secret**.
5. Create a **permanent access token**: Business Settings → Users → **System
   users** → add a system user with admin access, assign it the app and the
   WhatsApp account, then generate a token with `whatsapp_business_messaging`
   and `whatsapp_business_management`. The token shown on the API Setup page is
   a *temporary* 24-hour one — do not use it for anything but a first test.
6. **Business verification.** Meta will make you verify the business (company
   number, address, a document or two) before you can message freely. It is
   slow rather than hard. Start it early — everything else can be set up while
   it is in the queue.

---

## Setting it up

### 1. Storage

Conversations have to live somewhere. The website runs on a serverless host, so
there is no disk to keep them on.

Create a free Redis database at <https://upstash.com>, or add **Vercel KV** from
the Vercel dashboard, which is the same thing. Copy the REST URL and REST token.

Skip this and the connector still runs, but it holds everything in memory and
loses the lot on every restart. The inbox shows a red warning when it is in that
state. Do not take real customer messages that way.

### 2. Environment variables

In Vercel → Settings → Environment Variables (or `.env.local` when running it
locally):

| Variable | What it is |
|---|---|
| `WHATSAPP_APP_SECRET` | App settings → Basic |
| `WHATSAPP_VERIFY_TOKEN` | Any string you invent. You type it into Meta too. |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp → API Setup |
| `WHATSAPP_ACCESS_TOKEN` | The permanent System User token |
| `INBOX_PASSWORD` | The password for `/inbox`. Make it a good one. |
| `ANTHROPIC_API_KEY` | From <https://console.anthropic.com>, for the drafting |
| `UPSTASH_REDIS_REST_URL` | From Upstash or Vercel KV |
| `UPSTASH_REDIS_REST_TOKEN` | From Upstash or Vercel KV |

`.env.example` has the same list with notes.

### 3. Point Meta at the webhook

Deploy first — the endpoint has to be live before Meta will accept it.

In your Meta app → **WhatsApp → Configuration → Webhooks → Edit**:

- **Callback URL:** `https://www.archivewholesale.co.uk/api/whatsapp/webhook`
- **Verify token:** the same string you put in `WHATSAPP_VERIFY_TOKEN`

Press Verify and save. Meta calls the endpoint once and expects its challenge
echoed back; if the token does not match it refuses, which is the point.

Then **Manage** the webhook fields and subscribe to **`messages`**. That one
field carries incoming messages, delivery receipts and — under Coexistence —
echoes of what you send from your phone.

### 4. Try it

Message the business number from your own phone. Within a second or two it
should appear at `https://www.archivewholesale.co.uk/inbox`, with a draft under
it. Edit it, press Send, and check it arrives.

---

## Using the inbox

Sign in at `/inbox` with `INBOX_PASSWORD`. Conversations are listed
most-recent-first; the green dot means unread.

Each thread gives you:

- **The conversation** as the customer sees it, including anything you sent from
  your phone.
- **The draft**, in an editable box. What you send is whatever is in that box.
- **Needs you** — every point the draft could not answer from the catalogue: an
  unset price, a stock question, a delivery date. These are the bits worth your
  attention; the rest is usually fine as written.
- **A confidence badge** — *Reads complete*, *Worth a look*, or *Needs you*.
- **A countdown** — how long is left to reply (see below).
- **Draft again** — rewrites it. Useful after you have set a price in
  `catalogue.ts`, because the draft is built from the catalogue every time.

New messages appear on their own; the page checks every fifteen seconds.

---

## What the drafts will never do

The rule from `pricing-notes.md` is wired into the drafter, not left to its
judgement:

- **It states a price only if that price is in `catalogue.ts`.** Where a lot has
  no price, the draft says you will confirm it and puts the question in *Needs
  you*. It will not estimate, give a range, say "around", or work a figure out
  from a similar lot.
- **There is no rate per kilo**, so it never quotes one.
- It does not invent stock levels, delivery costs, lead times, minimum orders,
  discounts, payment terms or a returns policy.
- It does not answer questions about an existing order.

The facts it works from are generated from `catalogue.ts` at the moment of
drafting. **Set a price on the website and the drafts start quoting it
immediately** — there is no second place to update.

Photos and voice notes are recorded as `[photo]` and `[voice note]` and are
deliberately *not* interpreted. A draft built around a guess at what is in a
photograph is exactly the failure this is designed to avoid. Open those yourself.

---

## The camper business

This number ran your camper business until **Thursday 10 September 2026**, so
some of the contact list — and, if Coexistence syncs history, some of the
conversations — belong to that business rather than this one.

Two separate things are in place, because one date does not cover it:

1. **Nothing before the cutoff is given to the drafter.** Those messages still
   appear in the inbox so a thread reads properly, greyed out and marked
   *camper business — not used for drafts*, with a divider where Archive
   Wholesale begins. A thread with nothing after the cutoff gets no draft at
   all, and says why.
2. **A camper enquiry arriving *today* is not answered.** A date cannot catch
   that, so the drafter is told plainly what the old business was. Anything
   about vans, conversions, hire, servicing, parts or a previous camper job
   gets a short holding reply and lands in *Needs you* — it is never answered,
   and the clothing catalogue is never mentioned to those customers.

Because the drafter is shown only part of a conversation, it is also told the
history is clipped: if a customer refers back to something it cannot see, it
says you will pick it up rather than inventing what was agreed.

The date is `WHATSAPP_HISTORY_CUTOFF`. Change it if the handover date is
different, or set it to `0` to switch the cutoff off entirely.

---

## The 24-hour rule

This one is Meta's, and it catches people out.

Once a customer messages you, you have **24 hours** to reply in free text. After
that WhatsApp will only deliver a **message template** you have had approved in
advance.

The inbox counts the window down on every thread and refuses to send once it has
closed, with an explanation, rather than letting Meta bounce it. If you want to
be able to reopen a cold conversation, submit a template in Meta → WhatsApp →
Message Templates — something like *"Hi {{1}}, following up on your enquiry about
{{2}} — still interested?"*. Sending templates is not built yet; say the word and
it is a small addition.

Meta charges per conversation, priced by category and country, and the first
1,000 service conversations a month are free. For an inbox this size that is
likely to be nothing or close to it. The drafting is billed separately by
Anthropic, per message drafted, and is fractions of a penny each.

---

## Phase two: sending without you

The switch `WHATSAPP_AUTO_SEND` exists and is `false`. Nothing reads it yet
beyond reporting it, because flipping a flag is not the hard part.

What I would want in place first:

1. **A few weeks of drafts you have actually watched.** Every draft is stored, so
   there will be a record of how often you sent one unchanged, edited it, or
   binned it. That is the evidence for whether this is safe, and it does not
   exist yet.
2. **Auto-send only the drafts marked high confidence with an empty *Needs you*
   list** — a first enquiry, a "what sizes do you do", a link to a product page.
   Anything touching price, an order, a complaint or a negotiation stays with you
   no matter how confident the draft looks.
3. **A delay of a few minutes before it goes**, with a cancel button, so a bad
   one can be caught.
4. **A daily digest** of what was sent on your behalf.

The honest order is: run it manually, look at the record, then decide which
categories you trust. The machinery for steps 2–4 is perhaps a day's work once
there is data to justify it.

---

## When something is wrong

**Meta will not verify the webhook.** The site has to be deployed and live
first. Check `WHATSAPP_VERIFY_TOKEN` matches on both sides exactly — no stray
space. Test it yourself:

```
curl "https://www.archivewholesale.co.uk/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test123"
```

It should print `test123` and nothing else.

**Messages never arrive.** Check you subscribed to the `messages` field, not
just saved the URL. Meta → WhatsApp → Configuration shows recent deliveries and
whether they failed. A `401 invalid_signature` in the logs means
`WHATSAPP_APP_SECRET` is wrong.

**They arrive but there is no draft.** `ANTHROPIC_API_KEY` is missing or the call
failed. The message is safe either way — press **Draft a reply** to try again,
or just write it.

**"Conversations are being held in memory only."** The Redis credentials are not
set. Fix before relying on it.

**A reply will not send.** If the window has closed you will be told so. If Meta
returns an error it is shown verbatim — an expired token and an unverified
business are the two usual causes.

---

## Where the code is

```
src/lib/whatsapp/
  config.ts      Every WhatsApp env var, read in one place
  signature.ts   Proves a webhook really came from Meta
  client.ts      Sending, and marking messages read
  store.ts       Conversations — Redis, or memory with a warning
  knowledge.ts   The facts sheet, built from catalogue.ts
  draft.ts       The drafting call, and the rules it works under
  describe.ts    Turning photos and voice notes into a line of text
  auth.ts        Who may open the inbox
  inbox.ts       The conversation list, shared by page and API
src/app/api/whatsapp/webhook/   Meta's handshake and every event
src/app/api/inbox/              Sign in, list, thread, draft, send
src/app/inbox/                  The review screen
```

`/inbox` is excluded from `robots.txt` and carries `noindex`.
