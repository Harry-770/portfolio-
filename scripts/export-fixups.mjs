// Runs after `next build` (see "build" in package.json) on the static export in out/.
// The export nests each page's navigation data in folders, e.g. about/__next.about/__PAGE__.txt,
// but the browser asks for it flattened with dots, about/__next.about.__PAGE__.txt; on a plain file
// host (Hostycare) those requests 404 and Next falls back to slower loads. This adds a flat copy of
// each such file under the name the browser asks for.
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

const out = new URL("../out", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")
if (!existsSync(out)) process.exit(0)   // not an export build: nothing to do

let made = 0
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (!statSync(path).isDirectory()) continue
    if (name.startsWith("__next.")) flatten(dir, path)
    else walk(path)
  }
}
// copy every file under page/__next.x/… to page/__next.x.….name
const flatten = (pageDir, segDir) => {
  const files = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? files(join(d, n)) : [join(d, n)]))
  for (const file of files(segDir)) {
    const flat = join(pageDir, relative(pageDir, file).split(sep).join("."))
    if (!existsSync(flat)) { copyFileSync(file, flat); made++ }
  }
}
walk(out)
console.log(`export-fixups: added ${made} flat navigation files`)
