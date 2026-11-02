import { LogoTile, T, type Tech } from "@/components/tech-logos"

// =====================================================================
//  TOOLKIT — "where the icons go". On desktop the section holds still
//  (CSS sticky) for a couple of screens while the logo tiles fly in from
//  all over and settle into their slots in the panel, one workflow per row;
//  each group's note lights up as its tiles land (motion.tsx, data-kit-*).
//  The markup IS the finished state: phones and reduced motion see it as is.
// =====================================================================

type Group = { name: string; line: string; tools: { tech: Tech; note: string }[] }

const GROUPS: Group[] = [
  {
    name: "Design",
    line: "UI and UX, from sketch to system.",
    tools: [
      { tech: T.figma, note: "Flows, wireframes, prototypes and the design system." },
      { tech: T.illustrator, note: "Icons, illustrations and brand marks, crisp at any size." },
      { tech: T.photoshop, note: "Retouching, compositing and every image a design needs." },
      { tech: T.framer, note: "Interactive prototypes that feel real before they're built." },
    ],
  },
  {
    name: "Photo & video",
    line: "Shoot, edit, grade.",
    tools: [
      { tech: T.lightroom, note: "Editing and colour for whole photo shoots." },
      { tech: T.premiere, note: "Cutting films, reels and product videos." },
      { tech: T.aftereffects, note: "Motion graphics, titles and UI animation." },
      { tech: T.davinci, note: "Colour grading for film work." },
    ],
  },
  {
    name: "3D & motion",
    line: "Depth and movement.",
    tools: [
      { tech: T.blender, note: "3D models, product renders and scenes." },
      { tech: T.unity, note: "Real-time 3D and interactive experiences." },
      { tech: T.gsap, note: "Web animation and scroll stories, like this one." },
      { tech: T.three, note: "3D right in the browser." },
    ],
  },
  {
    name: "Build",
    line: "Designs that ship.",
    tools: [
      { tech: T.html, note: "Semantic structure, so it works for everyone." },
      { tech: T.tailwind, note: "Design tokens straight into code, no drift from the mockup." },
      { tech: T.react, note: "Interfaces as reusable components." },
      { tech: T.next, note: "Fast pages, shipped to the web." },
    ],
  },
]

export const TOOL_COUNT = GROUPS.reduce((n, g) => n + g.tools.length, 0)

const COUNT = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen"]

export function Toolkit() {
  const tiles = GROUPS.flatMap((g, gi) => g.tools.map((t) => ({ ...t, group: gi })))
  const n = COUNT[tiles.length] ?? String(tiles.length)
  return (
    <section aria-labelledby="toolkitTitle" data-toolkit className="relative md:h-[250svh]">
      <div className="wrap section-space md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:pt-20">
        <div className="mb-8 grid items-end gap-x-12 gap-y-6 md:grid-cols-[1fr_minmax(0,400px)]">
          <h2 id="toolkitTitle" className="display-title" data-split>The toolkit</h2>
          <p data-reveal className="text-[1.1875rem] leading-[1.45] text-muted-foreground md:text-right">
            {n[0].toUpperCase() + n.slice(1)} tools, one workflow: from the first sketch and the shoot to the shipped page.
          </p>
        </div>

        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-12">
          {/* the container the icons settle into: one workflow per row */}
          <div
            data-kit-panel
            className="panel relative overflow-hidden p-[clamp(18px,2.4vw,32px)] [background-image:radial-gradient(rgb(170_185_255/0.08)_1px,transparent_1px)] [background-size:22px_22px]"
          >
            <div className="mb-5 flex items-center justify-between text-[0.8125rem] text-dim">
              <span>toolkit.fig</span>
              <span>{tiles.length} tools · {GROUPS.length} workflows</span>
            </div>
            <ul className="grid grid-cols-4 gap-x-[clamp(10px,1.6vw,20px)] gap-y-[clamp(12px,1.6vw,18px)]">
              {tiles.map(({ tech, group }) => (
                <li key={tech.title} className="grid justify-items-center gap-2">
                  <span data-kit-tile data-group={group} className="block">
                    <LogoTile tech={tech} className="size-[clamp(48px,4.6vw,72px)]" />
                  </span>
                  <span className="text-center text-[0.8125rem] leading-tight text-muted-foreground">{tech.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* what each one is for */}
          <div className="grid gap-5">
            {GROUPS.map((g, gi) => (
              <div key={g.name} data-kit-row={gi} className="border-t border-line pt-4">
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <h3 className="text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] font-medium">{g.name}</h3>
                  <p className="text-sm text-dim">{g.line}</p>
                </div>
                <ul className="grid gap-1 text-sm">
                  {g.tools.map(({ tech, note }) => (
                    <li key={tech.title} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3">
                      <span className="text-ink">{tech.title}</span>
                      <span className="text-muted-foreground">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
