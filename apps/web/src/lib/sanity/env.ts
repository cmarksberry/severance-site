export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN === "true";
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333"; 