import type { Metadata } from "next";
import { CategoryDetail } from "@/components/CategoryPages";
import { brands, findCategory } from "@/data/taxonomy";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory("brand", slug);
  if (!category) return { title: "Brand not found" };
  return {
    title: `${category.name} Vintage Wholesale`,
    description: category.seoCopy.slice(0, 300),
    alternates: { canonical: `/brands/${category.slug}` },
  };
}

export default async function BrandPage({ params }: Params) {
  const { slug } = await params;
  return <CategoryDetail kind="brand" slug={slug} />;
}
