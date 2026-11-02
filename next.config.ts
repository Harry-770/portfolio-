import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
