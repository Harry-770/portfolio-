"use client"

import { useEffect, useId, useRef } from "react"

/**
 * A line of words flowing along a gentle arc, endlessly (after Originkit's Curved Marquee). Scrolling
 * gives it a push in the scroll's direction, then it eases back to its own pace; it rests while off
 * screen. The words are one SVG <textPath> repeated end to end, slid by exactly one copy's length so the
 * loop never jumps. Reduced motion: it holds still.
 */
export function CurvedMarquee({ words, label }: { words: string[]; label: string }) {
  const svg = useRef<SVGSVGElement>(null)
  const path = useRef<SVGTextPathElement>(null)
  const unit = useRef<SVGTSpanElement>(null)
  const arc = useId()
  const line = `${words.join("  ✦  ")}  ✦  `

  useEffect(() => {
    const el = svg.current, tp = path.current, one = unit.current
    if (!el || !tp || !one || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0, last = 0, offset = 0, push = 0, visible = true, lastY = scrollY
    const len = () => one.getComputedTextLength() || 1
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - (last || now)) / 1000)
      last = now
      if (!visible) return
      push *= 0.94
      offset -= (60 + push) * dt                    // px per second along the curve
      const L = len()
      offset = ((offset % L) - L) % L               // always within one copy, so the loop is seamless
      tp.setAttribute("startOffset", offset.toFixed(1))
    }
    const onScroll = () => { push = Math.max(-400, Math.min(400, push + (scrollY - lastY) * 1.2)); lastY = scrollY }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(el)
    addEventListener("scroll", onScroll, { passive: true })
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("scroll", onScroll) }
  }, [])

  return (
    <div className="relative overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <p className="sr-only">{label}: {words.join(", ")}.</p>
      <svg ref={svg} viewBox="0 0 1440 240" aria-hidden="true" className="relative left-1/2 block h-auto w-full min-w-[900px] -translate-x-1/2 overflow-visible">
        <path id={arc} d="M -60 200 Q 720 10 1500 200" fill="none" />
        <text className="fill-ink font-display text-[64px] font-semibold tracking-[-0.01em] uppercase">
          <textPath ref={path} href={`#${arc}`} startOffset="0">
            {/* enough copies to cover the curve with one to spare; the first is measured for the loop */}
            <tspan ref={unit}>{line}</tspan>
            {Array.from({ length: 5 }, (_, i) => <tspan key={i}>{line}</tspan>)}
          </textPath>
        </text>
        {/* a faint dotted guide just under the words */}
        <path d="M -60 230 Q 720 40 1500 230" fill="none" stroke="color-mix(in srgb, var(--electric-soft) 18%, transparent)" strokeDasharray="2 8" />
      </svg>
    </div>
  )
}
