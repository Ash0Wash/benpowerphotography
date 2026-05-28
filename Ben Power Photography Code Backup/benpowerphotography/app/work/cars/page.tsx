"use client";

import Image from 'next/image'
import Link from 'next/link'

const photos = [
  '/images/cars/1.jpg',
  '/images/cars/10.jpg',
  '/images/cars/11.jpg',
  '/images/cars/12.jpg',
  '/images/cars/13.jpg',
  '/images/cars/14.jpg',
  '/images/cars/15.jpg',
  '/images/cars/16.jpg',
  '/images/cars/17.jpg',
  '/images/cars/18.jpg',
  '/images/cars/19.jpg',
  '/images/cars/2.jpg',
  '/images/cars/20.jpg',
  '/images/cars/3.jpg',
  '/images/cars/4.jpg',
  '/images/cars/5.jpg',
  '/images/cars/6.jpg',
  '/images/cars/7.jpg',
  '/images/cars/8.jpg',
  '/images/cars/9.jpg'
].filter(Boolean)

export default function GalleryPage() {
  return (
    <div className="px-4 py-6 md:px-6">
      <h1 className="pb-6 text-2xl font-light">Cars</h1>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <div key={photo} className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
            <Image
              src={photo}
              alt="Cars photo"
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
