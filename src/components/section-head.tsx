/** An italic serif section title with an optional count and a short intro on the right. */
export function SectionHead({ id, title, count, intro }: { id: string; title: string; count?: string; intro?: React.ReactNode }) {
  return (
    <div className="mb-12 grid items-end gap-x-12 gap-y-6 md:grid-cols-[1fr_minmax(0,380px)]">
      <h2 id={id} className="display-title" data-split>
        {title}
        {count && <sup className="relative top-[0.4em] ml-[0.35em] align-top font-sans text-[0.8125rem] font-medium not-italic text-muted-foreground">{count}</sup>}
      </h2>
      {intro && <p data-reveal className="text-[1.1875rem] leading-[1.45] text-muted-foreground md:text-right">{intro}</p>}
    </div>
  )
}
