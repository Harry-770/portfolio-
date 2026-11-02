import Image from "next/image"
import Link from "next/link"
import { PAGES } from "@/content/site"
import { ScrambleText } from "@/components/scramble-text"

/** The big serif title that opens every inner page, with an optional wide photo that unmasks below it. */
export function PageHead({ title, image, children }: { title: React.ReactNode; image?: { src: string; alt: string; focus?: string }; children?: React.ReactNode }) {
  return (
    <>
      <div className="wrap flex min-h-[62svh] flex-col justify-end pt-[clamp(150px,20vh,220px)] pb-2">
        <h1 data-split className="max-w-[14ch] font-display font-extrabold tracking-[-0.03em] [word-spacing:0.08em] text-page leading-[0.98]">{title}</h1>
        {children && <div data-reveal className="mt-6 grid max-w-[36rem] gap-4 text-[1.1875rem] leading-relaxed text-muted-foreground">{children}</div>}
      </div>
      {image && (
        <div className="wrap mt-[clamp(40px,5vw,64px)]">
          <div data-reveal-clip className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line sm:aspect-[21/9]">
            <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1240px) 100vw, 1180px" className="object-cover" style={{ objectPosition: image.focus }} />
          </div>
        </div>
      )}
    </>
  )
}

/** "Next page" at the bottom of each inner page. */
export function NextPage({ current }: { current: (typeof PAGES)[number]["key"] }) {
  const i = PAGES.findIndex((p) => p.key === current)
  const next = PAGES[(i + 1) % PAGES.length]
  return (
    <div className="wrap section-space pb-6">
      <Link href={next.href} className="group flex flex-col gap-1.5 border-t border-line py-10">
        <small className="text-[0.8125rem] text-dim">Next page</small>
        <span className="font-display font-extrabold tracking-[-0.03em] [word-spacing:0.08em] text-[clamp(2.5rem,1.4rem+3.6vw,4.5rem)] leading-none transition-colors group-hover:text-electric-soft"><ScrambleText text={next.label} /></span>
      </Link>
    </div>
  )
}
