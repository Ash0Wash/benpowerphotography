'use client';
import { useState, useRef, useEffect } from 'react';
import ProtectedImage from './ProtectedImage';
import Lightbox from './Lightbox';
import Masonry from './Masonry';

export default function GalleryClient({ images, folderPath, title }) {
  const [imageList, setImageList] = useState(images);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    setImageList(images);
  }, [images]);

  const formattedImages = imageList.map(img => {
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

  const handleDragStart = (e, index) => {
    if (process.env.NODE_ENV !== 'development') return;
    isDraggingRef.current = true;
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    if (process.env.NODE_ENV !== 'development') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e, index) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (process.env.NODE_ENV !== 'development') return;

    const sourceIndexStr = e.dataTransfer.getData('text/plain');
    const sourceIndex = parseInt(sourceIndexStr, 10);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);

    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const newImages = [...imageList];
    const [draggedItem] = newImages.splice(sourceIndex, 1);
    newImages.splice(targetIndex, 0, draggedItem);

    setImageList(newImages);

    try {
      setIsSaving(true);
      const rawOrder = newImages.map(img => (typeof img === 'object' ? img.src : img));
      await fetch('/api/reorder-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageOrder: rawOrder,
          folderPath
        })
      });
    } catch (err) {
      console.error('Error saving image order:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClick = (index) => {
    if (isDraggingRef.current) return;
    openLightbox(index);
  };

  if (imageList.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>More photos coming soon...</p>;
  }

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary, #888)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          userSelect: 'none'
        }}>
          <span style={{ color: '#ff4444', fontWeight: 'bold' }}>DEV MODE:</span>
          <span>Drag tiles to reorganize.</span>
          {isSaving && <span style={{ color: '#00d26a', fontWeight: 'bold' }}>Saving...</span>}
        </div>
      )}

      <Masonry>
        {formattedImages.map((img, index) => {
          const aspectRatio = img.width && img.height ? `${img.width} / ${img.height}` : 'auto';
          const isBeingDragged = draggedIndex === index;
          const isDropTarget = dragOverIndex === index;

          return (
            <div 
              key={img.src} 
              draggable={process.env.NODE_ENV === 'development'}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={(e) => handleDragLeave(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => handleClick(index)}
              style={{ 
                cursor: process.env.NODE_ENV === 'development' ? 'grab' : 'pointer', 
                borderRadius: '4px', 
                overflow: 'hidden', 
                position: 'relative', 
                aspectRatio, 
                backgroundColor: 'var(--bg-secondary)',
                opacity: isBeingDragged ? 0.35 : 1,
                outline: isDropTarget ? '3px dashed #fff' : 'none',
                outlineOffset: '-3px',
                transform: isDropTarget ? 'scale(1.02)' : 'none',
                transition: 'opacity 0.2s, outline 0.15s, transform 0.15s'
              }}
              title={process.env.NODE_ENV === 'development' ? 'Drag to reorganize, click to view' : undefined}
            >
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
