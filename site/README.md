# Archive Wholesale — website

The storefront for **www.archivewholesale.co.uk**, built to the brief in
`Archive_Wholesale_Website_Brief.docx`.

Black type and structure on a white ground, forest green (`#0F4A2E`) as the only
accent, Hub-style square category tiles on the home page, and a full cart and
checkout framework ready for Stripe.

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Stripe Checkout (optional until keys are added)
- Static-generated pages — 43 routes prerendered at build time

---

## Running it locally

```bash
cd site
npm install
cp .env.example .env.local   # fill in what you have; blanks are handled
npm run dev                  # http://localhost:3000
```

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `node scripts/generate-placeholder-art.mjs` | Regenerate the placeholder tiles |

---

## The five things to do before launch

### 1. Set your prices

**Every bundle currently ships with no price.** `priceGBP: null` renders as
"Price on request" and sends the customer to WhatsApp or email instead of the
cart. No price on this site was invented — you set them, the same rule as
`pricing-notes.md` in the repo root.

Open `src/data/bundles.ts` and set the price in pounds:

```ts
priceGBP: 249.99,
```

That bundle is then buyable through Stripe checkout immediately. Mixed baskets
work: priced bundles go through card checkout, unpriced ones are listed
separately as enquiry items.

### 2. Replace the sample catalogue

`src/data/bundles.ts` holds twelve placeholder bundles — real category
structure, invented contents. Replace the names, piece counts, weights, size
runs and descriptions with actual stock.

The categories in `src/data/taxonomy.ts` (brands, product types, collections)
are the ones from the brief plus the SKU groups already in `inventory.csv`.
Add, remove or rename them freely — each one automatically gets its own page, a
home-page tile, a footer link and a sitemap entry.

### 3. Add product photography

Until photos exist, each bundle shows a generated abstract tile. To use a real
photo, add a `photos` array to the bundle:

```ts
photos: [
  { src: "/images/bundles/nike-25/01.jpg", alt: "Twenty-five vintage Nike track jackets laid out" },
  { src: "/images/bundles/nike-25/02.jpg", alt: "Close-up of embroidered swoosh on a navy track jacket" },
],
```

Put the files under `public/images/bundles/…`. Photos win over the placeholder
automatically, and the first one becomes the card image. Write real alt text —
it is read aloud by screen readers and it is worth genuine SEO.

### 4. Add the WhatsApp number

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the business number in full international
format, digits only — a UK mobile `07700 900123` becomes `447700900123`.

While it is blank, every WhatsApp button on the site is hidden rather than shown
broken. Once set, you get: the floating button on every page, the Contact page
button, the hero CTA, per-bundle enquiry buttons, and a "send basket on
WhatsApp" button in the cart that pre-fills the customer's whole order as text.

### 5. Connect Stripe

Put the secret key from <https://dashboard.stripe.com/apikeys> into
`STRIPE_SECRET_KEY`. Nothing else needs to change — `/api/checkout` starts
creating real Checkout Sessions the moment the key is present.

Before that, the cart still works end to end and the checkout button explains
that card payment is not switched on yet, pointing at WhatsApp and email.

For order notifications, add a webhook in the Stripe dashboard pointing at
`https://www.archivewholesale.co.uk/api/stripe/webhook`, subscribe to
`checkout.session.completed`, and put the signing secret in
`STRIPE_WEBHOOK_SECRET`. Paid orders are logged today — extend
`handlePaidOrder` in `src/app/api/stripe/webhook/route.ts` to email them, write
them to a sheet, or feed them back into the inventory ledger.

**Prices are charged in GBP and are taken from the server-side catalogue, never
from the browser.** A customer cannot edit a price in dev tools and check out
at their own number.

---

## Deployment, domain and SSL

The site needs a Node host. Vercel is the path of least resistance for Next.js
and handles HTTPS for you.

1. Push this repo to GitHub (already done) and import it at
   <https://vercel.com/new>. Set the **root directory** to `site`.
2. Add the environment variables from `.env.example` in
   *Project → Settings → Environment Variables*.
3. Add both `archivewholesale.co.uk` and `www.archivewholesale.co.uk` under
   *Settings → Domains*, and set `www` as primary so the apex redirects to it.
4. At your domain registrar, point the DNS records at the host as instructed —
   typically a `CNAME` for `www` and an `A` record for the apex.
5. **SSL:** Vercel issues and renews a Let's Encrypt certificate automatically
   once DNS resolves, usually within minutes. No manual certificate purchase is
   needed. Confirm `https://www.archivewholesale.co.uk` loads with a padlock
   before you connect live Stripe keys — Stripe requires HTTPS at checkout.
6. Set `NEXT_PUBLIC_SITE_URL=https://www.archivewholesale.co.uk` in production
   so canonical URLs, the sitemap and Stripe redirect URLs all point at the live
   domain.

Any Node host works — Netlify, Railway, Fly.io, a VPS behind nginx. On a VPS
you would run `npm run build && npm start` behind a reverse proxy and issue a
certificate with `certbot`.

---

## Contact form

The form at `/contact` posts to `/api/contact`, which validates the input,
drops anything that trips the hidden spam field, and forwards the enquiry as
JSON to whatever URL is in `CONTACT_FORWARD_WEBHOOK` — a Zapier or Make hook, a
Formspree endpoint, or your own relay.

With no webhook set, the form tells the customer honestly that it is not wired
up yet and points them at the email address and WhatsApp instead. It never
pretends a message was delivered.

---

## SEO

Already in place:

- Per-page titles and meta descriptions, with a site-wide template
- Canonical URLs on every page
- `sitemap.xml` and `robots.txt`, generated from the catalogue at build time
- Organization JSON-LD site-wide, Product JSON-LD on every bundle page
- Clean URLs: `/brands/nike`, `/types/track-jackets`, `/collections/y2k`,
  `/bundles/<slug>`
- Keyword-rich copy blocks on the home page and every category page
  (`seoCopy` in `src/data/taxonomy.ts` — edit it there)
- Alt text on every image
- Cart and checkout pages excluded from indexing
- Open Graph and Twitter card metadata

After launch: submit the sitemap in Google Search Console, and set up a Google
Business Profile if you want to show up for local trade searches.

---

## Layout of the code

```
site/
├── src/
│   ├── app/
│   │   ├── page.tsx                    Home — hero, tile grid, featured, SEO copy
│   │   ├── bundles/                    Listing + individual bundle pages
│   │   ├── brands/ types/ collections/ Category index + detail pages
│   │   ├── cart/  checkout/success/    Cart and post-payment return
│   │   ├── contact/                    Form, details, WhatsApp
│   │   ├── api/checkout/               Creates Stripe Checkout Sessions
│   │   ├── api/stripe/webhook/         Verified Stripe order events
│   │   ├── api/contact/                Enquiry forwarding
│   │   ├── sitemap.ts  robots.ts       Generated from the catalogue
│   │   └── layout.tsx  globals.css     Shell, brand tokens, fonts
│   ├── components/                     Header, Footer, tiles, cards, cart, forms
│   ├── config/site.ts                  Name, email, WhatsApp, nav — edit here
│   ├── data/bundles.ts                 THE CATALOGUE — prices live here
│   ├── data/taxonomy.ts                Brands, types, collections, SEO copy
│   └── lib/                            Cart maths, price formatting, Stripe
├── scripts/generate-placeholder-art.mjs
└── public/images/tiles/                Generated placeholder artwork
```

The logo is set in live type (`src/components/Logo.tsx`) rather than shipped as
an image, so it stays sharp at any size. To use the original artwork file
instead, drop it at `public/logo.svg` and swap the markup in that one component.
