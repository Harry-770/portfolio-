"use client"

import { Button } from "@/components/ui/button"
import { copyEmail } from "@/components/keys"

export function CopyEmailButton({ variant = "outline", children = "Copy email" }: { variant?: "outline" | "link"; children?: React.ReactNode }) {
  return <Button variant={variant} onClick={copyEmail}>{children}</Button>
}
