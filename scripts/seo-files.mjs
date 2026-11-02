// Writes public/robots.txt and public/sitemap.xml before each build (run by `npm run build`).
// They used to be app/robots.ts and app/sitemap.ts, but with `output: "export"` and Cache Components
// together Next can't generate them from code, so they're made here as plain files instead.
// Reads the same sources: the page list and site url in src/content/site.ts, and the published
// posts registered in src/content/posts/index.ts (with each post's date from its .mdx file).
import { readFileSync, writeFileSync } from "node:fs"

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8")
const site = read("src/content/site.ts")
const url = site.match(/^\s*url:\s*"([^"]+)"/m)?.[1]
if (!url) throw new Error("seo-files: no url found in src/content/site.ts")

// trailing slashes, to match `trailingSlash: true` in next.config.ts
const at = (path) => new URL(path.endsWith("/") ? path : `${path}/`, url).toString()
const pages = [...site.matchAll(/\{\s*href:\s*"([^"]+)",\s*key:/g)].map((m) => m[1])
const index = read("src/content/posts/index.ts")
const start = index.indexOf("= {", index.indexOf("const SOURCES"))   // past the type annotation
const sources = index.slice(start, index.indexOf("\n}", start))
const posts = [...sources.matchAll(/"([a-z0-9-]+)":/g)].map(([, slug]) => ({
  slug,
  date: read(`src/content/posts/${slug}.mdx`).match(/"date":\s*"([^"]+)"/)?.[1],
}))

const urls = [
  ...pages.map((p) => `  <url><loc>${at(p)}</loc></url>`),
  ...posts.map((p) => `  <url><loc>${at(`/journal/${p.slug}`)}</loc>${p.date ? `<lastmod>${p.date}</lastmod>` : ""}</url>`),
]
writeFileSync(new URL("../public/sitemap.xml", import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`)
writeFileSync(new URL("../public/robots.txt", import.meta.url), `User-Agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", url)}\n`)
console.log(`seo-files: robots.txt and sitemap.xml (${pages.length} pages, ${posts.length} posts) for ${url}`)
