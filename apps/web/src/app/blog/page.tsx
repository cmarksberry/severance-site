import { notFound } from "next/navigation";

import { BlogCard, BlogHeader, FeaturedBlogCard } from "@/components/blog-card";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import { SanityImageProps } from "@/types";
import { getMetaData } from "@/lib/seo";

interface Blog {
  _id: string;
  _type: string;
  title: string | null;
  description: string | null;
  slug: string | null;
  image: SanityImageProps | null;
  publishedAt: string | null;
  authors: {
    _id: string;
    name: string | null;
    image: SanityImageProps | null;
  } | null;
}

interface BlogIndexData {
  _id: string;
  _type: string;
  title: string | null;
  description: string | null;
  slug: string;
  pageBuilder: any;
  blogs: Blog[];
}

function isBlogIndexData(data: unknown): data is BlogIndexData {
  if (!data || typeof data !== 'object') return false;
  const d = data as BlogIndexData;
  return (
    typeof d._id === 'string' &&
    typeof d._type === 'string' &&
    Array.isArray(d.blogs) &&
    d.blogs.every(isBlog)
  );
}

function isBlog(data: unknown): data is Blog {
  if (!data || typeof data !== 'object') return false;
  const b = data as Blog;
  return (
    typeof b._id === 'string' &&
    typeof b._type === 'string' &&
    (b.title === null || typeof b.title === 'string') &&
    (b.description === null || typeof b.description === 'string') &&
    (b.slug === null || typeof b.slug === 'string') &&
    (b.publishedAt === null || typeof b.publishedAt === 'string') &&
    (b.authors === null || isBlogAuthor(b.authors))
  );
}

function isBlogAuthor(data: unknown): data is Blog['authors'] {
  if (!data || typeof data !== 'object') return false;
  const a = data as NonNullable<Blog['authors']>;
  return (
    typeof a._id === 'string' &&
    (a.name === null || typeof a.name === 'string')
  );
}

/**
 * Fetches blog posts data from Sanity CMS
 */
async function fetchBlogPosts() {
  const result = await sanityFetch({
    query: queryBlogIndexPageData,
  });

  if (!result?.data || !isBlogIndexData(result.data)) {
    return notFound();
  }

  return result;
}

export async function generateMetadata() {
  const { data } = await fetchBlogPosts();

  return {
    title: data.title ?? "Blog",
    description: data.description ?? "Read our latest blog posts",
  };
}

export default async function BlogIndexPage() {
  const { data } = await fetchBlogPosts();

  const [featuredBlog, ...remainingBlogs] = data.blogs;

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogHeader title={data.title} description={data.description} />
      {data.pageBuilder && <PageBuilder pageBuilder={data.pageBuilder} id={data._id} type={data._type} />}
      {featuredBlog && (
        <div className="mb-12">
          <FeaturedBlogCard blog={featuredBlog} />
        </div>
      )}
      {remainingBlogs.length > 0 && (
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
          {remainingBlogs.map((blog: Blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
