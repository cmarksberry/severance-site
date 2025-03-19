export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION!
export const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN === 'true'
export const perspective = process.env.NEXT_PUBLIC_SANITY_PERSPECTIVE || 'published'
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333"; 