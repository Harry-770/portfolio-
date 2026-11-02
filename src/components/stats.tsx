"use client"

import { useEffect, useRef } from "react"

export type Stat = { value: number; suffix?: string; label: string; count?: false }   // count: false shows the number as-is (a year)

/**
 * A row of numbers that count up as they scroll into view (after Originkit's Stats 01). The page is
 * prerendered with the final numbers, so without JavaScript (or with reduced motion) they're simply
 * there; the count only plays the first time the row comes into view.
 */
export function Stats({ items }: { items: Stat[] }) {
  const ref = useRef<HTMLDListElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const nums = [...el.querySelectorAll<HTMLElement>("[data-count]")]
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1600)
        const eased = 1 - (1 - p) ** 4
        nums.forEach((n) => { n.textContent = String(Math.round(Number(n.dataset.count) * eased)) })
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])

  return (
    <dl ref={ref} className="grid grid-cols-2 border-y border-line md:grid-cols-4">
      {items.map((s, i) => (
        <div key={s.label} data-reveal-item className={`flex flex-col-reverse gap-2 py-8 md:px-8 md:py-10 ${i % 2 ? "pl-5" : "pr-5"} ${i > 0 ? "md:border-l md:border-line" : "md:pl-0"} ${i > 1 ? "border-t border-line md:border-t-0" : ""}`}>
          <dt className="text-sm text-muted-foreground">{s.label}</dt>
          <dd className="font-display text-[clamp(2.75rem,1.9rem+2.8vw,4.25rem)] leading-none font-bold tracking-[-0.04em] tabular-nums">
            <span data-count={s.count === false ? undefined : s.value}>{s.value}</span>
            {s.suffix && <span className="text-electric-soft">{s.suffix}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}
