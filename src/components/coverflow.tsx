"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type CoverSlide = { key: string; title: string; sub: string; media: React.ReactNode }

// how the row is laid out in 3D
const PERSPECTIVE = 1600
const MAX_VISIBLE = 2       // cards shown either side of the centre
const SCALE_STEP = 0.16     // each step out is this much smaller
const DEPTH = 240           // and pushed this far back (px)
const TILT = 12             // turned away (deg, rotateY)
const SIDE_TILT = 8         // and leaned over (deg, rotateZ)
const MOVE_MS = 650
const HOLD_MS = 3200

/**
 * A 3D coverflow: the centre card faces you while its neighbours tilt back in perspective, smaller,
 * further away and dimmed. It rolls on by itself; hover or focus holds it. Click a side card to bring it
 * to the centre (the centre card moves on to the next); swipe or use the arrow keys. Moves are locked
 * while a card is travelling, so fast clicks don't stack into a jitter. Loops forever.
 * After Tanya Prokofieva's Framer coverflow (via Originkit), rebuilt for this site.
 * Reduced motion: no auto-advance, and moves are near-instant.
 */
export function Coverflow({ slides, label }: { slides: CoverSlide[]; label: string }) {
  const n = slides.length
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const lock = useRef(false)
  const drag = useRef<{ x: number; id: number } | null>(null)

  const go = (to: (a: number) => number) => {
    if (lock.current) return
    lock.current = true
    setTimeout(() => { lock.current = false }, MOVE_MS)
    setActive((a) => ((to(a) % n) + n) % n)
  }

  // roll on by itself, unless held or the visitor prefers less motion
  useEffect(() => {
    if (held || n < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => setActive((a) => (a + 1) % n), HOLD_MS)
    return () => clearInterval(id)
  }, [held, n])

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        // preventDefault also tells the site's page shortcuts (keys.tsx) to leave these keys alone
        if (e.key === "ArrowRight") { e.preventDefault(); go((a) => a + 1) }
        if (e.key === "ArrowLeft") { e.preventDefault(); go((a) => a - 1) }
      }}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onPointerDown={(e) => { drag.current = { x: e.clientX, id: e.pointerId } }}
      onPointerUp={(e) => {
        const d = drag.current
        drag.current = null
        if (d && d.id === e.pointerId && Math.abs(e.clientX - d.x) > 40) go((a) => a + (e.clientX < d.x ? 1 : -1))
      }}
      className="relative flex h-[clamp(300px,38vw,460px)] touch-pan-y items-center justify-center overflow-hidden rounded-3xl outline-none [--cf-gap:min(240px,30vw)] [--cf-w:min(460px,74vw)] focus-visible:ring-2 focus-visible:ring-ring/60"
      style={{ perspective: `${PERSPECTIVE}px` }}
    >
      <div className="relative aspect-[4/3] w-(--cf-w)" style={{ transformStyle: "preserve-3d" }}>
        {slides.map((s, i) => {
          // the shortest way round the loop from the centre: …-2, -1, 0, 1, 2…
          let rel = i - active
          if (rel > n / 2) rel -= n
          if (rel < -n / 2) rel += n
          const ax = Math.abs(rel)
          const shown = ax <= MAX_VISIBLE
          const centre = rel === 0
          return (
            <div
              key={s.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${s.title}`}
              aria-hidden={!shown || undefined}
              onClick={() => go((a) => (centre ? a + 1 : i))}
              className={cn(
                "absolute inset-0 overflow-hidden rounded-[28px] bg-surface-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] select-none motion-reduce:duration-150",
                shown ? "cursor-pointer" : "pointer-events-none",
                centre && "ring-1 ring-electric-soft/40",
              )}
              style={{
                transform: `translateX(calc(${rel} * var(--cf-gap))) translateZ(${-ax * DEPTH}px) rotateY(${-rel * TILT}deg) rotateZ(${rel * SIDE_TILT}deg) scale(${Math.max(0.4, 1 - ax * SCALE_STEP)})`,
                opacity: shown ? 1 : 0,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute inset-0 [&_img]:pointer-events-none [&_img]:select-none">{s.media}</div>
              {/* title, on a gradient so it reads over any picture */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(1_2_8/0.85))]" />
              <div className="pointer-events-none absolute inset-x-6 bottom-5 text-left">
                <p className="text-[clamp(1.125rem,0.9rem+1vw,1.625rem)] leading-tight font-bold tracking-[-0.02em] text-white">{s.title}</p>
                <p className="mt-1 text-[0.8125rem] text-ink-2">{s.sub}</p>
              </div>
              {/* the dimmer on everything but the centre */}
              <div
                className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ opacity: centre ? 0 : 0.4 }}
              />
            </div>
          )
        })}
      </div>
      <p aria-live="polite" className="sr-only">{slides[active]?.title}</p>
    </div>
  )
}
