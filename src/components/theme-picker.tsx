"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Palette } from "lucide-react"
import { cn } from "@/lib/utils"

/** The accent themes; the colours themselves live in globals.css (:root[data-accent=…]). */
export const ACCENTS = [
  { key: "electric", label: "Electric", swatch: "#0019ff" },
  { key: "violet", label: "Violet", swatch: "#6d3cff" },
  { key: "emerald", label: "Emerald", swatch: "#059669" },
  { key: "sunset", label: "Sunset", swatch: "#e5481c" },
] as const
type Accent = (typeof ACCENTS)[number]["key"]
const STORE = "accent"
const EVENT = "accentchange"

/** Runs in <head> before the page paints, so a saved theme never flashes the default blue first. */
export const ACCENT_BOOT = `try{var a=localStorage.getItem("${STORE}");if(a&&a!=="electric")document.documentElement.dataset.accent=a}catch(e){}`

function current(): Accent {
  return (document.documentElement.dataset.accent as Accent | undefined) ?? "electric"
}
function subscribe(cb: () => void) {
  addEventListener(EVENT, cb)
  return () => removeEventListener(EVENT, cb)
}
function choose(a: Accent) {
  if (a === "electric") delete document.documentElement.dataset.accent
  else document.documentElement.dataset.accent = a
  try { localStorage.setItem(STORE, a) } catch {}
  dispatchEvent(new Event(EVENT))
}

/** The four swatches as a radio group (used inside the popover and in the mobile menu). */
export function AccentSwatches({ className }: { className?: string }) {
  const accent = useSyncExternalStore(subscribe, current, () => "electric" as Accent)
  return (
    <div role="radiogroup" aria-label="Accent colour" className={cn("flex items-center gap-2", className)}>
      {ACCENTS.map((a) => (
        <button
          key={a.key}
          role="radio"
          aria-checked={accent === a.key}
          aria-label={a.label}
          title={a.label}
          onClick={() => choose(a.key)}
          className="grid size-9 place-items-center rounded-full border border-line-2 transition-[border-color,transform] hover:scale-110 aria-checked:border-ink"
        >
          <span className="size-5 rounded-full" style={{ background: a.swatch, boxShadow: `0 0 14px -2px ${a.swatch}` }} />
        </button>
      ))}
    </div>
  )
}

/** A palette button in the nav that opens the swatches. Escape or a click outside closes it. */
export function ThemePicker() {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    addEventListener("pointerdown", onDown)
    addEventListener("keydown", onKey)
    return () => { removeEventListener("pointerdown", onDown); removeEventListener("keydown", onKey) }
  }, [open])

  return (
    <div ref={box} className="relative">
      <button
        aria-label="Change accent colour"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid size-11 place-items-center rounded-full border border-line-2 bg-surface-2 text-muted-foreground transition-colors hover:border-electric-soft hover:text-foreground"
      >
        <Palette className="size-[18px]" />
      </button>
      {open && (
        <div className="absolute top-[calc(100%+10px)] right-0 z-50 grid gap-3 rounded-2xl border border-line-2 bg-surface p-4 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)]">
          <p className="text-[0.8125rem] whitespace-nowrap text-dim">Accent colour</p>
          <AccentSwatches />
        </div>
      )}
    </div>
  )
}
