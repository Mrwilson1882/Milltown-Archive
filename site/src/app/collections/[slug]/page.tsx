import type { Metadata } from "next";
import { CategoryDetail } from "@/components/CategoryPages";
import { collections, findCategory } from "@/data/taxonomy";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory("collection", slug);
  if (!category) return { title: "Collection not found" };
  return {
    title: `${category.name} Collection — Vintage Wholesale`,
    description: category.seoCopy.slice(0, 300),
    alternates: { canonical: `/collections/${category.slug}` },
  };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  return <CategoryDetail kind="collection" slug={slug} />;
}
