'use client';
import { useState } from 'react';
import ProtectedImage from './ProtectedImage';
import Lightbox from './Lightbox';
import Masonry from './Masonry';

export default function GalleryClient({ images, folderPath, title }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const formattedImages = images.map(img => {
    // Check if img is an object (new behavior) or string (old behavior fallback)
    const isObj = typeof img === 'object';
    return {
      src: isObj ? `${folderPath}/${img.src}` : `${folderPath}/${img}`,
      width: isObj ? img.width : 0,
      height: isObj ? img.height : 0,
      alt: `${title} - photo`
    };
  });

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  if (images.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>More photos coming soon...</p>;
  }

  return (
    <>
      <Masonry>
        {formattedImages.map((img, index) => {
          const aspectRatio = img.width && img.height ? `${img.width} / ${img.height}` : 'auto';
          return (
            <div key={index} onClick={() => openLightbox(index)} style={{ cursor: 'pointer', borderRadius: '4px', overflow: 'hidden', position: 'relative', aspectRatio, backgroundColor: 'var(--bg-secondary)' }}>
              <ProtectedImage 
                src={img.src} 
                alt={img.alt} 
                width={img.width} 
                height={img.height} 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
                priority={true}
                imgStyle={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} 
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            </div>
          );
        })}
      </Masonry>
      <Lightbox 
        images={formattedImages}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPrev={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : formattedImages.length - 1))}
        onNext={() => setCurrentIndex((prev) => (prev < formattedImages.length - 1 ? prev + 1 : 0))}
      />
    </>
  );
}
