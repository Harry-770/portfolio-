"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * The soft blue glow behind the first screen of every page: pure CSS gradients, black → navy → electric
 * blue (the palette swatch), with a tiny white-blue core behind the headline. It breathes very slowly,
 * and stays with you the whole way down: past the first screen it settles to a softer glow that drifts
 * as you scroll, so the content always sits on the blue, never on flat black. No canvas, no WebGL.
 */
export function Backdrop() {
  const ref = useRef<HTMLDivElement>(null)
  const glow = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let ticking = false
    const paint = () => {
      ticking = false
      const first = Math.min(1, scrollY / (innerHeight * 0.85))            // 0 → 1 over the first screen
      el.style.opacity = (1 - first * 0.45).toFixed(3)                    // never below 0.55
      // the glow wanders down the page and back as you read (one slow sway per ~3 screens)
      const sway = Math.sin(scrollY / (innerHeight * 1.5))
      if (glow.current) glow.current.style.translate = `${(sway * 18).toFixed(1)}vw ${(first * 22).toFixed(1)}vh`
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint) } }
    paint()
    addEventListener("scroll", onScroll, { passive: true })
    return () => removeEventListener("scroll", onScroll)
  }, [pathname])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* the wide navy wash from the top */}
      <div className="absolute inset-0 [background:radial-gradient(95%_75%_at_50%_-8%,color-mix(in_srgb,var(--navy)_55%,transparent),rgb(0_0_51/0.35)_45%,transparent_75%)]" />
      {/* the electric-blue glow behind the headline, breathing */}
      <div ref={glow} className="absolute inset-0 transition-[translate] duration-700 ease-out motion-reduce:transition-none motion-safe:animate-[breathe_9s_ease-in-out_infinite_alternate] [background:radial-gradient(48%_38%_at_50%_30%,color-mix(in_srgb,var(--electric)_38%,transparent),color-mix(in_srgb,var(--electric)_16%,transparent)_45%,transparent_72%)]" />
      {/* a small cool-white core, so the blue reads as light rather than paint */}
      <div className="absolute inset-0 [background:radial-gradient(18%_14%_at_50%_26%,color-mix(in_srgb,var(--electric-soft)_10%,transparent),transparent_70%)]" />
      {/* the edges fall back to black */}
      <div className="absolute inset-0 [background:radial-gradient(120%_90%_at_50%_30%,transparent_55%,rgb(0_0_0/0.75))]" />
    </div>
  )
}
