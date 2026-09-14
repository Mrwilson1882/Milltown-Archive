/**
 * The shape the whole site renders from.
 *
 * One Listing is one physical garment. Everything here is plain serialisable
 * data so it can cross the server/client boundary into the filter UI without
 * a second fetch.
 */

export type ConditionCode =
  | "NewWithTags"
  | "NewWithoutTags"
  | "VeryGood"
  | "Good"
  | "Fair"
  | "Poor";

export type Listing = {
  /** Address of the product page, unique across the catalogue. */
  slug: string;
  /** Crosslist Id where one is given, otherwise derived from SKU or title. */
  id: string;
  title: string;
  /** Description split into paragraphs for rendering. */
  description: string[];
  /** Price in pounds. null means no price was given — never inferred. */
  priceGBP: number | null;
  /** Compare-at price, shown struck through when it is above the sale price. */
  originalPriceGBP: number | null;
  brand: string | null;
  brandSlug: string | null;
  /** Human size, resolved from the Crosslist size id where a lookup exists. */
  size: string | null;
  condition: ConditionCode | null;
  /** Readable condition, e.g. "Very good". */
  conditionLabel: string | null;
  colour: string | null;
  secondaryColour: string | null;
  /** Web paths under /images/products, in the order given. */
  images: string[];
  quantity: number;
  inStock: boolean;
  tags: string[];
  sku: string | null;
  /** Readable era from "When made", e.g. "1990s". */
  era: string | null;
  /** Raw "When made" code, kept so the Y2K edit can match on it. */
  eraCode: string | null;
  /**
   * Faults, stated plainly and never buried in the description. Blank in the
   * source means "not stated", which is not the same as "none" — see
   * conventions.md in the repository root.
   */
  defects: string | null;
  /** Date the piece was added, where the source states one. */
  dateAdded: string | null;
  acceptOffers: boolean;
  shipping: {
    domesticGBP: number | null;
    worldwideGBP: number | null;
    freeDomestic: boolean;
    freeWorldwide: boolean;
  };
  /** Derived category memberships. */
  typeSlugs: string[];
  departmentSlugs: string[];
  editSlugs: string[];
  /** Position in the source CSV, used as the "newest first" ordering. */
  sourceRow: number;
};
