import type { MetadataRoute } from "next"
import { PAGES, site } from "@/content/site"
import { POSTS } from "@/content/posts"

// generated at build time: every page and every journal post
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({ url: new URL(p.href, site.url).toString() })),
    ...POSTS.map((p) => ({ url: new URL(`/journal/${p.slug}`, site.url).toString(), lastModified: p.date })),
  ]
}
