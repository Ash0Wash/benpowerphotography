"use client";

import Image from 'next/image'
import Link from 'next/link'

const photos = [
  '/images/street photography/-01.jpg',
  '/images/street photography/-02.jpg',
  '/images/street photography/-03.jpg',
  '/images/street photography/-04.jpg',
  '/images/street photography/-05.jpg',
  '/images/street photography/-06.jpg',
  '/images/street photography/-07.jpg',
  '/images/street photography/-08.jpg',
  '/images/street photography/-09.jpg',
  '/images/street photography/-10 (2).jpg',
  '/images/street photography/-10.jpg',
  '/images/street photography/-11 (2).jpg',
  '/images/street photography/-11.jpg',
  '/images/street photography/-12.jpg',
  '/images/street photography/-13.jpg',
  '/images/street photography/-29.jpg',
  '/images/street photography/-30.jpg',
  '/images/street photography/-31.jpg',
  '/images/street photography/-32.jpg',
  '/images/street photography/-33.jpg',
  '/images/street photography/-35.jpg',
  '/images/street photography/-36.jpg',
  '/images/street photography/-37.jpg',
  '/images/street photography/-38.jpg',
  '/images/street photography/-42.jpg',
  '/images/street photography/-43.jpg',
  '/images/street photography/-44.jpg',
  '/images/street photography/-45.jpg',
  '/images/street photography/-46.jpg',
  '/images/street photography/-47.jpg',
  '/images/street photography/-48.jpg',
  '/images/street photography/-49.jpg',
  '/images/street photography/-50.jpg',
  '/images/street photography/-51.jpg',
  '/images/street photography/-52.jpg',
  '/images/street photography/-53.jpg',
  '/images/street photography/-55.jpg',
  '/images/street photography/-56.jpg',
  '/images/street photography/-57.jpg',
  '/images/street photography/-58.jpg',
  '/images/street photography/-59.jpg',
  '/images/street photography/-61.jpg',
  '/images/street photography/-62.jpg',
  '/images/street photography/-63.jpg'
].filter(Boolean)

export default function GalleryPage() {
  return (
    <div className="px-4 py-6 md:px-6">
      <h1 className="pb-6 text-2xl font-light">Street Photography</h1>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <div key={photo} className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
            <Image
              src={photo}
              alt="Street Photography photo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              quality={85}
            />
          </div>
        ))}
      </div>
      <Link href="/work">
        <p className="pt-8 text-2xl font-light">Work →</p>
      </Link>
    </div>
  )
}
