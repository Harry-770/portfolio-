import type { Metadata } from "next"
import { PageHead, NextPage } from "@/components/page-head"
import { LiveStatus } from "@/components/live-status"
import { CopyEmailButton } from "@/components/copy-email-button"
import { site, cityName } from "@/content/site"
import { ContactForm } from "./contact-form"
import { ReactiveGrid } from "@/components/reactive-grid"
import { Globe } from "@/components/globe"
import { Faq } from "@/components/faq"
import { SectionHead } from "@/components/section-head"
import { FAQ } from "@/content/faq"
import { Motion } from "@/components/motion"

export const metadata: Metadata = { title: "Contact", description: `Start a project with ${site.firstName}. ${site.replyNote}` }

export default function ContactPage() {
  return (
    <>
      <PageHead image={{ src: "/images/contact-desk.jpg", alt: "A laptop on a wooden desk in front of a large window", focus: "50% 85%" }} title="Let's talk">
        <p>{site.replyNote}</p>
        <LiveStatus className="block text-[0.9375rem] text-dim" />
      </PageHead>

      <section className="relative isolate wrap section-space grid items-start gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]" aria-label="Contact">
        <ReactiveGrid />
        <ContactForm />
        <div className="grid gap-7 pt-3 [&_h2]:mb-1.5 [&_h2]:text-[0.8125rem] [&_h2]:font-medium [&_h2]:text-dim [&_p]:text-xl [&_p]:font-medium [&_p]:tracking-[-0.02em]">
          <div>
            <h2>Email</h2>
            <p className="flex flex-wrap items-baseline gap-x-2">
              <a href={`mailto:${site.email}`} className="hover:text-electric-soft">{site.email}</a>
              <CopyEmailButton variant="link">Copy</CopyEmailButton>
            </p>
          </div>
          <div><h2>Phone</h2><p><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-electric-soft">{site.phone}</a></p></div>
          <div><h2>Local time</h2><p><LiveStatus kind="time" /> in {cityName}</p></div>
          <div>
            <h2>Elsewhere</h2>
            <p className="flex flex-wrap gap-x-[18px] gap-y-1">
              {site.socials.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener" className="hover:text-electric-soft">{n}</a>)}
            </p>
          </div>
        </div>
      </section>
      {/* where I am, and the teams I've worked with */}
      <section className="wrap section-space grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" aria-labelledby="globeTitle">
        <div>
          <h2 id="globeTitle" data-split className="display-title max-w-[14ch]">Based in Nagpur, working <em>everywhere</em></h2>
          <p data-reveal className="mt-6 max-w-[34rem] text-[1.1875rem] leading-relaxed text-muted-foreground">
            Most of my work happens remotely, with teams in other cities and time zones. Drag the globe to spin it.
          </p>
        </div>
        <div data-reveal className="flex justify-center">
          <Globe
            label="A globe turning slowly, with a pin on Nagpur, India and arcs to San Francisco and Shenzhen"
            home={{ label: "Nagpur", lat: 21.15, lon: 79.09 }}
            pins={[{ label: "San Francisco", lat: 37.77, lon: -122.42 }, { label: "Shenzhen", lat: 22.54, lon: 114.06 }]}
          />
        </div>
      </section>

      <section className="wrap section-space" aria-labelledby="faqTitle">
        <SectionHead id="faqTitle" title="Questions" intro="The things people usually ask before we start." />
        <Faq items={FAQ} />
      </section>

      <NextPage current="contact" />
      <Motion />
    </>
  )
}
