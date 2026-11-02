"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { useMediaQuery } from "@/lib/client-values"

/**
 * A small disc that follows the pointer and names what a click will do ("View", "Read").
 * Any element with data-cursor="…" sets the label. Fine pointers only.
 * Position goes through gsap.quickTo (one reused tween per axis, gsap-performance skill);
 * the label and state are written straight to the DOM through refs, so pointer movement
 * never re-renders React (vercel-react-best-practices: rerender-use-ref-transient-values).
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)")

  useEffect(() => {
    const el = ref.current, labelEl = labelRef.current
    if (!fine || !el || !labelEl) return
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" })
    const move = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY) }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      const lab = t.closest<HTMLElement>("[data-cursor]")
      labelEl.textContent = lab?.dataset.cursor ?? ""
      el.dataset.state = lab ? "label" : t.closest("a, button, label, input, textarea") ? "hover" : ""
    }
    addEventListener("pointermove", move, { passive: true })
    document.addEventListener("pointerover", over, { passive: true })
    return () => { removeEventListener("pointermove", move); document.removeEventListener("pointerover", over) }
  }, [fine])

  if (!fine) return null
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[95] -mt-1 -ml-1 grid size-2 place-items-center rounded-full bg-ink opacity-0 transition-[width,height,margin,opacity] duration-400 ease-out-expo data-[state=hover]:opacity-50 data-[state=label]:-mt-9 data-[state=label]:-ml-9 data-[state=label]:size-[72px] data-[state=label]:opacity-100"
    >
      <span ref={labelRef} className="text-[0.8125rem] font-medium text-background opacity-0 transition-opacity [[data-state=label]_&]:opacity-100" />
    </div>
  )
}
