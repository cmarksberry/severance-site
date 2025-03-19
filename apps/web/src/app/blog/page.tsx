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

/**
 * Fetches blog posts data from Sanity CMS
 */
async function fetchBlogPosts() {
  const data = await sanityFetch({
    query: queryBlogIndexPageData,
  }) as { data: BlogIndexData };

  if (!data?.data?.blogs?.length) {
    return notFound();
  }

  return data;
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
