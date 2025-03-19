import Link from "next/link";

import { SanityImage } from "@/components/sanity-image";
import { sanityFetch } from "@/lib/sanity/live";
import { queryNewsPaths } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";
import type { SanityImageProps } from "@/types";

interface NewsArticle {
  slug: string;
  title: string;
  description?: string;
  publishedAt?: string;
  image?: SanityImageProps;
}

async function fetchNewsArticles(): Promise<{ data: NewsArticle[] }> {
  return await sanityFetch({
    query: queryNewsPaths,
  });
}

export async function generateMetadata() {
  return getMetaData({
    title: "News",
    description: "Latest news and updates from Lumon",
  });
}

export default async function NewsPage() {
  const { data: newsArticles } = await fetchNewsArticles();

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-8">
        News
      </h1>

      {newsArticles && newsArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article: NewsArticle) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="group block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div className="aspect-video relative overflow-hidden">
                {article.image && (
                  <SanityImage
                    asset={article.image}
                    loading="lazy"
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                {article.description && (
                  <p className="text-muted-foreground line-clamp-2">
                    {article.description}
                  </p>
                )}
                {article.publishedAt && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No news articles found.</p>
        </div>
      )}
    </div>
  );
} 