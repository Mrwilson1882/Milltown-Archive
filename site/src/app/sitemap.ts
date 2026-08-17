import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { products } from "@/data/catalogue";
import { allCategories, categoryPath } from "@/data/taxonomy";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${siteConfig.url}/products`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${siteConfig.url}/by-kilo`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${siteConfig.url}/types`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${siteConfig.url}/brands`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${siteConfig.url}/collections`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${siteConfig.url}/contact`, priority: 0.6, changeFrequency: "yearly" },
  ];

  const categoryPages: MetadataRoute.Sitemap = allCategories().map(({ kind, category }) => ({
    url: `${siteConfig.url}${categoryPath(kind, category.slug)}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/products/${product.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  return [...staticPages, ...categoryPages, ...productPages].map((entry) => ({
    ...entry,
    lastModified: now,
  }));
}
