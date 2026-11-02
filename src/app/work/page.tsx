import type { Metadata } from "next"
import { Suspense } from "react"
import { PageHead, NextPage } from "@/components/page-head"
import Image from "next/image"
import { site, poster } from "@/content/site"
import { Coverflow } from "@/components/coverflow"
import { Diagram } from "@/components/diagrams"
import { WorkGrid, WorkGridFallback } from "./work-grid"

export const metadata: Metadata = { title: "Work", description: site.workNote }

export default function WorkPage() {
  return (
    <>
      <PageHead image={{ src: "/images/work.jpg", alt: "A white building edge and beam against a deep blue sky" }} title="Things I've built"><p>{site.workNote}</p></PageHead>
      {/* every project in a 3D coverflow, then the full, filterable list below */}
      <section data-reveal className="wrap pt-[clamp(40px,5vw,72px)]" aria-label="Featured projects">
        <Coverflow
          label="Featured projects"
          slides={site.projects.map((p) => ({
            key: p.slug,
            title: p.name,
            sub: `${p.category} · ${p.year}`,
            media: p.diagram
              ? <Diagram name={p.diagram} className="block size-full" />
              : <Image src={poster(p.video!)} alt="" fill sizes="(max-width: 640px) 74vw, 460px" className="object-cover" />,
          }))}
        />
      </section>
      <section className="wrap section-space" aria-label="Projects">
        {/* the filter lives in the URL (?type=…); reading it happens in the browser, below a Suspense boundary */}
        <Suspense fallback={<WorkGridFallback />}>
          <WorkGrid />
        </Suspense>
      </section>
      <NextPage current="work" />
    </>
  )
}
