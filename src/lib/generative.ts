// =====================================================================
//  GENERATIVE COVERS — every post gets unique art drawn from its slug.
//  4 styles: flow field · orbits · ridgelines · dot field.
//  Colours come from the palette (src/lib/palette.ts).
// =====================================================================
import { palette } from "@/lib/palette"

type Ctx = CanvasRenderingContext2D
type Style = (ctx: Ctx, w: number, h: number, R: () => number, s: number, t: number) => void

const rgb = (h: string) => { const n = parseInt(h.slice(1), 16); return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}` }
const INK = rgb(palette.ink), ACC = rgb(palette.accent), AC2 = rgb(palette.accent2), BG = palette.surface

const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) } return h >>> 0 }
const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
// smooth pseudo-noise from layered sines (cheap, deterministic)
const noise = (x: number, y: number, s: number, t: number) =>
  (Math.sin(x * 1.7 + s + t) + Math.sin(y * 2.3 - s * 1.3 + t * 0.7) + Math.sin((x + y) * 1.1 + s * 2.1 - t * 0.5) + Math.sin(Math.hypot(x - 1, y - 0.5) * 3 - t)) / 4

const STYLES: Record<string, Style> = {
  flow(ctx, w, h, R, s, t) {
    const lines = 260, steps = 38, step = Math.max(w, h) / 220
    for (let i = 0; i < lines; i++) {
      let x = R() * w, y = R() * h
      const roll = R(), acc = roll < 0.06, ac2 = roll > 0.9
      ctx.strokeStyle = acc ? `rgba(${ACC},.9)` : ac2 ? `rgba(${AC2},.45)` : `rgba(${INK},${0.12 + R() * 0.22})`
      ctx.lineWidth = acc ? 1.6 : 1
      ctx.beginPath(); ctx.moveTo(x, y)
      for (let k = 0; k < steps; k++) {
        const a = noise((x / w) * 3, (y / h) * 3, s, t) * Math.PI * 2
        x += Math.cos(a) * step; y += Math.sin(a) * step; ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  },
  orbits(ctx, w, h, R, s, t) {
    const cx = w * (0.35 + R() * 0.3), cy = h * (0.4 + R() * 0.2), tilt = (R() - 0.5) * 0.8, n = 7 + ((R() * 5) | 0)
    for (let i = 1; i <= n; i++) {
      const rx = i * Math.min(w, h) * 0.07 + R() * 8, ry = rx * (0.3 + R() * 0.25)
      ctx.strokeStyle = i % 3 === 0 ? `rgba(${AC2},${0.2 + (i / n) * 0.3})` : `rgba(${INK},${0.08 + (i / n) * 0.22})`
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, tilt, 0, Math.PI * 2); ctx.stroke()
      const a = t * (0.6 / i) + R() * 6.28
      const px = cx + Math.cos(a) * rx * Math.cos(tilt) - Math.sin(a) * ry * Math.sin(tilt)
      const py = cy + Math.cos(a) * rx * Math.sin(tilt) + Math.sin(a) * ry * Math.cos(tilt)
      ctx.fillStyle = i === n - 2 ? `rgb(${ACC})` : `rgba(${INK},.85)`
      ctx.beginPath(); ctx.arc(px, py, i === n - 2 ? 4 : 1.8, 0, Math.PI * 2); ctx.fill()
    }
    const g = ctx.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, 26)
    g.addColorStop(0, `rgba(${ACC},1)`); g.addColorStop(1, `rgba(${ACC},0)`)
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.fill()
  },
  ridges(ctx, w, h, R, s, t) {
    const rows = 26, top = h * 0.18, gap = (h * 0.72) / rows, peak = R() * 0.4 + 0.3
    for (let r = 0; r < rows; r++) {
      const y0 = top + r * gap
      ctx.beginPath()
      for (let x = 0; x <= w; x += 4) {
        const d = Math.abs(x / w - peak - 0.1) * 2.6, env = Math.max(0, 1 - d * d)
        const n = noise((x / w) * 6, r * 0.35, s, t * 0.8) * 0.5 + 0.5
        const y = y0 - env * n * gap * 5
        if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y)
      }
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath()
      ctx.fillStyle = BG; ctx.fill()
      ctx.strokeStyle = r === ((rows * 0.6) | 0) ? `rgba(${ACC},.95)` : r === ((rows * 0.3) | 0) ? `rgba(${AC2},.8)` : `rgba(${INK},${0.25 + (r / rows) * 0.5})`
      ctx.lineWidth = 1; ctx.stroke()
    }
  },
  dots(ctx, w, h, R, s, t) {
    const gap = Math.max(10, w / 46)
    for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) {
      const n = noise((x / w) * 4, (y / h) * 4, s, t) * 0.5 + 0.5, rad = Math.pow(n, 2.2) * gap * 0.42
      ctx.fillStyle = n > 0.86 ? `rgba(${ACC},${n})` : n > 0.7 ? `rgba(${AC2},${n * 0.8})` : `rgba(${INK},${0.12 + n * 0.55})`
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill()
    }
  },
}
const ORDER = ["flow", "orbits", "ridges", "dots"] as const

export const styleOf = (seed: string) => ORDER[hash(seed) % ORDER.length]

export function drawCover(canvas: HTMLCanvasElement, seed: string, t = 0) {
  const dpr = Math.min(devicePixelRatio || 1, 2), w = canvas.clientWidth, h = canvas.clientHeight
  if (!w || !h) return
  if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr) }
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const H = hash(seed), R = rng(H), s = (H % 1000) / 100
  ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h)
  STYLES[ORDER[H % ORDER.length]](ctx, w, h, R, s, t)
  // vignette
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75)
  v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.55)")
  ctx.fillStyle = v; ctx.fillRect(0, 0, w, h)
}
