import type { Metadata } from "next";
import { CategoryDetail } from "@/components/CategoryPages";
import { findCategory, productTypes } from "@/data/taxonomy";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productTypes.map((type) => ({ slug: type.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory("type", slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} — Vintage Wholesale`,
    description: category.seoCopy.slice(0, 300),
    alternates: { canonical: `/types/${category.slug}` },
  };
}

export default async function TypePage({ params }: Params) {
  const { slug } = await params;
  return <CategoryDetail kind="type" slug={slug} />;
}
