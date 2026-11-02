import Link from "next/link"
import { Cover } from "@/components/cover"
import type { PostSummary } from "@/content/posts"
import { formatDate } from "@/lib/format"

/** A journal post card: generated cover, date, title, excerpt and tags. */
export function PostCard({ post, excerpt = true }: { post: PostSummary; excerpt?: boolean }) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      prefetch
      data-cursor="Read"
      data-cover-hover
      data-reveal-item
      className="glow-hover group flex flex-col rounded-3xl border border-line bg-surface p-3 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-[3px] hover:border-line-2"
    >
      <Cover seed={post.slug} title={post.title} />
      <div className="px-2 pt-4 pb-2">
        <p className="text-[0.8125rem] text-dim">{post.type}, {formatDate(post.date)}, {post.minutes} min read</p>
        <h3 className="mt-1.5 mb-2 text-lg leading-snug font-semibold">{post.title}</h3>
        {excerpt && <p className="text-[0.9375rem] text-muted-foreground">{post.excerpt}</p>}
        <p className="mt-3 text-[0.8125rem] text-muted-foreground">{post.tags.join(", ")}</p>
      </div>
    </Link>
  )
}
