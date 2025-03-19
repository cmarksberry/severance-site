import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SanityImage } from "@/components/sanity-image";
import { sanityFetch } from "@/lib/sanity/live";
import { queryNewsSlugPageData } from "@/lib/sanity/query";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: article } = await sanityFetch({
    query: queryNewsSlugPageData,
    params: { slug: params.slug },
  });

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { data: article } = await sanityFetch({
    query: queryNewsSlugPageData,
    params: { slug: params.slug },
  });

  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {article.department.toUpperCase()}
        </span>
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
          {article.priority}
        </span>
      </div>
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <p className="text-xl text-gray-600 mb-8">{article.description}</p>
      {article.publishedAt && (
        <time
          dateTime={article.publishedAt}
          className="text-sm text-gray-500 mb-8 block"
        >
          Published on {new Date(article.publishedAt).toLocaleDateString()}
        </time>
      )}
      {article.image && (
        <div className="relative aspect-video mb-8">
          <SanityImage
            asset={article.image}
            alt={article.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      <div className="prose prose-lg max-w-none">{article.content}</div>
    </article>
  );
} 