import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const imagesRoot = path.join(projectRoot, 'public', 'images')
const MAX_DIMENSION = 2400

const qualityByExtension = {
  '.jpg': 78,
  '.jpeg': 78,
  '.png': 80,
  '.webp': 76,
  '.avif': 50,
}

const supportedExtensions = new Set(Object.keys(qualityByExtension))

const humanBytes = (value) => {
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / (1024 * 1024)).toFixed(2)} MB`
}

const collectImageFiles = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectImageFiles(fullPath)))
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    const extension = path.extname(entry.name).toLowerCase()
    if (supportedExtensions.has(extension)) {
      files.push(fullPath)
    }
  }

  return files
}

const encodeWithOriginalFormat = (pipeline, extension) => {
  const quality = qualityByExtension[extension]

  if (extension === '.jpg' || extension === '.jpeg') {
    return pipeline.jpeg({ quality, mozjpeg: true })
  }

  if (extension === '.png') {
    return pipeline.png({ quality, compressionLevel: 9, palette: true })
  }

  if (extension === '.webp') {
    return pipeline.webp({ quality, effort: 4 })
  }

  if (extension === '.avif') {
    return pipeline.avif({ quality, effort: 4 })
  }

  throw new Error(`Unsupported extension: ${extension}`)
}

const optimizeFile = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase()
  const beforeStats = await fs.stat(filePath)
  const inputBuffer = await fs.readFile(filePath)

  // Skip animated images to avoid flattening or frame loss.
  const metadata = await sharp(inputBuffer, { animated: true }).metadata()
  if ((metadata.pages ?? 1) > 1) {
    return {
      optimized: false,
      skipped: true,
      reason: 'animated',
      beforeSize: beforeStats.size,
      afterSize: beforeStats.size,
    }
  }

  const buffer = await encodeWithOriginalFormat(
    sharp(inputBuffer)
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      }),
    extension,
  ).toBuffer()

  await fs.writeFile(filePath, buffer)
  await fs.utimes(filePath, beforeStats.atime, beforeStats.mtime)

  const afterStats = await fs.stat(filePath)

  return {
    optimized: true,
    skipped: false,
    reason: '',
    beforeSize: beforeStats.size,
    afterSize: afterStats.size,
  }
}

const main = async () => {
  const dryRun = process.argv.includes('--dry-run')

  const imageFiles = await collectImageFiles(imagesRoot)

  let optimizedCount = 0
  let skippedCount = 0
  let errorCount = 0
  let beforeTotal = 0
  let afterTotal = 0

  process.stdout.write(`Scanning ${imageFiles.length} image files in public/images...\n`)

  for (const filePath of imageFiles) {
    const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/')
    const beforeStats = await fs.stat(filePath)

    try {
      if (dryRun) {
        beforeTotal += beforeStats.size
        afterTotal += beforeStats.size
        optimizedCount += 1
        continue
      }

      const result = await optimizeFile(filePath)
      beforeTotal += result.beforeSize
      afterTotal += result.afterSize

      if (result.skipped) {
        skippedCount += 1
        process.stdout.write(`Skipped ${relativePath} (${result.reason})\n`)
      } else {
        optimizedCount += 1
      }
    } catch (error) {
      errorCount += 1
      beforeTotal += beforeStats.size
      afterTotal += beforeStats.size
      process.stderr.write(`Failed ${relativePath}: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    }
  }

  const bytesSaved = Math.max(beforeTotal - afterTotal, 0)
  const percentSaved = beforeTotal > 0 ? ((bytesSaved / beforeTotal) * 100).toFixed(2) : '0.00'

  process.stdout.write('\nOptimization complete.\n')
  process.stdout.write(`Optimized files: ${optimizedCount}\n`)
  process.stdout.write(`Skipped files: ${skippedCount}\n`)
  process.stdout.write(`Errors: ${errorCount}\n`)
  process.stdout.write(`Before total: ${humanBytes(beforeTotal)}\n`)
  process.stdout.write(`After total: ${humanBytes(afterTotal)}\n`)
  process.stdout.write(`Saved: ${humanBytes(bytesSaved)} (${percentSaved}%)\n`)

  if (errorCount > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
