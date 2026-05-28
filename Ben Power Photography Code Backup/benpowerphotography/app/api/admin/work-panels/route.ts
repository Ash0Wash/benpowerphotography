import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

type ParentPanel = {
  slug: string
  label: string
  supportsCategories: boolean
}

type ChildPanel = {
  slug: string
  label: string
}

const APP_WORK_DIR = path.join(process.cwd(), 'app', 'work')
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const MAX_IMAGE_DIMENSION = 1800
const OPTIMIZED_IMAGE_QUALITY = 64

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

const isLocalRequest = (request: Request) => {
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  const forwardedHost = request.headers.get('x-forwarded-host')
  const hostHeader = forwardedHost || request.headers.get('host') || ''
  const host = hostHeader.split(',')[0]?.trim().split(':')[0]?.toLowerCase() || ''

  return LOCAL_HOSTS.has(host)
}

const toTitle = (slug: string) =>
  slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const sanitizeFileName = (fileName: string) =>
  fileName
    .replace(/[\\/]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')

const isSupportedImageMimeType = (mimeType: string) =>
  ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'].includes(
    mimeType.toLowerCase(),
  )

const optimizeImage = async (buffer: Buffer) => {
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

const hasCategoriesArray = (content: string) => content.includes('const categories = [')

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const isCompressionAvailable = async () => {
  try {
    await import('sharp')
    return true
  } catch {
    return false
  }
}

const getParentPanels = async (): Promise<ParentPanel[]> => {
  const entries = await fs.readdir(APP_WORK_DIR, { withFileTypes: true })
  const panels: ParentPanel[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const slug = entry.name
    const pagePath = path.join(APP_WORK_DIR, slug, 'page.tsx')

    try {
      const content = await fs.readFile(pagePath, 'utf8')

      panels.push({
        slug,
        label: toTitle(slug),
        supportsCategories: hasCategoriesArray(content),
      })
    } catch {
      // Ignore directories that are not valid parent panel pages.
    }
  }

  return panels.sort((left, right) => left.label.localeCompare(right.label))
}

const getChildPanels = async (parentSlug: string): Promise<ChildPanel[]> => {
  try {
    const parentDir = path.join(APP_WORK_DIR, parentSlug)
    const entries = await fs.readdir(parentDir, { withFileTypes: true })

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        slug: entry.name,
        label: toTitle(entry.name),
      }))
      .sort((left, right) => left.label.localeCompare(right.label))
  } catch {
    // Keep admin usable if a child directory is unreadable.
    return []
  }
}

const insertCategory = ({
  content,
  title,
  slug,
  image,
}: {
  content: string
  title: string
  slug: string
  image: string
}) => {
  if (content.includes(`slug: '${slug}'`) || content.includes(`slug: \"${slug}\"`)) {
    throw new Error('A panel with this slug already exists in the parent list.')
  }

  const categoriesStart = content.indexOf('const categories = [')
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

  const insertion = `  {\n    title: '${title.replace(/'/g, "\\'")}',\n    slug: '${slug}',\n    image: '${image}',\n  },\n`

  return `${content.slice(0, bracketStart + 1)}\n${insertion}${content.slice(bracketStart + 1)}`
}

const removeCategoryBySlug = ({ content, slug }: { content: string; slug: string }) => {
  const categoriesStart = content.indexOf('const categories = [')
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

const removeDirectoryIfPresent = async (dirPath: string) => {
  await fs.rm(dirPath, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 150,
  })
}

const validateGeneratedPanelPageSource = (source: string) => {
  const requiredMarkers = [
    'export default function GalleryPage() {',
    'const handleImageClick = (image: string) => {',
    'const handleClose = () => {',
    '  useEffect(() => {\n    photos.forEach((photo) => {',
    'img.onload = () => {\n          setImageDimensions((prev) => ({',
    '  useEffect(() => {\n    if (!selectedImage || !isClient) return;',
    'window.addEventListener(\'resize\', handleResize);',
    '<Link href="/work/',
  ]

  for (const marker of requiredMarkers) {
    if (!source.includes(marker)) {
      return `Generated panel page is missing expected template marker: ${marker}`
    }
  }

  const firstUseEffectStart = source.indexOf('  useEffect(() => {\n    photos.forEach((photo) => {')
  const secondUseEffectStart = source.indexOf('  useEffect(() => {\n    if (!selectedImage || !isClient) return;')
  const clickHandlerStart = source.indexOf('const handleImageClick = (image: string) => {')

  if (!(clickHandlerStart >= 0 && firstUseEffectStart > clickHandlerStart && secondUseEffectStart > firstUseEffectStart)) {
    return 'Generated panel page failed structural ordering checks.'
  }

  const forbiddenMarkers = [
    "window.addEventListener('load', handleResize);",
    "window.removeEventListener('load', handleResize);",
    'const handleClose = () => {\n                let width = maxWidth;',
    'if (selectedImage && isClient) {\n            const handleResize = () => {',
  ]

  for (const marker of forbiddenMarkers) {
    if (source.includes(marker)) {
      return `Generated panel page matched a known-corrupted template pattern: ${marker}`
    }
  }

  return undefined
}

const createPanelPageSource = ({
  parentSlug,
  parentLabel,
  photos,
}: {
  parentSlug: string
  parentLabel: string
  photos: string[]
}) => {
  const photoRows = photos.map((photo) => `  { image: '${photo}' },`).join('\n')

  return `"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import StackGrid from "react-stack-grid";
import Link from 'next/link';

const photos = [
${photoRows}
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number; height: number } }>({});

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    photos.forEach((photo) => {
      if (!imageDimensions[photo.image]) {
        const img = new window.Image();
        img.src = photo.image;
        img.onload = () => {
          setImageDimensions((prev) => ({
            ...prev,
            [photo.image]: { width: img.naturalWidth, height: img.naturalHeight },
          }));
        };
      }
    });
  }, [imageDimensions]);

  useEffect(() => {
    if (!selectedImage || !isClient) return;

    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.9;

      const img = new window.Image();
      img.src = selectedImage;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let width = maxWidth;
        let height = maxWidth / aspectRatio;

        if (height > maxHeight) {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }

        setImageSize({ width, height });
      };
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedImage, isClient]);

  return (
    <div className="pt-4 mx-auto px-2 sm:px-2 lg:px-2 lg:pr-6">
      {isClient && (
        <StackGrid
          columnWidth={window.innerWidth <= 768 ? '100%' : window.innerWidth <= 1024 ? '33%' : '25%'}
          monitorImagesLoaded={true}
          gutterWidth={7}
          gutterHeight={7}
          appearDelay={0}
        >
          {photos.map((photo, index) => {
            const dims = imageDimensions[photo.image] || { width: 500, height: 500 };

            return (
              <div key={index}>
                <div className="relative">
                  <Image
                    src={photo.image}
                    className="w-full h-full cursor-pointer object-contain"
                    alt="Gallery photo"
                    width={dims.width}
                    height={dims.height}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    quality={75}
                    loading="lazy"
                    onClick={() => handleImageClick(photo.image)}
                  />
                </div>
              </div>
            );
          })}
        </StackGrid>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
          onClick={handleClose}
          tabIndex={-1}
          ref={(div) => {
            if (div) div.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleClose();
            } else if (e.key === 'ArrowLeft') {
              const currentIndex = photos.findIndex((photo) => photo.image === selectedImage);
              const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
              setSelectedImage(photos[prevIndex].image);
            } else if (e.key === 'ArrowRight') {
              const currentIndex = photos.findIndex((photo) => photo.image === selectedImage);
              const nextIndex = (currentIndex + 1) % photos.length;
              setSelectedImage(photos[nextIndex].image);
            }
          }}
        >
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={handleClose}>
            &times;
          </button>
          <button
            className="absolute left-4 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = photos.findIndex((photo) => photo.image === selectedImage);
              const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
              setSelectedImage(photos[prevIndex].image);
            }}
          >
            &lt;
          </button>
          <button
            className="absolute right-4 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = photos.findIndex((photo) => photo.image === selectedImage);
              const nextIndex = (currentIndex + 1) % photos.length;
              setSelectedImage(photos[nextIndex].image);
            }}
          >
            &gt;
          </button>
          <div
            className="relative"
            style={{ width: imageSize.width, height: imageSize.height }}
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              if (clickX < rect.width / 2) {
                const currentIndex = photos.findIndex((photo) => photo.image === selectedImage);
                const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
                setSelectedImage(photos[prevIndex].image);
              } else {
                const currentIndex = photos.findIndex((photo) => photo.image === selectedImage);
                const nextIndex = (currentIndex + 1) % photos.length;
                setSelectedImage(photos[nextIndex].image);
              }
            }}
          >
            <Image
              src={selectedImage}
              className="object-contain"
              alt="Full scale photo"
              fill
              sizes="90vw"
              quality={80}
              loading="eager"
            />
          </div>
        </div>
      )}

      <Link href="/work/${parentSlug}">
        <p className="md:pb-20 absolute md:text-5xl text-3xl md:right-40 pt-4 md:pt-20">${parentLabel} →</p>
      </Link>
      <p className="absolute md:text-xl text-base mt-20 font-thin md:left-8 md:mt-30 md:pb-10">
        contact@benpowerphotography.com
      </p>
    </div>
  );
}
`
}

export async function GET(request: Request) {
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
          return [panel.slug, children] as const
        }),
      ),
    )

    return NextResponse.json({ panels, childPanelsByParent, compressionActive })
  } catch {
    return NextResponse.json({ error: 'Unable to list parent panels.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ error: 'Admin uploader is local-dev only.' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const parentPanel = String(formData.get('parentPanel') ?? '').trim()
    const panelName = String(formData.get('panelName') ?? '').trim()

    const files = formData
      .getAll('photos')
      .filter((file): file is File => file instanceof File && file.size > 0)

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

    const panelPageDir = path.join(APP_WORK_DIR, parentPanel, newSlug)
    const panelPagePath = path.join(panelPageDir, 'page.tsx')

    try {
      await fs.access(panelPagePath)
      return NextResponse.json({ error: 'A panel with this name already exists.' }, { status: 409 })
    } catch {
      // Continue when panel page does not exist.
    }

    const targetImageDir = path.join(PUBLIC_IMAGES_DIR, parentPanel, newSlug)
    await fs.mkdir(targetImageDir, { recursive: true })

    const webPhotos: string[] = []
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

      const originalName = sanitizeFileName(file.name || `image-${index + 1}.jpg`)
      const outputName = `-${String(index + 1).padStart(2, '0')}.webp`
      const outputPath = path.join(targetImageDir, outputName)

      const buffer = Buffer.from(await file.arrayBuffer())
      const optimizedImage = await optimizeImage(buffer)
      if (!optimizedImage.optimized) {
        usedFallback = true
      }
      await fs.writeFile(outputPath, optimizedImage.buffer)

      webPhotos.push(`/images/${parentPanel}/${newSlug}/${outputName}`)
    }

    const panelPageSource = createPanelPageSource({
      parentSlug: parentPanel,
      parentLabel: selectedParent.label,
      photos: webPhotos,
    })
    const generationValidationError = validateGeneratedPanelPageSource(panelPageSource)
    if (generationValidationError) {
      return NextResponse.json(
        {
          error: `Panel generation safety check failed. ${generationValidationError}`,
        },
        { status: 500 },
      )
    }

    await fs.mkdir(panelPageDir, { recursive: true })
    await fs.writeFile(panelPagePath, panelPageSource, 'utf8')

    const warningMessages: string[] = []

    if (selectedParent.supportsCategories) {
      const parentPagePath = path.join(APP_WORK_DIR, parentPanel, 'page.tsx')
      const parentPageContent = await fs.readFile(parentPagePath, 'utf8')
      const updatedParentContent = insertCategory({
        content: parentPageContent,
        title: panelName,
        slug: newSlug,
        image: webPhotos[0],
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

export async function DELETE(request: Request) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ error: 'Admin uploader is local-dev only.' }, { status: 403 })
  }

  try {
    let payload: { parentPanel?: string; panelSlug?: string }

    try {
      payload = (await request.json()) as { parentPanel?: string; panelSlug?: string }
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

    let warning: string | undefined

    const parentPagePath = path.join(APP_WORK_DIR, parentPanel, 'page.tsx')
    const parentPageContent = await fs.readFile(parentPagePath, 'utf8')

    try {
      const updatedParentContent = removeCategoryBySlug({
        content: parentPageContent,
        slug: panelSlug,
      })
      await fs.writeFile(parentPagePath, updatedParentContent, 'utf8')
    } catch {
      warning = 'Panel folders were removed, but no matching parent slider entry was found to remove.'
    }

    const panelDir = path.join(APP_WORK_DIR, parentPanel, panelSlug)
    const imageDir = path.join(PUBLIC_IMAGES_DIR, parentPanel, panelSlug)

    try {
      await removeDirectoryIfPresent(panelDir)
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
