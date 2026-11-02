// =====================================================================
//  Everything you'd want to edit lives here.
//  Anything marked TODO is placeholder. Swap it for the real thing.
//  Journal posts live in src/content/posts/*.mdx.
// =====================================================================
import type { DiagramName } from "@/components/diagrams"

export type Project = {
  slug: string
  name: string
  video?: string           // a muted loop in /public/videos (its .jpg twin is the poster)
  diagram?: DiagramName    // or a drawn diagram instead (components/diagrams.tsx)
  category: string
  year: string
  role: string
  desc: string
  details: string
  learned?: string
  tags: string[]
  link: string
  repo?: string
}

export type Help = { name: string; tools: string; still: string; desc: string }
export type Polaroid = { src: string; alt: string; caption: string }
export type Member = { name: string; role: string; studio?: string }

export const site = {
  firstName: "Harshal",
  lastName: "Lonare",
  initials: "HL",
  role: "product designer",
  city: "Nagpur, India",
  since: 2021,                          // the year you started (drives "since 2021" and the years count)
  timezone: "Asia/Kolkata",
  hours: [10, 19] as [number, number],   // working hours (24h, local): drives the live "am I at my desk?" line
  available: true,
  availableFrom: "Dec 2026",
  photo: "",                            // e.g. "/images/me.jpg" (shown in the hero and on About when set)
  url: "https://yourname.in",           // TODO: your real domain (used for links in previews)
  source: "https://github.com/",        // TODO: link to this site's repo (or "")
  version: "v6.0",

  hero: {
    big: ["Product", "Designer"],
    serif: "with care for detail",
    lead: "I'm Harshal, a product designer based in Nagpur. Since 2021 I've designed digital products, websites and visuals that feel as good as they look.",
  },

  // Services on Home: one numbered row each; the still shows when you hover the row
  help: [
    { name: "Product design", tools: "Figma, research", still: "/images/svc-product-wireframe.jpg", desc: "Flows, wireframes and polished interfaces, tested with real people before anything is built." },
    { name: "Design and build", tools: "Figma first", still: "/images/svc-build-software.jpg", desc: "For smaller teams I design the interface too, in Figma, before a line of code." },
    { name: "3D on the web", tools: "Three.js, GLSL", still: "/images/svc-3d.jpg", desc: "Scenes and product configurators that run at 60fps on a mid-range Android." },
    { name: "Motion", tools: "GSAP, CSS", still: "/images/svc-motion-grading.jpg", desc: "Transitions and scroll work, used where it helps someone understand the page." },
    { name: "Generative visuals", tools: "Canvas, WebGL", still: "/images/svc-generative.jpg", desc: "Pictures made in code, like the journal covers on this site." },
    { name: "Rescue", tools: "Audits", still: "/images/svc-rescue.jpg", desc: "Slow or messy codebase? I audit it, then fix the worst parts first." },
  ] satisfies Help[],

  // the tilted photos in "Behind the screen". TODO: swap these stills for your own photos (shoots, your desk, Nagpur)
  polaroids: [
    // TODO: swap in your own photos; these are minimalist stock photos from Pexels (public/images/CREDITS.txt)
    { src: "/images/still-sketch.jpg", alt: "A sketchpad of website wireframes beside a phone and a keyboard", caption: "Sketch" },
    { src: "/images/still-focus.jpg", alt: "A clean white desk with a laptop and glasses", caption: "Focus" },
    { src: "/images/still-studio.jpg", alt: "An iMac showing a desert road, beside a black desk lamp", caption: "Studio" },
    { src: "/images/still-prototype.jpg", alt: "A designer sketching a mobile app screen with marker pens", caption: "Prototype" },
  ] satisfies Polaroid[],

  about: {
    headline: ["Hi, I'm Harshal.", "I design products."],
    paragraphs: [
      "I've been designing since 2021: interfaces and websites for startups and brands, plus the photos, films and 3D that make them feel alive.",
      "I work with a small team of cinematographers and designers in Nagpur, so a project can go from the first Figma frame to a finished film without changing hands.",
    ],
  },
  services: [
    { title: "Build", desc: "You have designs, I turn them into a fast, solid frontend." },
    { title: "Design + build", desc: "Smaller teams: I'll do the UI too, in Figma first." },
    { title: "Rescue", desc: "Slow or messy codebase? I'll audit it and fix the worst bits." },
  ],
  // "Now" section, inspired by nownownow.com. Keep it short and actually update it.
  now: {
    updated: "Oct 2026",
    items: [
      ["Working on", "a booking flow for a clinic chain in Pune"],   // TODO: the "Now" list is placeholder text, write your own
      ["Learning", "WebGPU, slowly and with many errors"],
      ["Reading", "Refactoring UI (again) and too many Hacker News threads"],
      ["Listening", "Prateek Kuhad on loop"],
      ["Not doing", "crypto projects. Please don't ask."],
    ] as [string, string][],
  },
  experience: [
    { when: "2021 to now", role: "Product designer", where: "Independent, Nagpur" },
  ],

  // the people you work with (shown on Home and About)
  team: [
    { name: "Harshal Lonare", role: "Product designer" },
    { name: "Mohit Lonare", role: "Cinematographer" },
    { name: "Nilesh", studio: "Fotographia", role: "Head of cinematography" },
    { name: "Aditya Chinchulkar", role: "Designer and Unity developer" },
  ] satisfies Member[],

  // brands and clients you've worked with (the "Worked with" row on Home).
  // logo: a file in /public/logos (optional); without one the name is set as a wordmark
  clients: [
    { name: "Vercel", mark: "vercel" },
    { name: "Tencent" },               // TODO: drop Tencent's official SVG at public/logos/tencent.svg and set logo: "/logos/tencent.svg"
  ] as { name: string; mark?: "vercel"; logo?: string }[],

  // level 0–100, be honest. TODO: these numbers are placeholders, set your own
  skills: [
    { title: "Design", items: [["Figma", 90], ["Illustrator", 80], ["Photoshop", 85], ["Framer", 70]] },
    { title: "Photo & video", items: [["Lightroom", 85], ["Premiere Pro", 80], ["After Effects", 75], ["DaVinci Resolve", 65]] },
    { title: "3D & motion", items: [["Blender", 70], ["Unity", 55], ["GSAP", 65], ["Three.js", 55]] },
    { title: "Build", items: [["HTML & CSS", 80], ["Tailwind CSS", 75], ["React", 60], ["Next.js", 55]] },
  ] as { title: string; items: [string, number][] }[],

  // TODO: replace with your real projects
  workNote: "Most of my client work is under NDA, so here's a small, public selection. Happy to walk you through more on a call.",
  projects: [
    { slug: "clinic-booking", name: "Clinic booking flow", video: "/videos/dots.mp4", category: "Product", year: "2026", role: "Frontend lead",
      desc: "Rebuilt booking for a 40-clinic chain.",
      details: "The old flow took 9 steps and lost half its users on mobile. We got it down to 4 steps and drop-off fell by 31%. I owned the frontend, the design system, and a lot of arguments about date pickers.",
      learned: "Test with real receptionists early. They found problems in 10 minutes that we'd missed for weeks.",
      tags: ["Next.js", "TypeScript", "Supabase"], link: "#" },
    { slug: "furniture-configurator", name: "Furniture configurator", video: "/videos/orbits.mp4", category: "3D", year: "2025", role: "3D developer",
      desc: "Pick a sofa, change the fabric, see it live.",
      details: "A Three.js configurator for a D2C furniture brand: 12 fabrics, 4 leg styles, real-time shadows. It runs at 60fps on a mid-range Android, which took more texture compression than I'd like to admit.",
      learned: "Bake everything you can. Real-time lighting is lovely, but nobody notices it on a phone.",
      tags: ["Three.js", "React", "Blender"], link: "#" },
    { slug: "chai-and-code", name: "Chai & Code", video: "/videos/particles.mp4", category: "Community", year: "2024", role: "Co-organiser, dev",
      desc: "Site for a monthly developer meetup.",
      details: "A small Next.js site with an events calendar, RSVPs and a talk archive. It's grown from 30 people in a café to around 400 regulars. It's a side project, so the code is held together with love.",
      learned: "Ship the boring version first. Nobody needed the 3D logo I spent a weekend on.",
      tags: ["Next.js", "Supabase"], link: "#", repo: "#" },
    { slug: "architecture-studio", name: "Architecture studio site", video: "/videos/terrain.mp4", category: "Website", year: "2023", role: "Design + build",
      desc: "Portfolio site for a small studio in Goa.",
      details: "Big images, slow scroll and very little text. The studio wanted it to feel like flipping through a printed monograph. Built with Astro, and it scores 100 on Lighthouse.",
      learned: "Clients with strong taste are the best clients. Just agree on the image budget early.",
      tags: ["Astro", "GSAP"], link: "#" },
    // TODO: sample real-estate case studies. Swap in your real client, numbers and links.
    { slug: "township-plot-booking", name: "Township plot booking", diagram: "masterplan", category: "Real estate", year: "2026", role: "Product designer",
      desc: "A live plot map buyers can book from.",
      details: "A developer sold plots from a printed brochure and a spreadsheet, so buyers were often shown plots that were already gone. I designed one interactive masterplan that sales, brokers and buyers all see: every plot is booked, on hold or available in real time, with size, facing and road width a tap away, and a token booking flow behind it.",
      learned: "A map is only trusted if it's never wrong. Live availability mattered more than any visual polish.",
      tags: ["Figma", "Next.js", "Supabase", "Razorpay"], link: "#" },
    { slug: "apartment-explorer", name: "Apartment explorer", diagram: "floorplan", category: "Real estate", year: "2025", role: "UI/UX designer",
      desc: "Floor plans that read on a phone screen.",
      details: "For a residential tower: every unit type as a clean, measured floor plan instead of a scanned architect's drawing, with room sizes in metres and feet, the direction of the sun and a shortlist to compare up to three units side by side.",
      learned: "Buyers read room sizes first and everything else second. Make the numbers the biggest thing on the plan.",
      tags: ["Figma", "Illustrator", "React"], link: "#" },
    { slug: "sales-stacking-plan", name: "Sales stacking plan", diagram: "stacking", category: "Real estate", year: "2025", role: "Product designer",
      desc: "Every unit in the tower, on one screen.",
      details: "An internal dashboard for the sales team: the whole tower as a stacking plan, floor by floor, coloured by booked, on hold or available. Holds expire on their own, and a broker can request a unit without calling the office.",
      learned: "Sales teams live in WhatsApp. A shareable link to one unit did more than any dashboard feature.",
      tags: ["Figma", "Next.js", "PostgreSQL"], link: "#" },
  ] satisfies Project[],

  email: "harshallonare@icloud.com",
  phone: "+91 79727 61377",
  replyNote: "I usually reply within a day. If it's urgent, WhatsApp works too.",
  socials: [["GitHub", "https://github.com/"], ["LinkedIn", "https://linkedin.com/"], ["Instagram", "https://instagram.com/"], ["X", "https://x.com/"]] as [string, string][],
  budgets: ["Under ₹50k", "₹50k – ₹2L", "₹2L+", "Not sure yet"],
  // credit lines for found pictures, shown in the footer (from public/images/credits.json)
  credits: [] as string[],
  formEndpoint: "",                     // paste your https://formspree.io/f/... URL to make the form send
}

export const fullName = `${site.firstName} ${site.lastName}`
export const cityName = site.city.split(",")[0]
export const poster = (video: string) => video.replace(".mp4", ".jpg")

// the order of the pages (used by the nav, the footer, "Next page" and the arrow-key shortcuts)
export const PAGES = [
  { href: "/", key: "home", label: "Home" },
  { href: "/about", key: "about", label: "About" },
  { href: "/work", key: "work", label: "Work" },
  { href: "/skills", key: "skills", label: "Skills" },
  { href: "/journal", key: "journal", label: "Journal" },
  { href: "/contact", key: "contact", label: "Contact" },
] as const
