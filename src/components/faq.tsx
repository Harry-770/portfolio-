"use client"

import { useId, useState } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export type QA = { q: string; a: string }

/**
 * A FAQ accordion (after Originkit's sections): one answer open at a time, sliding open on a
 * grid-rows transition so the height animates without measuring. Buttons with aria-expanded and
 * regions with aria-labelledby, so it reads properly with a screen reader and works from the keyboard.
 */
export function Faq({ items }: { items: QA[] }) {
  const base = useId()
  const [open, setOpen] = useState(0)
  return (
    <ul className="border-t border-line">
      {items.map((it, i) => {
        const on = open === i
        return (
          <li key={it.q} data-reveal-item className="border-b border-line">
            <h3>
              <button
                id={`${base}-q${i}`}
                aria-expanded={on}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(on ? -1 : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left font-display text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] font-bold tracking-[-0.02em] [word-spacing:0.04em]"
              >
                {it.q}
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-full border border-line-2 transition-[transform,background-color,border-color] duration-300", on ? "rotate-45 border-electric bg-electric text-white" : "group-hover:border-electric-soft")}>
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={`${base}-a${i}`}
              role="region"
              aria-labelledby={`${base}-q${i}`}
              className={cn("grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo", on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
            >
              <div className="overflow-hidden">
                <p className="max-w-[60ch] pb-7 text-[1.0625rem] leading-relaxed text-muted-foreground">{it.a}</p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
