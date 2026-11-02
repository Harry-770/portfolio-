import Image from "next/image"
import { siVercel } from "simple-icons"
import { site } from "@/content/site"

// official marks we can draw (Simple Icons, CC0); anything else uses a logo file or a typeset wordmark
const MARKS = { vercel: siVercel.path }

/** A quiet row of brands and clients, in one colour so no single logo shouts. */
export function WorkedWith() {
  return (
    <section aria-labelledby="workedWith" className="wrap section-space">
      <div className="flex flex-wrap items-center justify-center gap-x-[clamp(40px,7vw,96px)] gap-y-6 border-y border-line py-10">
        <h2 id="workedWith" className="w-full text-center text-[0.8125rem] font-medium text-dim md:w-auto">Worked with</h2>
        {site.clients.map((c) => (
          <span key={c.name} data-reveal-item className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground">
            {c.logo ? (
              <Image src={c.logo} alt={c.name} width={120} height={32} unoptimized className="h-7 w-auto opacity-80 grayscale transition hover:opacity-100" />
            ) : (
              <>
                {c.mark && (
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current"><path d={MARKS[c.mark]} /></svg>
                )}
                <span className="font-display text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] tracking-[-0.03em]">{c.name}</span>
              </>
            )}
          </span>
        ))}
      </div>
    </section>
  )
}
