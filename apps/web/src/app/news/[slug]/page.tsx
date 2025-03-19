import { notFound } from "next/navigation";

import { PageBuilder } from "@/components/pagebuilder";
import { SanityImage } from "@/components/sanity-image";
import { sanityFetch } from "@/lib/sanity/live";
import { queryNewsSlugPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchNewsArticle(slug: string) {
  return await sanityFetch({
    query: queryNewsSlugPageData,
    params: { slug: `/news/${slug}` },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { data: newsArticle } = await fetchNewsArticle(params.slug);

  if (!newsArticle) {
    return {};
  }

  return getMetaData({
    title: newsArticle.seoTitle || newsArticle.title,
    description: newsArticle.seoDescription || newsArticle.description,
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: newsArticle } = await fetchNewsArticle(params.slug);

  if (!newsArticle) {
    return notFound();
  }

  const { title, description, image, department, priority, publishedAt, pageBuilder, _id, _type } = newsArticle;

  return (
    <article className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="relative w-full">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-4">
            {/* Department and Priority Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {department?.toUpperCase()}
              </span>
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
                {priority}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                {description}
              </p>
            )}

            {/* Publication Date */}
            {publishedAt && (
              <time
                dateTime={publishedAt}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Published on {new Date(publishedAt).toLocaleDateString()}
              </time>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {image && (
          <div className="mt-8">
            <SanityImage
              asset={image}
              className="w-full h-auto rounded-lg"
              width={1600}
              height={900}
            />
          </div>
        )}
      </section>

      {/* Page Builder Content */}
      {pageBuilder && pageBuilder.length > 0 ? (
        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
          <p className="text-muted-foreground mb-6">
            This news article has no content blocks yet.
          </p>
        </div>
      )}
    </article>
  );
} 