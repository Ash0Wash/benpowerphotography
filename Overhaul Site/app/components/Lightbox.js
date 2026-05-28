'use client';

import { useEffect } from 'react';
import ProtectedImage from './ProtectedImage';

export default function Lightbox({ images, currentIndex, isOpen, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div className={`lightbox-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
        &times;
      </button>
      
      <button 
        className="lightbox-nav lightbox-prev" 
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous image"
      >
        &#8592;
      </button>
      
      <div className="lightbox-image-wrapper" style={{ width: '90vw', height: '85vh' }} onClick={(e) => e.stopPropagation()}>
        <ProtectedImage 
          src={currentImage.src} 
          alt={currentImage.alt} 
          fill
          unoptimized
          imgStyle={{ objectFit: 'contain' }}
        />
      </div>
      
      <button 
        className="lightbox-nav lightbox-next" 
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next image"
      >
        &#8594;
      </button>
      
      <div className="lightbox-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
