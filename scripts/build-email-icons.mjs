#!/usr/bin/env node
/**
 * Rasterises three Lucide icons into PNGs for the Kit email.
 *
 * WHY PNG AND NOT SVG. Gmail strips <svg> entirely, Outlook's Word renderer
 * mangles icon fonts, and Gmail blocks data: URIs. A hosted raster is the only
 * thing all three agree on, so the chips in emails/ point at real files under
 * public/email/icons/ and those files are committed rather than gitignored.
 *
 * WHY 56px FOR A 16px SLOT. The chip renders the glyph at 16x16 CSS pixels;
 * these are written at 56x56 so a 2x or 3x display has pixels to use. Email
 * clients do not support srcset reliably, so oversampling one file is the whole
 * retina strategy.
 *
 * WHY A SCRIPT AND NOT A ONE-OFF PASTE. The gold has to match #C8A96E and the
 * stroke weight has to match the rest of the email. Next time the brand colour
 * moves, this is one edit and one `node scripts/build-email-icons.mjs`, not
 * three hand-edited binaries nobody can regenerate.
 *
 *   node scripts/build-email-icons.mjs
 */
import { mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(root, 'node_modules', 'lucide-static', 'icons')
const OUT = join(root, 'public', 'email', 'icons')

/** The chip rule colour. Same value as the border-left on every chip. */
const STROKE = '#C8A96E'
const STROKE_WIDTH = 2
/** 2x the 28px circle, so the 16px glyph has headroom on a retina screen. */
const SIZE = 56

const ICONS = [
  { from: 'calendar-days.svg', to: 'calendar.png' },
  { from: 'clock.svg', to: 'clock.png' },
  { from: 'video.svg', to: 'meet.png' },
]

/**
 * Lucide ships `stroke="currentColor"`, which resolves to black with no CSS
 * around it - so this rewrites the attributes on the root <svg> rather than
 * hoping the cascade does something. fill stays none and no background is
 * added, which is what keeps the PNG transparent over the #1A3D28 circle.
 */
function recolour(svg) {
  const open = svg.indexOf('<svg')
  if (open === -1) throw new Error('no <svg> root found')
  const close = svg.indexOf('>', open)
  const head = svg.slice(open, close + 1)

  const patched = head
    .replace(/stroke="[^"]*"/, `stroke="${STROKE}"`)
    .replace(/stroke-width="[^"]*"/, `stroke-width="${STROKE_WIDTH}"`)
    .replace(/fill="[^"]*"/, 'fill="none"')

  if (!patched.includes(`stroke="${STROKE}"`)) {
    throw new Error('stroke attribute not present on the root <svg>')
  }
  return svg.slice(0, open) + patched + svg.slice(close + 1)
}

mkdirSync(OUT, { recursive: true })

const written = []
for (const { from, to } of ICONS) {
  const svg = recolour(readFileSync(join(SRC, from), 'utf8'))
  const png = await sharp(Buffer.from(svg), { density: 384 })
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer()

  const dest = join(OUT, to)
  writeFileSync(dest, png)

  const { size } = statSync(dest)
  if (size === 0) throw new Error(`${to} was written empty`)
  written.push({ to, size })
}

// Prove the transparency held rather than assuming it: a flattened icon would
// read as an opaque square and look wrong on the dark circle.
for (const { to } of written) {
  const meta = await sharp(join(OUT, to)).metadata()
  if (!meta.hasAlpha) throw new Error(`${to} lost its alpha channel`)
  if (meta.width !== SIZE || meta.height !== SIZE) {
    throw new Error(`${to} is ${meta.width}x${meta.height}, expected ${SIZE}x${SIZE}`)
  }
}

for (const { to, size } of written) {
  console.log(`  public/email/icons/${to}  ${size} bytes  ${SIZE}x${SIZE}  alpha`)
}
console.log(`\n${written.length} icons written, stroke ${STROKE} at ${STROKE_WIDTH}.`)
