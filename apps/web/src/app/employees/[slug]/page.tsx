import { notFound } from "next/navigation";

import { RichText } from "@/components/richtext";
import { SanityImage } from "@/components/sanity-image";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryEmployeePaths, queryEmployeeSlugPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchEmployeeSlugPageData(slug: string) {
  return await sanityFetch({
    query: queryEmployeeSlugPageData,
    params: { slug },
  });
}

async function fetchEmployeePaths() {
  const slugs = await client.fetch(queryEmployeePaths);
  return slugs.map((slug: string) => ({ slug }));
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
    position,
    department,
    employeeId,
    image,
    bio,
    isSevered,
    innieName,
    status,
    notableAchievements,
    wellnessVisits,
  } = data;

  return (
    <div className="container my-16 mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          <header className="mb-8">
            <div className="flex items-center gap-4">
              {image && (
                <div className="h-24 w-24 overflow-hidden rounded-full">
                  <SanityImage
                    asset={image}
                    alt={name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold">{name}</h1>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{position}</span>
                  <span>•</span>
                  <span>{department}</span>
                  <span>•</span>
                  <span>ID: {employeeId}</span>
                  {isSevered && (
                    <>
                      <span>•</span>
                      <span className="text-blue-500">🧠 Severed</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            {bio && <RichText richText={bio} />}
          </div>

          {notableAchievements && notableAchievements.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-bold">Notable Achievements</h2>
              <ul className="list-inside list-disc space-y-2">
                {notableAchievements.map((achievement: string, index: number) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </section>
          )}

          {isSevered && wellnessVisits && wellnessVisits.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-bold">Wellness Visits</h2>
              <div className="space-y-4">
                {wellnessVisits.map((visit: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {new Date(visit.date).toLocaleDateString()}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        {visit.reason}
                      </span>
                    </div>
                    {visit.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {visit.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-4 space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="mt-1 text-sm text-muted-foreground capitalize">
                {status}
              </p>
            </div>
            {isSevered && (
              <div>
                <h3 className="font-medium">Innie Name</h3>
                <p className="mt-1 text-sm text-muted-foreground">{innieName}</p>
              </div>
            )}
            <div>
              <h3 className="font-medium">Department</h3>
              <p className="mt-1 text-sm text-muted-foreground capitalize">
                {department}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Employee ID</h3>
              <p className="mt-1 text-sm text-muted-foreground">{employeeId}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
} 