"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * A Gemini-style rainbow wave along the bottom of the hero: six ribbons of light that flow, twist round
 * each other and slowly cycle through the spectrum. It's alive all the time; scrolling speeds it up and
 * lifts it, and the ribbons lean towards the mouse. Two 2D canvases with additive blending: the glow is
 * drawn at quarter resolution and stretched + blurred by the browser (cheap, and softer), only the thin
 * bright cores at full resolution. Paused while it's off screen.
 * Reduced motion: one still frame.
 */
const COLORS = ["#4285f4", "#7c5cff", "#c86dd7", "#ec4899", "#f97316", "#facc15", "#22c55e", "#06b6d4", "#4285f4"]
const RIBBONS = 6

export function RainbowWave({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLCanvasElement>(null)
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const box = wrap.current, canvas = ref.current, glowCanvas = glowRef.current
    const ctx = canvas?.getContext("2d"), gctx = glowCanvas?.getContext("2d")
    if (!box || !canvas || !ctx || !glowCanvas || !gctx) return
    const GLOW = 0.25
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true
    let t = 0, last = 0, lift = 0, boost = 0
    let mx = 0.5, pull = 0, pullTo = 0

    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 1.5)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      glowCanvas.width = Math.max(1, Math.round(w * GLOW)); glowCanvas.height = Math.max(1, Math.round(h * GLOW))
      gctx.setTransform(GLOW, 0, 0, GLOW, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h); gctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = gctx.globalCompositeOperation = "lighter"
      // the spectrum slides sideways over time, so the colours flow along the ribbons
      const shift = (t * 0.035) % 1
      const spectrum = (c2: CanvasRenderingContext2D) => {
        const g = c2.createLinearGradient(-w * shift, 0, w * 2 - w * shift, 0)
        COLORS.concat(COLORS.slice(1)).forEach((c, i, all) => g.addColorStop(i / (all.length - 1), c))
        return g
      }
      const grad = spectrum(ctx), ggrad = spectrum(gctx)
      const step = Math.max(6, w / 180)
      const k = (Math.PI * 2) / w
      for (let r = 0; r < RIBBONS; r++) {
        const depth = r / (RIBBONS - 1)                                  // 0 front … 1 back
        const amp = h * (0.15 + depth * 0.07) * (1 + lift * 0.5)
        const freq = 1.1 + r * 0.22
        const phase = t * (0.55 + r * 0.12) + r * 1.7
        const base = h * (0.58 - lift * 0.08) + (r - RIBBONS / 2) * h * 0.018
        const path = new Path2D()
        for (let x = -step; x <= w + step; x += step) {
          const near = Math.exp(-(((x / w - mx) * 4) ** 2))              // lean towards the mouse
          const y = base
            + Math.sin(x * k * freq + phase) * amp * 0.62
            + Math.sin(x * k * freq * 0.47 - phase * 0.8 + r) * amp * 0.38
            - near * pull * h * 0.12 * (1 - depth * 0.5)
          if (x === -step) path.moveTo(x, y); else path.lineTo(x, y)
        }
        const fade = 1 - depth * 0.55
        gctx.strokeStyle = ggrad; gctx.lineCap = "round"
        gctx.globalAlpha = 0.07 * fade; gctx.lineWidth = h * 0.16; gctx.stroke(path)   // wide glow
        gctx.globalAlpha = 0.16 * fade; gctx.lineWidth = h * 0.04; gctx.stroke(path)   // soft body
        ctx.strokeStyle = grad; ctx.lineCap = "round"
        ctx.globalAlpha = 0.85 * fade; ctx.lineWidth = 1.4 + (1 - depth) * 0.8; ctx.stroke(path) // bright core
      }
      ctx.globalAlpha = gctx.globalAlpha = 1
      ctx.globalCompositeOperation = gctx.globalCompositeOperation = "source-over"
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) { last = now; return }
      const dt = Math.min(0.05, (now - (last || now)) / 1000)
      last = now
      // scroll: how far through the first screen, and how fast we're moving
      const p = Math.min(1, Math.max(0, scrollY / innerHeight))
      lift += (p - lift) * 0.08
      boost *= 0.92
      pull += (pullTo - pull) * 0.06
      t += dt * (1 + lift * 1.6 + boost)
      box.style.translate = `0 ${(-lift * 14).toFixed(1)}%`
      draw()
    }

    size()
    if (still) { draw(); const ro = new ResizeObserver(() => { size(); draw() }); ro.observe(canvas); return () => ro.disconnect() }

    let lastY = scrollY
    const onScroll = () => { boost = Math.min(4, boost + Math.abs(scrollY - lastY) * 0.01); lastY = scrollY }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mx = (e.clientX - r.left) / r.width
      pullTo = e.clientY > r.top - innerHeight * 0.3 && e.clientY < r.bottom ? 1 : 0
    }
    const onLeave = () => { pullTo = 0 }
    const ro = new ResizeObserver(size); ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(canvas)
    addEventListener("scroll", onScroll, { passive: true })
    addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      removeEventListener("scroll", onScroll); removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      data-wave
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[52svh] motion-safe:animate-[wave-in_1.6s_ease-out_both] [mask-image:linear-gradient(to_bottom,transparent,#000_28%,#000_72%,transparent)]",
        className,
      )}
    >
      <canvas ref={glowRef} className="absolute inset-0 size-full blur-[10px]" />
      <canvas ref={ref} className="absolute inset-0 size-full" />
    </div>
  )
}
