import sharp from 'sharp'
import { renameSync } from 'fs'

async function removeWhiteBackground(inputPath, outputPath) {
  const image = sharp(inputPath)
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const pixels = new Uint8Array(data)

  const threshold = 240

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]

    if (r >= threshold && g >= threshold && b >= threshold) {
      pixels[i + 3] = 0
    }
  }

  // sharp can't write to the path it's reading from — write to a temp file, then swap
  const tmpPath = outputPath + '.tmp.png'
  await sharp(Buffer.from(pixels), {
    raw: { width, height, channels }
  })
    .png()
    .toFile(tmpPath)
  renameSync(tmpPath, outputPath)

  console.log(`Done: ${outputPath}`)
}

async function makeWhiteVersion(inputPath, outputPath) {
  const image = sharp(inputPath)
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const pixels = new Uint8Array(data)

  for (let i = 0; i < pixels.length; i += channels) {
    const a = pixels[i + 3]
    if (a > 0) {
      pixels[i] = 255
      pixels[i + 1] = 255
      pixels[i + 2] = 255
    }
  }

  await sharp(Buffer.from(pixels), {
    raw: { width, height, channels }
  })
    .png()
    .toFile(outputPath)

  console.log(`Done: ${outputPath}`)
}

async function main() {
  await removeWhiteBackground('public/tf-icon-green.png', 'public/tf-icon-green.png')
  await removeWhiteBackground('public/tf-icon-black.png', 'public/tf-icon-black.png')
  await removeWhiteBackground('public/tf-logo-full.png', 'public/tf-logo-full.png')
  await makeWhiteVersion('public/tf-icon-green.png', 'public/tf-icon-white.png')
}

main().catch(console.error)
