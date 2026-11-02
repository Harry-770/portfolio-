"use client"

import { ArrowUpRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoopVideo } from "@/components/loop-video"
import { Diagram } from "@/components/diagrams"
import type { Project } from "@/content/site"

/** A work card; clicking it opens the project's details in a dialog. */
export function ProjectCard({ p }: { p: Project }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          data-cursor="View"
          data-reveal-item
          className="glow-hover group flex flex-col rounded-3xl border border-line bg-surface p-3 text-left transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-[3px] hover:border-line-2"
        >
          <span data-reveal-clip className="block aspect-[4/3] overflow-hidden rounded-2xl bg-surface-2">
            {p.diagram ? (
              <Diagram name={p.diagram} className="block size-full transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]" />
            ) : (
              <LoopVideo src={p.video!} className="size-full object-cover grayscale contrast-[1.05] brightness-95 transition-[transform,filter] duration-1000 ease-out-expo group-hover:scale-[1.04] group-hover:filter-none" />
            )}
          </span>
          <span className="flex items-baseline justify-between gap-4 px-2.5 pt-[18px] pb-1">
            <span className="text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] font-semibold tracking-[-0.02em]">{p.name}</span>
            <span className="text-sm whitespace-nowrap text-dim">{p.category} · {p.year}</span>
          </span>
          <span className="px-2.5 pb-2 text-[0.9375rem] text-muted-foreground">{p.desc}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100svh-48px)] gap-0 overflow-auto overscroll-contain rounded-3xl border-line-2 bg-surface p-0 sm:max-w-[1000px] md:grid-cols-2">
        <div className="p-3">
          {p.diagram ? (
            <Diagram name={p.diagram} className="block w-full rounded-2xl" />
          ) : (
            <LoopVideo src={p.video!} className="size-full min-h-[200px] rounded-2xl object-cover md:min-h-[320px]" />
          )}
        </div>
        <div className="grid content-start gap-4 p-7 md:p-11">
          <p className="text-sm text-muted-foreground">{p.category} · {p.year}</p>
          <DialogTitle className="pr-12 font-display font-bold tracking-[-0.025em] [word-spacing:0.06em] text-[clamp(2rem,1.5rem+1.8vw,2.75rem)] leading-[1.02]">{p.name}</DialogTitle>
          <dl className="flex flex-wrap gap-8 text-sm">
            <div><dt className="text-dim">Role</dt><dd>{p.role}</dd></div>
            <div><dt className="text-dim">Built with</dt><dd>{p.tags.join(", ")}</dd></div>
          </dl>
          <DialogDescription className="text-base text-ink-2">{p.details}</DialogDescription>
          {p.learned && (
            <blockquote className="border-l-2 border-line-2 pl-[18px] font-serif text-2xl leading-tight italic">
              <p>{p.learned}</p>
              <cite className="mt-2 block font-sans text-[0.8125rem] not-italic text-dim">What I&apos;d tell past me</cite>
            </blockquote>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <a href={p.link} target="_blank" rel="noopener">Visit the site <ArrowUpRight data-icon="inline-end" /></a>
            </Button>
            {p.repo && (
              <Button asChild variant="outline"><a href={p.repo} target="_blank" rel="noopener">Source code</a></Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
