import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PAGES, site } from "@/content/site"
import { LiveStatus, Year } from "@/components/live-status"
import { KeysButton } from "@/components/keys"
import { BackToTop } from "@/components/back-to-top"
import { ScrambleText } from "@/components/scramble-text"

/**
 * The footer, quiet and classic: a contact line, four even columns and a slim legal bar.
 * Hairlines only, no boxes; a thin electric-blue rule along the top is the one accent.
 */
export function Footer() {
  return (
    <footer className="relative z-[2] overflow-hidden bg-background">
      {/* the top rule: a hairline that brightens to electric blue in the middle */}
      <div aria-hidden="true" className="h-px bg-[linear-gradient(90deg,transparent,rgb(170_185_255/0.18)_20%,var(--electric-soft)_50%,rgb(170_185_255/0.18)_80%,transparent)]" />
      {/* a faint blue glow under the top rule */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64 [background:radial-gradient(50%_100%_at_50%_0%,color-mix(in_srgb,var(--electric)_14%,transparent),transparent_70%)]" />

      <div className="wrap relative">
        {/* contact line */}
        <div className="grid gap-8 border-b border-line py-[clamp(56px,7vw,88px)] md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-4">
            <p className="inline-flex w-fit items-center gap-2.5 rounded-full border border-line-2 bg-surface px-3.5 py-1.5 text-[0.8125rem] text-ink-2">
              <span className="relative grid size-2 place-items-center">
                {site.available && <span className="absolute size-2 rounded-full bg-electric-soft/60 motion-safe:animate-ping" />}
                <span className="size-2 rounded-full bg-electric-soft" />
              </span>
              {site.available ? `Available from ${site.availableFrom}` : "Booked for now"}
            </p>
            <p className="display-accent max-w-[22ch] font-display font-bold tracking-[-0.025em] [word-spacing:0.06em] text-[clamp(1.875rem,1.3rem+2vw,3rem)] leading-[1.05]">
              Have an idea? <em>Let&apos;s shape it.</em>
            </p>
          </div>
          <div className="grid gap-2 md:justify-items-end">
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-3 text-[clamp(1.125rem,0.9rem+1vw,1.625rem)] font-medium tracking-[-0.02em] text-ink"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px]">
                {site.email}
              </span>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-electric text-white transition-[transform,box-shadow] duration-500 ease-out-expo group-hover:rotate-45 group-hover:shadow-[0_8px_30px_-6px_color-mix(in_srgb,var(--electric)_80%,transparent)]">
                <ArrowUpRight className="size-4" />
              </span>
            </a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground">
              {site.phone}
            </a>
          </div>
        </div>

        {/* four even columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 md:grid-cols-4">
          <FooterCol title="Studio">
            <span className="text-muted-foreground">{site.city}</span>
            <span className="text-muted-foreground">
              Local time <LiveStatus kind="time" className="text-ink tabular-nums" />
            </span>
            <span className="text-muted-foreground">Working since {site.since}</span>
          </FooterCol>
          <FooterCol title="Pages">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {PAGES.map((p) => <Link key={p.href} href={p.href}><ScrambleText text={p.label} /></Link>)}
            </div>
          </FooterCol>
          <FooterCol title="Elsewhere">
            {site.socials.map(([n, u]) => (
              <a key={n} href={u} target="_blank" rel="noopener" className="group/s inline-flex items-center gap-1">
                {n}
                <ArrowUpRight className="size-3.5 opacity-0 transition-[opacity,transform] duration-300 group-hover/s:translate-x-0.5 group-hover/s:-translate-y-0.5 group-hover/s:opacity-100" />
              </a>
            ))}
          </FooterCol>
          <FooterCol title="More">
            <Link href="/contact">Start a project</Link>
            <a href={`mailto:${site.email}`}>Email me</a>
            <KeysButton />
          </FooterCol>
        </div>
      </div>

      {/* legal bar */}
      <div className="relative border-t border-line">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-5 text-[0.8125rem] text-dim" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
          <p>
            © <Year />. All rights reserved. Designed and built in {site.city.split(",")[0]}.
            {site.source && <> · <a className="underline underline-offset-4 hover:text-foreground" href={site.source} target="_blank" rel="noopener">Source</a></>}
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid content-start justify-items-start gap-2.5 text-[0.9375rem] [&_a]:text-muted-foreground [&_a]:transition-colors [&_a:hover]:text-foreground">
      <h3 className="mb-1 text-[0.8125rem] font-medium text-dim">{title}</h3>
      {children}
    </div>
  )
}
