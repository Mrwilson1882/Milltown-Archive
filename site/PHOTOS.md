# Product photography

## Batch one — in and live

Nine photographs, shot square on white at 1600 × 1600. They were supplied as
PNG and converted to JPG on the way in (11.7MB down to 1.4MB across the nine,
with no visible difference), and they now sit at:

| Photograph | Product page |
|---|---|
| Lacoste RL Polo | Lacoste / Ralph Lauren Polos |
| Lacoste Jumper & Cardigan Mix | Lacoste Jumpers & Cardigans |
| Hoodies | Mixed Premium Vintage Hoodies |
| Birkenstock | Birkenstock Sandals |
| Womens Y2K mix | Y2K Designer Female Mix — Box of 20 |
| T Shirts | Branded T-Shirt Mix *(new product)* |
| Jackets and Windbreaker Mix | Jackets & Windbreaker Mix *(new product)* |
| Mens Luxury Winter Mix | Men's Luxury Winter Mix *(new product)* |
| Womens Y2K Summer Mix | Women's Y2K Summer Mix *(new product)* |

Four of the nine showed lots that were not on the original product list, so
those products were created to hold them.

The photographs also showed brands with no page on the site. Added: **adidas,
Reebok, Fila, Harley-Davidson, Stone Island, Missoni, Valentino**. Each now has
its own page, footer link and sitemap entry. Remove any you do not stock
regularly — they are one entry each in `src/data/taxonomy.ts`.

## Adding more

Save as **JPG or PNG, square, 1600 × 1600 px**, then drop the file at
`public/images/products/<product-slug>/01.jpg`.

The first photo becomes the card image everywhere. Photos two to five appear as
thumbnails under the main image on the product page — number them `02.jpg`,
`03.jpg` and so on in the same folder. A sixth will not display.

Then add it to the product in `src/data/catalogue.ts`:

```ts
photos: [
  { src: "/images/products/nike-t-shirts/01.jpg", alt: "Twenty vintage Nike spellout tees laid out on white" },
],
```

Write real alt text — a plain sentence describing what is in the shot. It is
read aloud by screen readers and indexed by Google.

## Products still without photography

nike-t-shirts · champion-t-shirts · carhartt-dickies-t-shirts ·
ralph-tommy-lacoste-summer-mix-25 · y2k-designer-male-mix-box-20 ·
mixed-premium-vintage-hoodies-sweatshirts · mixed-premium-vintage-sweatshirts ·
ralph-lauren-polos · festival-track-jackets · designer-jackets · bags ·
mixed-mens-hugo-boss-mix-20 · mixed-mens-lacoste-25

These show generated placeholder artwork until a photograph replaces it.
