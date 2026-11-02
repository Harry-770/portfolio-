import type { Metadata } from "next"
import Image from "next/image"
import { PageHead, NextPage } from "@/components/page-head"
import { site, fullName } from "@/content/site"
import { Motion } from "@/components/motion"
import { Team } from "@/components/team"
import { Stats } from "@/components/stats"
import { CurvedMarquee } from "@/components/curved-marquee"
import { STATS, DISCIPLINES } from "@/content/stats"

export const metadata: Metadata = { title: "About", description: site.about.paragraphs[0] }

function TwoCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="wrap section-space grid items-start gap-x-12 gap-y-6 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <h2 data-split className="display-title text-[clamp(2rem,1.4rem+2vw,2.75rem)]">{title}</h2>
      <div>{children}</div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <PageHead image={{ src: "/images/about.jpg", alt: "Clean white and peach building blocks against a pale blue sky" }} title={<>{site.about.headline[0]}<br />{site.about.headline[1]}</>}>
        {site.photo && <Image src={site.photo} alt={fullName} width={720} height={900} className="aspect-[4/5] w-full max-w-[360px] rounded-3xl object-cover" priority />}
        {site.about.paragraphs.map((p) => <p key={p}>{p}</p>)}
      </PageHead>

      <TwoCol title="Right now">
        <dl className="grid grid-cols-[minmax(110px,180px)_minmax(0,1fr)] [&>*]:border-t [&>*]:border-line [&>*]:py-4">
          {site.now.items.map(([k, v]) => (
            <div key={k} className="contents" data-reveal-item><dt className="text-[0.9375rem] text-muted-foreground">{k}</dt><dd>{v}</dd></div>
          ))}
          <dt className="text-[0.9375rem] text-muted-foreground">Updated</dt><dd>{site.now.updated}</dd>
        </dl>
      </TwoCol>

      <TwoCol title="Ways to work together">
        <div className="grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          {site.services.map((s) => (
            <div key={s.title} data-reveal-item className="panel glow-hover p-7">
              <h3 className="mb-2 text-[clamp(1.125rem,1rem+0.4vw,1.375rem)]">{s.title}</h3>
              <p className="text-[0.9375rem] text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </TwoCol>

      <section className="wrap section-space" aria-label="In numbers">
        <Stats items={STATS} />
      </section>

      <Team id="aboutTeamTitle" />

      <TwoCol title="Experience">
        <ol>
          {site.experience.map((j) => (
            <li key={j.role} data-reveal-item className="grid items-baseline gap-1 border-t border-line py-5 sm:grid-cols-[2fr_1.4fr_1fr] sm:gap-4">
              <h3 className="text-[clamp(1.125rem,1rem+0.4vw,1.375rem)]">{j.role}</h3>
              <p className="text-ink-2">{j.where}</p>
              <p className="text-muted-foreground">{j.when}</p>
            </li>
          ))}
        </ol>
      </TwoCol>

      <div className="section-space">
        <CurvedMarquee words={DISCIPLINES} label="What I do" />
      </div>

      <NextPage current="about" />
      <Motion />
    </>
  )
}
