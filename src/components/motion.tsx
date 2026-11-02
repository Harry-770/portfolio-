"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { Draggable } from "gsap/Draggable"
import { InertiaPlugin } from "gsap/InertiaPlugin"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Draggable, InertiaPlugin, DrawSVGPlugin)

/**
 * The motion layer, written to the official GSAP skills:
 * - useGSAP() cleans up every tween, ScrollTrigger and split when the page unmounts
 * - gsap.matchMedia() keeps everything still for visitors who prefer reduced motion
 * - SplitText for the type, ScrollTrigger.batch() for grids, refresh after fonts load
 * One loud moment (the hero, once per visit); everything else is quiet. Transform and opacity only.
 *
 * Mount <Motion /> as the LAST child of a page's content: it then runs only after React has
 * hydrated everything above it, so GSAP never edits markup React hasn't claimed yet.
 *
 * Markup hooks: data-hero="top|big|serif|lead", data-split (titles), data-reveal (copy),
 * data-reveal-item (cards and rows), data-reveal-clip (pictures that unmask upwards), data-polaroid (the tilted photos),
 * data-diagram (drawn diagrams: data-draw lines draw in, data-fade labels fade up), data-throw (the throwable photos),
 * data-float / data-bob / data-tile (the logo tiles around the hero: random spot + parallax › idle drift › entrance + drag),
 * data-toolkit / data-kit-panel / data-kit-tile / data-kit-row (the toolkit scroll scene).
 */
let heroPlayed = false
let dragging = false   // the mouse parallax holds still while a tile is in hand

/** Scatter the hero tiles to fresh spots on every visit: never over the words or buttons, never on top of each other. */
function scatterTiles() {
  const area = document.querySelector<HTMLElement>("[data-floats]")
  const floats = gsap.utils.toArray<HTMLElement>("[data-float]").filter((el) => el.offsetParent)
  if (!area || !floats.length) return
  const box = area.getBoundingClientRect()
  const size = floats[0].getBoundingClientRect().width || 80
  const pad = size * 0.25
  // what the tiles keep clear of: the hero's words and buttons, measured where they really are
  const keepOut = [...(area.parentElement?.querySelectorAll<HTMLElement>("[data-hero], a, button") ?? [])]
    .filter((el) => !area.contains(el))
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width && r.height)
  const hits = (x: number, y: number) => keepOut.some((r) =>
    x < r.right - box.left + pad && x + size > r.left - box.left - pad && y < r.bottom - box.top + pad && y + size > r.top - box.top - pad)
  const placed: [number, number][] = []
  floats.forEach((el) => {
    let best: [number, number] | null = null, bestGap = -1
    for (let i = 0; i < 160; i++) {
      const x = gsap.utils.random(box.width * 0.02, box.width * 0.98 - size)
      const y = gsap.utils.random(box.height * 0.08, box.height * 0.9 - size)
      if (hits(x, y)) continue
      const gap = Math.min(Infinity, ...placed.map(([px, py]) => Math.hypot(px - x, py - y)))
      if (gap > size * 1.9) { best = [x, y]; break }      // roomy enough: take it
      if (gap > bestGap) { best = [x, y]; bestGap = gap }  // otherwise keep the roomiest free spot found
    }
    if (!best) return                                       // no clear spot: leave it where the markup put it
    placed.push(best)
    gsap.set(el, { left: (best[0] / box.width) * 100 + "%", top: (best[1] / box.height) * 100 + "%", right: "auto", bottom: "auto" })
  })
}

/** The gravity gallery: the photos in the about panel can be picked up, tilted and thrown about inside it. */
function throwPhotos(throwable: boolean) {
  const panel = document.querySelector<HTMLElement>("[data-polaroids]")?.closest<HTMLElement>("section > div")
  const photos = gsap.utils.toArray<HTMLElement>("main [data-throw]")
  if (!panel || !photos.length) return
  let top = 1
  const drags = Draggable.create(photos, {
    type: "x,y", bounds: panel, inertia: throwable, edgeResistance: 0.8, zIndexBoost: false,
    onPress() {
      gsap.set((this.target as HTMLElement).parentElement, { zIndex: ++top })   // the last one picked up lands on top
      gsap.to(this.target, { scale: 1.06, duration: 0.25, overwrite: "auto" })
    },
    // lean into the direction it's moving, like a print on a string
    onDrag() { gsap.to(this.target, { rotation: gsap.utils.clamp(-18, 18, this.deltaX * 1.4), duration: 0.3, overwrite: "auto" }) },
    onRelease() { gsap.to(this.target, { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }) },
  })
  return () => drags.forEach((d) => d.kill())
}

/** Every hero tile can be picked up and thrown; it stays inside the hero. */
function dragTiles(throwable: boolean) {
  const area = document.querySelector<HTMLElement>("[data-floats]")
  if (!area) return
  // once a tile is picked up the set sits above the headline, so a tile dropped on the words stays in view
  const lift = () => { dragging = true; area.style.zIndex = "5" }
  const drop = () => { dragging = false }
  const bobsOf = (el: HTMLElement) => gsap.getTweensOf(el.parentElement)
  const tiles = Draggable.create("[data-tile]", {
    type: "x,y", bounds: area, inertia: throwable, edgeResistance: 0.75, zIndexBoost: false,
    onPress() {
      const el = this.target as HTMLElement
      lift(); bobsOf(el).forEach((t) => t.pause())
      // the last one picked up sits on top of the others
      gsap.set(el.closest("[data-float]"), { zIndex: Date.now() % 1e6 })
      gsap.to(el, { scale: 1.12, duration: 0.25, overwrite: "auto" })
    },
    onRelease() {
      gsap.to(this.target, { scale: 1, duration: 0.4, ease: "back.out(2)" })
      if (!this.isThrowing) { drop(); bobsOf(this.target).forEach((t) => t.resume()) }
    },
    onThrowComplete() { drop(); bobsOf(this.target).forEach((t) => t.resume()) },
  })
  return () => { tiles.forEach((d) => d.kill()); drop(); area.style.zIndex = "" }
}

export function Motion() {
  useGSAP((_context, contextSafe) => {
    const setup = contextSafe!(() => {
      scatterTiles()
      const mm = gsap.matchMedia()
      // drag works for everyone; the throw (inertia) only when motion is welcome
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", still: "(prefers-reduced-motion: reduce)" }, (c) =>
        { const a = dragTiles(!!c.conditions?.motion), b = throwPhotos(!!c.conditions?.motion); return () => { a?.(); b?.() } })
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.defaults({ ease: "expo.out", duration: 0.8 })

        // the hero, once per visit
        if (!heroPlayed && document.querySelector("[data-hero=big]")) {
          heroPlayed = true
          const tl = gsap.timeline()
          tl.from("[data-hero=top] > *", { y: 12, autoAlpha: 0, duration: 0.6, stagger: 0.06 })
          SplitText.create("[data-hero=big]", {
            type: "chars", mask: "chars",
            onSplit: (self) => { tl.from(self.chars, { yPercent: 110, duration: 1, stagger: 0.025 }, 0.05) },
          })
          tl.from("[data-hero=serif]", { y: 18, autoAlpha: 0, duration: 0.9 }, 0.35)
            .from("[data-hero=lead]", { y: 14, autoAlpha: 0, stagger: 0.06 }, 0.45)
        }

        let stopParallax: (() => void) | undefined

        // the logo tiles around the hero
        const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]")
        if (tiles.length) {
          const R = gsap.utils.random
          // entrance: they pop in just after the hero words
          gsap.from(tiles, { scale: 0.4, autoAlpha: 0, duration: 0.9, ease: "back.out(1.6)", stagger: { each: 0.06, from: "random" }, delay: 0.55 })
          // idle drift: each one bobs and tilts at its own pace
          const bobs = gsap.utils.toArray<HTMLElement>("[data-bob]").map((el) =>
            gsap.to(el, { y: R(-18, -9), rotation: R(-5, 5), duration: R(2.4, 3.8), ease: "sine.inOut", yoyo: true, repeat: -1, delay: R(0, 1.2) }))
          // the whole set lifts and fades as the hero scrolls away; the drift pauses while it's off screen
          gsap.to("[data-floats]", { yPercent: -14, autoAlpha: 0, ease: "none", scrollTrigger: { trigger: "[data-floats]", start: "top top", end: "bottom top", scrub: true } })
          ScrollTrigger.create({ trigger: "[data-floats]", start: "top top", end: "bottom top", onToggle: (self) => bobs.forEach((t) => (self.isActive || self.progress === 0 ? t.resume() : t.pause())) })
          // mouse parallax: nearer tiles (bigger depth) move further; quickTo reuses one tween per axis
          const movers = gsap.utils.toArray<HTMLElement>("[data-float]").map((el) => ({
            depth: Number(el.dataset.depth) || 20,
            x: gsap.quickTo(el, "x", { duration: 1, ease: "power3" }),
            y: gsap.quickTo(el, "y", { duration: 1, ease: "power3" }),
          }))
          const onMove = (e: PointerEvent) => {
            const mx = e.clientX / innerWidth - 0.5, my = e.clientY / innerHeight - 0.5
            if (!dragging) movers.forEach((m) => { m.x(mx * m.depth * 2); m.y(my * m.depth * 2) })
          }
          addEventListener("pointermove", onMove, { passive: true })
          stopParallax = () => removeEventListener("pointermove", onMove)
        }

        // titles rise line by line out of a mask as they enter
        gsap.utils.toArray<HTMLElement>("main [data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines", mask: "lines", autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: 1, stagger: 0.08, scrollTrigger: { trigger: el, start: "top 90%", once: true } }),
          })
        })

        // supporting copy follows its title
        gsap.utils.toArray<HTMLElement>("main [data-reveal]").forEach((el) =>
          gsap.from(el, { y: 16, autoAlpha: 0, delay: 0.1, scrollTrigger: { trigger: el, start: "top 92%", once: true } }))

        // grids and lists arrive together as each row enters (one trigger per batch, not per card)
        ScrollTrigger.batch("main [data-reveal-item]", {
          start: "top 92%", once: true,
          onEnter: (batch) => gsap.from(batch, { y: 28, autoAlpha: 0, stagger: 0.07, overwrite: true }),
        })

        // pictures unmask from the bottom as they arrive, their contents settling from a slight zoom
        gsap.utils.toArray<HTMLElement>("main [data-reveal-clip]").forEach((el) => {
          // plays once and stays; not once: true, whose self-kill can land mid-refresh when a picture starts on screen
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" } })
          tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 16px)" }, { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.2, ease: "expo.inOut", clearProps: "clipPath" })
          if (el.firstElementChild) tl.fromTo(el.firstElementChild, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: "expo.out", clearProps: "scale" }, 0.1)
        })

        // diagrams draw themselves: lines first, then the fills and labels settle in
        gsap.utils.toArray<SVGSVGElement>("main [data-diagram]").forEach((svg) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 85%", toggleActions: "play none none none" } })
          tl.from(svg.querySelectorAll("[data-draw]"), { drawSVG: "0%", duration: 1.3, ease: "power2.inOut", stagger: { amount: 0.9 } })
            .from(svg.querySelectorAll("[data-fade]"), { autoAlpha: 0, duration: 0.6, ease: "power2.out", stagger: { amount: 0.6 } }, 0.5)
        })

        // the polaroids fan out a little as their panel scrolls through (scrubbed, locked to the scrollbar)
        const pol = gsap.utils.toArray<HTMLElement>("[data-polaroid]")
        if (pol.length) gsap.fromTo(pol, { y: (i) => 30 + i * 10 }, {
          y: (i) => -20 - i * 6, ease: "none",
          scrollTrigger: { trigger: "[data-polaroids]", start: "top bottom", end: "bottom top", scrub: true },
        })

        // matchMedia reverts the tweens; the pointer listener is ours to remove
        return () => stopParallax?.()
      })

      // the toolkit: while the section holds still (CSS sticky), the tiles fly in from all over and
      // settle into their slots; each group's note lights up as it lands. Desktop only: on a phone the
      // section is a plain, finished layout.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        if (!document.querySelector("[data-toolkit]")) return
        const R = gsap.utils.random
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: "[data-toolkit]", start: "top 55%", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
        })
        tl.fromTo("[data-kit-panel]", { scale: 0.95 }, { scale: 1, duration: 0.2 }, 0)
        const groups = [0, 1, 2, 3].map((g) => gsap.utils.toArray<HTMLElement>(`[data-kit-tile][data-group="${g}"]`))
        const at = [0.04, 0.2, 0.38, 0.56]
        groups.forEach((tiles, g) => {
          if (!tiles.length) return
          tl.from(tiles, {
            x: () => R(-0.42, 0.42) * innerWidth,
            y: () => R(-0.55, 0.55) * innerHeight,
            rotation: () => R(-40, 40),
            scale: () => R(0.45, 0.8),
            autoAlpha: 0,
            duration: 0.28,
            stagger: 0.045,
          }, at[g])
          tl.fromTo(`[data-kit-row="${g}"]`, { autoAlpha: 0.35, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.18 }, at[g] + 0.14)
        })
        tl.to({}, { duration: 0.16 })   // a short hold with everything in place before the section moves on
      })
      // fonts change line breaks and heights: measure again once they're in
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
    })
    // one frame later, so everything above has committed
    const id = requestAnimationFrame(setup)
    return () => cancelAnimationFrame(id)
  })

  return null
}
