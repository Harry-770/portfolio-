"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * A field of dots that answers the cursor (after Originkit's Reactive Grid / Interactive Grid): dots near
 * the pointer swell and turn the accent colour, a click sends a ripple ring out through them, and with no
 * pointer around a slow wave breathes across the field. Sits behind a section's content (absolute,
 * pointer-events none); it listens on the section itself. Paused off screen.
 * Reduced motion: a still, faint grid.
 */
export function ReactiveGrid({ className, gap = 28 }: { className?: string; gap?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext("2d"), host = canvas?.parentElement
    if (!canvas || !ctx || !host) return
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0, h = 0, raf = 0, visible = true, t = 0, last = 0
    let px = -9999, py = -9999, sx = -9999, sy = -9999, near = 0, nearTo = 0
    const ripples: { x: number; y: number; r: number }[] = []
    // the theme's accent colours (re-read when the visitor switches theme)
    const rgb = (name: string) => {
      const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace("#", "")
      const n = parseInt(hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex, 16)
      return Number.isNaN(n) ? [143, 164, 255] : [n >> 16, (n >> 8) & 255, n & 255]
    }
    let soft = rgb("--electric-soft"), hot = rgb("--electric")
    const onAccent = () => { soft = rgb("--electric-soft"); hot = rgb("--electric"); if (still) draw() }
    addEventListener("accentchange", onAccent)

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const reach = 170
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          // the cursor: a soft bump of light around it
          const d = Math.hypot(x - sx, y - sy)
          let k = near * Math.max(0, 1 - d / reach) ** 2
          // ripples: a ring travelling outwards
          for (const rp of ripples) k = Math.max(k, Math.max(0, 1 - Math.abs(Math.hypot(x - rp.x, y - rp.y) - rp.r) / 34) * (1 - rp.r / 520))
          // idle: a slow diagonal wave
          const idle = still ? 0 : (Math.sin((x + y) * 0.012 - t * 1.4) * 0.5 + 0.5) * 0.18
          const a = 0.12 + idle + k * 0.85
          const mixc = (i: number) => Math.round(soft[i] + (hot[i] - soft[i]) * Math.min(1, k * 1.3))
          ctx.fillStyle = `rgba(${mixc(0)}, ${mixc(1)}, ${mixc(2)}, ${a})`
          const r = 1.1 + k * 2.4
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
        }
      }
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) { last = now; return }
      const dt = Math.min(0.05, (now - (last || now)) / 1000)
      last = now
      t += dt
      sx += (px - sx) * 0.18; sy += (py - sy) * 0.18
      near += (nearTo - near) * 0.1
      for (let i = ripples.length - 1; i >= 0; i--) { ripples[i].r += dt * 420; if (ripples[i].r > 520) ripples.splice(i, 1) }
      draw()
    }

    size()
    const ro = new ResizeObserver(() => { size(); draw() }); ro.observe(canvas)
    if (still) { draw(); return () => { ro.disconnect(); removeEventListener("accentchange", onAccent) } }

    const at = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
    const onMove = (e: PointerEvent) => {
      const p = at(e); px = p.x; py = p.y
      if (sx < -999) { sx = px; sy = py }
      nearTo = 1
    }
    const onLeave = () => { nearTo = 0 }
    const onDown = (e: PointerEvent) => { const p = at(e); ripples.push({ x: p.x, y: p.y, r: 0 }) }
    host.addEventListener("pointermove", onMove)
    host.addEventListener("pointerleave", onLeave)
    host.addEventListener("pointerdown", onDown)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(canvas)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener("accentchange", onAccent)
      host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); host.removeEventListener("pointerdown", onDown)
    }
  }, [gap])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 size-full [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_80%)]", className)}
    />
  )
}
