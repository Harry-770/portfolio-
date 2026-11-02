"use client"

import { useEffect } from "react"
import { ReactLenis, useLenis } from "lenis/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMediaQuery } from "@/lib/client-values"

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock
 * (the pattern from the official GSAP + Lenis docs). The wheel glide is off for visitors who
 * prefer reduced motion. Always renders ReactLenis so toggling never remounts the page.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const smooth = !useMediaQuery("(prefers-reduced-motion: reduce)", true)
  return (
    <ReactLenis
      root
      autoRaf={false}
      // lerp: each frame closes 8% of the gap to the target, a softer, continuous glide than a fixed duration
      options={{ lerp: 0.08, wheelMultiplier: 0.9, smoothWheel: smooth, touchMultiplier: 1.2, anchors: true }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  )
}

// Lenis creates its instance after mount; useLenis() hands it over once it exists.
function LenisBridge() {
  const lenis = useLenis(ScrollTrigger.update)

  useEffect(() => {
    if (!lenis) return
    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // Other code that calls window.scrollTo (Next.js scrolling to the top on navigation, ScrollTrigger,
    // test tools) goes through Lenis, so a wheel glide still in progress can't drag the page back.
    const nativeScrollTo = window.scrollTo.bind(window)
    let inner = false
    window.scrollTo = ((...a: [ScrollToOptions?] | [number, number]) => {
      const top = typeof a[0] === "object" ? a[0]?.top : a[1]
      if (inner || typeof top !== "number") return (nativeScrollTo as (...x: unknown[]) => void)(...a)
      inner = true
      try { lenis.scrollTo(top, { immediate: true, force: true }) } finally { inner = false }
    }) as typeof window.scrollTo

    return () => { window.scrollTo = nativeScrollTo; gsap.ticker.remove(update) }
  }, [lenis])

  return null
}
