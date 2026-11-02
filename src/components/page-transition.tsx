"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { gsap } from "gsap"
import { PAGES } from "@/content/site"

/**
 * Page transitions: clicking a link to another page raises a blue curtain with the destination's name,
 * navigates under it, then lifts it away to reveal the new page.
 *
 * It catches link clicks in the capture phase, before Next's <Link> sees them, and marks them handled
 * (Link then stands aside); the router push happens once the curtain is up. Left alone: other sites,
 * new tabs and modifier clicks, downloads, links to the page you're on (and #hash links), back/forward,
 * and visitors who prefer reduced motion. The first visit has no curtain.
 */
export function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const curtain = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const covering = useRef(false)
  const safety = useRef<ReturnType<typeof setTimeout>>(undefined)

  const reveal = () => {
    clearTimeout(safety.current)
    if (!covering.current) return
    covering.current = false
    gsap.timeline()
      .to(label.current, { yPercent: -60, autoAlpha: 0, duration: 0.3, ease: "power2.in" })
      .to(curtain.current, { yPercent: -100, duration: 0.75, ease: "power3.inOut" }, "-=0.1")
      .set(curtain.current, { display: "none" })
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.("a")
      if (!a || a.hasAttribute("download") || (a.target && a.target !== "_self")) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname === location.pathname) return
      if (matchMedia("(prefers-reduced-motion: reduce)").matches || covering.current) return

      e.preventDefault()
      covering.current = true
      const page = PAGES.find((p) => (p.href === "/" ? url.pathname === "/" : url.pathname.startsWith(p.href)))
      if (label.current) label.current.textContent = page?.label ?? ""
      gsap.timeline()
        .set(curtain.current, { display: "grid", yPercent: 100 })
        .set(label.current, { yPercent: 60, autoAlpha: 0 })
        .to(curtain.current, { yPercent: 0, duration: 0.6, ease: "power3.inOut" })
        .to(label.current, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, "-=0.25")
        .add(() => router.push(url.pathname + url.search + url.hash))
      // never leave the page covered if the navigation stalls
      safety.current = setTimeout(reveal, 6000)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  })

  // the new page is in: lift the curtain
  useEffect(() => { reveal() }, [pathname])
  useEffect(() => () => clearTimeout(safety.current), [])

  return (
    <div
      ref={curtain}
      data-curtain
      aria-hidden="true"
      className="fixed inset-0 z-[95] hidden place-items-center overflow-hidden bg-[#010208]"
    >
      <div className="absolute inset-0 [background:radial-gradient(70%_60%_at_50%_100%,color-mix(in_srgb,var(--electric)_75%,transparent),color-mix(in_srgb,var(--navy)_50%,transparent)_40%,transparent_75%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--electric-soft),transparent)]" />
      <span ref={label} className="relative font-display font-extrabold tracking-[-0.03em] [word-spacing:0.08em] text-[clamp(3.25rem,1.8rem+7vw,8rem)] leading-none text-white" />
    </div>
  )
}
