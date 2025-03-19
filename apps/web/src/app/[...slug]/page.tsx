import { notFound } from "next/navigation";

import { PageBuilder } from "@/components/pagebuilder";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { querySlugPageData, querySlugPagePaths } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchSlugPageData(slug: string) {
  return await sanityFetch({
    query: querySlugPageData,
    params: { slug: `/${slug}` },
  });
}

async function fetchSlugPagePaths() {
  const slugs = await client.fetch(querySlugPagePaths);
  const paths: { slug: string[] }[] = [];
  for (const slug of slugs) {
    if (!slug) continue;
    const parts = slug.split("/").filter(Boolean);
    paths.push({ slug: parts });
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const { data: pageData } = await fetchSlugPageData(slugString);
  if (!pageData) {
    return getMetaData({});
  }
  return getMetaData(pageData);
}

export async function generateStaticParams() {
  return await fetchSlugPagePaths();
}

type LayoutType = "standard" | "wide" | "narrow";

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const { data: pageData } = await fetchSlugPageData(slugString);

  if (!pageData) {
    return notFound();
  }

  const { title, pageBuilder, _id, _type, contentMapping } = pageData ?? {};

  // Get the template and layout from content mapping
  const template = contentMapping?.template || "default";
  const layout = (contentMapping?.layout || "standard") as LayoutType;

  // Apply layout classes based on content mapping
  const layoutClasses = {
    standard: "max-w-4xl mx-auto",
    wide: "max-w-6xl mx-auto",
    narrow: "max-w-2xl mx-auto",
  }[layout];

  return !Array.isArray(pageBuilder) || pageBuilder?.length === 0 ? (
    <div className={`flex flex-col items-center justify-center min-h-[50vh] text-center p-4 ${layoutClasses}`}>
      <h1 className="text-2xl font-semibold mb-4 capitalize">{title}</h1>
      <p className="text-muted-foreground mb-6">
        This page has no content blocks yet.
      </p>
    </div>
  ) : (
    <div className={layoutClasses}>
      <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
    </div>
  );
}
