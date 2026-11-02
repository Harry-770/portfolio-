// =====================================================================
//  DIAGRAMS — real-estate drawings for the Work cards and the Journal:
//  a 2 BHK floor plan, a township masterplan, a buyer journey and a tower
//  stacking plan. Plain SVG in the site's blueprint palette, 4:3 so they
//  sit where a project video would. Solid lines marked data-draw are drawn
//  in and everything marked data-fade (labels, fills, and dashed lines, whose
//  dash pattern drawing would replace) fades up as the diagram scrolls into
//  view (motion.tsx, [data-diagram]); without motion they're simply there.
//  No ids inside, so the same diagram can appear twice on one page.
// =====================================================================

const C = {
  bg: "#060a1c",
  grid: "color-mix(in srgb, var(--electric-soft) 7%, transparent)",
  line: "var(--electric-soft)",
  wall: "#f5f7ff",
  text: "#d6dbf0",
  dim: "#8c93b0",
  blue: "var(--electric-hover)",
  soft: "color-mix(in srgb, var(--electric-hover) 16%, transparent)",
  road: "#0e1433",
}

export type DiagramName = "floorplan" | "masterplan" | "journey" | "stacking"

type Props = { className?: string }

function Frame({ label, className, children }: Props & { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 800 600" role="img" aria-label={label} data-diagram className={className} fontFamily="var(--font-sans, system-ui)">
      <title>{label}</title>
      <rect width="800" height="600" fill={C.bg} />
      {/* blueprint grid */}
      {Array.from({ length: 21 }, (_, i) => <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="600" stroke={C.grid} />)}
      {Array.from({ length: 16 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke={C.grid} />)}
      {children}
    </svg>
  )
}

function Label({ x, y, title, sub, size = 15, anchor = "middle" }: { x: number; y: number; title: string; sub?: string; size?: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <g data-fade textAnchor={anchor}>
      <text x={x} y={y} fill={C.text} fontSize={size} fontWeight="600">{title}</text>
      {sub && <text x={x} y={y + size + 4} fill={C.dim} fontSize={size - 3}>{sub}</text>}
    </g>
  )
}

/* ---------- 1. a 2 BHK apartment floor plan ---------- */
export function FloorPlan({ className }: Props) {
  const wall = { stroke: C.wall, fill: "none", strokeLinecap: "square" as const }
  const door = { stroke: C.line, strokeWidth: 1.5, fill: "none" }
  return (
    <Frame label="Floor plan of a 2 BHK apartment, type B, 742 square feet carpet area" className={className}>
      <g data-fade>
        <text x="80" y="26" fill={C.dim} fontSize="13" letterSpacing="0.04em">TYPE B · 2 BHK · 742 SQ FT CARPET</text>
        {/* north arrow */}
        <circle cx="742" cy="22" r="13" fill="none" stroke={C.line} strokeWidth="1.2" />
        <path d="M742 12 L747 26 L742 23 L737 26 Z" fill={C.line} />
        <text x="760" y="27" fill={C.dim} fontSize="12">N</text>
      </g>
      {/* rooms that matter, tinted */}
      <rect data-fade x="83" y="73" width="334" height="254" fill={C.soft} />
      <rect data-fade x="423" y="293" width="294" height="234" fill="color-mix(in srgb, var(--electric-hover) 10%, transparent)" />
      {/* balcony */}
      <rect data-fade x="80" y="533" width="340" height="44" fill="color-mix(in srgb, var(--electric-soft) 5%, transparent)" stroke={C.line} strokeDasharray="6 6" />
      {/* walls: outer, then inner */}
      <rect data-draw x="80" y="70" width="640" height="460" {...wall} strokeWidth="6" />
      <path data-draw d="M420 70 V530 M580 70 V230 M420 230 H720 M420 290 H720 M80 330 H420 M300 330 V530 M300 450 H420" {...wall} strokeWidth="3" />
      {/* windows */}
      {[[150, 66, 180, 8], [470, 66, 80, 8], [716, 340, 8, 140], [76, 380, 8, 110], [620, 66, 60, 8]].map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} data-fade x={x} y={y} width={w} height={h} fill={C.bg} stroke={C.line} strokeWidth="1.5" />
      ))}
      {/* doors: leaf + swing */}
      <path data-draw d="M440 290 L440 240 A50 50 0 0 1 490 290" {...door} />
      <path data-draw d="M240 330 L240 380 A50 50 0 0 1 290 330" {...door} />
      <path data-draw d="M300 360 L340 360 A40 40 0 0 1 300 400" {...door} />
      <path data-draw d="M600 230 L600 270 A40 40 0 0 0 640 230" {...door} />
      <path data-draw d="M330 530 L330 480 A50 50 0 0 1 380 530" {...door} strokeWidth="2" />
      {/* dimension lines */}
      <path data-draw d="M80 52 H720 M80 46 V58 M720 46 V58 M762 70 V530 M756 70 H768 M756 530 H768" stroke={C.dim} strokeWidth="1" fill="none" />
      <g data-fade>
        <rect x="370" y="43" width="60" height="18" fill={C.bg} />
        <text x="400" y="57" fill={C.dim} fontSize="13" textAnchor="middle">10.6 m</text>
        <text x="782" y="305" fill={C.dim} fontSize="13" textAnchor="middle" transform="rotate(90 782 305)">7.6 m</text>
      </g>
      <Label x={250} y={190} title="Living & dining" sub="5.6 × 4.2 m" size={17} />
      <Label x={500} y={145} title="Kitchen" sub="2.6 × 2.6 m" />
      <Label x={650} y={150} title="Bath" sub="2.0 × 2.6 m" size={14} />
      <Label x={575} y={405} title="Bedroom 1" sub="4.8 × 3.9 m" size={17} />
      <Label x={190} y={425} title="Bedroom 2" sub="3.6 × 3.2 m" />
      <Label x={360} y={410} title="Bath" size={14} />
      <Label x={360} y={474} title="Entry" size={13} />
      <Label x={250} y={560} title="Balcony · 5.6 × 0.9 m" size={13} />
    </Frame>
  )
}

/* ---------- 2. a township masterplan with plot availability ---------- */
const plotState = (n: number) => { const k = (n * 7) % 10; return k < 4 ? "booked" : k < 6 ? "hold" : "open" }
const PLOT_FILL = { booked: C.blue, hold: "rgb(245 247 255 / 0.28)", open: "color-mix(in srgb, var(--electric-hover) 10%, transparent)" } as const

export function Masterplan({ className }: Props) {
  // three blocks of plots (two rows of five each); the fourth corner is the park and clubhouse
  const blocks = [[40, 48], [420, 48], [40, 300]] as const
  let n = 0
  const plots = blocks.flatMap(([bx, by]) =>
    [0, 1].flatMap((row) => Array.from({ length: 5 }, (_, col) => ({ n: ++n, x: bx + 14 + col * 66, y: by + row * 100, w: 60, h: 92 }))))
  const pick = plots[17]
  const counts = plots.reduce((c, p) => ({ ...c, [plotState(p.n)]: (c[plotState(p.n)] ?? 0) + 1 }), {} as Record<string, number>)
  return (
    <Frame label={`Township masterplan, phase 1: ${plots.length} plots, ${counts.booked} booked, ${counts.hold} on hold, ${counts.open} available, with a park and clubhouse`} className={className}>
      {/* roads */}
      <g data-fade>
        <rect x="380" y="20" width="40" height="530" fill={C.road} />
        <rect x="20" y="262" width="760" height="30" fill={C.road} />
        <path d="M400 30 V540 M30 277 H770" stroke="color-mix(in srgb, var(--electric-soft) 35%, transparent)" strokeDasharray="10 10" />
      </g>
      {/* plots */}
      {plots.map((p) => {
        const s = plotState(p.n)
        return (
          <g key={p.n}>
            <rect data-draw x={p.x} y={p.y} width={p.w} height={p.h} rx="3" fill="none" stroke={p === pick ? C.wall : C.line} strokeWidth={p === pick ? 2.5 : 1.2} />
            <rect data-fade x={p.x + 1} y={p.y + 1} width={p.w - 2} height={p.h - 2} rx="2" fill={PLOT_FILL[s]} />
            <text data-fade x={p.x + p.w / 2} y={p.y + p.h / 2 + 5} fill={s === "booked" ? "#fff" : C.text} fontSize="14" fontWeight="600" textAnchor="middle">{p.n}</text>
          </g>
        )
      })}
      {/* park and clubhouse */}
      <circle data-draw cx="555" cy="452" r="72" fill="none" stroke={C.line} strokeWidth="1.5" />
      <circle data-fade cx="555" cy="452" r="70" fill="color-mix(in srgb, var(--ok) 12%, transparent)" />
      <rect data-draw x="668" y="318" width="96" height="70" rx="4" fill="none" stroke={C.line} strokeWidth="1.5" />
      <Label x={555} y={450} title="Central park" sub="1.2 acres" />
      <Label x={716} y={350} title="Clubhouse" size={13} />
      {/* the plot a buyer is looking at */}
      <g data-fade>
        <path d={`M${pick.x + pick.w / 2} ${pick.y + pick.h} L${pick.x + pick.w / 2} 304`} stroke={C.wall} strokeWidth="1.5" />
        <circle cx={pick.x + pick.w / 2} cy={pick.y + pick.h} r="3.5" fill={C.wall} />
        <rect x="436" y="304" width="200" height="50" rx="8" fill={C.wall} />
        <text x="450" y="325" fill="#0b0d14" fontSize="14" fontWeight="700">Plot {pick.n} · 1,500 sq ft</text>
        <text x="450" y="343" fill="#4b5168" fontSize="12">East facing · 30 ft road</text>
      </g>
      {/* gate and legend */}
      <g data-fade>
        <path d="M400 590 V556 M392 566 L400 556 L408 566" stroke={C.wall} strokeWidth="2" fill="none" />
        <text x="418" y="584" fill={C.dim} fontSize="12">Main gate</text>
        {([["booked", "Booked"], ["hold", "On hold"], ["open", "Available"]] as const).map(([k, l], i) => (
          <g key={k}>
            <rect x={40 + i * 110} y="566" width="14" height="14" rx="2" fill={PLOT_FILL[k]} stroke={C.line} />
            <text x={60 + i * 110} y="578" fill={C.dim} fontSize="12">{l} · {counts[k]}</text>
          </g>
        ))}
      </g>
    </Frame>
  )
}

/* ---------- 3. the buyer journey, from search to agreement ---------- */
const STEPS = [
  { t: "Search", need: ["Price, location,", "possession date"], made: ["Filters that match", "the brochure"] },
  { t: "Shortlist", need: ["Floor plans,", "carpet area"], made: ["Compare three", "units side by side"] },
  { t: "Site visit", need: ["A time slot,", "directions"], made: ["Two-tap slot", "booking + map"] },
  { t: "Token", need: ["Safe payment,", "refund terms"], made: ["UPI token with", "terms up front"] },
  { t: "Agreement", need: ["Documents,", "RERA number"], made: ["Doc checklist", "and e-sign"] },
]

export function BuyerJourney({ className }: Props) {
  return (
    <Frame label="Buyer journey in five steps: search, shortlist, site visit, token booking and agreement, with what buyers need and what was designed at each step" className={className}>
      <g data-fade>
        <text x="40" y="44" fill={C.dim} fontSize="13" letterSpacing="0.04em">THE BUYER JOURNEY</text>
        <text x="40" y="250" fill={C.dim} fontSize="12" letterSpacing="0.04em">WHAT BUYERS NEED</text>
        <text x="40" y="410" fill={C.dim} fontSize="12" letterSpacing="0.04em">WHAT WE DESIGNED</text>
      </g>
      {/* "not this one": back from site visit to shortlist */}
      <path data-fade d="M412 112 C412 66 258 66 258 112" stroke={C.line} strokeDasharray="5 6" strokeWidth="1.4" fill="none" />
      <path data-fade d="M252 104 L258 114 L264 104" stroke={C.line} strokeWidth="1.4" fill="none" />
      <text data-fade x="335" y="60" fill={C.dim} fontSize="12" textAnchor="middle">not this one</text>
      {STEPS.map((s, i) => {
        const x = 40 + i * 148
        return (
          <g key={s.t}>
            <rect data-draw x={x} y="118" width="124" height="86" rx="14" fill="none" stroke={i === 3 ? C.wall : C.line} strokeWidth={i === 3 ? 2 : 1.4} />
            <rect data-fade x={x + 1} y="119" width="122" height="84" rx="13" fill={i === 3 ? "color-mix(in srgb, var(--electric-hover) 30%, transparent)" : C.soft} />
            <circle data-fade cx={x + 22} cy="142" r="11" fill={C.blue} />
            <text data-fade x={x + 22} y="147" fill="#fff" fontSize="12" fontWeight="700" textAnchor="middle">{i + 1}</text>
            <text data-fade x={x + 16} y="186" fill={C.text} fontSize="16" fontWeight="600">{s.t}</text>
            {i < STEPS.length - 1 && <path data-draw d={`M${x + 128} 161 H${x + 144} M${x + 138} 155 L${x + 144} 161 L${x + 138} 167`} stroke={C.line} strokeWidth="1.6" fill="none" />}
            {/* needs and answers */}
            <line data-fade x1={x + 62} y1="336" x2={x + 62} y2="418" stroke="color-mix(in srgb, var(--electric-soft) 30%, transparent)" strokeDasharray="3 5" />
            <rect data-draw x={x} y="262" width="124" height="70" rx="10" fill="none" stroke="color-mix(in srgb, var(--electric-soft) 35%, transparent)" />
            <text data-fade x={x + 12} y="292" fill={C.text} fontSize="13">{s.need[0]}</text>
            <text data-fade x={x + 12} y="311" fill={C.text} fontSize="13">{s.need[1]}</text>
            <rect data-fade x={x} y="422" width="124" height="70" rx="10" fill={C.wall} />
            <text data-fade x={x + 12} y="452" fill="#0b0d14" fontSize="13" fontWeight="600">{s.made[0]}</text>
            <text data-fade x={x + 12} y="471" fill="#0b0d14" fontSize="13" fontWeight="600">{s.made[1]}</text>
          </g>
        )
      })}
      <g data-fade>
        <text x="40" y="545" fill={C.dim} fontSize="13">Most buyers drop off between step 2 and 3, so the site visit got the most design time.</text>
      </g>
    </Frame>
  )
}

/* ---------- 4. a tower stacking plan (floors × units, by sales status) ---------- */
const unitState = (floor: number, unit: number) => { const k = (floor * 3 + unit * 5) % 7; return k < 4 ? "booked" : k < 5 ? "hold" : "open" }

export function StackingPlan({ className }: Props) {
  const floors = 12, units = ["A", "B", "C", "D"]
  const types = ["2 BHK", "3 BHK", "3 BHK", "2 BHK"]
  const cells = Array.from({ length: floors }, (_, f) => units.map((u, ui) => ({ f: floors - f, u, s: unitState(floors - f, ui), x: 150 + ui * 112, y: 62 + f * 38 }))).flat()
  const count = (s: string) => cells.filter((c) => c.s === s).length
  return (
    <Frame label={`Stacking plan for tower B: ${floors} floors of 4 units, ${count("booked")} booked, ${count("hold")} on hold, ${count("open")} available`} className={className}>
      <g data-fade>
        <text x="150" y="26" fill={C.dim} fontSize="13" letterSpacing="0.04em">TOWER B · STACKING PLAN</text>
        {units.map((u, i) => (
          <text key={u} x={150 + i * 112 + 52} y="52" fill={C.text} fontSize="13" fontWeight="600" textAnchor="middle">{u} <tspan fill={C.dim} fontWeight="400">· {types[i]}</tspan></text>
        ))}
      </g>
      {cells.map((c) => (
        <g key={`${c.f}${c.u}`}>
          <rect data-draw x={c.x} y={c.y} width="104" height="32" rx="5" fill="none" stroke={C.line} strokeWidth="1.1" />
          <rect data-fade x={c.x + 1} y={c.y + 1} width="102" height="30" rx="4" fill={PLOT_FILL[c.s as keyof typeof PLOT_FILL]} />
          <text data-fade x={c.x + 52} y={c.y + 21} fill={c.s === "booked" ? "#fff" : C.text} fontSize="12" textAnchor="middle">{c.f}{c.u}</text>
        </g>
      ))}
      <g data-fade textAnchor="end">
        {Array.from({ length: floors }, (_, f) => <text key={f} x="136" y={62 + f * 38 + 21} fill={C.dim} fontSize="12">{`Floor ${floors - f}`}</text>)}
      </g>
      {/* podium */}
      <rect data-fade x="150" y="522" width="440" height="40" rx="5" fill="none" stroke={C.dim} strokeWidth="1.1" strokeDasharray="5 5" />
      <text data-fade x="370" y="547" fill={C.dim} fontSize="12" textAnchor="middle">Podium · parking · lobby</text>
      {/* legend and totals */}
      <g data-fade>
        {([["booked", "Booked"], ["hold", "On hold"], ["open", "Available"]] as const).map(([k, l], i) => (
          <g key={k}>
            <rect x="630" y={80 + i * 30} width="16" height="16" rx="3" fill={PLOT_FILL[k]} stroke={C.line} />
            <text x="656" y={93 + i * 30} fill={C.text} fontSize="13">{l}</text>
            <text x="770" y={93 + i * 30} fill={C.dim} fontSize="13" textAnchor="end">{count(k)}</text>
          </g>
        ))}
        <line x1="630" y1="178" x2="770" y2="178" stroke="color-mix(in srgb, var(--electric-soft) 25%, transparent)" />
        <text x="630" y="200" fill={C.text} fontSize="13" fontWeight="600">{cells.length} units</text>
        <text x="630" y="220" fill={C.dim} fontSize="12">{Math.round((count("booked") / cells.length) * 100)}% sold</text>
      </g>
    </Frame>
  )
}

const DIAGRAMS: Record<DiagramName, (p: Props) => React.JSX.Element> = {
  floorplan: FloorPlan,
  masterplan: Masterplan,
  journey: BuyerJourney,
  stacking: StackingPlan,
}

export function Diagram({ name, className }: { name: DiagramName; className?: string }) {
  const D = DIAGRAMS[name]
  return <D className={className} />
}
