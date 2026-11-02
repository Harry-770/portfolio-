import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import {
  siAppwrite, siCalendly, siClerk, siCloudflare, siContentful, siDigitalocean, siFirebase, siFormspree, siGhost, siGithub,
  siGodaddy, siGoogleads, siGoogleanalytics, siGooglecloud, siGoogleforms, siGooglesearchconsole, siGoogletagmanager,
  siHostinger, siHubspot, siMailchimp, siMeta, siMongodb, siNetlify, siPostgresql, siRazorpay, siResend, siSanity,
  siSemrush, siShopify, siStrapi, siStripe, siSupabase, siTypeform, siVercel, siWebflow, siWhatsapp, siWix, siWordpress,
  siAirtable, siBrevo, siDrupal, siFramer, siGithubpages, siGmail, siGoogledrive, siHotjar, siIntercom, siMake, siMixpanel,
  siMysql, siN8n, siNamecheap, siNotion, siPaypal, siPaytm, siRailway, siRedis, siRender, siSquarespace, siStoryblok,
  siTelegram, siTrello, siYoutube, siZapier, siZoom, siAsana, siGooglesheets, siLoom, siMiro,
  type SimpleIcon,
} from "simple-icons"
import { SectionHead } from "@/components/section-head"
import { site, fullName } from "@/content/site"
import { SectionTabs, type SectionTab } from "@/components/section-tabs"

// =====================================================================
//  PLATFORMS — the third-party services I set up and connect for clients,
//  one tab per category, each platform a card with a short note; then partner tabs (clients,
//  creative partners and the open-source projects this site is built on).
//  Logos: the brands' own full-colour marks from gilbarbara/logos (CC0, public/logos/platforms)
//  where they exist; the rest are single-colour brands, drawn from Simple Icons (CC0) in their
//  official colour. Jotform's logo is in neither set, so it gets a monogram in its brand orange.
//  The brands stay their owners' trademarks.
// =====================================================================

type Platform = { name: string; info: string; src?: string; icon?: SimpleIcon; tint?: string; mono?: { letters: string; color: string } }
type Group = { name: string; line: string; items: Platform[] }

const GROUPS: Group[] = [
  {
    name: "Forms & messaging",
    line: "Capture leads, reply fast.",
    items: [
      { name: "Jotform", info: "Drag-and-drop forms, surveys and sign-ups.", mono: { letters: "J", color: "#ff6100" } },
      { name: "Typeform", info: "Conversational forms, one question at a time.", src: "/logos/platforms/typeform.svg", icon: siTypeform },
      { name: "Google Forms", info: "Quick free forms, answers straight to Sheets.", icon: siGoogleforms },
      { name: "Formspree", info: "Contact forms for static sites, no backend.", icon: siFormspree },
      { name: "Twilio", info: "SMS, OTP codes and voice for apps.", src: "/logos/platforms/twilio.svg", mono: { letters: "T", color: "#f22f46" } },
      { name: "WhatsApp", info: "Business chat, click-to-chat and alerts.", src: "/logos/platforms/whatsapp.svg", icon: siWhatsapp },
      { name: "Resend", info: "Transactional email from code, well delivered.", icon: siResend },
      { name: "Calendly", info: "Booking links that skip the email back-and-forth.", icon: siCalendly },
      { name: "Gmail", info: "Business email on your own domain.", src: "/logos/platforms/gmail.svg", icon: siGmail },
      { name: "Telegram", info: "Channels, groups and bots for updates.", src: "/logos/platforms/telegram.svg", icon: siTelegram },
      { name: "Intercom", info: "Live chat and help desk on the site.", src: "/logos/platforms/intercom.svg", icon: siIntercom },
      { name: "Zoom", info: "Client calls, demos and webinars.", src: "/logos/platforms/zoom.svg", icon: siZoom },
    ],
  },
  {
    name: "CMS & site builders",
    line: "Content clients can edit themselves.",
    items: [
      { name: "WordPress", info: "The classic CMS for blogs and business sites.", icon: siWordpress },
      { name: "Sanity", info: "Headless CMS with a custom editing studio.", icon: siSanity, tint: "#f03e2f" },
      { name: "Strapi", info: "Open-source headless CMS you host yourself.", src: "/logos/platforms/strapi.svg", icon: siStrapi },
      { name: "Contentful", info: "Enterprise headless content for many channels.", src: "/logos/platforms/contentful.svg", icon: siContentful },
      { name: "Webflow", info: "Visual builder for marketing sites, no code.", icon: siWebflow },
      { name: "Ghost", info: "Publishing and newsletters with memberships.", icon: siGhost },
      { name: "Shopify", info: "Online stores, payments and inventory.", src: "/logos/platforms/shopify.svg", icon: siShopify },
      { name: "Wix", info: "Easy site builder for small businesses.", icon: siWix },
      { name: "Framer", info: "Design-led sites that publish in a click.", src: "/logos/platforms/framer.svg", icon: siFramer },
      { name: "Squarespace", info: "Polished templates for portfolios and shops.", icon: siSquarespace },
      { name: "Storyblok", info: "Headless CMS with a visual page editor.", src: "/logos/platforms/storyblok.svg", icon: siStoryblok },
      { name: "Drupal", info: "Robust CMS for large, structured sites.", src: "/logos/platforms/drupal.svg", icon: siDrupal },
    ],
  },
  {
    name: "Backend & payments",
    line: "Logins, data and checkout.",
    items: [
      { name: "Firebase", info: "Google's backend: auth, database and hosting.", src: "/logos/platforms/firebase.svg", icon: siFirebase },
      { name: "Supabase", info: "Open-source Postgres backend with auth.", src: "/logos/platforms/supabase.svg", icon: siSupabase },
      { name: "Appwrite", info: "Self-hostable backend for web and mobile.", src: "/logos/platforms/appwrite.svg", icon: siAppwrite },
      { name: "MongoDB", info: "Document database for flexible app data.", src: "/logos/platforms/mongodb.svg", icon: siMongodb },
      { name: "PostgreSQL", info: "Reliable SQL database for serious data.", src: "/logos/platforms/postgresql.svg", icon: siPostgresql },
      { name: "Clerk", info: "Drop-in sign-up, login and user profiles.", icon: siClerk },
      { name: "Stripe", info: "Global payments, subscriptions and invoices.", icon: siStripe },
      { name: "Razorpay", info: "Payments in India: UPI, cards and netbanking.", icon: siRazorpay, tint: "#3395ff" },
      { name: "PayPal", info: "International payments and checkout.", src: "/logos/platforms/paypal.svg", icon: siPaypal },
      { name: "Paytm", info: "Wallet, UPI and payment gateway in India.", icon: siPaytm },
      { name: "MySQL", info: "The classic SQL database for web apps.", src: "/logos/platforms/mysql.svg", icon: siMysql },
      { name: "Redis", info: "Fast caching, sessions and queues.", src: "/logos/platforms/redis.svg", icon: siRedis },
    ],
  },
  {
    name: "Hosting & domains",
    line: "Fast, secure and always up.",
    items: [
      { name: "Vercel", info: "Hosting for Next.js with instant previews.", icon: siVercel },
      { name: "Netlify", info: "Static and Jamstack hosting with forms.", src: "/logos/platforms/netlify.svg", icon: siNetlify },
      { name: "Cloudflare", info: "DNS, CDN and security in front of a site.", src: "/logos/platforms/cloudflare.svg", icon: siCloudflare },
      { name: "AWS", info: "Cloud servers, storage and everything at scale.", src: "/logos/platforms/aws.svg", mono: { letters: "aws", color: "#ff9900" } },
      { name: "Google Cloud", info: "Cloud compute, storage and Google's AI tools.", src: "/logos/platforms/google-cloud.svg", icon: siGooglecloud },
      { name: "DigitalOcean", info: "Simple virtual servers at a fair price.", src: "/logos/platforms/digitalocean.svg", icon: siDigitalocean },
      { name: "Hostinger", info: "Affordable shared hosting and email.", icon: siHostinger },
      { name: "GoDaddy", info: "Domain names and DNS management.", icon: siGodaddy },
      { name: "Render", info: "Easy hosting for apps, APIs and databases.", icon: siRender },
      { name: "Railway", info: "Deploy servers and databases in minutes.", icon: siRailway },
      { name: "Namecheap", info: "Affordable domains with free privacy.", src: "/logos/platforms/namecheap.svg", icon: siNamecheap },
      { name: "GitHub Pages", info: "Free hosting for static sites and docs.", src: "/logos/platforms/github.svg", icon: siGithubpages },
    ],
  },
  {
    name: "Digital marketing",
    line: "Get found, then measure it.",
    items: [
      { name: "Google Analytics", info: "Who visits, from where, and what they do.", src: "/logos/platforms/google-analytics.svg", icon: siGoogleanalytics },
      { name: "Search Console", info: "How the site shows up in Google search.", src: "/logos/platforms/google-search-console.svg", icon: siGooglesearchconsole },
      { name: "Tag Manager", info: "Tracking tags without touching the code.", src: "/logos/platforms/google-tag-manager.svg", icon: siGoogletagmanager },
      { name: "Google Ads", info: "Search and display ads that drive leads.", src: "/logos/platforms/google-ads.svg", icon: siGoogleads },
      { name: "Meta Ads", info: "Facebook and Instagram ad campaigns.", src: "/logos/platforms/meta.svg", icon: siMeta },
      { name: "Mailchimp", info: "Email newsletters and audience lists.", icon: siMailchimp },
      { name: "HubSpot", info: "CRM for leads, deals and follow-ups.", icon: siHubspot },
      { name: "Semrush", info: "SEO research: keywords and competitors.", icon: siSemrush },
      { name: "Hotjar", info: "Heatmaps and recordings of real visits.", src: "/logos/platforms/hotjar.svg", icon: siHotjar },
      { name: "Mixpanel", info: "Product analytics: funnels and retention.", icon: siMixpanel },
      { name: "Brevo", info: "Email and SMS campaigns, formerly Sendinblue.", icon: siBrevo },
      { name: "YouTube", info: "Video channel setup, embeds and ads.", src: "/logos/platforms/youtube.svg", icon: siYoutube },
    ],
  },
  {
    name: "Automation & tools",
    line: "Less busywork, more shipping.",
    items: [
      { name: "Zapier", info: "Connects apps so tasks run themselves.", icon: siZapier },
      { name: "Make", info: "Visual workflows across hundreds of apps.", icon: siMake },
      { name: "n8n", info: "Open-source automation you can self-host.", icon: siN8n },
      { name: "Airtable", info: "Spreadsheet-database for content and ops.", src: "/logos/platforms/airtable.svg", icon: siAirtable },
      { name: "Notion", info: "Docs, wikis and project boards in one.", src: "/logos/platforms/notion.svg", icon: siNotion },
      { name: "Slack", info: "Team chat with alerts from every tool.", src: "/logos/platforms/slack.svg" },
      { name: "Trello", info: "Simple kanban boards for client work.", src: "/logos/platforms/trello.svg", icon: siTrello },
      { name: "Google Drive", info: "Shared files, assets and handovers.", src: "/logos/platforms/google-drive.svg", icon: siGoogledrive },
      { name: "Google Sheets", info: "Shared sheets for budgets, content and leads.", icon: siGooglesheets },
      { name: "Asana", info: "Project plans, timelines and tasks.", src: "/logos/platforms/asana.svg", icon: siAsana },
      { name: "Miro", info: "Whiteboards for workshops and user flows.", src: "/logos/platforms/miro.svg", icon: siMiro },
      { name: "Loom", info: "Quick screen videos for reviews and handoffs.", src: "/logos/platforms/loom.svg", icon: siLoom },
    ],
  },
]

export const PLATFORM_COUNT = GROUPS.reduce((n, g) => n + g.items.length, 0)

// the open-source projects this very site is built on
const REPOS: { name: string; repo: string }[] = [
  { name: "Next.js", repo: "vercel/next.js" },
  { name: "React", repo: "facebook/react" },
  { name: "Tailwind CSS", repo: "tailwindlabs/tailwindcss" },
  { name: "shadcn/ui", repo: "shadcn-ui/ui" },
  { name: "Radix UI", repo: "radix-ui/primitives" },
  { name: "GSAP", repo: "greensock/GSAP" },
  { name: "Lenis", repo: "darkroomengineering/lenis" },
  { name: "Simple Icons", repo: "simple-icons/simple-icons" },
  { name: "Devicon", repo: "devicons/devicon" },
  { name: "Lucide", repo: "lucide-icons/lucide" },
]

// the cards are white, so every mark draws in its own brand colour, black brands included; only very
// pale ones (Mailchimp's yellow) would vanish, so they draw near-black. tint: a brand's own brighter
// colour where Simple Icons lists a darker one (Razorpay's blue, Sanity's red)
const readable = (hex: string) => {
  const n = parseInt(hex, 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 200 ? "#0b0d14" : `#${hex}`
}

// one platform: its logo on a dark tile, its name and what it's for
function PlatformCard({ p }: { p: Platform }) {
  const color = p.tint ?? (p.icon ? readable(p.icon.hex) : p.mono?.color ?? "var(--electric)")
  return (
    <li className="glow-hover flex items-start gap-5 rounded-3xl bg-white p-6 text-[#0b0d14] shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_18px_40px_-24px_rgb(0_0_0/0.8)] transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-[3px] hover:shadow-[0_24px_60px_-20px_color-mix(in_srgb,var(--electric)_55%,transparent)] max-sm:gap-3.5 max-sm:rounded-2xl max-sm:p-4">
      <span aria-hidden="true" data-tab-icon className="grid size-[72px] shrink-0 place-items-center rounded-[20px] bg-[#f2f4fa] ring-1 ring-[#e3e7f2] max-sm:size-14 max-sm:rounded-2xl"
        style={{ boxShadow: `0 10px 24px -14px ${color}` }}>
        {p.src ? (
          <Image src={p.src} alt="" width={40} height={40} unoptimized loading="eager" className="size-9 object-contain max-sm:size-7" />
        ) : p.icon ? (
          <svg viewBox="0 0 24 24" className="size-8 max-sm:size-[26px]" fill={color}><path d={p.icon.path} /></svg>
        ) : (
          <span className="text-xl leading-none font-bold tracking-[-0.02em]" style={{ color }}>{p.mono!.letters}</span>
        )}
      </span>
      <span className="grid min-w-0 gap-1.5 pt-1">
        <span className="text-lg font-semibold tracking-[-0.015em] max-sm:text-base">{p.name}</span>
        <span className="text-[0.9375rem] leading-snug text-[#4b5168] max-sm:text-sm">{p.info}</span>
      </span>
    </li>
  )
}

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()

export function Platforms({ id = "platformsTitle" }: { id?: string }) {
  const total = GROUPS.reduce((n, g) => n + g.items.length, 0)
  const partners = site.team.filter((m) => m.name !== fullName)

  const tabs: SectionTab[] = [
    {
      label: "Brands & clients",
      note: "Teams I've designed for.",
      panel: (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.clients.map((c) => (
            <li key={c.name} className="panel glow-hover grid min-h-36 content-between gap-6 p-6">
              <span className="flex items-center gap-2.5 font-display text-[1.75rem] tracking-[-0.03em] text-ink">
                {c.mark === "vercel" && <svg viewBox="0 0 24 24" aria-hidden="true" data-tab-icon className="size-6 fill-current"><path d={siVercel.path} /></svg>}
                {c.name}
              </span>
              <span className="text-[0.8125rem] text-dim">Client</span>
            </li>
          ))}
          <li>
            <Link href="/contact" className="group/n grid h-full min-h-36 content-between gap-6 rounded-3xl border border-dashed border-line-2 p-6 transition-colors hover:border-electric-soft">
              <span className="font-serif text-[1.75rem] leading-tight text-muted-foreground italic transition-colors group-hover/n:text-electric-soft">Your brand next?</span>
              <span className="inline-flex items-center gap-1 text-[0.8125rem] text-dim">Start a project <ArrowUpRight className="size-3.5" /></span>
            </Link>
          </li>
        </ul>
      ),
    },
    {
      label: "Creative partners",
      note: "The crew on film, photo and 3D work.",
      panel: (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((m, i) => (
            <li key={m.name} className="panel glow-hover flex items-center gap-4 p-5">
              <span aria-hidden="true" data-tab-icon className="grid size-14 shrink-0 place-items-center rounded-2xl font-display text-lg text-white"
                style={{ background: `radial-gradient(circle at ${["30% 20%", "75% 25%", "25% 80%"][i % 3]}, var(--electric) 0%, var(--navy) 45%, #000033 80%)` }}>
                {initials(m.studio ?? m.name)}
              </span>
              <span className="grid">
                <span className="font-medium">{m.studio ? `${m.studio}` : m.name}</span>
                <span className="text-sm text-muted-foreground">{m.studio ? `${m.name}, ${m.role.toLowerCase()}` : m.role}</span>
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "Open source",
      note: "What this site is built on. Thank you.",
      panel: (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {REPOS.map((r) => (
            <li key={r.repo}>
              <a href={`https://github.com/${r.repo}`} target="_blank" rel="noopener"
                className="panel glow-hover group/r grid gap-3 p-4 transition-colors">
                <span className="flex items-center justify-between">
                  <svg viewBox="0 0 24 24" aria-hidden="true" data-tab-icon className="size-5 fill-current text-muted-foreground"><path d={siGithub.path} /></svg>
                  <ArrowUpRight className="size-4 text-dim transition-[color,transform] group-hover/r:translate-x-0.5 group-hover/r:-translate-y-0.5 group-hover/r:text-electric-soft" />
                </span>
                <span className="grid min-w-0">
                  <span className="text-[0.9375rem] font-medium">{r.name}</span>
                  <span className="truncate text-[0.75rem] text-dim">{r.repo}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <section className="wrap section-space" aria-labelledby={id}>
      <SectionHead
        id={id}
        title="Platforms"
        intro={`The ${total} services I set up and connect, from the contact form to the hosting, in ${GROUPS.length} categories.`}
      />

      <div data-reveal>
        <SectionTabs
          name="Platforms"
          tabs={GROUPS.map((g) => ({
            label: g.name,
            note: `${g.items.length} platforms. ${g.line}`,
            panel: (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((p) => <PlatformCard key={p.name} p={p} />)}
              </ul>
            ),
          }))}
        />
      </div>

      {/* partners */}
      <div data-reveal className="mt-[clamp(64px,8vw,104px)]">
        <h3 className="mb-6 font-display font-bold tracking-[-0.025em] [word-spacing:0.06em] text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-tight">Partners</h3>
        <SectionTabs name="Partners" tabs={tabs} />
      </div>
    </section>
  )
}
