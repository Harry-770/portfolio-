"use client"

import { useEffect, useRef } from "react"
import { drawCover } from "@/lib/generative"
import { cn } from "@/lib/utils"

/**
 * A journal cover drawn in code from the post's slug.
 * Still by default; it moves while its card is hovered (or always, with `animate`),
 * only while on screen, at ~20fps, and never under reduced motion.
 */
export function Cover({ seed, title, animate = false, className }: { seed: string; title: string; animate?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    let visible = true, hover = false, raf = 0, last = 0
    const draw = (t = 0) => drawCover(canvas, seed, t)
    const loop = (now: number) => {
      if (now - last > 50) { last = now; if (visible && (animate || hover)) draw((now / 1000) * 0.25) }
      raf = requestAnimationFrame(loop)
    }
    draw()
    const ro = new ResizeObserver(() => draw())
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)
    const host = canvas.closest("[data-cover-hover]")
    const on = () => { hover = true }, off = () => { hover = false }
    if (!reduced) {
      host?.addEventListener("pointerenter", on)
      host?.addEventListener("pointerleave", off)
      raf = requestAnimationFrame(loop)
    }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      host?.removeEventListener("pointerenter", on); host?.removeEventListener("pointerleave", off)
    }
  }, [seed, animate])

  return (
    <div data-reveal-clip className={cn("relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-2", className)}>
      <canvas ref={ref} role="img" aria-label={`Cover drawn in code for ${title}`} className="block size-full" />
    </div>
  )
}
