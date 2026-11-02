import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <section className="wrap flex min-h-svh flex-col items-start justify-center gap-6 pt-24">
      <h1 className="font-display font-extrabold tracking-[-0.03em] [word-spacing:0.08em] text-page leading-[0.98]">Lost in space</h1>
      <p className="max-w-[32rem] text-[1.1875rem] text-muted-foreground">That page doesn&apos;t exist, or it moved when the site was rebuilt. The journal and the work are still here.</p>
      <div className="flex flex-wrap gap-3">
        <Button asChild><Link href="/">Back home</Link></Button>
        <Button asChild variant="outline"><Link href="/journal">Read the journal</Link></Button>
      </div>
    </section>
  )
}
