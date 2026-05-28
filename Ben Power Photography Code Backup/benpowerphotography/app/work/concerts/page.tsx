"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

const categories = [
  {
    title: 'Bibi @ Sogang',
    slug: 'bibig',
    image: '/images/concerts/bibi-sogang/-09.webp',
  },

  {
    title: 'Yena @ Sogang',
    slug: 'yg',
    image: '/images/concerts/yena-sogang/-02.webp',
  },

  {
    title: 'Maggie Lindemann & Ayleen Valentine @ Music Box',
    slug: 'mna',
    image: '/images/concerts/maggie-lindemann-ayleen-valentine-music-box/-21.webp',
  },

  {
    title: 'Snow Strippers @ SOMA 2.15.26',
    slug: 'snowstrippers',
    image: '/images/concerts/snowstrippers/- (27).jpg',
  },
  {
    title: 'PartyOf2 @ The Echo 1.28.26',
    slug: 'party',
    image: '/images/concerts/party/- (8).jpg',
  },
  {
    title: 'Ari Abdul & Ella Boh @ Soma Sidestage 11.20.25',
    slug: 'ari',
    image: '/images/concerts/ari/- (5).jpg',
  },
  {
    title: 'Bladee & Ripsquadd @ Soma Mainstage 10.24.25',
    slug: 'bladee',
    image: '/images/concerts/bladee/- (9).jpg',
  },
  {
    title: 'Malcolm Todd and Syd Taylor @ USD 10.10.25',
    slug: 'malcolm',
    image: '/images/concerts/malcolm/- (5).jpg',
  },
  {
    title: 'Cage the Elephant @ Ohana 9.28.25',
    slug: 'cte',
    image: '/images/concerts/cte/-.jpg',
  },
  {
    title: 'Wetleg @ Ohana 9.28.25',
    slug: 'wetleg',
    image: '/images/concerts/wetleg/- (1).jpg',
  },
  {
    title: 'Skating Polly @ Ohana 9.28.25',
    slug: 'skatingp',
    image: '/images/concerts/skatingp/- (2).jpg',
  },
  {
    title: 'Hinds @ Ohana 9.26.25',
    slug: 'hinds',
    image: '/images/concerts/hinds/- (10).jpg',
  },
  {
    title: 'X Ambassadors @ HOB 9.3.25',
    slug: 'xambassadors',
    image: '/images/concerts/xambassadors/-03.jpg',
  },
  {
    title: 'Panchiko & untitled (halo) & kittycraft @ SOMA 6.13.25',
    slug: 'panchiko',
    image: '/images/concerts/panchiko/-04.jpg',
  },
  {
    title: 'aron! EP Release Show 6.4.25',
    slug: 'aron',
    image: '/images/concerts/aron/-15.jpg',
  },
  {
    title: 'Turnover @ SOMA 5.17.25',
    slug: 'turnover',
    image: '/images/concerts/turnover/-10.jpg',
  },
  {
    title: 'Underscores & Gabby Start 4.17.25',
    slug: 'underscores',
    image: '/images/concerts/underscores/h-04.jpg',
  },
  {
    title: 'Hope Tala & Alici 4.16.25',
    slug: 'hopetala',
    image: '/images/concerts/hopetala/h-12.jpg',
  },
  {
    title: 'Slowtide Backyard Show 4.11.25',
    slug: 'slowtidebs',
    image: '/images/concerts/slowtidexfauxfur/m-20.jpg',
  },
  {
    title: 'TPB Ole Music Fest 4.4.25',
    slug: 'tpbole',
    image: '/images/concerts/tpb/m-25.jpg',
  },
  {
    title: 'Slowtide Big Blue Bash 10.18.24',
    slug: 'slowtidebbb',
    image: '/images/concerts/slowtide/b3-12.jpg',
  },
]

type GalleryPhoto = {
  image: string
  width: number
  height: number
}

const fallbackPhotos: GalleryPhoto[] = [
  { image: '/images/concerts/xambassadors/-01.jpg', width: 1600, height: 1067 },
  { image: '/images/concerts/xambassadors/-02.jpg', width: 1600, height: 1067 },
  { image: '/images/concerts/xambassadors/-03.jpg', width: 1600, height: 1067 },
  { image: '/images/concerts/bladee/- (1).jpg', width: 1600, height: 1067 },
  { image: '/images/concerts/party/- (1).jpg', width: 1600, height: 1067 },
  { image: '/images/concerts/snowstrippers/- (1).jpg', width: 1600, height: 1067 },
  { image: '/images/concerts/hinds/- (1).jpg', width: 1600, height: 1067 },
  { image: '/images/concerts/wetleg/- (1).jpg', width: 1600, height: 1067 },
]

const shufflePhotos = <T,>(items: T[]) => {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

function LazyGalleryImage({
  photo,
  onClick,
}: {
  photo: GalleryPhoto
  onClick: () => void
}) {
  const [isNearView, setIsNearView] = useState(false)
  const containerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '450px 0px' },
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={onClick}
      className="group block w-full overflow-hidden"
      aria-label="Open concert photo"
    >
      <div className="relative w-full" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        {isNearView ? (
          <Image
            src={photo.image}
            alt="Concert photography"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            quality={90}
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-gradient-to-br from-neutral-200 via-white to-neutral-200" />
        )}
      </div>
    </button>
  )
}

export default function ConcertDir() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [isClient, setIsClient] = useState(false)
  const [showLeftEdgeBlur, setShowLeftEdgeBlur] = useState(false)
  const [showRightEdgeBlur, setShowRightEdgeBlur] = useState(true)
  const [isSliderDragging, setIsSliderDragging] = useState(false)
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(fallbackPhotos)
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartScrollLeftRef = useRef(0)
  const hasDraggedRef = useRef(false)

  useEffect(() => {
    setIsClient(true)
    setGalleryPhotos(shufflePhotos(fallbackPhotos))

    let isMounted = true

    const loadCatalog = async () => {
      try {
        const response = await fetch('/data/concert-photos.json')

        if (!response.ok) {
          return
        }

        const data = (await response.json()) as { photos?: GalleryPhoto[] }

        if (isMounted && Array.isArray(data.photos) && data.photos.length > 0) {
          setGalleryPhotos(shufflePhotos(data.photos))
        }
      } catch {
        // Fallback list remains in place if catalog load fails.
      }
    }

    void loadCatalog()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const slider = sliderRef.current

    if (!slider) return

    const handleSliderScroll = () => {
      setShowLeftEdgeBlur(slider.scrollLeft > 8)
      const remainingScroll = slider.scrollWidth - slider.clientWidth - slider.scrollLeft
      setShowRightEdgeBlur(remainingScroll > 1)
    }

    handleSliderScroll()
    slider.addEventListener('scroll', handleSliderScroll, { passive: true })

    return () => {
      slider.removeEventListener('scroll', handleSliderScroll)
    }
  }, [isClient])

  const handleImageClick = (image: string) => {
    setSelectedImage(image)
  }

  const handleClose = () => {
    setSelectedImage(null)
  }

  useEffect(() => {
    if (selectedImage && isClient) {
      const handleResize = () => {
        const maxWidth = window.innerWidth * 0.9
        const maxHeight = window.innerHeight * 0.9

        const img = new window.Image()
        img.src = selectedImage
        img.onload = () => {
          const aspectRatio = img.width / img.height

          let width = maxWidth
          let height = maxWidth / aspectRatio

          if (height > maxHeight) {
            height = maxHeight
            width = maxHeight * aspectRatio
          }

          setImageSize({ width, height })
        }
      }

      handleResize()
      window.addEventListener('resize', handleResize)
      window.addEventListener('load', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('load', handleResize)
      }
    }
  }, [selectedImage, isClient])

  const handleSliderPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return

    isDraggingRef.current = true
    setIsSliderDragging(true)
    hasDraggedRef.current = false
    dragStartXRef.current = event.clientX - sliderRef.current.getBoundingClientRect().left
    dragStartScrollLeftRef.current = sliderRef.current.scrollLeft
  }

  const handleSliderPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !sliderRef.current) return

    const currentX = event.clientX - sliderRef.current.getBoundingClientRect().left
    const distance = currentX - dragStartXRef.current

    if (!hasDraggedRef.current && Math.abs(distance) <= 8) {
      return
    }

    if (!hasDraggedRef.current && Math.abs(distance) > 8) {
      hasDraggedRef.current = true
    }

    event.preventDefault()

    sliderRef.current.scrollLeft = dragStartScrollLeftRef.current - distance
  }

  const stopSliderDrag = (event?: ReactPointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false
    setIsSliderDragging(false)
    hasDraggedRef.current = false
  }

  return (
    <div className="container pt-4 mx-auto">
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3 pb-4 sm:hidden">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/work/concerts/${category.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className={
                    category.slug === 'bibig'
                      ? 'object-cover object-top'
                      : category.slug === 'yg'
                        ? 'object-cover object-[center_35%]'
                        : 'object-cover'
                  }
                  sizes="50vw"
                  quality={60}
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-sm font-light leading-snug">{category.title}</p>
            </Link>
          ))}
        </div>

        <div className="relative hidden sm:block">
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-white via-white/70 to-transparent z-10 transition-opacity duration-200 ${showLeftEdgeBlur ? 'opacity-100' : 'opacity-0'}`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-white via-white/70 to-transparent z-10 transition-opacity duration-200 ${showRightEdgeBlur ? 'opacity-100' : 'opacity-0'}`}
          />
          <div
            ref={sliderRef}
            className={`flex gap-6 overflow-x-auto pb-4 pr-20 cursor-grab active:cursor-grabbing select-none touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isSliderDragging ? 'snap-none' : 'snap-x snap-mandatory scroll-smooth'}`}
            onPointerDown={handleSliderPointerDown}
            onPointerMove={handleSliderPointerMove}
            onPointerUp={stopSliderDrag}
            onPointerCancel={stopSliderDrag}
            onLostPointerCapture={stopSliderDrag}
          >
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/work/concerts/${category.slug}`}
                className="group flex-none w-[42vw] lg:w-[29%] snap-start"
                onDragStart={(event) => event.preventDefault()}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className={
                      category.slug === 'bibig'
                        ? 'object-cover object-top transition-transform duration-500 group-hover:scale-105'
                        : category.slug === 'yg'
                          ? 'object-cover object-[center_35%] transition-transform duration-500 group-hover:scale-105'
                          : 'object-cover transition-transform duration-500 group-hover:scale-105'
                    }
                    sizes="(max-width: 1024px) 42vw, 29vw"
                    quality={80}
                    loading="lazy"
                  />
                </div>
                <p className="mt-4 font-light">{category.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 px-4 sm:px-4 lg:px-4 lg:pr-6">
        {isClient && (
          <div className="columns-1 gap-0 md:columns-3 xl:columns-4" style={{ columnGap: '0.35rem' }}>
            {galleryPhotos.map((photo, index) => (
              <div key={`${photo.image}-${index}`} className="mb-1.5 break-inside-avoid">
                <LazyGalleryImage
                  photo={photo}
                  onClick={() => handleImageClick(photo.image)}
                />
              </div>
            ))}
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
            onClick={handleClose}
            tabIndex={-1}
            ref={(div) => {
              if (div) div.focus()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleClose()
              } else if (e.key === 'ArrowLeft') {
                const currentIndex = galleryPhotos.findIndex((photo) => photo.image === selectedImage)
                const prevIndex = (currentIndex - 1 + galleryPhotos.length) % galleryPhotos.length
                setSelectedImage(galleryPhotos[prevIndex].image)
              } else if (e.key === 'ArrowRight') {
                const currentIndex = galleryPhotos.findIndex((photo) => photo.image === selectedImage)
                const nextIndex = (currentIndex + 1) % galleryPhotos.length
                setSelectedImage(galleryPhotos[nextIndex].image)
              }
            }}
          >
            <button className="absolute top-4 right-4 text-white text-3xl" onClick={handleClose}>
              &times;
            </button>
            <button
              className="absolute left-4 text-white text-3xl"
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = galleryPhotos.findIndex((photo) => photo.image === selectedImage)
                const prevIndex = (currentIndex - 1 + galleryPhotos.length) % galleryPhotos.length
                setSelectedImage(galleryPhotos[prevIndex].image)
              }}
            >
              &lt;
            </button>
            <button
              className="absolute right-4 text-white text-3xl"
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = galleryPhotos.findIndex((photo) => photo.image === selectedImage)
                const nextIndex = (currentIndex + 1) % galleryPhotos.length
                setSelectedImage(galleryPhotos[nextIndex].image)
              }}
            >
              &gt;
            </button>
            <div
              className="relative"
              style={{ width: imageSize.width, height: imageSize.height }}
              onClick={(e) => {
                e.stopPropagation()
                const rect = e.currentTarget.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                if (clickX < rect.width / 2) {
                  const currentIndex = galleryPhotos.findIndex((photo) => photo.image === selectedImage)
                  const prevIndex = (currentIndex - 1 + galleryPhotos.length) % galleryPhotos.length
                  setSelectedImage(galleryPhotos[prevIndex].image)
                } else {
                  const currentIndex = galleryPhotos.findIndex((photo) => photo.image === selectedImage)
                  const nextIndex = (currentIndex + 1) % galleryPhotos.length
                  setSelectedImage(galleryPhotos[nextIndex].image)
                }
              }}
            >
              <Image
                src={selectedImage}
                className="object-contain"
                alt="Full scale photo"
                fill
                sizes="90vw"
                quality={85}
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>

      <p className="absolute mt-12 text-base font-thin pb-10 left-8">contact@benpowerphotography.com</p>
    </div>
  )
}
