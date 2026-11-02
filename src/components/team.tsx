import { site, type Member } from "@/content/site"
import { SectionHead } from "@/components/section-head"

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()

// each avatar lights from a different corner of the black → navy → electric blue swatch
const LIGHT = ["at 30% 20%", "at 75% 25%", "at 25% 80%", "at 80% 75%"]

function Person({ m, i }: { m: Member; i: number }) {
  return (
    <li data-reveal-item className="panel glow-hover group flex flex-col gap-4 p-3.5 transition-[transform,border-color] duration-500 ease-out-expo hover:-translate-y-[3px] hover:border-line-2 sm:gap-5 sm:p-6">
      <span
        aria-hidden="true"
        className="grid aspect-square w-full place-items-center overflow-hidden rounded-2xl font-display text-[clamp(2.5rem,5vw,3.75rem)] tracking-[-0.04em] text-white"
        style={{ background: `radial-gradient(circle ${LIGHT[i % LIGHT.length]}, var(--electric) 0%, var(--navy) 38%, #000033 68%, #010208 100%)` }}
      >
        <span className="transition-transform duration-700 ease-out-expo group-hover:scale-110">{initials(m.name)}</span>
      </span>
      <div>
        <h3 className="text-[0.9375rem] font-semibold tracking-[-0.02em] sm:text-lg">{m.name}</h3>
        <p className="text-sm text-muted-foreground sm:text-[0.9375rem]">{m.role}</p>
        {m.studio && <p className="mt-1 text-[0.8125rem] text-electric-soft">{m.studio}</p>}
      </div>
    </li>
  )
}

/** The people behind the work. Photos can replace the initials later. */
export function Team({ id = "teamTitle" }: { id?: string }) {
  return (
    <section className="wrap section-space" aria-labelledby={id}>
      <SectionHead id={id} title="The team" intro="A small crew in Nagpur: product design, film and 3D under one roof." />
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {site.team.map((m, i) => <Person key={m.name} m={m} i={i} />)}
      </ul>
    </section>
  )
}
