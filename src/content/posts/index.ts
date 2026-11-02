// =====================================================================
//  JOURNAL — every post is an .mdx file in this folder that exports `meta`.
//  To add a post: create my-new-post.mdx (copy an existing one), then add it to POSTS below.
//  The slug (the URL /journal/<slug>) is the key here. Covers are generated from it.
// =====================================================================
import type { MDXContent } from "mdx/types"
import * as plotMap from "./a-plot-map-buyers-trust.mdx"
import * as datePickers from "./date-pickers.mdx"
import * as floorPlans from "./floor-plans-on-a-phone.mdx"
import * as howIUseAi from "./how-i-actually-use-ai.mdx"
import * as rebuilt from "./rebuilt-my-portfolio-four-times.mdx"
import * as shaders from "./shaders-over-chai.mdx"
import * as phoneTest from "./the-12000-rupee-phone-test.mdx"
import * as reducedMotion from "./til-reduced-motion.mdx"

// words and headings are counted from the post text (update them when you edit a post)
export type PostMeta = { title: string; excerpt: string; date: string; type: string; tags: string[]; words: number; headings: { id: string; label: string }[] }
export type Post = PostMeta & { slug: string; Body: MDXContent; minutes: number }
// what cards and lists need (post bodies are components and can't be passed to client components)
export type PostSummary = Omit<Post, "Body">
export const summarize = ({ Body: _body, ...rest }: Post): PostSummary => rest

const SOURCES: Record<string, { default: MDXContent; meta: PostMeta }> = {
  "a-plot-map-buyers-trust": plotMap,
  "floor-plans-on-a-phone": floorPlans,
  "rebuilt-my-portfolio-four-times": rebuilt,
  "til-reduced-motion": reducedMotion,
  "the-12000-rupee-phone-test": phoneTest,
  "how-i-actually-use-ai": howIUseAi,
  "date-pickers": datePickers,
  "shaders-over-chai": shaders,
}

// reading time: about 200 words a minute (update "words" in a post's meta when you edit it)
export const POSTS: Post[] = Object.entries(SOURCES)
  .map(([slug, m]) => ({ slug, ...m.meta, Body: m.default, minutes: Math.max(1, Math.ceil(m.meta.words / 200)) }))
  .sort((a, b) => b.date.localeCompare(a.date))

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug)

export function relatedPosts(post: Post, n = 3) {
  return POSTS.filter((q) => q.slug !== post.slug)
    .map((q) => ({ q, score: q.tags.filter((t) => post.tags.includes(t)).length * 10 - Math.abs(+new Date(q.date) - +new Date(post.date)) / 864e8 / 100 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.q)
}
