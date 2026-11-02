"use client"

import { useEffect, useRef } from "react"
import { poster } from "@/content/site"

/** A muted loop with a poster frame that only plays while it's on screen (saves battery and data). */
export function LoopVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !document.hidden) { v.muted = true; v.play().catch(() => {}) } else v.pause()
    }, { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return <video ref={ref} src={src} poster={poster(src)} muted loop playsInline preload="metadata" className={className} />
}
