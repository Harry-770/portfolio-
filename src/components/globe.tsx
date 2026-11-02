"use client"

import { useEffect, useRef } from "react"

export type GlobePin = { label: string; lat: number; lon: number }

/**
 * A dotted globe (after Originkit's Globe): a Fibonacci sphere of dots, turning slowly, with a pulsing
 * home pin and light arcs travelling from home to each of the other pins. Drag to spin it; it carries
 * on with the throw, then settles back to its own pace. Plain 2D canvas (orthographic projection), in
 * the theme's accent colour, paused while off screen. Reduced motion: a still globe, home facing you.
 */
export function Globe({ home, pins, label }: { home: GlobePin; pins: GlobePin[]; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    const D = Math.PI / 180
    const TILT = -0.32
    // the dots: an even spread over the sphere
    const N = 1100
    const dots = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5))
      return [Math.cos(th) * r, y, Math.sin(th) * r] as const
    })
    const toXYZ = (lat: number, lon: number) => [Math.cos(lat * D) * Math.sin(lon * D), Math.sin(lat * D), Math.cos(lat * D) * Math.cos(lon * D)] as const

    let size = 0, raf = 0, visible = true, last = 0, t = 0
    const SPIN = 0.12                          // its own pace, radians a second
    let rot = -home.lon * D                     // home starts facing you
    let drag: { x: number; rot: number; t: number } | null = null, fling = 0

    const read = () => {
      const cs = getComputedStyle(document.documentElement)
      return { hot: cs.getPropertyValue("--electric").trim(), soft: cs.getPropertyValue("--electric-soft").trim(), ink: cs.getPropertyValue("--ink").trim() }
    }
    let col = read()
    // canvas fonts cannot read CSS variables: use the page's own (self-hosted) Inter by name
    const face = getComputedStyle(document.body).fontFamily
    const onAccent = () => { col = read(); if (still) draw() }
    addEventListener("accentchange", onAccent)

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      size = canvas.clientWidth
      canvas.width = canvas.height = Math.round(size * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    // rotate about the vertical axis, then tilt towards the viewer; z > 0 faces us
    const project = ([x, y, z]: readonly [number, number, number]) => {
      const cx = x * Math.cos(rot) + z * Math.sin(rot), cz = -x * Math.sin(rot) + z * Math.cos(rot)
      const ty = y * Math.cos(TILT) - cz * Math.sin(TILT), tz = y * Math.sin(TILT) + cz * Math.cos(TILT)
      const R = size * 0.42
      return { x: size / 2 + cx * R, y: size / 2 - ty * R, z: tz }
    }
    // a point along the great circle from a to b, lifted off the surface in the middle
    const along = (a: readonly number[], b: readonly number[], f: number) => {
      const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), om = Math.acos(dot), so = Math.sin(om) || 1
      const k1 = Math.sin((1 - f) * om) / so, k2 = Math.sin(f * om) / so, lift = 1 + Math.sin(f * Math.PI) * 0.22
      return [(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift] as const
    }

    const draw = () => {
      ctx.clearRect(0, 0, size, size)
      // the halo and the disc
      const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.3, size / 2, size / 2, size * 0.52)
      g.addColorStop(0, "transparent"); g.addColorStop(0.8, col.hot + "22"); g.addColorStop(1, "transparent")
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size)
      for (const d of dots) {
        const p = project(d)
        ctx.globalAlpha = p.z > 0 ? 0.25 + p.z * 0.6 : 0.06
        ctx.fillStyle = p.z > 0 ? col.soft : col.hot
        ctx.beginPath(); ctx.arc(p.x, p.y, p.z > 0 ? 1.1 + p.z * 0.6 : 0.8, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1
      const h = toXYZ(home.lat, home.lon)
      // arcs out to each pin, with a bright head travelling along them
      pins.forEach((pin, i) => {
        const b = toXYZ(pin.lat, pin.lon)
        ctx.strokeStyle = col.hot; ctx.lineWidth = 1.6
        ctx.beginPath()
        let pen = false
        for (let s = 0; s <= 48; s++) {
          const q = project(along(h, b, s / 48))
          if (q.z > -0.05) { if (pen) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); pen = true } else pen = false
        }
        ctx.globalAlpha = 0.7; ctx.stroke(); ctx.globalAlpha = 1
        const head = project(along(h, b, (t * 0.35 + i * 0.5) % 1))
        if (head.z > 0) { ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(head.x, head.y, 2.4, 0, Math.PI * 2); ctx.fill() }
        const end = project(b)
        if (end.z > 0) {
          ctx.fillStyle = col.soft; ctx.beginPath(); ctx.arc(end.x, end.y, 3.2, 0, Math.PI * 2); ctx.fill()
          ctx.font = `500 12px ${face}`; ctx.fillStyle = col.ink; ctx.globalAlpha = 0.85
          ctx.fillText(pin.label, end.x + 8, end.y + 4); ctx.globalAlpha = 1
        }
      })
      // home, pulsing
      const hp = project(h)
      if (hp.z > 0) {
        const pulse = (t * 0.8) % 1
        ctx.strokeStyle = col.soft; ctx.globalAlpha = 1 - pulse; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(hp.x, hp.y, 4 + pulse * 18, 0, Math.PI * 2); ctx.stroke()
        ctx.globalAlpha = 1; ctx.fillStyle = col.ink
        ctx.beginPath(); ctx.arc(hp.x, hp.y, 4.5, 0, Math.PI * 2); ctx.fill()
        ctx.font = `600 13px ${face}`
        ctx.fillText(home.label, hp.x + 10, hp.y - 8)
      }
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - (last || now)) / 1000)
      last = now
      if (!visible) return
      t += dt
      if (!drag) { fling *= 0.95; rot += (SPIN + fling) * dt }
      draw()
    }

    resize()
    const ro = new ResizeObserver(() => { resize(); draw() }); ro.observe(canvas)
    if (still) { draw(); return () => { ro.disconnect(); removeEventListener("accentchange", onAccent) } }

    const down = (e: PointerEvent) => { drag = { x: e.clientX, rot, t: performance.now() }; canvas.setPointerCapture(e.pointerId) }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const next = drag.rot + ((e.clientX - drag.x) / size) * Math.PI
      const now = performance.now()
      fling = ((next - rot) / Math.max(0.016, (now - drag.t) / 1000)) * 0.6
      rot = next; drag.t = now; drag.x = e.clientX; drag.rot = rot
    }
    const up = () => { drag = null; fling = Math.max(-6, Math.min(6, fling)) }
    canvas.addEventListener("pointerdown", down)
    canvas.addEventListener("pointermove", move)
    canvas.addEventListener("pointerup", up)
    canvas.addEventListener("pointercancel", up)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(canvas)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener("accentchange", onAccent)
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move)
      canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up)
    }
  }, [home, pins])

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      data-cursor="Drag"
      className="aspect-square w-full max-w-[560px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
    />
  )
}
