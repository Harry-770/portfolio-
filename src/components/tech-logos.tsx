// =====================================================================
//  TECH LOGOS — the tools on the front page: floating tiles around the hero
//  and a scrolling strip below it. Full-colour logos from Devicon (MIT,
//  public/logos, licence alongside); the single-colour marks (GSAP, Three.js,
//  Vercel, Unity, Framer, DaVinci Resolve) come from Simple Icons (CC0).
//  Lightroom is in neither set, so public/logos/lightroom.svg is drawn in the
//  style of the Adobe app icons. The brands stay their
//  owners' trademarks and are shown only to say "I work with this".
//  Rendered on the server; GSAP moves the tiles (see motion.tsx).
// =====================================================================
import Image from "next/image"
import { siDavinciresolve, siFramer, siGsap, siThreedotjs, siUnity, siVercel } from "simple-icons"
import { cn } from "@/lib/utils"

export type Tech = {
  title: string
  glow: string                                  // the brand colour behind the tile
  src?: string                                  // a full-colour SVG in /public/logos
  mark?: { path: string; fill: string }         // or a single-colour Simple Icons path
}

export const T = {
  figma: { title: "Figma", src: "/logos/figma.svg", glow: "#8f6bff" },
  html: { title: "HTML5", src: "/logos/html5.svg", glow: "#e34f26" },
  css: { title: "CSS3", src: "/logos/css3.svg", glow: "#2b6cf0" },
  tailwind: { title: "Tailwind CSS", src: "/logos/tailwindcss.svg", glow: "#38bdf8" },
  react: { title: "React", src: "/logos/react.svg", glow: "#61dafb" },
  next: { title: "Next.js", src: "/logos/nextjs.svg", glow: "#d6d6d6" },
  ts: { title: "TypeScript", src: "/logos/typescript.svg", glow: "#3178c6" },
  js: { title: "JavaScript", src: "/logos/javascript.svg", glow: "#f7df1e" },
  blender: { title: "Blender", src: "/logos/blender.svg", glow: "#ea7600" },
  node: { title: "Node.js", src: "/logos/nodejs.svg", glow: "#5fa04e" },
  supabase: { title: "Supabase", src: "/logos/supabase.svg", glow: "#3ecf8e" },
  git: { title: "Git", src: "/logos/git.svg", glow: "#f05033" },
  three: { title: "Three.js", mark: { path: siThreedotjs.path, fill: "var(--ink)" }, glow: "#d6d6d6" },
  gsap: { title: "GSAP", mark: { path: siGsap.path, fill: `#${siGsap.hex}` }, glow: `#${siGsap.hex}` },
  vercel: { title: "Vercel", mark: { path: siVercel.path, fill: "var(--ink)" }, glow: "#d6d6d6" },
  // design, photo and video
  photoshop: { title: "Photoshop", src: "/logos/photoshop.svg", glow: "#31a8ff" },
  illustrator: { title: "Illustrator", src: "/logos/illustrator.svg", glow: "#ff9a00" },
  lightroom: { title: "Lightroom", src: "/logos/lightroom.svg", glow: "#31a8ff" },
  premiere: { title: "Premiere Pro", src: "/logos/premierepro.svg", glow: "#9999ff" },
  aftereffects: { title: "After Effects", src: "/logos/aftereffects.svg", glow: "#9999ff" },
  xd: { title: "Adobe XD", src: "/logos/xd.svg", glow: "#ff61f6" },
  sketch: { title: "Sketch", src: "/logos/sketch.svg", glow: "#fdb300" },
  canva: { title: "Canva", src: "/logos/canva.svg", glow: "#00c4cc" },
  framer: { title: "Framer", mark: { path: siFramer.path, fill: "var(--ink)" }, glow: "#0055ff" },
  davinci: { title: "DaVinci Resolve", mark: { path: siDavinciresolve.path, fill: "var(--ink)" }, glow: "#f5a623" },
  unity: { title: "Unity", mark: { path: siUnity.path, fill: "var(--ink)" }, glow: "#d6d6d6" },
} satisfies Record<string, Tech>

export function Logo({ tech, className }: { tech: Tech; className?: string }) {
  if (tech.src) return <Image src={tech.src} alt={tech.title} width={64} height={64} unoptimized className={cn("object-contain", className)} />
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={tech.title} className={className} fill={tech.mark!.fill}>
      <path d={tech.mark!.path} />
    </svg>
  )
}

/** A charcoal app-icon tile with a soft glow in the brand's colour. */
export function LogoTile({ tech, className }: { tech: Tech; className?: string }) {
  return (
    <span
      className={cn("grid place-items-center rounded-[24%] border border-white/[0.08] bg-[#121731]", className)}
      style={{
        boxShadow: `0 0 0 1px ${tech.glow}26, 0 0 36px -6px ${tech.glow}73, 0 22px 44px rgb(0 0 0 / 0.45)`,
      }}
    >
      <Logo tech={tech} className="size-[54%]" />
    </span>
  )
}

/* ---------- floating tiles around the hero ---------- */
// where each tile sits (as % of the hero), how far it drifts with the mouse (depth), its resting tilt
const FLOATERS: { tech: Tech; pos: string; depth: number; tilt: number; phone?: boolean }[] = [
  { tech: T.figma, pos: "left-[8%] top-[22%]", depth: 26, tilt: -10, phone: true },
  { tech: T.photoshop, pos: "right-[9%] top-[19%]", depth: 34, tilt: 8, phone: true },
  { tech: T.illustrator, pos: "left-[4%] top-[51%]", depth: 18, tilt: 6 },
  { tech: T.aftereffects, pos: "right-[4%] top-[49%]", depth: 22, tilt: -7 },
  { tech: T.lightroom, pos: "left-[13%] bottom-[13%]", depth: 30, tilt: 9, phone: true },
  { tech: T.premiere, pos: "right-[14%] bottom-[15%]", depth: 28, tilt: -9, phone: true },
  { tech: T.blender, pos: "left-[21%] top-[10%]", depth: 14, tilt: 4 },
  { tech: T.react, pos: "right-[23%] top-[8%]", depth: 16, tilt: -5 },
]

export function HeroLogos() {
  return (
    <div aria-hidden="true" data-floats className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {FLOATERS.map(({ tech, pos, depth, tilt, phone }) => (
        // three layers so the motions never fight: position + mouse parallax › idle bob › entrance, tilt and drag
        <div key={tech.title} data-float data-depth={depth} className={cn("absolute", pos, !phone && "hidden md:block")}>
          <div data-bob>
            {/* the tile itself is the drag handle (motion.tsx makes it draggable) */}
            <span data-tile data-cursor="Drag" className="pointer-events-auto block cursor-grab touch-none active:cursor-grabbing" style={{ rotate: `${tilt}deg` }}>
              <LogoTile tech={tech} className="size-[clamp(60px,6.2vw,96px)] max-md:size-[52px]" />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- the scrolling strip below the hero ---------- */
const STRIP: Tech[] = [
  T.figma, T.framer, T.xd, T.sketch, T.photoshop, T.illustrator, T.lightroom, T.premiere, T.aftereffects, T.davinci, T.canva,
  T.blender, T.unity, T.three, T.gsap, T.html, T.css, T.tailwind, T.react, T.next, T.vercel,
]

export function LogoStrip() {
  const row = (copy: boolean) => (
    <ul aria-hidden={copy || undefined} className="flex shrink-0 items-center gap-[clamp(28px,3.4vw,48px)] pr-[clamp(28px,3.4vw,48px)]">
      {STRIP.map((tech) => (
        <li key={tech.title} className="flex items-center gap-3 whitespace-nowrap text-[0.9375rem] text-muted-foreground">
          <LogoTile tech={tech} className="size-10 rounded-[28%]" />
          {tech.title}
        </li>
      ))}
    </ul>
  )
  return (
    <section aria-label="Tools I build with" className="relative z-[1] overflow-hidden border-y border-line py-7 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      {/* two identical rows slide left by exactly one row's width, so the loop never jumps */}
      <div className="flex w-max animate-[marquee_42s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </section>
  )
}
