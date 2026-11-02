"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PAGES } from "@/content/site"

/**
 * The old site used hash pages (#about, #post-my-slug). Browsers never send the hash to the server,
 * so those shared links are redirected here, in the browser, to the real URLs.
 */
export function HashRedirect() {
  const router = useRouter()
  useEffect(() => {
    const h = location.hash.slice(1)
    if (!h) return
    if (h.startsWith("post-")) router.replace(`/journal/${h.slice(5)}`)
    else if (h === "home") router.replace("/")
    else if (PAGES.some((p) => p.key === h)) router.replace(`/${h}`)
  }, [router])
  return null
}
