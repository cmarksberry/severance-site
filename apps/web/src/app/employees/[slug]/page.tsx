import { notFound } from "next/navigation";

import { RichText } from "@/components/richtext";
import { SanityImage } from "@/components/sanity-image";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  queryEmployeePaths,
  queryEmployeeSlugPageData,
} from "@/lib/sanity/query";
import type { RichText as RichTextType } from "@/lib/sanity/sanity.types";
import { getMetaData } from "@/lib/seo";
import type { SanityImageProps } from "@/types";

interface Employee {
  _id: string;
  _type: "author";
  name: string;
  department?: string;
  image?: SanityImageProps;
  bio?: string;
  status?: string;
  innieName?: string;
  notableAchievements?: string[];
  wellnessVisits?: string[];
}

async function fetchEmployeeSlugPageData(
  slug: string,
): Promise<{ data: Employee }> {
  return await sanityFetch({
    query: queryEmployeeSlugPageData,
    params: { slug },
  });
}

async function fetchEmployeePaths() {
  const slugs = await client.fetch<string[]>(queryEmployeePaths);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchEmployeeSlugPageData(slug);
  if (!data) return getMetaData({});
  return getMetaData(data);
}

export async function generateStaticParams() {
  return await fetchEmployeePaths();
}

export default async function EmployeeSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchEmployeeSlugPageData(slug);
  if (!data) return notFound();

  const {
    name,
    department,
    image,
    bio,
    status,
    innieName,
    notableAchievements,
    wellnessVisits,
  } = data;

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <main className="lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              {image?.asset && (
                <div className="w-full md:w-1/3">
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    <SanityImage
                      asset={image}
                      loading="eager"
                      priority
                      quality={100}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{name}</h1>
                {department && (
                  <p className="text-xl text-muted-foreground mb-6">
                    {department}
                  </p>
                )}
              </div>
            </div>

            {bio && (
              <section className="prose dark:prose-invert max-w-none mb-12">
                <RichText richText={bio} />
              </section>
            )}

            {notableAchievements && notableAchievements.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-semibold mb-4">
                  Notable Achievements
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {notableAchievements.map((achievement: string) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </section>
            )}

            {wellnessVisits && wellnessVisits.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-semibold mb-4">Wellness Visits</h2>
                <ul className="list-disc list-inside space-y-2">
                  {wellnessVisits.map((visit: string) => (
                    <li key={visit}>{visit}</li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          <aside className="space-y-6">
            {status && (
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-semibold mb-2">Status</h3>
                <p>{status}</p>
              </div>
            )}

            {innieName && (
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-semibold mb-2">Innie Name</h3>
                <p>{innieName}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
} 