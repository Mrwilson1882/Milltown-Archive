# Invoicing

Invoices for **MANCH LTD**, trading as **Archive Wholesale**.

Prices come from the live website catalogue (`site/src/data/catalogue.ts`), so an
invoice can never quote a figure the site does not — unless a price is
deliberately overridden on the line, which the invoice then labels
*"Price as agreed"*.

The rule from [`../pricing-notes.md`](../pricing-notes.md) carries over
unchanged: **no price is ever inferred.** A lot the owner has not priced comes
back as an error naming the lot, never as a guess.

---

## Two ways to raise an invoice

**1. In chat.** Post the customer and what they have bought. The invoice is
generated here, committed to `out/`, and the numbers come from the catalogue
automatically.

**2. In the browser.** The blank invoice tab holds a blank invoice with the
whole catalogue loaded, a customer book and a running invoice number. Fill it
in, print to PDF, send.

> **The blank invoice tab**
> <https://claude.ai/artifact/43tP58LSPpD9XqSnwjKumX>

Both produce the same document.

---

## Running the generator

```bash
node invoicing/generate-invoice.mjs invoicing/jobs/<job>.json   # a real invoice
node invoicing/generate-invoice.mjs --blank                     # an empty one to print and fill by hand
```

Output lands in `invoicing/out/<invoice-number>.html` — one self-contained file
with the logo embedded, so it opens anywhere, survives being emailed as an
attachment, and prints to A4 with no assets to chase.

**To make a PDF:** open the file in a browser and print (⌘P / Ctrl-P) →
*Save as PDF*. The page is set to A4 with print margins, the controls and screen
chrome drop away, and the table header repeats if it runs to a second page.

---

## Writing a job file

Copy [`jobs/example.json`](jobs/example.json) and edit it. Everything except
`lines` is optional.

```jsonc
{
  "invoiceDate": "2026-09-14",      // defaults to today
  "supplyDate":  "2026-09-16",      // when the goods went out
  "paymentTerms": "30 days",        // free text; "N days" also sets a due date
  "poNumber": "PO-4471",            // the customer's own order reference

  "customer": {
    "business": "Northern Thrift Co.",
    "contact":  "Sam Okafor",
    "lines":    ["Unit 7, Dale Street Mills", "Dale Street", "Manchester"],
    "postcode": "M1 2HF",
    "email":    "buying@example.co.uk",
    "phone":    "0161 496 0000"
  },

  "deliverTo": { "lines": ["…"], "postcode": "…" },   // omit if same as above

  "lines": [ /* see below */ ],

  "delivery": 45,                   // carriage, if it is being charged
  "discount": 25,                   // off the subtotal
  "notes": "Two pallets, booked for Wednesday."
}
```

### The three line shapes

| Shape | Use it for |
|---|---|
| `{ "slug": "…", "pieces": 25, "qty": 2 }` | A catalogue lot at the catalogue price |
| `{ "slug": "…", "pieces": 10, "qty": 1, "unitPrice": 115 }` | A catalogue lot at a **price you have agreed** — prints as "Price as agreed" |
| `{ "description": "…", "qty": 50, "unit": "kg", "unitPrice": 4.5 }` | Anything off-catalogue: kilos, bales, carriage, a one-off |

`slug` is the product key in `site/src/data/catalogue.ts`. `pieces` is the lot
size — the generator looks up that exact lot and refuses politely if the site
does not list it, telling you which sizes it does.

Add `"note": "…"` to any line to print a short line of context under it
(*"Agreed on WhatsApp, 14 Sep"*).

### The catalogue, as it stands

Lot prices as currently set on the site. `POR` = price on request, so a line
using it needs an explicit `unitPrice`.

| Slug | Lots |
|---|---|
| `starter-box-10` | 10 = £90 |
| `y2k-designer-female-mix-box` | 10 = £100 · 20 = £180 |
| `designer-male-mix-box` | 10 = £100 · 20 = £180 |
| `lacoste-ralph-lauren-polos` | 10 = £85 · 25 = £200 · 50 = £375 |
| `ralph-lauren-polos` | 10 = £90 · 25 = £200 · 50 = £350 |
| `carhartt-dickies-t-shirts` | 10 = £75 · 25 = £181.25 · 50 = £375 |
| `ralph-tommy-lacoste-mix` | 10 = £95 · 25 = £225 · 50 = £425 |
| `mixed-premium-vintage-hoodies-sweatshirts` | 10 = £95 · 25 = £225 · 50 = £425 |
| `mixed-premium-vintage-hoodies` | 10 = £95 · 25 = £225 · 50 = £425 |
| `mixed-premium-vintage-sweatshirts` | 10 = £95 · 25 = £225 · 50 = £425 |
| `lacoste-jumpers-cardigans` | 10 = £100 · 25 = £225 · 50 = £425 |
| `festival-track-jackets` | 10 = £125 · 25 = £275 · 50 = £450 |
| `birkenstock-sandals` (pairs) | 10 = £80 · 25 = POR · 50 = POR |
| `bags` | 10 = POR · 25 = POR · 50 = POR |
| `mixed-mens-lacoste` | 10 = £90 · 25 = £218.75 · 50 = £425 |
| `t-shirt-mix` | 10 = £65 · 25 = £150 · 50 = £275 |
| `jackets-windbreaker-mix` | 10 = £125 · 25 = £275 · 50 = £450 |
| `mens-luxury-winter-mix` | 10 = £160 |
| `womens-y2k-summer-mix` | 10 = £100 · 25 = £225 · 50 = £400 |
| `designer-jackets` | 10 = £300 |

This table is a convenience copy. The generator reads the catalogue file itself,
so a price changed on the site is the price on the next invoice — but update
this table when you change one, or it will quietly go stale.

There is no published rate per kilo, so kilo orders are invoiced as a free-text
line with the rate you quoted.

---

## Company details

Everything printed in the company's own name lives in
[`company.json`](company.json) — edit that file, never the generator.

The registered office is **6 Knowsley Street, Colne, BB8 0SD**.



An invoice that is still missing something it needs — a customer, an address, a
line, a price — **prints a red "Not ready to send" band** listing exactly what,
so a half-finished invoice cannot go out by accident.

### How the customer pays

`payment.method` decides what the How to pay block shows:

| Method | What prints |
|---|---|
| `"link"` *(current)* | "Secure payment link", the amount, the invoice number as reference, and the link itself if the job carries one |
| `"bank"` | The account name, sort code and account number from `bank` |
| `"both"` | Both |

Payment is currently by link, so the `bank` fields are unused and not printed —
they are kept in the file so bank transfer can be switched on later by changing
one word.

Add `"paymentLink": "https://…"` to a job to print the actual link on the
invoice. Without one it just says a link is sent alongside.

### VAT

MANCH LTD is not VAT registered. The invoice says so explicitly rather than
staying silent about it:

> MANCH Ltd is not registered for VAT. No VAT is charged on this invoice and
> none is recoverable from it.

When registration comes through, set `vat.registered` to `true` and add the VAT
number in `company.json` — **and flip `siteConfig.vat.registered` in
`site/src/config/site.ts` at the same time**, or the site and the invoices will
disagree. VAT then appears as its own line above the total.

---

## The blank invoice tab

<https://claude.ai/artifact/43tP58LSPpD9XqSnwjKumX>

Built from [`tab/invoice-tab.template.html`](tab/invoice-tab.template.html). The
catalogue and the logo are injected at build time, so the lot sizes and prices
in its picker are the site's own and cannot drift:

```bash
node invoicing/tab/build-tab.mjs   # rebuild after any catalogue change
```

Then republish it to the same URL. Re-run this whenever a price changes on the
site, or the tab will keep offering yesterday's figures.

What it holds:

- **The catalogue** — pick a product and a lot size and the price comes with it.
  Every figure stays editable on the line, so an agreed price just gets typed over.
- **A customer book** — saving an invoice saves the customer, and the next
  invoice for them is one dropdown away.
- **The register** — every invoice saved, recallable, with a running number.
- **Your company details** — the registered office is typed in once and
  remembered for every invoice after.
- **A payment link field** — paste the link for that invoice and it prints on it.
- **The same "Not ready to send" band**, live, updating as fields are filled.

Print (⌘P / Ctrl-P) drops the controls and prints the sheet alone at A4.

---

## Invoice numbers

The sequence is `AW-0001`, `AW-0002`, and so on. Sequential numbering with no
gaps is what makes a set of invoices auditable.

**The tab's register is the authority.** It holds the next number and reserves
it under a short lease when an invoice is saved, so two open tabs can never hand
out the same one.

An invoice raised in chat takes its number from that same register and bumps it,
so the two ways of working share one sequence rather than running two that
collide. `next-number.json` is the generator's own fallback for when the
register is not reachable.

`--blank` and any job with an explicit `"invoiceNumber"` do **not** consume a
number.

---

## Files

```
invoicing/
├── company.json          MANCH LTD's own details, bank, terms — edit this
├── next-number.json      the invoice sequence
├── generate-invoice.mjs  the CLI
├── render.mjs            the document itself: layout, brand, print rules
├── jobs/                 one file per invoice raised
│   └── example.json      a worked example of all three line shapes
├── out/                  generated invoices — the record of what was sent
└── tab/
    ├── invoice-tab.template.html   the fillable tab — edit this
    ├── build-tab.mjs               injects the catalogue and the logo
    └── invoice-tab.html            the built page that gets published
```

The design follows the site's brand tokens in `site/src/app/globals.css`: black
type on white, forest green `#0F4A2E` as the only accent, Archivo, 2px rules.
Nothing in `render.mjs` invents a colour.
