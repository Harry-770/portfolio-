"use client"

import { ArrowUp } from "lucide-react"

/** "Back to top" in the footer; window.scrollTo goes through Lenis (smooth-scroll.tsx), so it glides. */
export function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
    >
      Back to top
      <span className="grid size-7 place-items-center rounded-full border border-line-2 transition-[transform,border-color,background-color] duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:border-electric group-hover:bg-electric">
        <ArrowUp className="size-3.5" />
      </span>
    </button>
  )
}
