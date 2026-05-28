import { promises as fs } from 'fs'
import path from 'path'
import { imageSizeFromFile } from 'image-size/fromFile'

const projectRoot = process.cwd()
const concertsDir = path.join(projectRoot, 'public', 'images', 'concerts')
const portraitsDir = path.join(projectRoot, 'public', 'images', 'portraits')
const outputDir = path.join(projectRoot, 'public', 'data')
const concertOutputFile = path.join(outputDir, 'concert-photos.json')
const homeOutputFile = path.join(outputDir, 'home-photos.json')

const excludedFolders = new Set(['ari', 'aron', 'turnover'])
const excludedPortraitFolders = new Set(['animals'])

// Keep consistency with concerts tab ordering, then newest files first per folder.
const folderOrder = [
  'snowstrippers',
  'party',
  'bladee',
  'malcolm',
  'cte',
  'wetleg',
  'skatingp',
  'hinds',
  'xambassadors',
  'panchiko',
  'underscores',
  'hopetala',
  'slowtidexfauxfur',
  'tpb',
  'slowtide',
]

const folderIndex = Object.fromEntries(folderOrder.map((folder, index) => [folder, index]))

const isImageFile = (fileName) => /\.(jpg|jpeg|png|webp)$/i.test(fileName)

const collectImages = async (directoryPath, baseDir, options = {}) => {
  const { excludeTopLevelFolders = new Set(), imagePrefix = '' } = options
  const entries = await fs.readdir(directoryPath, { withFileTypes: true })
  const photos = []

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      const relativeDirectory = path.relative(baseDir, fullPath).replace(/\\/g, '/')
      const topLevelFolder = relativeDirectory.split('/')[0]

      if (excludeTopLevelFolders.has(topLevelFolder)) {
        continue
      }

      photos.push(...(await collectImages(fullPath, baseDir, options)))
      continue
    }

    if (!entry.isFile() || !isImageFile(entry.name)) {
      continue
    }

    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
    const topLevelFolder = relativePath.split('/')[0]
    const stats = await fs.stat(fullPath)
    const dimensions = await imageSizeFromFile(fullPath)

    photos.push({
      image: `${imagePrefix}/${relativePath}`,
      width: dimensions.width ?? 1600,
      height: dimensions.height ?? 1067,
      folder: topLevelFolder,
      mtimeMs: stats.mtimeMs,
    })
  }

  return photos
}

const main = async () => {
  const concertPhotos = await collectImages(concertsDir, concertsDir, {
    excludeTopLevelFolders: excludedFolders,
    imagePrefix: '/images/concerts',
  })

  concertPhotos.sort((left, right) => {
    const leftOrder = folderIndex[left.folder] ?? Number.MAX_SAFE_INTEGER
    const rightOrder = folderIndex[right.folder] ?? Number.MAX_SAFE_INTEGER

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder
    }

    if (left.mtimeMs !== right.mtimeMs) {
      return right.mtimeMs - left.mtimeMs
    }

    return right.image.localeCompare(left.image)
  })

  const concertPayload = {
    photos: concertPhotos.map((photo) => ({
      image: photo.image,
      width: photo.width,
      height: photo.height,
    })),
  }

  const portraitPhotos = await collectImages(portraitsDir, portraitsDir, {
    excludeTopLevelFolders: excludedPortraitFolders,
    imagePrefix: '/images/portraits',
  })

  // Home feed: concerts (filtered) + portraits, newest files first.
  const homePhotos = [...concertPhotos, ...portraitPhotos].sort((left, right) => {
    if (left.mtimeMs !== right.mtimeMs) {
      return right.mtimeMs - left.mtimeMs
    }

    return right.image.localeCompare(left.image)
  })

  const homePayload = {
    photos: homePhotos.map((photo) => ({
      image: photo.image,
      width: photo.width,
      height: photo.height,
    })),
  }

  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(concertOutputFile, JSON.stringify(concertPayload), 'utf8')
  await fs.writeFile(homeOutputFile, JSON.stringify(homePayload), 'utf8')

  process.stdout.write(
    `Generated ${concertPayload.photos.length} photos -> ${path.relative(projectRoot, concertOutputFile)}\n`,
  )
  process.stdout.write(
    `Generated ${homePayload.photos.length} photos -> ${path.relative(projectRoot, homeOutputFile)}\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
