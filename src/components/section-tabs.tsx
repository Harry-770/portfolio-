"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

export type SectionTab = { label: string; note: string; panel: React.ReactNode }

/**
 * Tabs for a section (Platforms, Partners): WAI-ARIA tabs, the arrow keys move between them.
 * With a mouse, resting on a tab opens it (after a short pause, so sweeping across the bar doesn't flicker);
 * clicks, taps and keys work as usual. Each time a panel opens, its cards rise in one after another and
 * their icons ([data-tab-icon]) pop in. `name` labels the tab list and keeps the ids apart when two sets
 * share a page. Reduced motion: panels just switch.
 */
export function SectionTabs({ name, tabs }: { name: string; tabs: SectionTab[] }) {
  const key = name.toLowerCase().replace(/\W+/g, "-")
  const [on, setOn] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const panels = useRef<(HTMLDivElement | null)[]>([])
  const hover = useRef<ReturnType<typeof setTimeout>>(undefined)
  const shown = useRef(on)
  const move = (i: number) => { const k = (i + tabs.length) % tabs.length; setOn(k); refs.current[k]?.focus() }

  // the cards and their icons arrive each time a panel opens (not on first load: the page reveal does that)
  useEffect(() => {
    if (shown.current === on) return
    shown.current = on
    const panel = panels.current[on]
    if (!panel || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const cards = panel.querySelectorAll(":scope > ul > li")
    const icons = panel.querySelectorAll("[data-tab-icon]")
    const tl = gsap.timeline()
    tl.fromTo(cards, { autoAlpha: 0, y: 22, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out", stagger: 0.035, clearProps: "all" })
    if (icons.length) tl.fromTo(icons, { scale: 0.4, rotation: -12, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(2.2)", stagger: 0.035, clearProps: "all" }, 0.1)
    return () => { tl.kill() }
  }, [on])

  useEffect(() => () => clearTimeout(hover.current), [])

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-line">
        <div role="tablist" aria-label={name} className="-mb-px flex gap-1 overflow-x-auto" onPointerLeave={() => clearTimeout(hover.current)}>
          {tabs.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => { refs.current[i] = el }}
              role="tab"
              id={`${key}-tab-${i}`}
              aria-selected={on === i}
              aria-controls={`${key}-panel-${i}`}
              tabIndex={on === i ? 0 : -1}
              onClick={() => setOn(i)}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return
                clearTimeout(hover.current)
                hover.current = setTimeout(() => setOn(i), 140)
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") { e.preventDefault(); move(i + 1) }
                if (e.key === "ArrowLeft") { e.preventDefault(); move(i - 1) }
              }}
              className={cn(
                "h-14 shrink-0 border-b-2 px-5 text-base whitespace-nowrap transition-colors",
                on === i ? "border-electric-soft text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="pb-4 text-sm text-dim">{tabs[on].note}</p>
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.label}
          ref={(el) => { panels.current[i] = el }}
          role="tabpanel"
          id={`${key}-panel-${i}`}
          aria-labelledby={`${key}-tab-${i}`}
          hidden={on !== i}
          className="pt-8"
        >
          {t.panel}
        </div>
      ))}
    </div>
  )
}
