import type { QA } from "@/components/faq"
import { site } from "@/content/site"

// TODO: these answers are drafted from the rest of the site; read them over and make them yours
export const FAQ: QA[] = [
  {
    q: "What does a typical project look like?",
    a: "It starts with a call and a short brief. Then research and wireframes, the design in Figma with a clickable prototype, and finally the build or a clean handoff to your developers. You see progress every week, not just at the end.",
  },
  {
    q: "Do you only design, or build as well?",
    a: "Both. I design products and websites, and for smaller teams I build them too, in Next.js, so nothing gets lost between the mockup and the live site.",
  },
  {
    q: "Can your team handle photos, film and 3D?",
    a: "Yes. The crew includes cinematographers for product films and shoots, and a designer who works in Unity and Blender, so a launch can get its visuals from the same team that designed it.",
  },
  {
    q: "Do you work with teams outside Nagpur?",
    a: "All the time. Most work happens remotely across time zones, with calls when they help. I'm based in Nagpur, India.",
  },
  {
    q: "What does a project cost?",
    a: `It depends on the scope. Most projects fall into one of these ranges: ${site.budgets.filter((b) => b !== "Not sure yet").join(", ")}. Not sure yet is fine too; tell me about it and I'll suggest a sensible place to start.`,
  },
]
