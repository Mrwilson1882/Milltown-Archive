import type { MetadataRoute } from "next";
import { allBrands, catalogue } from "@/data/catalogue";
import { departments, edits, productTypes } from "@/data/taxonomy";
import { siteConfig } from "@/config/site";

/** Everything worth indexing. The bag, checkout and search are not. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticPaths = [
    "/",
    "/shop",
    "/women",
    "/men",
    "/brands",
    "/about",
    "/contact",
    "/condition-guide",
    "/sizing",
    "/delivery-returns",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...productTypes.map((section) => ({
      url: `${base}/shop/${section.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...edits.map((section) => ({
      url: `${base}/edit/${section.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...departments.map((section) => ({
      url: `${base}/${section.slug === "womens" ? "women" : "men"}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...allBrands().map((brand) => ({
      url: `${base}/brands/${brand.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    ...catalogue().listings.map((listing) => ({
      url: `${base}/product/${listing.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
