"use client"

import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { site } from "@/content/site"
import { cn } from "@/lib/utils"

type Errors = Partial<Record<"name" | "email" | "message", string>>

const FIELD = "h-auto rounded-xl border-line-2 bg-surface-2 px-4 py-3 text-base placeholder:text-dim focus-visible:border-electric-soft focus-visible:bg-surface-3 focus-visible:ring-0 aria-invalid:border-destructive"

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [budget, setBudget] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [note, setNote] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const message = String(data.get("message") ?? "").trim()

    const next: Errors = {}
    if (!name) next.name = "Add your name so I know who to reply to."
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Add an email address I can reply to, like you@company.com."
    if (!message) next.message = "Write a few lines about the project."
    setErrors(next)
    if (Object.keys(next).length) {
      setNote("")
      // the error states render on the next frame; then focus the first field that needs fixing
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
      return
    }

    if (!site.formEndpoint) {
      // no form backend yet: open an email with what they typed instead
      const body = `${message}\n\nBudget: ${budget || "not sure yet"}\n\n${name}`
      location.href = `mailto:${site.email}?subject=${encodeURIComponent("A website project")}&body=${encodeURIComponent(body)}`
      setNote(`Your email app should open with the message filled in. If it doesn't, write to ${site.email}.`)
      return
    }

    setStatus("sending")
    try {
      data.set("budget", budget)
      const r = await fetch(site.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
      if (!r.ok) throw new Error(String(r.status))
      setStatus("sent")
      setNote("Sent. Thanks, I'll get back to you soon, usually within a day.")
      formRef.current?.reset(); setBudget("")
    } catch {
      setStatus("idle")
      setNote(`The message didn't send. Email me at ${site.email} instead.`)
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="panel grid gap-[18px] p-[clamp(24px,3vw,36px)]">
      <Field id="name" label="Name" error={errors.name}>
        <Input id="name" name="name" autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={FIELD} />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} autoCapitalize="off" placeholder="you@company.com"
          aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={FIELD} />
      </Field>
      <Field id="message" label="What are you working on?" error={errors.message}>
        <Textarea id="message" name="message" rows={4} placeholder="A few lines about the project" aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} className={cn(FIELD, "min-h-28")} />
      </Field>

      <fieldset className="grid gap-2.5">
        <legend className="mb-2.5 text-sm text-muted-foreground">Budget</legend>
        <ToggleGroup type="single" value={budget} onValueChange={setBudget} className="flex flex-wrap gap-2" spacing={2} aria-label="Budget">
          {site.budgets.map((b) => (
            <ToggleGroupItem key={b} value={b} className="h-11 rounded-full border border-line-2 bg-surface-2 px-4 text-sm hover:bg-surface-3 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground">
              {b}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </fieldset>

      <div className="mt-1 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : status === "sent" ? "Sent" : "Send message"}</Button>
      </div>
      <p role="status" className="min-h-[1.5em] text-sm text-muted-foreground">{note}</p>
    </form>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-sm font-normal text-muted-foreground">{label}</Label>
      {children}
      {error && <p id={`${id}-error`} className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
