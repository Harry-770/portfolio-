"use client"

import { useEffect, useRef, useState } from "react"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/\\?!"

/**
 * Text that glitches when its link or button is hovered or focused: each letter flickers through random
 * glyphs and settles, left to right (after Originkit's Scramble Text). The real text keeps its place,
 * invisible, so the width never jumps; screen readers only ever read the real text.
 * Reduced motion: no scramble.
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(text)

  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("a, button") ?? ref.current
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const run = () => {
      cancelAnimationFrame(raf)
      const start = performance.now()
      const tick = (now: number) => {
        const t = (now - start) / 28                                  // one frame of progress every ~28ms
        const out = [...text].map((ch, i) => {
          if (ch === " " || t > i * 1.6 + 6) return ch                // settled
          const g = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          return ch === ch.toLowerCase() ? g.toLowerCase() : g
        }).join("")
        setShown(out)
        if (out !== text) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    host.addEventListener("pointerenter", run)
    host.addEventListener("focus", run)
    return () => { cancelAnimationFrame(raf); host.removeEventListener("pointerenter", run); host.removeEventListener("focus", run) }
  }, [text])

  return (
    <span ref={ref} className={`relative inline-block whitespace-nowrap ${className ?? ""}`}>
      <span className="invisible">{text}</span>
      <span aria-hidden="true" className="absolute inset-0">{shown}</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
