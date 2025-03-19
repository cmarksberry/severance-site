import { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/lib/sanity/live";
import { queryNewsSlugPageData } from "@/lib/sanity/query";

interface Props {
  params: Promise<{
    slug: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

interface NewsArticle {
  _id: string;
  _type: string;
  title: string;
  description: string;
  slug: {
    current: string;
  };
  department: string;
  priority: string;
  publishedAt: string;
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    _type: "image";
  };
  pageBuilder?: any[];
  content: any;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: article } = await sanityFetch({
    query: queryNewsSlugPageData,
    params: { slug },
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
      images: article.image ? [{ url: article.image.asset._ref }] : [],
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const { data: article } = await sanityFetch({
    query: queryNewsSlugPageData,
    params: { slug },
  });

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {article.department.toUpperCase()}
        </span>
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
          {article.priority}
        </span>
      </div>
      <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
      {article.description && (
        <p className="mb-8 text-xl text-gray-600">{article.description}</p>
      )}
      {article.publishedAt && (
        <time
          dateTime={article.publishedAt}
          className="text-sm text-gray-500 mb-8 block"
        >
          Published on {new Date(article.publishedAt).toLocaleDateString()}
        </time>
      )}
      {article.image && (
        <img
          src={article.image.asset._ref}
          alt={article.title}
          className="mb-8 w-full rounded-lg"
        />
      )}
      <div className="prose prose-lg max-w-none">
        {article.content}
      </div>
    </article>
  );
} 