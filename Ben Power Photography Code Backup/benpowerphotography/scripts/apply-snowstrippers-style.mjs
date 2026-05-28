import fs from 'fs'
import path from 'path'

const root = process.cwd()
const appWork = path.join(root, 'app', 'work')
const imgRoot = path.join(root, 'public', 'images')

const concertFolderBySlug = {
  snowstrippers: 'snowstrippers',
  party: 'party',
  ari: 'ari',
  bladee: 'bladee',
  malcolm: 'malcolm',
  cte: 'cte',
  wetleg: 'wetleg',
  skatingp: 'skatingp',
  hinds: 'hinds',
  xambassadors: 'xambassadors',
  panchiko: 'panchiko',
  aron: 'aron',
  turnover: 'turnover',
  underscores: 'underscores',
  hopetala: 'hopetala',
  slowtidebs: 'slowtidexfauxfur',
  tpbole: 'tpb',
  slowtidebbb: 'slowtide',
}

const portraitSlugs = ['animals', 'brooke', 'kendi', 'prom', 'slowtide']

function listImageWebPaths(folderPath, webPrefix) {
  if (!fs.existsSync(folderPath)) return []
  return fs
    .readdirSync(folderPath)
    .filter((name) => /\.(jpg|jpeg|png|webp|avif)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((name) => `${webPrefix}/${name}`)
}

function makePageSource({ photos, backHref, backLabel }) {
  const photosJson = JSON.stringify(photos.map((image) => ({ image })), null, 2)

  return `"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import StackGrid from "react-stack-grid";
import Link from 'next/link'

const photos = ${photosJson};

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number; height: number } }>({});

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
  }, [isClient]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    if (selectedImage && isClient) {
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
      window.addEventListener('load', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('load', handleResize);
      };
    }
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
                    quality={90}
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
          ref={(div) => { if (div) div.focus(); }}
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
              quality={85}
              loading="eager"
            />
          </div>
        </div>
      )}

      <Link href="${backHref}">
        <p className="md:pb-20 absolute md:text-5xl text-3xl md:right-40 pt-4 md:pt-20">${backLabel} →</p>
      </Link>
      <p className="absolute md:text-xl text-base mt-20 font-thin md:left-8 md:mt-30 md:pb-10">contact@benpowerphotography.com</p>
    </div>
  );
}
`
}

let count = 0

for (const [slug, folder] of Object.entries(concertFolderBySlug)) {
  const photos = listImageWebPaths(path.join(imgRoot, 'concerts', folder), `/images/concerts/${folder}`)
  const filePath = path.join(appWork, 'concerts', slug, 'page.tsx')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, makePageSource({ photos, backHref: '/work/concerts', backLabel: 'Concerts' }))
  count += 1
}

for (const slug of portraitSlugs) {
  const photos = listImageWebPaths(path.join(imgRoot, 'portraits', slug), `/images/portraits/${slug}`)
  const filePath = path.join(appWork, 'portraits', slug, 'page.tsx')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, makePageSource({ photos, backHref: '/work/portraits', backLabel: 'Portraits' }))
  count += 1
}

console.log(`updated-pages:${count}`)
