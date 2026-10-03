# Archive Wholesale — Version Log

Every change that reached the live site, newest first. Each entry names the git commit (and, from 17 September 2026, a version tag) so any earlier state can be restored exactly — code, prices, copy, photos and videos all live in this repository.

## How to go back to an earlier version

1. Pick the version below you want. Every entry carries its commit hash (for example `ceb2a8f`); that hash is the reliable identifier, the version name is just the label.
2. Tell Claude: **"revert the site to v2026.09.17-1"**. It rebuilds that exact state, verifies it, pushes it to `main` and Vercel redeploys within a couple of minutes. Nothing is lost: the newer versions stay in the log and can be re-applied later.
3. Doing it by hand instead: in Vercel, open the project → Deployments → find the deployment for that commit → "Promote to Production" (instant, no rebuild). Or in git: `git checkout -b restore <tag>` then push that to `main`.

Before reverting for a traffic drop, check the Monday analytics review first: the weekly report separates ChatGPT, Google and direct traffic, so it usually shows whether a change on the site or a change at the source caused the fall.

---

## v2026.10.03-3 — 2026-10-03 — commit `159a135`

- **Production now refuses a Stripe test key.** A real customer reached checkout on the evening of 3 October, paid with Revolut Pay, was told the order was placed — and nothing happened: no money taken, no order, no receipt, because the site was still running on a sandbox key. That state is worse than having no checkout at all, so the code no longer permits it.
- `lib/stripe.ts` now treats a key beginning `sk_test_` on the live site as no key. Checkout reports itself not configured and sends the buyer to WhatsApp, which is honest and keeps them, and the webhook refuses too. A line is written to the server log naming the reason.
- Scoped by `VERCEL_ENV`, not `NODE_ENV`, so preview deploys and local development still take test keys and the whole flow can be rehearsed before a live key goes anywhere near the site.

---

## v2026.10.03-2 — 2026-10-03 — commit `cd1c918`

- **Checkout restricted to the United Kingdom**, at the owner's instruction. Stripe's address step now offers GB and nothing else, so an overseas buyer is stopped before paying rather than after. Previously it accepted Ireland, France, Germany, the Netherlands, Belgium, Spain, Italy and Poland.
- The Stripe page says "UK delivery only at the moment" above the pay button.
- Every place the site promised shipping to Ireland and mainland Europe has been corrected: the buyer information page's delivery answer, its "where do you ship from" answer, its delivery panel, and llms.txt. Each now says UK only for the moment and invites an overseas buyer to message rather than leaving them a dead end.

---

## v2026.10.03-1 — 2026-10-03 — commit `c8b2f9b`

- **Product galleries restructured.** The video now leads on every lot that has one, and the photographs sit behind a single tile marked **Example product pictures** with a count on it. Clicking it opens a full viewer the buyer steps through with arrows, keyboard or dots. Fixed to the top of that viewer, in bold: *these are not the items you will receive — lots are counted out from a fresh intake at dispatch.*
- The reason for the change: a row of individual garment thumbnails reads as a catalogue of what is in the box, which is exactly what a counted lot is not. One labelled door, with the caveat on the inside of it, says what the photographs are for without anyone having to read the small print.
- The caption under the gallery rewritten to match, and the "ask us for current pictures before you order" line removed from the no-photography case, which was the last place that promise survived.
- Five photographs added to Track Jackets & Windbreakers: a green, black and white Fila track jacket front and back, a navy, royal and cream adidas, a royal blue adidas Clima365, and a blue and black Reebok. All on white, resized to 1600px, with alt text naming brand and colourway.

---

## v2026.10.02-8 — 2026-10-02 — commit `2ea3b0a`

- "Ask for current photos before ordering" removed from the Designer Jackets listing, along with the claim that we photograph each piece individually before a buyer commits. We do not shoot stock to order, and the site no longer says we do.
- The same promise taken out of three other places it had spread to: the "quantities on request" panel on product pages (which offered "a price and current photos"), the grading guide's "can I see photos" answer, and the matching answer on the buyer information page. All four now say the same thing — every lot is photographed and several carry video, those show the line, and lots are counted out from a fresh intake at dispatch so the pieces do not exist as a lot until they are picked.
- The buyer information document and its PDF updated to match.

---

## v2026.10.02-7 — 2026-10-02 — commit `e18d663`

- **New page: /buyer-information.** The buyer guide is now on the website, not just in a PDF. It answers what a first-time trade buyer actually asks before ordering: how to order, how to pay, what we need from them at payment (name, email for the Evri tracking link, address), the £90 minimum, delivery cost and timing, what condition to expect, and whether the photographs show the exact pieces. Four at-a-glance figures, a five-step order process, delivery and condition panels, and twelve questions wired into FAQPage structured data.
- Deliberately does not repeat the grading definitions in full — it states them once and links to the grading guide, so the two pages never drift apart or compete with each other in search.
- Linked from the footer, listed in the sitemap and named in llms.txt so the AI crawlers find it.
- Two more places on the grading guide still carried the old "Grade A carries no damage" wording — the Grade A/B panel and the last step of the grading process. Both now match the owner's rules.

---

## v2026.10.02-6 — 2026-10-02 — commit `74bfe98`

- Nineteen more photographs added from the owner's own stock (Batch 6), all shot on white and resized to 1600px, following the owner's rule that nothing goes on the site without a white background.
- Track Jackets & Windbreakers gains three (a pale blue and crimson adidas hooded windbreaker, front, back and hood detail). Mixed Premium Vintage Hoodies gains two (a charcoal Trussardi zip-through with a banded hood). Lacoste Jumpers & Cardigans gains four (cream V-neck front and back, green IZOD Lacoste V-neck and a croc detail). Lacoste & Ralph Lauren Polos gains three (a brown piqué polo, front, back and collar detail). Branded T-Shirt Mix gains two (a grey marl Trussardi V-neck with a collegiate chest print). Birkenstock Sandals gains five (pink patent, brown Gizeh, silver Madrid, black and grey woven, black shearling-lined) — the lot stays out of stock, but its page is now ready for the moment it comes back.
- Every photograph carries alt text naming brand, colourway and detail.

---

## v2026.10.02-5 — 2026-10-02 — commit `ec6c407`

- Grading rewritten to the owner's own rules. **Grade A**: no stains, holes, tears or repairs, but fading no longer costs a grade — on a garment this old it is expected and it is what vintage looks like — and nor does one minor broken fastening (a clasp or a popper) on an otherwise sound piece, or a pluck in the weave. The false claim that a Grade A piece "goes straight from the box to the hanger" is gone; the page now says plainly that lots ship as graded, not laundered, and everything should be washed first.
- **Grade B**: small holes, small stains or marks, pilling, or a failed zip — and it is named as the workwear grade, Carhartt, Dickies and Lacoste especially. **Grade C** is defined only as the line we do not cross: a large hole, several holes, or a stain that would stop the piece being worn even as workwear.
- The five FAQ answers that repeated the old wording were rewritten with it, so the FAQPage structured data Google and the AI crawlers read now matches. llms.txt updated to the same rules.

---

## v2026.10.02-4 — 2026-10-02 — commit `1d1243e`

- "Festival Track Jackets" renamed **Track Jackets & Windbreakers**, at the owner's instruction: the lot is track tops and windbreakers, not a festival line. New address /products/track-jackets-windbreakers, with a permanent redirect from the old one so nothing already linked or indexed breaks. Summary, description and both image and video alt texts rewritten to drop the festival framing; the image folder moved to match.
- The lot is still tagged to the Festival collection, which is a browse route and a search term buyers use — the name no longer says festival, but the page can still be found that way. Say if you want it off that route entirely.
- Prices unchanged at £12.50 / £11.00 / £9.00.

---

## v2026.10.02-3 — 2026-10-02 — commit `b36db75`

- Eleven product photographs added from the owner's own stock (Batch 5), shot on white and resized to 1600px. Jackets & Windbreaker Mix gains five (a navy/green/white Nike windbreaker front and back, a two-tone blue Nike quarter-zip front and back, and a Nike zip and script detail). Lacoste Jumpers & Cardigans gains two (royal blue lambswool crew, front and back). Lacoste & Ralph Lauren Polos gains two (grey marl colour-block Lacoste polo and a croc detail). Ralph Lauren Polos gains two (navy and cream striped piqué polo and a neck-label detail).
- All eleven carry full alt text naming brand, colourway and detail, which is what Google Images and the AI crawlers read.

---

## v2026.10.02-2 — 2026-10-02 — commit `d5ab119`

- Jackets & Windbreaker Mix repriced: £10.75 per piece on a 10 (£107.50), £10.50 on a 25 (£262.50), £10.00 on a 50 (£500). Previously £12.50 / £11.00 / £10.00.
- Festival Track Jackets left untouched at £12.50 / £11.00 / £9.00 — say the word if that line should follow the same prices.

---

## v2026.10.02-1 — 2026-10-02 — commit `a446774`

- Email capture built but NOT launched. A one-time pop-up offers 10% off a first order in exchange for a trade-list sign-up: it waits 20 seconds, never shows on the basket, checkout or inbox, closes by button, backdrop or Escape, and does not return once dismissed or signed up on that browser. Sign-ups POST to a new /api/subscribe route which forwards to NEWSLETTER_FORWARD_WEBHOOK and refuses honestly when that is unset. Two analytics events added: newsletter_signup and newsletter_dismiss.
- Stripe checkout now accepts promotion codes (`allow_promotion_codes`), which is how the discount is redeemed.
- Controlled by `siteConfig.newsletter.popup`, which is **false**. Nothing is visible to customers until that is flipped, the ARCHIVE10 promotion code exists in Stripe, and NEWSLETTER_FORWARD_WEBHOOK is set.

---

## v2026.09.30-2 — 2026-09-30 — commit `6ed041f`

- Grade A now states that minor fading is acceptable: the grade means no damage (no stains, holes, tears, repairs or broken fastenings) rather than no visible wear, so a piece may look its age.
- The B/C boundary is stated as size: a small hole is Grade B, a large hole is Grade C and is never sold. Grade C is named only as the line lots are kept above, not as a grade on offer. Added an FAQ, "What grade is a garment with a hole in it?", which also feeds the page's FAQ structured data. Carried through to the A/B panel, the checking steps, llms.txt and the buyer guide.

---

## v2026.09.30-1 — 2026-09-30 — commit `7c617d0`

- Grading simplified to two grades. Grade C is removed from the site entirely: the guide, the FAQs, its structured data, llms.txt and the buyer guide. The "Never at this grade" exclusion list is removed from every grade.
- Grade B widened: it now openly allows a small stain and a small hole alongside pilling, fading and a faulty zip, and is described as "good condition with honest wear, priced to reflect it". The odour and damp line is gone from both the grade definition and the checking steps.
- Wording that depended on the old promise was updated to match: the A/B panel no longer says "no Grade C" or "ready to sell as it arrives", the grading step reads "graded A or B", and the page title and description now say Grade A and Grade B.

---

## v2026.09.29-1 — 2026-09-29 — commit `d03b2b0`

- "Rated 5 stars on Google" added to the home page hero, directly under the call-to-action buttons, and to the contact page details list. Shown as a bordered badge with gold stars and the score, sized down on phones so it reads on two lines.
- The dashed "More boxes coming / Ask for a custom box" tile has been removed from the home page reseller boxes row.
- The "Grade A/B" figure in the home page hero stats row is now a link to the grading guide, shown in brand green and underlined so it reads as clickable. Deliberately not added as schema.org aggregateRating: Google does not allow a business to mark up its own rating on its own site and doing so risks a manual penalty. A `googleReviewUrl` setting exists in the site config — filling it in turns the line into a link to the real listing.

---

## v2026.09.23-1 — 2026-09-23 — commit `5c1620f`

- Carhartt / Dickies T-Shirts gets a proper hero photograph (four workwear tees laid flat), replacing the logo card its listing had been fronting with since the video still was removed. Its card now shows the garments; the rail video stays as the second item with the Video badge.

---

## v2026.09.22-1 — 2026-09-22 — commit `9a091d2`

- Grading: a broken, stuck or missing zip is now stated as Grade B, not Grade C. Written into the Grade B definition and its allowed list, taken out of the Grade C definition, added to the fastenings check step, given its own FAQ entry ("What grade is a garment with a broken zip?") which also feeds the page's FAQ structured data, and stated in llms.txt for AI assistants. Grade B's wording no longer claims every piece needs no mending, since a faulty zip does.

---

## v2026.09.21-1 — 2026-09-21 — commit `12858b5`

- Mixed Premium Vintage Sweatshirts repriced: 10 at £10, 25 at £9.50, 50 at £9.25 per piece (was £9.50 / £9 / £8.50). The lot no longer matches the hoodies.

---

## v2026.09.19-3 — 2026-09-19 — commit `5374991`

- Lacoste / Ralph Lauren Polos description now states the split: roughly 85% men's and 15% women's across the lot.

---

## v2026.09.19-2 — 2026-09-19 — commit `3be01f8`

- Lacoste / Ralph Lauren Polos gains a rail video: 47.6 seconds of portrait footage sped 2x to 25.2 seconds, same glare correction as the Ralph Lauren clip, cropped square with the chest logos in frame, logo intro added.

---

## v2026.09.19-1 — 2026-09-19 — commit `2d8e8cb`

- Ralph Lauren Polos and the Ralph Lauren Polo Box both gain the same rail video (one shoot, both listings), replacing the borrowed clip removed on 18 September. The source ran 71.5 seconds at two different speeds; the slow section is sped up 3.8x to match the opening, bringing it to 21.6 seconds and cutting dead time from 52% to 21%. Highlights were clipping, which showed as glare on fabric and hands, so the HDR-to-standard conversion now uses highlight rolloff and desaturation: blown-out pixels are down from 12.4% on the worst frame to zero. Cropped square with the collar and pony in frame, logo intro added. No HDR rendition on this clip, so every browser sees the corrected grade.

---

## v2026.09.18-5 — 2026-09-18 — commit `c004e4c`

- Every remaining reference to MANCH LTD and Milltown Archive removed: the home page About paragraph no longer calls Archive Wholesale the trade arm of Milltown Archive, the Organization structured data no longer lists a parent organisation, and the repository README is retitled. The site presents Archive Wholesale (Archivio Group Ltd) on its own.

---

## v2026.09.18-4 — 2026-09-18 — commit `68bc42c`

- Legal name changed from MANCH LTD to Archivio Group Ltd everywhere: footer, contact page, structured data, llms.txt and the buyer guide. Company number 17064831 and "established 2025" unchanged.
- Business address added: Vo-10, Empire Business Park, 2 Empire Way, Burnley, Lancashire BB12 6HA. Shown in the footer and on the contact page, and given to Google as a postal address in the Organization structured data (replacing the previous "Lancashire" only).

---

## v2026.09.18-3 — 2026-09-18 — commit `917b61d`

- Selling order: Starter Box and Y2K Designer Female Mix moved up to second and third on All Products and every grid, ahead of the Ralph Lauren Polo Box. Home page Popular lots is unchanged (it excludes boxes); the Reseller Boxes page and home row now run Starter Box, Y2K Female, Ralph Lauren Polo Box, Designer Male Mix.

---

## v2026.09.18-2 — 2026-09-18 — commit `66d2f4f`

- Signals that the business is live, to separate it from the unrelated "Archive Wholesale Ltd" dissolved in 2019: footer and contact page state "established 2025" and "an active, trading business — not connected with any earlier company of a similar name"; footer shows "Site last updated <date>" and the home page eyebrow "Live stock, updated <date>", both stamped at each deploy; Organization structured data gains foundingDate, the Companies House number and the same disambiguation; llms.txt states the business status for AI assistants.

---

## v2026.09.18-1 — 2026-09-18 — commit `da1f303`

- Carhartt / Dickies T-Shirts: the video still used as its photo is removed. Its card now shows the logo poster with a Video badge, and the product page opens straight on the video.
- Every lot that has a video now carries a "Video" badge on its card in every grid.
- A lot with a video but no photograph counts as in stock (previously a photo was required).
- Ralph Lauren Polo Box: moved to second in the selling order (after the Ralph, Tommy, Lacoste Mix). It briefly carried the Ralph, Tommy, Lacoste rail clip; that was the wrong video and was removed the same day (commit noted below). No video until a Ralph Lauren-only clip is shot.

---

## v2026.09.17-1 — 2026-09-17 — commit `ceb2a8f`

**Home page**
- Removed the four square tiles from the top of the home page. The hero is now the headline, intro and buttons only.
- Reseller boxes moved directly under the hero, followed by Popular lots; "Two ways to buy" and the browse grid follow.
- Stats row: "Bulk to 1,000kg" replaced with "Grade A/B".

**Products and ordering**
- New reseller box: Ralph Lauren Polo Box — 10 Items, £9 a piece (£90), using the Ralph Lauren Polos photo.
- New site-wide selling order: lots with a rail video lead (Ralph, Tommy, Lacoste Mix; Lacoste Jumpers & Cardigans; Jackets & Windbreaker Mix; Mixed Premium Vintage Hoodies; Branded T-Shirt Mix; Festival Track Jackets; Carhartt / Dickies), then the rest. Designer Jackets, Birkenstock Sandals and Men's Luxury Winter Mix always sit last; sold-out lots sit below in-stock ones. Applies to Popular lots, the reseller boxes section and the default sort on every grid.

**Videos**
- Poster frames are now the logo card, so tapping a video goes straight from logo into footage with no still of a garment first.

**Bulk / by the kilo paused**
- Removed from the navigation, footer, home page, product page copy, sitemap and llms.txt. The /by-kilo page still loads for anyone holding the link but asks search engines not to index it.

**Contact details**
- Email changed everywhere from info@milltownarchive.co.uk to info@archivewholesale.com (footer, contact page, enquiry buttons, structured data, llms.txt, buyer guide).

**Buyer guide (PDF and web)**: email updated; bulk answer no longer points at the quote builder.

---

## Earlier deployments (by commit)

These predate version tags. Any commit can still be restored by hash.

### 2026-09-17
- `081cf58` Product videos: logo intro, HDR originals for browsers that play them, brighter fallback
- `da031f7` Lacoste Knitwear becomes Lacoste Jumpers & Cardigans; festival jackets get the rail clip
- `1f266dc` Lacoste Knitwear: use the revised hero flat lay
- `e10292e` Replace Mixed Men's Lacoste with Lacoste Knitwear
- `fac83f5` Add rail videos to five lots; Carhartt / Dickies tees go live
- `9b42225` Ralph Lauren Polos: 50-lot now £7.50 per piece

### 2026-09-16
- `41e7500` Birkenstock Sandals: out of stock
- `00a93e9` Jackets & Windbreaker Mix: 50-lot now £10 per piece

### 2026-09-13
- `f482114` Home intro: drop the £90 box / tonne line
- `12495d9` Footer: drop Milltown Archive, show trading name and company number
- `d1937d7` Home hero grid: All Products tile in place of Footwear
- `c9298ff` Drop "No mystery bales" from the home page intro
- `bea7d94` Put the products first on category pages; move brand links under the grid
- `11927c0` Show the company number on the contact page
- `4e0bfc2` Drop Milltown Archive from the contact page
- `90fb9da` Guard the surfaces ChatGPT and Google read on every build
- `03d3886` Luxury Outerwear Mix becomes Designer Jackets: £30 a piece, sold in tens
- `f0781dd` Bag icon and site search in the header; brands-you-may-see on lots; men's box renamed
- `38cde36` Take lot sizes out of product addresses, with permanent redirects
- `f1044cf` Drop the last 'small runs' mention on Designer Jackets
- `246802b` Remove stale lot-size wording now every counted lot is 10 / 25 / 50
- `84c442c` Reprice Carhartt / Dickies t-shirts and Mixed Men's Lacoste
- `530d4a9` Reprice Mixed Men's Lacoste, fix RTL lot wording, lead type pages with counted lots

### 2026-09-12
- `72990dc` Price Mixed Premium Vintage Sweatshirts to match the hoodies

### 2026-09-11
- `589eba8` Luxury Winter Mix: and shirts
- `22cbc44` Add video to the product reel; say what the pictures are; Luxury Winter Mix in tens
- `1bef266` Say that lots ship as graded, not laundered
- `d14f278` Sell every counted lot in ten, twenty-five and fifty

### 2026-09-10
- `8a85ca9` Stop the Starter Box describing the next step up as a twenty-piece box
- `fe9e7b2` Sell both Y2K boxes in ten or twenty, and complete the price range in schema
- `973a65a` Answer the inbox's three most-asked questions on the page itself
- `00804e0` Track every click that matters, and make page one a list you can reorder
- `ed5f34b` Add a Winter collection alongside Summer Mix
- `b30864d` Grade every listing A/B, add a grading guide, and open up to answer engines
- `2986f42` Say plainly that product photographs are representative
- `d79def4` Call it a basket, not a cart
- `2e02d35` Set the Men's Luxury Winter Mix to £16 and £14 per piece
- `58a4f5e` Reprice the Men's Luxury Winter Mix from £16 per piece

### 2026-09-02
- `92222b3` Repaint the logo's green to the site's forest
- `9c5098b` Use the owner's actual logo artwork instead of a type recreation

### 2026-08-27
- `39757ce` Keep the floating Enquire button off the cart and checkout

### 2026-08-25
- `46db0ac` Hold unphotographed lots out of stock, and name each tile's photo
- `f553725` Drop brands from the home page browse grid
- `47c0b21` Add the Starter Box, correct the hoodie hundred, wire up nine more photos
- `966be66` Turn VAT off, and reverse the Women's Y2K Summer Mix pricing
- `6856303` Correct the T-shirt hundred to £4, reprice hoodies and sweatshirts
- `12be264` Add prices and VAT, wire up WhatsApp enquiries, move to Lancashire
- `01be1f0` Mark Carhartt/Dickies and Bags out of stock; add Diesel, restore Hugo Boss
- `6f7b0d8` Add a luxury tier: Moncler, Burberry, Versace and their own lot
- `a6e4d6b` Add Guess and Nautica brand pages

### 2026-08-24
- `9f114db` Restructure the bulk offer into bags, bales and pallets
- `409a24b` Remove the Champion T-Shirts and Hugo Boss lots
- `e2d2d74` Remove the Nike T-Shirts lot and rename the Ralph / Tommy / Lacoste mix

### 2026-08-18
- `81d8e52` Add the first batch of product photography
- `1a00ec8` Add product photo folders and the shot-to-product mapping

### 2026-08-17
- `c37ba1c` Replace sample catalogue with the real product list
- `2eda568` Build Archive Wholesale storefront

### 2026-08-16
- `a98cf34` Fill remaining gaps, add item numbers, re-export inventory

