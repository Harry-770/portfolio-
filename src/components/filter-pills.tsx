"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/**
 * Category pills that keep the active filter in the URL (?type=3D), so a filtered view can be
 * shared and survives the back button (Vercel web interface guidelines: state belongs in the URL).
 */
export function useFilter(param: string) {
  const sp = useSearchParams()
  return sp.get(param) ?? "All"
}

export function FilterPills({ param, options, label }: { param: string; options: string[]; label: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const value = sp.get(param) ?? "All"

  const set = (v: string) => {
    if (!v) return
    const next = new URLSearchParams(sp.toString())
    if (v === "All") next.delete(param); else next.set(param, v)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <ToggleGroup type="single" value={value} onValueChange={set} aria-label={label} className="flex flex-wrap gap-2" spacing={2}>
      {["All", ...options].map((o) => (
        <ToggleGroupItem
          key={o}
          value={o}
          className="h-11 rounded-full border border-line bg-surface-2 px-4 text-sm text-muted-foreground hover:bg-surface-3 hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          {o}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
