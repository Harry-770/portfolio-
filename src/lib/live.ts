import { site, cityName } from "@/content/site"

// "Is it a good moment to write?" — local time, working hours and weekend, in the site owner's timezone
export function liveStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timezone, weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ""
  const day = get("weekday"), h = Number(get("hour")) % 24, time = `${get("hour")}:${get("minute")}`
  const [start, end] = site.hours
  if (day === "Saturday" || day === "Sunday") return `It's ${time} on a ${day} in ${cityName}, so expect a reply on Monday.`
  if (h < start) return `It's ${time} in ${cityName} and I'm not at my desk yet. Expect a reply this morning.`
  if (h >= end) return `It's ${time} in ${cityName} and I've logged off. Expect a reply tomorrow.`
  return `It's ${time} in ${cityName} and I'm at my desk, so you'll likely hear back today.`
}

export function localTime(now = new Date()) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: site.timezone, hour: "2-digit", minute: "2-digit", hour12: false }).format(now)
}
