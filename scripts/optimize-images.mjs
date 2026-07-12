import sharp from 'sharp'
import { readdirSync, readFileSync, renameSync, statSync } from 'fs'
import { join, parse } from 'path'

const dir = 'public/images'

const targets = [
  { suffix: '',    width: 2560, quality: 88 },  // large desktop / 4K displays
  { suffix: '-md', width: 1920, quality: 85 },  // standard desktop / laptop
  { suffix: '-sm', width: 1024, quality: 82 },  // tablet
  { suffix: '-xs', width: 640,  quality: 80 },  // mobile
]

// only process base images, not previously generated variants
const sources = readdirSync(dir).filter(
  (f) => /\.jpe?g$/i.test(f) && !/-(md|sm|xs)\.jpe?g$/i.test(f)
)

for (const file of sources) {
  const { name } = parse(file)
  // buffer the source so every variant derives from the original,
  // not from the already-recompressed base output
  const source = readFileSync(join(dir, file))

  for (const { suffix, width, quality } of targets) {
    const outputPath = join(dir, `${name}${suffix}.jpg`)
    const tmpPath = outputPath + '.tmp.jpg'

    await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toFile(tmpPath)
    renameSync(tmpPath, outputPath)

    const webpPath = join(dir, `${name}${suffix}.webp`)
    await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(webpPath)

    const kb = (statSync(outputPath).size / 1024).toFixed(0)
    const webpKb = (statSync(webpPath).size / 1024).toFixed(0)
    console.log(`${outputPath} — ${kb} KB | ${webpPath} — ${webpKb} KB`)
  }
}
