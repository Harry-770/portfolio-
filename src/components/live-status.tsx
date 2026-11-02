"use client"

import { useLiveStatus, useLocalTime, useYear } from "@/lib/client-values"

// The page is prerendered once, so anything time-based comes from the visitor's clock.

export function LiveStatus({ className, kind = "status" }: { className?: string; kind?: "status" | "time" }) {
  return kind === "time" ? <LocalTime className={className} /> : <Status className={className} />
}

function Status({ className }: { className?: string }) {
  return <span className={className}>{useLiveStatus()}</span>
}

function LocalTime({ className }: { className?: string }) {
  return <span className={className}>{useLocalTime()}</span>
}

export function Year() {
  return <span>{useYear() ?? ""}</span>
}
