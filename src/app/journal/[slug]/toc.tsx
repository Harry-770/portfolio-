"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useLenis } from "lenis/react"

type Heading = { id: string; label: string }

/**
 * The contents list beside an article. The headings come from the post's meta, so the list is in
 * the prerendered HTML; in the browser it highlights the heading you're reading.
 */
export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState("")
  const lenis = useLenis()

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver((es) => {
      const seen = es.filter((e) => e.isIntersecting).map((e) => e.target.id)
      if (seen.length) setActive(seen[0])
    }, { rootMargin: "0px 0px -60% 0px" })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [headings])

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -112 }); else el.scrollIntoView({ behavior: "smooth" })
    history.replaceState(null, "", `#${id}`)
  }
  const copyLink = async () => {
    const url = location.href.split("#")[0]
    try { await navigator.clipboard.writeText(url); toast("Link copied") } catch { toast(url) }
  }

  return (
    <aside className="sticky top-[104px] grid gap-2.5 self-start text-sm max-md:static">
      {headings.length > 0 ? (
        <nav aria-label="Contents" className="grid justify-items-start gap-1.5">
          <h2 className="text-[0.8125rem] font-medium text-dim">Contents</h2>
          {headings.map((h) => (
            <a key={h.id} href={`#${h.id}`} onClick={(e) => { e.preventDefault(); go(h.id) }} aria-current={active === h.id ? "true" : undefined}
              className="text-muted-foreground transition-colors hover:text-foreground aria-[current=true]:text-foreground">
              {h.label}
            </a>
          ))}
        </nav>
      ) : null}
      <button onClick={copyLink} className="justify-self-start text-muted-foreground underline underline-offset-4 hover:text-foreground">Copy link</button>
    </aside>
  )
}
