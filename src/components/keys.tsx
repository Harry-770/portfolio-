"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { PAGES, site } from "@/content/site"

const OPEN_EVENT = "keys:open"

export async function copyEmail() {
  try { await navigator.clipboard.writeText(site.email); toast("Email copied") } catch { toast(site.email) }
}

// The footer's "Keyboard shortcuts" link
export function KeysButton() {
  return (
    <button className="text-left text-muted-foreground transition-colors hover:text-foreground" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Keyboard shortcuts
    </button>
  )
}

const SHORTCUTS: [React.ReactNode, string][] = [
  [<><kbd>←</kbd> <kbd>→</kbd></>, "Previous or next page"],
  [<><kbd>1</kbd> to <kbd>6</kbd></>, "Jump to a page"],
  [<kbd key="e">E</kbd>, "Copy my email"],
  [<kbd key="q">?</kbd>, "Show or hide this list"],
  [<kbd key="esc">Esc</kbd>, "Close things"],
]

// Global keyboard shortcuts + the list that explains them
export function Keys() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      // a widget that used the key (the carousel, the tabs) has already called preventDefault
      if (e.defaultPrevented || t.closest("input, textarea, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return
      if (document.querySelector("[role=dialog]:not([aria-label='Keyboard shortcuts'])")) return
      const i = Math.max(0, PAGES.findIndex((p) => p.href === pathname || (p.href !== "/" && pathname.startsWith(p.href))))
      if (e.key === "?") setOpen((o) => !o)
      else if (e.key.toLowerCase() === "e") copyEmail()
      else if (e.key === "ArrowRight") router.push(PAGES[(i + 1) % PAGES.length].href)
      else if (e.key === "ArrowLeft") router.push(PAGES[(i - 1 + PAGES.length) % PAGES.length].href)
      else if (/^[1-6]$/.test(e.key)) router.push(PAGES[Number(e.key) - 1].href)
    }
    addEventListener(OPEN_EVENT, onOpen)
    addEventListener("keydown", onKey)
    return () => { removeEventListener(OPEN_EVENT, onOpen); removeEventListener("keydown", onKey) }
  }, [router, pathname])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-label="Keyboard shortcuts" className="rounded-3xl border-line-2 bg-surface p-8 sm:max-w-[460px]">
        <DialogTitle className="font-display font-bold tracking-[-0.025em] [word-spacing:0.06em] text-[1.75rem]">Keyboard shortcuts</DialogTitle>
        <ul className="grid gap-3 text-[0.9375rem] text-ink-2 [&_kbd]:inline-block [&_kbd]:min-w-[1.9em] [&_kbd]:rounded-md [&_kbd]:bg-surface-3 [&_kbd]:px-2 [&_kbd]:py-0.5 [&_kbd]:text-center [&_kbd]:text-[0.8125rem] [&_kbd]:font-medium">
          {SHORTCUTS.map(([k, label]) => (
            <li key={label} className="grid grid-cols-[8.5rem_1fr] items-baseline gap-3"><span>{k}</span>{label}</li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
