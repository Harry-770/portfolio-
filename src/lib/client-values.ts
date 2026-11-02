"use client"

import { useSyncExternalStore } from "react"
import { liveStatus, localTime } from "@/lib/live"

/**
 * Values that only exist in the browser (media queries, the visitor's clock).
 * useSyncExternalStore gives the prerendered HTML a fixed server value and switches to the
 * real one during hydration, without a setState-in-effect re-render.
 */

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia(query)
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    },
    () => matchMedia(query).matches,
    () => serverValue,
  )
}

// one shared 30-second clock for every live line on the page
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined
function subscribeClock(onChange: () => void) {
  listeners.add(onChange)
  timer ??= setInterval(() => listeners.forEach((l) => l()), 30_000)
  return () => {
    listeners.delete(onChange)
    if (!listeners.size && timer) { clearInterval(timer); timer = undefined }
  }
}

export function useLiveStatus() {
  return useSyncExternalStore(subscribeClock, () => liveStatus(), () => "")
}
export function useLocalTime() {
  return useSyncExternalStore(subscribeClock, () => localTime(), () => "")
}
export function useYear() {
  return useSyncExternalStore(subscribeClock, () => new Date().getFullYear(), () => null)
}
