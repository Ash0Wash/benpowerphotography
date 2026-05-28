import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const APP_WORK_DIR = path.join(process.cwd(), 'app', 'work')
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const MAX_IMAGE_DIMENSION = 1800
const OPTIMIZED_IMAGE_QUALITY = 64

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

const isLocalRequest = (request) => {
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  const forwardedHost = request.headers.get('x-forwarded-host')
  const hostHeader = forwardedHost || request.headers.get('host') || ''
  const host = hostHeader.split(',')[0]?.trim().split(':')[0]?.toLowerCase() || ''

  return LOCAL_HOSTS.has(host)
}

const toTitle = (slug) =>
  slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const sanitizeFileName = (fileName) =>
  fileName
    .replace(/[\\/]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')

const isSupportedImageMimeType = (mimeType) =>
  ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'].includes(
    mimeType.toLowerCase(),
  )

const optimizeImage = async (buffer) => {
  try {
    const sharpModule = await import('sharp')
    const sharp = sharpModule.default
    const { data, info } = await sharp(buffer)
      .rotate()
      .resize({
        width: MAX_IMAGE_DIMENSION,
        height: MAX_IMAGE_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: OPTIMIZED_IMAGE_QUALITY, effort: 6 })
      .toBuffer({ resolveWithObject: true })

    return {
      buffer: data,
      width: info.width,
      height: info.height,
      optimized: true,
    }
  } catch {
    return {
      buffer,
      width: undefined,
      height: undefined,
      optimized: false,
    }
  }
}

const hasCategoriesArray = (content, slug) => {
  return content.includes(`const ${slug} = [`)
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const isCompressionAvailable = async () => {
  try {
    await import('sharp')
    return true
  } catch {
    return false
  }
}

const getParentPanels = async () => {
  const entries = await fs.readdir(APP_WORK_DIR, { withFileTypes: true })
  const panels = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name === 'cars' || entry.name === 'street-photography') continue // Not sub-paneled

    const slug = entry.name
    const pagePath = path.join(APP_WORK_DIR, slug, 'page.js')

    try {
      const content = await fs.readFile(pagePath, 'utf8')

      panels.push({
        slug,
        label: toTitle(slug),
        supportsCategories: hasCategoriesArray(content, slug),
      })
    } catch {
      // Ignore directories that are not valid parent panel pages.
    }
  }

  return panels.sort((left, right) => left.label.localeCompare(right.label))
}

const getChildPanels = async (parentSlug) => {
  try {
    const parentImageDir = path.join(PUBLIC_IMAGES_DIR, parentSlug)
    const entries = await fs.readdir(parentImageDir, { withFileTypes: true })

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        slug: entry.name,
        label: toTitle(entry.name),
      }))
      .sort((left, right) => left.label.localeCompare(right.label))
  } catch {
    return []
  }
}

const insertCategory = ({ content, title, slug, image, parentSlug }) => {
  if (content.includes(`slug: '${slug}'`) || content.includes(`slug: \"${slug}\"`)) {
    throw new Error('A panel with this slug already exists in the parent list.')
  }

  const categoriesStart = content.indexOf(`const ${parentSlug} = [`)
  if (categoriesStart < 0) {
    throw new Error('Parent page categories array not found.')
  }

  const bracketStart = content.indexOf('[', categoriesStart)
  if (bracketStart < 0) {
    throw new Error('Invalid categories array syntax.')
  }

  let depth = 0
  let bracketEnd = -1

  for (let index = bracketStart; index < content.length; index += 1) {
    const char = content[index]
    if (char === '[') depth += 1
    if (char === ']') {
      depth -= 1
      if (depth === 0) {
        bracketEnd = index
        break
      }
    }
  }

  if (bracketEnd < 0) {
    throw new Error('Could not locate end of categories array.')
  }

  const insertion = `  { name: '${title.replace(/'/g, "\\'")}', slug: '${slug}', cover: '${image}' },\n`

  return `${content.slice(0, bracketStart + 1)}\n${insertion}${content.slice(bracketStart + 1)}`
}

const removeCategoryBySlug = ({ content, slug, parentSlug }) => {
  const categoriesStart = content.indexOf(`const ${parentSlug} = [`)
  if (categoriesStart < 0) {
    throw new Error('Parent page categories array not found.')
  }

  const bracketStart = content.indexOf('[', categoriesStart)
  if (bracketStart < 0) {
    throw new Error('Invalid categories array syntax.')
  }

  let depth = 0
  let bracketEnd = -1

  for (let index = bracketStart; index < content.length; index += 1) {
    const char = content[index]
    if (char === '[') depth += 1
    if (char === ']') {
      depth -= 1
      if (depth === 0) {
        bracketEnd = index
        break
      }
    }
  }

  if (bracketEnd < 0) {
    throw new Error('Could not locate end of categories array.')
  }

  const beforeArray = content.slice(0, bracketStart + 1)
  const arrayBody = content.slice(bracketStart + 1, bracketEnd)
  const afterArray = content.slice(bracketEnd)

  const slugPattern = new RegExp(
    String.raw`\{[\s\S]*?slug:\s*['"]${escapeRegExp(slug)}['"][\s\S]*?\},?\s*`,
    'm',
  )
  const updatedArrayBody = arrayBody.replace(slugPattern, '')

  if (updatedArrayBody === arrayBody) {
    throw new Error('Panel entry not found in parent categories list.')
  }

  return `${beforeArray}${updatedArrayBody}${afterArray}`
}

const removeDirectoryIfPresent = async (dirPath) => {
  await fs.rm(dirPath, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 150,
  })
}

export async function GET(request) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ error: 'Admin uploader is local-dev only.' }, { status: 403 })
  }

  try {
    const compressionActive = await isCompressionAvailable()
    const panels = await getParentPanels()
    const childPanelsByParent = Object.fromEntries(
      await Promise.all(
        panels.map(async (panel) => {
          const children = await getChildPanels(panel.slug)
          return [panel.slug, children]
        }),
      ),
    )

    return NextResponse.json({ panels, childPanelsByParent, compressionActive })
  } catch {
    return NextResponse.json({ error: 'Unable to list parent panels.' }, { status: 500 })
  }
}

export async function POST(request) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ error: 'Admin uploader is local-dev only.' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const parentPanel = String(formData.get('parentPanel') ?? '').trim()
    const panelName = String(formData.get('panelName') ?? '').trim()

    const files = formData
      .getAll('photos')
      .filter((file) => file.size > 0)

    if (!parentPanel) {
      return NextResponse.json({ error: 'Parent panel is required.' }, { status: 400 })
    }

    if (!panelName) {
      return NextResponse.json({ error: 'Panel name is required.' }, { status: 400 })
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'Please upload at least one photo.' }, { status: 400 })
    }

    const availablePanels = await getParentPanels()
    const selectedParent = availablePanels.find((panel) => panel.slug === parentPanel)

    if (!selectedParent) {
      return NextResponse.json({ error: 'Selected parent panel is invalid.' }, { status: 400 })
    }

    const newSlug = toSlug(panelName)
    if (!newSlug) {
      return NextResponse.json({ error: 'Panel name must include letters or numbers.' }, { status: 400 })
    }

    const targetImageDir = path.join(PUBLIC_IMAGES_DIR, parentPanel, newSlug)
    try {
      await fs.access(targetImageDir)
      return NextResponse.json({ error: 'A panel with this name already exists.' }, { status: 409 })
    } catch {
      // Continue when panel page does not exist.
    }

    await fs.mkdir(targetImageDir, { recursive: true })

    const webPhotos = []
    let usedFallback = false

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index]

      if (!isSupportedImageMimeType(file.type)) {
        return NextResponse.json(
          {
            error:
              'One or more uploads are not supported images. Please use JPG, PNG, WebP, AVIF, HEIC, or HEIF.',
          },
          { status: 400 },
        )
      }

      // First image gets named cover.webp, others 1.webp, 2.webp etc
      const outputName = index === 0 ? 'cover.webp' : `${index}.webp`
      const outputPath = path.join(targetImageDir, outputName)

      const buffer = Buffer.from(await file.arrayBuffer())
      const optimizedImage = await optimizeImage(buffer)
      if (!optimizedImage.optimized) {
        usedFallback = true
      }
      await fs.writeFile(outputPath, optimizedImage.buffer)

      webPhotos.push(`/images/${parentPanel}/${newSlug}/${outputName}`)
    }

    const warningMessages = []

    if (selectedParent.supportsCategories) {
      const parentPagePath = path.join(APP_WORK_DIR, parentPanel, 'page.js')
      const parentPageContent = await fs.readFile(parentPagePath, 'utf8')
      const updatedParentContent = insertCategory({
        content: parentPageContent,
        title: panelName,
        slug: newSlug,
        image: webPhotos[0],
        parentSlug: parentPanel
      })
      await fs.writeFile(parentPagePath, updatedParentContent, 'utf8')
    } else {
      warningMessages.push('Panel was created, but this parent page has no categories slider list to auto-insert into yet.')
    }

    if (usedFallback) {
      warningMessages.push('Image compression was skipped because Sharp is unavailable in this runtime.')
    }

    return NextResponse.json({
      ok: true,
      warning: warningMessages.length > 0 ? warningMessages.join(' ') : undefined,
      panel: {
        parentPanel,
        slug: newSlug,
        title: panelName,
        photoCount: webPhotos.length,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create panel.' },
      { status: 500 },
    )
  }
}

export async function DELETE(request) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ error: 'Admin uploader is local-dev only.' }, { status: 403 })
  }

  try {
    let payload;

    try {
      payload = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 })
    }

    const parentPanel = String(payload.parentPanel ?? '').trim()
    const panelSlug = String(payload.panelSlug ?? '').trim()

    if (!parentPanel) {
      return NextResponse.json({ error: 'Parent panel is required.' }, { status: 400 })
    }

    if (!panelSlug) {
      return NextResponse.json({ error: 'Panel slug is required.' }, { status: 400 })
    }

    let warning;

    const parentPagePath = path.join(APP_WORK_DIR, parentPanel, 'page.js')
    const parentPageContent = await fs.readFile(parentPagePath, 'utf8')

    try {
      const updatedParentContent = removeCategoryBySlug({
        content: parentPageContent,
        slug: panelSlug,
        parentSlug: parentPanel
      })
      await fs.writeFile(parentPagePath, updatedParentContent, 'utf8')
    } catch {
      warning = 'Panel folders were removed, but no matching parent slider entry was found to remove.'
    }

    const imageDir = path.join(PUBLIC_IMAGES_DIR, parentPanel, panelSlug)

    try {
      await removeDirectoryIfPresent(imageDir)
    } catch (error) {
      const removalMessage =
        error instanceof Error ? error.message : 'Unknown file-system error while deleting panel folders.'
      warning = warning ? `${warning} ${removalMessage}` : `Panel entry removed, but folders may remain: ${removalMessage}`
    }

    return NextResponse.json({
      ok: true,
      warning,
      removed: {
        parentPanel,
        panelSlug,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to remove panel: ${
          error instanceof Error ? error.message : 'Unexpected server error during removal.'
        }`,
      },
      { status: 500 },
    )
  }
}
