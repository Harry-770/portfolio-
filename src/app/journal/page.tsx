import type { Metadata } from "next"
import { Suspense } from "react"
import { PageHead, NextPage } from "@/components/page-head"
import { PostCard } from "@/components/post-card"
import { POSTS, summarize } from "@/content/posts"
import { JournalList, Featured } from "./journal-list"

export const metadata: Metadata = { title: "Journal", description: "Notes on building for the web: speed, motion, 3D and the odd rant." }

export default function JournalPage() {
  const summaries = POSTS.map(summarize)
  const [featured, ...rest] = summaries
  return (
    <>
      <PageHead image={{ src: "/images/journal-wireframes.jpg", alt: "Website wireframes sketched in a notebook, with a pen and a phone" }} title="Journal">
        <p>Long posts, short notes and the odd rant. Each cover is drawn in code from the post&apos;s title.</p>
      </PageHead>
      <section className="wrap section-space" aria-label="Posts">
        {/* the tag filter lives in the URL (?tag=…); until it's read, every post shows */}
        <Suspense fallback={<><div className="h-[72px]" /><Featured post={featured} /><div className="grid gap-5 md:grid-cols-3">{rest.map((p) => <PostCard key={p.slug} post={p} />)}</div></>}>
          <JournalList posts={summaries} />
        </Suspense>
      </section>
      <NextPage current="journal" />
    </>
  )
}
