import Link from "next/link";

import { SanityImage } from "@/components/sanity-image";
import { sanityFetch } from "@/lib/sanity/live";
import { queryNewsPaths } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

interface NewsArticle {
  slug: string;
  title: string;
  description?: string;
  image?: any;
  publishedAt?: string;
}

async function fetchNewsArticles() {
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
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    width={800}
                    height={450}
                  />
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h2>
                {article.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                    {article.description}
                  </p>
                )}
                {article.publishedAt && (
                  <time
                    dateTime={article.publishedAt}
                    className="mt-4 block text-sm text-gray-500 dark:text-gray-400"
                  >
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </time>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
          <p className="text-muted-foreground mb-6">
            No news articles found.
          </p>
        </div>
      )}
    </div>
  );
} 