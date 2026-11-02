import type { MDXComponents } from "mdx/types"
import { Children, isValidElement, type ReactNode } from "react"
import { Diagram, type DiagramName } from "@/components/diagrams"

// plain text of a heading, for its anchor id ("What it caught" → "what-it-caught")
function text(node: ReactNode): string {
  return Children.toArray(node).map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : isValidElement<{ children?: ReactNode }>(c) ? text(c.props.children) : "")).join("")
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

// Required by @next/mdx in the App Router. Post styling comes from the .prose-post wrapper in globals.css;
// headings get ids so the contents list beside each article can link to them.
// <Figure diagram="masterplan" caption="…" /> puts one of the drawn diagrams in a post.
const components: MDXComponents = {
  h3: ({ children }) => <h3 id={slug(text(children))} className="scroll-mt-28">{children}</h3>,
  Figure: ({ diagram, caption }: { diagram: DiagramName; caption: string }) => (
    <figure className="!my-10">
      <Diagram name={diagram} className="block h-auto w-full rounded-2xl border border-line" />
      <figcaption className="mt-3 text-sm leading-relaxed text-dim">{caption}</figcaption>
    </figure>
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
