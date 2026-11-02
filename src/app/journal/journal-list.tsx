"use client"

import Link from "next/link"
import { FilterPills, useFilter } from "@/components/filter-pills"
import { PostCard } from "@/components/post-card"
import { Cover } from "@/components/cover"
import type { PostSummary } from "@/content/posts"
import { formatDate } from "@/lib/format"
import { Motion } from "@/components/motion"

export function JournalList({ posts }: { posts: PostSummary[] }) {
  const tag = useFilter("tag")
  const tags = [...new Set(posts.flatMap((p) => p.tags))]
  const [featured, ...rest] = posts
  const filtered = tag === "All" ? rest : posts.filter((p) => p.tags.includes(tag))
  return (
    <>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 text-sm">
        <FilterPills param="tag" options={tags} label="Filter posts" />
        <span className="text-muted-foreground" aria-live="polite">{tag === "All" ? `${posts.length} posts, newest first` : `${filtered.length} tagged ${tag}`}</span>
      </div>
      {tag === "All" && <Featured post={featured} />}
      <div className="grid gap-5 md:grid-cols-3">
        {filtered.map((p) => <PostCard key={p.slug} post={p} />)}
      </div>
      {/* inside the Suspense boundary: runs once this list (the last part of the page to hydrate) is live */}
      <Motion />
    </>
  )
}

export function Featured({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      data-cursor="Read"
      data-cover-hover
      data-reveal-item
      className="mb-5 grid items-center gap-8 rounded-3xl border border-line bg-surface p-3 transition-colors hover:border-line-2 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
    >
      <Cover seed={post.slug} title={post.title} className="aspect-[16/11]" />
      <div className="p-2 md:py-4 md:pr-4">
        <p className="text-[0.8125rem] text-dim">{post.type}, {formatDate(post.date)}, {post.minutes} min read</p>
        <h2 className="mt-2.5 mb-3.5 font-display font-bold tracking-[-0.025em] [word-spacing:0.06em] text-[clamp(2rem,1.4rem+2vw,3rem)] leading-[1.05]">{post.title}</h2>
        <p className="text-muted-foreground">{post.excerpt}</p>
        <p className="mt-3 text-[0.8125rem] text-muted-foreground">{post.tags.join(", ")}</p>
      </div>
    </Link>
  )
}
