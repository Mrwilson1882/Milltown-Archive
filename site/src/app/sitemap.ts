import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { bundles } from "@/data/bundles";
import { allCategories, categoryPath } from "@/data/taxonomy";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${siteConfig.url}/bundles`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${siteConfig.url}/brands`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${siteConfig.url}/types`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${siteConfig.url}/collections`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${siteConfig.url}/contact`, priority: 0.6, changeFrequency: "yearly" },
  ];

  const categoryPages: MetadataRoute.Sitemap = allCategories().map(({ kind, category }) => ({
    url: `${siteConfig.url}${categoryPath(kind, category.slug)}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  const bundlePages: MetadataRoute.Sitemap = bundles.map((bundle) => ({
    url: `${siteConfig.url}/bundles/${bundle.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  return [...staticPages, ...categoryPages, ...bundlePages].map((entry) => ({
    ...entry,
    lastModified: now,
  }));
}
