import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  // Static export for cPanel hosting (Hostycare): `next build` writes plain files to /out to upload.
  // Each page becomes its own folder (about/index.html), which Apache serves with no rewrites;
  // there's no server to resize images, so they're served as they are. public/.htaccess goes along.
  // Cache Components (and Partial Prefetching, which needs it) can't be used with an export, and the
  // export itself already refuses anything that isn't static.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    // shadcn/ui imports from the `radix-ui` barrel; rewrite those to direct imports
    // (lucide-react is already on Next's default list) — vercel-react-best-practices: bundle-barrel-imports
    optimizePackageImports: ["radix-ui", "simple-icons"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

// journal posts are .mdx files in src/content/posts
const withMDX = createMDX({})

export default withMDX(nextConfig)
