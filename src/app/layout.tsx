import type { Metadata, Viewport } from "next"
import { Inter, Archivo, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { site, fullName, cityName } from "@/content/site"
import { Backdrop } from "@/components/backdrop"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { Cursor } from "@/components/cursor"
import { Keys } from "@/components/keys"
import { HashRedirect } from "@/components/hash-redirect"
import { PageTransition } from "@/components/page-transition"
import { Toaster } from "@/components/ui/sonner"
import { ACCENT_BOOT } from "@/components/theme-picker"

// next/font self-hosts the files: no request to Google at runtime, no layout shift
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
// the type system: Archivo for every heading and number, Inter for text and UI, Instrument Serif italic only for accent words
const archivo = Archivo({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], variable: "--font-archivo", display: "swap" })
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument-serif", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${fullName} · ${site.role[0].toUpperCase() + site.role.slice(1)} in ${cityName}`, template: `%s · ${fullName}` },
  description: site.hero.lead,
  openGraph: { type: "website", siteName: fullName, locale: "en_IN" },
}

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark",
  viewportFit: "cover",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // the boot script sets data-accent before React runs, hence suppressHydrationWarning on <html>
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ACCENT_BOOT }} />
      </head>
      <body>
        <a
          href="#content"
          className="fixed top-3 left-3 z-[100] -translate-y-[160%] rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Backdrop />
        <Cursor />
        <SmoothScroll>
          <Nav />
          <main id="content" tabIndex={-1} className="relative z-[2] outline-none">{children}</main>
          <Footer />
        </SmoothScroll>
        <Keys />
        <Toaster position="bottom-center" />
        <HashRedirect />
        <PageTransition />
      </body>
    </html>
  )
}
