"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import StackGrid from "react-stack-grid";
import Link from 'next/link'

const photos = [
  {
    "image": "/images/concerts/turnover/-01.jpg"
  },
  {
    "image": "/images/concerts/turnover/-02.jpg"
  },
  {
    "image": "/images/concerts/turnover/-03.jpg"
  },
  {
    "image": "/images/concerts/turnover/-04.jpg"
  },
  {
    "image": "/images/concerts/turnover/-05.jpg"
  },
  {
    "image": "/images/concerts/turnover/-06.jpg"
  },
  {
    "image": "/images/concerts/turnover/-07.jpg"
  },
  {
    "image": "/images/concerts/turnover/-08.jpg"
  },
  {
    "image": "/images/concerts/turnover/-09.jpg"
  },
  {
    "image": "/images/concerts/turnover/-10.jpg"
  },
  {
    "image": "/images/concerts/turnover/-11.jpg"
  },
  {
    "image": "/images/concerts/turnover/-12.jpg"
  },
  {
    "image": "/images/concerts/turnover/-13.jpg"
  },
  {
    "image": "/images/concerts/turnover/-14.jpg"
  },
  {
    "image": "/images/concerts/turnover/-15.jpg"
  },
  {
    "image": "/images/concerts/turnover/-16.jpg"
  },
  {
    "image": "/images/concerts/turnover/-17.jpg"
  },
  {
    "image": "/images/concerts/turnover/-18.jpg"
  },
  {
    "image": "/images/concerts/turnover/-19.jpg"
  },
  {
    "image": "/images/concerts/turnover/-20.jpg"
  },
  {
    "image": "/images/concerts/turnover/-21.jpg"
  },
  {
    "image": "/images/concerts/turnover/-22.jpg"
  },
  {
    "image": "/images/concerts/turnover/-23.jpg"
  },
  {
    "image": "/images/concerts/turnover/-24.jpg"
  }
];

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

      <Link href="/work/concerts">
        <p className="md:pb-20 absolute md:text-5xl text-3xl md:right-40 pt-4 md:pt-20">Concerts →</p>
      </Link>
      <p className="absolute md:text-xl text-base mt-20 font-thin md:left-8 md:mt-30 md:pb-10">contact@benpowerphotography.com</p>
    </div>
  );
}
