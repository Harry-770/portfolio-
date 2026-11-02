import type { Metadata } from "next"
import { PageHead, NextPage } from "@/components/page-head"
import { site } from "@/content/site"
import { Motion } from "@/components/motion"
import { Platforms } from "@/components/platforms"

export const metadata: Metadata = { title: "Skills", description: "The tools I use every day, rated honestly." }

export default function SkillsPage() {
  return (
    <>
      <PageHead image={{ src: "/images/skills.jpg", alt: "Looking up at the symmetrical steel frame of a glass roof" }} title="What I use"><p>The numbers are a rough self-rating out of 100, not a test score.</p></PageHead>
      <section className="wrap section-space grid gap-5 md:grid-cols-2" aria-label="Skills">
        {site.skills.map((g) => (
          <div key={g.title} data-reveal-item className="panel glow-hover p-7">
            <h2 className="mb-3 text-[clamp(1.125rem,1rem+0.4vw,1.375rem)]">{g.title}</h2>
            <ul>
              {g.items.map(([name, level]) => (
                <li key={name} className="flex justify-between gap-4 border-t border-line py-3 text-[0.9375rem] tabular-nums">
                  <span>{name}</span>
                  <span className="text-muted-foreground"><span className="sr-only">Self-rating: </span>{level}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <Platforms />
      <NextPage current="skills" />
      <Motion />
    </>
  )
}
