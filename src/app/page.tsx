import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/project-card"
import { PostCard } from "@/components/post-card"
import { SectionHead } from "@/components/section-head"
import { LiveStatus } from "@/components/live-status"
import { CopyEmailButton } from "@/components/copy-email-button"
import { site } from "@/content/site"
import { POSTS, summarize } from "@/content/posts"
import { cn } from "@/lib/utils"
import { Motion } from "@/components/motion"
import { HeroLogos, LogoStrip } from "@/components/tech-logos"
import { Toolkit } from "@/components/toolkit"
import { Team } from "@/components/team"
import { WorkedWith } from "@/components/worked-with"
import { Platforms } from "@/components/platforms"
import { RainbowWave } from "@/components/rainbow-wave"
import { Stats } from "@/components/stats"
import { CurvedMarquee } from "@/components/curved-marquee"
import { ReactiveGrid } from "@/components/reactive-grid"
import { STATS, DISCIPLINES } from "@/content/stats"

const pad = (n: number) => String(n).padStart(2, "0")
const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"]
const TILT = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-5"]

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="relative flex min-h-svh flex-col items-center justify-center px-5 pt-[120px] pb-20 text-center after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[30%] after:bg-gradient-to-b after:from-transparent after:to-background">
        <RainbowWave />
        <HeroLogos />
        <div className="relative z-[1] mb-7 flex items-center gap-3" data-hero="top">
          <span className="grid size-[52px] place-items-center overflow-hidden rounded-full border border-line-2 bg-surface-3 text-sm font-semibold tracking-wide" aria-hidden="true">
            {site.photo ? <Image src={site.photo} alt="" width={104} height={104} className="size-full object-cover" priority /> : site.initials}
          </span>
          <span className="inline-flex h-[34px] items-center gap-2 rounded-full border border-line-2 bg-surface/80 px-3.5 text-[0.8125rem] font-medium text-ink-2">
            <i className={cn("size-[7px] rounded-full", site.available ? "bg-ok shadow-[0_0_0_4px_color-mix(in_srgb,var(--ok)_22%,transparent)]" : "bg-dim")} />
            {site.available ? `Available from ${site.availableFrom}` : "Fully booked for now"}
          </span>
        </div>
        <h1 className="relative z-[1] flex flex-col items-center gap-[0.04em] text-hero leading-none">
          {site.hero.big.map((w) => (
            <span key={w} data-hero="big" className="block font-(family-name:--font-archivo) text-hero leading-[0.95] font-black tracking-[-0.02em] uppercase">{w}</span>
          ))}
          <em data-hero="serif" className="mt-[0.15em] block font-serif text-[clamp(2.25rem,1.2rem+3.6vw,4.5rem)] leading-none font-normal tracking-[-0.01em] text-electric-soft">{site.hero.serif}</em>
        </h1>
        <p data-hero="lead" className="relative z-[1] mx-auto mt-8 max-w-[34rem] text-[1.1875rem] leading-normal text-ink-2 [text-shadow:0_0_2px_rgb(1_2_8/0.9),0_1px_14px_rgb(1_2_8/0.95)]">{site.hero.lead}</p>
        <div data-hero="lead" className="relative z-[1] mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild><Link href="/work">View my work</Link></Button>
          <Button asChild variant="outline"><Link href="/about">About me <ArrowRight data-icon="inline-end" /></Link></Button>
        </div>
      </section>

      <LogoStrip />

      <Toolkit />

      <WorkedWith />

      <section className="wrap pt-[clamp(48px,6vw,80px)]" aria-label="In numbers">
        <Stats items={STATS} />
      </section>

      {/* selected works */}
      <section className="wrap section-space" aria-labelledby="worksTitle">
        <SectionHead id="worksTitle" title="Selected Works" count={`(${pad(site.projects.length)})`} intro="A few recent projects across product, 3D and the web, built with care from first sketch to launch." />
        <div className="grid gap-5 md:grid-cols-2">
          {site.projects.slice(0, 4).map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline"><Link href="/work">View all works <ArrowRight data-icon="inline-end" /></Link></Button>
        </div>
      </section>

      {/* services */}
      <section className="wrap section-space" aria-labelledby="servicesTitle">
        <SectionHead id="servicesTitle" title="Services" intro={`From first sketch to launch day, ${COUNT_WORDS[site.help.length] ?? site.help.length} ways I help startups and studios ship.`} />
        <ol className="border-b border-line">
          {site.help.map((h, i) => (
            <li key={h.name} data-reveal-item className="group grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-t border-line py-6 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.1fr)_200px] md:gap-6 md:py-[30px]">
              <span className="text-sm text-dim tabular-nums">{pad(i + 1)}</span>
              <h3 className="text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] font-medium tracking-[-0.025em] transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">{h.name}</h3>
              <p className="col-start-2 max-w-[40ch] text-[0.9375rem] text-muted-foreground md:col-start-auto">
                {h.desc}
                <span className="mt-1.5 block text-[0.8125rem] text-dim">{h.tools}</span>
              </p>
              <Image src={h.still} alt="" width={400} height={250} sizes="200px" className="hidden aspect-[16/10] w-[200px] translate-y-2 scale-[0.96] rounded-xl object-cover opacity-0 transition-[opacity,transform] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 md:block" />
            </li>
          ))}
        </ol>
      </section>

      <Platforms />

      {/* about panel */}
      <section className="wrap section-space" aria-labelledby="behindTitle">
        <div className="panel flex flex-col items-center overflow-hidden px-5 pt-[clamp(56px,7vw,96px)] pb-[clamp(40px,5vw,64px)] text-center">
          <h2 id="behindTitle" className="display-title" data-split>Behind the screen</h2>
          <p data-reveal className="mx-auto mt-5 mb-7 max-w-[40rem] text-[1.1875rem] leading-relaxed text-muted-foreground">{site.about.paragraphs[0]}</p>
          <Button asChild><Link href="/about">More about me</Link></Button>
          <div className="mt-14 flex w-full flex-wrap justify-center gap-[clamp(12px,2vw,28px)]" data-polaroids>
            {site.polaroids.map((p, i) => (
              // the wrapper scrolls (the fan in motion.tsx); the photo inside is the one you can throw
              <div key={p.src} data-polaroid className={cn("relative aspect-[4/5] w-[calc(50%-12px)] md:w-[clamp(140px,17vw,220px)]", i > 1 && "hidden md:block")}>
                <figure
                  data-throw
                  data-cursor="Throw"
                  className={cn(
                    "absolute inset-0 cursor-grab touch-none overflow-hidden rounded-2xl bg-surface-2 shadow-[0_24px_48px_rgb(0_0_0/0.35)] transition-[rotate] duration-500 ease-out-expo select-none hover:rotate-0 active:cursor-grabbing",
                    TILT[i % TILT.length],
                  )}
                >
                  <Image src={p.src} alt={p.alt} fill draggable={false} sizes="(min-width: 768px) 220px, 50vw" className="pointer-events-none object-cover grayscale contrast-[1.05]" />
                  <figcaption className="absolute bottom-2.5 left-2.5 rounded-full bg-background/70 px-2.5 py-1 text-[0.8125rem] font-medium text-ink-2">{p.caption}</figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Team />

      {/* recent writing */}
      <section className="wrap section-space" aria-labelledby="notesTitle">
        <SectionHead id="notesTitle" title="From the Journal" intro="Notes on building for the web: speed, motion, 3D and the odd rant." />
        <div className="grid gap-5 md:grid-cols-3">
          {POSTS.slice(0, 3).map((p) => <PostCard key={p.slug} post={summarize(p)} excerpt={false} />)}
        </div>
      </section>

      <div className="section-space">
        <CurvedMarquee words={DISCIPLINES} label="What I do" />
      </div>

      {/* closing call to action, over a dot grid that answers the cursor */}
      <section className="relative isolate wrap flex flex-col items-center py-[clamp(120px,14vw,200px)] pb-[clamp(88px,9vw,128px)] text-center" aria-labelledby="ctaTitle">
        <h2 id="ctaTitle" data-split className="max-w-[12ch] font-display font-extrabold tracking-[-0.03em] [word-spacing:0.08em] text-[clamp(2.75rem,1.4rem+5.4vw,6.25rem)] leading-[0.98]">
          Let&apos;s build something <em className="text-electric-soft">fast</em>
        </h2>
        <p data-reveal className="mx-auto mt-6 mb-8 max-w-[32rem] text-[1.1875rem] text-muted-foreground">Have a project in mind? I&apos;m always up for new work and a good chat about the web.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild><Link href="/contact">Start a project</Link></Button>
          <CopyEmailButton />
        </div>
        <LiveStatus className="mt-6 block text-sm text-dim" />
        <ReactiveGrid />
      </section>
      <Motion />
    </>
  )
}
