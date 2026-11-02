"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { PAGES, fullName } from "@/content/site"
import { cn } from "@/lib/utils"
import { ScrambleText } from "@/components/scramble-text"
import { ThemePicker, AccentSwatches } from "@/components/theme-picker"

const LINKS = PAGES.filter((p) => ["work", "about", "skills", "journal"].includes(p.key))

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")
}

export function Nav() {
  const pathname = usePathname()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(scrollY > 24)
    onScroll()
    addEventListener("scroll", onScroll, { passive: true })
    return () => removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color] duration-300",
        solid && "border-line bg-background/85 backdrop-blur-md",
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="wrap grid h-16 grid-cols-[1fr_auto] items-center md:h-[72px] md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="justify-self-start text-[1.0625rem] font-semibold tracking-tight" translate="no">
          {fullName}
        </Link>

        <nav aria-label="Main" className="hidden gap-8 text-[0.9375rem] md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
              className="text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"
            >
              <ScrambleText text={l.label} />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 justify-self-end md:flex">
          <ThemePicker />
          <Button asChild variant="outline">
            <Link href="/contact">
              <ScrambleText text="Let's talk" /> <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="justify-self-end md:hidden" aria-label="Open menu">Menu</Button>
          </SheetTrigger>
          <SheetContent side="top" className="h-dvh border-none bg-background px-6 pt-24">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {PAGES.map((l) => (
                <SheetClose asChild key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(pathname, l.href) ? "page" : undefined}
                    className="font-display font-bold tracking-[-0.025em] [word-spacing:0.06em] text-[clamp(2.25rem,9vw,3.25rem)] leading-[1.2] text-muted-foreground aria-[current=page]:text-electric-soft"
                  >
                    {l.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-10 grid gap-3">
              <p className="text-sm text-dim">Accent colour</p>
              <AccentSwatches />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
