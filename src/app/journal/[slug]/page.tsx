import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Cover } from "@/components/cover"
import { PostCard } from "@/components/post-card"
import { POSTS, getPost, relatedPosts, summarize } from "@/content/posts"
import { formatDate } from "@/lib/format"
import { fullName } from "@/content/site"
import { Toc } from "./toc"
import { Motion } from "@/components/motion"

// every post is prerendered, and only those: the static export needs the full list at build time
export const dynamicParams = false
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt, openGraph: { type: "article", publishedTime: post.date, tags: post.tags } }
}

// The page itself stays static (an instant App Shell); reading the URL's slug happens in a child
// inside <Suspense>, as the instant-navigation guide recommends ("push down").
export default function PostPage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <Suspense fallback={<ArticleShell />}>
      <Article params={params} />
    </Suspense>
  )
}

function ArticleShell() {
  return (
    <div className="wrap min-h-svh pt-[clamp(140px,18vh,200px)]">
      <Link href="/journal" className="text-sm text-muted-foreground hover:text-foreground">← All posts</Link>
    </div>
  )
}

async function Article({ params }: { params: PageProps<"/journal/[slug]">["params"] }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const i = POSTS.indexOf(post), older = POSTS[i + 1], newer = POSTS[i - 1]
  const { Body } = post

  return (
    <article>
      <header className="wrap pt-[clamp(140px,18vh,200px)] pb-12">
        <Link href="/journal" className="text-sm text-muted-foreground hover:text-foreground">← All posts</Link>
        <h1 data-split className="mt-5 mb-4 max-w-[18ch] font-display font-extrabold tracking-[-0.03em] [word-spacing:0.08em] text-[clamp(2.5rem,1.5rem+3.6vw,4.5rem)] leading-[1.02]">{post.title}</h1>
        <p className="text-[0.8125rem] text-dim">
          {post.type}, <time dateTime={post.date}>{formatDate(post.date)}</time>, {post.minutes} min read, by {fullName}
        </p>
        <p className="mt-3 text-[0.8125rem] text-muted-foreground">{post.tags.join(", ")}</p>
      </header>

      <div className="wrap">
        <Cover seed={post.slug} title={post.title} animate className="aspect-[21/9] rounded-3xl" />
      </div>

      <div className="wrap grid gap-12 pt-16 md:grid-cols-[220px_minmax(0,1fr)]">
        <Toc headings={post.headings} />
        <div id="article" className="prose-post"><Body /></div>
      </div>

      <nav aria-label="More posts" className="wrap">
        <div className="mt-[72px] grid grid-cols-2 gap-6 border-t border-line pt-8">
          {older ? (
            <Link href={`/journal/${older.slug}`} className="group grid gap-1">
              <small className="text-[0.8125rem] text-dim">← Older</small>
              <span className="text-lg font-medium group-hover:text-electric-soft">{older.title}</span>
            </Link>
          ) : <span />}
          {newer ? (
            <Link href={`/journal/${newer.slug}`} className="group grid gap-1 text-right">
              <small className="text-[0.8125rem] text-dim">Newer →</small>
              <span className="text-lg font-medium group-hover:text-electric-soft">{newer.title}</span>
            </Link>
          ) : <span />}
        </div>
      </nav>

      <section className="wrap section-space pb-6" aria-labelledby="related">
        <h2 id="related" data-split className="display-title mb-8">Keep reading</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {relatedPosts(post).map((p) => <PostCard key={p.slug} post={summarize(p)} />)}
        </div>
      </section>
      <Motion />
    </article>
  )
}
