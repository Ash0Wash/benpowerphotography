'use client';

import { useState } from 'react';
import ProtectedImage from '../components/ProtectedImage';

export default function PressClient({ initialImages }) {
  const [images, setImages] = useState(initialImages);
  const [dragMode, setDragMode] = useState('row');
  
  // A simple password or just local env check is done on the server,
  // but to avoid accidental clicks we can prompt the user to confirm.
  const handleDelete = async (imagePath) => {
    if (process.env.NODE_ENV !== 'development') {
      alert('Hiding images is only allowed in development mode.');
      return;
    }
    
    if (window.confirm('Are you sure you want to remove this image from the press page? It will not be deleted from disk.')) {
      try {
        const response = await fetch('/api/delete-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imagePath }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Remove from local state
          setImages(images.filter(img => img.src !== imagePath));
        } else {
          alert('Failed to delete image: ' + data.error);
        }
      } catch (err) {
        alert('Error deleting image: ' + err.message);
      }
    }
  };

  // Pre-calculate rows based on simulated dense packing (target 4 columns per row)
  const COLUMNS_PER_ROW = 4;
  const rows = [];
  images.forEach(img => {
    const span = img.width > img.height ? 2 : 1;
    let placed = false;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].capacity >= span) {
        rows[i].items.push(img);
        rows[i].capacity -= span;
        placed = true;
        break;
      }
    }
    if (!placed) {
      rows.push({
        id: img.src,
        items: [img],
        capacity: COLUMNS_PER_ROW - span
      });
    }
  });

  const handleDrop = async (e, targetType, targetValue) => {
    e.preventDefault();
    e.stopPropagation();
    if (process.env.NODE_ENV !== 'development') return;
    
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    const [sourceType, sourceValue] = data.split(':');
    
    if (sourceType !== targetType) return;
    if (sourceValue === targetValue.toString()) return;

    let newImages = [...images];

    if (sourceType === 'row') {
      const sourceRowIndex = parseInt(sourceValue, 10);
      const targetRowIndex = parseInt(targetValue, 10);
      
      const newRows = [...rows];
      const [draggedRow] = newRows.splice(sourceRowIndex, 1);
      newRows.splice(targetRowIndex, 0, draggedRow);
      
      newImages = newRows.flatMap(row => row.items);
    } else if (sourceType === 'img') {
      const sourceIndex = images.findIndex(img => img.src === sourceValue);
      const targetIndex = images.findIndex(img => img.src === targetValue);
      if (sourceIndex === -1 || targetIndex === -1) return;
      
      const [draggedItem] = newImages.splice(sourceIndex, 1);
      newImages.splice(targetIndex, 0, draggedItem);
    }

    setImages(newImages);

    try {
      await fetch('/api/reorder-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageOrder: newImages.map(img => img.src) })
      });
    } catch (err) {
      console.error('Error saving order', err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1600px' }}>
      <div className="section-header" style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <h1 style={{ fontSize: '2rem' }}>Press & Media</h1>
        <p style={{ color: 'var(--text-secondary, #666)', marginTop: '0.5rem' }}>
          Select imagery from concerts and portraits. 
          {process.env.NODE_ENV === 'development' && (
             <span style={{ display: 'block', color: 'red', marginTop: '0.5rem', fontWeight: 'bold' }}>
               DEV MODE: Drag images or rows to reorder, or click an image to remove it from this grid.
             </span>
          )}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <div style={{ background: 'var(--bg-secondary, #1a1a1a)', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px', border: '1px solid var(--border-color, #333)' }}>
              <button 
                onClick={() => setDragMode('individual')}
                style={{ padding: '8px 16px', background: dragMode === 'individual' ? '#333' : 'transparent', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: dragMode === 'individual' ? 'bold' : 'normal' }}
              >
                Individual Drag
              </button>
              <button 
                onClick={() => setDragMode('row')}
                style={{ padding: '8px 16px', background: dragMode === 'row' ? '#333' : 'transparent', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: dragMode === 'row' ? 'bold' : 'normal' }}
              >
                Row Drag
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .press-row-container {
          display: flex;
          align-items: stretch;
          margin-bottom: 1.5rem;
          gap: 1.5rem;
        }
        .press-drag-handle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          cursor: grab;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          transition: background 0.2s;
          color: rgba(255, 255, 255, 0.2);
        }
        .press-drag-handle:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }
        .press-drag-handle:active {
          cursor: grabbing;
        }
        .press-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          grid-auto-flow: dense;
          flex-grow: 1;
        }
        .press-item-vertical {
          grid-column: span 1;
        }
        .press-item-horizontal {
          grid-column: span 2;
        }
        @media (max-width: 1024px) {
          .press-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .press-grid {
            grid-template-columns: repeat(1, 1fr);
          }
          .press-item-horizontal {
            grid-column: span 1;
          }
          .press-drag-handle {
            display: none;
          }
        }
      `}</style>

      <div style={{ marginBottom: '6rem' }}>
        {rows.map((row, rowIndex) => (
          <div 
            key={row.id}
            className="press-row-container"
            onDragOver={(e) => {
              if (dragMode === 'row') e.preventDefault();
            }}
            onDrop={(e) => {
              if (dragMode === 'row') handleDrop(e, 'row', rowIndex);
            }}
          >
            {process.env.NODE_ENV === 'development' && dragMode === 'row' && (
              <div 
                className="press-drag-handle"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', `row:${rowIndex}`);
                }}
                title="Drag to reorder row"
              >
                ⋮⋮
              </div>
            )}
            
            <div className="press-grid">
              {row.items.map((img) => {
                const isHorizontal = img.width > img.height;
                const aspectRatio = img.width && img.height ? `${img.width} / ${img.height}` : 'auto';
                
                return (
                  <div 
                    key={img.src} 
                    className={isHorizontal ? 'press-item-horizontal' : 'press-item-vertical'}
                    onClick={() => handleDelete(img.src)}
                    draggable={process.env.NODE_ENV === 'development' && dragMode === 'individual'}
                    onDragStart={(e) => {
                      if (process.env.NODE_ENV === 'development' && dragMode === 'individual') {
                        e.dataTransfer.setData('text/plain', `img:${img.src}`);
                      }
                    }}
                    onDragOver={(e) => {
                      if (dragMode === 'individual') {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    onDrop={(e) => {
                      if (dragMode === 'individual') handleDrop(e, 'img', img.src);
                    }}
                    style={{ 
                      position: 'relative', 
                      aspectRatio, 
                      cursor: process.env.NODE_ENV === 'development' ? (dragMode === 'individual' ? 'grab' : 'pointer') : 'default',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      transition: 'opacity 0.2s',
                      backgroundColor: 'var(--bg-secondary, #111)',
                      width: '100%',
                      height: '100%'
                    }}
                    onMouseOver={(e) => {
                      if (process.env.NODE_ENV === 'development') e.currentTarget.style.opacity = '0.7';
                    }}
                    onMouseOut={(e) => {
                      if (process.env.NODE_ENV === 'development') e.currentTarget.style.opacity = '1';
                    }}
                    title={process.env.NODE_ENV === 'development' ? (dragMode === 'individual' ? 'Drag to reorder, click to remove' : 'Click to remove from grid') : ''}
                  >
                    <ProtectedImage 
                      src={img.src} 
                      alt="Press Image" 
                      fill 
                      sizes={isHorizontal ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
                      imgStyle={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} 
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          No images found.
        </div>
      )}
      
      {/* Contact Section */}
      <div style={{
        padding: '4rem 2rem',
        background: 'var(--bg-secondary, #1a1a1a)',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '4rem',
        border: '1px solid var(--border-color, #333)'
      }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Contact</h2>
        <p style={{ color: 'var(--text-secondary, #aaa)', marginBottom: '0.5rem' }}>For press inquiries, booking, and image licensing:</p>
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Ben Power</p>
        <a href="mailto:ben@benpowerphotography.com" style={{ 
          color: 'inherit', 
          textDecoration: 'underline', 
          textUnderlineOffset: '4px',
          display: 'inline-block',
          marginTop: '0.5rem'
        }}>
          ben@benpowerphotography.com
        </a>
      </div>
    </div>
  );
}
