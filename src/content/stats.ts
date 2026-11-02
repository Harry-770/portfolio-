import type { Stat } from "@/components/stats"
import { site } from "@/content/site"
import { PLATFORM_COUNT } from "@/components/platforms"
import { TOOL_COUNT } from "@/components/toolkit"

// the numbers row on Home and About; counted from the content, so they stay right as it changes
export const STATS: Stat[] = [
  { value: site.since, label: "Designing since", count: false },
  { value: site.projects.length, label: "Projects in the portfolio" },
  { value: PLATFORM_COUNT, suffix: "+", label: "Platforms I set up" },
  { value: TOOL_COUNT, label: "Tools in the kit" },
]

// the words in the curved marquee
export const DISCIPLINES = ["Product design", "UI/UX", "Design systems", "3D", "Motion", "Photography", "Film"]
