# Archive Wholesale — Version Log

Every change that reached the live site, newest first. Each entry names the git commit (and, from 17 September 2026, a version tag) so any earlier state can be restored exactly — code, prices, copy, photos and videos all live in this repository.

## How to go back to an earlier version

1. Pick the version below you want. Every entry carries its commit hash (for example `ceb2a8f`); that hash is the reliable identifier, the version name is just the label.
2. Tell Claude: **"revert the site to v2026.09.17-1"**. It rebuilds that exact state, verifies it, pushes it to `main` and Vercel redeploys within a couple of minutes. Nothing is lost: the newer versions stay in the log and can be re-applied later.
3. Doing it by hand instead: in Vercel, open the project → Deployments → find the deployment for that commit → "Promote to Production" (instant, no rebuild). Or in git: `git checkout -b restore <tag>` then push that to `main`.

Before reverting for a traffic drop, check the Monday analytics review first: the weekly report separates ChatGPT, Google and direct traffic, so it usually shows whether a change on the site or a change at the source caused the fall.

---

## v2026.09.18-1 — 2026-09-18 — commit `da1f303`

- Carhartt / Dickies T-Shirts: the video still used as its photo is removed. Its card now shows the logo poster with a Video badge, and the product page opens straight on the video.
- Every lot that has a video now carries a "Video" badge on its card in every grid.
- A lot with a video but no photograph counts as in stock (previously a photo was required).
- Ralph Lauren Polo Box: moved to second in the selling order (after the Ralph, Tommy, Lacoste Mix) and given the Ralph, Tommy, Lacoste rail clip until a Ralph Lauren-only clip is shot.

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

