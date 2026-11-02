// Dates in posts are written as YYYY-MM-DD; shown as "12 Oct 2026"
export const formatDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
