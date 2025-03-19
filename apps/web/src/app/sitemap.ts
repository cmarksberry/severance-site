// @ts-nocheck
import { MetadataRoute } from "next";
import { sanityFetch } from "@/lib/sanity/live";
import { querySitemapData } from "@/lib/sanity/query";
import type { QuerySitemapDataResult } from "@/lib/sanity/sanity.types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://severance-site.vercel.app";

  const { data: slugPages } = await sanityFetch<QuerySitemapDataResult>({
    query: querySitemapData,
  });

  const pages = Array.isArray(slugPages?.slugPages) ? slugPages.slugPages : [];
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  for (const page of pages) {
    if (!page.slug) continue;
    sitemapEntries.push({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
  }

  return sitemapEntries;
}
