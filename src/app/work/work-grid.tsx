"use client"

import { FilterPills, useFilter } from "@/components/filter-pills"
import { ProjectCard } from "@/components/project-card"
import { site } from "@/content/site"
import { Motion } from "@/components/motion"

const CATEGORIES = [...new Set(site.projects.map((p) => p.category))]

export function WorkGrid() {
  const type = useFilter("type")
  const shown = site.projects.filter((p) => type === "All" || p.category === type)
  return (
    <>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 text-sm">
        <FilterPills param="type" options={CATEGORIES} label="Filter projects" />
        <span className="text-muted-foreground" aria-live="polite">{shown.length} of {site.projects.length} projects</span>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {shown.map((p) => <ProjectCard key={p.slug} p={p} />)}
      </div>
      {/* inside the Suspense boundary: runs once this list (the last part of the page to hydrate) is live */}
      <Motion />
    </>
  )
}

/** What shows before the URL's filter is read: every project, unfiltered. */
export function WorkGridFallback() {
  return (
    <div className="grid gap-5 pt-[72px] md:grid-cols-2">
      {site.projects.map((p) => <ProjectCard key={p.slug} p={p} />)}
    </div>
  )
}
