// Journal posts export a `meta` object alongside their content (see src/content/posts/index.ts)
declare module "*.mdx" {
  export const meta: import("@/content/posts").PostMeta
}
